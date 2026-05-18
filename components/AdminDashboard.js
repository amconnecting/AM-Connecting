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
  const [snapshots, setSnapshots] = useState([]);
  const [adminGroups, setAdminGroups] = useState([]);
  const [selectedSnapshotGroup, setSelectedSnapshotGroup] = useState(null);
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
      await loadSnapshots();
      await loadAdminOverview();
    } catch (error) {
      setLoginError(error.message);
    }
  }

  async function logoutAdmin() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setParticipants([]);
    setGroups([]);
    setSnapshots([]);
    setAdminGroups([]);
    setSelectedSnapshotGroup(null);
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

  async function loadSnapshots() {
    const response = await fetch("/api/snapshot");
    const result = await response.json();

    if (!response.ok) {
      setLoginError(result.error || "Could not load group snapshots.");
      return;
    }

    setSnapshots(result.snapshots || []);
  }

  async function loadAdminOverview() {
    const response = await fetch("/api/admin/overview");
    const result = await response.json();

    if (!response.ok) {
      setLoginError(result.error || "Could not load group overview.");
      return;
    }

    setAdminGroups(result.groups || []);
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
    setSelectedSnapshotGroup(null);
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
    setSelectedSnapshotGroup(null);
    setDrafts({});
    setCopyStatus({});
    await loadSnapshots();
    await loadAdminOverview();
  }

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: normalizeDisplayText(event.target.value) }));
    setGroups([]);
    setSelectedSnapshotGroup(null);
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

        <section className="mt-5 grid gap-4 md:grid-cols-4">
          <Metric label="Participants" value={participants.length} />
          <Metric label="Companies" value={options.companies.length} />
          <Metric label="Departments" value={options.departments.length} />
          <Metric label="Saved groups" value={adminGroups.length} />
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

        <section className="card mt-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy">Group Snapshots</h2>
              <p className="mt-1 text-navy/65">Track the Decision Snapshot captured by each generated group.</p>
            </div>
            <button className="button-secondary" type="button" onClick={loadSnapshots}>Refresh snapshots</button>
          </div>
          {!groups.length ? (
            <p className="py-8 text-center text-navy/55">Generate groups first to review their snapshots.</p>
          ) : (
            <GroupSnapshots
              groups={groups}
              snapshots={snapshots}
              selectedGroupIndex={selectedSnapshotGroup}
              onSelect={setSelectedSnapshotGroup}
            />
          )}
        </section>

        <section className="card mt-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy">Database Overview</h2>
              <p className="mt-1 text-navy/65">Saved groups, members, Decision Snapshots and final submissions from the database.</p>
            </div>
            <button className="button-secondary" type="button" onClick={loadAdminOverview}>Refresh database data</button>
          </div>
          <DatabaseOverview groups={adminGroups} />
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

function GroupSnapshots({ groups, snapshots, selectedGroupIndex, onSelect }) {
  const selectedGroup = selectedGroupIndex === null ? null : groups[selectedGroupIndex];
  const selectedSnapshot = selectedGroupIndex === null ? null : findGroupSnapshot(snapshots, selectedGroupIndex);

  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-3">
        {groups.map((group, index) => {
          const snapshot = findGroupSnapshot(snapshots, index);
          const isSelected = selectedGroupIndex === index;

          return (
            <button
              key={index}
              className={`rounded-lg border p-4 text-left transition ${isSelected ? "border-teal bg-teal/5 shadow-sm" : "border-line bg-white hover:border-teal"}`}
              type="button"
              onClick={() => onSelect(index)}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-navy">{getGroupName(index, snapshot)}</h3>
                  <p className="mt-1 text-sm font-semibold text-navy/60">{group.length} participants</p>
                </div>
                <StatusLabels snapshot={snapshot} />
              </div>
              <p className="mt-3 text-sm leading-6 text-navy/70">
                {group.map((participant) => participant.name).join(", ")}
              </p>
            </button>
          );
        })}
      </div>

      <SnapshotDetail group={selectedGroup} groupIndex={selectedGroupIndex} snapshot={selectedSnapshot} />
    </div>
  );
}

function SnapshotDetail({ group, groupIndex, snapshot }) {
  if (groupIndex === null) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-navy/60">
        Click on a group to see its full snapshot.
      </div>
    );
  }

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{getGroupName(groupIndex, snapshot)}</p>
          <h3 className="mt-2 text-2xl font-bold text-navy">Full snapshot</h3>
        </div>
        <StatusLabels snapshot={snapshot} />
      </div>

      <div className="mt-5">
        <h4 className="font-bold text-navy">Participants</h4>
        <div className="mt-3 grid gap-2">
          {group.map((participant) => (
            <div key={participant.id || participant.email} className="rounded-lg bg-cloud px-4 py-3">
              <strong className="text-navy">{participant.name}</strong>
              <p className="text-sm text-navy/65">{participant.department} - {participant.function} - {participant.seniority}</p>
            </div>
          ))}
        </div>
      </div>

      {snapshot ? (
        <div className="mt-6 grid gap-4">
          <SnapshotField label="Main priority" value={snapshot.mainPriority} />
          <SnapshotField label="Biggest trade-off" value={snapshot.biggestTradeOff} />
          <SnapshotField label="Temporary direction" value={snapshot.temporaryDirection} />
          <SnapshotField label="Collaboration insight" value={snapshot.collaborationInsight} />
          <SnapshotPhoto snapshot={snapshot} />
        </div>
      ) : (
        <p className="mt-6 rounded-lg bg-slate-50 p-5 text-sm font-semibold leading-6 text-navy/60">
          Snapshot not submitted yet. Once the group submits the Decision Snapshot form, the details will appear here.
        </p>
      )}
    </article>
  );
}

function SnapshotField({ label, value }) {
  return (
    <div className="rounded-lg border border-line p-4">
      <h4 className="text-sm font-extrabold uppercase text-navy/55">{label}</h4>
      <p className="mt-2 leading-7 text-navy/75">{value || "-"}</p>
    </div>
  );
}

function SnapshotPhoto({ snapshot }) {
  if (snapshot.boardPhotoUrl) {
    return (
      <div className="rounded-lg border border-line p-4">
        <h4 className="text-sm font-extrabold uppercase text-navy/55">Board photo</h4>
        <img className="mt-3 max-h-96 w-full rounded-lg object-contain" src={snapshot.boardPhotoUrl} alt={`Board photo for ${snapshot.groupName}`} />
      </div>
    );
  }

  if (snapshot.boardPhotoName) {
    return <SnapshotField label="Board photo" value={snapshot.boardPhotoName} />;
  }

  return <SnapshotField label="Board photo" value="No board photo uploaded yet." />;
}

function StatusBadge({ status }) {
  const styles = {
    "Snapshot not submitted": "bg-slate-100 text-navy/65",
    "Snapshot submitted": "bg-teal/10 text-teal",
    "Final submission pending": "bg-amber-50 text-amber-800",
    "Final submission received": "bg-emerald-50 text-emerald-800"
  };

  return (
    <span className={`rounded-full px-3 py-2 text-xs font-extrabold ${styles[status] || styles["Snapshot not submitted"]}`}>
      {status}
    </span>
  );
}

function StatusLabels({ snapshot }) {
  if (!snapshot) {
    return <StatusBadge status="Snapshot not submitted" />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="Snapshot submitted" />
      <StatusBadge status={snapshot.finalSubmissionReceived ? "Final submission received" : "Final submission pending"} />
    </div>
  );
}

function findGroupSnapshot(snapshots, groupIndex) {
  const groupId = getGroupId(groupIndex);
  const numericGroupId = String(groupIndex + 1);
  const groupName = getGroupName(groupIndex);
  return snapshots.find((snapshot) => snapshot.groupId === groupId || snapshot.groupId === numericGroupId || snapshot.groupName === groupName);
}

function getGroupId(index) {
  return `group-${index + 1}`;
}

function getGroupName(index, snapshot) {
  return snapshot?.groupName || `Group ${index + 1}`;
}

function DatabaseOverview({ groups }) {
  if (!groups.length) {
    return <p className="py-8 text-center text-navy/55">No saved database groups found yet. Click Generate Groups to create saved group records.</p>;
  }

  return (
    <div className="mt-5 grid gap-4">
      {groups.map((group) => (
        <article key={group.id} className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{group.company}</p>
              <h3 className="mt-2 text-2xl font-bold text-navy">{group.groupName}</h3>
              <p className="mt-1 text-sm font-semibold text-navy/55">Group ID: {group.id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={group.snapshot ? "Snapshot submitted" : "Snapshot not submitted"} />
              <StatusBadge status={group.finalSubmission ? "Final submission received" : "Final submission pending"} />
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <div className="rounded-lg bg-cloud p-4">
              <h4 className="font-bold text-navy">Group members</h4>
              <div className="mt-3 grid gap-2">
                {group.participants.length ? group.participants.map((participant) => (
                  <div key={participant.id || participant.email} className="rounded-lg bg-white px-3 py-2">
                    <strong className="text-navy">{participant.name}</strong>
                    <p className="text-sm text-navy/65">{participant.department} - {participant.function}</p>
                  </div>
                )) : <p className="text-sm font-semibold text-navy/55">No members saved.</p>}
              </div>
            </div>

            <div className="rounded-lg bg-cloud p-4">
              <h4 className="font-bold text-navy">Decision Snapshot</h4>
              {group.snapshot ? (
                <div className="mt-3 grid gap-3">
                  <MiniField label="Main priority" value={group.snapshot.mainPriority} />
                  <MiniField label="Biggest trade-off" value={group.snapshot.biggestTradeOff} />
                  <MiniField label="Temporary direction" value={group.snapshot.temporaryDirection} />
                  <MiniField label="Collaboration insight" value={group.snapshot.collaborationInsight} />
                  <MiniField label="Board photo" value={group.snapshot.boardPhotoUrl || group.snapshot.boardPhotoName || "-"} />
                </div>
              ) : <p className="mt-3 text-sm font-semibold text-navy/55">No snapshot submitted.</p>}
            </div>

            <div className="rounded-lg bg-cloud p-4">
              <h4 className="font-bold text-navy">Final Submission</h4>
              {group.finalSubmission ? (
                <div className="mt-3 grid gap-3">
                  <MiniField label="Final direction" value={group.finalSubmission.finalDirection} />
                  <MiniField label="Final priorities" value={group.finalSubmission.finalPriorities} />
                  <MiniField label="Final trade-offs" value={group.finalSubmission.finalTradeOffs} />
                  <MiniField label="Collaboration lessons" value={group.finalSubmission.collaborationLessons} />
                  <MiniField label="Understood better" value={group.finalSubmission.whatTheGroupUnderstoodBetter} />
                  <MiniField label="Optional file" value={group.finalSubmission.optionalFileUrl || group.finalSubmission.optionalFileName || "-"} />
                </div>
              ) : <p className="mt-3 text-sm font-semibold text-navy/55">No final submission received.</p>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function MiniField({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-extrabold uppercase text-navy/50">{label}</p>
      <p className="mt-1 text-sm leading-6 text-navy/75">{value || "-"}</p>
    </div>
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
