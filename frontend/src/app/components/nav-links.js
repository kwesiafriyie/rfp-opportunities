"use client";
import clsx from "clsx";
import {
  UserGroupIcon,DocumentTextIcon,
  HomeIcon,ChartBarIcon,
  DocumentDuplicateIcon,LightBulbIcon
} from "@heroicons/react/24/outline";

import { usePathname } from "next/navigation";

import Link from "next/link";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "RFPs", href: "/dashboard/explore-rfp", icon: DocumentTextIcon },
  {name: "Analysis", href: "/dashboard/analysis", icon: ChartBarIcon },
  { name: "Suggestions", href: "/dashboard/suggestion", icon: LightBulbIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center text-gray-500 justify-center gap-1 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-200 hover:text-blue-500 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-200 text-blue-500": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
