/* eslint-disable import/no-unresolved */
import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { AUTH_SESSION, USER_SESSION, WORKSPACE_SESSION } from "./constants";

// 1. Get secret from environment variables (MUST be set)
const secretKey =
  process.env.NEXT_PUBLIC_AUTH_SECRET || process.env.AUTH_SECRET;

// 2. Validate the secret exists
if (!secretKey || secretKey.length < 32) {
  throw new Error(
    "JWT_SECRET or AUTH_SECRET environment variable must be at least 32 characters"
  );
}

// 3. Create the key properly
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a non-empty object");
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function decrypt(session) {
  if (!session || typeof session !== "string") {
    return {
      success: false,
      message: "No session token provided",
      data: null,
      status: 500,
      statusText: "UNAUTHENTICATED",
    };
  }

  const parts = session.split(".");

  if (parts.length !== 3) {
    return {
      success: false,
      message: "Invalid token format",
      data: null,
      status: 500,
      statusText: "INVALID_TOKEN_FORMAT",
    };
  }

  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
      clockTolerance: 15,
    });

    return payload;
  } catch (error) {
    console.error(error);

    // Specific error handling
    if (error.code === "ERR_JWS_INVALID") {
      return {
        success: false,
        message: "Invalid token signature",
        data: null,
        status: 500,
        statusText: "INVALID_TOKEN_SIGNATURE",
      };
    }

    if (error.code === "ERR_JWT_EXPIRED") {
      return {
        success: false,
        message: "Token expired",
        data: null,
        status: 500,
        statusText: "TOKEN_EXPIRED",
      };
    }

    return null;
    // return {
    //   success: false,
    //   message: "Failed to verify session",
    //   data: null,
    //   status: 500,
    //   statusText: "TOKEN_VERIFICATION_FAILED",
    // };
  }
}

export async function createAuthSession(accessToken) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // AFTER 1 HOUR

  // Call `encrypt` to generate the session token
  const session = await encrypt({
    accessToken: accessToken || "",
    expiresAt,
  });

  // Ensure `session` is successfully created before setting the cookie
  if (session) {
    (await cookies()).set(AUTH_SESSION, session, {
      httpOnly: true,
      secure: false,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
  } else {
    throw new Error("Failed to create session token.");
  }
}

export async function updateAuthSession(fields) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const isLoggedIn = await verifySession();
  const cookie = (await cookies()).get(AUTH_SESSION)?.value;
  const oldSession = await decrypt(cookie);

  if (isLoggedIn && oldSession) {
    const session = await encrypt({
      ...oldSession,
      ...fields,
    });

    if (session) {
      (await cookies()).set(AUTH_SESSION, session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
      });
    } else {
      throw new Error("Failed to update session token.");
    }
  }
}

export async function createUserSession({
  user,
  merchantID,
  userPermissions,
  kyc,
}) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({
    user,
    merchantID,
    userPermissions,
    kyc,
  });

  if (session) {
    (await cookies()).set(USER_SESSION, session, {
      httpOnly: true,
      secure: false,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
  } else {
    throw new Error("Failed to create user session token.");
  }
}

export async function createWorkspaceSession({
  workspaces,
  workspaceIDs,
  activeWorkspace,
  workspacePermissions,
}) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({
    workspaces,
    workspaceIDs,
    activeWorkspace,
    workspacePermissions,
  });

  if (session) {
    (await cookies()).set(WORKSPACE_SESSION, session, {
      httpOnly: true,
      secure: false,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
  } else {
    throw new Error("Failed to create workspace session token.");
  }
}

// UPDATE THE WORKSPACE SESSION
export async function updateWorkspaceSession(fields) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const isLoggedIn = await verifySession();
  const cookie = (await cookies()).get(WORKSPACE_SESSION)?.value;
  const oldSession = await decrypt(cookie);

  const updatedSession = {
    ...oldSession,
    ...fields,
    activeWorkspace: oldSession?.workspaces?.find(
      (workspace) => workspace?.ID == fields?.activeWorkspaceID
    ),
  };

  if (isLoggedIn && oldSession) {
    const session = await encrypt(updatedSession);

    if (session) {
      (await cookies()).set(WORKSPACE_SESSION, session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
      });

      return updatedSession;
    } else {
      throw new Error("Failed to update workspace session token.");
    }
  }
}

export async function verifySession() {
  const cookie = (await cookies()).get(AUTH_SESSION)?.value;
  const session = await decrypt(cookie);

  if (session?.accessToken) return true;

  return false;
}

export async function getServerSession() {
  const isLoggedIn = await verifySession();

  const cookie = (await cookies()).get(AUTH_SESSION)?.value;
  const session = await decrypt(cookie);

  if (isLoggedIn) return session;

  return null;
}

export async function getUserSession() {
  const isLoggedIn = await verifySession();

  const cookie = (await cookies()).get(USER_SESSION)?.value;
  const session = await decrypt(cookie);

  if (isLoggedIn) return session;

  return null;
}

// GET THE WORKSPACE SESSION DATA
export async function getWorkspaceSessionData() {
  const isLoggedIn = await verifySession();

  const cookie = (await cookies()).get(WORKSPACE_SESSION)?.value;
  const session = await decrypt(cookie);

  if (isLoggedIn) return session;

  return null;
}

// DELETE THE SESSION
export async function deleteSession() {
  const cookieStore = await cookies();
  // const allCookies = cookieStore.getAll();

  cookieStore.delete(AUTH_SESSION);

  cookieStore.delete(USER_SESSION);
  cookieStore.delete(WORKSPACE_SESSION);

  if (typeof window !== "undefined") {
    localStorage.clear();
  }

  return { success: true, message: "Logout Success" };
}
