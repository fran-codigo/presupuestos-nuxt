import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { updateProfileSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readBody(event);
  const validatedData = updateProfileSchema.safeParse(body);

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

  if (user.length > 0 && user[0]!.id !== session.user.id) {
    throw createError({
      statusCode: 409,
      statusMessage: "Conflict",
      message: "El correo ya está en uso, ingresa otro",
    });
  }

  await db
    .update(usersTable)
    .set({ name: validatedData.data.name, email: validatedData.data.email })
    .where(eq(usersTable.id, session.user.id));

  return { message: "Perfil actualizado correctamente" };
});
