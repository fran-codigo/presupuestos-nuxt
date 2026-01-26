import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { tokenSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = tokenSchema.parse(body.token);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.token, validatedData));

  if (user.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "Token no válido",
    });
  }

  return { message: "Token válido, asigna una nueva contraseña" };
});
