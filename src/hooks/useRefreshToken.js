'use client'
import useAuthStore from '@/context/authStore'
import { getRefreshToken } from '@/app/_actions/auth-actions'

const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth)

  const refresh = async () => {
    const response = await getRefreshToken()

    if (response.success) {
      let accessToken = response?.data?.accessToken
      // console.log('NEW TOKEN' + accessToken)
      setAuth((prev) => {
        // console.log('OLD TOKEN' + JSON.stringify(prev))
        return { ...prev, accessToken }
      })
      return accessToken
    }

    return null
  }
  return refresh
}

export default useRefreshToken
