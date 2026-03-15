import { Link } from "react-router-dom";
import { jobs } from "../data/mock";

export default function CertCard({ cert, fieldSlug, locked = false }) {
  const matchingJobs = jobs.filter((j) => j.certIds?.includes(cert.id)).length;

  const card = (
    <div
      className={[
        "group relative rounded-md border bg-white px-4 py-3 transition-all duration-300",
        locked
          ? "cursor-default border-faint opacity-40"
          : "border-l-[3px] border-l-rust border-t-faint border-r-faint border-b-faint hover:-translate-y-px hover:shadow-md",
      ].join(" ")}
    >
      {/* Cert name */}
      <h4
        className={[
          "font-serif text-base italic leading-snug",
          locked ? "text-pencil" : "text-ink group-hover:text-rust",
          "transition-colors duration-200",
        ].join(" ")}
      >
        {cert.name}
      </h4>

      {/* Metadata row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-[11px] tracking-wider text-pencil">
          {cert.costPln.toLocaleString("pl-PL")} PLN
        </span>
        <span className="text-faint">|</span>
        <span className="font-mono text-[11px] tracking-wider text-pencil">
          ~{Math.round(cert.durationWeeks / 4)} mo
        </span>
        <span className="text-faint">|</span>
        <span className="font-mono text-[11px] tracking-wider text-pencil">
          {cert.examCode}
        </span>
      </div>

      {/* Job count — only for unlocked */}
      {!locked && matchingJobs > 0 && (
        <p className="mt-2 font-mono text-[11px] tracking-wider text-success">
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
