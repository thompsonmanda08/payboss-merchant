"use server";

import authenticatedService from "@/lib/api-config";
import {
  createUserSession,
  createWorkspaceSession,
  getServerSession,
  getUserSession,
  getWorkspaceSessionData,
} from "@/lib/session";
import { apiClient } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getAccountConfigOptions() {
  try {
    const res = await apiClient.get(`/merchant/onboard/dropdowns`, {
      headers: {
        "Content-Type": "application/json",
      },
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

export async function getUserSetupConfigs() {
  try {
    const res = await authenticatedService({
      url: `merchant/user/setup`,
    });

    // CREATE A USER SESSION COOKIE TO STORE THE LOGGED IN USER DATA
    await createUserSession({
      user: res.data?.userDetails,
      merchantID: res.data?.merchantID,
      userPermissions: res.data?.userPermissions,
      kyc: res.data?.kyc,
    });

    let workspaceIDs = res.data?.workspaces?.map((item) => item?.ID);
    let workspaces = res.data?.workspaces;

    // Create a workspace session for the logged in user -
    // This is used to get the active workspace and workspace user as well as permissions
    if (workspaces) {
      await createWorkspaceSession({
        workspaces: workspaces,
        workspaceIDs: workspaceIDs,
        activeWorkspace: workspaces?.[0] || null,
        workspacePermissions: null,
      });
    }

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

export async function getUserAccountRoles() {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      url: `merchant/roles`,
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

export async function getWorkspaceRoles() {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID
  try {
    const res = await authenticatedService({
      url: `merchant/workspace/roles`,
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

export async function createUserRole() {
  const session = await getServerSession(roleDetails);
  const merchantID = session?.user?.merchantID;

  try {
    const res = await apiClient.post(
      `merchant/${merchantID}/roles/new`, //URL
      roleDetails //BODY
    );

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

export async function updateUserRole() {
  const session = await getServerSession(role);
  const merchantID = session?.user?.merchantID;

  try {
    const res = await apiClient.patch(
      `merchant/${merchantID}/roles/${role?.ID}`, //URL
      role // BODY
    );

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

export async function changeWorkspaceVisibility(workspaceID, isVisible) {
  // const session = await getUserSession()
  // const merchantID = session?.user?.merchantID

  try {
    const res = await authenticatedService({
      url: `merchant/workspace/visibility/${workspaceID}`,
      method: "PATCH",
      data: {
        isVisible,
      },
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

export async function createNewWorkspace(newWorkspace) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      method: "POST",
      url: `merchant/workspace/new`,
      data: { ...newWorkspace, merchantID },
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

export async function updateWorkspace({ workspace, description, ID }) {
  const updatedWorkspace = {
    workspace,
    description,
  };

  try {
    const res = await authenticatedService({
      method: "PATCH",
      url: `merchant/workspace/${ID}`,
      data: updatedWorkspace,
    });

    revalidatePath("/manage-account/workspaces/[ID]", "page");
    revalidatePath("/dashboard/[workspaceID]/workspace-settings", "page");

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

export async function deleteWorkspace(workspaceID) {
  try {
    const res = await authenticatedService({
      method: "DELETE",
      url: `merchant/workspace/${workspaceID}`, //URL
    });

    revalidatePath("/manage-account/workspaces/[ID]", "page");

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

export async function getAllWorkspaces() {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  try {
    const res = await authenticatedService({
      url: `merchant/workspaces/${merchantID}`, //URL
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

export async function getAllKYCData() {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  try {
    const res = await authenticatedService({
      url: `merchant/${merchantID}`, //URL
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

export async function getAuthSession() {
  const session = await getServerSession();

  if (session) return session;

  return null;
}

export async function getUserDetails() {
  const session = await getUserSession();

  if (session) return session;

  return null;
}

export async function getWorkspaceSession() {
  const session = await getWorkspaceSessionData();
  if (session) return session;
  return null;
}
