"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();
  // console.log("user: ", user);
  // console.log("session: ", session);

  return (
    <div>
      <UserInfo user={user} label="Client Component" />
    </div>
  );
};

export default ClientPage;
