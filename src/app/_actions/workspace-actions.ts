'use server';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

import authenticatedApiClient, {
  handleBadRequest,
  handleError,
  successResponse,
} from '@/lib/api-config';
import { updateWorkspaceSession } from '@/lib/session';
import { APIResponse } from '@/types';

export const initializeWorkspace = cache(
  async (workspaceID: string): Promise<APIResponse> => {
    if (!workspaceID) {
      return handleBadRequest('Workspace ID is required');
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

      return successResponse(updatedSession);
    } catch (error: Error | any) {
      return handleError(error, 'POST | INIT WORKSPACE', url);
    }
  },
);

export const getAssignedWorkspaces = cache(async (): Promise<APIResponse> => {
  const url = `merchant/user/assigned/workspaces`;

  try {
    const res = await authenticatedApiClient({ url });

    const workspaces = res?.data?.workspaces;

    await updateWorkspaceSession({ workspaces });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | WORKSPACES', url);
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
export async function submitPOP(
  popDetails: any,
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: popDetails,
    });

    revalidatePath(
      '/manage-account/workspaces/[ID]/workspace-settings',
      'page',
    );

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | PREFUND POP', url);
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
export async function getWalletPrefunds(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund/list`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | WALLET PREFUND LIST', url);
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
  prefundData: any,
  prefundID: string,
  workspaceID: string,
): Promise<APIResponse> {
  if (!prefundID || !workspaceID) {
    return handleBadRequest('Prefund/workspaceID ID is required!');
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund/${prefundID}/review`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'PATCH',
      data: prefundData,
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'PATCH | APPROVE WALLET PREFUND', url);
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
export async function getWorkspaceMembers(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/users`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | WORKSPACE MEMBERS', url);
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
export async function deleteUserFromWorkspace(
  recordID: string,
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `/merchant/workspace/${workspaceID}/user/${recordID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'DELETE',
    });

    revalidatePath('/manage-account/workspaces/[ID]', 'page');
    revalidatePath('/dashboard/[workspaceID]/workspace-settings', 'page');

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'DELETE | USER', url);
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
  mapping: any,
  recordID: string,
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/user/role/${recordID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'PATCH',
      data: mapping,
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'PATCH | USER ROLE', url);
  }
}

/**
 * Sets up the API key for the given workspace by calling the API endpoint.
 *
 * @param {string} workspaceID - The ID of the workspace for which the API key is being set up.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
export async function setupWorkspaceAPIKey(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/transaction/collection/create/api-key/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | SETUP API KEY', url);
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
export async function refreshWorkspaceAPIKey(
  workspaceID: string,
  keyID: string,
): Promise<APIResponse> {
  if (!workspaceID || !keyID) {
    return handleBadRequest('Workspace/Refresh Key ID is required!');
  }

  const url = `/merchant/transaction/collection/generate/${workspaceID}/api-key/${keyID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | FRESH API KEY', url);
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
export async function getWorkspaceAPIKey(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/transaction/collection/api-key/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | API KEY', url);
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
export async function generateWorkspaceTillNumber(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/transaction/collection/create/till-number/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | GENERATE TILL NUMBER', url);
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

export async function getWorkspaceTillNumber(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/transaction/collection/till-number/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | TILL NUMBER', url);
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
export async function activateWorkspaceTerminals(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/terminal/activation`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | TERMINAL ACTIVATION', url);
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
export async function deactivateWorkspaceTerminals(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  try {
    const res = await authenticatedApiClient({
      url: `merchant/workspace/${workspaceID}/terminal/deactivation`,
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | TERMINAL DEACTIVATION', '');
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
export async function getAllWorkspaceTerminals(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/terminals`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | WORKSPACE TERMINALS', url);
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
export async function registerTerminals(
  workspaceID: string,
  terminalUrl: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/terminal`;

  try {
    const res = await authenticatedApiClient({
      method: 'POST',
      url,
      data: { terminalUrl },
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | REGISTER TERMINALS', url);
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
export async function updateWorkspaceCallback(
  workspaceID: string,
  callbackData: any,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/callback/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: 'PATCH',
      url,
      data: callbackData,
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'PATCH | CALLBACK URL', url);
  }
}

/**
 * Retrieves the callback URL for the given workspace.
 *
 * @param {string} workspaceID - The ID of the workspace for which the callback URL is being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The callback URL data for the workspace.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */

export async function getWorkspaceCallback(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/callback`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | CALLBACK URL', url);
  }
}
