import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { expensesTable } from "~~/server/db/schema";
import { validateExpenseOwnership } from "~~/server/utils/expense";

export default eventHandler(async (event) => {
  const { expense, budget } = await validateExpenseOwnership(event);

  await db
    .delete(expensesTable)
    .where(
      and(
        eq(expensesTable.id, Number(expense!.id)),
        eq(expensesTable.budgetId, budget!.id),
      ),
    );

  return { message: "Gasto eliminado correctamente" };
});
