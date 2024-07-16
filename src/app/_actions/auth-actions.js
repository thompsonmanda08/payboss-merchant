'use server'
import { verifySession } from '@/lib/session'
import { apiClient } from '@/lib/utils'

export async function createNewMerchant(businessInfo) {
  try {
    const res = await apiClient.post(`kyc/merchant/new`, businessInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.status !== 200) {
      const response = res?.data || res
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      }
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'No Server Response',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function updateMerchantDetails(businessInfo) {
  const { session } = await verifySession()
  const merchantId = session?.user?.id
  try {
    const res = await apiClient.post(
      `kyc/merchant/${merchantId}`,
      businessInfo,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (res.status !== 200) {
      const response = res?.data || res
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      }
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'No Server Response',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function createMerchantAdminUser(newAdminUser) {
  const { session } = await verifySession()
  const merchantId = session?.user?.id
  try {
    const res = await apiClient.post(
      `kyc/merchant/${merchantId}/user/new`,
      newAdminUser,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (res.status !== 200) {
      const response = res?.data || res
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      }
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'No Server Response',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function authenticateUser(loginCredentials) {
  try {
    const res = await apiClient.post(
      `authentication/merchant/user`,
      loginCredentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (res.status !== 200) {
      const response = res?.data || res
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      }
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'No Server Response',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}
