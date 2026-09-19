 import z from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Firstname is required"),
    lastName: z.string().min(2, "Lastname is required"),
    username: z.string().regex(usernameRegex, "Invalid username format"),
    email: z.string().regex(emailRegex, "Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identity: z
    .string()
    .min(2, "Email or username is required")
    .refine((value) => emailRegex.test(value) || usernameRegex.test(value), {
      message: "Identity must be a valid email or username",
    }),
  password: z.string().min(1, "Password is required"),
});