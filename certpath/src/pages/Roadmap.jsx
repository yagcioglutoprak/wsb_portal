import { useParams, Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";
import StageCard from "../components/StageCard";

const stageNames = {
  1: "Foundation",
  2: "Associate",
  3: "Professional",
  4: "Expert",
};

export default function Roadmap() {
  const { slug } = useParams();
  const field = fields.find((f) => f.slug === slug);

  if (!field) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-3xl italic text-ink">Field not found</h1>
        <Link
          to="/explore"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-rust hover:underline"
        >
          Back to fields
        </Link>
      </div>
    );
  }

  const fieldCerts = certifications[slug] || [];
  const fieldJobs = jobs.filter((j) => j.fieldId === field.id);

  // Group certs by stage
  const stages = {};
  fieldCerts.forEach((cert) => {
    if (!stages[cert.stage]) stages[cert.stage] = [];
    stages[cert.stage].push(cert);
  });
  const stageNums = Object.keys(stages)
    .map(Number)
    .sort((a, b) => a - b);

  // Total duration estimate
  const totalMonths = Math.round(
    fieldCerts.reduce((sum, c) => sum + c.durationWeeks, 0) / 4
  );

  // Salary range from jobs data
  const salaryMin = fieldJobs.length > 0
    ? Math.min(...fieldJobs.map((j) => j.salaryMin))
    : null;
  const salaryMax = fieldJobs.length > 0
    ? Math.max(...fieldJobs.map((j) => j.salaryMax))
    : null;

  return (
    <section className="py-4">
      {/* Breadcrumb */}
      <nav
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <ol className="flex items-center gap-2 font-mono text-xs tracking-wider text-pencil">
          <li>
            <Link to="/" className="transition-colors hover:text-rust">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/explore" className="transition-colors hover:text-rust">
              Explore
            </Link>
          </li>
          <li>/</li>
          <li className="text-ink">{field.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div
        className="mb-10 animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-pencil">
          Certification Roadmap
        </span>
        <h1 className="mt-2 font-serif text-3xl italic text-ink sm:text-4xl">
          {field.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-graphite">
          {field.description}
        </p>

        {/* Stats row */}
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-mono text-2xl font-medium text-rust">
              {stageNums.length}
            </span>
            <span className="font-mono text-xs tracking-wider text-graphite">
              stages
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-mono text-2xl font-medium text-rust">
              {fieldCerts.length}
            </span>
            <span className="font-mono text-xs tracking-wider text-graphite">
              certifications
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-mono text-2xl font-medium text-rust">
              {fieldJobs.length}
            </span>
            <span className="font-mono text-xs tracking-wider text-graphite">
              matching jobs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-mono text-2xl font-medium text-rust">
              ~{totalMonths}
            </span>
            <span className="font-mono text-xs tracking-wider text-graphite">
              months total
            </span>
          </div>
        </div>

        {/* Salary range box */}
        {salaryMin !== null && salaryMax !== null && (
          <div
            className="mt-6 rounded-lg border border-success/20 bg-success/5 px-6 py-4 animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block font-mono text-xs uppercase tracking-widest text-pencil">
              What you can earn
            </span>
            <span className="mt-1 block font-serif text-xl italic text-ink">
              Salary range in Poland: {salaryMin.toLocaleString("pl-PL")} - {salaryMax.toLocaleString("pl-PL")} PLN/month
            </span>
            <span className="mt-1 block text-sm text-graphite">
              Based on {fieldJobs.length} current job {fieldJobs.length === 1 ? "listing" : "listings"} requiring certifications in {field.name}
            </span>
          </div>
        )}
      </div>

      {/* Stages -- horizontal layout with connection line */}
      <div
        className="relative animate-fade-in-up"
        style={{ animationDelay: "160ms" }}
      >
        {/* Horizontal connection line (desktop) */}
        <div
          aria-hidden="true"
          className="absolute left-5 top-5 hidden h-0.5 bg-pencil/30 lg:block"
          style={{ width: "calc(100% - 40px)" }}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stageNums.map((num, i) => (
            <div
              key={num}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              <StageCard
                stageNum={num}
                stageName={stageNames[num]}
                certs={stages[num]}
                fieldSlug={slug}
                isActive={num === 1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="mt-16 rounded-lg border border-faint bg-white p-10 text-center animate-fade-in-up"
        style={{ animationDelay: `${(stageNums.length + 4) * 100}ms` }}
      >
        <h2 className="font-serif text-2xl italic text-ink">
          Want a personalised plan?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-graphite">
          Sign in to track your progress, mark completed certifications, and get
          recommendations tailored to your experience level and goals.
        </p>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-pencil">
          No account needed to explore. Sign in to save progress.
        </p>
        <button
          type="button"
          className="mt-6 rounded bg-rust px-8 py-3 font-mono text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
        >
          Get started free
        </button>
      </div>
    </section>
  );
}
