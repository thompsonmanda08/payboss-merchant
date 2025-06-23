"use server";

import authenticatedApiClient from "@/lib/api-config";

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
export async function createSubscriptionPack(workspaceID, formData) {
  const url = `merchant/transaction/collection/create/subscription/config/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: formData,
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
      endpoint: "POST SUBSCRIPTION DATA ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
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
export async function updateSubscriptionPack(workspaceID, formData) {
  const url = `merchant/transaction/collection/update/subscription/config/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: formData,
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
      endpoint: "PATCH SUBSCRIPTION DATA ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Retrieves the subscription packs for the given workspace.
 *
 * @param {string} workspaceID The workspace ID.
 *
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function getSubscriptionPack(workspaceID) {
  const url = `merchant/transaction/collection/subscription/config/${workspaceID}`;

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
      endpoint: "GET SUBSCRIPTION PACKS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
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
export async function uploadSubscriptionMembers(workspaceID, formData) {
  const url = `merchant/transaction/collection/upload/subscription/members/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: formData,
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
      endpoint: "GET SUBSCRIPTION PACKS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
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
export async function getSubscriptionMembers(workspaceID, formData) {
  const url = `/merchant/transaction/collection/subscription/members/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "PATCH",
      url,
      data: formData,
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
      endpoint: "GET SUBSCRIPTION PACKS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
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
export async function validateSubscriptionMember(workspaceID, memberID) {
  const url = `/merchant/transaction/collection/subscription/${workspaceID}/member/${memberID}`;

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
      endpoint: "GET SUBSCRIPTION PACKS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Gets a list of institutions for subscriptions.
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {object[]} formData.institutions The array of institutions.
 * @param {string} formData.institutions[index].ID
 * @param {string} formData.institutions[index].workspaceID
 * @param {string} formData.institutions[index].display_name
 * @param {string} formData.institutions[index].logo
 * @param {string} formData.institutions[index].physical_address
 * @param {string} formData.institutions[index].city
 * @param {string} formData.institutions[index].redirect_url
 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function getSubscriptionInstitutions() {
  const url = `/merchant/transaction/collection/subscription/institutions
`;

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
      endpoint: "GET INSTITUTIONS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
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
export async function startSubscriptionPayment(workspaceID, formData) {
  const url = `/merchant/transaction/collection/create/subscription/record/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: formData,
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
      endpoint: "START SUBSCRIPTION PAYMENT ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Update a subscription payment transaction.
 *
 * @param {string} workspaceID The Workspace ID.
 * @param {object} formData The form data object to be submitted.
 * @param {object[]} formData.services The array of service packs to be submitted.
 * @param {string} formData.services[index].name
 * @param {string} formData.services[index].price
 * @param {string} formData.services[index].key

 * @returns {Promise<{success: boolean, message: string, data: object, status: number, statusText: string}>}
 */
export async function updateSubscriptionPayment(transactionID, formData) {
  const url = `/merchant/transaction/collection/update/subscription/record/${transactionID}`;

  try {
    const res = await authenticatedApiClient({
      method: "POST",
      url,
      data: formData,
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
      endpoint: "GET INSTITUTIONS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
