'use server'
import { getServerSession } from '@/lib/session'
import { apiClient, authenticatedClient } from '@/lib/utils'

export async function getAccountConfigOptions() {
  try {
    const res = await apiClient.get(`general/details`, {
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

export async function setupUserPreferences() {
  try {
    const res = await authenticatedClient.get(`merchant/user/setup`)

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

export async function getUserRoles() {
  const session = await getServerSession()
  const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedClient.get(
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
    const res = await authenticatedClient.post(
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

export async function createNewWorkspace({ workspace, description }) {
  const session = await getServerSession(roleDetails)
  const merchantID = session?.user?.merchantID

  const newWorkspace = {
    workspace,
    description,
    merchantID,
  }

  try {
    const res = await authenticatedClient.post(
      `merchant/workspace/new`, //URL
      newWorkspace, // BODY
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

export async function updateWorkspace({ workspace, description }) {
  const session = await getServerSession(roleDetails)
  const workspaceID = session?.workspaceID

  const updatedWorkspace = {
    workspace,
    description,
  }

  try {
    const res = await authenticatedClient.patch(
      `merchant/workspace/${workspaceID}`,

      updatedWorkspace,
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

export async function deleteWorkspace({ workspace, description }) {
  const session = await getServerSession(roleDetails)
  const workspaceID = session?.workspaceID

  try {
    const res = await authenticatedClient.delete(
      `merchant/workspace/${workspaceID}`,
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
