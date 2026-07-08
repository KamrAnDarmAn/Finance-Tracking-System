import z from "zod";

export const profileSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.number().optional()
})

export type ProfileTypes = z.infer<typeof profileSchema>;

