import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "Participant Survey | AM-Connecting",
  description: "Participant survey placeholder for AM-Connecting."
};

export default async function SurveyPage({ params }) {
  const { groupId } = await params;

  return (
    <>
      <Header />
      <main className="grid min-h-screen place-items-center bg-gradient-to-b from-white via-cloud to-white px-5 py-16">
        <section className="card max-w-2xl p-6 text-center sm:p-8">
          <p className="eyebrow">Participant Survey</p>
          <h1 className="mt-4 text-4xl font-bold text-navy">Survey for {formatGroupName(groupId)}</h1>
          <p className="mt-5 leading-7 text-navy/70">
            The participant survey link is ready to be connected. Add your survey form or external survey URL here.
          </p>
          <Link className="button-secondary mt-7" href="/">
            Back to AM-Connecting
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
