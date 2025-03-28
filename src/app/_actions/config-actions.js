"use server";

import {
  getServerSession,
  getUserSession,
  getWorkspaceSessionData,
} from "@/lib/session";
import axios from "axios";
import { cache } from "react";

/**
 * Retrieves the general configurations from the configuration service.
 * If the operation is successful, an API response containing the configurations is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success or failure of the operation,
 * including the message, data, status, and statusText.
 */

export const getGeneralConfigs = cache(async () => {
  const CONFIG_URL = process.env.CONFIG_BASE_URL;
  const url = `${CONFIG_URL}/configuration/all-configs`;
  try {
    const res = await axios.get(url);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | GENERAL CONFIGS ~ " + url,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.response?.config?.data?.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
});

/**
 * Retrieves the authentication session for the current user.
 * If the session is successfully retrieved, it returns the session object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the session object if available, or null if not.
 */
export const getAuthSession = cache(async () => {
  const session = await getServerSession();
  if (session) return session;
  return null;
});

/**
 * Retrieves the user details for the currently authenticated user.
 * If the user is authenticated, it returns the user details object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the user details object if available, or null if not.
 */
// export async function getUserDetails() {
//   const session = await getUserSession();
//   if (session) return session;
//   return null;
// }

export const getUserDetails = cache(async () => {
  const session = await getUserSession();
  if (session) return session;
  return null;
});

/**
 * Retrieves the workspace session for the currently authenticated user.
 * If the workspace session is successfully retrieved, it returns the workspace session object;
 * otherwise, it returns null.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the workspace session object if available, or null if not.
 */

export async function getWorkspaceSession() {
  const session = await getWorkspaceSessionData();
  if (session) return session;
  return null;
}
