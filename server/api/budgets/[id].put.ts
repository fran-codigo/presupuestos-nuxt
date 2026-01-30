import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { validateBudgetOwnership } from "~~/server/utils/budget";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { budget } = await validateBudgetOwnership(event);
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Datos de presupuesto inválidos",
      data: errors,
    });
  }

  await db
    .update(budgetsTable)
    .set({
      name: validatedData.data.name,
      amount: String(validatedData.data.amount),
    })
    .where(eq(budgetsTable.id, budget!.id));

  return { message: "Presupuesto actualizado correctamente" };
});
