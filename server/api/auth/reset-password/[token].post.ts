import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { ResetPasswordSchema, tokenSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const token = getRouterParam(event, "token");
  const validatedToken = tokenSchema.parse(token);

  const body = await readBody(event);
  const validatedData = ResetPasswordSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Datos inválidos",
      data: errors,
    });
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.token, validatedToken));

  if (user.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Token no válido",
    });
  }

  const hashedPassword = await hashPassword(validatedData.data.password);

  await db
    .update(usersTable)
    .set({ token: null, password: hashedPassword })
    .where(eq(usersTable.token, validatedToken));

  return { message: "La contraseña se ha restablecido correctamente" };
});
