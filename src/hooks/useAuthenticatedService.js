import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuthStore from '@/context/authStore'
import { apiClient } from '@/lib/utils'

const useAuthenticatedService = () => {
  const refresh = useRefreshToken()
  const auth = useAuthStore((state) => state.auth)

  useEffect(() => {
    console.log('Adding Token...')
    console.log('Refreshing Token...')
    // Set up the interceptors
    const requestIntercept = apiClient.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response Interceptor
    const responseIntercept = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return apiClient(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    // Return a cleanup function to remove interceptors if needed
    return () => {
      apiClient.interceptors.request.eject(requestIntercept)
      apiClient.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return auth
}

export default useAuthenticatedService
