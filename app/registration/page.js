import Header from "@/components/Header";
import RegistrationForm from "@/components/RegistrationForm";

export const metadata = {
  title: "Profile / Inscription | AM-Connecting"
};

export default function RegistrationPage() {
  return (
    <>
      <Header />
      <main className="bg-navy py-24 text-white">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow text-mint">Profile / Inscription</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Start inscription for a balanced cross-team simulation.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/75">
              The profile preview helps create diverse groups across roles, experience levels, locations and viewpoints, so participants can explore collaboration dynamics in a balanced setting.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </main>
    </>
  );
}
