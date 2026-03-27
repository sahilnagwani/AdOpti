import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // First, always refresh the session to ensure cookies are updated
  let response = await updateSession(request)
  
  // Re-verify the user session for protection logic
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
           request.cookies.set({ name, value: '', ...options })
           response = NextResponse.next({
             request: {
               headers: request.headers,
             },
           })
           response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // List of protected routes from USER requirements
  const protectedRoutes = [
    '/overview', 
    '/platforms', 
    '/campaigns', 
    '/opportunities', 
    '/reports', 
    '/assistant', 
    '/integrations'
  ]
  const isProtectedPath = protectedRoutes.some(route => path.startsWith(route))
  
  // Auth routes (login/signup) - handled as redirect to overview if logged in
  const isAuthPath = path === '/login' || path === '/signup'

  // PROTECTION LOGIC:
  // 1. Redirect to /overview if logged in and visiting auth pages
  if (user && isAuthPath) {
    return NextResponse.redirect(new URL('/overview', request.url))
  }

  // 2. Redirect to /login if NO session and visiting protected dash routes
  if (!user && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (.svg, .png, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
