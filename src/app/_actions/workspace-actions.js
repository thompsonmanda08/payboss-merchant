"use server";
import { revalidatePath } from "next/cache";
import { cache } from "react";

import authenticatedApiClient from "@/lib/api-config";
import { updateWorkspaceSession } from "@/lib/session";

export const initializeWorkspace = cache(async (workspaceID) => {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/init`;

  try {
    const res = await authenticatedApiClient({ url });

    const workspaceSession = {
      activeWorkspaceID: workspaceID,
      workspaceType: res?.data?.workspaceType,
      workspacePermissions: res?.data,
    };

    const updatedSession = await updateWorkspaceSession(workspaceSession);

    return {
      success: true,
      message: res?.message,
      data: updatedSession,
      status: res?.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | INITIALIZE WORKSPACE ~ " + url,
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
        "Error Occurred: See Console for details",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
});

export const getAssignedWorkspaces = cache(async () => {
  const url = `merchant/user/assigned/workspaces`;

  try {
    const res = await authenticatedApiClient({ url });

    const workspaces = res?.data?.workspaces;

    await updateWorkspaceSession({ workspaces });

    return {
      success: true,
      message: res?.message,
      data: workspaces,
      status: res?.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | WORKSPACES ~ " + url,
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
        "Error Occurred: See Console for details",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
});

/**
 * Submits a Proof of Payment (POP) for a workspace.
 *
 * @param {Object} popDetails - The details of the Proof of Payment (POP) to be
 * submitted. The object should contain the following properties:
 *
 * - `amount`: The amount of the Proof of Payment (POP) to be submitted.
 * - `currency`: The currency of the Proof of Payment (POP) to be submitted.
 * - `paymentMethod`: The payment method used to make the payment.
 * - `paymentReference`: The payment reference for the payment.
 * - `paymentDate`: The date of the payment.
 *
 * @param {string} workspaceID - The ID of the workspace for which the Proof of
 * Payment (POP) is being submitted.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An object containing the submitted Proof of Payment (POP) details.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function submitPOP(popDetails, workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "POST",
      data: popDetails,
    });

    revalidatePath(
      "/manage-account/workspaces/[ID]/workspace-settings",
      "page"
    );

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | PREFUND POP ~ " + url,
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
 * Retrieves a list of all the prefund requests made by the logged-in
 * merchant for the given workspace.
 *
 * @param {string} workspaceID - The ID of the workspace for which the prefund
 * requests are being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of prefund request objects.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getWalletPrefunds(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund/list`;

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
      endpoint: "GET | WALLET PREFUND LIST ~ " + url,
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
 * Approves a prefund request for the given workspace.
 *
 * @param {Object} prefundData - The prefund request data to be approved.
 * @param {string} prefundID - The ID of the prefund request to be approved.
 * @param {string} workspaceID - The ID of the workspace for which the prefund
 * request is being approved.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An object containing the approved prefund request data.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */

export async function approveWalletPrefund(
  prefundData,
  prefundID,
  workspaceID
) {
  if (!prefundID || !workspaceID) {
    return {
      success: false,
      message: "Prefund/workspaceID ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund/${prefundID}/review`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "PATCH",
      data: prefundData,
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
      endpoint: "PATCH | APPROVE PREFUND ~ " + url,
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
 * Retrieves a list of all the members of the given workspace.
 *
 * @param {string} workspaceID - The ID of the workspace for which the members
 * are being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of member objects.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getWorkspaceMembers(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/users`;

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
      endpoint: "PATCH | WORKSPACE USERS ~ " + url,
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
 * Deletes a user from a workspace.
 *
 * @param {string} recordID - The ID of the user to delete.
 * @param {string} workspaceID - The ID of the workspace to delete the user from.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 *   If the operation is successful, the APIResponse object will contain the updated workspace details.
 *   If the operation fails, the APIResponse object will contain a message indicating the error.
 */
export async function deleteUserFromWorkspace(recordID, workspaceID) {
  if (!workspaceID || !recordID) {
    return {
      success: false,
      message: "Workspace/Record ID is required!",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `/merchant/workspace/${workspaceID}/user/${recordID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "DELETE",
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
      endpoint: "DELETE | USER ~ " + url,
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
 * Changes the role of a user within a specified workspace by calling the API endpoint.
 *
 * @param {Object} mapping - An object containing the role mapping details.
 * @param {string} recordID - The ID of the user whose role is to be changed.
 * @param {string} workspaceID - The ID of the workspace where the user role change is to be applied.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 *   If the operation is successful, the APIResponse object will contain the updated user role details.
 *   If the operation fails, the APIResponse object will contain a message indicating the error.
 */

export async function changeUserRoleInWorkspace(
  mapping,
  recordID,
  workspaceID
) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/user/role/${recordID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "PATCH",
      data: mapping,
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
      endpoint: "PATCH | USER ROLE ~ " + url,
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
 * Sets up the API key for the given workspace by calling the API endpoint.
 *
 * @param {string} workspaceID - The ID of the workspace for which the API key is being set up.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export async function setupWorkspaceAPIKey(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/transaction/collection/create/api-key/${workspaceID}`;

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
      endpoint: "GET | SETUP API KEY ~ " + url,
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
 * Refreshes a workspace's API Key.
 *
 * @param {string} workspaceID - The ID of the workspace to refresh the API Key
 * for.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The newly generated API Key.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function refreshWorkspaceAPIKey(workspaceID, keyID) {
  if (!workspaceID || !keyID) {
    return {
      success: false,
      message: "Workspace/Refresh Key ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `/merchant/transaction/collection/generate/${workspaceID}/api-key/${keyID}`;

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
      endpoint: "GET | REFRESH API KEY ~ " + url,
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
 * Retrieves the API key for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the API key is being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The API key for the workspace.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getWorkspaceAPIKey(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/transaction/collection/api-key/${workspaceID}`;

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
      endpoint: "GET | API KEY ~ " + url,
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
 * Generates a new till number for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the till number is being generated.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The generated till number.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function generateWorkspaceTillNumber(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `merchant/transaction/collection/create/till-number/${workspaceID}`;

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
      endpoint: "GET | GENERATE TILL NUMBER ~ " + url,
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
 * Retrieves the till number for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the till number is being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The till number for the workspace.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */

export async function getWorkspaceTillNumber(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `merchant/transaction/collection/till-number/${workspaceID}`;

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
      endpoint: "GET | TILL NUMBER ~ " + url,
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
 * Activates terminals for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which terminals are being activated.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The data returned by the server.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function activateWorkspaceTerminals(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/terminal/activation`;

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
      endpoint: "POST | TERMINAL ACTIVATION ~ " + url,
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
 * Deactivates terminals for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which terminals are being deactivated.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The data returned by the server.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function deactivateWorkspaceTerminals(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedApiClient({
      url: `merchant/workspace/${workspaceID}/terminal/deactivation`,
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
 * Retrieves a list of all terminals in the given workspace.
 *
 * @param {string} workspaceID - The ID of the workspace for which terminals are being retrieved.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The list of terminals in the workspace.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getAllWorkspaceTerminals(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/terminals`;

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
      endpoint: "GET | WORKSPACE TERMINALS ~ " + url,
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
 * Registers a new terminal for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the terminal is being registered.
 * @param {string} terminalUrl - The URL of the terminal being registered.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The data returned by the server.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function registerTerminals(workspaceID, terminalUrl) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/terminal`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: { terminalUrl },
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
      endpoint: "POST | REGISTER TERMINALS ~ " + url,
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
 * Updates the callback URL for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the callback URL is being updated.
 * @param {Object} callbackData - An object containing the callback data to be updated.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The data returned by the server.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function updateWorkspaceCallback(workspaceID, callbackData) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/callback/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: callbackData,
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
      endpoint: "PATCH | CALLBACK URL ~ " + url,
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

export async function getWorkspaceCallback(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/workspace/${workspaceID}/callback`;

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
      endpoint: "GET | CALLBACK URL ~ " + url,
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
