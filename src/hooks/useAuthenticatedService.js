import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuthStore from '@/context/authStore'
import authenticatedService from '@/lib/authenticatedService'

const useAuthenticatedService = () => {
  const refresh = useRefreshToken()
  const auth = useAuthStore((state) => state.auth)

  useEffect(async () => {
    console.log('Adding Token...')
    console.log('Refreshing Token...')

    const requestIntercept = authenticatedService.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // TODO: THIS IS WHERE WE TRIGGER A REFRESH IN THE FUTURE
    const responseIntercept = authenticatedService.interceptors.response.use(
      // IF THE RESPONSE IS OK
      (response) => response,

      //IF AN ERROR OCCURS
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return authenticatedService(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      authenticatedService.interceptors.request.eject(requestIntercept)
      authenticatedService.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return authenticatedService
}

export default useAuthenticatedService
