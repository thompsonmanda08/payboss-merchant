"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";

import authenticatedApiClient, {
  handleBadRequest,
  handleError,
  successResponse,
} from "@/lib/api-config";
import { getUserSession } from "@/lib/session";

import { setupUserSessions } from "./config-actions";
import { APIResponse } from "@/types";

/**
 * Retrieves the user setup configurations including the logged in user details, permissions, KYC and workspaces.
 * If the operation is successful, an API response containing the user setup configurations is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export const setupAccountConfig = cache(async (): Promise<APIResponse> => {
  const url = `merchant/user/setup`;

  try {
    const res = await authenticatedApiClient({ url });

    // CREATE A USER SESSION COOKIE TO STORE THE LOGGED IN USER DATA
    const configured = await setupUserSessions(res?.data);

    if (!configured) {
      return {
        success: false,
        message: "Error setting up user sessions",
        data: null,
        status: 500,
      };
    }

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | SETUP CONFIG", url);
  }
});

/**
 * Retrieves the account roles for the current user from the API.
 * If the operation is successful, an API response containing an array of role objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function getUserAccountRoles(): Promise<APIResponse> {
  const url = `configuration/all/system/role/${"payboss"}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | SYSTEM ROLES", url);
  }
}

/**
 * Retrieves all the roles for a workspace from the API.
 * If the operation is successful, an API response containing an array of role objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function getWorkspaceRoles(): Promise<APIResponse> {
  const url = `/configuration/all/workspace/roles`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | WORKSPACE ROLES", url);
  }
}

/**
 * Updates the visibility of a specified workspace by calling the API endpoint.
 *
 * @param {string} workspaceID - The ID of the workspace for which the visibility is being changed.
 * @param {boolean} isVisible - A boolean value indicating the desired visibility state of the workspace.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 *   If the operation is successful, the APIResponse object will contain the updated visibility status.
 *   If the operation fails, the APIResponse object will contain a message indicating the error.
 */
export async function changeWorkspaceVisibility(
  workspaceID: string,
  isVisible: boolean,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest("Workspace ID is required");
  }

  const url = `merchant/workspace/visibility/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "PATCH",
      data: {
        isVisible,
      },
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "PATCH | WORKSPACE VISIBILITY", url);
  }
}

/**
 * Creates a new workspace for the merchant by calling the API endpoint.
 * If the operation is successful, an API response containing the new workspace's details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {Object} newWorkspace - An object containing the details of the workspace to be created.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function createNewWorkspace(
  newWorkspace: any,
): Promise<APIResponse> {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return handleBadRequest("MerchantID ID is required");
  }

  const url = `merchant/workspace/new`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: { ...newWorkspace, merchantID },
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "POST | NEW WORKSPACE", url);
  }
}

/**
 * Updates a workspace by calling the API endpoint.
 *
 * @param {{ workspace: string, description: string, ID: string }} workspaceData - An object containing the workspace data to be updated.
 *
 * @returns {Promise<APIResponse>} A promise resolving to an object with the following properties:
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The server response data.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function updateWorkspace({
  workspace,
  description,
  ID,
}: any): Promise<APIResponse> {
  if (!ID) {
    return handleBadRequest("Workspace ID is required");
  }

  const url = `merchant/workspace/${ID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: {
        workspace,
        description,
      },
    });

    revalidatePath("/manage-account/workspaces/[ID]", "page");
    revalidatePath("/dashboard/[workspaceID]/workspace-settings", "page");

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "PATCH | WORKSPACE", url);
  }
}

/**
 * Deletes a workspace by calling the API endpoint.
 *
 * @param {string} workspaceID - The ID of the workspace to be deleted.
 *
 * @returns {Promise<Object>} A promise resolving to an object with the following properties:
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The server response data.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function deleteWorkspace(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest("Workspace ID is required");
  }

  const url = `merchant/workspace/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "DELETE",
    });

    revalidatePath("/manage-account/workspaces/[ID]", "page");

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "DELETE | WORKSPACE", url);
  }
}

/**
 * Retrieves all the workspaces for the merchant.
 * If the operation is successful, an API response containing an array of workspace objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export const getAllWorkspaces = cache(async (): Promise<APIResponse> => {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return handleBadRequest("MerchantID ID is required");
  }

  const url = `merchant/${merchantID}/workspaces`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | ALL WORKSPACES", url);
  }
});

/**
 * Retrieves all the KYC data for a merchant.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export const getAllKYCData = cache(async (): Promise<APIResponse> => {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return handleBadRequest("MerchantID ID is required");
  }

  const url = `merchant/${merchantID}/details`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | KYC DATA", url);
  }
});

export const getWorkspaceDetails = cache(
  async (workspaceID: string): Promise<APIResponse> => {
    if (!workspaceID) {
      return handleBadRequest("Workspace ID is required");
    }

    const url = `merchant/workspace/${workspaceID}/details`;

    try {
      const res = await authenticatedApiClient({ url });

      return successResponse(res.data);
    } catch (error) {
      return handleError(error, "GET | WORKSPACE DETAILS", url);
    }
  },
);
