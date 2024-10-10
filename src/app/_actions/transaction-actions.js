'use server'

import authenticatedService from '@/lib/authenticatedService'

// ****************** ******************************** ************************** //
// ****************** BULK TRANSACTION API ENDPOINTS ************************** //
// ****************** ******************************** ************************** //

// ********************** GET ALL TRANSACTIONS (PAYMENTS) ******************** //
export async function getAllPaymentTransactions(workspaceID) {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/merchant/payment/transactions/${workspaceID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** GET ALL TRANSACTIONS (COLLECTIONS) ******************** //
export async function getAllCollectionTransactions(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/merchant/collection/transactions/${workspaceID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ************* GET ALL BULK TRANSACTIONS (PAYMENTS - DIRECT & VOUCHER) *************** //
export async function getAllBulkTransactions(workspaceID) {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/payments/bulk/batches/${workspaceID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** GET BATCH TRANSACTION DETAILS ******************** //
export async function getBatchDetails(batchID) {
  if (!batchID) {
    return {
      success: false,
      message: 'batch ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/payments/bulk/batch/details/${batchID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** REVIEW (APPROVE OR REJECT) BATCH TRANSACTION ******************** //
export async function reviewBatch(batchID, reviewDetails) {
  // const { action, review } = reviewDetails
  if (!batchID) {
    return {
      success: false,
      message: 'batch ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }
  try {
    const res = await authenticatedService({
      url: `transaction/payments/bulk/review-submission/${batchID}`,
      method: 'POST',
      data: reviewDetails,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** INITIALIZE BATCH TRANSACTION******************** //
export async function initializeBulkTransaction(workspaceID, transactionData) {
  const { batch_name, url, protocol } = transactionData
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/${protocol}/payments/bulk/${workspaceID}`,
      method: 'POST',
      data: transactionData,
    })

    if (res.status == 200 || res.status == 201) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }
    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// TODO: WILL BE REMOVED
export async function updateInvalidDirectBulkTransactionDetails(
  transactionID,
  transactionData,
) {
  const { batchID, destination, amount } = transactionData

  try {
    const res = await authenticatedService({
      url: `transaction/direct/payments/bulk/${transactionID}`,
      method: 'PATCH',
      data: { batchID, destination, amount },
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** SUBMIT BATCH TRANSACTION DETAILS ******************** //
export async function submitBatchForApproval(batchID) {
  // At this point mew records would have been sent to the BE server so we just need to fetch the updated batch
  if (!batchID) {
    return {
      success: false,
      message: 'batch ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/payments/bulk/review-submission/${batchID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

export async function getWalletPrefundHistory(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/wallet/prefund/${workspaceID}/history`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ****************** ******************************** ************************** //
// ****************** SINGLE TRANSACTION API ENDPOINTS ************************** //
// ****************** ******************************** ************************** //

// ************* GET ALL SINGLE TRANSACTIONS (PAYMENTS - DIRECT & VOUCHER) *************** //
export async function getAllSingleTransactions(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/payments/single/transactions/${workspaceID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** INITIALIZE SINGLE TRANSACTION******************** //
export async function initializeSingleTransaction(
  workspaceID,
  transactionData,
) {
  const { protocol } = transactionData

  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/${protocol}/payments/single/${workspaceID}`,
      method: 'POST',
      data: transactionData,
    })

    if (res.status == 200 || res.status == 201) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }
    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** SUBMIT SINGLE TRANSACTION FOR APPROVAL ******************** //
export async function submitTransactionForApproval(ID) {
  if (!ID) {
    return {
      success: false,
      message: 'Transaction ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/payments/single/review-submission/${ID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ********************** REVIEW (APPROVE OR REJECT) SINGLE TRANSACTION ******************** //
export async function reviewSingleTransaction(transactionID, reviewDetails) {
  // const { action, review } = reviewDetails
  if (!transactionID) {
    return {
      success: false,
      message: 'batch ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }
  try {
    const res = await authenticatedService({
      url: `transaction/payments/single/review-submission/${transactionID}`,
      method: 'POST',
      data: reviewDetails,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ****************** ******************************** ************************** //
// ******************  TRANSACTION REPORTS API ENDPOINTS ************************** //
// ****************** ******************************** ************************** //

// ******************************** BULK REPORTS ****************************** //
export async function getBulkAnalyticReports(workspaceID, dateFilter) {
  // const {
  //     "start_date":"2024-08-01",
  //     "end_date":"2014-10-01"
  //  } = dateFilter

  if (!workspaceID) {
    return {
      success: false,
      message: 'workspaceID ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }
  try {
    const res = await authenticatedService({
      url: `analytics/merchant/workspace/${workspaceID}/bulk/payments`,
      method: 'POST',
      data: dateFilter,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// ************************** API COLLECTIONS REPORTS ****************************** //
export async function getAPICollectionsReport(workspaceID, dateFilter) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'workspaceID ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }
  try {
    const res = await authenticatedService({
      url: `analytics/merchant/workspace/${workspaceID}/api-integration/report`,
      method: 'POST',
      data: dateFilter,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// *********************** API COLLECTIONS LATEST TRANSACTIONS ************************* //
export async function getAPICollectionLatestTransactions(
  workspaceID,
  dateFilter,
) {
  // const {
  //     "start_date":"2024-08-01",
  //     "end_date":"2014-10-01"
  //  } = dateFilter

  if (!workspaceID) {
    return {
      success: false,
      message: 'workspaceID ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }

  try {
    const res = await authenticatedService({
      url: `transaction/merchant/collection/api-integration/${workspaceID}`,
      method: 'POST',
      data: dateFilter,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// *********************** TILL NUMBER LATEST TRANSACTIONS ************************* //
export async function getTillCollectionsLatestTransactions(
  workspaceID,
  dateFilter,
) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'workspaceID ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }
  try {
    const res = await authenticatedService({
      url: `transaction/merchant/collection/till/${workspaceID}`,
      method: 'POST',
      data: dateFilter,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

// *********************** TILL NUMBER COLLECTION REPORTS ************************* //
export async function getTillCollectionsReport(workspaceID, dateFilter) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'workspaceID ID is required',
      data: [],
      status: 400,
      statusText: 'BAD_REQUEST',
    }
  }
  try {
    const res = await authenticatedService({
      url: `analytics/merchant/workspace/${workspaceID}/till/report`,
      method: 'POST',
      data: dateFilter,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      }
    }

    return {
      success: false,
      message: res?.data?.error || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error?.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}
