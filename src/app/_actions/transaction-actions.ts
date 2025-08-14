'use server';

import authenticatedApiClient, {
  handleBadRequest,
  handleError,
  successResponse,
} from '@/lib/api-config';
import { APIResponse } from '@/types';

// ****************** ******************************** ************************** //
// ****************** BULK TRANSACTION API ENDPOINTS ************************** //
// ****************** ******************************** ************************** //

/**
 * Retrieves a list of all bulk transactions for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the bulk
 * transactions are being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of bulk transaction objects.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getAllBulkTransactions(
  workspaceID: string,
): Promise<APIResponse> {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/transaction/payments/bulk/batches/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'GET | BULK TRANSACTIONS', url);
  }
}

// ********************** GET BATCH TRANSACTION DETAILS ******************** //

/**
 * Retrieves the details of a batch transaction for the given batch ID.
 *
 * @param {string} batchID - The ID of the batch transaction to retrieve.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An object containing the batch transaction details.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getBatchDetails(batchID: string): Promise<APIResponse> {
  if (!batchID) {
    return handleBadRequest('Batch ID is required');
  }

  const url = `merchant/transaction/payments/bulk/batch/details/${batchID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'GET | BATCH DETAILS', url);
  }
}

// ********************** REVIEW (APPROVE OR REJECT) BATCH TRANSACTION ******************** //

/**
 * Reviews a batch transaction by submitting a review action (approve or reject).
 *
 * @param {string} batchID - The ID of the batch transaction to be reviewed.
 * @param {Object} reviewDetails - The review details containing the action and any
 * additional review information.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of response data from the review submission.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function reviewBatch(
  batchID: string,
  reviewDetails: any,
): Promise<APIResponse> {
  // const { action, review } = reviewDetails
  if (!batchID) {
    return handleBadRequest('Batch ID is required');
  }

  const url = `transaction/payments/bulk/review-submission/${batchID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: reviewDetails,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | REVIEW BATCH', url);
  }
}

// ********************** INITIALIZE BATCH TRANSACTION******************** //

/**
 * Initializes a batch transaction by submitting a request containing the required
 * batch details to the server.
 *
 * @param {string} workspaceID - The ID of the workspace in which the batch
 * transaction is being initialized.
 * @param {Object} transactionData - An object containing the required batch
 * details, including the batch name, payment URL and protocol.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of response data from the initialization request.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function initializeBulkTransaction(
  workspaceID: string,
  transactionData: any,
): Promise<APIResponse> {
  const { protocol } = transactionData;

  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `transaction/${protocol}/payments/bulk/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: transactionData,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | INITIALIZE BATCH TRANSACTION', url);
  }
}

// ********************** SUBMIT BATCH TRANSACTION DETAILS ******************** //

/**
 * Submits a batch transaction for approval.
 *
 * @param {string} batchID - The ID of the batch transaction to be submitted for
 * approval.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of response data from the submission request.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function submitBatchForApproval(
  batchID: string,
): Promise<APIResponse> {
  // At this point mew records would have been sent to the BE server so we just need to fetch the updated batch
  if (!batchID) {
    return handleBadRequest('Batch ID is required');
  }

  const url = `transaction/payments/bulk/review-submission/${batchID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'GET | SUBMIT BATCH TRANSACTION', url);
  }
}

/**
 * Retrieves a list of all prefund requests made by the logged-in
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

export async function getWalletPrefundHistory(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund/history`;

  try {
    const res = await authenticatedApiClient({ url });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'GET | WALLET PREFUND HISTORY', url);
  }
}

/**
 * Retrieves bulk analytic reports for a specific workspace within a given date range.
 *
 * @param {string} workspaceID - The ID of the workspace for which the bulk analytic reports are being fetched.
 * @param {Object} dateFilter - An object containing the date range for filtering reports, with properties `start_date` and `end_date`.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of bulk analytic report data.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getBulkAnalyticReports(
  workspaceID: string,
  dateFilter: any,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `analytics/merchant/workspace/${workspaceID}/bulk/payments`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: dateFilter,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | BULK ANALYTIC REPORTS', url);
  }
}

// ********************* API & TILL COLLECTIONS REPORTS ************************** //

/**
 * Retrieves a collection report for a specific workspace and service based on the provided date filter.
 *
 * @param {string} workspaceID - The ID of the workspace for which the report is being fetched.
 * @param {string} service - The service for which the report is being generated.
 * @param {Object} dateFilter - An object containing the date range for filtering reports, with properties `start_date` and `end_date`.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array containing the report data.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getCollectionsReport(
  workspaceID: string,
  service: string,
  dateFilter: any,
): Promise<APIResponse> {
  if (!workspaceID || !service) {
    return handleBadRequest('Workspace ID and Service are required');
  }

  const url = `analytics/merchant/workspace/${workspaceID}/${service}/report`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: dateFilter,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | COLLECTIONS REPORT', url);
  }
}

// *********************** API/TILL COLLECTIONS LATEST TRANSACTIONS ************************* //

/**
 * Retrieves the latest transactions for a specific workspace using the
 * API collection service based on the provided date filter.
 *
 * @param {string} workspaceID - The ID of the workspace for which the latest
 * transactions are being fetched.
 * @param {string} service - The name of the service for which the latest
 * transactions are being fetched. // api-collections or till
 * @param {Object} dateFilter - An object containing the date range for
 * filtering transactions, with properties `start_date` and `end_date`.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array containing the latest transactions.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */

export async function getCollectionLatestTransactions(
  workspaceID: string,
  service: string,
  dateFilter: any,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/transaction/collections/${service}/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: dateFilter,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | API COLLECTION TRANSACTIONS', url);
  }
}

// ********************** WALLET STATEMENT REPORTS **************************** //

/**
 * Retrieves a wallet statement report for a specific workspace within a given date range.
 *
 * @param {string} workspaceID - The ID of the workspace for which the report is being fetched.
 * @param {Object} dateFilter - An object containing the date range for filtering reports, with properties `start_date` and `end_date`.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of report data.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getWalletStatementReport(
  workspaceID: string,
  dateFilter: any,
) {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }
  const url = `/analytics/merchant/workspace/${workspaceID}/wallet-report`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: dateFilter,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | WALLET STATEMENT REPORT', url);
  }
}

// *********************** BILLS LATEST TRANSACTIONS ************************* //

/**
 * Retrieves the latest transactions for a specific workspace within a given date range.
 *
 * @param {string} workspaceID - The ID of the workspace for which the latest
 * transactions are being fetched.
 * @param {Object} dateFilter - An object containing the date range for filtering
 * transactions, with properties `start_date` and `end_date`.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following
 * properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of transaction objects.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */

export async function getBillsLatestTransactions(
  workspaceID: string,
  dateFilter: any,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `transaction/merchant/bills/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: dateFilter,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | BILL PAYMENTS', url);
  }
}

export async function getRecentInvoices(workspaceID: string, dateFilter: any) {
  if (!workspaceID) {
    return handleBadRequest('Workspace ID is required');
  }

  const url = `merchant/transaction/collection/invoices/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: dateFilter,
    });

    return successResponse(res.data);
  } catch (error) {
    return handleError(error, 'POST | INVOICES', url);
  }
}
