import Link from "next/link";
import Header from "@/components/Header";
import { generateGroups } from "@/lib/groups";
import { getGroupOverviewByIdentifier } from "@/lib/groupRecords";
import { getParticipants } from "@/lib/participants";
import { getDecisionSnapshotByGroupId } from "@/lib/snapshots";

export const metadata = {
  title: "Group Follow-up | AM-Connecting",
  description: "Continue an AM-Connecting group discussion from the previous Decision Snapshot."
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function FollowUpPage({ params }) {
  const { groupId } = await params;
  const savedGroup = await getGroupOverviewByIdentifier(groupId);
  const snapshot = savedGroup?.snapshot || await getDecisionSnapshotByGroupId(groupId);
  const participants = await getParticipants();
  const groups = generateGroups(participants, 5);
  const groupIndex = getGroupIndex(groupId);
  const group = savedGroup?.participants?.length ? savedGroup.participants : groups[groupIndex] || [];
  const groupName = savedGroup?.groupName || snapshot?.groupName || getGroupName(groupIndex);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-cloud to-white px-5 py-10 sm:py-16">
        <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Follow-up Session</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl">
              {groupName}
            </h1>
            <p className="mt-6 text-lg leading-8 text-navy/70">
              Continue from the previous Decision Snapshot and explore how the new context changes your shared direction.
            </p>

            <div className="card mt-7 p-5">
              <h2 className="text-xl font-bold text-navy">Group members</h2>
              {group.length ? (
                <div className="mt-4 grid gap-3">
                  {group.map((participant) => (
                    <div key={participant.id || participant.email} className="rounded-lg bg-cloud px-4 py-3">
                      <strong className="text-navy">{participant.name}</strong>
                      <p className="text-sm leading-6 text-navy/65">{participant.department} - {participant.function} - {participant.seniority}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm font-semibold leading-6 text-navy/60">
                  No members found for this group yet. Check that the link uses a group ID such as group-1.
                </p>
              )}
            </div>
          </aside>

          <div className="grid gap-6">
            <SnapshotCard snapshot={snapshot} />
            <NewContextCard />
            <DiscussionCard />
            <Link className="button-primary w-full sm:w-fit" href={`/submission/${groupId}`}>
              Continue to Final Submission
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function SnapshotCard({ snapshot }) {
  return (
    <section className="card p-5 sm:p-6">
      <p className="eyebrow">Previous Decision Snapshot</p>
      <h2 className="mt-3 text-2xl font-bold text-navy">Where your group left off</h2>
      {snapshot ? (
        <div className="mt-5 grid gap-4">
          <SnapshotField label="Main priority" value={snapshot.mainPriority} />
          <SnapshotField label="Biggest trade-off" value={snapshot.biggestTradeOff} />
          <SnapshotField label="Temporary direction" value={snapshot.temporaryDirection} />
          <SnapshotField label="Collaboration insight" value={snapshot.collaborationInsight} />
          <SnapshotPhoto snapshot={snapshot} />
        </div>
      ) : (
        <p className="mt-5 rounded-lg bg-slate-50 p-5 text-sm font-semibold leading-6 text-navy/60">
          No Decision Snapshot was found for this group yet.
        </p>
      )}
    </section>
  );
}

function NewContextCard() {
  return (
    <section className="rounded-lg border border-teal/20 bg-teal/5 p-5 sm:p-6">
      <p className="eyebrow">New context</p>
      <p className="mt-4 text-lg font-semibold leading-8 text-navy/75">
        NovaBank notices that older customers increasingly struggle with digital onboarding. Support waiting times continue to rise, and more customer cases move between teams before customers get clarity.
      </p>
    </section>
  );
}

function DiscussionCard() {
  const questions = [
    "Which previous priority still makes sense?",
    "Which assumption should be reconsidered?",
    "Which trade-off has become more difficult?",
    "What should your group adapt?"
  ];

  return (
    <section className="card p-5 sm:p-6">
      <p className="eyebrow">Discuss as a group</p>
      <h2 className="mt-3 text-2xl font-bold text-navy">Use the new context to navigate complexity together.</h2>
      <div className="mt-5 grid gap-3">
        {questions.map((question, index) => (
          <div key={question} className="flex gap-3 rounded-lg bg-cloud p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal text-sm font-extrabold text-white">{index + 1}</span>
            <p className="self-center font-bold text-navy/75">{question}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SnapshotField({ label, value }) {
  return (
    <div className="rounded-lg border border-line p-4">
      <h3 className="text-sm font-extrabold uppercase text-navy/55">{label}</h3>
      <p className="mt-2 leading-7 text-navy/75">{value || "-"}</p>
    </div>
  );
}

function SnapshotPhoto({ snapshot }) {
  if (snapshot.boardPhotoUrl) {
    return (
      <div className="rounded-lg border border-line p-4">
        <h3 className="text-sm font-extrabold uppercase text-navy/55">Board photo</h3>
        <img className="mt-3 max-h-96 w-full rounded-lg object-contain" src={snapshot.boardPhotoUrl} alt={`Board photo for ${snapshot.groupName}`} />
      </div>
    );
  }

  if (snapshot.boardPhotoName) {
    return <SnapshotField label="Board photo" value={snapshot.boardPhotoName} />;
  }

  return <SnapshotField label="Board photo" value="No board photo uploaded yet." />;
}

function getGroupIndex(groupId) {
  const match = String(groupId || "").match(/(\d+)$/);
  return match ? Math.max(Number(match[1]) - 1, 0) : 0;
}

function getGroupName(index) {
  return `Group ${index + 1}`;
}
