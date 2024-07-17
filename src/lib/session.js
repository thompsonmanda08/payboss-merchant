import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_SESSION } from './constants'

const secretKey = process.env.NEXT_PUBLIC_AUTH_SECRET
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
    // NEEDS TO BE KEPT IN APP STATE
    accessToken: accessToken || '',
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

  if (!session?.accessToken || !session?.user) {
    redirect('auth/login')
  }

  return { isAuthenticated: true, session }
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

export function deleteSession() {
  cookies().delete(AUTH_SESSION)
  redirect('/auth/login')
}
