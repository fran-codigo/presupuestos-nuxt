import { validateBudgetOwnership } from "~~/server/utils/budget";

export default eventHandler(async (event) => {

  const { budget } = await validateBudgetOwnership(event);

  return { budget };
});
