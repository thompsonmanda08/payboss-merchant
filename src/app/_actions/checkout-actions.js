"use server";

import { apiClient } from "@/lib/utils";

/**
 * Validates the provided checkout data by ensuring required parameters are present
 * and performing a POST request to the checkout validation endpoint.
 *
 * @param {Object} checkoutData - The checkout data to validate.
 * @param {string} checkoutData.workspaceID - The workspace ID associated with the checkout.
 * @param {string} checkoutData.transactionID - The transaction ID for the checkout.
 * @param {string} checkoutData.serviceID - The service ID related to the checkout.
 * @returns {Object} An object containing the result of the validation. If successful,
 * includes a success status, message, data, status code, and status text. If unsuccessful,
 * provides an error message and status information.
 */

export async function validateCheckoutData(checkoutData) {
  if (
    !checkoutData?.workspaceID ||
    !checkoutData?.transactionID ||
    !checkoutData?.serviceID
  ) {
    return {
      success: false,
      message: "Missing Required Params",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `transaction/collection/checkout/validation`;

  try {
    const res = await apiClient.post(url, checkoutData);

    // revalidatePath("/checkout", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | CHECKOUT DATA VALIDATION ~ " + url,
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
 * Retrieves information about a checkout from the API. If the request is
 * successful, this function will return an object containing the result of the
 * request, including a success status, message, data, status code, and status
 * text. If the request fails, this function will return an object containing an
 * error message and status information.
 *
 * @param {string} checkoutID - The checkout ID for which to retrieve information.
 * @returns {Object} An object containing the result of the request. If successful,
 * includes a success status, message, data, status code, and status text. If
 * unsuccessful, provides an error message and status information.
 */
export async function getCheckoutInfo(checkoutID, serviceID) {
  if (!checkoutID) {
    return {
      success: false,
      message: "checkout ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `merchant/transaction/collection/checkout/${checkoutID}/details/${serviceID}`;

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
      endpoint: "POST | CHECKOUT  DATA ~ " + url,
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
 * Initiates a payment using mobile money by calling the API endpoint with the given transaction ID, phone number, and amount.
 * Validates the necessary checkout data before making the request.
 * If the required parameters are missing, returns a bad request response.
 * If the operation is successful, a response containing the transaction details is returned.
 * If the operation fails, logs the error and returns a response with the error details.
 *
 * @param {Object} checkoutData - An object containing the transaction details.
 * @param {string} checkoutData.transactionID - The ID of the transaction.
 * @param {string} checkoutData.phoneNumber - The phone number for the mobile money payment.
 * @param {number} checkoutData.amount - The amount to be paid.
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success or failure of the operation, along with relevant data or error details.
 */

export async function payWithMobileMoney(checkoutData) {
  if (
    !checkoutData?.transactionID ||
    !checkoutData?.phoneNumber ||
    !checkoutData?.amount
  ) {
    return {
      success: false,
      message: "Missing Required Params",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const { transactionID, phoneNumber, amount } = checkoutData;

  const url = `transaction/collection/checkout/mobile/${transactionID}/${phoneNumber}/${amount}`;

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
      endpoint: "GET | PAY WITH MOBILE ~ " + url,
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
 * Initiates a checkout using a bank card. If the request is successful, this
 * function will return an object containing the result of the request, including
 * a success status, message, data, status code, and status text. If the request
 * fails, this function will return an object containing an error message and
 * status information.
 *
 * @param {Object} checkoutData - The checkout data object to send to the API.
 * @param {string} checkoutData.workspaceID - The workspace ID for the checkout.
 * @param {string} checkoutData.transactionID - The transaction ID for the checkout.
 * @param {string} checkoutData.serviceID - The service ID for the checkout.
 * @returns {Object} An object containing the result of the request. If successful, includes a success status, message, data, status code, and status text. If unsuccessful, provides an error message and status information.
 */
export async function payWithBankCard(checkoutData) {
  if (!checkoutData?.transactionID) {
    return {
      success: false,
      message: "Missing Required Params: Transaction ID",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }
  const url = `transaction/collection/checkout/card`;

  try {
    const res = await apiClient.post(url, checkoutData);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | CHECKOUT WITH CARD ~ " + url,
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
 * Retrieves the status of a transaction using a transaction ID. If the request is
 * successful, this function will return an object containing the result of the
 * request, including a success status, message, data, status code, and status
 * text. If the request fails, this function will return an object containing an
 * error message and status information.
 *
 * @param {string} transactionID - The transaction ID for which to retrieve the status.
 * @returns {Object} An object containing the result of the request. If successful, includes a success status, message, data, status code, and status text. If unsuccessful, provides an error message and status information.
 */
export async function getTransactionStatus(transactionID) {
  if (!transactionID) {
    return {
      success: false,
      message: "Missing Required Params: Transaction ID",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `transaction/collection/checkout/status/${transactionID}`;

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
      endpoint: "GET | TRANSACTION STATUS ~ " + url,
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
 * Completes the checkout process by updating the status of a transaction using the provided transaction ID and status.
 * If the request is successful, this function will return an object containing the result of the request, including
 * a success status, message, data, status code, and status text. If the request fails, this function will return an
 * object containing an error message and status information.
 *
 * @param {string} transactionID - The transaction ID for which to update the status.
 * @param {string} status - The new status to set for the transaction.
 * @returns {Object} An object containing the result of the request. If successful, includes a success status, message,
 * data, status code, and status text. If unsuccessful, provides an error message and status information.
 */

// export async function completeCheckoutProcess(transactionID, status) {
//   if (!transactionID || !status) {
//     return {
//       success: false,
//       message: "Missing Required Params: Transaction ID or Status",
//       data: null,
//       status: 400,
//       statusText: "BAD REQUEST",
//     };
//   }

//   const url = `transaction/collection/checkout/transaction/${transactionID}/status/${status}`;

//   try {
//     const res = await apiClient.get(url);

//     return {
//       success: true,
//       message: res.message,
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     };
//   } catch (error) {
//     console.error({
//       endpoint: "GET | SEND TRANSACTION STATUS ~ " + url,
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
