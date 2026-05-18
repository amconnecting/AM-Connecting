import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "Final Submission | AM-Connecting",
  description: "Final submission placeholder for AM-Connecting groups."
};

export default async function FinalSubmissionPage({ params }) {
  const { groupId } = await params;

  return (
    <>
      <Header />
      <main className="grid min-h-screen place-items-center bg-gradient-to-b from-white via-cloud to-white px-5 py-16">
        <section className="card max-w-2xl p-6 text-center sm:p-8">
          <p className="eyebrow">Final Submission</p>
          <h1 className="mt-4 text-4xl font-bold text-navy">Final submission for {formatGroupName(groupId)}</h1>
          <p className="mt-5 leading-7 text-navy/70">
            This step is ready to be connected. The final submission form can be added here once the final deliverable is defined.
          </p>
          <Link className="button-secondary mt-7" href={`/follow-up/${groupId}`}>
            Back to follow-up
          </Link>
        </section>
      </main>
    </>
  );
}

function formatGroupName(groupId) {
  const match = String(groupId || "").match(/(\d+)$/);
  return match ? `Group ${match[1]}` : groupId;
}
