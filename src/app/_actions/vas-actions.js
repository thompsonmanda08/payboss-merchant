"use server";

import authenticatedService from "@/lib/api-config";
import { apiClient } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function generateCheckoutURL({ workspaceID, checkoutData }) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `transaction/collection/create/checkout/${workspaceID}`;

  try {
    const res = await authenticatedService({
      method: "POST",
      url,
      data: checkoutData,
    });

    // revalidatePath("/manage-account/workspaces/[ID]", "page");
    // revalidatePath("/dashboard/[workspaceID]/workspace-settings", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | CHECKOUT URL GEN ~ " + url,
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

export async function getCheckoutURL(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `/transaction/collection/checkout/${workspaceID}`;

  try {
    const res = await authenticatedService({ url });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | CHECKOUT URL ~ " + url,
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

export async function getCheckoutInfo(checkoutID, checkoutData) {
  if (!checkoutID) {
    return {
      success: false,
      message: "checkout ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `transaction/collection/create/checkout/${checkoutID}`;

  try {
    const res = await apiClient.post(url, checkoutData);

    revalidatePath("/checkout", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | CHECKOUT  DATA ~ " + url,
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
