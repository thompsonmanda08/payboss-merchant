"use server";
import authenticatedService from "@/lib/api-config";
import { updateWorkspaceSession } from "@/lib/session";

/**
 * Initializes a workspace and updates the session with the workspace permissions
 * and type.
 *
 * @param {string} workspaceID - The ID of the workspace to initialize.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the following
 * properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An object containing the workspace permissions and type.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function initializeWorkspace(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/init/${workspaceID}`,
    });

    if (res.status == 200) {
      await updateWorkspaceSession({
        workspacePermissions: res.data,
        workspaceType: res.data.workspaceType,
      });
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
      message: res?.data?.error || res?.statusText || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.response?.statusText ||
        "Operation Failed!",
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Submits a Proof of Payment (POP) for a workspace.
 *
 * @param {Object} popDetails - The details of the Proof of Payment (POP) to be
 * submitted. The object should contain the following properties:
 *
 * - `amount`: The amount of the Proof of Payment (POP) to be submitted.
 * - `currency`: The currency of the Proof of Payment (POP) to be submitted.
 * - `paymentMethod`: The payment method used to make the payment.
 * - `paymentReference`: The payment reference for the payment.
 * - `paymentDate`: The date of the payment.
 *
 * @param {string} workspaceID - The ID of the workspace for which the Proof of
 * Payment (POP) is being submitted.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An object containing the submitted Proof of Payment (POP) details.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function submitPOP(popDetails, workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/wallet/prefund/${workspaceID}`,
      method: "POST",
      data: popDetails,
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
      message: res?.data?.error || res?.statusText || "Operation Failed!",
      data: res?.data || res,
      status: res.status,
      statusText: res?.statusText,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error?.response?.data?.error ||
        error?.data?.error ||
        error?.response?.statusText ||
        "Operation Failed!",
      data: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Retrieves a list of all the prefund requests made by the logged-in
 * merchant for the given workspace.
 *
 * @param {string} workspaceID - The ID of the workspace for which the prefund
 * requests are being fetched.
 *
 * @returns {Promise<Object>} - A promise resolving to an object with the
 * following properties:
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `message`: A string providing a message about the result of the operation.
 * - `data`: An array of prefund request objects.
 * - `status`: The HTTP status code for the operation.
 * - `statusText`: The HTTP status text for the operation.
 */
export async function getWalletPrefunds(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/wallet/prefund/${workspaceID}/list`,
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

export async function approveWalletPrefund(prefundData, prefundID) {
  if (!prefundID) {
    return {
      success: false,
      message: "Prefund ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/wallet/prefund/${prefundID}/review`,
      method: "PATCH",
      data: prefundData,
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

export async function getWorkspaceMembers(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/users/${workspaceID}`,
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

export async function deleteUserFromWorkspace(recordID) {
  try {
    const res = await authenticatedService({
      url: `/merchant/workspace/user/${recordID}`,
      method: "DELETE",
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

    revalidatePath("/manage-account/workspaces/[ID]", "page");
    revalidatePath("/dashboard/[workspaceID]/workspace-settings", "page");

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

export async function changeUserRoleInWorkspace(mapping, recordID) {
  try {
    const res = await authenticatedService({
      url: `merchant/workspace/user/role/${recordID}`,
      method: "PATCH",
      data: mapping,
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

export async function setupWorkspaceAPIKey(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `transaction/collection/create/api-key/${workspaceID}`,
    });

    if (res.status == 200 || res.status == 201) {
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

export async function refreshWorkspaceAPIKey(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `transaction/collection/generate/api-key/${workspaceID}`,
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

export async function getWorkspaceAPIKey(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "Workspace ID is required!",
      data: null,
      status: 400,
      statusText: "Bad Request",
    };
  }

  try {
    const res = await authenticatedService({
      url: `transaction/collection/api-key/${workspaceID}`,
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

export async function generateWorkspaceTillNumer(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }
  try {
    const res = await authenticatedService({
      url: `transaction/collection/create/till-number/${workspaceID}`,
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

export async function getWorkspaceTillNumber(workspaceID) {
  if (!workspaceID) {
    return {
      success: false,
      message: "workspaceID ID is required",
      data: [],
      status: 400,
      statusText: "BAD_REQUEST",
    };
  }
  try {
    const res = await authenticatedService({
      url: `transaction/collection/till-number/${workspaceID}`,
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
