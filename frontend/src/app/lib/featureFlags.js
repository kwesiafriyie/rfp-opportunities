// Feature flags, resolved at build time from NEXT_PUBLIC_* env vars -- the
// same pattern lib/api.js already uses for API_URL. No other flag mechanism
// exists in this codebase, so this file is the natural home for future
// flags too rather than introducing a separate config system.

// Gates the KPMG Fit UI shell end to end: the card chip, the detail-view
// section, everything. Off (the default -- an unset env var must never leak
// this to production) means the app looks exactly as it did before this
// feature existed. The actual scoring engine doesn't exist yet (see
// lib/kpmgFit.js) -- this flag really means "show the shell with fixture
// data for development," not "KPMG Fit is live."
export const KPMG_FIT_UI_ENABLED = process.env.NEXT_PUBLIC_KPMG_FIT_UI_ENABLED === "true";
