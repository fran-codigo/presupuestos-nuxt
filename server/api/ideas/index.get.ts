import { desc, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { ideasTable } from "~~/server/db/schema";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const ideas = await db
    .select()
    .from(ideasTable)
    .where(eq(ideasTable.userId, user.id))
    .orderBy(desc(ideasTable.createdAt));

  return {
    ideas,
    count: ideas.length,
  };
});
