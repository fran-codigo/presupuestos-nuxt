import { tokenSchema } from "~~/shared/schemas";
import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { token } = await readBody(event);
  const validatedData = tokenSchema.safeParse(token);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Token inválido",
      data: errors,
    });
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.token, validatedData.data));

  if (user.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Token no válido",
    });
  }

  await db
    .update(usersTable)
    .set({ confirmed: true, token: null })
    .where(eq(usersTable.token, validatedData.data));

  return { message: "Cuenta confirmada correctamente" };
});
