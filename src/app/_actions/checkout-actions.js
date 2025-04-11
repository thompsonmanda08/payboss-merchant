"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";

import { apiClient } from "@/lib/utils";

export async function validateCheckoutData(checkoutData) {
  if (
    !checkoutData?.workspaceID ||
    !checkoutData?.transactionID ||
    !checkoutData?.serviceID
  ) {
    return {
      success: false,
      message: "Missing Required Params",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `${process.env.SERVICES_BASE_URL}/transaction/collection/checkout/validation`;

  try {
    const res = await axios.post(url, checkoutData);

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
      endpoint: "POST | CHECKOUT DATA VALIDATION ~ " + url,
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

export async function getCheckoutInfo(checkoutID) {
  if (!checkoutID) {
    return {
      success: false,
      message: "checkout ID is required",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const url = `transaction/collection/checkout/${checkoutID}/details`;

  try {
    const res = await apiClient.get(url);

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

export async function payWithMobileMoney(checkoutData) {
  if (
    !checkoutData?.transactionID ||
    !checkoutData?.phoneNumber ||
    !checkoutData?.amount
  ) {
    return {
      success: false,
      message: "Missing Required Params",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }

  const { transactionID, phoneNumber, amount } = checkoutData;
  const url = `transaction/collection/checkout/mobile/${transactionID}/${phoneNumber}/${amount}`;

  try {
    const res = await apiClient.get(url);

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
      endpoint: "GET | PAY WITH MOBILE ~ " + url,
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

export async function payWithBankCard(checkoutData) {
  if (
    !checkoutData?.workspaceID ||
    !checkoutData?.transactionID ||
    !checkoutData?.serviceID
  ) {
    return {
      success: false,
      message: "Missing Required Params",
      data: null,
      status: 400,
      statusText: "BAD REQUEST",
    };
  }
  const url = `transaction/collection/checkout/card`;

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
      endpoint: "POST | CHECKOUT WITH CARD ~ " + url,
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
