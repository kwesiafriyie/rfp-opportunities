import { FIT_DIMENSIONS } from "@/app/lib/kpmgFit";

// Generic, data-driven -- reads FIT_DIMENSIONS for labels/order and the
// `breakdown` prop for values; never hard-codes a dimension name or score.
// Always shows "score / max" as text, never a bar alone, so nothing here
// depends on color to be understood (a screen reader gets the same
// information a sighted user does).
export default function FitBreakdown({ breakdown }) {
  if (!breakdown) return null;

  return (
    <dl className="space-y-2">
      {FIT_DIMENSIONS.map(({ id, label }) => {
        const dim = breakdown[id];
        if (!dim) return null;
        const pct = dim.max > 0 ? Math.round((dim.score / dim.max) * 100) : 0;
        return (
          <div key={id} className="flex items-center gap-3 text-sm">
            <dt className="flex-1 text-slate-600">{label}</dt>
            <div
              className="w-20 sm:w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden flex-none"
              role="img"
              aria-label={`${label}: ${dim.score} out of ${dim.max}`}
            >
              <div className="h-full bg-slate-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <dd className="font-mono text-xs text-slate-500 w-12 text-right flex-none">
              {dim.score} / {dim.max}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
