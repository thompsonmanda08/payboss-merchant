import { authenticatedClient } from '@/lib/utils'
import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuthStore from '@/context/authStore'
import { getServerSideSession } from '@/app/_actions/auth-actions'

const useAuthenticatedService = () => {
  const refresh = useRefreshToken()
  // const { auth } = useAuthStore();

  async function getAccessToken() {
    const session = await getServerSideSession()
    return session?.accessToken
  }

  useEffect(async () => {
    console.log('Adding Token...')
    // console.log('Refreshing Token...')

    const accessToken = await getAccessToken()

    const requestIntercept = authenticatedClient.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    const responseIntercept = authenticatedClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return authenticatedClient(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      authenticatedClient.interceptors.request.eject(requestIntercept)
      authenticatedClient.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh, authenticatedClient])

  return authenticatedClient
}

export default useAuthenticatedService
