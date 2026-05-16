"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  company: "",
  email: "",
  message: ""
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitContact(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          text: result.errors?.join(" ") || result.error || "The message could not be sent."
        });
        return;
      }

      setForm(initialForm);
      setStatus({ type: "success", text: "Thank you. Your message has been sent." });
    } catch {
      setStatus({ type: "error", text: "The message could not be sent. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitContact} className="card grid gap-4 bg-cloud p-6">
      <label className="field">
        Name
        <input className="input" name="name" type="text" value={form.name} onChange={updateField} required />
      </label>
      <label className="field">
        Company
        <input className="input" name="company" type="text" value={form.company} onChange={updateField} />
      </label>
      <label className="field">
        Email
        <input className="input" name="email" type="email" value={form.email} onChange={updateField} required />
      </label>
      <label className="field">
        Message
        <textarea className="input min-h-32 resize-y" name="message" value={form.message} onChange={updateField} required />
      </label>
      {status.text ? (
        <p className={`rounded-lg px-4 py-3 text-sm font-bold ${status.type === "success" ? "bg-teal/10 text-teal" : "bg-red-50 text-red-800"}`}>
          {status.text}
        </p>
      ) : null}
      <button className="button-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
