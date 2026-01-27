import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { loginSchema } from "#shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = loginSchema.parse(body);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validatedData.email));

  if (user.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Credenciales no válidas",
    });
  }

  if (!user[0]?.confirmed) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Cuenta no confirmada",
    });
  }

  const isPasswordValid = await verifyPassword(
    user[0].password,
    validatedData.password,
  );

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Credenciales no válidas",
    });
  }

  await setUserSession(event, {
    user: {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
    },
  });

  return { success: true };
});
