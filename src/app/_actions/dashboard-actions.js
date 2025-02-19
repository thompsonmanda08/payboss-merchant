"use server";

import authenticatedService from "@/lib/api-config";

export async function getDashboardAnalytics(workspaceID) {
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
        error?.response?.config?.data.error ||
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
