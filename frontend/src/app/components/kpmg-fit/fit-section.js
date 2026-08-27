import { getKpmgFit } from "@/app/lib/kpmgFit";
import FitBreakdown from "./fit-breakdown";
import MatchedCapabilities from "./matched-capabilities";
import PotentialGaps from "./potential-gaps";

// See fit-chip.js for why "moderate" is blue rather than amber -- amber is
// reserved for deadline urgency elsewhere in this product.
const TIER_STYLES = {
  strong: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  moderate: "bg-blue-50 text-blue-700 ring-blue-600/20",
  weak: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

// Copy for the three non-"available" states. Deliberately plain, no score,
// no styled badge -- these are "nothing to show yet" states, not a lesser
// version of a fit result.
const STATUS_COPY = {
  pending: {
    heading: "Analysis pending",
    body: "This opportunity has not yet been assessed.",
  },
  insufficient_information: {
    heading: "Insufficient information",
    body: "There isn't enough substantive opportunity information to produce a reliable fit assessment.",
  },
  unavailable: {
    heading: "Analysis unavailable",
    body: "KPMG Fit analysis is currently unavailable for this opportunity.",
  },
};

/**
 * The KPMG Opportunity Fit detail-view section. Renders nothing when the
 * feature flag is off (getKpmgFit returns null) or when there's simply no
 * opportunity -- callers don't need their own flag check before using this,
 * though the modal still gates it for clarity at the call site too.
 *
 * `Section` is passed in rather than imported, reusing the exact heading/
 * divider component the rest of the opportunity modal already uses (see
 * opportunity-modal.js) instead of a second, slightly-different one.
 */
export default function FitSection({ opportunity, Section }) {
  const fit = getKpmgFit(opportunity);
  if (!fit) return null;

  if (fit.status !== "available") {
    const copy = STATUS_COPY[fit.status] || STATUS_COPY.unavailable;
    return (
      <Section title="KPMG Opportunity Fit">
        <p className="text-sm font-medium text-slate-600">{copy.heading}</p>
        <p className="text-sm text-slate-500 mt-1">{copy.body}</p>
      </Section>
    );
  }

  const tierLabel = fit.tier ? fit.tier.charAt(0).toUpperCase() + fit.tier.slice(1) : null;

  return (
    <Section title="KPMG Opportunity Fit">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl font-semibold text-slate-900">
          {fit.score}
          <span className="text-sm font-normal text-slate-400"> / 100</span>
        </span>
        {tierLabel && (
          <span
            className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ring-inset ${TIER_STYLES[fit.tier] || TIER_STYLES.weak}`}
          >
            {tierLabel}
          </span>
        )}
      </div>

      {fit.explanation && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Why this matches
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">{fit.explanation}</p>
        </div>
      )}

      {(fit.matchedCapabilities.length > 0 || fit.gaps.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <MatchedCapabilities items={fit.matchedCapabilities} />
          <PotentialGaps items={fit.gaps} />
        </div>
      )}

      {fit.breakdown && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Fit breakdown
          </h4>
          <FitBreakdown breakdown={fit.breakdown} />
        </div>
      )}
    </Section>
  );
}
