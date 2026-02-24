import { generateText } from "ai";

import { groq } from "@ai-sdk/groq";

export default defineLazyEventHandler(async () => {
  return defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
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
        maxOutputTokens: 1600,
        prompt:
          "Estructura la idea para un proyecto de programación con aplicación web, recomienda todo lo necesario para desarrollarlo.Recomienda el mejor stack para el desarrollo.Empieza recomendando solo los aspectos principales para crear un MVP y que al mismo tiempo permita escalar. La idea es: " +
          body.idea,
      });

      return { idea: text };
    } catch (error) {
      console.log(error);
      throw createError({
        statusCode: 500,
        statusMessage: "Error al generar la idea",
      });
    }
  });
});
