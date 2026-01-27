import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { validateBudgetOwnership } from "~~/server/utils/budget";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.parse(body);

  const { budget } = await validateBudgetOwnership(event);

  await db
    .update(budgetsTable)
    .set({ name: validatedData.name, amount: String(validatedData.amount) })
    .where(eq(budgetsTable.id, budget!.id));

  return { message: "Presupuesto actualizado correctamente" };
});
