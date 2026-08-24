"use client";
import React, { useState, useEffect } from "react";
import { EnvelopeIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-md mb-4">
            <EnvelopeIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Email Notifications</h1>
          <p className="text-gray-500 mt-2">
            Everyone below gets an email digest whenever new consulting opportunities are found.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-100">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <PlusIcon className="w-5 h-5" />
              {submitting ? "Adding..." : "Add Recipient"}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
        </div>

        <div className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              {subscribers.length} Recipient{subscribers.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-400">Loading...</p>
          ) : subscribers.length === 0 ? (
            <p className="p-6 text-center text-gray-400">No recipients yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {subscribers.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{s.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
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
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
