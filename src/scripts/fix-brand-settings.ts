import { getPayload } from 'payload'

import config from '../payload.config'

// One-off: bring the persisted Site Settings global in line with the Shah
// Washing rebrand. The seed only runs on an empty database, so existing
// deployments keep the old Galaincha contact details until this runs. Keeping
// these consistent matters for SEO — the JSON-LD LocalBusiness reads the same
// global, and Google cross-checks name/email/socials across the site and the
// Google Business Profile.
//
// Run with:  cross-env NODE_OPTIONS=--no-deprecation payload run src/scripts/fix-brand-settings.ts

async function run() {
  const payload = await getPayload({ config })

  const updated = await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      email: 'namaste@shahwashing.com',
      instagram: 'https://instagram.com/shahwashing',
      facebook: 'https://facebook.com/shahwashing',
    },
  })

  payload.logger.info(
    `Site settings updated → email=${updated.email} instagram=${updated.instagram} facebook=${updated.facebook}`,
  )
  process.exit(0)
}

run().catch((error) => {
  console.error('fix-brand-settings failed:', error)
  process.exit(1)
})
