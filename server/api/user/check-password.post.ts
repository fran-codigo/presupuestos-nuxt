import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { passwordValidationSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const { password } = await readBody(event);
  const validatedData = passwordValidationSchema.parse(password);
  const session = await requireUserSession(event);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id));

  const isPasswordCorrect = await verifyPassword(
    user[0]!.password,
    validatedData,
  );

  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Contraseña incorrecta",
    });
  }

  return { success: true };
});
