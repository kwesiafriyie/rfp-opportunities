import { getKpmgFit } from "@/app/lib/kpmgFit";

// Card-level indicator only -- tier label, never the numeric score (see the
// task's own instruction: the card stays a discovery/scanning surface, the
// detail view is where the score and its reasoning live). Renders nothing
// for pending/insufficient_information/unavailable: those are nuances that
// belong in the detail view, not a fourth card-level state to parse at a
// glance. A plain colored dot + text label, deliberately styled like
// DeadlineBadge (text + icon, no background pill, no color-only meaning)
// rather than the source badge's filled-pill treatment -- this is a quiet
// secondary signal, not another category tag.
// Amber is deliberately avoided here even though it reads as a natural
// "medium" tone -- this product already uses amber exclusively to mean
// deadline urgency (see DeadlineBadge), and this chip can render right
// alongside a deadline badge. Reusing amber for a second, unrelated signal
// would blur two things a user needs to tell apart at a glance.
const TIER_STYLES = {
  strong: "text-emerald-700",
  moderate: "text-blue-600",
  weak: "text-slate-500",
};

export default function FitChip({ opportunity, className = "" }) {
  const fit = getKpmgFit(opportunity);
  if (!fit || fit.status !== "available" || !fit.tier) return null;

  const label = fit.tier.charAt(0).toUpperCase() + fit.tier.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${TIER_STYLES[fit.tier] || "text-slate-500"} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current flex-none" aria-hidden="true" />
      {label} fit
    </span>
  );
}
