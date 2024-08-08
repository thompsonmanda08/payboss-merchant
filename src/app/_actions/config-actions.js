'use server'

import authenticatedService from '@/lib/authenticatedService'
import {
  createUserSession,
  createWorkspaceSession,
  getServerSession,
  getUserSession,
} from '@/lib/session'
import { apiClient } from '@/lib/utils'
import { cookies } from 'next/headers'

export async function getAccountConfigOptions() {
  try {
    const res = await apiClient.get(`/merchant/onboard/dropdowns`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res?.data,
        status: res.status,
      }
    }

    return {
      success: false,
      message: res?.data?.error || res?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Oops! Error Occurred!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function getUserSetupConfigs() {
  try {
    const res = await authenticatedService({
      url: `merchant/user/setup`,
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

    await createUserSession(
      res.data?.userDetails,
      res.data.userDetails?.merchantID,
    )

    let workspaces = res.data?.workspaces?.map((item) => item?.ID)

    await createWorkspaceSession(workspaces)

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Oops! Error Occurred!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function getUserRoles() {
  const session = await getServerSession()
  const merchantID = session?.user?.merchantID

  try {
    const res = await apiClient.get(
      `merchant/${merchantID}/roles`, //URL
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

export async function createUserRole() {
  const session = await getServerSession(roleDetails)
  const merchantID = session?.user?.merchantID

  try {
    const res = await apiClient.post(
      `merchant/${merchantID}/roles/new`, //URL
      roleDetails, //BODY
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

export async function updateUserRole() {
  const session = await getServerSession(role)
  const merchantID = session?.user?.merchantID

  try {
    const res = await apiClient.patch(
      `merchant/${merchantID}/roles/${role?.ID}`, //URL
      role, // BODY
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
export async function changeWorkspaceVisibility(workspaceID, isVisible) {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/visibility/${workspaceID}`,
      method: 'PATCH',
      data: {
        isVisible,
      },
    })

    if (res.status === 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      }
    }

    const response = res?.data || res

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function createNewWorkspace(newWorkspace) {
  const session = await getUserSession()
  const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedService({
      method: 'POST',
      url: `merchant/workspace/new`,
      data: { ...newWorkspace, merchantID },
    })

    if (res.status == 201 || res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      }
    }

    const response = res?.data || res

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Oops! Something went wrong!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function updateWorkspace({ workspace, description, ID }) {
  const updatedWorkspace = {
    workspace,
    description,
  }

  try {
    const res = await authenticatedService({
      method: 'PATCH',
      url: `merchant/workspace/${ID}`,
      data: updatedWorkspace,
    })

    if (res.status == 201 || res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      }
    }

    const response = res?.data || res

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Oops! Something went wrong!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function deleteWorkspace(workspaceID) {
  try {
    const res = await authenticatedService({
      method: 'DELETE',
      url: `merchant/workspace/${workspaceID}`, //URL
    })

    if (res.status == 201 || res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      }
    }

    const response = res?.data || res

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Oops! Something went wrong!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function getAllWorkspaces() {
  const session = await getUserSession()
  const merchantID = session?.user?.merchantID
  try {
    const res = await authenticatedService({
      url: `merchant/workspaces/${merchantID}`, //URL
    })

    if (res.status === 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      }
    }

    const response = res?.data || res

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Oops! Error Occurred!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function getAllKYCData() {
  const session = await getUserSession()
  const merchantID = session?.user?.merchantID
  try {
    const res = await authenticatedService({
      url: `merchant/${merchantID}`, //URL
    })

    if (res.status === 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      }
    }

    const response = res?.data || res

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || 'Oops! Error Occurred!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function getAuthSession() {
  const session = await getServerSession()
  return session
}

export async function getUserDetails() {
  const session = await getUserSession()
  return session
}

// export async function getWorkspace() {
//   const session = await getWorkspaceSession()
//   return session
// }
