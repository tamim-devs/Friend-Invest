import { apiRequest } from "./api";

export const getAdminDashboard = () => {
  return apiRequest("/admin/dashboard");
};

export const getAdminMembers = (search = "") => {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  return apiRequest(`/members${query}`);
};

export const getAdminDeposits = (status = "") => {
  const query = status
    ? `?status=${encodeURIComponent(status)}`
    : "";

  return apiRequest(`/deposits${query}`);
};

export const approveDeposit = (depositId, note = "") => {
  return apiRequest(`/deposits/${depositId}/review`, {
    method: "PATCH",
    body: {
      status: "verified",
      note,
    },
  });
};

export const rejectDeposit = (depositId, note = "") => {
  return apiRequest(`/deposits/${depositId}/review`, {
    method: "PATCH",
    body: {
      status: "rejected",
      note,
    },
  });
};