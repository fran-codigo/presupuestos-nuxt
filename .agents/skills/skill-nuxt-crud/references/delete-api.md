# DELETE Pattern - Remove Records

## Basic Delete

**File:** `server/api/[resource]/[id]/index.delete.ts`

### Pattern

```typescript
import { eq, and } from "drizzle-orm";
import { db } from "~~/server/db";
import { itemsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, 'id');

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

  // Delete
  await db.delete(itemsTable).where(eq(itemsTable.id, item.id));

  return { message: "Recurso eliminado correctamente" };
});
```

### Key Points

- **Ownership validation**: Always verify user owns resource first
- **Cascading deletes**: Database schema handles cascades (onDelete: 'cascade')
- **Success message**: Return confirmation message in Spanish
- **404 first**: Check ownership before attempting delete

---

## Nested Delete

**File:** `server/api/[resource]/[id]/[nested]/[nestedId]/index.delete.ts`

### Pattern

```typescript
import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { nestedItemsTable, itemsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const parentId = getRouterParam(event, 'id');
  const childId = getRouterParam(event, 'nestedId');

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
      message: "Recurso padre no encontrado",
    });
  }

  // Verify nested item belongs to parent
  const nestedItem = await db
    .select()
    .from(nestedItemsTable)
    .where(
      and(
        eq(nestedItemsTable.id, parseInt(childId!)),
        eq(nestedItemsTable.parentId, parent.id)
      )
    )
    .then(rows => rows[0]);

  if (!nestedItem) {
    throw createError({
      statusCode: 404,
      message: "Elemento no encontrado",
    });
  }

  // Delete nested item
  await db
    .delete(nestedItemsTable)
    .where(eq(nestedItemsTable.id, nestedItem.id));

  return { message: "Elemento eliminado correctamente" };
});
```

### Key Points

- **Parent validation**: Validate parent ownership first
- **Child verification**: Verify child belongs to parent (URL could be forged)
- **Double-check**: Prevent deletion across boundaries
- **Clear hierarchy**: Parent check → Child check → Delete

---

## Delete with Cascade Logging

### Pattern (if you need to track cascaded deletes)

```typescript
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, 'id');

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

  // Check if cascade would delete important data
  const relatedCount = await db
    .select({ count: sql`count(*)` })
    .from(nestedItemsTable)
    .where(eq(nestedItemsTable.parentId, item.id))
    .then(rows => rows[0]?.count || 0);

  // Delete
  await db.delete(itemsTable).where(eq(itemsTable.id, item.id));

  // Return count info
  return { 
    message: "Recurso y elementos relacionados eliminados",
    deletedCount: Number(relatedCount) + 1 // +1 for parent
  };
});
```

### Key Points

- **Optional logging**: Count cascade impacts for user info
- **Transparent deletion**: Show how many related items were deleted
- **Database handles cascade**: Actual deletion is still DB's job

---

## Soft Delete (Alternative Pattern)

### When to use: If you need to preserve data for history/audit

```typescript
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, 'id');

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

  // Mark as deleted instead of removing
  await db
    .update(itemsTable)
    .set({ 
      deletedAt: new Date(),
      deletedBy: user.id,
    })
    .where(eq(itemsTable.id, item.id));

  return { message: "Recurso eliminado correctamente" };
});
```

### Key Points

- **Preserve data**: Records remain in DB but marked deleted
- **Audit trail**: Track who deleted and when
- **Recoverable**: Can be restored if needed
- **Use case**: Financial records, important data
