import { db } from "~~/server/db";
import { expensesTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { budget } = await validateBudgetOwnership(event);
  const body = await readBody(event);
  const validatedExpense = draftBudgetSchema.safeParse(body);

  if (!validatedExpense.success) {
    const errors = validatedExpense.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Datos de gasto inválidos",
      data: errors,
    });
  }

  await db.insert(expensesTable).values({
    name: validatedExpense.data.name,
    amount: String(validatedExpense.data.amount),
    budgetId: budget!.id,
  });

  return { message: "Gasto creado correctamente" };
});
