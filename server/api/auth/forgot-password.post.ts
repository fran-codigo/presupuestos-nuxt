import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { sendPasswordResetToken } from "~~/server/emails/auth";
import { forgotPasswordSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = forgotPasswordSchema.parse(body);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validatedData.email));

  if (user.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Bad Request",
      message: "Usuario no encontrado",
    });
  }

  if (!user[0]?.confirmed) {
    throw createError({
      statusCode: 401,
      statusMessage: "Bad Request",
      message: "Cuenta no confirmada",
    });
  }

  const token = generateToken();
  await db
    .update(usersTable)
    .set({ token: token })
    .where(eq(usersTable.email, validatedData.email));

  await sendPasswordResetToken({
    name: user[0].name,
    email: user[0].email,
    token,
  });

  return {
    message:
      "Hemos enviado un correo con las instrucciones para reestablecer tu contraseña",
  };
});
