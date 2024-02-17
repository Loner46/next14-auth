import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
  // console.log("1234 session: ", session);
  return session.data?.user;
};
