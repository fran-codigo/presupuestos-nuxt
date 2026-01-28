import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { expensesTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { budget } = await validateBudgetOwnership(event);
  const expenseId = getRouterParam(event, "expenseId");
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.parse(body);

  const expense = await db
    .select()
    .from(expensesTable)
    .where(
      and(
        eq(expensesTable.id, Number(expenseId)),
        eq(expensesTable.budgetId, budget!.id),
      ),
    );

  if (expense.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Gasto no encontrado",
    });
  }

  await db
    .update(expensesTable)
    .set({
      name: validatedData.name,
      amount: String(validatedData.amount),
    })
    .where(
      and(
        eq(expensesTable.id, Number(expenseId)),
        eq(expensesTable.budgetId, budget!.id),
      ),
    );

  return { message: "Gasto actualizado correctamente" };
});
