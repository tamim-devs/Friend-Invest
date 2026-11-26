const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.NEXT_BACKEND_API_URL;

async function getToken() {
  const { authClient } = await import("@/lib/auth-client");

  const result = await authClient.token();

  return result?.data?.token || result?.token;
}

export async function apiRequest(
  endpoint,
  {
    method = "GET",
    body,
    headers = {},
    auth = true,
  } = {}
) {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_API_URL or NEXT_BACKEND_API_URL is not configured"
    );
  }

  const requestHeaders = { ...headers };

  if (auth) {
    const token = await getToken();

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;

  if (body && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
}