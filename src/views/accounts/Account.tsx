import React from "react";
import { useAuth } from "@/auth";
import AdminAccount from "./AdminAccount";
import JournalistAccount from "./JournalistAccount";
import JudgeAccount from "./JudgeAccount";
import JournalistAccountMain from "./JournalistAccountMain";

function Account() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {(user.type === "admin" || user.type === "super-admin") && (
        <AdminAccount />
      )}
      {user.type === "journalist" && <JournalistAccountMain />}
      {user.type === "judge" && <JudgeAccount />}
    </div>
  );
}

export default Account;
