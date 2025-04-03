import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { AUTH_SESSION, USER_SESSION, WORKSPACE_SESSION } from "./constants";

const secretKey =
  process.env.NEXT_PUBLIC_AUTH_SECRET || process.env.AUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createAuthSession(
  accessToken,
  expiresIn = 3600,
  refreshToken = ""
) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // AFTER 1 HOUR

  // Call `encrypt` to generate the session token
  const session = await encrypt({
    accessToken: accessToken || "",
    refreshToken: refreshToken || "",
    expiresAt,
  });

  // Ensure `session` is successfully created before setting the cookie
  if (session) {
    (await cookies()).set(AUTH_SESSION, session, {
      httpOnly: true,
      secure: false,
      maxAge: expiresIn,
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
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24); // AFTER 1 DAY
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
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24); // AFTER 1 DAY
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

// UPDATE THE WOPRKSPACE SESSION
export async function updateWorkspaceSession(fields) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24); // AFTER 1 DAY
  const isLoggedIn = await verifySession();
  const cookie = (await cookies()).get(WORKSPACE_SESSION)?.value;
  const oldSession = await decrypt(cookie);

  if (isLoggedIn && oldSession) {
    const session = await encrypt({
      ...oldSession,
      ...fields,
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
  const allCookies = cookieStore.getAll();

  allCookies.forEach(({ name }) => {
    cookieStore.set(name, "", {
      expires: new Date(0),
      path: "/",
    });
  });

  if (typeof window !== "undefined") {
    localStorage.clear();
  }

  revalidatePath("/", "layout");

  return { success: true, message: "Logout Success" };
}
