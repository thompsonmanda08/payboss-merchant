'use server';
import authenticatedApiClient, {
  handleBadRequest,
  handleError,
  successResponse,
} from '@/lib/api-config';
import {
  createAuthSession,
  getUserSession,
  updateAuthSession,
  verifySession,
} from '@/lib/session';
import { apiClient } from '@/lib/utils';
import { APIResponse } from '@/types';
import {
  AccountOwner,
  BankAccountDetails,
  BusinessDetails,
  DocumentUrls,
  LoginPayload,
} from '@/types/account';

/**
 * Authenticates a user with their email and password by calling the API endpoint
 * and creates an authentication session upon successful login.
 *
 * @param {LoginDetails} loginCredentials - An object containing login details.
 * @param {string} loginCredentials.email - The email of the user.
 * @param {string} loginCredentials.password - The password of the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 *
 */
export async function authenticateUser(
  loginCredentials: LoginPayload,
): Promise<APIResponse> {
  const url = `merchant/user/authentication`;

  try {
    const res = await apiClient.post(url, loginCredentials);

    const response = res.data;

    const accessToken = response?.token;

    await createAuthSession(accessToken);

    return successResponse({ accessToken }, res.data?.message);
  } catch (error: Error | any) {
    return handleError(error, 'POST | LOGIN', url);
  }
}

/**
 * Validates a merchant's TPIN,
 * If the TPIN is valid, an API response containing the merchant's information is returned.
 * If the TPIN is invalid, an API response with a message indicating the error is returned.
 * @param {string} tpin - The TPIN to be validated
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 */
export async function validateTPIN(tpin: string): Promise<APIResponse> {
  const url = `merchant/onboard/continue/${tpin}`;

  try {
    const res = await apiClient.get(url);

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | VALIDATE TPIN', url);
  }
}

/**
 * Creates a new merchant by calling the API endpoint and posting the business information.
 * If the operation is successful, an API response containing the merchant's information is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 * @param {BusinessDetails} businessInfo - An object containing the business information of the merchant.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object which indicates the success or failure of the operation.
 *
 */
export async function createNewMerchant(
  businessInfo: BusinessDetails,
): Promise<APIResponse> {
  const url = `merchant/onboard/new`;

  try {
    const res = await apiClient.post(url, businessInfo);

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | CREATE MERCHANT', url);
  }
}

/**
 * Submits the merchant's bank details by calling the API endpoint.
 * If the operation is successful, an API response containing the submitted bank details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {BankAccountDetails} data - An object containing the bank details to be submitted.
 * @param {string} merchantID - The ID of the merchant whose bank details are being submitted.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function submitMerchantBankDetails(
  data: BankAccountDetails,
  merchantID: string,
): Promise<APIResponse> {
  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }

  const url = `merchant/onboard/bank-details/${merchantID}`;

  try {
    const res = await apiClient.post(url, data);

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | SUBMIT BANK DETAILS', url);
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
export async function updateMerchantDetails(
  businessInfo: Partial<BusinessDetails>,
  merchantID: string,
): Promise<APIResponse> {
  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }

  const url = `kyc/merchant/${merchantID}`;

  try {
    const res = await apiClient.patch(url, businessInfo);

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'PATCH | UPDATE MERCHANT DETAILS', url);
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

/**
 * Creates a new admin user for a merchant by calling the API endpoint.
 * If the operation is successful, an API response containing the new user's details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {AccountOwner} newUser - An object containing the new user's details.
 * @param {string} merchantID - The ID of the merchant whose admin user is being created.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 *
 */
export async function createMerchantAdminUser(
  newUser: AccountOwner,
  merchantID: string,
): Promise<APIResponse> {
  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }

  const url = `merchant/${merchantID}/user/owner`;

  try {
    const res = await apiClient.post(url, newUser);

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | CREATE ADMIN USER', url);
  }
}

/**
 * Retrieves the submitted business document references for a merchant by calling the API endpoint.
 * If the operation is successful, an API response containing the document references is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function getBusinessDocumentRefs(): Promise<APIResponse> {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }

  const url = `merchant/${merchantID}/submitted/document/details`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'GET | DOCUMENT REFERENCES', url);
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
export async function sendBusinessDocumentRefs(
  payloadUrls: DocumentUrls,
): Promise<APIResponse> {
  const session = await getUserSession();
  const merchantID = session?.merchantID;

  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }

  const url = `merchant/${merchantID}/document/submission`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: payloadUrls,
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | DOCUMENT REFERENCES', url);
  }
}

/**
 * Deletes the specified business document references by sending a PATCH request to the API.
 * If the operation is successful, an API response containing the updated document references is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {Partial<keyof DocumentUrls>} keys - An object containing the keys of the document references to be deleted.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */
export async function deleteBusinessDocumentRefs(
  keys: Partial<keyof DocumentUrls>[],
): Promise<APIResponse> {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }

  const url = `merchant/${merchantID}/documents/for/resubmission`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'PATCH',
      data: { document_names: [...keys] },
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'PATCH/DELETE | DOCUMENT REFERENCES', url);
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
export async function updateBusinessDocumentRefs(
  payloadUrls: DocumentUrls,
): Promise<APIResponse> {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  if (!merchantID) {
    return handleBadRequest('Merchant ID is required');
  }
  const url = `merchant/${merchantID}/document/submission`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'PATCH',
      data: payloadUrls,
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'PATCH | DOCUMENT REFERENCES', url);
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
export async function getRefreshToken(): Promise<APIResponse> {
  const url = `merchant/user/refresh/token`;

  try {
    const res = await authenticatedApiClient({ url });

    const response = res.data;

    const accessToken = response?.token;

    await createAuthSession(accessToken);

    return successResponse({ accessToken }, res.data?.message);
  } catch (error: Error | any) {
    return handleError(error, 'POST | REFRESH TOKEN', url);
  }
}

export async function submitKYCForReview() {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  const url = `merchant/${merchantID}/document/submit/for/review`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, 'POST | SUBMIT FOR REVIEW', url);
  }
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

export async function lockScreenOnUserIdle(state: boolean): Promise<boolean> {
  const isLoggedIn = await verifySession();

  if (isLoggedIn) {
    await updateAuthSession({ screenLocked: state });

    return isLoggedIn;
  }

  return isLoggedIn;
}
