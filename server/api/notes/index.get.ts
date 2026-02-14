import { desc, eq } from 'drizzle-orm';
import { db } from '~~/server/db';
import { notesTable } from '~~/server/db/schema';

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.userId, user.id))
    .orderBy(desc(notesTable.createdAt));

  return notes;
});
