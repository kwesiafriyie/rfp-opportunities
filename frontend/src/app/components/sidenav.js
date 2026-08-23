import Link from "next/link";
import NavLinks from "./nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-4 py-6 md:px-6 md:py-8 bg-gradient-to-tl from-blue-600 to-purple-600">
      {/* Logo/Title Section */}
      <Link
        className="mb-6 flex items-center justify-start rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 p-6 transition-all hover:scale-105 transform"
        href="/"
      >
        <div className="text-white">
          <p className="text-3xl font-bold tracking-wide drop-shadow-lg md:text-4xl">Opportunities</p>
          <p className="text-sm text-blue-200 md:text-base">Explore your potential</p>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-row space-x-4 md:flex-col md:space-y-4 grow">
        <NavLinks />

        {/* Sign Out Button */}
        <form>
          <button className="flex items-center justify-start gap-3 p-3 rounded-md bg-gray-100 text-gray-700 text-sm font-medium transition-all hover:bg-sky-100 hover:text-blue-600 md:w-auto md:justify-start">
            <PowerIcon className="w-6" />
            <span className="hidden md:block">Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}


