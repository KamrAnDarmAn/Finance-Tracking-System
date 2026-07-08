import z from "zod";

export const idSchema = z.object({
  id: z.uuid({ message: "A valid id is required." }),
});

export const accountTypeCreateSchema = z.object({
  input: z.object({
    name: z.string().min(1, { message: "Account type name is required." }),
    description: z.string().min(1, { message: "Description is required." }),
  }),
});

export const accountTypeUpdateSchema = z.object({
  id: z.uuid({ message: "A valid account type id is required." }),
  input: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
  }),
});

export const institutionCreateSchema = z.object({
  input: z.object({
    name: z.string().min(1, { message: "Institution name is required." }),
    website: z.string().optional(),
    supportPhone: z.string().optional(),
  }),
});

export const institutionUpdateSchema = z.object({
  id: z.uuid({ message: "A valid institution id is required." }),
  input: z.object({
    name: z.string().min(1).optional(),
    website: z.string().optional(),
    supportPhone: z.string().optional(),
  }),
});

export const currencyCreateSchema = z.object({
  input: z.object({
    name: z.string().min(1, { message: "Currency name is required." }),
    code: z
      .string()
      .min(3)
      .max(3, { message: "Currency code must be 3 characters." })
      .transform((value) => value.toUpperCase()),
    symbol: z.string().min(1, { message: "Currency symbol is required." }),
  }),
});

export const currencyUpdateSchema = z.object({
  id: z.uuid({ message: "A valid currency id is required." }),
  input: z.object({
    name: z.string().min(1).optional(),
    code: z
      .string()
      .min(3)
      .max(3)
      .transform((value) => value.toUpperCase())
      .optional(),
    symbol: z.string().min(1).optional(),
  }),
});
