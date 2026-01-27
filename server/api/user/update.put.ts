import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";
import { updateProfileSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = updateProfileSchema.parse(body);

  const session = await requireUserSession(event);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validatedData.email));

  if (user.length > 0 && user[0]!.id !== session.user.id) {
    throw createError({
      statusCode: 409,
      statusMessage: "Conflict",
      message: "El correo ya está en uso, ingresa otro",
    });
  }

  await db
    .update(usersTable)
    .set({ name: validatedData.name, email: validatedData.email })
    .where(eq(usersTable.id, session.user.id));

  return { message: "Perfil actualizado correctamente" };
});
