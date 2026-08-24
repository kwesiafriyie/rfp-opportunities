"use client";
import React, { useState, useEffect } from "react";
import { EnvelopeIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/subscribers/`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      setSubscribers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/subscribers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || `HTTP error! Status: ${res.status}`);
      setEmail("");
      setMessage(`${data.email} was added.`);
      fetchSubscribers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (subscriber) => {
    setError(null);
    setMessage(null);
    setRemovingId(subscriber.id);
    try {
      const res = await fetch(`${API_URL}/api/subscribers/${subscriber.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      setSubscribers((prev) => prev.filter((s) => s.id !== subscriber.id));
      setMessage(`${subscriber.email} was removed.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-amber-100 text-amber-600 mb-4">
          <EnvelopeIcon className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900">Notifications</h1>
        <p className="text-slate-500 mt-1">
          Everyone below gets an email digest whenever new consulting opportunities are found.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-slate-200">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-700"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <PlusIcon className="w-5 h-5" />
            {submitting ? "Adding..." : "Add Recipient"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            {subscribers.length} Recipient{subscribers.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-center text-slate-400">Loading...</p>
        ) : subscribers.length === 0 ? (
          <p className="p-6 text-center text-slate-400">No recipients yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {subscribers.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-slate-800 font-medium">{s.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Added{" "}
                    {s.created_at
                      ? new Date(s.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "recently"}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(s)}
                  disabled={removingId === s.id}
                  aria-label={`Remove ${s.email}`}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
