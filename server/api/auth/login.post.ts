import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { loginSchema } from "#shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = loginSchema.parse(body);

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validatedData.email));

  if (existingUser.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: "Credenciales no válidas 1",
    });
  }

  if (!existingUser[0]?.confirmed) {
    throw createError({
      statusCode: 401,
      statusMessage: "Cuenta no confirmada",
    });
  }

  const isPasswordValid = await verifyPassword(
    existingUser[0].password,
    validatedData.password,
  );

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Credenciales no válidas 2",
    });
  }

  await setUserSession(event, {
    id: existingUser[0].id,
    name: existingUser[0].name,
    email: existingUser[0].email,
  });

  return { success: true };
});
