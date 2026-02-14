import type { H3Event } from 'h3';
import type { z } from 'zod';

export const validateBody = async <T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
) => {
  const body = await readBody(event);
  const result = schema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Datos inválidos',
      data: errors,
    });
  }
  return result.data;
};
