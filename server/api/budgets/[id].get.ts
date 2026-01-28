import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable, expensesTable } from "~~/server/db/schema";
import { validateBudgetOwnership } from "~~/server/utils/budget";

export default eventHandler(async (event) => {
  const { budget } = await validateBudgetOwnership(event);

  const results = await db
    .select()
    .from(budgetsTable)
    .leftJoin(expensesTable, eq(budgetsTable.id, expensesTable.budgetId))
    .where(eq(budgetsTable.id, budget!.id));

  const formattedBudget = {
    ...budget,
    expenses: results.map((r) => r.expenses).filter((e) => e !== null),
  };

  return { budget: formattedBudget };
});
