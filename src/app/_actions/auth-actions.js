"use server";
import authenticatedService from "@/lib/api-config";
import {
  createAuthSession,
  deleteSession,
  getUserSession,
  updateAuthSession,
  verifySession,
} from "@/lib/session";

import { apiClient } from "@/lib/utils";

/**
 * Validates a merchant's TPIN, 
 * If the TPIN is valid, an API response containing the merchant's information is returned.
 * If the TPIN is invalid, an API response with a message indicating the error is returned.
 * @param {string} tpin - The TPIN to be validated
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 * 
 */
export async function validateTPIN(tpin) {
  try {
    const res = await apiClient.get(
      `merchant/onboard/continue/${tpin}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: res.message,
      data: res?.data,
      status: res.status,
    };
  } catch (error) {
    console.error(error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
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
  try {
    const res = await apiClient.post(`merchant/onboard/new`, businessInfo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: true,
      message: res.message,
      data: res?.data,
      status: res.status,
    };
  } catch (error) {
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
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
  try {
    const res = await apiClient.post(
      `merchant/onboard/bank-details/${merchantID}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status == 201 || res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res?.data,
        status: res.status,
      };
    }

    return {
      success: false,
      message: res?.data?.error || res?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    console.error(error?.response?.data);
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
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
  try {
    const res = await apiClient.patch(
      `kyc/merchant/${merchantID}`,
      businessInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status !== 200) {
      const response = res?.data || res;
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      };
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status || error.status,
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
  try {
    const res = await apiClient.post(
      `/merchant/${merchantID}/user/new`,
      newUser,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status == 201) {
      return {
        success: true,
        message: res.message,
        data: res?.data,
        status: res.status,
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
    console.error(error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function sendBusinessDocumentRefs(payloadUrls) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  try {
    const res = await authenticatedService({
      url: `merchant/onboard/documents/${merchantID}`,
      method: "POST",
      data: payloadUrls,
    });

    if (res.status == 201) {
      return {
        success: true,
        message: res.message,
        data: res?.data,
        status: res.status,
      };
    }

    return {
      success: false,
      message: res?.data?.error || res?.message,
      data: res?.data || res,
      status: res.status,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation failed!",
      data:
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.response,
      status: error?.response?.status || error.status,
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
  try {
    const res = await authenticatedService({
      url: `merchant/onboard/update/documents/${merchantID}`,
      method: "PATCH",
      data: payloadUrls,
    });

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res?.data,
        status: res.status,
      };
    }

    return {
      success: false,
      message: res?.data?.error || res?.message,
      data: res?.data || res,
      status: res.status,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data:
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.response,
      status: error?.response?.status || error.status,
    };
  }
}

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
  try {
    const res = await apiClient.post(
      `merchant/user/authentication`,
      loginCredentials
    );

    const response = res.data;

    const accessToken = response?.token;
    const refreshToken = response?.refreshToken;
    const expiresIn = response?.expires_in;

    await createAuthSession(accessToken, expiresIn, refreshToken);

    return {
      success: true,
      message: res.message,
      data: { accessToken, expiresIn },
      status: res.status,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error?.response?.data?.error || "Oops! Login Failed, Try Again!.",
      data: null,
      status: error?.response?.status || error.status,
    };
  }
}

export async function getRefreshToken() {
  try {
    const res = await authenticatedService({
      url: `/merchant/user/refresh/token`,
    });

    if (res.status == 200) {
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
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function logUserOut() {
  const isLoggedIn = await verifySession();
  if (isLoggedIn) {
    await deleteSession();
    return true;
  }
  return false;
}

export async function lockScrenOnUserIdle(state) {
  const isLoggedIn = await verifySession();
  if (isLoggedIn) {
    await updateAuthSession({ screenLocked: state });
    return true;
  }
  return false;
}
