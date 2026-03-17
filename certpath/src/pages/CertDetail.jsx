import { useParams, Link } from "react-router-dom";
import {
  fields,
  certifications,
  learningResources,
  jobs,
  certKeywords,
} from "../data/mock";
import ResourceRow from "../components/ResourceRow";
import JobRow from "../components/JobRow";
import { CurrencyIcon, ClockIcon, BookIcon, StageIcon } from "../components/Icons";

const difficultyStyles = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-warning/10 text-amber-700 border-warning/20",
  advanced: "bg-rust/10 text-rust border-rust/20",
  expert: "bg-rust/10 text-rust border-rust/20",
};

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export default function CertDetail() {
  const { slug, certId } = useParams();
  const field = fields.find((f) => f.slug === slug);
  const fieldCerts = certifications[slug] || [];
  const cert = fieldCerts.find((c) => c.id === certId);

  if (!field || !cert) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-sans text-3xl font-medium text-ink">
          Certification not found
        </h1>
        <Link
          to="/explore"
          className="mt-4 inline-block font-sans text-sm font-semibold text-rust hover:underline"
        >
          Back to fields
        </Link>
      </div>
    );
  }

  const resources = learningResources[certId] || [];
  const matchingJobs = jobs.filter((j) => j.certIds?.includes(certId));

  // Find the "next" cert in the same field, next stage
  const nextStageCerts = fieldCerts
    .filter((c) => c.stage === cert.stage + 1)
    .slice(0, 1);

  // Prerequisites -- resolve names
  const prereqId = cert.prerequisites;
  const prereqs = prereqId
    ? [fieldCerts.find((c) => c.id === prereqId)].filter(Boolean)
    : [];

  // Total stages in field
  const totalStages = fieldCerts.reduce(
    (max, c) => Math.max(max, c.stage),
    0
  );

  // Salary range for matching jobs
  const jobSalaryMin = matchingJobs.length > 0
    ? Math.min(...matchingJobs.map((j) => j.salaryMin))
    : null;
  const jobSalaryMax = matchingJobs.length > 0
    ? Math.max(...matchingJobs.map((j) => j.salaryMax))
    : null;

  return (
    <section className="py-4">
      {/* Breadcrumb */}
      <nav
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <ol className="flex flex-wrap items-center gap-2 font-sans text-sm text-pencil">
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
          <li>
            <Link
              to={`/fields/${slug}`}
              className="transition-colors hover:text-rust"
            >
              {field.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-ink">{cert.name}</li>
        </ol>
      </nav>

      {/* Title area */}
      <div
        className="mb-8 animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
            {cert.provider}
          </span>
          {cert.difficulty && (
            <span
              className={[
                "rounded-full border px-2.5 py-0.5 font-sans text-sm font-medium",
                difficultyStyles[cert.difficulty] || "bg-faint text-pencil border-faint",
              ].join(" ")}
            >
              {difficultyLabels[cert.difficulty] || cert.difficulty}
            </span>
          )}
        </div>
        <h1 className="mt-2 font-sans text-4xl font-bold text-ink sm:text-5xl">
          {cert.name}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-graphite">
          {cert.description}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column -- 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats grid */}
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            <StatBlock
              icon={CurrencyIcon}
              label="Cost"
              value={`${cert.costPln.toLocaleString("pl-PL")} PLN`}
            />
            <StatBlock icon={ClockIcon} label="Duration" value={`~${Math.round(cert.durationWeeks / 4)} months`} />
            <StatBlock icon={BookIcon} label="Exam code" value={cert.examCode || "N/A"} />
            <StatBlock icon={StageIcon} label="Stage" value={`${cert.stage} of ${totalStages}`} />
          </div>

          {/* Salary after this certification */}
          {jobSalaryMin !== null && jobSalaryMax !== null && (
            <div
              className="rounded-xl border-[1.5px] border-success/20 bg-success/5 px-6 py-5 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                What this cert is worth
              </span>
              <span className="mt-1 block font-sans text-2xl font-bold text-ink">
                {jobSalaryMin.toLocaleString("pl-PL")} - {jobSalaryMax.toLocaleString("pl-PL")} PLN/month
              </span>
              <span className="mt-1 block text-base text-graphite">
                From {matchingJobs.length} real {matchingJobs.length === 1 ? "position" : "positions"} requiring this certification
              </span>
            </div>
          )}

          {/* What you'll learn */}
          {(certKeywords[certId] || []).length > 0 && (
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                Skills you'll gain
              </h2>
              <div className="flex flex-wrap gap-2">
                {(certKeywords[certId] || []).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border-[1.5px] border-ink/12 bg-warm/50 px-4 py-1.5 font-sans text-sm font-medium text-graphite"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "320ms" }}
          >
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
              Prerequisites
            </h2>
            {prereqs.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {prereqs.map((p) => (
                  <Link
                    key={p.id}
                    to={`/fields/${slug}/certs/${p.id}`}
                    className="rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card px-5 py-3 transition-all duration-200 hover:border-rust hover:text-rust"
                  >
                    <span className="block font-sans text-base font-medium text-ink">
                      {p.name}
                    </span>
                    <span className="mt-1 block font-mono text-sm text-pencil">
                      {p.provider} &middot; ~{Math.round(p.durationWeeks / 4)} months
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-[1.5px] border-success/20 bg-success/5 px-5 py-4">
                <span className="text-base text-success">
                  No prerequisites
                </span>
                <span className="mt-1 block text-sm text-graphite">
                  Open to everyone — no prior certifications required.
                </span>
              </div>
            )}
          </div>

          {/* Learning resources */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
              Study resources
            </h2>
            {resources.length > 0 ? (
              <div className="flex flex-col gap-3">
                {resources.map((r, i) => (
                  <div
                    key={r.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(i + 5) * 80}ms` }}
                  >
                    <ResourceRow resource={r} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base text-pencil">
                No study resources added yet — check the vendor's official site.
              </p>
            )}
          </div>
        </div>

        {/* Right column -- 1/3 width */}
        <div className="space-y-8">
          {/* Matching jobs panel */}
          <div
            className="rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-6 animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
              Matching opportunities ({matchingJobs.length})
            </h2>
            {matchingJobs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {matchingJobs.map((job, i) => (
                  <div
                    key={job.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(i + 4) * 80}ms` }}
                  >
                    <JobRow job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base text-pencil">
                No matching positions right now — new listings are added regularly.
              </p>
            )}
          </div>

          {/* Next cert suggestion */}
          {nextStageCerts.length > 0 && (
            <div
              className="rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-warm/40 p-6 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                What's next
              </h2>
              {nextStageCerts.map((nc) => (
                <Link
                  key={nc.id}
                  to={`/fields/${slug}/certs/${nc.id}`}
                  className="group block"
                >
                  <span className="font-sans text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-rust">
                    {nc.name}
                  </span>
                  {nc.description && (
                    <span className="mt-2 block text-base leading-relaxed text-graphite line-clamp-2">
                      {nc.description}
                    </span>
                  )}
                  <span className="mt-2 block font-mono text-sm text-pencil">
                    Stage {nc.stage} &middot; ~{Math.round(nc.durationWeeks / 4)} months
                    &middot; {nc.costPln.toLocaleString("pl-PL")} PLN
                  </span>
                  <span className="mt-3 inline-block font-sans text-sm font-semibold text-rust transition-colors duration-200 group-hover:underline">
                    View certification &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatBlock({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-6">
      {Icon && <Icon className="mb-2 h-5 w-5 text-pencil" />}
      <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
        {label}
      </span>
      <span className="mt-1.5 block font-sans text-3xl font-bold text-ink">
        {value}
      </span>
    </div>
  );
}
