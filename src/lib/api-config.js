"use server";

import { getAuthSession } from "@/app/_actions/config-actions";

import { apiClient, apiServiceClient } from "./utils";

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

export const authenticatedServiceClient = async (request) => {
  const session = await getAuthSession();

  const response = await apiServiceClient({
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
