import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  const input = await request.json().catch(() => ({}));
  const contact = validateContact(input);

  if (contact.errors.length > 0) {
    return NextResponse.json({ ok: false, errors: contact.errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "hello@am-connecting.com";
  const from = process.env.CONTACT_FROM_EMAIL || "AM-Connecting <noreply@am-connecting.com>";

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY." }, { status: 500 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: contact.email,
      subject: `New AM-Connecting contact request from ${contact.name}`,
      text: buildEmailText(contact)
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return NextResponse.json({ ok: false, error: error.message || "Email could not be sent." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function validateContact(input) {
  const contact = {
    name: String(input.name || "").trim(),
    company: String(input.company || "").trim(),
    email: String(input.email || "").trim().toLowerCase(),
    message: String(input.message || "").trim()
  };

  const errors = [];
  if (!contact.name) errors.push("Name is required.");
  if (!contact.email) errors.push("Email is required.");
  if (!contact.message) errors.push("Message is required.");

  return { ...contact, errors };
}

function buildEmailText(contact) {
  return `New message from the AM-Connecting website

Name: ${contact.name}
Company: ${contact.company || "-"}
Email: ${contact.email}

Message:
${contact.message}`;
}
