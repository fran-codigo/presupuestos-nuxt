import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");
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

  return { budget };
});
