'use server'

import authenticatedService from '@/lib/authenticatedService'
import { getUserSession } from '@/lib/session'

export async function getAllDirectBulkBatches(workspaceID) {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedService({
      url: `transaction/direct/payments/bulk/batches/${workspaceID}`,
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
      message: res?.data?.error || res?.statusText || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.data?.error ||
        error?.response?.statusText ||
        'Operation Failed!',
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

export async function getDirectBulkBatchDetails(batchID) {
  try {
    const res = await authenticatedService({
      url: `transaction/direct/payments/bulk/batch/details/${batchID}`,
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
      message: res?.data?.error || res?.statusText || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.data?.error ||
        error?.response?.statusText ||
        'Operation Failed!',
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

export async function reviewBatch(batchID, reviewDetails) {
  // const { action, review } = reviewDetails
  try {
    const res = await authenticatedService({
      url: `transaction/direct/payments/bulk/${batchID}`,
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
      message: res?.data?.error || res?.statusText || 'Operation Failed!',
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    }
  } catch (error) {
    console.error(error)
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
  // const { batch_name, url } = transactionData

  try {
    const res = await authenticatedService({
      url: `transaction/direct/payments/bulk/${workspaceID}`,
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
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}
