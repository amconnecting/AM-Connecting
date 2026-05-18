import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | AM-Connecting",
  description: "How AM-Connecting uses participant registration data."
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cloud px-5 py-10 text-navy">
      <section className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-soft">
        <Link className="text-sm font-extrabold text-teal" href="/">
          Back to AM-Connecting
        </Link>
        <h1 className="mt-6 text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-5 leading-7 text-navy/70">
          AM-Connecting only collects the information needed to organize balanced collaboration simulations.
        </p>

        <div className="mt-8 grid gap-6">
          <PolicyBlock title="Data we collect">
            Company or bank, team or area, function, name, seniority, office or location, email address and the date of registration.
          </PolicyBlock>
          <PolicyBlock title="Why we use this data">
            We use this data to create balanced simulation groups, communicate practical information about the experience and follow up with participants when needed.
          </PolicyBlock>
          <PolicyBlock title="What we do not do">
            We do not sell participant data. We do not use registration data for unrelated marketing or external purposes.
          </PolicyBlock>
          <PolicyBlock title="Data retention">
            Data is kept only as long as needed for the organization and follow-up of the simulation. Unless a shorter period is requested, participant data is deleted or anonymized within 60 days after the event. Admin users can also remove registrations from the admin panel earlier.
          </PolicyBlock>
          <PolicyBlock title="Your rights">
            You can request access, correction or deletion of your data by contacting hello@am-connecting.com.
          </PolicyBlock>
        </div>
      </section>
    </main>
  );
}

function PolicyBlock({ title, children }) {
  return (
    <article className="border-t border-line pt-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 leading-7 text-navy/70">{children}</p>
    </article>
  );
}
