import createIntlProxy from 'next-intl/middleware'

import { routing } from './i18n/routing'

// Locale routing for the public site only — Payload admin/API and static
// assets must never be locale-prefixed.
export default createIntlProxy(routing)

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
