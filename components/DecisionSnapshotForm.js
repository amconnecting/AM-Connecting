"use client";

import { useState } from "react";

const initialForm = {
  groupId: "",
  groupName: "",
  mainPriority: "",
  biggestTradeOff: "",
  temporaryDirection: "",
  collaborationInsight: "",
  boardPhotoUrl: ""
};

export default function DecisionSnapshotForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files?.[0] ? files[0].name : value
    }));
  }

  async function submitSnapshot(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch("/api/snapshot", {
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

      setForm(initialForm);
      setStatus({ type: "success", text: "Decision Snapshot saved. Your group can continue from this point during the follow-up." });
    } catch {
      setStatus({ type: "error", text: "The snapshot could not be saved. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitSnapshot} className="card grid gap-4 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Group ID" name="groupId" value={form.groupId} onChange={updateField} required />
        <Field label="Group name" name="groupName" value={form.groupName} onChange={updateField} required />
      </div>

      <TextArea label="Main priority" name="mainPriority" value={form.mainPriority} onChange={updateField} required />
      <TextArea label="Biggest trade-off" name="biggestTradeOff" value={form.biggestTradeOff} onChange={updateField} required />
      <TextArea label="Shared direction for now" name="temporaryDirection" value={form.temporaryDirection} onChange={updateField} required />
      <TextArea label="Collaboration insight" name="collaborationInsight" value={form.collaborationInsight} onChange={updateField} required />

      <label className="field">
        Board photo
        <input className="input bg-cloud file:mr-4 file:rounded-full file:border-0 file:bg-teal file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" name="boardPhotoUrl" type="file" accept="image/*" onChange={updateField} />
        <span className="text-xs font-semibold text-navy/55">Photo upload is prepared as a placeholder. For now, only the file name and text fields are saved.</span>
      </label>

      {status.text ? (
        <p className={`rounded-lg px-4 py-3 text-sm font-bold ${status.type === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-800"}`}>
          {status.text}
        </p>
      ) : null}

      <button className="button-primary w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving snapshot..." : "Save Decision Snapshot"}
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
