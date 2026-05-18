import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Events />
        <Contact />
      </main>
      <footer className="border-t border-line bg-white px-5 py-8 text-center text-sm font-semibold text-navy/60">
        AM-Connecting - Connect. Collaborate. Grow Together.
      </footer>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-cloud to-white">
      <NetworkVisual />
      <div className="container-page relative z-10 grid min-h-[calc(100vh-118px)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-navy shadow-sm">
            <span className="h-2 w-2 rounded-full bg-teal" />
            Connect. Collaborate. Grow Together.
          </div>
          <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.04] tracking-normal text-navy md:text-7xl">
            Connect and Learn Together
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-navy/70">
            A collaborative business simulation that helps hybrid organisations strengthen cross-team understanding, shared decision-making and internal connection.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/#about" className="button-primary">Discover the concept</Link>
            <Link href="/registration" className="button-secondary">Start inscription</Link>
          </div>
        </div>
        <div className="card p-7">
          <Image src="/am-connecting-logo.png" alt="AM-Connecting logo with slogan" width={900} height={900} priority className="w-full rounded-lg object-contain" />
        </div>
      </div>
    </section>
  );
}

function NetworkVisual() {
  return (
    <svg className="pointer-events-none absolute right-[-120px] top-20 w-[min(760px,76vw)] opacity-60" viewBox="0 0 760 580" fill="none" aria-hidden="true">
      <path d="M122 320C224 172 356 455 512 200C588 76 666 124 714 174" stroke="#10998F" strokeWidth="2" strokeDasharray="8 14" />
      <path d="M40 180C162 88 260 240 372 196C486 152 522 18 690 64" stroke="#082F4F" strokeWidth="1.5" strokeDasharray="7 12" />
      <circle cx="122" cy="320" r="10" fill="#10998F" />
      <circle cx="512" cy="200" r="12" fill="#082F4F" />
      <circle cx="372" cy="196" r="8" fill="#79C9B8" />
      <circle cx="690" cy="64" r="9" fill="#10998F" />
    </svg>
  );
}

function About() {
  return (
    <section id="about" className="bg-white py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">About Us</p>
          <h2 className="section-title">A stronger company culture starts with understanding how others think, decide and collaborate.</h2>
        </div>
        <article className="card p-7 md:p-10">
          {[
            "Many organisations face the same reality: colleagues work together every day, but often know little about the priorities, pressures and viewpoints that shape how others make decisions.",
            "AM-Connecting brings employees from different backgrounds together in a collaborative business simulation. The experience is designed for connection, perspective-taking and decision dialogue, not as a traditional workshop.",
            "Participants navigate a realistic organisational situation, discuss trade-offs, understand different viewpoints and practise shared decision-making in a professional but accessible setting.",
            "The experience reveals collaboration dynamics: how people exchange information, weigh priorities, make decisions and navigate complexity together."
          ].map((text) => (
            <p key={text} className="mb-5 text-lg leading-8 text-navy/75">{text}</p>
          ))}
          <p className="mb-5 text-2xl font-extrabold text-navy">The result?</p>
          <p className="mb-5 text-lg leading-8 text-navy/75">Stronger cross-team understanding, more meaningful internal connection and a shared language around collaboration, trade-offs and organisational awareness.</p>
          <p className="mb-5 text-lg leading-8 text-navy/75">For HR, People & Culture and employee engagement teams, AM-Connecting offers a modern collaboration experience that feels practical, human and business-relevant.</p>
          <p className="text-lg font-extrabold leading-8 text-teal">Discover how AM-Connecting makes internal collaboration tangible.</p>
        </article>
      </div>
    </section>
  );
}

function Events() {
  return (
    <section id="events" className="bg-cloud py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">Events</p>
          <h2 className="section-title">Upcoming events and partnerships will appear here soon.</h2>
          <p className="mt-6 text-lg leading-8 text-navy/70">This section is prepared for future simulation moments, partner visibility and reflections from participating employees and HR teams.</p>
        </div>
        <div className="card bg-cloud p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["Future event photo", "Future event photo", "Future event photo"].map((label, index) => (
              <div key={index} className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-teal/40 bg-white text-sm font-bold text-navy/50">{label}</div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Placeholder title="Partner logos" items={["Partner logo", "Sponsor logo", "Company logo"]} />
            <Placeholder title="Testimonials" items={["Participant reflection", "HR insight", "Leadership feedback"]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Placeholder({ title, items }) {
  return (
    <div className="rounded-lg bg-white p-5">
      <p className="text-sm font-extrabold uppercase text-navy/55">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-line px-3 py-2 text-sm font-bold text-navy/65">{item}</span>
        ))}
      </div>
    </div>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-white py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Let's build stronger internal connections.</h2>
          <div className="mt-8 grid gap-4 text-lg font-bold text-navy">
            <a href="mailto:hello@amconnecting.com">Email: hello@amconnecting.com</a>
            <a href="tel:+32498730595">Phone: 0498 73 0595</a>
            <p>For HR, People & Culture and employee engagement teams.</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
