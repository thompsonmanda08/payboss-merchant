// handle logout

import { NextResponse } from 'next/server';

import { deleteSession } from '@/lib/session';

export async function GET() {
  try {
    const res = await deleteSession();

    if (!res.success) {
      throw new Error('Logout failed');
    }

    return NextResponse.json({
      success: res.success,
      redirect: '/login',
      message: res.message,
    });
  } catch (error: Error | any) {
    console.error({
      endpoint: 'GET | LOGOUT ~ /api/logout',
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      headers: error?.response?.headers,
      config: error?.response?.config,
      data: error?.response?.data || error,
    });

    return NextResponse.json({
      success: false,
      message:
        error?.response?.data?.error ||
        error?.response?.config?.data?.error ||
        'No Server Response',
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    });
  }
}
