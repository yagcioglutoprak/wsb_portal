import { Link } from "react-router-dom";

const steps = [
  {
    num: "01",
    title: "Tell us about yourself",
    description:
      "Your year, your program, your interests. A few quick taps and we know what matters to you.",
  },
  {
    num: "02",
    title: "Get your roadmap",
    description:
      "Staged certifications matched to your profile -- from foundation to expert, in the right order.",
  },
  {
    num: "03",
    title: "See real jobs",
    description:
      "Live positions in Poland that list the certifications on your path. Know where each cert leads.",
  },
];

export default function Home() {
  return (
    <section className="py-8 sm:py-16">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl text-center">
        <span
          className="inline-block font-mono text-xs uppercase tracking-widest text-pencil animate-fade-in-up"
          style={{ animationDelay: "0ms" }}
        >
          Built for WSB Merito students
        </span>

        <h1
          className="mt-6 font-serif text-4xl italic leading-tight text-ink sm:text-5xl lg:text-6xl animate-fade-in-up"
          style={{ animationDelay: "80ms" }}
        >
          Your career is not a straight line.
        </h1>

        <p
          className="mt-6 text-base leading-relaxed text-graphite sm:text-lg animate-fade-in-up"
          style={{ animationDelay: "160ms" }}
        >
          Curated certification roadmaps matched to real Polish job listings.
          Know exactly which certs to earn, how to study, and what doors they
          open.
        </p>

        <div
          className="mt-8 animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            to="/onboarding"
            className="inline-block rounded bg-rust px-8 py-3.5 font-mono text-sm uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rust/20"
          >
            Find your path
          </Link>
        </div>

        <div
          className="mt-8 flex items-center justify-center gap-3 font-mono text-xs tracking-wider text-pencil animate-fade-in-up"
          style={{ animationDelay: "320ms" }}
        >
          <span>11 fields</span>
          <span className="text-faint">|</span>
          <span>38 certifications</span>
          <span className="text-faint">|</span>
          <span>38 open positions in Poland</span>
        </div>
      </div>

      {/* ── How it works ────────────────────────────────────────── */}
      <div className="mx-auto mt-24 max-w-4xl sm:mt-32">
        <div
          className="text-center animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-pencil">
            How it works
          </span>
          <h2 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
            Three steps to clarity
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="group relative rounded-lg border border-faint bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${480 + i * 80}ms` }}
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-rust transition-transform duration-300 group-hover:scale-x-100 rounded-t-lg" />

              <span className="font-mono text-3xl font-light text-pencil/40">
                {step.num}
              </span>
              <h3 className="mt-4 font-serif text-xl italic text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Explore fallback ────────────────────────────────────── */}
      <div
        className="mt-20 text-center animate-fade-in-up"
        style={{ animationDelay: "720ms" }}
      >
        <Link
          to="/explore"
          className="inline-block font-mono text-xs uppercase tracking-wider text-graphite transition-colors duration-200 hover:text-rust"
        >
          Explore without onboarding
          <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
