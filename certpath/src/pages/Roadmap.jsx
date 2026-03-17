import { useParams, Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";
import StageCard from "../components/StageCard";
import useScrollReveal from "../hooks/useScrollReveal";
import {
  CybersecurityIcon,
  CloudIcon,
  DevOpsIcon,
  DataScienceIcon,
  BackendIcon,
  NetworkingIcon,
  ITSMIcon,
  FrontendIcon,
  FinanceIcon,
  ManagementIcon,
  LogisticsIcon,
} from "../components/Icons";

const fieldIcons = {
  cybersecurity: CybersecurityIcon,
  "cloud-engineering": CloudIcon,
  devops: DevOpsIcon,
  "data-science": DataScienceIcon,
  "backend-development": BackendIcon,
  networking: NetworkingIcon,
  itsm: ITSMIcon,
  "frontend-development": FrontendIcon,
  "finance-accounting": FinanceIcon,
  management: ManagementIcon,
  "logistics-supply-chain": LogisticsIcon,
};

const stageNames = {
  1: "Foundation",
  2: "Associate",
  3: "Professional",
  4: "Expert",
};

function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Roadmap() {
  const { slug } = useParams();
  const field = fields.find((f) => f.slug === slug);

  if (!field) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-sans text-3xl font-medium text-ink">Field not found</h1>
        <Link
          to="/explore"
          className="mt-4 inline-block font-sans text-sm font-semibold text-rust hover:underline"
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
        <ol className="flex items-center gap-2 font-sans text-sm text-pencil">
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
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
          Your learning path
        </span>
        <div className="mt-2 flex items-center gap-3">
          {(() => {
            const Icon = fieldIcons[slug];
            return Icon ? <Icon className="h-10 w-10 text-merito" /> : null;
          })()}
          <h1 className="font-sans text-4xl font-bold text-ink sm:text-5xl">
            {field.name}
          </h1>
        </div>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-graphite">
          {field.description}
        </p>

        {/* Stats row */}
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-sans text-2xl font-bold text-rust">
              {stageNums.length}
            </span>
            <span className="font-sans text-sm text-graphite">
              stages
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-sans text-2xl font-bold text-rust">
              {fieldCerts.length}
            </span>
            <span className="font-sans text-sm text-graphite">
              certifications
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-sans text-2xl font-bold text-rust">
              {fieldJobs.length}
            </span>
            <span className="font-sans text-sm text-graphite">
              matching jobs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rust/10 font-sans text-2xl font-bold text-rust">
              ~{totalMonths}
            </span>
            <span className="font-sans text-sm text-graphite">
              months total
            </span>
          </div>
        </div>

        {/* Salary range box */}
        {salaryMin !== null && salaryMax !== null && (
          <div
            className="mt-6 rounded-xl border-[1.5px] border-success/20 bg-success/5 px-6 py-4 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
              What you could earn
            </span>
            <span className="mt-1 block font-sans text-2xl font-bold text-ink">
              Salary range in Poland: {salaryMin.toLocaleString("pl-PL")} - {salaryMax.toLocaleString("pl-PL")} PLN/month
            </span>
            <span className="mt-1 block text-base text-graphite">
              From {fieldJobs.length} real job {fieldJobs.length === 1 ? "listing" : "listings"} in {field.name}
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
            <RevealOnScroll key={num} delay={i * 120}>
              <StageCard
                stageNum={num}
                stageName={stageNames[num]}
                certs={stages[num]}
                fieldSlug={slug}
                isActive={num === 1}
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="mt-16 rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-10 text-center animate-fade-in-up"
        style={{ animationDelay: `${(stageNums.length + 4) * 100}ms` }}
      >
        <h2 className="font-sans text-3xl font-bold text-ink">
          Want to track your progress?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-graphite">
          Sign in to save your progress, track completed certs and skills, and get personalized recommendations.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-pencil">
          Free to explore. Create an account when you want to save your progress.
        </p>
        <button
          type="button"
          className="mt-6 bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200"
        >
          Get started — it's free
        </button>
      </div>
    </section>
  );
}
