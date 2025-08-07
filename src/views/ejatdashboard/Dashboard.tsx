import React from "react";
import JournalistDashboard from "./JournalistDashboard";
import JudgeDashboard from "./JudgeDashboard";
import { useAuth } from "@/auth";
import AdminMainDashboard from "./AdminMainDashboard";

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {(user.type === "admin" || user.type === "super-admin") && (
        <AdminMainDashboard />
      )}
      {user.type === "journalist" && <JournalistDashboard />}
      {user.type === "judge" && <JudgeDashboard />}
    </div>
  );
}

export default Dashboard;
