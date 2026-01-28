import { validateExpenseOwnership } from "~~/server/utils/expense";

export default eventHandler(async (event) => {
  const { expense } = await validateExpenseOwnership(event);

  return { expense };
});
