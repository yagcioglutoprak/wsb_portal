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

export default function CertDetail() {
  const { slug, certId } = useParams();
  const field = fields.find((f) => f.slug === slug);
  const fieldCerts = certifications[slug] || [];
  const cert = fieldCerts.find((c) => c.id === certId);

  if (!field || !cert) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-3xl italic text-ink">
          Certification not found
        </h1>
        <Link
          to="/explore"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-rust hover:underline"
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

  // Prerequisites — resolve names
  const prereqId = cert.prerequisites;
  const prereqs = prereqId
    ? [fieldCerts.find((c) => c.id === prereqId)].filter(Boolean)
    : [];

  // Total stages in field
  const totalStages = fieldCerts.reduce(
    (max, c) => Math.max(max, c.stage),
    0
  );

  return (
    <section className="py-4">
      {/* Breadcrumb */}
      <nav
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <ol className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-wider text-pencil">
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
        <span className="font-mono text-xs uppercase tracking-widest text-pencil">
          {cert.provider}
        </span>
        <h1 className="mt-2 font-serif text-3xl italic text-ink sm:text-4xl">
          {cert.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-graphite">
          {cert.description}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column — 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats grid */}
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            <StatBlock
              label="Cost"
              value={`${cert.costPln.toLocaleString("pl-PL")} PLN`}
            />
            <StatBlock label="Duration" value={`~${Math.round(cert.durationWeeks / 4)} months`} />
            <StatBlock label="Exam code" value={cert.examCode} />
            <StatBlock label="Stage" value={`${cert.stage} of ${totalStages}`} />
          </div>

          {/* Keywords */}
          {(certKeywords[certId] || []).length > 0 && (
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-pencil">
                Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {(certKeywords[certId] || []).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-faint bg-warm/50 px-3 py-1 font-mono text-[11px] tracking-wider text-graphite"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {prereqs.length > 0 && (
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "320ms" }}
            >
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-pencil">
                Prerequisites
              </h2>
              <div className="flex flex-wrap gap-3">
                {prereqs.map((p) => (
                  <Link
                    key={p.id}
                    to={`/fields/${slug}/certs/${p.id}`}
                    className="rounded-md border border-faint bg-white px-4 py-2 font-serif text-sm italic text-ink transition-all duration-200 hover:border-rust hover:text-rust"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Learning resources */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-pencil">
              Learning resources
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
              <p className="text-sm text-pencil">
                No curated resources yet. Check the vendor site for official
                training materials.
              </p>
            )}
          </div>
        </div>

        {/* Right column — 1/3 width */}
        <div className="space-y-8">
          {/* Matching jobs panel */}
          <div
            className="rounded-lg border border-faint bg-white p-5 animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-pencil">
              Matching jobs ({matchingJobs.length})
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
              <p className="text-sm text-pencil">
                No current listings require this certification specifically.
              </p>
            )}
          </div>

          {/* Next cert suggestion */}
          {nextStageCerts.length > 0 && (
            <div
              className="rounded-lg border border-faint bg-warm/40 p-5 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-pencil">
                Next step
              </h2>
              {nextStageCerts.map((nc) => (
                <Link
                  key={nc.id}
                  to={`/fields/${slug}/certs/${nc.id}`}
                  className="group block"
                >
                  <span className="font-serif text-lg italic text-ink transition-colors duration-200 group-hover:text-rust">
                    {nc.name}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] tracking-wider text-pencil">
                    Stage {nc.stage} &middot; ~{Math.round(nc.durationWeeks / 4)} months
                    &middot; {nc.costPln.toLocaleString("pl-PL")} PLN
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
