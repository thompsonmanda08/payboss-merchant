"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";

import {
  createUserSession,
  createWorkspaceSession,
  deleteSession,
  getServerSession,
  getUserSession,
  getWorkspaceSessionData,
} from "@/lib/session";
import { apiClient } from "@/lib/utils";
import { handleError, successResponse } from "@/lib/api-config";
import { APIResponse, Workspace } from "@/types";

/**
 * Retrieves the general configurations from the configuration service.
 * If the operation is successful, an API response containing the configurations is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success or failure of the operation,
 * including the message, data, status, and statusText.
 */
export const getGeneralConfigs = cache(async (): Promise<APIResponse> => {
  const url = `/configuration/all-configs`;

  try {
    const res = await apiClient.get(url);

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | GENERAL CONFIGS", url);
  }
});

/**
 * Retrieves the authentication session for the current user.
 * If the session is successfully retrieved, it returns the session object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the session object if available, or null if not.
 */
export const getAuthSession = cache(async (): Promise<any> => {
  const session = await getServerSession();

  if (session) return session;

  return null;
});

/**
 * Retrieves the user details for the currently authenticated user.
 * If the user is authenticated, it returns the user details object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the user details object if available, or null if not.
 */
// export async function getUserDetails() {
//   const session = await getUserSession();
//   if (session) return session;
//   return null;
// }

export const getUserDetails = cache(async (): Promise<any> => {
  const session = await getUserSession();

  if (session) return session;

  return null;
});

/**
 * Retrieves the workspace session for the currently authenticated user.
 * If the workspace session is successfully retrieved, it returns the workspace session object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the workspace session object if available, or null if not.
 */

export const getWorkspaceSession = cache(async (): Promise<any> => {
  const session = await getWorkspaceSessionData();

  if (session) return session;

  return null;
});

export const revokeAccessToken = async (): Promise<any> => {
  const response = await deleteSession();

  revalidatePath("/", "layout");

  return response;
};

export async function setupUserSessions(sessionData: any) {
  // CREATE A USER SESSION COOKIE TO STORE THE LOGGED IN USER DATA
  try {
    await Promise.all([
      createUserSession({
        user: sessionData?.userDetails,
        merchantID: sessionData?.merchantID,
        userPermissions: sessionData?.userPermissions,
        kyc: sessionData?.kyc,
        isSetupComplete: true,
      }),
      sessionData?.workspaces &&
        createWorkspaceSession({
          workspaces: sessionData?.workspaces,
          workspaceIDs: sessionData?.workspaces.map(
            (item: Workspace) => item?.ID,
          ),
          workspaceType: sessionData?.workspaceType ?? "", // Provide a default or actual value
        }),
    ]);

    return true;
  } catch (error) {
    console.error("Error setting up user sessions:", error);
    if (error) throw error;

    return false;
  }
}
