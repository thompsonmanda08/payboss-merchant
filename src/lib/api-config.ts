"use server";

import { getAuthSession } from "@/app/_actions/config-actions";

import { apiClient } from "./utils";
import { AxiosHeaders, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { APIResponse } from "@/types";

// Add request interceptor for authenticated requests
// apiClient.interceptors.request.use(
//   async (config) => {
//     // Skip adding auth header for specific endpoints
//     if (config.publicEndpoint) {
//       return config;
//     }

//     const session = await getAuthSession();

//     if (session?.accessToken) {
//       config.headers.Authorization = `Bearer ${session.accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network error (no response)
    if (!error.response) {
      return Promise.reject({
        type: "Network Error",
        message: "Please check your internet connection.",
      });
    }

    // Timeout error
    if (error.code === "ECONNABORTED") {
      throw {
        ...error,
        type: "Timeout Error",
        message: "Request timed out! Please try again.",
      };
    }

    const { status, data } = error.response;

    // Handle specific error codes
    const errorMap: { [x: string]: string } = {
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
  },
);

export type RequestType = AxiosRequestConfig & {
  contentType?: AxiosRequestHeaders["Content-Type"];
};

const authenticatedApiClient = async (request: RequestType) => {
  const session = await getAuthSession();

  const config = {
    method: "GET",
    headers: {
      "Content-type": request.contentType
        ? request.contentType
        : "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    withCredentials: true,
    ...request,
  };

  return await apiClient(config);
};

export default authenticatedApiClient;

// Response helpers
export function successResponse(
  data: any | null,
  message: string = "Action completed successfully",
): APIResponse {
  return {
    success: true,
    message,
    data,
    status: 200,
    statusText: "OK",
  };
}

export function handleBadRequest(
  message: string = "Missing required parameters",
): APIResponse {
  return {
    success: false,
    message,
    data: null,
    status: 400,
    statusText: "BAD_REQUEST",
  };
}
export function unauthorizedResponse(
  message: string = "Unauthorized",
): APIResponse {
  return {
    success: false,
    message,
    data: null,
    status: 401,
    statusText: "UNAUTHORIZED",
  };
}

export function notFoundResponse(message: string): APIResponse {
  return {
    success: false,
    message,
    data: null,
    status: 404,
    statusText: "NOT FOUND",
  };
}

export function handleError(
  error: any,
  method = "GET",
  url: string,
): APIResponse {
  console.error({
    endpoint: `${method} | ~ ${url}`,
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    headers: error?.response?.headers,
    config: error?.response?.config,
    data: error?.response?.data || error,
  });

  return {
    success: false,
    message:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.response?.config?.data?.error ||
      error?.message ||
      "No Server Response",
    data: null,
    status: error?.response?.status || 500,
    statusText: error?.response?.statusText || "INTERNAL SERVER ERROR",
  };
}
