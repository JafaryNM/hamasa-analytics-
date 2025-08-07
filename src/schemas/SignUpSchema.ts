import { z } from "zod";

const SignUpSchema = z
  .object({
    firstName: z.string().refine((val) => val.trim() !== "", {
      message: "Please enter your first name",
    }),

    lastName: z.string().refine((val) => val.trim() !== "", {
      message: "Please enter your last name",
    }),

    gender: z
      .union([z.string(), z.object({ value: z.string() })])
      .transform((val) => (typeof val === "string" ? val : val.value))
      .refine((val) => ["Male", "Female"].includes(val), {
        message: "Please select either Male or Female",
      }),

    phone: z.string().refine((val) => val.length === 10, {
      message: "Phone number must be 10 digits long",
    }),

    email: z.string().superRefine((val, ctx) => {
      if (!val || val.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter your email address",
        });
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
        });
      }
    }),

    birthDate: z
      .union([z.string(), z.date()])
      .transform((val) =>
        val instanceof Date ? val.toISOString().split("T")[0] : val
      )
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please select a valid date",
      }),

    password: z.string().refine((val) => val.trim().length >= 8, {
      message: "Password must be at least 8 characters",
    }),

    passwordConfirmation: z.string().refine((val) => val.trim() !== "", {
      message: "Confirm your password",
    }),

    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Please accept the terms and conditions to continue",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export { SignUpSchema };
