'use server'
import authenticatedService from '@/lib/authenticatedService'
import { getUserSession } from '@/lib/session'

export async function createNewUser(newUser) {
  const session = await getUserSession()
  const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedService({
      method: 'POST',
      url: `merchant/${merchantID}/user/new`,
      data: newUser,
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
    console.error(error)

    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function getAllUsers() {
  const session = await getUserSession()
  const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedService({
      url: `merchant/users/${merchantID}`,
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
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}

export async function assignUsersToWorkspace(users, workspaceID) {
  // const users = [
  //   {
  //     userID: 'string',
  //     roleID: 'string',
  //   },
  // ]

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/user/mapping/${workspaceID}`,
      method: 'POST',
      data: {
        users: [...users],
      },
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
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status || error.status,
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
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: error?.response?.data?.error || 'Operation Failed!',
      data: null,
      status: error?.response?.status || error.status,
    }
  }
}
