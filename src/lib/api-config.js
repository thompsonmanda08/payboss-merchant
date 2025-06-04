"use server";

import { getAuthSession } from "@/app/_actions/config-actions";

import { apiClient } from "./utils";

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
