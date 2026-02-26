# Validation Patterns - Zod Schemas

## Schema Location

All schemas live in `shared/schemas/index.ts` and are imported by both frontend and backend.

---

## Basic Schema Pattern

### String Fields

```typescript
import { z } from 'zod';

export const draftItemSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
});
```

### Numeric Fields

```typescript
export const draftItemSchema = z.object({
  value: z
    .string()
    .refine(val => !isNaN(Number(val)), 'El valor debe ser numérico')
    .refine(val => Number(val) > 0, 'El valor debe ser mayor a 0'),
  quantity: z
    .number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0'),
});
```

---

## Common Validations

### Email Fields

```typescript
export const contactSchema = z.object({
  email: z
    .string()
    .email('El correo no es válido'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
});
```

### Enum Fields (Categories, Status, etc)

```typescript
export const itemSchema = z.object({
  status: z
    .enum(['active', 'paused', 'archived'], {
      errorMap: () => ({ message: 'Estado no válido' })
    }),
  type: z
    .enum(['personal', 'shared', 'team']),
});
```

### Date Fields

```typescript
export const dateRangeSchema = z.object({
  startDate: z.coerce.date('Fecha de inicio no válida'),
  endDate: z.coerce.date('Fecha final no válida'),
}).refine(
  data => data.startDate <= data.endDate,
  { message: 'La fecha de inicio no puede ser posterior a la final', path: ['endDate'] }
);
```

### URL Fields

```typescript
export const linkSchema = z.object({
  url: z
    .string()
    .url('URL no válida'),
  title: z.string().min(1),
});
```

---

## Type Inference & Export

Export inferred types from schemas:

```typescript
// Define schema
export const draftItemSchema = z.object({
  name: z.string().min(1),
  value: z.string(),
  description: z.string().optional(),
});

// Infer TypeScript type automatically
export type DraftItem = z.infer<typeof draftItemSchema>;

// Use in API files
import { draftItemSchema, type DraftItem } from "~~/shared/schemas";

const validatedData: DraftItem = draftItemSchema.parse(body);
```

---

## Error Handling in APIs

### Standard Error Response

```typescript
const validatedData = draftItemSchema.safeParse(body);

if (!validatedData.success) {
  // Extract user-friendly error messages
  const errors = validatedData.error.issues.map((error) => error.message);
  
  throw createError({
    statusCode: 400,
    statusMessage: "Bad Request",
    message: "Datos inválidos",
    data: errors,  // [ 'El nombre es requerido', 'El valor no es válido' ]
  });
}

const item = validatedData.data; // Now fully typed
```

### Field-Level Error Mapping

```typescript
if (!validatedData.success) {
  const fieldErrors = validatedData.error.issues.reduce((acc, issue) => {
    const fieldName = issue.path.join('.');
    acc[fieldName] = issue.message;
    return acc;
  }, {} as Record<string, string>);

  throw createError({
    statusCode: 400,
    statusMessage: "Bad Request",
    message: "Datos inválidos",
    data: fieldErrors, // { 'name': 'Required', 'value': 'Invalid' }
  });
}
```

**Error Object Example:**
```json
{
  "message": "Datos inválidos",
  "data": {
    "name": "El nombre es requerido",
    "value": "El valor debe ser mayor a 0"
  }
}
```

---

## Complex Schemas

### Conditional Validation

```typescript
export const itemSchema = z.object({
  type: z.enum(['simple', 'complex']),
  value: z.number(),
  complexity: z.number().optional(),
}).refine(
  (data) => {
    if (data.type === 'complex' && !data.complexity) {
      return false;
    }
    return true;
  },
  { message: 'Los ítems complejos requieren especificar complejidad', path: ['complexity'] }
);
```

### Array of Items

```typescript
export const bulkActionSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        value: z.string(),
      })
    )
    .min(1, 'Al menos un elemento es requerido')
    .max(100, 'Máximo 100 elementos permitidos'),
});
```

### Union Types

```typescript
export const filterSchema = z.object({
  period: z.union([
    z.literal('today'),
    z.literal('week'),
    z.literal('month'),
    z.literal('year'),
  ]),
});
```

---

## Frontend Usage

Use same schemas in frontend forms for consistency:

```typescript
// components/ItemForm.vue
import { draftItemSchema, type DraftItem } from "~~/shared/schemas";

const form = reactive<DraftItem>({
  name: '',
  value: '',
});

const errors = ref<Record<string, string>>({});

const handleSubmit = async () => {
  const result = draftItemSchema.safeParse(form);
  
  if (!result.success) {
    // Show field errors to user
    errors.value = result.error.issues.reduce((acc, issue) => {
      acc[issue.path.join('.')] = issue.message;
      return acc;
    }, {} as Record<string, string>);
    return;
  }
  
  // Submit validated data to API
  try {
    await $fetch('/api/items', {
      method: 'POST',
      body: result.data
    });
  } catch (err) {
    console.error('Error submitting:', err);
  }
};
```

**Template:**
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <input 
        v-model="form.name" 
        placeholder="Nombre del elemento"
      />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <input 
        v-model="form.value" 
        placeholder="Valor"
      />
      <span v-if="errors.value" class="error">{{ errors.value }}</span>
    </div>

    <button type="submit">Guardar</button>
  </form>
</template>
```

---

## Testing Schemas

Quick validation in code or console:

```typescript
// Valid data
const result1 = draftItemSchema.parse({
  name: 'Mi elemento',
  value: '100'
});
console.log(result1); // ✓ Returns parsed data

// Invalid data - throws error
try {
  draftItemSchema.parse({ name: '' });
} catch (e) {
  console.log('Error:', e);
}

// Safe parsing for optional validation
const result2 = draftItemSchema.safeParse(data);
if (result2.success) {
  console.log('Valid:', result2.data);
} else {
  console.log('Errors:', result2.error.issues);
}
```

---

## Best Practices

1. **Always use `safeParse()`** in APIs (instead of `parse()`) to avoid exceptions
2. **Use Spanish messages** for user-facing errors
3. **Export types** - Use `z.infer<>` to keep types in sync with validation
4. **Reuse schemas** - Define once, use in both frontend and backend
5. **Fail fast** - Validate before DB operations
6. **Clear messages** - Users should understand what's wrong
