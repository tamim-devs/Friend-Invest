import { apiRequest } from "./api";

export const getReports = (year = new Date().getFullYear()) => {
  return apiRequest(`/admin/reports?year=${year}`);
};