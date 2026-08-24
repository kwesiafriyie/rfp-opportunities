"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DocumentTextIcon,
  GlobeAltIcon,
  ClockIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";

const SOURCES = [
  "standard.gm",
  "thepoint.gm",
  "foroyaa.net",
  "dailyobservergambia.com",
  "gambiatenders.com",
  "tenders.gm",
];
const SOURCE_STYLES = {
  "standard.gm": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "thepoint.gm": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "foroyaa.net": "bg-violet-50 text-violet-700 ring-violet-600/20",
  "dailyobservergambia.com": "bg-rose-50 text-rose-700 ring-rose-600/20",
  "gambiatenders.com": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "tenders.gm": "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
};

function formatDate(iso) {
  if (!iso) return "Date unknown";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SourceBadge({ source }) {
  return (
    <span
      className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ring-inset ${
        SOURCE_STYLES[source] || "bg-slate-100 text-slate-600 ring-slate-500/20"
      }`}
    >
      {source}
    </span>
  );
}

function StatTile({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div
        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${
          accent ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function DashboardHome() {
  const [opportunities, setOpportunities] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [oppRes, subRes] = await Promise.all([
          fetch(`${API_URL}/api/opportunities/?limit=500`),
          fetch(`${API_URL}/api/subscribers/`),
        ]);
        if (!oppRes.ok) throw new Error(`HTTP error! Status: ${oppRes.status}`);
        setOpportunities(await oppRes.json());
        if (subRes.ok) setSubscriberCount((await subRes.json()).length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-slate-400">Loading dashboard...</div>;
  }
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Couldn&apos;t reach the backend: {error}
      </div>
    );
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newThisWeek = opportunities.filter(
    (o) => o.created_at && new Date(o.created_at) >= sevenDaysAgo
  ).length;

  const sourceCounts = SOURCES.reduce((acc, s) => {
    acc[s] = opportunities.filter((o) => o.source === s).length;
    return acc;
  }, {});

  const recent = opportunities.slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Consulting and EOI notices tracked across {SOURCES.length} trusted news sources.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatTile icon={DocumentTextIcon} label="Total Opportunities" value={opportunities.length} />
        <StatTile icon={GlobeAltIcon} label="Sources Monitored" value={SOURCES.length} />
        <StatTile icon={ClockIcon} label="New This Week" value={newThisWeek} accent />
        <StatTile icon={EnvelopeIcon} label="Subscribers" value={subscriberCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Opportunities</h2>
            <Link
              href="/dashboard/opportunities"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1"
            >
              View all <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="p-8 text-center text-slate-400">
              Nothing found yet. Check back after the next scrape.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((o) => (
                <li key={o.link} className="hover:bg-slate-50 transition-colors">
                  <a href={o.link} target="_blank" rel="noopener noreferrer" className="block px-6 py-4">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{o.title}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <SourceBadge source={o.source} />
                      <span className="text-xs text-slate-400">{formatDate(o.published_at)}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Sources</h2>
          <div className="space-y-4">
            {SOURCES.map((s) => (
              <div key={s} className="flex items-center justify-between">
                <SourceBadge source={s} />
                <span className="text-sm font-medium text-slate-600">{sourceCounts[s]} found</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
