# POST Pattern - Create New Records

## Basic Create (List Endpoint)

**File:** `server/api/[resource]/index.post.ts`

### Pattern

```typescript
import { db } from "~~/server/db";
import { itemsTable } from "~~/server/db/schema";
import { draftItemSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readBody(event);
  
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

  // Create record
  await db.insert(itemsTable).values({
    name: validatedData.data.name,
    description: validatedData.data.description,
    value: String(validatedData.data.value),
    userId: session.user.id,
  });

  return { message: "Recurso creado correctamente" };
});
```

### Key Points

- **Authentication**: Always validate session first with `requireUserSession()`
- **Body reading**: Use `await readBody(event)` to parse JSON
- **Validation**: Use Zod schema with `safeParse()` for error handling
- **Error messages**: Spanish user-friendly messages, with detailed errors in `data` field
- **User association**: Always add `userId: session.user.id` for user-scoped resources
- **String conversion**: Convert numbers to strings for decimal fields (Drizzle quirk)
- **Response**: Return confirmation message

---

## Nested Create

**File:** `server/api/[resource]/[id]/[nested]/index.post.ts`

### Pattern

```typescript
import { eq, and } from "drizzle-orm";
import { db } from "~~/server/db";
import { nestedItemsTable, itemsTable } from "~~/server/db/schema";
import { draftNestedSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const parentId = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  // Verify parent exists and belongs to user
  const parent = await db
    .select()
    .from(itemsTable)
    .where(
      and(
        eq(itemsTable.id, parseInt(parentId!)),
        eq(itemsTable.userId, user.id)
      )
    )
    .then(rows => rows[0]);

  if (!parent) {
    throw createError({
      statusCode: 404,
      message: "Parent resource not found",
    });
  }

  const validatedData = draftNestedSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Datos inválidos",
      data: errors,
    });
  }

  await db.insert(nestedItemsTable).values({
    name: validatedData.data.name,
    value: String(validatedData.data.value),
    parentId: parent.id,
  });

  return { message: "Elemento creado correctamente" };
});
```

### Key Points

- **Parent validation**: Verify parent exists and belongs to user
- **Child association**: Link to parent with `parentId: parent.id`
- **Security**: Can't create children for resources user doesn't own
- **Clear structure**: Always check ownership before creating relationships

---

## Create with Validation Example

### Complete Flow

```typescript
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readBody(event);
  
  // Step 1: Validate schema
  const validatedData = draftItemSchema.safeParse(body);
  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      message: "Validation failed",
      data: errors,
    });
  }

  // Step 2: Check for duplicates if needed
  const existing = await db
    .select()
    .from(itemsTable)
    .where(
      and(
        eq(itemsTable.userId, user.id),
        eq(itemsTable.name, validatedData.data.name)
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

  // Step 3: Create record
  const result = await db
    .insert(itemsTable)
    .values({
      ...validatedData.data,
      userId: user.id,
    })
    .returning();

  // Step 4: Return result
  return { 
    message: "Recurso creado correctamente",
    item: result[0]
  };
});
```

### Key Points

- **Validation first**: Always validate before DB operations
- **Duplicate check**: Prevent duplicates if business logic requires
- **Return created**: Optionally return the created record with `.returning()`
- **Status codes**: Use 409 for conflicts, 400 for validation errors
