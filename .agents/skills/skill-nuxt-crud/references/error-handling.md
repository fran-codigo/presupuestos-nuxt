# Error Handling Patterns

## Standard Error Format

All API errors follow this structure for consistency:

```typescript
throw createError({
  statusCode: 400,                      // HTTP status
  statusMessage: "Bad Request",         // HTTP status text
  message: "Mensaje amigable",          // User-facing message in Spanish
  data: errors,                         // Optional: detailed error info
});
```

---

## Common Error Scenarios

### Validation Errors (400)

```typescript
const validatedData = draftItemSchema.safeParse(body);

if (!validatedData.success) {
  const errors = validatedData.error.issues.map((error) => error.message);
  throw createError({
    statusCode: 400,
    statusMessage: "Bad Request",
    message: "Datos inválidos",
    data: errors,
  });
}
```

**Example Response:**
```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "message": "Datos inválidos",
  "data": [
    "El nombre es requerido",
    "El valor debe ser mayor a 0"
  ]
}
```

### Authentication Errors (401)

```typescript
// Missing session
try {
  const { user } = await requireUserSession(event);
} catch (error) {
  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
    message: "Debe iniciar sesión para acceder",
  });
}
```

### Authorization Errors (403)

```typescript
// User doesn't own resource
const item = await db
  .select()
  .from(itemsTable)
  .where(eq(itemsTable.id, parseInt(id!)));

if (!item || item.userId !== user.id) {
  throw createError({
    statusCode: 403,
    statusMessage: "Forbidden",
    message: "No tiene permiso para acceder a este recurso",
  });
}
```

### Not Found Errors (404)

```typescript
const item = await db
  .select()
  .from(itemsTable)
  .where(eq(itemsTable.id, parseInt(id!)))
  .then(rows => rows[0]);

if (!item) {
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
    message: "Recurso no encontrado",
  });
}
```

### Conflict Errors (409)

```typescript
// Duplicate resource
const existing = await db
  .select()
  .from(itemsTable)
  .where(
    and(
      eq(itemsTable.userId, user.id),
      eq(itemsTable.name, body.name)
    )
  )
  .then(rows => rows[0]);

if (existing) {
  throw createError({
    statusCode: 409,
    statusMessage: "Conflict",
    message: "Ya existe un recurso con este nombre",
  });
}
```

---

## Error Response Examples

### Multiple Validation Errors

**Request:**
```json
{
  "name": "",
  "value": "invalid"
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "Datos inválidos",
  "data": [
    "El nombre es requerido",
    "El valor debe ser numérico"
  ]
}
```

### Field-Level Errors

```typescript
if (!validatedData.success) {
  const fieldErrors = validatedData.error.issues.reduce((acc, issue) => {
    const field = issue.path.join('.');
    acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

  throw createError({
    statusCode: 400,
    statusMessage: "Bad Request",
    message: "Datos inválidos",
    data: fieldErrors,
  });
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "Datos inválidos",
  "data": {
    "name": "El nombre es requerido",
    "value": "El valor debe ser numérico"
  }
}
```

---

## HTTP Status Code Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 400 | Bad Request | Invalid data, validation failed |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (email, name, etc) |
| 422 | Unprocessable Entity | Semantic error |
| 500 | Server Error | Unexpected error |

---

## Error Handling in Frontend

### With useHandleErrors Composable

```typescript
// composables/useHandleErrors.ts
export const useHandleErrors = () => {
  const toast = useToast();

  const handleError = (err: any) => {
    if (err?.data?.message) {
      toast.error(err.data.message);
    } else if (err?.message) {
      toast.error(err.message);
    } else {
      toast.error('Ocurrió un error inesperado');
    }
  };

  return { handleError };
};

// Usage in component
const { handleError } = useHandleErrors();

try {
  await $fetch('/api/items', { method: 'POST', body: form });
} catch (err) {
  handleError(err);
}
```

### Displaying Field Errors

```typescript
const errors = ref<Record<string, string>>({});
const form = reactive({
  name: '',
  value: '',
});

const handleSubmit = async () => {
  errors.value = {}; // Clear previous errors
  
  try {
    await $fetch('/api/items', { 
      method: 'POST', 
      body: form 
    });
  } catch (err) {
    // Check if response has field-level errors
    if (err.data?.data && typeof err.data.data === 'object') {
      errors.value = err.data.data;
    }
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
        placeholder="Nombre"
      />
      <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
    </div>

    <div class="form-group">
      <input 
        v-model="form.value" 
        placeholder="Valor"
      />
      <p v-if="errors.value" class="error-text">{{ errors.value }}</p>
    </div>

    <button type="submit">Guardar</button>
  </form>
</template>

<style scoped>
.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
```

---

## Server-Side Logging

Log errors for debugging without exposing details to users:

```typescript
export default eventHandler(async (event) => {
  try {
    // handler logic
  } catch (error) {
    console.error('ERROR in DELETE /items/[id]:', {
      timestamp: new Date().toISOString(),
      path: event.path,
      method: event.method,
      message: error.message,
      stack: error.stack,
    });
    
    // Return generic message to user
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Ocurrió un error al procesar su solicitud",
    });
  }
});
```

---

## Testing with curl

### Test validation error
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"","value":"invalid"}'
```

### Test without authentication
```bash
curl -X GET http://localhost:3000/api/items
```

### Test not found
```bash
curl -X GET http://localhost:3000/api/items/99999
```

### Test successful request
```bash
curl -X GET http://localhost:3000/api/items \
  -H "Cookie: ..." # Add session cookie
```

---

## Error Handling Checklist

- [ ] All user inputs validated with Zod
- [ ] Ownership checked before operations
- [ ] Correct HTTP status codes used
- [ ] Error messages in Spanish
- [ ] Sensitive details not exposed
- [ ] Errors logged server-side
- [ ] Frontend handles error responses
- [ ] Field-level validation errors shown to user
- [ ] No generic "error occurred" messages
- [ ] Rate limiting on sensitive endpoints
