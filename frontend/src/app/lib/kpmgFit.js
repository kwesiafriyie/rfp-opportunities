import { KPMG_FIT_UI_ENABLED } from "./featureFlags";

/**
 * The future KPMG Fit data contract. This file is the *only* boundary
 * between opportunity data and every KPMG-Fit UI component -- components
 * never read `opportunity.fit_*` fields directly, only the normalized
 * shape below, so swapping mock data for a real scoring engine later is a
 * change to this file alone, not to any component.
 *
 * @typedef {Object} FitDimension
 * @property {number} score
 * @property {number} max
 *
 * @typedef {Object} KPMGFit
 * @property {"available"|"pending"|"insufficient_information"|"unavailable"} status
 * @property {number|null} score - 0-100, only set when status is "available"
 * @property {"strong"|"moderate"|"weak"|null} tier
 * @property {Object.<string, FitDimension>|null} breakdown - keyed by FIT_DIMENSIONS ids
 * @property {string[]} matchedCapabilities
 * @property {string[]} gaps
 * @property {string|null} explanation
 * @property {string|null} analyzedAt
 * @property {string|null} contentHash
 */

// The six fit dimensions from the "KPMG Fit Feasibility" assessment (§5),
// in display order. Components read this list rather than hard-coding
// dimension ids/labels, so adding/renaming a dimension later is a one-place
// change.
export const FIT_DIMENSIONS = [
  { id: "capability_technical_fit", label: "Capability & Technical Fit" },
  { id: "industry_sector_fit", label: "Industry / Sector Fit" },
  { id: "technology_platform_fit", label: "Technology / Platform Fit" },
  { id: "experience_track_record_fit", label: "Experience / Track Record" },
  { id: "eligibility_geographic_fit", label: "Eligibility / Geographic Fit" },
  { id: "pursuit_feasibility", label: "Pursuit Feasibility" },
];

const EMPTY_FIT = {
  status: "pending",
  score: null,
  tier: null,
  breakdown: null,
  matchedCapabilities: [],
  gaps: [],
  explanation: null,
  analyzedAt: null,
  contentHash: null,
};

/**
 * Converts the raw backend shape (opportunity.fit_status/fit_score/
 * fit_tier/fit_analysis, as returned by Opportunity.to_dict()) into the
 * normalized KPMGFit shape every component consumes. Works identically
 * whether `raw` came from a real API response or a fixture below -- that's
 * what proves the boundary is real rather than bypassed.
 * @param {Object|null} raw
 * @returns {KPMGFit}
 */
export function normalizeKpmgFit(raw) {
  if (!raw || !raw.fit_status) return EMPTY_FIT;

  const status = raw.fit_status;
  const analysis = raw.fit_analysis || {};
  const available = status === "available";

  return {
    status,
    score: available ? raw.fit_score ?? null : null,
    tier: available && raw.fit_tier ? raw.fit_tier.toLowerCase() : null,
    breakdown: available ? analysis.breakdown || null : null,
    matchedCapabilities: available ? analysis.matched_capabilities || [] : [],
    gaps: available ? analysis.gaps || [] : [],
    explanation: available ? analysis.explanation || null : null,
    analyzedAt: analysis.analyzed_at || null,
    contentHash: analysis.content_hash || null,
  };
}

// --- Development-only mock fixtures -----------------------------------
// Six raw-shaped profiles covering every analysisStatus (three "available"
// tiers + insufficient_information + pending + unavailable), so a real
// opportunity list exercises every UI state without manual toggling.
// Never used in production -- gated by KPMG_FIT_UI_ENABLED below, and even
// then only as a fallback when no real fit_status is present on the
// opportunity (true for every opportunity today, since nothing computes
// this server-side yet).
const MOCK_PROFILES = [
  {
    // Strong fit -- digital transformation / API / payments
    fit_status: "available",
    fit_score: 86,
    fit_tier: "strong",
    fit_analysis: {
      breakdown: {
        capability_technical_fit: { score: 32, max: 35 },
        industry_sector_fit: { score: 13, max: 15 },
        technology_platform_fit: { score: 9, max: 10 },
        experience_track_record_fit: { score: 12, max: 15 },
        eligibility_geographic_fit: { score: 12, max: 15 },
        pursuit_feasibility: { score: 8, max: 10 },
      },
      matched_capabilities: ["Digital Transformation", "API & Integration", "Payments"],
      gaps: ["Local implementation partner requested"],
      explanation:
        "Closely aligns with KPMG's Connected capabilities -- the opportunity requires API integration, payments modernization, and digital-channel transformation.",
      analyzed_at: "2026-08-20T09:00:00Z",
      content_hash: "mock-strong",
    },
  },
  {
    // Moderate fit -- a technology implementation opportunity
    fit_status: "available",
    fit_score: 64,
    fit_tier: "moderate",
    fit_analysis: {
      breakdown: {
        capability_technical_fit: { score: 22, max: 35 },
        industry_sector_fit: { score: 10, max: 15 },
        technology_platform_fit: { score: 6, max: 10 },
        experience_track_record_fit: { score: 10, max: 15 },
        eligibility_geographic_fit: { score: 9, max: 15 },
        pursuit_feasibility: { score: 7, max: 10 },
      },
      matched_capabilities: ["ERP Implementation", "Cloud & DevOps"],
      gaps: ["Specific sector experience not confirmed", "Shorter delivery window than typical engagements"],
      explanation:
        "Partial alignment with KPMG's Powered capabilities -- a genuine technology implementation engagement, though sector focus and delivery pace are less typical of KPMG's usual pursuit profile.",
      analyzed_at: "2026-08-19T09:00:00Z",
      content_hash: "mock-moderate",
    },
  },
  {
    // Weak fit -- outside primary technology advisory capabilities
    fit_status: "available",
    fit_score: 38,
    fit_tier: "weak",
    fit_analysis: {
      breakdown: {
        capability_technical_fit: { score: 10, max: 35 },
        industry_sector_fit: { score: 6, max: 15 },
        technology_platform_fit: { score: 3, max: 10 },
        experience_track_record_fit: { score: 8, max: 15 },
        eligibility_geographic_fit: { score: 6, max: 15 },
        pursuit_feasibility: { score: 5, max: 10 },
      },
      matched_capabilities: ["IT Risk"],
      gaps: ["Outside KPMG's primary technology advisory capabilities", "No clear platform/technology alignment identified"],
      explanation:
        "Limited alignment with KPMG's technology advisory capabilities -- the opportunity's core scope sits largely outside Connected, Powered, Trusted, and Data.",
      analyzed_at: "2026-08-18T09:00:00Z",
      content_hash: "mock-weak",
    },
  },
  {
    // Insufficient information -- e.g. a source with only metadata, no real description
    fit_status: "insufficient_information",
  },
  {
    // Not yet analyzed
    fit_status: "pending",
  },
  {
    // Analysis attempted but not available (e.g. a transient engine failure)
    fit_status: "unavailable",
  },
];

function stableIndex(key, length) {
  let hash = 0;
  const s = String(key ?? "");
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

/**
 * Deterministic mock KPMGFit for one opportunity, in the raw backend shape
 * (so it round-trips through the same normalizer real data would). Stable
 * per opportunity (same id/link always yields the same mock state) so a
 * card and its detail view never disagree, and a reload doesn't flicker.
 */
function getMockKpmgFitRaw(opportunity) {
  if (!opportunity) return MOCK_PROFILES[4]; // pending
  const idx = stableIndex(opportunity.id ?? opportunity.link, MOCK_PROFILES.length);
  return MOCK_PROFILES[idx];
}

/**
 * The single entry point every KPMG-Fit UI component should use. Returns
 * `null` whenever the feature flag is off -- callers should treat `null`
 * as "render nothing," which every component here already does. When the
 * flag is on, prefers real backend data (opportunity.fit_status set by a
 * future scoring engine) and only falls back to fixture data when none
 * exists yet, which is every opportunity today.
 * @param {Object} opportunity
 * @returns {KPMGFit|null}
 */
export function getKpmgFit(opportunity) {
  if (!KPMG_FIT_UI_ENABLED) return null;
  if (opportunity && opportunity.fit_status) return normalizeKpmgFit(opportunity);
  return normalizeKpmgFit(getMockKpmgFitRaw(opportunity));
}
