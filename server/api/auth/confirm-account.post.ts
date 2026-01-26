import { tokenSchema } from "~~/shared/schemas";
import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { usersTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {

const {token } = await readBody(event);

  const validatedData = tokenSchema.parse(token);

  const user = await db.select()
    .from(usersTable)
    .where(
      eq(usersTable.token, validatedData)
    );

    if (user.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Token no válido'
        })
    }

    await db.update(usersTable)
      .set({ confirmed: true, token: null })
      .where(eq(usersTable.token, validatedData));

    return {message: "Cuenta confirmada correctamente" };
    
})