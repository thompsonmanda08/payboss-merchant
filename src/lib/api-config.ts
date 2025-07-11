"use server";

import { getAuthSession } from "@/app/_actions/config-actions";

import { apiClient } from "./utils";
import { AxiosHeaders, AxiosRequestConfig, AxiosRequestHeaders } from "axios";

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

    // Network error (no connection)
    if (!error.response) {
      throw {
        ...error,
        type: "Network Error",
        message: "Please check your internet connection.",
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
