import z from "zod";

const accountInputSchema = z.object({
  name: z.string().min(1, { message: "Account name is required." }),
  balance: z.number().optional(),
  supportPhone: z.string().optional(),
  isActive: z.boolean().optional(),
  accountTypeId: z.uuid({ message: "A valid account type is required." }),
  institutionId: z.uuid().optional(),
  currencyId: z.uuid({ message: "A valid currency is required." }),
});

export const accountCreateSchema = z.object({
  input: accountInputSchema,
});

export const accountUpdateSchema = z.object({
  id: z.uuid({ message: "A valid account id is required." }),
  input: z.object({
    name: z.string().min(1).optional(),
    balance: z.number().optional(),
    supportPhone: z.string().optional(),
    isActive: z.boolean().optional(),
    accountTypeId: z.uuid().optional(),
    institutionId: z.uuid().nullable().optional(),
    currencyId: z.uuid().optional(),
  }),
});

export const accountIdSchema = z.object({
  id: z.uuid({ message: "A valid account id is required." }),
});
