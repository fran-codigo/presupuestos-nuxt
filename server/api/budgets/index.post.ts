import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.parse(body);
  const session = await requireUserSession(event);

  await db.insert(budgetsTable).values({
    name: validatedData.name,
    amount: String(validatedData.amount),
    userId: session.user.id,
  });

  return { message: "Presupuesto creado correctamente" };
});
