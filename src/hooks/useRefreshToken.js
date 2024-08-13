'use client'
import { apiClient } from '@/lib/utils'
import useAuthStore from '@/context/authStore'
import { getServerSideSession } from '@/app/_actions/auth-actions'

const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  const refresh = async () => {
    const response = await apiClient.get('merchant/user/refresh/token', {
      withCredentials: true,
    })

    let accessToken = response?.data?.accessToken
    setAuth((prev) => {
      console.log(JSON.stringify(prev))
      console.log(response.data.accessToken)
      return { ...prev, accessToken: accessToken }
    })
    return session?.accessToken
  }
  return refresh
}

export default useRefreshToken
