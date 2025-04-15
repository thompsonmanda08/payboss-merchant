"use server";

import { revalidatePath } from "next/cache";

import authenticatedService from "@/lib/api-config";
import { apiServiceClient } from "@/lib/utils";

export async function generateCheckoutURL(workspaceID, checkoutData) {
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
export async function updateCheckoutURL(workspaceID, checkoutID, checkoutData) {
  if (!checkoutID || !workspaceID) {
    return {
      success: false,
      message: "Checkout/Workspace ID is missing",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `transaction/collection/update/${workspaceID}/checkout/${checkoutID}`;

  try {
    const res = await authenticatedService({
      method: "PATCH",
      url,
      data: checkoutData,
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
      endpoint: "PATCH | CHECKOUT URL DATA ~ " + url,
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

export async function createInvoice(formData) {
  // if (!checkoutID) {
  //   return {
  //     success: false,
  //     message: "checkout ID is required",
  //     data: null,
  //     status: 400,
  //     statusText: "BAD REQUEST",
  //   };
  // }

  const url = `transaction/collection/create/invoice`;

  try {
    const res = await authenticatedService({
      url,
      method: "POST",
      data: formData,
    });

    revalidatePath("/dashboard/[workspaceID]/collections/invoicing", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "POST | CREATE INVOICE ~ " + url,
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

export async function getInvoiceDetails(ID) {
  if (!ID) {
    return {
      success: false,
      message: "INvoice ID is required",
      data: {},
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `/transaction/collection/invoice/${ID}/details`;

  try {
    const res = await apiServiceClient.get(url);

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error({
      endpoint: "GET | INVOICE DETAILS ~ " + url,
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

// export async function getCheckoutInfo(checkoutID, checkoutData) {
//   if (!checkoutID) {
//     return {
//       success: false,
//       message: "checkout ID is required",
//       data: null,
//       status: 400,
//       statusText: "BAD REQUEST",
//     };
//   }

//   const url = `transaction/collection/create/checkout/${checkoutID}`;

//   try {
//     const res = await apiClient.post(url, checkoutData);

//     revalidatePath("/checkout", "page");

//     return {
//       success: true,
//       message: res.message,
//       data: res.data,
//       status: res.status,
//       statusText: res.statusText,
//     };
//   } catch (error) {
//     console.error({
//       endpoint: "POST | CHECKOUT  DATA ~ " + url,
//       status: error?.response?.status,
//       statusText: error?.response?.statusText,
//       headers: error?.response?.headers,
//       config: error?.response?.config,
//       data: error?.response?.data || error,
//     });

//     return {
//       success: false,
//       message:
//         error?.response?.data?.error ||
//         error?.response?.config?.data?.error ||
//         "Error Occurred: See Console for details",
//       data: error?.response?.data,
//       status: error?.response?.status,
//       statusText: error?.response?.statusText,
//     };
//   }
// }
