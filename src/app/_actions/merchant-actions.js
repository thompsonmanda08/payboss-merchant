"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";

import authenticatedApiClient from "@/lib/api-config";
import { getUserSession } from "@/lib/session";

import { setupUserSessions } from "./config-actions";

/**
 * Retrieves the user setup configurations including the logged in user details, permissions, KYC and workspaces.
 * If the operation is successful, an API response containing the user setup configurations is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export const setupAccountConfig = cache(async () => {
  const url = `merchant/user/setup`;

  try {
    const res = await authenticatedApiClient({ url });

    // CREATE A USER SESSION COOKIE TO STORE THE LOGGED IN USER DATA
    await setupUserSessions(res?.data);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | SETUP CONFIG ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    // Manually catch the error
    if (error.message.includes("unexpected response was received")) {
      console.error("Server returned malformed response:", error);
      // Add your custom handling here
      alert("Server returned an unexpected response. Please try again.");
    } else if (error.response) {
      // Handle HTTP errors (4xx, 5xx)
      console.error("HTTP error:", error.response.status);
    } else if (error.request) {
      // Handle network errors
      console.error("Network error:", error.message);
    } else {
      // Handle other errors
      console.error("Unknown error:", error);
    }

    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
});

/**
 * Retrieves the account roles for the current user from the API.
 * If the operation is successful, an API response containing an array of role objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function getUserAccountRoles() {
  const url = `configuration/all/system/role/${"payboss"}`;

  try {
    const res = await authenticatedApiClient({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | SYSTEM ROLES ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Retrieves all the roles for a workspace from the API.
 * If the operation is successful, an API response containing an array of role objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function getWorkspaceRoles() {
  const url = `/configuration/all/workspace/roles`;

  try {
    const res = await authenticatedApiClient({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | WORKSPACE ROLES ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function changeWorkspaceVisibility(workspaceID, isVisible) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
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

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "PATCH | WORKSPACE VISIBILITY ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function createNewWorkspace(newWorkspace) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return {
      success: false,
      message: "MerchantID ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `merchant/workspace/new`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: { ...newWorkspace, merchantID },
    });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | NEW WORKSPACE ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function updateWorkspace({ workspace, description, ID }) {
  if (!ID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
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

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "PATCH | WORKSPACE ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
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

export async function deleteWorkspace(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `merchant/workspace/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "DELETE",
    });

    revalidatePath("/manage-account/workspaces/[ID]", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "DELETE | WORKSPACE ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Retrieves all the workspaces for the merchant.
 * If the operation is successful, an API response containing an array of workspace objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export const getAllWorkspaces = cache(async () => {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return {
      success: false,
      message: "MerchantID ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `merchant/${merchantID}/workspaces`;

  try {
    const res = await authenticatedApiClient({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | ALL WORKSPACES ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
});

/**
 * Retrieves all the KYC data for a merchant.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export const getAllKYCData = cache(async () => {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return {
      success: false,
      message: "MerchantID ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `merchant/${merchantID}/details`;

  try {
    const res = await authenticatedApiClient({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | KYC DATA ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
});

export const getWorkspaceDetails = cache(async (workspaceID) => {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspace ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `merchant/workspace/${workspaceID}/details`;

  try {
    const res = await authenticatedApiClient({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | ALL WORKSPACES ~ " + url,
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
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
});
