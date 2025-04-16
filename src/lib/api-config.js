"use server";

import { getAuthSession } from "@/app/_actions/config-actions";
import { getRefreshToken } from "@/app/_actions/auth-actions";

import { apiClient } from "./utils";
import { getServerSession } from "./session";

const authenticatedService = async (request) => {
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

// API INTERCEPTOR FOR REFRESHING TOKEN
apiClient.interceptors.response.use(
  (response) => {

    return response;
  },

  /* IF ERRORS */
  async (error) => {
    const prevRequest = error?.config;

    if (error?.response?.status === 403 && !prevRequest?.sent) {
      prevRequest.sent = true;

      const session = await getServerSession();

      if (session) {
        const res = await getRefreshToken();
        const newAccessToken = res?.data?.accessToken;

        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry 3 Times only
        if (prevRequest?.retryCount < 3) {
          prevRequest.retryCount = prevRequest.retryCount || 0;
          prevRequest.retryCount += 1;

          return await apiClient(prevRequest);
        }
      }

      return {
        success: false,
        message: "Access Token Expired",
        data: null,
        status: 403,
        statusText: "Forbidden",
      };
    }

    return Promise.reject(error);
  }
);

export default authenticatedService;
