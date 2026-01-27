import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { validateBudgetOwnership } from "~~/server/utils/budget";

export default eventHandler(async (event) => {
  const { budget } = await validateBudgetOwnership(event);

  await db.delete(budgetsTable).where(eq(budgetsTable.id, budget!.id));

  return { message: "Presupuesto eliminado correctamente" };
});
