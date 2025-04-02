"use server";

import authenticatedService from "@/lib/api-config";
import { cache } from "react";

/**
 * Retrieves the analytics data for a given workspace ID.
 *
 * @param {string} workspaceID - The ID of the workspace for which the analytics data is being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: The analytics data for the given workspace ID.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function fetchDashboardAnalytics(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }

  try {
    const res = await authenticatedService({
      url: `analytics/merchant/dashboard/workspace/${workspaceID}`,
    });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
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
}

export const getDashboardAnalytics = cache(fetchDashboardAnalytics);
