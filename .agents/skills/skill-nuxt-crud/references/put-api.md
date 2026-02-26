# PUT Pattern - Update Existing Records

## Basic Update

**File:** `server/api/[resource]/[id]/index.put.ts`

### Pattern

```typescript
import { eq, and } from "drizzle-orm";
import { db } from "~~/server/db";
import { itemsTable } from "~~/server/db/schema";
import { draftItemSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  // Verify ownership
  const item = await db
    .select()
    .from(itemsTable)
    .where(
      and(
        eq(itemsTable.id, parseInt(id!)),
        eq(itemsTable.userId, user.id)
      )
    )
    .then(rows => rows[0]);

  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Recurso no encontrado",
    });
  }

  // Validate request body
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

  // Update record
  await db
    .update(itemsTable)
    .set({
      name: validatedData.data.name,
      description: validatedData.data.description,
      value: String(validatedData.data.value),
    })
    .where(eq(itemsTable.id, item.id));

  return { message: "Recurso actualizado correctamente" };
});
```

### Key Points

- **Ownership validation**: Always verify user owns resource first
- **Body validation**: Reuse POST schema or create update-specific schema
- **Partial updates**: Only update provided fields (avoid resetting unmodified fields)
- **String conversion**: Convert to strings for decimal fields
- **Check before update**: Verify resource exists before attempting update

---

## Partial Update (PATCH-like Behavior)

### Pattern

```typescript
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  // Verify ownership
  const item = await db
    .select()
    .from(itemsTable)
    .where(
      and(
        eq(itemsTable.id, parseInt(id!)),
        eq(itemsTable.userId, user.id)
      )
    )
    .then(rows => rows[0]);

  if (!item) {
    throw createError({
      statusCode: 404,
      message: "Recurso no encontrado",
    });
  }

  // Build update object - only include provided fields
  const updateData: Record<string, any> = {};
  
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.value !== undefined) updateData.value = String(body.value);

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      message: "Debe proporcionar al menos un campo para actualizar",
    });
  }

  await db
    .update(itemsTable)
    .set(updateData)
    .where(eq(itemsTable.id, item.id));

  return { message: "Recurso actualizado correctamente" };
});
```

### Key Points

- **Optional fields**: Check `!== undefined` to allow null values
- **Empty check**: Prevent empty updates
- **Flexible updates**: User can update just one field if needed

---

## Update with Relationship Validation

### Complete Example

```typescript
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  // Verify ownership
  const item = await db
    .select()
    .from(itemsTable)
    .where(
      and(
        eq(itemsTable.id, parseInt(id!)),
        eq(itemsTable.userId, user.id)
      )
    )
    .then(rows => rows[0]);

  if (!item) {
    throw createError({
      statusCode: 404,
      message: "Recurso no encontrado",
    });
  }

  const validatedData = draftItemSchema.safeParse(body);

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      message: "Datos inválidos",
      data: validatedData.error.issues.map(e => e.message),
    });
  }

  // If changing parentId, validate new parent belongs to user
  if (body.categoryId && body.categoryId !== item.categoryId) {
    
    const category = await db
      .select()
      .from(categoriesTable)
      .where(
        and(
          eq(categoriesTable.id, body.categoryId),
          eq(categoriesTable.userId, user.id)
        )
      )
      .then(rows => rows[0]);

    if (!category) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "Categoría no encontrada",
      });
    }
  }

  await db
    .update(itemsTable)
    .set(validatedData.data)
    .where(eq(itemsTable.id, item.id));

  return { message: "Recurso actualizado correctamente" };
});
```

### Key Points

- **Validate new relationships**: If relationship ID changes, verify new one is valid
- **Check ownership**: New relationships must belong to same user
- **Prevent escalation**: User can't link to resources they don't own
