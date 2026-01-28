import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { expensesTable } from "~~/server/db/schema";
import { validateExpenseOwnership } from "~~/server/utils/expense";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { expense, budget } = await validateExpenseOwnership(event);
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.parse(body);

  await db
    .update(expensesTable)
    .set({
      name: validatedData.name,
      amount: String(validatedData.amount),
    })
    .where(
      and(
        eq(expensesTable.id, Number(expense!.id)),
        eq(expensesTable.budgetId, budget!.id),
      ),
    );

  return { message: "Gasto actualizado correctamente" };
});
