import { apiRequest } from "./api";

export const getMyProfile = () => {
  return apiRequest("/members/me");
};

export const updateMyProfile = (profileData) => {
  return apiRequest("/members/me", {
    method: "PATCH",
    body: profileData,
  });
};

export const getAllMembers = (search = "", limit = 100) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (search) params.set("search", search);

  return apiRequest(`/members?${params}`);
};

export const getMemberDetails = (memberId) => {
  return apiRequest(`/members/${memberId}`);
};

export const createMember = (memberData) => {
  return apiRequest("/admin/members", {
    method: "POST",
    body: memberData,
  });
};

export const updateMemberStatus = (memberId, status) => {
  return apiRequest(`/members/${memberId}/status`, {
    method: "PATCH",
    body: { status },
  });
};