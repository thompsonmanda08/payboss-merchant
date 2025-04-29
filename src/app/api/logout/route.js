// handle logout

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { deleteSession } from "@/lib/session";

export async function GET(request) {
  try {
    const res = await deleteSession();

    revalidatePath("/", "layout");

    if (!res.success) {
      throw new Error("Logout failed");
    }

    // const response = NextResponse.json({
    //   success: true,
    //   message: res?.message || "Logout Success",
    //   data: null,
    //   status: res.status,
    //   statusText: res.statusText,
    // });

    // return response;

    // Add ?from=/incoming-url to the /login URL
    // loginUrl.searchParams.set("from", request.nextUrl.pathname);

    // And redirect to the new URL
    // return NextResponse.redirect(new URL("/login", request.url));

    return NextResponse.json({ success: true, redirect: "/login" });

    // return NextResponse.redirect(new URL("/login", request.url), 307);
  } catch (error) {
    console.error({
      endpoint: "GET | LOGOUT ~ /api/logout",
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
        "Error Occurred: See Console for details",
      data: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    });
  }
}
