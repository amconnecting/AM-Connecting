import Header from "@/components/Header";
import FinalSubmissionForm from "@/components/FinalSubmissionForm";
import { getDecisionSnapshotByGroupId } from "@/lib/snapshots";

export const metadata = {
  title: "Final Submission | AM-Connecting",
  description: "Submit a collaborative group summary for AM-Connecting."
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SubmissionPage({ params }) {
  const { groupId } = await params;
  const snapshot = await getDecisionSnapshotByGroupId(groupId);
  const groupName = snapshot?.groupName || formatGroupName(groupId);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-cloud to-white px-5 py-10 sm:py-16">
        <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="pt-3">
            <p className="eyebrow">Final Submission</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Collaborative summary for {groupName}
            </h1>
            <p className="mt-6 text-lg leading-8 text-navy/70">
              Your final submission does not need to be perfect. Focus on the shared direction your group aligned on, the trade-offs you discussed and what you learned from each other's viewpoints.
            </p>
            <div className="mt-7 rounded-lg border border-teal/20 bg-teal/5 p-5 text-sm font-semibold leading-6 text-navy/70">
              Keep it practical and human. This is a record of the group experience, not a consultancy report.
            </div>
          </div>

          <FinalSubmissionForm groupId={groupId} defaultGroupName={groupName} />
        </section>
      </main>
    </>
  );
}

function formatGroupName(groupId) {
  const match = String(groupId || "").match(/(\d+)$/);
  return match ? `Group ${match[1]}` : groupId;
}
