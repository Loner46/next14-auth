import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await currentUser();
  // console.log("user: ", user);
  // console.log("session: ", session);

  return (
    <div>
      <UserInfo user={user} label="Server Component" />
    </div>
  );
};

export default ServerPage;
