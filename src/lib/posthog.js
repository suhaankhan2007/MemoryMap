import posthog from 'posthog-js'

export const initPostHog = () => {
  posthog.init(
    'phc_TXcc881KL6vNK8fDJJRKVAQBlNEw2WrlQpeumadOONR',
    {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
    }
  )
}

export { posthog }
