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

export default authenticatedService
