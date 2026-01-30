import { eq } from "drizzle-orm";
import { registerSchema } from "#shared/schemas";
import { generateToken } from "#shared/utils/generateToken";
import { db } from "../../db";
import { usersTable } from "~~/server/db/schema";
import { sendConfirmationEmail } from "~~/server/emails/auth";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = registerSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Datos de registro inválidos",
      data: errors,
    });
  }

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validatedData.data.email));

  if (existingUser.length > 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "El correo ya está registrado",
    });
  }

  const hashedPassword = await hashPassword(validatedData.data.password);
  const token = generateToken();

  const user = await db.insert(usersTable).values({
    email: validatedData.data.email,
    name: validatedData.data.name,
    password: hashedPassword,
    token: token,
  });

  await sendConfirmationEmail({
    name: validatedData.data.name,
    email: validatedData.data.email,
    token: token,
  });

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Error al registrar el usuario",
    });
  }

  return {
    message:
      "Cuenta creada correctamente, revise su correo para confirmar la cuenta",
  };
});
