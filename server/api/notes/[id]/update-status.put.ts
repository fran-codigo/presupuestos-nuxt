import { eq } from 'drizzle-orm';
import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';
import { validateNoteOwnership } from '~~/server/utils/note';
import { validateBody } from '~~/server/utils/validator';
import { updateNoteStatusSchema } from '~~/shared/schemas';

export default eventHandler(async (event) => {
  const { note } = await validateNoteOwnership(event);
  const body = await validateBody(event, updateNoteStatusSchema);

  await db
    .update(notesTable)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(notesTable.id, note!.id));

  return {
    message: 'Estado actualizado correctamente',
  };
});
