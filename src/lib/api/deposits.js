import { apiRequest } from "./api";

export const createDeposit = (formData) => {
  return apiRequest("/deposits", {
    method: "POST",
    body: formData,
  });
};

export const getMyDeposits = (limit = 100) => {
  return apiRequest(`/deposits/mine?limit=${limit}`);
};

export const getAllDeposits = (status = "", limit = 100) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (status) params.set("status", status);

  return apiRequest(`/deposits?${params}`);
};

export const reviewDeposit = (depositId, status, note = "") => {
  return apiRequest(`/deposits/${depositId}/review`, {
    method: "PATCH",
    body: { status, note },
  });
};