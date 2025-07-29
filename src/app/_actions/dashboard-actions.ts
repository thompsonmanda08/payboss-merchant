"use server";

import { cache } from "react";

import authenticatedApiClient, {
  handleBadRequest,
  handleError,
  successResponse,
} from "@/lib/api-config";
import { APIResponse } from "@/types";

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
export async function fetchDashboardAnalytics(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return handleBadRequest("Workspace ID is required");
  }

  try {
    const res = await authenticatedApiClient({
      url: `analytics/merchant/dashboard/workspace/${workspaceID}`,
    });

    return successResponse(res.data);
  } catch (error: Error | any) {
    return handleError(error, "GET | DASHBOARD ANALYTICS", "");
  }
}

export const getDashboardAnalytics = cache(fetchDashboardAnalytics);
