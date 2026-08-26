"use client";
import React, { useState } from "react";
import Link from "next/link";
import { PlusIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SOURCES, OPPORTUNITY_TYPES, SECTORS } from "@/app/lib/taxonomy";

// datetime-local wants "YYYY-MM-DDTHH:mm"; an ISO string from the API has
// seconds/offset that input rejects, so trim it down for display.
function toDateTimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const emptyValues = {
  source: "",
  title: "",
  link: "",
  organization: "",
  country: "",
  opportunity_type: "",
  sector: "",
  description: "",
  published_at: "",
  deadline: "",
  reference: "",
  eligibility: "",
  contact_info: "",
  documents: [],
  extra: [],
};

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full px-3 py-2 border border-slate-200 rounded-lg bg-white shadow-sm text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400";

export default function OpportunityForm({ initial, onSubmit, submitting, error, duplicate, onForceCreate, submitLabel }) {
  const [values, setValues] = useState(() => ({
    ...emptyValues,
    ...initial,
    published_at: toDateInput(initial?.published_at),
    deadline: toDateTimeLocal(initial?.deadline),
    documents: initial?.documents?.length ? initial.documents : [],
    extra: initial?.extra?.length ? initial.extra : [],
  }));
  const [sourceIsCustom, setSourceIsCustom] = useState(
    Boolean(initial?.source) && !SOURCES.includes(initial.source)
  );

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const updateListItem = (listField, index, key, val) => {
    setValues((v) => {
      const list = [...v[listField]];
      list[index] = { ...list[index], [key]: val };
      return { ...v, [listField]: list };
    });
  };
  const addListItem = (listField, shape) =>
    setValues((v) => ({ ...v, [listField]: [...v[listField], shape] }));
  const removeListItem = (listField, index) =>
    setValues((v) => ({ ...v, [listField]: v[listField].filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      source: values.source,
      title: values.title,
      link: values.link,
      organization: values.organization || null,
      country: values.country || null,
      opportunity_type: values.opportunity_type || null,
      sector: values.sector || null,
      description: values.description || null,
      published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
      deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
      reference: values.reference || null,
      eligibility: values.eligibility || null,
      contact_info: values.contact_info || null,
      documents: values.documents.filter((d) => d.url),
      extra: values.extra.filter((x) => x.label && x.value),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {duplicate && (
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-none mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">{duplicate.message}</p>
            <p className="text-sm text-amber-700 mt-1 truncate">
              Existing: <strong>{duplicate.existing_opportunity.title}</strong>
              {duplicate.existing_opportunity.organization ? ` — ${duplicate.existing_opportunity.organization}` : ""}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Link
                href={`/dashboard/admin/opportunities/${duplicate.existing_opportunity.id}/edit`}
                className="px-3 py-1.5 text-sm font-medium bg-white border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors"
              >
                Edit existing opportunity
              </Link>
              <button
                type="button"
                onClick={onForceCreate}
                className="px-3 py-1.5 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Create anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Source *">
          {sourceIsCustom ? (
            <div className="flex gap-2">
              <input className={inputClass} value={values.source} onChange={set("source")} required placeholder="Source name" />
              <button type="button" onClick={() => setSourceIsCustom(false)} className="text-xs text-slate-400 hover:text-slate-600 flex-none">
                Choose from list
              </button>
            </div>
          ) : (
            <select
              className={inputClass}
              value={values.source}
              onChange={(e) => (e.target.value === "__other__" ? setSourceIsCustom(true) : set("source")(e))}
              required
            >
              <option value="">Select a source...</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="__other__">Other (type a new source)...</option>
            </select>
          )}
        </Field>

        <Field label="Official opportunity URL *" hint="The authoritative source link -- this is also used to detect duplicates.">
          <input type="url" className={inputClass} value={values.link} onChange={set("link")} required placeholder="https://..." />
        </Field>
      </div>

      <Field label="Title *">
        <input className={inputClass} value={values.title} onChange={set("title")} required />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Organization">
          <input className={inputClass} value={values.organization} onChange={set("organization")} placeholder="e.g. United Nations Development Programme" />
        </Field>
        <Field label="Country">
          <input className={inputClass} value={values.country} onChange={set("country")} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Opportunity type">
          <select className={inputClass} value={values.opportunity_type} onChange={set("opportunity_type")}>
            <option value="">Not set</option>
            {OPPORTUNITY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Sector">
          <select className={inputClass} value={values.sector} onChange={set("sector")}>
            <option value="">Uncategorized</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Reference number">
          <input className={inputClass} value={values.reference} onChange={set("reference")} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Publication date">
          <input type="date" className={inputClass} value={values.published_at} onChange={set("published_at")} />
        </Field>
        <Field label="Deadline" hint="Drives the open/expired status and countdown, exactly like a scraped opportunity.">
          <input type="datetime-local" className={inputClass} value={values.deadline} onChange={set("deadline")} />
        </Field>
      </div>

      <Field label="Description" hint="The full opportunity description -- a short card summary is generated from this automatically.">
        <textarea className={inputClass} rows={6} value={values.description} onChange={set("description")} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Eligibility / requirements">
          <textarea className={inputClass} rows={3} value={values.eligibility} onChange={set("eligibility")} />
        </Field>
        <Field label="Contact information">
          <textarea className={inputClass} rows={3} value={values.contact_info} onChange={set("contact_info")} />
        </Field>
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-700 mb-2">Documents</span>
        <div className="space-y-2">
          {values.documents.map((doc, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Label (e.g. Terms of Reference)"
                value={doc.label || ""}
                onChange={(e) => updateListItem("documents", i, "label", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Document URL"
                value={doc.url || ""}
                onChange={(e) => updateListItem("documents", i, "url", e.target.value)}
              />
              <button type="button" onClick={() => removeListItem("documents", i)} className="flex-none p-2 text-slate-400 hover:text-red-500">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem("documents", { label: "", url: "" })}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          <PlusIcon className="w-4 h-4" /> Add document
        </button>
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-700 mb-2">
          Additional source-specific fields
        </span>
        <p className="text-xs text-slate-400 mb-2">
          For details that don&apos;t fit the common fields above -- e.g. AfDB&apos;s Project, Funding Source, or Procurement Method.
        </p>
        <div className="space-y-2">
          {values.extra.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Label (e.g. Funding Source)"
                value={item.label || ""}
                onChange={(e) => updateListItem("extra", i, "label", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Value"
                value={item.value || ""}
                onChange={(e) => updateListItem("extra", i, "value", e.target.value)}
              />
              <button type="button" onClick={() => removeListItem("extra", i)} className="flex-none p-2 text-slate-400 hover:text-red-500">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem("extra", { label: "", value: "" })}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          <PlusIcon className="w-4 h-4" /> Add field
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
