import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    {
      source: '/projects/:path*',
      missing: [{ type: 'header', key: 'next-router-prefetch' }],
    },
  ],
}

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  if (!process.env.BASIC_AUTH_PASSWORD) {
    return NextResponse.next()
  }

  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1] ?? ''
    const [user, pwd] = atob(authValue).split(':')

    if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new Response('401 Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}