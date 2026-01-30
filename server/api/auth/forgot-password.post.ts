import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { sendPasswordResetToken } from "~~/server/emails/auth";
import { forgotPasswordSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = forgotPasswordSchema.safeParse(body);

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
    .where(eq(usersTable.email, validatedData.data.email));

  if (user.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Usuario no encontrado",
    });
  }

  if (!user[0]?.confirmed) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Cuenta no confirmada",
    });
  }

  const token = generateToken();
  await db
    .update(usersTable)
    .set({ token: token })
    .where(eq(usersTable.email, validatedData.data.email));

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
