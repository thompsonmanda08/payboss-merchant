'use server'
import { createSession, verifySession } from '@/lib/session'
import { apiClient } from '@/lib/utils'

export async function createNewMerchant(businessInfo) {
  console.log(businessInfo)
  delete businessInfo.business_registration_status // THIS IS BAD...
  console.log(businessInfo)

  try {
    const res = await apiClient.post(`kyc/merchant/new`, businessInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(res)

    if (res.status !== 201) {
      const response = res?.data || res
      return {
        success: false,
        message: response?.error || response?.message,
        data: response?.data || 'No Data',
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
    console.log(error?.response?.data)
    return {
      success: false,
      message: error?.response?.data?.error || 'No Server Response',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function updateMerchantDetails(businessInfo, merchantID) {
  try {
    const res = await apiClient.patch(
      `kyc/merchant/${merchantID}`,
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

export async function createMerchantAdminUser(newAdminUser, merchantID) {
  try {
    const res = await apiClient.post(
      `kyc/merchant/${merchantID}/user/new`,
      newAdminUser,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (res.status !== 201) {
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
    console.log(error.response)
    return {
      success: false,
      message: error?.response?.data?.error || 'No Server Response',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function sendBusinessDocumentRefs(payloadUrls, merchantID) {
  try {
    const res = await apiClient.post(
      `kyc/merchant/${merchantID}/docs`,
      payloadUrls,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (res.status !== 201) {
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

export async function updateBusinessDocumentRefs(payloadUrls, merchantID) {
  try {
    const res = await apiClient.patch(
      `kyc/merchant/${merchantID}/docs`,
      payloadUrls,
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

    const response = res.data
    console.log(response)
    //
    const user = {
      profile: response?.user,
      merchantID: response?.merchantID,
    }
    const role = response?.user?.role
    const accessToken = response?.token
    const refreshToken = response?.refreshToken
    const expiresIn = response?.expires_in

    await createSession(user, role, accessToken, expiresIn, refreshToken)

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
