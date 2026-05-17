"use client";

import { useMemo, useState } from "react";
import { createEmailDraft } from "@/lib/emailDrafts";
import { normalizeDisplayText, normalizeParticipantRecord } from "@/lib/participantNormalization";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [participants, setParticipants] = useState([]);
  const [filters, setFilters] = useState({ company: "", department: "", seniority: "" });
  const [groups, setGroups] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [copyStatus, setCopyStatus] = useState({});

  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      return (!filters.company || participant.company === filters.company)
        && (!filters.department || participant.department === filters.department)
        && (!filters.seniority || participant.seniority === filters.seniority);
    });
    }, [participants, filters]);

  const options = useMemo(() => ({
    companies: uniqueValues(participants, "company"),
    departments: uniqueValues(participants, "department"),
    seniority: uniqueValues(participants, "seniority")
  }), [participants]);

  async function loginAdmin(event) {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.error || "Could not sign in.");
        return;
      }

      setIsAuthenticated(true);
      await loadParticipants();
    } catch (error) {
      setLoginError(error.message);
    }
  }

  async function logoutAdmin() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setParticipants([]);
    setGroups([]);
  }

  async function loadParticipants() {
    const response = await fetch("/api/register");
    const result = await response.json();

    if (!response.ok) {
      setLoginError(result.error || "You are not allowed to access the admin panel.");
      setIsAuthenticated(false);
      return;
    }

    setParticipants((result.participants || []).map(normalizeParticipantRecord));
  }

  async function deleteRegistration(participant) {
    const confirmed = window.confirm(`Delete registration for ${participant.name}? This cannot be undone.`);
    if (!confirmed) return;

    const response = await fetch(`/api/register/${participant.id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      window.alert(result.error || "Could not delete this registration.");
      return;
    }

    setParticipants((current) => current.filter((item) => item.id !== participant.id));
    setGroups([]);
    setDrafts({});
    setCopyStatus({});
  }

  async function generateAdminGroups() {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participants: filteredParticipants, groupSize: 5 })
    });
    const result = await response.json();
    setGroups(result.groups || []);
    setDrafts({});
    setCopyStatus({});
  }

function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: normalizeDisplayText(event.target.value) }));
    setGroups([]);
    setDrafts({});
  }

  function prepareEmail(index, group) {
    setDrafts((current) => ({ ...current, [index]: createEmailDraft(index + 1, group) }));
    setCopyStatus((current) => ({ ...current, [index]: "" }));
  }

  async function copyDraft(index) {
    try {
      await navigator.clipboard.writeText(drafts[index]);
      setCopyStatus((current) => ({ ...current, [index]: "Copied" }));
    } catch {
      setCopyStatus((current) => ({ ...current, [index]: "Copy failed" }));
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-cloud px-5 py-10">
        <form onSubmit={loginAdmin} className="card w-full max-w-xl p-8">
          <span className="rounded-full bg-teal/10 px-4 py-2 text-sm font-extrabold text-teal">Supabase Auth</span>
          <h1 className="mt-7 text-4xl font-bold text-navy md:text-5xl">Admin panel</h1>
          <p className="mt-4 leading-7 text-navy/65">Sign in with an authenticated Supabase admin account to view registrations and generate groups.</p>
          <label className="field mt-6">
            Email
            <input className="input" type="email" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label className="field mt-4">
            Password
            <input className="input" type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} />
          </label>
          {loginError ? <p className="mt-3 text-sm font-bold text-red-800">{loginError}</p> : null}
          <button className="button-dark mt-5 w-full" type="submit">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cloud px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="card flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="eyebrow">AM-Connecting Admin</p>
            <h1 className="mt-3 text-4xl font-bold text-navy">Registrations dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="button-secondary" type="button" onClick={() => exportParticipants(filteredParticipants)}>Export participants as CSV</button>
            <button className="button-primary" type="button" onClick={() => exportGroups(groups)} disabled={!groups.length}>Export groups as CSV</button>
            <button className="button-secondary" type="button" onClick={logoutAdmin}>Sign out</button>
          </div>
        </header>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <Metric label="Participants" value={participants.length} />
          <Metric label="Companies" value={options.companies.length} />
          <Metric label="Departments" value={options.departments.length} />
        </section>

        <section className="card mt-5 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
            <div>
              <h2 className="text-2xl font-bold text-navy">Participants</h2>
              <p className="mt-1 text-navy/65">Filter the table before generating groups if needed.</p>
            </div>
            <button className="button-dark" type="button" onClick={generateAdminGroups}>Generate Groups</button>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-4">
            <Select label="Company" name="company" value={filters.company} options={options.companies} onChange={updateFilter} />
            <Select label="Department" name="department" value={filters.department} options={options.departments} onChange={updateFilter} />
            <Select label="Seniority" name="seniority" value={filters.seniority} options={options.seniority} onChange={updateFilter} />
            <button className="button-secondary self-end" type="button" onClick={() => setFilters({ company: "", department: "", seniority: "" })}>Clear filters</button>
          </div>
          <ParticipantsTable participants={filteredParticipants} onDelete={deleteRegistration} />
        </section>

        <section className="card mt-5 p-5">
          <h2 className="text-2xl font-bold text-navy">Generated groups</h2>
          <p className="mt-1 text-navy/65">Groups are generated from the currently filtered participant list.</p>
          {!groups.length ? <p className="py-8 text-center text-navy/55">Click "Generate Groups" to create teams.</p> : null}
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {groups.map((group, index) => (
              <GroupCard
                key={index}
                group={group}
                index={index}
                draft={drafts[index]}
                copyStatus={copyStatus[index]}
                onPrepare={() => prepareEmail(index, group)}
                onCopy={() => copyDraft(index)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-navy/65">{label}</p>
      <strong className="mt-2 block text-4xl text-navy">{value}</strong>
    </div>
  );
}

function Select({ label, name, value, options, onChange }) {
  return (
    <label className="field">
      {label}
      <select className="input" name={name} value={value} onChange={onChange}>
        <option value="">All {label.toLowerCase()}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ParticipantsTable({ participants, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1040px] border-collapse">
        <thead>
          <tr className="bg-slate-50 text-left text-xs uppercase text-navy/60">
            {["Name", "Email", "Company", "Department", "Function", "Seniority", "Office / Location", "Actions"].map((heading) => (
              <th key={heading} className="border-b border-line px-4 py-3">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td className="border-b border-line px-4 py-3 font-bold text-navy">{participant.name}</td>
              <td className="border-b border-line px-4 py-3 text-navy/75">{participant.email}</td>
              <td className="border-b border-line px-4 py-3 text-navy/75">{participant.company}</td>
              <td className="border-b border-line px-4 py-3 text-navy/75">{participant.department}</td>
              <td className="border-b border-line px-4 py-3 text-navy/75">{participant.function}</td>
              <td className="border-b border-line px-4 py-3 text-navy/75">{participant.seniority}</td>
              <td className="border-b border-line px-4 py-3 text-navy/75">{participant.officeLocation}</td>
              <td className="border-b border-line px-4 py-3">
                <button className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-extrabold text-red-800 hover:bg-red-100" type="button" onClick={() => onDelete(participant)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!participants.length ? <p className="p-8 text-center text-navy/55">No registrations found yet.</p> : null}
    </div>
  );
}

function GroupCard({ group, index, draft, copyStatus, onPrepare, onCopy }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h3 className="text-xl font-bold text-navy">Group {index + 1}</h3>
      <div className="mt-2 grid gap-3">
        {group.map((participant) => (
          <div key={participant.id || participant.email} className="border-t border-line pt-3">
            <strong className="text-navy">{participant.name}</strong>
            <p className="text-sm leading-6 text-navy/65">{participant.department} - {participant.function} - {participant.seniority}</p>
            <p className="text-sm text-navy/65">{participant.email}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="button-secondary" type="button" onClick={onPrepare}>Prepare Email</button>
        {draft ? <button className="button-primary" type="button" onClick={onCopy}>Copy to clipboard</button> : null}
        {copyStatus ? <span className="text-sm font-extrabold text-teal">{copyStatus}</span> : null}
      </div>
      {draft ? <textarea className="mt-4 min-h-80 w-full resize-y rounded-lg border border-line bg-cloud p-4 font-mono text-sm leading-6 text-navy" readOnly value={draft} /> : null}
    </article>
  );
}

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => normalizeDisplayText(item[key])).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function exportParticipants(participants) {
  downloadCsv("am-connecting-participants.csv", [
    ["name", "email", "company", "department", "function", "seniority", "officeLocation"],
    ...participants.map((participant) => [
      participant.name,
      participant.email,
      participant.company,
      participant.department,
      participant.function,
      participant.seniority,
      participant.officeLocation
    ])
  ]);
}

function exportGroups(groups) {
  downloadCsv("am-connecting-groups.csv", [
    ["group", "name", "department", "function", "seniority", "email"],
    ...groups.flatMap((group, index) =>
      group.map((participant) => [
        `Group ${index + 1}`,
        participant.name,
        participant.department,
        participant.function,
        participant.seniority,
        participant.email
      ])
    )
  ]);
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}
