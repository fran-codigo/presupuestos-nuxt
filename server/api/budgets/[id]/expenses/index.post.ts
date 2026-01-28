import { db } from "~~/server/db";
import { expensesTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedExpense = draftBudgetSchema.parse(body);
  const { budget } = await validateBudgetOwnership(event);

  await db.insert(expensesTable).values({
    name: validatedExpense.name,
    amount: String(validatedExpense.amount),
    budgetId: budget!.id,
  });

  return { message: "Gasto creado correctamente" };
});
