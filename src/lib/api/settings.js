import { apiRequest } from "./api";

export const getSettings = () => {
  return apiRequest("/admin/settings");
};

export const updateSettings = (settingsData) => {
  return apiRequest("/admin/settings", {
    method: "PATCH",
    body: settingsData,
  });
};