import { and, eq } from 'drizzle-orm';
import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';
import { validateNoteOwnership } from '~~/server/utils/note';

export default eventHandler(async (event) => {
  const { note, user } = await validateNoteOwnership(event);

  await db
    .delete(notesTable)
    .where(
      and(
        eq(notesTable.id, Number(note!.id)),
        eq(notesTable.userId, user.id),
      ),
    );

  return {
    message: 'Nota eliminada correctamente',
  };
});
