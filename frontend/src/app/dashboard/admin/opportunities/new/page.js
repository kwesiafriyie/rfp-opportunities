"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";
import { adminFetch } from "@/app/lib/adminAuth";
import OpportunityForm from "@/app/components/admin/opportunity-form";

export default function NewOpportunityPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);

  const submit = async (payload, force = false) => {
    setSubmitting(true);
    setError(null);
    try {
      const url = `${API_URL}/api/admin/opportunities${force ? "?force=true" : ""}`;
      const res = await adminFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setDuplicate(data.detail);
        setPendingPayload(payload);
        return;
      }
      if (!res.ok) throw new Error(data.detail || `HTTP error! Status: ${res.status}`);
      router.push("/dashboard/admin/opportunities");
    } catch (err) {
      if (err.isAuthError) {
        router.replace("/dashboard/admin/login");
        return;
      }
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Link href="/dashboard/admin/opportunities" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeftIcon className="w-4 h-4" /> Back to Opportunities
      </Link>
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-1">Add Opportunity</h1>
      <p className="text-slate-500 mb-8">Enter an opportunity from any source -- it will behave identically to a scraped one everywhere in the app.</p>

      <OpportunityForm
        onSubmit={(payload) => submit(payload, false)}
        submitting={submitting}
        error={error}
        duplicate={duplicate}
        onForceCreate={() => submit(pendingPayload, true)}
        submitLabel="Create Opportunity"
      />
    </div>
  );
}
