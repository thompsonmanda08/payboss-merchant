"use server";
import authenticatedService from "@/lib/api-config";
import { USER_SESSION } from "@/lib/constants";
import { getUserSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Creates a new user for a merchant by calling the API endpoint.
 * If the operation is successful, an API response containing the new user's details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {Object} newUser - An object containing the new user's details.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 *
*/
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

/**
 * Retrieves all users for a merchant from the API.
 * If the operation is successful, an API response containing an array of user objects is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
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

/**
 * Assigns the given users to a workspace by calling the API endpoint.
 * If the operation is successful, an API response containing the updated workspace details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {Object[]} users - An array of objects containing the user IDs to assign to the workspace.
 * @param {string} workspaceID - The ID of the workspace to assign the users to.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
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

/**
 * Retrieves a user by calling the API endpoint.
 * If the operation is successful, an API response containing the user's details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {string} userID - The ID of the user to retrieve.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 * */
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

/**
 * Updates a user's profile data by sending a PATCH request to the API.
 * If the update is successful, an API response containing the updated user details is returned.
 * If the update fails, an API response with a message indicating the error is returned.
 *
 * @param {string} userID - The ID of the user whose profile is being updated.
 * @param {Object} userData - An object containing the new profile data for the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

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

/**
 * Updates a system user's data by sending a PATCH request to the API.
 * If the update is successful, an API response containing the updated user details is returned.
 * If the update fails, an API response with a message indicating the error is returned.
 *
 * @param {string} userID - The ID of the user whose data is being updated.
 * @param {Object} userData - An object containing the new data for the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function updateSystemUserData(userID, userData) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      url: `merchant/${merchantID}/user/${userID}`,
      method: "PATCH",
      data: userData,
    });

    revalidatePath("/manage-account/users", "page");

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

/**
 * Deletes a system user by sending a DELETE request to the API.
 * If the deletion is successful, an API response containing a success message is returned.
 * If the deletion fails, an API response with a message indicating the error is returned.
 *
 * @param {string} userID - The ID of the system user to delete.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function deleteSystemUserData(userID) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      method: "DELETE",
      url: `merchant/users/${userID}`
    });

    revalidatePath("/manage-account/users", "page");

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
      message: error?.response?.data?.error || "User Delete Failed!",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

/**
 * Unlocks a system user by calling the API endpoint.
 * If the operation is successful, an API response containing the user's details is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {string} userID - The ID of the user to unlock.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function unlockSystemUser(userID) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;

  try {
    const res = await authenticatedService({
      url: `/api/v2/merchant/${merchantID}/user/${userID}`
    });

    revalidatePath("/manage-account/users", "page");

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

/**
 * Changes the password of a user by calling the API endpoint.
 * If the operation is successful, an API response containing the result of the change is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {string} password - The new password to be set for the user.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

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

/**
 * Resets a user's password by calling the API endpoint.
 * If the operation is successful, an API response containing the result of the password reset is returned.
 * If the operation fails, an API response with a message indicating the error is returned.
 *
 * @param {string} userID - The ID of the user whose password is to be reset.
 * @param {Object} newPasswordData - An object containing the new password details.
 * @returns {Promise<APIResponse>} A promise that resolves to an APIResponse object indicating the success or failure of the operation.
 */

export async function adminResetUserPassword(userID, newPasswordData) {
  try {
    const res = await authenticatedService({
      url: `merchant/user/reset/password/${userID}`,
      method: "PATCH",
      data: newPasswordData,
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
