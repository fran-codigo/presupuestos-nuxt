import { and, eq } from 'drizzle-orm';
import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';
import { updateNoteSchema } from '~~/shared/schemas';

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'El ID de la nota es obligatorio',
    });
  }

  // Verificar que la nota existe y pertenece al usuario
  const note = await db
    .select()
    .from(notesTable)
    .where(
      and(
        eq(notesTable.id, parseInt(id)),
        eq(notesTable.userId, user.id)
      )
    )
    .then((rows) => rows[0]);

  if (!note) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Nota no encontrada',
    });
  }

  const validatedData = updateNoteSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Datos de nota inválidos',
      data: errors,
    });
  }

  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (validatedData.data.title !== undefined) {
    updateData.title = validatedData.data.title;
  }

  if (validatedData.data.description !== undefined) {
    updateData.description = validatedData.data.description;
  }

  if (validatedData.data.status !== undefined) {
    updateData.status = validatedData.data.status;
  }

  await db
    .update(notesTable)
    .set(updateData)
    .where(eq(notesTable.id, parseInt(id)));

  return {
    message: 'Nota actualizada correctamente',
  };
});
