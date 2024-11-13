'use server'

import { getAuthSession } from '@/app/_actions/config-actions'

import { apiClient } from './utils'

const authenticatedService = async (request) => {
  const session = await getAuthSession()
  return await apiClient({
    method: 'GET',
    headers: {
      'Content-type': request.contentType
        ? request.contentType
        : 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
    },
    withCredentials: true,
    ...request,
  })
}

// Function to set up the interceptors
// export const setupInterceptors = (auth, refresh) => {
//   // Request Interceptor
//   const requestIntercept = apiClient.interceptors.request.use(
//     (config) => {
//       if (!config.headers['Authorization']) {
//         config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
//       }
//       return config
//     },
//     (error) => Promise.reject(error),
//   )

//   // Response Interceptor
//   const responseIntercept = apiClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const prevRequest = error?.config
//       if (error?.response?.status === 403 && !prevRequest?.sent) {
//         prevRequest.sent = true
//         const newAccessToken = await refresh()
//         prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
//         return apiClient(prevRequest)
//       }
//       return Promise.reject(error)
//     },
//   )

//   // Return a cleanup function to remove interceptors if needed
//   return () => {
//     apiClient.interceptors.request.eject(requestIntercept)
//     apiClient.interceptors.response.eject(responseIntercept)
//   }
// }

export default authenticatedService
