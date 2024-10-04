import { NextResponse } from 'next/server'
import { getServerSession, getWorkspaceSessionData } from './lib/session'

const PROTECTED_ROUTES = [
  // '/dashboard',
  // '/settings',
  // '/dashboard/profile',
  // '/dashboard/payments/',
  // '/dashboard/payments/direct',
  // Add more protected routes as needed
]

const PUBLIC_ROUTE = ['/', '/login', '/register']

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone() // REQUIRED FOR BASE ABSOLUTE URL
  const response = NextResponse.next()
  const session = await getServerSession()
  const workspaceSession = (await getWorkspaceSessionData()) || []
  const workspaceIDs = workspaceSession?.workspaceIDs || []
  const urlRouteParams = pathname.match(/^\/dashboard\/([^\/]+)\/?$/)
  const accessToken = session?.accessToken || ''

  // CHECK FOR  ROUTES
  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/register')
  const isUserInWorkspace =
    pathname.startsWith('/dashboard') && pathname.split('/').length >= 3
  const isDashboardRoute = pathname == '/dashboard'
  const isPublicRoute = PUBLIC_ROUTE.includes(pathname)

  if (pathname == '/') return response
  if (isPublicRoute && !accessToken) return response

  /**********USER MUST CHOOSE A WORKSPACE TO SEE DASHBOARDS *********/
  if (urlRouteParams && isUserInWorkspace) {
    const workspaceID = urlRouteParams[1]
    const userId = urlRouteParams[2]

    if (accessToken && isAuthPage) {
      url.pathname = `/dashboard${workspaceID}`
      return NextResponse.redirect(url)
    }

    if (!workspaceIDs.includes(workspaceID)) {
      url.pathname = '/workspaces'
      return NextResponse.redirect(url)
    }
  }

  // IF NO ACCESS TOKEN AT ALL>>> REDIRECT BACK TO AUTH PAGE
  if (!accessToken && !isPublicRoute) {
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // IF THERE IS AN ACCESS TOKEN EXISTS - REDIRECT TO DASHBOARD
  if ((accessToken && isAuthPage) || isDashboardRoute) {
    url.pathname = `/workspaces`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
}
