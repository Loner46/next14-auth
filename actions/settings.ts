"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { emit } from "process";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Unauthorized!" };
  }
  // if (!user.id) {
  //   return { error: "User does not have an id!" };
  // }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User does not exist!" };
  }
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      name: values.firstName + " " + values.lastName,
      role: values.role,
      isTwoFactorEnabled: values.isTwoFactorEnabled,
      email: values.email,
    },
  });

  return {
    success: "Settings modified successfully!",
  };
};
