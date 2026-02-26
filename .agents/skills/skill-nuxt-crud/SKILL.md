---
name: skill-nuxt-crud
description: Skill for rapidly building Nuxt 4 CRUD APIs following the project's established patterns. Generates GET, POST, PUT, DELETE endpoints with Drizzle ORM, Zod validation, authentication, and error handling.
license: Complete terms in LICENSE.txt
---

# Nuxt CRUD API Skill

Rapidly generate production-ready CRUD APIs for Nuxt 4 projects following established patterns with Drizzle ORM, H3 handlers, Zod validation, and role-based access control.

## Quick Start: CRUD Pattern Overview

This project uses a file-per-HTTP-method pattern:
- `[resource].get.ts` - List all or get single item
- `[resource].post.ts` - Create new item
- `[resource]/[id].get.ts` - Get single item by ID
- `[resource]/[id].put.ts` - Update existing item
- `[resource]/[id].delete.ts` - Delete item

Each handler:
1. Validates session/authentication
2. Validates request body with Zod schema
3. Performs database operation with Drizzle ORM
4. Returns consistent response or error

## Core Workflow: Creating a CRUD API

### Step 1: Define Zod Schema
Place schema in `shared/schemas/index.ts`:
```typescript
import { z } from 'zod';

export const draftItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  value: z.string().refine(val => !isNaN(Number(val)), 'Value must be valid'),
});

export type DraftItem = z.infer<typeof draftItemSchema>;
```

### Step 2: Add Table to Schema
In `server/db/schema.ts`:
```typescript
export const itemsTable = pgTable('items', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 500 }),
  value: decimal().notNull(),
  createdAt: timestamp().defaultNow(),
});
```

### Step 3: Create API Files
Generate one file per HTTP method following patterns in reference docs.

## Reference Documentation

Choose the pattern that matches your use case:

- **[GET Pattern](references/get-api.md)** - Retrieve lists and single items with filtering
- **[POST Pattern](references/post-api.md)** - Create new records with validation
- **[PUT Pattern](references/put-api.md)** - Update existing records with ownership validation
- **[DELETE Pattern](references/delete-api.md)** - Remove records with cascading relationships
- **[Validation Patterns](references/validation-patterns.md)** - Zod schema design and error handling
- **[Error Handling](references/error-handling.md)** - Standardized error responses

## Common Patterns

### Authentication & Authorization

All endpoints require user session:
```typescript
const { user } = await requireUserSession(event);
```

For resource ownership validation, use utility functions:
```typescript
const { budget } = await validateBudgetOwnership(event);
```

### Database Operations

Always use Drizzle ORM query builder:
```typescript
// Select
const items = await db.select().from(table).where(eq(table.userId, user.id));

// Insert
await db.insert(table).values({ ...data, userId: user.id });

// Update
await db.update(table).set(updateData).where(eq(table.id, id));

// Delete
await db.delete(table).where(eq(table.id, id));
```

### Response Format

Successful responses:
```typescript
return { message: "Presupuesto creado correctamente", data: item };
```

Error handling:
```typescript
throw createError({
  statusCode: 400,
  statusMessage: "Bad Request",
  message: "User-friendly message",
  data: errors, // Optional: detailed errors
});
```

## Typical File Structure

```
server/api/
├── budgets/
│   ├── index.get.ts       (GET /api/budgets - list all)
│   ├── index.post.ts      (POST /api/budgets - create)
│   └── [id]/
│       ├── index.get.ts   (GET /api/budgets/[id] - get one)
│       ├── index.put.ts   (PUT /api/budgets/[id] - update)
│       └── index.delete.ts (DELETE /api/budgets/[id] - delete)
│       └── expenses/      (nested resources)
│           ├── index.post.ts
│           └── [expenseId].delete.ts
```

## Database Imports

Standard imports for all API files:
```typescript
import { eq, desc } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";
```

## Tips for Speed

1. **Start with GET** - List endpoint establishes data flow
2. **Validation first** - Define schemas before endpoints
3. **Copy & modify** - Existing endpoints in budgets/ are templates
4. **Test with curl/Postman** - Verify each method works before moving on
5. **Use nested resources** - For related data (expenses under budgets)

## When to Use This Skill

- Creating standard CRUD endpoints
- Building resource management APIs
- Implementing nested resource hierarchies
- Adding new data models to existing Nuxt project

## When NOT to Use This Skill

- Building streaming APIs or WebSocket handlers
- Creating file upload endpoints (different patterns)
- Authentication-specific endpoints (see skill-nuxt-auth-api)
- Complex aggregation queries (may need raw SQL)
