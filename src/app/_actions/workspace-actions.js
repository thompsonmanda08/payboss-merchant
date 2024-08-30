'use server'
import authenticatedService from '@/lib/authenticatedService'
import { getUserSession } from '@/lib/session'

export async function initializeWorkspace(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required!',
      data: null,
      status: 400,
      statusText: 'Bad Request',
    }
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/init/${workspaceID}`,
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
        error?.response?.statusText ||
        'Operation Failed!',
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

export async function submitPOP(popDetails, workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required!',
      data: null,
      status: 400,
      statusText: 'Bad Request',
    }
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/wallet/prefund/${workspaceID}`,
      method: 'POST',
      data: popDetails,
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
export async function getWorkspaceMembers(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required!',
      data: null,
      status: 400,
      statusText: 'Bad Request',
    }
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/users/${workspaceID}`,
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
        error?.response?.statusText ||
        'Operation Failed!',
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

export async function getUser(userID) {
  const session = await getUserSession()
  const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedService({
      url: `merchant/user/${userID}`,
    })

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
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
        error?.response?.statusText ||
        'Operation Failed!',
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}

export async function deleteUserFromWorkspace(recordID) {
  try {
    const res = await authenticatedService({
      url: `/merchant/workspace/user/${recordID}`,
      method: 'DELETE',
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

export async function changeUserRoleInWorkspace(mapping, recordID) {
  try {
    const res = await authenticatedService({
      url: `merchant/workspace/user/role/${recordID}`,
      method: 'PATCH',
      data: mapping,
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
    console.log(error?.response)

    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    }
  }
}
