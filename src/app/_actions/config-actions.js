"use server";

import authenticatedService from "@/lib/api-config";
import {
  createUserSession,
  createWorkspaceSession,
  getServerSession,
  getUserSession,
  getWorkspaceSessionData,
} from "@/lib/session";
import { apiClient } from "@/lib/utils";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cache } from "react";

/**
 * Retrieves the general configurations from the configuration service.
 * If the operation is successful, an API response containing the configurations is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success or failure of the operation,
 * including the message, data, status, and statusText.
 */

export async function getGeneralConfigs() {
  const CONFIG_URL = process.env.CONFIG_BASE_URL;
  try {
    const res = await axios.get(`${CONFIG_URL}/configuration/all-configs`);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
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
 * Retrieves the user setup configurations including the logged in user details, permissions, KYC and workspaces.
 * If the operation is successful, an API response containing the user setup configurations is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export const getUserSetupConfigs = cache(async () => {
  const url = `merchant/user/setup`;
  try {
    const res = await authenticatedService({ url });

    // CREATE A USER SESSION COOKIE TO STORE THE LOGGED IN USER DATA
    await createUserSession({
      user: res.data?.userDetails,
      merchantID: res.data?.merchantID,
      userPermissions: res.data?.userPermissions,
      kyc: res.data?.kyc,
    });

    let workspaceIDs = res.data?.workspaces?.map((item) => item?.ID);
    let workspaces = res.data?.workspaces;

    // Create a workspace session for the logged in user -
    // This is used to get the active workspace and workspace user as well as permissions
    if (workspaces) {
      await createWorkspaceSession({
        workspaces: workspaces,
        workspaceIDs: workspaceIDs,
        activeWorkspace: workspaces?.[0] || null,
        workspacePermissions: null,
      });
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: url,
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
 * Retrieves the account roles for the current user from the API.
 * If the operation is successful, an API response containing an array of role objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function getUserAccountRoles() {
  const url = `merchant/roles`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: url,
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
  const url = `merchant/workspace/roles`;
  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: url,
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

// export async function createUserRole(roleDetails) {
//   const session = await getServerSession();
//   const merchantID = session?.user?.merchantID;

//   try {
//     const res = await apiClient.post(
//       `merchant/${merchantID}/roles/new`, //URL
//       roleDetails //BODY
//     );

//     return {
//       success: true,
//       message: res.message,
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     };
//   } catch (error) {
//     console.error({
//       status: error?.response?.status,
//       statusText: error?.response?.statusText,
//       headers: error?.response?.headers,
//       config: error?.response?.config,
//       data: error?.response?.data || error,
//     });
//     return {
//       success: false,
//       message:
//         error?.response?.data?.error ||
//         error?.response?.config?.data?.error ||
//         "Error Occurred: See Console for details",
//       data: error?.response?.data,
//       status: error?.response?.status,
//       statusText: error?.response?.statusText,
//     };
//   }
// }

// export async function updateUserRole() {
//   const session = await getServerSession(role);
//   const merchantID = session?.user?.merchantID;

//   try {
//     const res = await apiClient.patch(
//       `merchant/${merchantID}/roles/${role?.ID}`, //URL
//       role // BODY
//     );

//     return {
//       success: true,
//       message: res.message,
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     };
//   } catch (error) {
//     console.error({
//       status: error?.response?.status,
//       statusText: error?.response?.statusText,
//       headers: error?.response?.headers,
//       config: error?.response?.config,
//       data: error?.response?.data || error,
//     });
//     return {
//       success: false,
//       message:
//         error?.response?.data?.error ||
//         error?.response?.config?.data?.error ||
//         "Error Occurred: See Console for details",
//       data: error?.response?.data,
//       status: error?.response?.status,
//       statusText: error?.response?.statusText,
//     };
//   }
// }

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
    const res = await authenticatedService({
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
      endpoint: url,
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
    const res = await authenticatedService({
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
      endpoint: url,
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
    const res = await authenticatedService({
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
      endpoint: url,
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
    const res = await authenticatedService({
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
      endpoint: url,
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

  const url = `merchant/workspaces/${merchantID}`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: url,
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

  const url = `merchant/${merchantID}`;
  try {
    const res = await authenticatedService({
      url, //URL
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
      endpoint: url,
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
 * Retrieves the authentication session for the current user.
 * If the session is successfully retrieved, it returns the session object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the session object if available, or null if not.
 */
export async function getAuthSession() {
  const session = await getServerSession();
  if (session) return session;
  return null;
}

/**
 * Retrieves the user details for the currently authenticated user.
 * If the user is authenticated, it returns the user details object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the user details object if available, or null if not.
 */
export async function getUserDetails() {
  const session = await getUserSession();
  if (session) return session;
  return null;
}

/**
 * Retrieves the workspace session for the currently authenticated user.
 * If the workspace session is successfully retrieved, it returns the workspace session object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the workspace session object if available, or null if not.
 */

export async function getWorkspaceSession() {
  const session = await getWorkspaceSessionData();
  if (session) return session;
  return null;
}
