import { desc, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const budgets = await db
    .select()
    .from(budgetsTable)
    .where(eq(budgetsTable.userId, user.id))
    .orderBy(desc(budgetsTable.id));

  return budgets;
});
