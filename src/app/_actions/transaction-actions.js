"use server";

import authenticatedService from "@/lib/api-config";

// ****************** ******************************** ************************** //
// ****************** BULK TRANSACTION API ENDPOINTS ************************** //
// ****************** ******************************** ************************** //

/**
 * Retrieves a list of all payment transactions for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the payment
 * transactions are being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of payment transaction objects.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getAllPaymentTransactions(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }
  const url = `transaction/merchant/payment/transactions/${workspaceID}`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | BULK TRANSACTIONS ~ " + url,
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

// ************* GET ALL BULK TRANSACTIONS (PAYMENTS - DIRECT & VOUCHER) *************** //

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
export async function getAllBulkTransactions(workspaceID) {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/payments/bulk/batches/${workspaceID}`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | BULK TRANSACTION DATA ~ " + url,
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
export async function getBatchDetails(batchID) {
  if (!batchID) {
    return {
      success: false,
      message: "batch ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/payments/bulk/batch/details/${batchID}`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | BATCH DETAILS ~ " + url,
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
export async function reviewBatch(batchID, reviewDetails) {
  // const { action, review } = reviewDetails
  if (!batchID) {
    return {
      success: false,
      message: "batch ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/payments/bulk/review-submission/${batchID}`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: reviewDetails,
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
      endpoint: "POST | REVIEW BATCH ~ " + url,
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
export async function initializeBulkTransaction(workspaceID, transactionData) {
  const { protocol } = transactionData;

  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/${protocol}/payments/bulk/${workspaceID}`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: transactionData,
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
      endpoint: "POST | INITIALIZE BATCH TRANSACTION ~ " + url,
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
export async function submitBatchForApproval(batchID) {
  // At this point mew records would have been sent to the BE server so we just need to fetch the updated batch
  if (!batchID) {
    return {
      success: false,
      message: "batch ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/payments/bulk/review-submission/${batchID}`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | SUBMIT BATCH TRANSACTION ~ " + url,
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

export async function getWalletPrefundHistory(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `merchant/workspace/${workspaceID}/wallet/prefund/history`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | WALLET PREFUND HISTORY ~ " + url,
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

// ****************** ******************************** ************************** //
// ****************** SINGLE TRANSACTION API ENDPOINTS ************************** //
// ****************** ******************************** ************************** //

// ************* GET ALL SINGLE TRANSACTIONS (PAYMENTS - DIRECT & VOUCHER) *************** //

/**
 * Retrieves a list of all single transactions for the given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the single
 * transactions are being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of single transaction objects.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getAllSingleTransactions(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/payments/single/transactions/${workspaceID}`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | SINGLE TRANSACTIONS ~ " + url,
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

// ****************** ******************************** ************************** //
// ******************  TRANSACTION REPORTS API ENDPOINTS ************************** //
// ****************** ******************************** ************************** //

// ******************************** BULK REPORTS ****************************** //

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
export async function getBulkAnalyticReports(workspaceID, dateFilter) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `analytics/merchant/workspace/${workspaceID}/bulk/payments`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: dateFilter,
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
      endpoint: "POST | BULK DISBURSEMENT REPORTS ~ " + url,
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
export async function getCollectionsReport(workspaceID, service, dateFilter) {
  if (!workspaceID || !service) {
    return {
      success: false,
      message: "workspaceID Or Service are required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `analytics/merchant/workspace/${workspaceID}/${service}/report`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: dateFilter,
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
      endpoint: "POST | COLLECTIONS REPORT ~ " + url,
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
  workspaceID,
  service,
  dateFilter,
) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/merchant/collection/${service}/${workspaceID}`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: dateFilter,
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
      endpoint: "POST | API COLLECTION TRANSACTIONS ~ " + url,
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
export async function getWalletStatementReport(workspaceID, dateFilter) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }
  const url = `/analytics/merchant/workspace/${workspaceID}/wallet-report`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: dateFilter,
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
      endpoint: "POST | WALLET STATEMENT REPORT ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error ||
        "NextError! See Console for more details",
      data: null,
      status: error?.response?.status || 500,
    };
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

export async function getBillsLatestTransactions(workspaceID, dateFilter) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/merchant/bills/${workspaceID}`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: dateFilter,
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
      endpoint: "POST | BILL PAYMENTS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error ||
        "NextError! See Console for more details",
      data: null,
      status: error?.response?.status || 500,
    };
  }
}

export async function getRecentInvoices(workspaceID, dateFilter) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  const url = `transaction/collection/invoices/${workspaceID}`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: dateFilter,
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
      endpoint: "POST | INVOICES ~ " + url,
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
