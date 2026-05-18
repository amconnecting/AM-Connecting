import Header from "@/components/Header";
import MyGroupLookup from "@/components/MyGroupLookup";

export const metadata = {
  title: "Find My Group | AM-Connecting",
  description: "Participants can find their AM-Connecting group number."
};

export default function MyGroupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-cloud to-white px-5 py-10 sm:py-16">
        <section className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="pt-3">
            <p className="eyebrow">Find My Group</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl">
              See which group you are part of.
            </h1>
            <p className="mt-6 text-lg leading-8 text-navy/70">
              Enter the email address you used during inscription. Once groups have been generated, your group number and members will appear here.
            </p>
            <div className="mt-7 rounded-lg border border-teal/20 bg-teal/5 p-5 text-sm font-semibold leading-6 text-navy/70">
              Groups only become visible after the AM-Connecting admin has generated and saved them.
            </div>
          </div>
          <MyGroupLookup />
        </section>
      </main>
    </>
  );
}
