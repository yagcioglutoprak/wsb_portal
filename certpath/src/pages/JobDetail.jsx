import { useParams, Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";

export default function JobDetail() {
  const { jobId } = useParams();
  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-3xl italic text-ink">Job not found</h1>
        <Link
          to="/jobs"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-rust hover:underline"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  const field = fields.find((f) => f.id === job.fieldId);
  const allCerts = Object.values(certifications).flat();
  const relatedCerts = job.certIds
    .map((cid) => allCerts.find((c) => c.id === cid))
    .filter(Boolean);

  const levelLabel = {
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior",
  };

  return (
    <section className="py-4">
      {/* Breadcrumb */}
      <nav
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <ol className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-wider text-pencil">
          <li>
            <Link to="/jobs" className="transition-colors hover:text-rust">
              Jobs
            </Link>
          </li>
          <li>/</li>
          <li className="text-ink">{job.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div
        className="mb-10 animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="rounded-full border border-faint bg-warm/50 px-3 py-1 font-mono text-[11px] tracking-wider text-graphite">
            {levelLabel[job.experienceLevel] || job.experienceLevel}
          </span>
          {field && (
            <Link
              to={`/fields/${field.slug}`}
              className="rounded-full border border-faint bg-white px-3 py-1 font-mono text-[11px] tracking-wider text-graphite transition-colors hover:border-rust hover:text-rust"
            >
              {field.name}
            </Link>
          )}
        </div>
        <h1 className="font-serif text-3xl italic text-ink sm:text-4xl">
          {job.title}
        </h1>
        <p className="mt-2 text-lg text-graphite">{job.company}</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            <StatBlock label="Location" value={job.location} />
            <StatBlock
              label="Salary range"
              value={`${job.salaryMin.toLocaleString("pl-PL")} - ${job.salaryMax.toLocaleString("pl-PL")} PLN`}
            />
            <StatBlock label="Posted" value={job.postedAt} />
          </div>

          {/* Required skills */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-pencil">
              Required skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-faint bg-warm/50 px-3 py-1 font-mono text-[11px] tracking-wider text-graphite"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Source link */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "320ms" }}
          >
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-rust px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            >
              View original posting
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Right column — related certs */}
        <div>
          <div
            className="rounded-lg border border-faint bg-white p-5 animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-pencil">
              Related certifications
            </h2>
            {relatedCerts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {relatedCerts.map((cert, i) => (
                  <Link
                    key={cert.id}
                    to={`/fields/${cert.fieldId}/certs/${cert.id}`}
                    className="group block rounded-md border-l-[3px] border-l-rust border border-t-faint border-r-faint border-b-faint bg-white px-4 py-3 transition-all duration-200 hover:translate-x-1 hover:shadow-sm animate-fade-in-up"
                    style={{ animationDelay: `${(i + 4) * 80}ms` }}
                  >
                    <span className="block font-serif text-sm italic text-ink transition-colors duration-200 group-hover:text-rust">
                      {cert.name}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] tracking-wider text-pencil">
                      {cert.provider} &middot; {cert.examCode}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-pencil">
                No specific certifications listed for this role.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="rounded-md border border-faint bg-white p-4">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-pencil">
        {label}
      </span>
      <span className="mt-1 block font-serif text-lg italic text-ink">
        {value}
      </span>
    </div>
  );
}
