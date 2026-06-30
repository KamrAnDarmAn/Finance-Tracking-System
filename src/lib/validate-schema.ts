import { ZodError, ZodSchema } from "zod";

export const validateSchema = (
  schema: ZodSchema,
  input: unknown,
): { success: boolean; error: null | ZodError } => {
  const validate = schema.safeParse(input);
  if (!validate.success)
    return {
      success: false,
      error: validate.error,
    };
  return { success: true, error: null };
};
