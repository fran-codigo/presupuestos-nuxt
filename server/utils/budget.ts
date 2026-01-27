import { H3Event } from "h3";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { budgetsTable } from "../db/schema";

export const validateBudgetOwnership = async (event: H3Event) => {
  const id = getRouterParam(event, "id");
  const { user } = await requireUserSession(event);

  const budget = await db
    .select()
    .from(budgetsTable)
    .where(eq(budgetsTable.id, Number(id)));

  if (budget.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Presupuesto no encontrado",
    });
  }

  if (budget[0]!.userId !== user.id) {
    throw createError({ statusCode: 403, message: "Acceso denegado" });
  }

  return { budget: budget[0], user };
};
