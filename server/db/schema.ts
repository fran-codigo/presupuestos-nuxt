// import {
//   decimal,
//   int,
//   mysqlTable,
//   varchar,
//   boolean,
//   timestamp,
// } from "drizzle-orm/mysql-core";

import {
  decimal,
  integer,
  pgTable,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  token: varchar({ length: 6 }),
  confirmed: boolean().default(false).notNull(),
});

export const budgetsTable = pgTable('budgets', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  amount: decimal().notNull(),
});

export const expensesTable = pgTable('expenses', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  budgetId: integer()
    .notNull()
    .references(() => budgetsTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  amount: decimal().notNull(),
  date: timestamp().defaultNow().notNull(),
});
