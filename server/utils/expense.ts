import { H3Event } from "h3";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { expensesTable } from "../db/schema";

export const validateExpenseOwnership = async (event: H3Event) => {
  const { budget } = await validateBudgetOwnership(event);
  const expenseId = getRouterParam(event, "expenseId");

  const expense = await db
    .select()
    .from(expensesTable)
    .where(
      and(
        eq(expensesTable.id, Number(expenseId)),
        eq(expensesTable.budgetId, budget!.id),
      ),
    );

  if (expense.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Gasto no encontrado",
    });
  }

    return { expense: expense[0], budget };
};
