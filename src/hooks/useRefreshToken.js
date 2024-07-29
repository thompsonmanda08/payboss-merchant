'use client'
import { apiClient } from '@/lib/utils'
import useAuthStore from '@/context/authStore'
import { getServerSideSession } from '@/app/_actions/auth-actions'

const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  const refresh = async () => {
    // const response = await apiClient.get('/auth/refresh', {
    //   withCredentials: true,
    // })

    let session = await getServerSideSession()
    setAuth((prev) => {
      // console.log(JSON.stringify(prev))
      // console.log(response.data.accessToken)
      return { ...prev, accessToken: session?.accessToken }
    })
    return session?.accessToken
  }
  return refresh
}

export default useRefreshToken
