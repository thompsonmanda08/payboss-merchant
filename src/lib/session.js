import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_SESSION } from './constants'

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

export async function createSession(
  user,
  role,
  accessToken,
  expiresIn,
  refreshToken = '',
) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // AFTER 1 HOUR
  const session = await encrypt({
    user,
    role,
    merchantID,
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

  // redirect("/"); // OR GO TO DASHBOARD
}

export async function verifySession() {
  const cookie = cookies().get(AUTH_SESSION)?.value
  const session = await decrypt(cookie)

  if (session?.accessToken || session?.user) return true

  redirect('/login')
}

export async function getServerSession() {
  const cookie = cookies().get(AUTH_SESSION)?.value
  const session = await decrypt(cookie)

  if (session?.accessToken || session?.user) return session

  return null
}

export async function updateSession() {
  const session = cookies().get(AUTH_SESSION)?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 60 * 60 * 1000) // ADD 1 HOUR
  cookies().set(AUTH_SESSION, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function changeSessionWorkspace(workspaceID) {
  const session = cookies().get(AUTH_SESSION)?.value
  let payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const newSession = await encrypt({
    ...payload,
    workspaceID,
  })

  const expires = new Date(Date.now() + 60 * 60 * 1000) // ADD 1 HOUR
  cookies().set(AUTH_SESSION, newSession, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export function deleteSession() {
  cookies().delete(AUTH_SESSION)
  redirect('/login')
}
