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

    const response = res?.data || res

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
