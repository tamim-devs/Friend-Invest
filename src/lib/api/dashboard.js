import { apiRequest } from "./api";

export const getDashboard = () => {
  return apiRequest("/dashboard");
};

export const getAdminDashboard = () => {
  return apiRequest("/admin/dashboard");
};