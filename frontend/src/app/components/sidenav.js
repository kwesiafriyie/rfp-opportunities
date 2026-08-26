import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
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

      <Link
        href="/dashboard/admin"
        className="flex h-[40px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
      >
        <Cog6ToothIcon className="w-4 h-4 flex-none" />
        <p className="hidden md:block">Admin</p>
      </Link>

      <p className="hidden px-2 text-xs text-slate-500 md:block mt-3">
        Tracking standard.gm, thepoint.gm &amp; foroyaa.net
      </p>
    </div>
  );
}
