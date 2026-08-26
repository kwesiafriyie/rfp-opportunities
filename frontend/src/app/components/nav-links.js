"use client";
import clsx from "clsx";
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { usePathname } from "next/navigation";

import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Opportunities", href: "/dashboard/opportunities", icon: DocumentTextIcon },
  { name: "Analytics", href: "/dashboard/analysis", icon: ChartBarIcon },
  { name: "Get Alerts", href: "/dashboard/subscribers", icon: EnvelopeIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[46px] grow items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:flex-none md:justify-start",
              {
                "bg-slate-800 text-white": active,
              }
            )}
          >
            <LinkIcon className="w-5 h-5 flex-none" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
