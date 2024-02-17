"use server";

import bcrypt from "bcrypt";
import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields) {
    return { error: "Invalid fields" };
  }

  const { firstName, lastName, email, password, confirmPassword } =
    validatedFields.data;

  if (password !== confirmPassword) {
    return { error: "Confirm password does not match password." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email alredy in use!" };
  }
  await db.user.create({
    data: {
      name: firstName + " " + lastName,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success:
      "Confirmation mail was sent to your email. Please access to your mailbox and, proceed email verification!",
  };
};
