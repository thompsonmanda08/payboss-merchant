import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

import { getAuthSession } from '@/app/_actions/config-actions';
import { APIResponse } from '@/types';

import { apiClient } from './utils';

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: Error | any) => {
    const originalRequest = error.config;

    // Network error (no response)
    if (!error.response) {
      return Promise.reject({
        type: 'NoResponse Error',
        message: 'No response from server. Please try again.',
        request: originalRequest,
        details: error,
      });
    }

    // Timeout error
    if (error.code === 'ECONNABORTED') {
      throw {
        ...error,
        type: 'Timeout Error',
        message: 'Request timed out! Please try again.',
      };
    }

    //network error

    if (
      error.code == 'ECONNREFUSED' ||
      error.code == 'ECONNRESET' ||
      error.code == 'ENOTFOUND'
    ) {
      return Promise.reject({
        type: 'Network Error',
        message: 'Please check your internet connection.',
      });
    }

    const { status, data } = error.response;

    // Handle specific error codes
    const errorMap: { [x: string]: string } = {
      400: 'Bad request',
      403: 'Forbidden',
      404: 'Resource not found',
      500: 'Internal server error',
      502: 'Bad gateway',
      503: 'Service unavailable',
    };

    throw {
      ...error,
      type: 'api',
      status,
      message: data?.message || errorMap[status] || 'Request failed',
      details: data?.errors || {},
    };
  },
);

export type RequestType = AxiosRequestConfig & {
  contentType?: AxiosRequestHeaders['Content-Type'];
};

const authenticatedApiClient = async (request: RequestType) => {
  const session = await getAuthSession();

  const config = {
    method: 'GET',
    headers: {
      'Content-type': request.contentType
        ? request.contentType
        : 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
    },
    withCredentials: true,
    ...request,
  };

  return await apiClient(config);
};

export default authenticatedApiClient;

/**
 * Constructs a standardized API response object for a successful operation.
 *
 * @param {any | null} data - The data to include in the response object, or null if no data is provided.
 * @param {string} [message="Action completed successfully"] - The message to include in the response object.
 * @returns {APIResponse} - The standardized API response object.
 */

export function successResponse(
  data: any | null,
  message: string = 'Action completed successfully',
): APIResponse {
  return {
    success: true,
    message,
    data,
    status: 200,
    statusText: 'OK',
  };
}

/**
 * Returns an API response indicating that a request has bad parameters.
 * @param {string} [message="Missing required parameters"] The message to return
 * @returns {APIResponse} The API response
 */
export function handleBadRequest(
  message: string = 'Missing required parameters',
): APIResponse {
  return {
    success: false,
    message,
    data: null,
    status: 400,
    statusText: 'BAD_REQUEST',
  };
}

/**
 * Constructs a standardized API response object for a 401 UNAUTHORIZED status.
 * Used when a request cannot be authenticated.
 *
 * @param {string} [message="Unauthorized"] - The message to include in the response object.
 * @returns {APIResponse} - The standardized API response object.
 */
export function unauthorizedResponse(
  message: string = 'Unauthorized',
): APIResponse {
  return {
    success: false,
    message,
    data: null,
    status: 401,
    statusText: 'UNAUTHORIZED',
  };
}

/**
 * Constructs a standardized API response object for a 404 NOT FOUND status.
 * Used when the requested resource could not be found.
 *
 * @param {string} message - The error message to be sent in the response.
 * @returns {APIResponse} - An object containing the success status, error message, and status details.
 */
export function notFoundResponse(message: string): APIResponse {
  return {
    success: false,
    message,
    data: null,
    status: 404,
    statusText: 'NOT FOUND',
  };
}

/**
 * Handles and logs errors from API requests, constructs a standardized API response object.
 * Logs the error details, including endpoint information, status, headers, and data.
 *
 * @param {any} error - The error object caught from an API request.
 * @param {string} [method="GET"] - The HTTP method used for the request.
 * @param {string} url - The URL endpoint of the API request.
 * @returns {APIResponse} - An object containing the success status, error message, and status details.
 */

export function handleError(
  error: any,
  method: string = 'GET',
  url: string,
): APIResponse {
  console.error({
    endpoint: `${method} | ~ ${url}`,
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    headers: error?.response?.headers,
    config: error?.response?.config,
    data: error?.response?.data,
    details: error,
  });

  return {
    success: false,
    message:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.response?.config?.data?.error ||
      error?.message ||
      'No Server Response',
    data: null,
    status: error?.response?.status || 500,
    statusText: error?.response?.statusText || 'INTERNAL SERVER ERROR',
  };
}
