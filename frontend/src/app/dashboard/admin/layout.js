"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftOnRectangleIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { getAdminToken, clearAdminToken } from "@/app/lib/adminAuth";

// Route guard for everything under /dashboard/admin except the login page
// itself. This is a UX convenience only -- it just avoids flashing admin
// content before redirecting to login. The actual security boundary is the
// backend's require_admin check on every admin API request; a missing or
// expired token here always still gets a 401 from the server regardless of
// what this guard does.
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === "/dashboard/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    if (!getAdminToken()) {
      router.replace("/dashboard/admin/login");
      return;
    }
    setChecked(true);
  }, [isLoginPage, pathname, router]);

  const handleLogout = () => {
    clearAdminToken();
    router.push("/dashboard/admin/login");
  };

  if (!checked) return null;

  return (
    <div className="min-h-full flex flex-col">
      {!isLoginPage && (
        <div className="flex items-center justify-between px-6 md:px-10 py-3 bg-slate-900 text-slate-300 text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white">Admin</span>
            <Link href="/dashboard/admin" className="hover:text-white transition-colors">
              Opportunities &amp; Subscribers
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <ArrowUturnLeftIcon className="w-4 h-4" /> Back to site
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <ArrowLeftOnRectangleIcon className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
