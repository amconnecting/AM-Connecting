"use client";

import { useState } from "react";

const initialForm = {
  company: "",
  department: "",
  function: "",
  name: "",
  seniority: "",
  officeLocation: "",
  email: "",
  privacyAccepted: false
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function submitRegistration(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch("/api/register", {
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
      setStatus({ type: "success", text: "Thank you. Your inscription has been received successfully." });
    } catch {
      setStatus({ type: "error", text: "The registration could not be sent. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitRegistration} className="card grid gap-4 p-6 md:grid-cols-2">
      <Field label="Company / Bank" name="company" value={form.company} onChange={updateField} required />
      <Field label="Department" name="department" value={form.department} onChange={updateField} required />
      <Field label="Function" name="function" value={form.function} onChange={updateField} />
      <Field label="Name" name="name" value={form.name} onChange={updateField} required />
      <Field label="Seniority" name="seniority" value={form.seniority} onChange={updateField} />
      <Field label="Office / Location" name="officeLocation" value={form.officeLocation} onChange={updateField} />
      <Field className="md:col-span-2" label="Email" name="email" type="email" value={form.email} onChange={updateField} required />
      <div className="rounded-lg border border-teal/20 bg-teal/5 p-4 md:col-span-2">
        <p className="text-sm font-semibold leading-6 text-navy/70">
          Your information is only used to create balanced cross-department teams and to communicate practical follow-up about the AM-Connecting challenge.
        </p>
        <label className="mt-4 flex gap-3 text-sm font-bold leading-6 text-navy">
          <input
            className="mt-1 h-4 w-4 accent-teal"
            name="privacyAccepted"
            type="checkbox"
            checked={form.privacyAccepted}
            onChange={updateField}
            required
          />
          <span>
            I have read and accept the <a className="text-teal underline" href="/privacy" target="_blank" rel="noreferrer">privacy policy</a>.
          </span>
        </label>
      </div>
      {status.text ? (
        <p className={`rounded-lg px-4 py-3 text-sm font-bold md:col-span-2 ${status.type === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-800"}`}>
          {status.text}
        </p>
      ) : null}
      <button className="button-primary md:col-span-2" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving registration..." : "Start inscription"}
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
