import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { updatePasswordSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = updatePasswordSchema.parse(body);

  const session = await requireUserSession(event);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id));

  const isPasswordCorrect = await verifyPassword(
    user[0]!.password,
    validatedData.current_password,
  );

  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "La contraseña actual es incorrecta",
    });
  }

  const hashedPassword = await hashPassword(validatedData.password);
  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, session.user.id));

  return { message: "Contraseña actualizada correctamente" };
});
