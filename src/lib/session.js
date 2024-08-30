import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_SESSION, USER_SESSION, WORKSPACE_SESSION } from './constants'

const secretKey = process.env.NEXT_PUBLIC_AUTH_SECRET || process.env.AUTH_SECRET
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key)
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function createAuthSession(
  accessToken,
  expiresIn,
  refreshToken = '',
) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // AFTER 1 HOUR
  const session = await encrypt({
    accessToken: accessToken || '', // NEEDS TO BE KEPT IN APP STATE
    refreshToken: refreshToken || '',
    expiresAt,
  })

  cookies().set(AUTH_SESSION, session, {
    httpOnly: true,
    secure: true,
    expires: !expiresIn ? expiresAt : undefined,
    maxAge: expiresIn ? expiresIn : undefined,
    sameSite: 'lax',
    path: '/',
  })
}

export async function createUserSession(user, merchantID) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24) // AFTER 1 DAY
  const session = await encrypt({
    user,
    merchantID,
  })

  cookies().set(USER_SESSION, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function createWorkspaceSession(workspaces) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24) // AFTER 1 DAY
  const session = await encrypt({
    workspaces,
  })

  cookies().set(WORKSPACE_SESSION, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession() {
  const cookie = cookies().get(AUTH_SESSION)?.value
  const session = await decrypt(cookie)

  if (session?.accessToken || session?.user) return true

  // redirect('/login')
  return false
}

export async function getServerSession() {
  const isLoggedIn = await verifySession()
  const cookie = cookies().get(AUTH_SESSION)?.value
  const session = await decrypt(cookie)
  if (isLoggedIn) return session

  return null
}

export async function getUserSession() {
  const isLoggedIn = await verifySession()
  const cookie = cookies().get(USER_SESSION)?.value
  const session = await decrypt(cookie)
  if (isLoggedIn) return session

  return null
}

export async function getWorkspaceIDs() {
  const isLoggedIn = await verifySession()
  const cookie = cookies().get(WORKSPACE_SESSION)?.value
  const session = await decrypt(cookie)

  if (isLoggedIn) return session?.workspaces

  return null
}

export function deleteSession() {
  cookies().delete(AUTH_SESSION)
  cookies().delete(USER_SESSION)
  cookies().delete(WORKSPACE_SESSION)
  redirect('/login')
}
