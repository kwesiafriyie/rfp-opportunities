"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/app/lib/api";
import { adminFetch } from "@/app/lib/adminAuth";
import OpportunityForm from "@/app/components/admin/opportunity-form";

export default function EditOpportunityPage() {
  const router = useRouter();
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    // A single opportunity lookup isn't sensitive, so this reuses the public
    // (unauthenticated) detail endpoint -- it's also the one endpoint that
    // was already left without the open-only filter, which is exactly what
    // an edit form needs to load an expired record too.
    fetch(`${API_URL}/api/opportunities/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Opportunity not found" : `HTTP error! Status: ${res.status}`);
        setOpportunity(await res.json());
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (payload, force = false) => {
    setSubmitting(true);
    setError(null);
    try {
      const url = `${API_URL}/api/admin/opportunities/${id}${force ? "?force=true" : ""}`;
      const res = await adminFetch(url, {
        method: "PUT",
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
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-1">Edit Opportunity</h1>
      <p className="text-slate-500 mb-8">Corrections apply everywhere the opportunity is shown -- cards, search, filters, and the detail view.</p>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : loadError ? (
        <p className="text-red-500">{loadError}</p>
      ) : (
        <OpportunityForm
          initial={opportunity}
          onSubmit={(payload) => submit(payload, false)}
          submitting={submitting}
          error={error}
          duplicate={duplicate}
          onForceCreate={() => submit(pendingPayload, true)}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
