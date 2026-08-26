"use client";
import React, { useState } from "react";
import { EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";

// Public subscribe page: an email in, a confirmation out. No subscriber
// list, no counts, no management controls -- that's all in the admin area
// now (see /dashboard/admin/subscribers), never exposed here.
export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | subscribed | already | error
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/subscribers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.status === 201) {
        setStatus("subscribed");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setStatus("already");
        return;
      }
      throw new Error(data.detail || `HTTP error! Status: ${res.status}`);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  const isDone = status === "subscribed" || status === "already";

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 mb-4">
          {isDone ? <CheckCircleIcon className="w-6 h-6" /> : <EnvelopeIcon className="w-6 h-6" />}
        </div>

        {isDone ? (
          <>
            <h1 className="text-xl font-semibold text-slate-900 mb-1">
              {status === "subscribed" ? "You're subscribed." : "You're already subscribed."}
            </h1>
            <p className="text-slate-500">We&apos;ll send relevant opportunity updates to your email.</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-slate-900 mb-1">Get opportunity alerts</h1>
            <p className="text-slate-500 mb-6">
              Enter your email address to receive relevant opportunity updates.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-700"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full px-4 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {status === "submitting" ? "Subscribing..." : "Subscribe"}
              </button>
              {status === "error" && <p className="text-sm text-red-500">{errorMessage}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
