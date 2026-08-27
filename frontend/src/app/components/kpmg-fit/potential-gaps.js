// Arbitrary-length list of potential gaps. Wording stays neutral ("potential
// gaps") -- this never implies a gap is a definite disqualifier unless the
// scoring result itself says so explicitly, which the data contract doesn't
// currently have a field for (a future engine could add one; the UI isn't
// meant to infer it from a gap merely being listed).
export default function PotentialGaps({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Potential gaps
      </h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-500 flex-none" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
