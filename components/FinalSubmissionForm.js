"use client";

import Link from "next/link";
import { useState } from "react";

export default function FinalSubmissionForm({ groupId, defaultGroupName }) {
  const [form, setForm] = useState({
    groupId,
    groupName: defaultGroupName,
    finalDirection: "",
    finalPriorities: "",
    finalTradeOffs: "",
    collaborationLessons: "",
    whatTheGroupUnderstoodBetter: "",
    optionalFileUrl: ""
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField(event) {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files?.[0] ? files[0].name : value
    }));
  }

  async function submitFinalSubmission(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch("/api/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          text: result.errors ? Object.values(result.errors).join(" ") : "Please check the required fields."
        });
        return;
      }

      setIsSubmitted(true);
    } catch {
      setStatus({ type: "error", text: "The final submission could not be saved. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <section className="card p-6 text-center sm:p-8">
        <p className="eyebrow">Thank you</p>
        <h2 className="mt-4 text-4xl font-bold text-navy">Your group summary has been received.</h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-navy/70">
          Thank you for capturing your shared direction, trade-offs and collaboration lessons. Please continue with the participant survey.
        </p>
        <Link className="button-primary mt-7" href={`/survey/${groupId}`}>
          Go to participant survey
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={submitFinalSubmission} className="card grid gap-4 p-5 sm:p-6">
      <Field label="Group name" name="groupName" value={form.groupName} onChange={updateField} required />
      <TextArea label="Shared direction" name="finalDirection" value={form.finalDirection} onChange={updateField} required />
      <TextArea label="Priorities you aligned on" name="finalPriorities" value={form.finalPriorities} onChange={updateField} required />
      <TextArea label="Trade-offs you discussed" name="finalTradeOffs" value={form.finalTradeOffs} onChange={updateField} required />
      <TextArea label="Collaboration lessons" name="collaborationLessons" value={form.collaborationLessons} onChange={updateField} required />
      <TextArea label="What the group understood better" name="whatTheGroupUnderstoodBetter" value={form.whatTheGroupUnderstoodBetter} onChange={updateField} required />

      <label className="field">
        Optional file upload
        <input className="input bg-cloud file:mr-4 file:rounded-full file:border-0 file:bg-teal file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" name="optionalFileUrl" type="file" onChange={updateField} />
        <span className="text-xs font-semibold text-navy/55">File upload is prepared as a placeholder. For now, only the file name and text fields are saved.</span>
      </label>

      {status.text ? (
        <p className={`rounded-lg px-4 py-3 text-sm font-bold ${status.type === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-800"}`}>
          {status.text}
        </p>
      ) : null}

      <button className="button-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving final submission..." : "Submit collaborative summary"}
      </button>
    </form>
  );
}

function Field({ label, className = "", ...inputProps }) {
  return (
    <label className={`field ${className}`}>
      {label}
      <input className="input bg-cloud focus:bg-white" placeholder={label} {...inputProps} />
    </label>
  );
}

function TextArea({ label, className = "", ...inputProps }) {
  return (
    <label className={`field ${className}`}>
      {label}
      <textarea className="input min-h-28 resize-y bg-cloud focus:bg-white" placeholder={label} {...inputProps} />
    </label>
  );
}
