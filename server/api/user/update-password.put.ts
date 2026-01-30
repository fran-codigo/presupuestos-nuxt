import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { updatePasswordSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readBody(event);
  const validatedData = updatePasswordSchema.safeParse(body);

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
    .where(eq(usersTable.id, session.user.id));

  const isPasswordCorrect = await verifyPassword(
    user[0]!.password,
    validatedData.data.current_password,
  );

  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "La contraseña actual es incorrecta",
    });
  }

  const hashedPassword = await hashPassword(validatedData.data.password);
  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, session.user.id));

  return { message: "Contraseña actualizada correctamente" };
});
