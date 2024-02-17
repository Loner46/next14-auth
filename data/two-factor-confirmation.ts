import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });

    // if (!twoFactorConfirmation) {
    //   return { error: "Two Factor Confirmation token does not exist!" };
    // }

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
