import React from "react";
import { useNavigate } from "react-router-dom";
import JudgeDashboard from "./JudgeDashboard";
import AdminDashboard from "./AdminDashboard";
import JournalistDashboard from "./JournalistDashboard";

interface UserRole {
  codeName: string;
}

interface DashboardProps {
  role: UserRole;
}

const Dashboard = ({ role }: DashboardProps) => {
  const navigate = useNavigate();

  // Redirect based on role
  if (!role) {
    navigate("/sign-in"); // Redirect to login if no role is found
    return null;
  }

  return (
    <>
      {role.codeName === "judge" && <JudgeDashboard />}
      {role.codeName === "admin" && <AdminDashboard />}
      {role.codeName === "journalist" && <JournalistDashboard />}
    </>
  );
};

export default Dashboard;
