"use server";

import authenticatedApiClient, {
  handleError,
  successResponse,
} from "@/lib/api-config";
import { APIResponse } from "@/types";

/**
 * Creates subscription packs for a given workspace.
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {object[]} formData.services The array of service packs to be submitted.
 * @param {string} formData.services[index].name
 * @param {string} formData.services[index].price
 * @param {string} formData.services[index].key
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function createSubscriptionPack(
  workspaceID: string,
  formData: any,
): Promise<APIResponse> {
  const url = `merchant/transaction/collection/create/subscription/config/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: formData,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "POST | CREATE SUBSCRIPTION DATA", url);
  }
}

/**
 * Updates a subscription pack for a given workspace.
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {object[]} formData.services The array of service packs to be submitted.
 * @param {string} formData.services[index].name
 * @param {string} formData.services[index].price
 * @param {string} formData.services[index].key
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function updateSubscriptionPack(
  workspaceID: string,
  formData: any,
): Promise<APIResponse> {
  const url = `merchant/transaction/collection/update/subscription/config/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: formData,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "PATCH | UPDATE SUBSCRIPTION DATA", url);
  }
}

/**
 * Retrieves the subscription packs for the given workspace.
 *
 * @param {string} workspaceID The workspace ID.
 *
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function getSubscriptionPacks(
  workspaceID: string,
): Promise<APIResponse> {
  const url = `merchant/transaction/collection/subscription/config/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | SUBSCRIPTION PACKS", url);
  }
}

/**
 * Create a subscription members list for a given workspace.
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {string} formData.member_url The URL of the CSV file containing the members list.
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function uploadSubscriptionMembers(
  workspaceID: string,
  formData: any,
) {
  const url = `merchant/transaction/collection/upload/subscription/members/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: formData,
    });

    return successResponse(res.data);
  } catch (error) {
    handleError(error, "PATCH | UPLOAD SUBSCRIPTION MEMBERS", url);
  }
}

/**
 * Gets a list of members for subscription for a given workspace.
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {object[]} formData.members The array of members.
 * @param {string} formData.members[index].name
 * @param {string} formData.members[index].member_id
 * @param {string} formData.members[index].type
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function getSubscriptionMembers(
  workspaceID: string,
  formData: any,
): Promise<APIResponse> {
  const url = `/merchant/transaction/collection/subscription/members/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: formData,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "PATCH | GET SUBSCRIPTION MEMBERS", url);
  }
}

/**
 * Validates a subscription member for a given workspace.
 *
 * @param {string} workspaceID - The Workspace ID.
 * @param {string} memberID - The Member ID to be validated.
 * @response {object}  {
	member_details: {
        	string member_id
        	string name
        	string type
 },
 //transaction only shows up if the member has an existing transaction record that is pending
	transaction: {
        	string id
        	string workspace_id
		services: [
      			{
        			string name
        			string price
        			string key
     			}
   		] 
        	string total
		string created_at
		string updated_at
     	}
}
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>} 
 * A promise that resolves to an object indicating the success or failure of the operation,
 * including the message, data, status, and statusText.
 */
export async function validateSubscriptionMember(
  workspaceID: string,
  memberID: string,
): Promise<APIResponse> {
  const url = `/merchant/transaction/collection/subscription/${workspaceID}/member/${memberID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | VALIDATE SUBSCRIPTION MEMBER", url);
  }
}

/**
 * Gets a list of institutions for subscriptions.
 *
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function getSubscriptionInstitutions(): Promise<APIResponse> {
  const url = `/merchant/transaction/collection/subscription/institutions
`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "GET | GET SUBSCRIPTION INSTITUTIONS", url);
  }
}

/**
 * Start a payment for a subscription
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {object[]} formData.services The array of service packs to be submitted.
 * @param {string} formData.services[index].name
 * @param {string} formData.services[index].price
 * @param {string} formData.services[index].key
 * @param {string} formData.total
 * @param {object} formData.member_details
 * @param {string} formData.member_details.member_id
 * @param {string} formData.member_details.name
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function startSubscriptionPayment(
  workspaceID: string,
  formData: any,
): Promise<APIResponse> {
  const url = `/merchant/transaction/collection/create/subscription/record/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: formData,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "POST | START SUBSCRIPTION PAYMENT", url);
  }
}

/**
 * COntinue an existing subscription payment transaction.
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {string} formData.total
 * @param {object[]} formData.services The array of service packs to be submitted.
 * @param {string} formData.services[index].name
 * @param {string} formData.services[index].price
 * @param {string} formData.services[index].key

 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function continueSubscriptionPayment(
  transactionID: string,
  formData: any,
): Promise<APIResponse> {
  const url = `/merchant/transaction/collection/update/subscription/record/${transactionID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: formData,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, "PATCH | CONTINUE SUBSCRIPTION PAYMENT", url);
  }
}
