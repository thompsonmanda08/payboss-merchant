"use server";

import { getAuthSession } from "@/app/_actions/config-actions";

import { apiClient } from "./utils";

// Add request interceptor for authenticated requests
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding auth header for specific endpoints
    if (config.publicEndpoint) {
      return config;
    }

    const session = await getAuthSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network error (no connection)
    if (!error.response) {
      throw {
        ...error,
        type: "network",
        message: "Network error. Please check your internet connection.",
      };
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized (token expired)
    // if (status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const newSession = await refreshAuthToken();
    //     apiClient.defaults.headers.common["Authorization"] = `Bearer ${newSession.accessToken}`;
    //     originalRequest.headers["Authorization"] = `Bearer ${newSession.accessToken}`;
    //     return apiClient(originalRequest);
    //   } catch (refreshError) {
    //     // Trigger logout or redirect to login
    //     await clearAuthSession();
    //     window.location.href = "/login";
    //     throw {
    //       type: "auth",
    //       message: "Session expired. Please login again.",
    //       originalError: refreshError,
    //     };
    //   }
    // }

    // Handle specific error codes
    const errorMap = {
      400: "Bad request",
      403: "Forbidden",
      404: "Resource not found",
      500: "Internal server error",
      502: "Bad gateway",
      503: "Service unavailable",
    };

    throw {
      ...error,
      type: "api",
      status,
      message: data?.message || errorMap[status] || "Request failed",
      details: data?.errors || {},
    };
  }
);

const authenticatedApiClient = async (request) => {
  const session = await getAuthSession();

  const response = await apiClient({
    method: "GET",
    headers: {
      "Content-type": request.contentType
        ? request.contentType
        : "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    withCredentials: true,
    ...request,
  });

  return response;
};

export default authenticatedApiClient;
