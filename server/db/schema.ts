import {
  int,
  mysqlTable,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  token: varchar({ length: 6 }),
  confirmed: boolean().default(false).notNull(),
});
