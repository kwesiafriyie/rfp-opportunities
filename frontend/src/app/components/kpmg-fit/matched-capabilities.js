// Arbitrary-length list of matched capability tags. Purely presentational --
// the list itself always comes from the KPMGFit result, never hard-coded.
export default function MatchedCapabilities({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Matched capabilities
      </h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-500 flex-none" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
