import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
    email: z.optional(z.string().email({ message: "Email is required!" })),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
});

export const PasswordResetSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Required 8 characters for a password!" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Required 8 characters for a password!" }),
});

export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email({ message: "Email is required!" }),
    password: z
      .string()
      .min(8, { message: "Required 8 characters for a password!" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Required 8 characters for a password!" }),
    // tel: z.string().min(9, { message: "Wrong phone number" }),
    //   .max(12, { message: "Wrong phone number" }),
    // zip:z.string().length(7,{message:"Zip must be 7 characters!"}),
    // pref:z.string().max(150,{message:"Prefecture must not exceed 150 charaters."}),
    // addr:z.string().max(150,{message:"Address must not exceed 150 charaters."}),
    // addr2:z.string().max(150,{message:"Address2 must not exceed 150 charaters."}),
    // company:z.string().max(150,{message:"Company name must not exceed 150 charaters."}),
  })
  .refine(
    (data) => {
      if (data.password != data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Confirm Password must be identical to password",
      path: ["confirmPassword"],
    }
  );
