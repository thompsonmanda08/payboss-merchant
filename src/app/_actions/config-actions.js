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

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res?.data,
        status: res.status,
      };
    }

    return {
      success: false,
      message: res?.data?.error || res?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Operation failed!",
      data: null,
      status: error?.response?.status || error.status,
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
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation failed!",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status !== 200) {
      const response = res?.data || res;
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      };
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Operation failed!",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      };
    }

    const response = res?.data || res;
    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Operation failed!",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status !== 201) {
      const response = res?.data || res;
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      };
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status !== 200) {
      const response = res?.data || res;
      return {
        success: false,
        message: response?.error || response?.message,
        data: null,
        status: res.status,
      };
    }

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status === 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      };
    }

    const response = res?.data || res;

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status == 201 || res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      };
    }

    const response = res?.data || res;

    // revalidatePath("/workspaces", "page");

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Something went wrong!",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status == 201 || res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      };
    }

    const response = res?.data || res;
    revalidatePath("/manage-account/workspaces/[ID]", "page");
    revalidatePath("/dashboard/[workspaceID]/workspace-settings", "page");

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Something went wrong!",
      data: null,
      status: error?.response?.status || error.status,
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
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Something went wrong!",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status === 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      };
    }

    const response = res?.data || res;

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
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

    if (res.status === 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
      };
    }

    const response = res?.data || res;

    return {
      success: false,
      message: response?.error || response?.message,
      data: null,
      status: res.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
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
