"use client";

import { useState } from "react";

const initialForm = {
  company: "",
  department: "",
  function: "",
  name: "",
  seniority: "",
  officeLocation: "",
  email: ""
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
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
      <p className="border-l-4 border-teal pl-4 text-sm font-semibold leading-6 text-navy/65 md:col-span-2">
        Your information is only used to create balanced cross-department teams and communicate about the challenge.
      </p>
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
