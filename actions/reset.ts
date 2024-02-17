"use server";

import bcrypt from "bcrypt";
import * as z from "@/zod";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema, PasswordResetSchema } from "@/schemas";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);
  if (!validateFields) {
    return { error: "Invalid email address!" };
  }

  const { email } = validateFields.data;
  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
};

export const changePassword = async (
  values: z.infer<typeof PasswordResetSchema>,
  token: string
) => {
  const validateFields = PasswordResetSchema.safeParse(values);
  if (!validateFields) {
    return { error: "Invalid values!" };
  }

  const { password, confirmPassword } = validateFields.data;
  if (confirmPassword != password) {
    return { error: "Confirm password does not match the password!" };
  }

  const passwordResetToken = await getPasswordResetTokenByToken(token);
  if (!passwordResetToken) {
    return { error: "Token does not exist!" };
  }

  const tokenExpired = new Date() > new Date(passwordResetToken.expires);
  if (tokenExpired) {
    return { error: "Token expired!" };
  }
  const existingUser = await getUserByEmail(passwordResetToken.email);
  if (!existingUser) {
    return { error: "Email does not exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: "Password changed successfully!",
  };
};
