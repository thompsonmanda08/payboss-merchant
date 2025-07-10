"use server";
import authenticatedApiClient from "@/lib/api-config";
import {
  createAuthSession,
  getUserSession,
  updateAuthSession,
  verifySession,
} from "@/lib/session";
import { apiClient } from "@/lib/utils";

import { revokeAccessToken } from "./config-actions";

/**
 * Authenticates a user with their email and password by calling the API endpoint
 * and creates an authentication session upon successful login.
 *
 * @param {LoginDetails} param - An object containing login details.
 * @param {string} param.email - The email of the user.
 * @param {string} param.password - The password of the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 *
 */
export async function authenticateUser(loginCredentials) {
  const url = `merchant/user/authentication`;

  try {
    const res = await apiClient.post(url, loginCredentials);

    const response = res.data;

    const accessToken = response?.token;
    const refreshToken = response?.refreshToken;
    const expiresIn = response?.expires_in;

    await createAuthSession(accessToken, expiresIn, refreshToken);
    // await setupAccountConfig();

    return {
      success: true,
      message: "Login Successful",
      data: { accessToken, refreshToken, expiresIn },
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: `POST | LOGIN ~ ${url}`,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message:
        error?.response?.data?.error || "Login Failed: See Console for details",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Validates a merchant's TPIN,
 * If the TPIN is valid, an API response containing the merchant's information is returned.
 * If the TPIN is invalid, an API response with a message indicating the error is returned.
 * @param {string} tpin - The TPIN to be validated
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function validateTPIN(tpin) {
  const url = `merchant/onboard/continue/${tpin}`;

  try {
    const res = await apiClient.get(url);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | TPIN VALIDATION ~ " + url,
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
}

/**
 * Creates a new merchant by calling the API endpoint and posting the business information.
 * If the operation is successful, an API response containing the merchant's information is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 * @param {BusinessInfo} businessInfo - An object containing the business information of the merchant.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 *
 */
export async function createNewMerchant(businessInfo) {
  const url = `merchant/onboard/new`;

  try {
    const res = await apiClient.post(url, businessInfo);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | NEW MERCHANT ~ " + url,
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
}

/**
 * Submits the merchant's bank details by calling the API endpoint.
 * If the operation is successful, an API response containing the submitted bank details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {Object} data - An object containing the bank details to be submitted.
 * @param {string} merchantID - The ID of the merchant whose bank details are being submitted.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function submitMerchantBankDetails(data, merchantID) {
  if (!merchantID) {
    return {
      success: false,
      message: "Merchant ID is required",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  const url = `merchant/onboard/bank-details/${merchantID}`;

  try {
    const res = await apiClient.post(url, data);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | MERCHANT BANK DATA ~ " + url,
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
}

/**
 * Updates the merchant's details by sending a PATCH request to the API.
 * If the update is successful, an API response containing the updated details is returned.
 * If the update fails, an API response with a message indicating the error is returned.
 *
 * @param {Object} businessInfo - An object containing the new business information of the merchant.
 * @param {string} merchantID - The ID of the merchant whose details are being updated.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function updateMerchantDetails(businessInfo, merchantID) {
  if (!merchantID) {
    return {
      success: false,
      message: "Merchant ID is required",
      data: null,
      status: 400,
    };
  }

  const url = `kyc/merchant/${merchantID}`;

  try {
    const res = await apiClient.patch(url, businessInfo);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "PATCH | MERCHANT KYC DATA ~ " + url,
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
}

/**
 * Creates a new admin user for a merchant by calling the API endpoint.
 * If the operation is successful, an API response containing the new user's details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {Object} newUser - An object containing the new user's details.
 * @param {string} merchantID - The ID of the merchant whose admin user is being created.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 *
 */

export async function createMerchantAdminUser(newUser, merchantID) {
  if (!merchantID) {
    return {
      success: false,
      message: "Merchant ID is required",
      data: null,
      status: 400,
    };
  }

  const url = `merchant/${merchantID}/user/owner`;

  try {
    const res = await apiClient.post(url, newUser);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | NEW MERCHANT ADMIN USER ~ " + url,
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
}

export async function getBusinessDocumentRefs() {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  const url = `merchant/${merchantID}/submitted/document/details`;

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
      endpoint: "GET | MERCHANT BUSINESS DOCS ~ " + url,
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
}

/**
 * Sends the business document references by sending a POST request to the API.
 * If the operation is successful, an API response containing the updated document references is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {array} payloadUrls - An array of URLs containing the updated document references.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function sendBusinessDocumentRefs(payloadUrls) {
  const session = await getUserSession();
  const merchantID = session?.merchantID;
  const url = `merchant/${merchantID}/document/submission`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "POST",
      data: payloadUrls,
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
      endpoint: "POST | MERCHANT BUSINESS DOCS ~ " + url,
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
}

export async function deleteBusinessDocumentRefs(keys) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  const url = `merchant/${merchantID}/documents/for/resubmission`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "PATCH",
      data: { document_names: [...keys] },
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
      endpoint: "PATCH | BUSINESS DOC ~ " + url,
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
}

/**
 * Updates the business document references by sending a PATCH request to the API.
 * If the update is successful, an API response containing the updated document references is returned.
 * If the update fails, an API response with a message indicating the error is returned.
 *
 * @param {array} payloadUrls - An array of URLs containing the updated document references.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function updateBusinessDocumentRefs(payloadUrls) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  const url = `merchant/${merchantID}/document/submission`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: "PATCH",
      data: payloadUrls,
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
      endpoint: "PATCH | BUSINESS DOC ~ " + url,
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
}

/**
 * Refreshes the authentication token by sending a request to the refresh token endpoint.
 * If the operation is successful, a new access token is obtained and a session is created.
 * In case of an error, an appropriate message is returned.
 *
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success or failure of the operation.
 * The object includes:
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An object containing the new access token if successful, otherwise null.
 * - `status`: The HTTP status code of the response.
 * - `statusText`: The HTTP status text of the response.
 */
export async function getRefreshToken() {
  const url = `merchant/user/refresh/token`;

  try {
    const res = await authenticatedApiClient({ url });

    const response = res.data;

    const accessToken = response?.token;
    const refreshToken = response?.refreshToken;
    const expiresIn = response?.expires_in;

    await createAuthSession(accessToken, expiresIn, refreshToken);

    return {
      success: true,
      message: res.message,
      data: { accessToken },
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
      message: error?.response?.data?.error || "Error Refreshing Token",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function submitKYCForReview() {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  const url = `merchant/${merchantID}/document/submit/for/review`;

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
      endpoint: "POST | SUBMIT KYC FOR REVIEW ~ " + url,
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
}

/**
 * Logs the user out of the system by deleting the session and
 * returning true if the logout is successful. If the user is not
 * logged in, the function returns false.
 *
 * @returns {Promise<boolean>} - A promise that resolves to a boolean value
 * indicating whether the logout is successful.
 */
export async function logUserOut() {
  const isLoggedIn = await verifySession();

  if (isLoggedIn) {
    const response = await revokeAccessToken();

    return response?.success;
  }

  return false;
}

/**
 * Locks or unlocks the screen based on the user's idle state.
 * Updates the authentication session with the screen lock status
 * if the user is currently logged in.
 *
 * @param {boolean} state - The state indicating whether the screen
 * should be locked (true) or unlocked (false).
 * @returns {Promise<boolean>} A promise that resolves to a boolean
 * value indicating whether the operation was successful.
 */

export async function lockScreenOnUserIdle(state) {
  const isLoggedIn = await verifySession();

  if (isLoggedIn) {
    await updateAuthSession({ screenLocked: state });

    return isLoggedIn;
  }

  return isLoggedIn;
}
