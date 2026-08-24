import Link from "next/link";
import NavLinks from "./nav-links";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-slate-900 px-4 py-6 md:px-5 md:py-8">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-amber-500 font-serif text-lg font-bold text-slate-900">
          C
        </div>
        <div className="min-w-0 text-white">
          <p className="text-base font-semibold leading-tight truncate">
            Consulting Opportunities
          </p>
          <p className="text-xs text-slate-400">Opportunity notice tracker</p>
        </div>
      </Link>

      <div className="flex grow flex-row space-x-2 md:flex-col md:space-y-1 md:space-x-0">
        <NavLinks />
      </div>

      <p className="hidden px-2 text-xs text-slate-500 md:block">
        Tracking standard.gm, thepoint.gm &amp; foroyaa.net
      </p>
    </div>
  );
}
