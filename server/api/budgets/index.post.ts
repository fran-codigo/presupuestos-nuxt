import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
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

  await db.insert(budgetsTable).values({
    name: validatedData.data.name,
    amount: String(validatedData.data.amount),
    userId: session.user.id,
  });

  return { message: "Presupuesto creado correctamente" };
});
