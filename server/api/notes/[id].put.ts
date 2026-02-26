import { and, eq } from 'drizzle-orm';
import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';
import { validateNoteOwnership } from '~~/server/utils/note';
import { updateNoteSchema } from '~~/shared/schemas';

export default eventHandler(async (event) => {
  const { note, user } = await validateNoteOwnership(event);
  const body = await validateBody(event, updateNoteSchema);

  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (body.title !== undefined) {
    updateData.title = body.title;
  }

  if (body.description !== undefined) {
    updateData.description = body.description;
  }

  if (body.status !== undefined) {
    updateData.status = body.status;
  }

  await db
    .update(notesTable)
    .set(updateData)
    .where(eq(notesTable.id, note!.id));

  return {
    message: 'Nota actualizada correctamente',
  };
});
