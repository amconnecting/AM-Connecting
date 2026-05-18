"use client";

import Link from "next/link";
import { useState } from "react";

export default function MyGroupLookup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function findGroup(event) {
    event.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", text: "" });
    setGroup(null);

    try {
      const response = await fetch("/api/my-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          text: result.error || "No group found yet. Please check your email or try again later."
        });
        return;
      }

      setGroup(result.group);
    } catch {
      setStatus({ type: "error", text: "Your group could not be loaded. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-5">
      <form onSubmit={findGroup} className="card grid gap-4 p-5 sm:p-6">
        <label className="field">
          Email address
          <input
            className="input bg-cloud focus:bg-white"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter the email you used for inscription"
            required
          />
        </label>
        <button className="button-primary w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Looking up your group..." : "Show my group"}
        </button>
        {status.text ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
            {status.text}
          </p>
        ) : null}
      </form>

      {group ? <GroupResult group={group} /> : null}
    </div>
  );
}

function GroupResult({ group }) {
  return (
    <section className="card p-5 sm:p-6">
      <p className="eyebrow">Your group</p>
      <h2 className="mt-3 text-4xl font-bold text-navy">{group.groupName}</h2>
      <p className="mt-3 text-sm font-semibold text-navy/60">{group.company}</p>

      <div className="mt-6 grid gap-3">
        {group.participants.map((participant) => (
          <div key={`${participant.name}-${participant.function}`} className="rounded-lg bg-cloud px-4 py-3">
            <strong className="text-navy">{participant.name}</strong>
            <p className="text-sm leading-6 text-navy/65">{participant.function || "Participant"} {participant.team ? `- ${participant.team}` : ""}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="button-primary" href={`/follow-up/${group.id}`}>
          Open follow-up page
        </Link>
        <Link className="button-secondary" href="/snapshot">
          Submit Decision Snapshot
        </Link>
      </div>
    </section>
  );
}
