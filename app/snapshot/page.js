import Header from "@/components/Header";
import DecisionSnapshotForm from "@/components/DecisionSnapshotForm";

export const metadata = {
  title: "Decision Snapshot | AM-Connecting",
  description: "Capture key decisions from an AM-Connecting kick-off discussion."
};

export default function SnapshotPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-cloud to-white px-5 py-10 sm:py-16">
        <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="pt-3">
            <p className="eyebrow">Decision Snapshot</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl">
              Capture the point your group reached.
            </h1>
            <p className="mt-6 text-lg leading-8 text-navy/70">
              Capture the key decisions from your kick-off discussion. This is not a final answer. It is a memory bridge for your follow-up session.
            </p>
            <div className="mt-7 rounded-lg border border-teal/20 bg-teal/5 p-5 text-sm font-semibold leading-6 text-navy/70">
              Focus on what your group understood, where opinions differed and which temporary direction gives you a useful starting point next time.
            </div>
          </div>
          <DecisionSnapshotForm />
        </section>
      </main>
    </>
  );
}
