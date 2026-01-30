import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { expensesTable } from "~~/server/db/schema";
import { validateExpenseOwnership } from "~~/server/utils/expense";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { expense, budget } = await validateExpenseOwnership(event);
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Datos de gasto inválidos",
      data: errors,
    });
  }

  await db
    .update(expensesTable)
    .set({
      name: validatedData.data.name,
      amount: String(validatedData.data.amount),
    })
    .where(
      and(
        eq(expensesTable.id, Number(expense!.id)),
        eq(expensesTable.budgetId, budget!.id),
      ),
    );

  return { message: "Gasto actualizado correctamente" };
});
