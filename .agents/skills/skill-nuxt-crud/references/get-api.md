# GET Pattern - List and Single Item Retrieval

## List All Items

**File:** `server/api/[resource]/index.get.ts`

### Pattern

```typescript
import { desc, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { itemsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const items = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.userId, user.id))
    .orderBy(desc(itemsTable.id)); // Most recent first

  return items;
});
```

### Key Points

- **Authentication**: Always start with `requireUserSession(event)` to get user scope
- **Filtering**: Use `where(eq(table.userId, user.id))` for user-scoped data
- **Ordering**: Use `orderBy(desc(table.id))` for reverse chronological order
- **Return**: Return array directly - Nuxt automatically serializes

### With Filtering

```typescript
import { and, eq, ilike } from "drizzle-orm";

const query = getQuery(event);

const items = await db
  .select()
  .from(itemsTable)
  .where(
    and(
      eq(itemsTable.userId, user.id),
      query.search ? ilike(itemsTable.name, `%${query.search}%`) : undefined
    )
  )
  .orderBy(desc(itemsTable.id));

return items;
```

---

## Get Single Item by ID

**File:** `server/api/[resource]/[id]/index.get.ts`

### Pattern

```typescript
import { eq, and } from "drizzle-orm";
import { db } from "~~/server/db";
import { itemsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, 'id');

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

  return item;
});
```

### Key Points

- **Parameter extraction**: Use `getRouterParam(event, 'paramName')`
- **Ownership validation**: Always verify user owns the resource
- **404 handling**: Throw error if item not found or doesn't belong to user
- **Combination check**: Use `and()` to ensure both conditions are true

---

## Nested List Items

**File:** `server/api/[resource]/[id]/[nested]/index.get.ts`

### Pattern

```typescript
import { eq, desc } from "drizzle-orm";
import { db } from "~~/server/db";
import { nestedItemsTable, itemsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const parentId = getRouterParam(event, 'id');

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

  // Get nested items
  const nested = await db
    .select()
    .from(nestedItemsTable)
    .where(eq(nestedItemsTable.parentId, parent.id))
    .orderBy(desc(nestedItemsTable.id));

  return nested;
});
```

### Key Points

- **Parent validation**: Verify parent resource belongs to user
- **Cascading access**: Child items inherit parent's access rules
- **Clear structure**: Parent check happens before child query
