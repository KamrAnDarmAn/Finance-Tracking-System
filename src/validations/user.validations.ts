import z from "zod";

export const profileSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.number().optional(),
});

export type ProfileTypes = z.infer<typeof profileSchema>;

export const profileUpdateSchema = z.object({
  input: profileSchema,
});

export const preferencesSchema = z.object({
  theme: z.string().optional(),
  language: z.string().optional(),
  receiveEmailNotification: z.boolean().optional(),
});

export const preferencesUpdateSchema = z.object({
  input: preferencesSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(5, { message: "Current password should be at least 5 characters." }),
  newPassword: z
    .string()
    .min(5, { message: "New password should be at least 5 characters." })
    .max(100, { message: "New password should be at most 100 characters." }),
});
