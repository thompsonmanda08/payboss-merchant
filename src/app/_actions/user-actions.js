"use server";
import authenticatedService from "@/lib/api-config";
import { USER_SESSION } from "@/lib/constants";
import { getUserSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createNewUser(newUser) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      method: "POST",
      url: `merchant/${merchantID}/user/other/new`,
      data: newUser,
    });

    revalidatePath("/manage-account/users", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
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

export async function getAllUsers() {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      url: `merchant/users/${merchantID}`,
    });

    if (res.status == 200) {
      return {
        success: true,
        message: res.message,
        data: res.data,
        status: res.status,
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

export async function assignUsersToWorkspace(users, workspaceID) {
  try {
    const res = await authenticatedService({
      url: `merchant/workspace/user/mapping/${workspaceID}`,
      method: "POST",
      data: {
        users,
      },
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

export async function getUser(userID) {
  try {
    const res = await authenticatedService({
      url: `merchant/user/${userID}`,
    });

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

export async function updateProfileData(userID, userData) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      url: `merchant/${merchantID}/user/${userID}`,
      method: "PATCH",
      data: userData,
    });

    revalidatePath("/manage-account/profile", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
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

export async function updateSystemUserData(userID, userData) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      url: `merchant/${merchantID}/user/${userID}`,
      method: "PATCH",
      data: userData,
    });

    // revalidatePath("/manage-account/profile", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
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

export async function changeUserPassword(password) {
  (await cookies()).delete(USER_SESSION);

  try {
    const res = await authenticatedService({
      url: `merchant/user/change/password `,
      method: "PATCH",
      data: { password },
    });

    revalidatePath("/manage-account/profile", "page");

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
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

export async function adminResetUserPassword(userID, newPasswordData) {
  try {
    const res = await authenticatedService({
      url: `merchant/user/reset/password/${userID}`,
      method: "PATCH",
      data: newPasswordData,
    });

    return {
      success: true,
      message: res.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
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
