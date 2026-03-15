import { Link } from "react-router-dom";
import { jobs } from "../data/mock";

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

export default function CertCard({ cert, fieldSlug, locked = false }) {
  const matchingJobs = jobs.filter((j) => j.certIds?.includes(cert.id)).length;

  const card = (
    <div
      className={[
        "group relative rounded-md border bg-white px-5 py-5 transition-all duration-300",
        locked
          ? "cursor-default border-faint opacity-40"
          : "border-l-[3px] border-l-rust border-t-faint border-r-faint border-b-faint hover:-translate-y-px hover:shadow-md",
      ].join(" ")}
    >
      {/* Cert name */}
      <h4
        className={[
          "font-sans text-sm font-semibold leading-snug",
          locked ? "text-pencil" : "text-ink group-hover:text-rust",
          "transition-colors duration-200",
        ].join(" ")}
      >
        {cert.name}
      </h4>

      {/* Description */}
      {cert.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-graphite line-clamp-2">
          {cert.description}
        </p>
      )}

      {/* Provider badge */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-faint bg-warm/50 px-2.5 py-0.5 font-mono text-xs tracking-wider text-graphite">
          {cert.provider}
        </span>
        {cert.difficulty && (
          <span
            className={[
              "rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wider",
              difficultyStyles[cert.difficulty] || "bg-faint text-pencil border-faint",
            ].join(" ")}
          >
            {difficultyLabels[cert.difficulty] || cert.difficulty}
          </span>
        )}
      </div>

      {/* Metadata row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-xs tracking-wider text-pencil">
          {cert.costPln.toLocaleString("pl-PL")} PLN
        </span>
        <span className="text-faint">|</span>
        <span className="font-mono text-xs tracking-wider text-pencil">
          ~{Math.round(cert.durationWeeks / 4)} mo
        </span>
        {cert.examCode && (
          <>
            <span className="text-faint">|</span>
            <span className="font-mono text-xs tracking-wider text-pencil">
              {cert.examCode}
            </span>
          </>
        )}
      </div>

      {/* Job count */}
      {!locked && matchingJobs > 0 && (
        <p className="mt-2.5 font-mono text-xs tracking-wider text-success">
          {matchingJobs} matching {matchingJobs === 1 ? "job" : "jobs"}
        </p>
      )}
    </div>
  );

  if (locked) return card;

  return (
    <Link
      to={`/fields/${fieldSlug}/certs/${cert.id}`}
      className="block"
    >
      {card}
    </Link>
  );
}
