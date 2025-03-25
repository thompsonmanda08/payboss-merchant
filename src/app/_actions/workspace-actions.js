"use server";
import authenticatedService from "@/lib/api-config";
import { updateWorkspaceSession } from "@/lib/session";
import { cache } from "react";

/**
 * Initializes a workspace and updates the session with the workspace permissions
 * and type.
 *
 * @param {string} workspaceID - The ID of the workspace to initialize.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following
 * properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An object containing the workspace permissions and type.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
async function workspaceInit(workspaceID) {
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
    const res = await authenticatedService({
      url: `merchant/workspace/init/${workspaceID}`,
    });

    if (res.status == 200) {
      await updateWorkspaceSession({
        workspacePermissions: res.data,
        workspaceType: res.data.workspaceType,
      });
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      };
    }

    return {
      success: false,
      message: res?.data?.error || res?.statusText || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.response?.statusText ||
        "Operation Failed!",
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
export const initializeWorkspace = cache(workspaceInit);

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

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/wallet/prefund/${workspaceID}`,
      method: "POST",
      data: popDetails,
    });

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      };
    }

    return {
      success: false,
      message: res?.data?.error || res?.statusText || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.data?.error ||
        error?.response?.statusText ||
        "Operation Failed!",
      data: error?.response,
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

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/wallet/prefund/${workspaceID}/list`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/${workspaceID}/wallet/prefund/${prefundID}/review`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/users/${workspaceID}`,
    });

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      };
    }

    return {
      success: false,
      message: res?.data?.error || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
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
  try {
    const res = await authenticatedService({
      url: `/merchant/workspace/${workspaceID}/user/${recordID}`,
      method: "DELETE",
    });

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      };
    }

    revalidatePath("/manage-account/workspaces/[ID]", "page");
    revalidatePath("/dashboard/[workspaceID]/workspace-settings", "page");

    return {
      success: false,
      message: res?.data?.error || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
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
  try {
    const res = await authenticatedService({
      url: `merchant/workspace/${workspaceID}/user/role/${recordID}`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      url: `transaction/collection/create/api-key/${workspaceID}`,
    });

    if (res.status == 200 || res.status == 201) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      };
    }

    return {
      success: false,
      message: res?.data?.error || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
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
export async function refreshWorkspaceAPIKey(workspaceID) {
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
    const res = await authenticatedService({
      url: `transaction/collection/generate/api-key/${workspaceID}`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      url: `transaction/collection/api-key/${workspaceID}`,
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
        error?.response?.config?.data.error ||
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
  try {
    const res = await authenticatedService({
      url: `transaction/collection/create/till-number/${workspaceID}`,
    });

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      };
    }

    return {
      success: false,
      message: res?.data?.error || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
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
  try {
    const res = await authenticatedService({
      url: `transaction/collection/till-number/${workspaceID}`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/${workspaceID}/terminal/activation`,
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
        error?.response?.config?.data.error ||
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
    const res = await authenticatedService({
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/terminals/${workspaceID}`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      method: "POST",
      url: `merchant/workspace/${workspaceID}/terminal`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      method: "PATCH",
      url: `merchant/workspace/callback/${workspaceID}`,
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
        error?.response?.config?.data.error ||
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

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/callback/${workspaceID}`,
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
        error?.response?.config?.data.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
