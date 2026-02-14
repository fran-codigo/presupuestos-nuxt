import { H3Event } from 'h3';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notesTable } from '../db/schema';

export const validateNoteOwnership = async (event: H3Event) => {
  const id = getRouterParam(event, 'id');
  const { user } = await requireUserSession(event);

  const note = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, Number(id)));

  if (note.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Nota no encontrada',
    });
  }

  if (note[0]!.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Acceso denegado' });
  }

  return { note: note[0], user };
};
