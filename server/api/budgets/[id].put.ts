import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.parse(body);
  const { user } = await requireUserSession(event);

  const budget = await db
    .select()
    .from(budgetsTable)
    .where(eq(budgetsTable.id, Number(id)));

  if (budget.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Presupuesto no encontrado",
    });
  }

  const budgetIsOwnedByUser = budget.some((b) => b.userId === user.id);

  if (!budgetIsOwnedByUser) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "Presupuesto no encontrado",
    });
  }

  await db
    .update(budgetsTable)
    .set({ name: validatedData.name, amount: String(validatedData.amount) })
    .where(eq(budgetsTable.id, Number(id)));

  return { message: "Presupuesto actualizado correctamente" };
});
