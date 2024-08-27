import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuthStore from '@/context/authStore'
import authenticatedService, {
  setupInterceptors,
} from '@/lib/authenticatedService'

const useAuthenticatedService = () => {
  const refresh = useRefreshToken()
  const auth = useAuthStore((state) => state.auth)

  useEffect(() => {
    console.log('Adding Token...')
    console.log('Refreshing Token...')
    // Set up the interceptors
    const cleanupInterceptors = setupInterceptors(auth, refresh)

    // Clean up interceptors when the component unmounts or when auth/refresh changes
    return () => {
      cleanupInterceptors()
    }
  }, [auth, refresh])

  return authenticatedService
}

export default useAuthenticatedService
