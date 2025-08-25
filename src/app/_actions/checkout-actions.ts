'use server';

import {
  handleBadRequest,
  handleError,
  successResponse,
} from '@/lib/api-config';
import { externalApiClient as apiClient } from '@/lib/utils';
import { APIResponse } from '@/types';

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
export async function validateCheckoutData(
  checkoutData: any,
): Promise<APIResponse> {
  if (
    !checkoutData?.workspaceID ||
    !checkoutData?.transactionID ||
    !checkoutData?.serviceID
  ) {
    return handleBadRequest();
  }

  const url = `transaction/collection/checkout/validation`;

  try {
    const res = await apiClient.post(url, checkoutData);

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | CHECKOUT VALIDATION', url);
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
export async function getCheckoutInfo(
  checkoutID: string,
  serviceID: string,
): Promise<APIResponse> {
  if (!checkoutID) {
    return handleBadRequest('checkout ID is required');
  }

  const url = `merchant/transaction/collection/checkout/${checkoutID}/details/${serviceID}`;

  try {
    const res = await apiClient.get(url);

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'GET | CHECKOUT INFO', url);
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

export async function payWithMobileMoney(
  checkoutData: any,
): Promise<APIResponse> {
  if (
    !checkoutData?.transactionID ||
    !checkoutData?.workspaceID ||
    !checkoutData?.serviceID ||
    !checkoutData?.phoneNumber ||
    !checkoutData?.amount
  ) {
    return handleBadRequest();
  }

  const { transactionID, serviceID, workspaceID, phoneNumber, amount } =
    checkoutData;

  const url = `transaction/collection/${workspaceID}/${serviceID}/mobile/${transactionID}/${phoneNumber}/${amount}`;

  try {
    const res = await apiClient.get(url);

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | PAY WITH MOBILE', url);
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
export async function payWithBankCard(checkoutData: any): Promise<APIResponse> {
  if (
    !checkoutData?.transactionID ||
    !checkoutData?.workspaceID ||
    !checkoutData?.serviceID
  ) {
    return handleBadRequest(
      'Missing Required Params: Transaction/Service/Workspace ID',
    );
  }

  const { serviceID, workspaceID } = checkoutData;

  const url = `transaction/collection/${workspaceID}/${serviceID}/card`;

  try {
    const res = await apiClient.post(url, checkoutData);

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, `POST | CHECKOUT WITH CARD`, url);
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
export async function getTransactionStatus(
  transactionID: string,
): Promise<APIResponse> {
  if (!transactionID) {
    return {
      success: false,
      message: 'Missing Required Params: Transaction ID',
      data: null,
      status: 400,
      statusText: 'BAD REQUEST',
    };
  }

  const url = `transaction/collection/checkout/status/${transactionID}`;

  try {
    const res = await apiClient.get(url);

    return {
      success: true,
      message: 'Transaction status fetched',
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: 'GET | TRANSACTION STATUS ~ ' + url,
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
        'No Server Response',
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
