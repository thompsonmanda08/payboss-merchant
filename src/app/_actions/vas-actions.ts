'use server';

import { revalidatePath } from 'next/cache';

import authenticatedApiClient from '@/lib/api-config';
import { apiClient } from '@/lib/utils';
import { APIResponse } from '@/types';

export async function generateCheckoutURL(
  workspaceID: string,
  checkoutData: any,
): Promise<APIResponse> {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: null,
      status: 400,
      statusText: 'BAD REQUEST',
    };
  }

  const url = `/merchant/transaction/collection/create/checkout/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({
      method: 'POST',
      url,
      data: checkoutData,
    });

    // revalidatePath("/manage-account/workspaces/[ID]", "page");
    // revalidatePath("/dashboard/[workspaceID]/workspace-settings", "page");

    return {
      success: true,
      message: res.data?.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: 'POST | CHECKOUT URL GEN ~ ' + url,
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
        'No Server Response',
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
export async function updateCheckoutURL(
  workspaceID: string,
  checkoutID: string,
  checkoutData: any,
): Promise<APIResponse> {
  if (!checkoutID || !workspaceID) {
    return {
      success: false,
      message: 'Checkout/Workspace ID is missing',
      data: null,
      status: 400,
      statusText: 'BAD REQUEST',
    };
  }

  const url = `merchant/transaction/collection/update/${workspaceID}/checkout/${checkoutID}`;

  try {
    const res = await authenticatedApiClient({
      method: 'PATCH',
      url,
      data: checkoutData,
    });

    return {
      success: true,
      message: res.data?.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: 'PATCH | CHECKOUT URL DATA ~ ' + url,
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
        'No Server Response',
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function getCheckoutURL(
  workspaceID: string,
): Promise<APIResponse> {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: null,
      status: 400,
      statusText: 'BAD REQUEST',
    };
  }

  const url = `/merchant/transaction/collection/checkout/${workspaceID}`;

  try {
    const res = await authenticatedApiClient({ url });

    return {
      success: true,
      message: res.data?.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: 'GET | CHECKOUT URL ~ ' + url,
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
        'No Server Response',
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function createInvoice(
  workspaceID: string,
  formData: any,
): Promise<APIResponse> {
  if (!workspaceID) {
    return {
      success: false,
      message: 'Workspace ID is required',
      data: null,
      status: 400,
      statusText: 'BAD REQUEST',
    };
  }

  const url = `/merchant/transaction/collection/create/invoice/${workspaceID}
`;

  try {
    const res = await authenticatedApiClient({
      url,
      method: 'POST',
      data: formData,
    });

    revalidatePath('/dashboard/[workspaceID]/collections/invoicing', 'page');

    return {
      success: true,
      message: res.data?.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: 'POST | CREATE INVOICE ~ ' + url,
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
        'No Server Response',
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}

export async function getInvoiceDetails(ID: string): Promise<APIResponse> {
  if (!ID) {
    return {
      success: false,
      message: 'INvoice ID is required',
      data: {},
      status: 400,
      statusText: 'BAD REQUEST',
    };
  }

  const url = `/merchant/transaction/collection/invoice/${ID}/details`;

  try {
    const res = await apiClient.get(url);

    return {
      success: true,
      message: res.data?.message,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error: Error | any) {
    console.error({
      endpoint: 'GET | INVOICE DETAILS ~ ' + url,
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
        'No Server Response',
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    };
  }
}
