import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

const nextIntlMiddleware = createMiddleware(routing)

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const pathname = url.pathname
  const first = pathname.split('/')[1]
  const firstTyped = first as unknown as (typeof routing.locales)[number]

  // If the first segment is not a supported locale, force /en as default.
  if (!routing.locales.includes(firstTyped)) {
    url.pathname = `/en${pathname}`
    return NextResponse.redirect(url)
  }

  return nextIntlMiddleware(req)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
