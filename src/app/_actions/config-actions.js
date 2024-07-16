'use server'
import { COOKIE_ME } from '@/lib/constants'
import { apiClient } from '@/lib/utils'
import { cookies } from 'next/headers'

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
export async function getUserRoles() {
  try {
    const res = await apiClient.get(`merchant/roles`, {
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


