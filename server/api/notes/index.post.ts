import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';
import { validateBody } from '~~/server/utils/validator';
import { draftNoteSchema } from '~~/shared/schemas';

export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await validateBody(event, draftNoteSchema);

  await db
    .insert(notesTable)
    .values({
      userId: session.user.id,
      title: body.title,
      description: body.description || null,
      status: body.status,
    })
    .returning();

  return {
    message: 'Nota creada correctamente',
  };
});
