import { apiRequest } from "./api";

export const getNotifications = () => {
  return apiRequest("/notifications");
};

export const markNotificationAsRead = (notificationId) => {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const markAllNotificationsAsRead = () => {
  return apiRequest("/notifications/read-all", {
    method: "PATCH",
  });
};