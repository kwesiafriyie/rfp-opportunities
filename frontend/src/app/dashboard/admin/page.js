import Link from "next/link";
import { DocumentTextIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function AdminHome() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-1">Admin</h1>
      <p className="text-slate-500 mb-8">Manual opportunity intake, corrections, and subscriber management.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/admin/opportunities"
          className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-md transition-all"
        >
          <DocumentTextIcon className="w-6 h-6 text-amber-600 mb-3" />
          <h2 className="font-semibold text-slate-800">Opportunities</h2>
          <p className="text-sm text-slate-500 mt-1">Add, edit, or remove opportunities from any source.</p>
        </Link>
        <Link
          href="/dashboard/admin/subscribers"
          className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-md transition-all"
        >
          <EnvelopeIcon className="w-6 h-6 text-amber-600 mb-3" />
          <h2 className="font-semibold text-slate-800">Subscribers</h2>
          <p className="text-sm text-slate-500 mt-1">View and manage the alert recipient list.</p>
        </Link>
      </div>
    </div>
  );
}
