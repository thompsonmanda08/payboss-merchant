'use server'

import authenticatedService from '@/lib/authenticatedService'

export async function getAllDirectBulkTransactions(workspaceID) {
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

export async function getDirectBulkTransactionDetails(batchID) {
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
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

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
