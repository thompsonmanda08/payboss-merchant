'use client'
import { apiClient } from '@/lib/utils'
import useAuthStore from '@/context/authStore'

const useRefreshToken = () => {
  const { setAuth } = useAuthStore()

  const refresh = async () => {
    const response = await apiClient.get('/auth/refresh', {
      withCredentials: true,
    })
    setAuth((prev) => {
      console.log(JSON.stringify(prev))
      console.log(response.data.accessToken)
      return { ...prev, accessToken: response.data.accessToken }
    })
    return response.data.accessToken
  }
  return refresh
}

export default useRefreshToken
