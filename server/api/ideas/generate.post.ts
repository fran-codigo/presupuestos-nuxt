import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { eq, count } from "drizzle-orm";
import { db } from "~~/server/db";
import { ideasTable } from "~~/server/db/schema";

export default defineLazyEventHandler(async () => {
  return defineEventHandler(async (event) => {
    const session = await requireUserSession(event);

    const currentIdeas = await db
      .select({ count: count() })
      .from(ideasTable)
      .where(eq(ideasTable.userId, session.user.id));

    if (currentIdeas[0].count >= 3) {
      throw createError({
        statusCode: 403,
        statusMessage: "Has alcanzado el límite de 3 ideas",
      });
    }

    const body = await readBody(event);

    if (!body.idea) {
      throw createError({
        statusCode: 400,
        statusMessage: "Idea es obligatoria",
      });
    }

    try {
      const { text } = await generateText({
        model: groq("openai/gpt-oss-20b"),
        maxOutputTokens: 2000,
        prompt: `Eres un experto en desarrollo de software. Estructura la siguiente idea para un MVP (Producto Mínimo Viable).

Idea: ${body.idea}

Proporciona:
1. Nombre del proyecto (corto y descriptivo)
2. Descripción breve (2-3 oraciones)
3. Funcionalidades principales (máximo 5)
4. Stack tecnológico recomendado (justificado)
5. Pasos iniciales para empezar (3-5 pasos)

Sé conciso pero completo.`,
      });

      return {
        idea: text,
        title:
          body.idea.substring(0, 50) +
          (body.idea.length > 50 ? "..." : ""),
      };
    } catch (error) {
      console.log(error);
      throw createError({
        statusCode: 500,
        statusMessage: "Error al generar la idea",
      });
    }
  });
});
