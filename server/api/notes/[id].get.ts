import { and, eq } from 'drizzle-orm';
import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'El ID de la nota es obligatorio',
    });
  }

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

  return note;
});
