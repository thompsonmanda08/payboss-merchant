"use server";
import authenticatedService from "@/lib/authenticatedService";
import {
  createAuthSession,
  deleteSession,
  getUserSession,
  updateAuthSession,
  verifySession,
} from "@/lib/session";

import { apiClient } from "@/lib/utils";

export async function validateTPIN(tpin) {
  try {
    const res = await apiClient.get(
      `merchant/onboard/continue/${tpin}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: res.message,
      data: res?.data,
      status: res.status,
    };
  } catch (error) {
    console.error(error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
    };
  }
}

export async function createNewMerchant(businessInfo) {
  try {
    const res = await apiClient.post(`merchant/onboard/new`, businessInfo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: true,
      message: res.message,
      data: res?.data,
      status: res.status,
    };
  } catch (error) {
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
    };
  }
}

export async function submitMerchantBankDetails(data, merchantID) {
  try {
    const res = await apiClient.post(
      `merchant/onboard/bank-details/${merchantID}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status == 201 || res.status == 200) {
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
    console.error(error?.response?.data);
    console.error(error?.response);
    return {
      success: false,
      message: error?.response?.data?.error || "Oops! Error Occurred!",
      data: null,
      status: error?.response?.status || error.status,
    };
  }
}

export async function updateMerchantDetails(businessInfo, merchantID) {
  try {
    const res = await apiClient.patch(
      `kyc/merchant/${merchantID}`,
      businessInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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

export async function createMerchantAdminUser(newUser, merchantID) {
  try {
    const res = await apiClient.post(
      `/merchant/${merchantID}/user/new`,
      newUser,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status == 201) {
      return {
        success: true,
        message: res.message,
        data: res?.data,
        status: res.status,
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
    console.error(error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function sendBusinessDocumentRefs(payloadUrls) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  try {
    const res = await authenticatedService({
      url: `merchant/onboard/documents/${merchantID}`,
      method: "POST",
      data: payloadUrls,
    });

    if (res.status == 201) {
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
      data: res?.data || res,
      status: res.status,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error?.response?.data?.error || "Operation failed!",
      data:
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.response,
      status: error?.response?.status || error.status,
    };
  }
}

export async function updateBusinessDocumentRefs(payloadUrls) {
  const session = await getUserSession();
  const merchantID = session?.user?.merchantID;
  try {
    const res = await authenticatedService({
      url: `merchant/onboard/update/documents/${merchantID}`,
      method: "PATCH",
      data: payloadUrls,
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
      data: res?.data || res,
      status: res.status,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error?.response?.data?.error || "No Server Response",
      data:
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.response,
      status: error?.response?.status || error.status,
    };
  }
}

export async function authenticateUser(loginCredentials) {
  try {
    const res = await apiClient.post(
      `merchant/user/authentication`,
      loginCredentials
    );

    const response = res.data;

    // console.log(response);

    const accessToken = response?.token;
    const refreshToken = response?.refreshToken;
    const expiresIn = response?.expires_in;

    await createAuthSession(accessToken, expiresIn, refreshToken);

    return {
      success: true,
      message: res.message,
      data: { accessToken, expiresIn },
      status: res.status,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message:
        error?.response?.data?.error || "Oops! Login Failed, Try Again!.",
      data: null,
      status: error?.response?.status || error.status,
    };
  }
}

export async function getRefreshToken() {
  try {
    const res = await authenticatedService({
      url: `/merchant/user/refresh/token`,
    });

    if (res.status == 200) {
      const response = res.data;

      const accessToken = response?.token;
      const refreshToken = response?.refreshToken;
      const expiresIn = response?.expires_in;

      await createAuthSession(accessToken, expiresIn, refreshToken);

      return {
        success: true,
        message: res.message,
        data: { accessToken },
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
      message: error?.response?.data?.error || "Operation Failed!",
      data: null,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function logUserOut() {
  const isLoggedIn = await verifySession();
  if (isLoggedIn) {
    deleteSession();
    // localStorage.removeItem("pb-config-store");
    return true;
  }
  return false;
}

export async function lockScrenOnUserIdle(state) {
  const isLoggedIn = await verifySession();
  if (isLoggedIn) {
    await updateAuthSession({ screenLocked: state });
    return true;
  }
  return false;
}
