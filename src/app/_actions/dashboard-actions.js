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

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
        statusText: res.statusText,
      };
    }

    return {
      success: false,
      message: res?.data?.error || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
