import z from "zod";

export const signupSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(5, { message: "Password should at least 5 charecters." })
    .max(100, { message: "Password should at most 100 charecters." }),
  firstName: z.string().min(1, { message: "Firstname is required." }),
  lastName: z.string().optional(),
  profile: z
    .object({
      phone: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.number().optional(),
    })
    .optional(),
});

export type SignupType = z.infer<typeof signupSchema>;
export const signinSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(5, { message: "Password should at least 5 charecters." })
    .max(100, { message: "Password should at most 100 charecters." }),
});

export type SigninType = z.infer<typeof signinSchema>;

export const TestMidSchema = z.object({
  name: z.string(),
  age: z.string()
})
