import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';
import { draftNoteSchema } from '~~/shared/schemas';

export default eventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readBody(event);

  const validatedData = draftNoteSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Datos de nota inválidos',
      data: errors,
    });
  }

  await db
    .insert(notesTable)
    .values({
      userId: session.user.id,
      title: validatedData.data.title,
      description: validatedData.data.description || null,
      status: validatedData.data.status,
    });

  return {
    message: 'Nota creada correctamente',
  };
});
