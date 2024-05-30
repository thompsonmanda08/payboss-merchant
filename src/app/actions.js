"use server";
import { COOKIE_ME } from "@/lib/constants";
import { apiClient } from "@/lib/utils";
import { cookies } from "next/headers";

export async function getUserProfile() {
  const accessToken = await getToken();

  if (!accessToken) {
    return {
      success: false,
      message: "No token found",
      data: null,
      status: 401,
    };
  }
  try {
    const response = await apiClient.get("/merchants/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status == 200 || response.statusText == "OK") {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
        status: response.status,
      };
    }
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        data: error.response.data,
        status: error.response.status,
      };
    }
    return {
      success: false,
      message: error.message,
      data: null,
      status: 500,
    };
  }
}
export async function authenticateUser(loginDetails) {
  try {
    const response = await apiClient.post(
      "/auth/login", // URL
      loginDetails, // BODY
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200 || response.statusText == "OK") {
      // GET TOKEN FROM RESPONSE
      const token = response.data.data.token;
      // SET COOKIE HERE...
      cookies().set({
        name: COOKIE_ME,
        value: token,
        maxAge: 60 * 30,
        httpOnly: true,
        // path: "/",
      });

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
        status: response.status,
      };
    }
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        data: error.response.data,
        status: error.response.status,
      };
    }
    return {
      success: false,
      message: error.message,
      data: null,
      status: 500,
    };
  }
}

export async function isAuthenticated() {
  const cookieStore = cookies();
  const hasCookie = cookieStore.has(COOKIE_ME);
  if (hasCookie) return true;
  // TOKEN NOT FOUND
  return false;
}

export async function getToken() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(COOKIE_ME);
  if (accessToken?.value) {
    return accessToken.value;
  }
  return null;
}

export async function revokeToken() {
  cookies().delete(COOKIE_ME);
  cookies().set("theme", "");

  return getToken();
}
