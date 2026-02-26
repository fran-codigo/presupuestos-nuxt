import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { ideasTable } from "~~/server/db/schema";
import { validateBody } from "~~/server/utils/validator";
import { draftIdeaSchema } from "~~/shared/schemas";

export default defineLazyEventHandler(async () => {
  return defineEventHandler(async (event) => {
    const session = await requireUserSession(event);

    const currentIdeas = await db
      .select()
      .from(ideasTable)
      .where(eq(ideasTable.userId, session.user.id));

    if (currentIdeas.length >= 3) {
      throw createError({
        statusCode: 403,
        statusMessage: "Has alcanzado el límite de 3 ideas",
      });
    }

    const body = await validateBody(event, draftIdeaSchema);

    const [newIdea] = await db
      .insert(ideasTable)
      .values({
        userId: session.user.id,
        title: body.title,
        content: body.content,
      })
      .returning();

    return {
      message: "Idea guardada correctamente",
      idea: newIdea,
    };
  });
});
