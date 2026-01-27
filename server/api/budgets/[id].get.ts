import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");

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

  return { budget };
});
