import { Link } from "react-router-dom";
import { fields } from "../data/mock";

const levelLabel = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
};

const levelStyle = {
  junior: "bg-success/10 text-success border-success/20",
  mid: "bg-merito/10 text-merito border-merito/20",
  senior: "bg-rust/10 text-rust border-rust/20",
};

export default function JobRow({ job }) {
  const field = fields.find((f) => f.id === job.fieldId);

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex items-center justify-between gap-4 rounded-md border border-faint bg-card px-5 py-4 transition-all duration-200 hover:translate-x-1 hover:border-pencil/30"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {job.experienceLevel && (
            <span
              className={[
                "rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wider",
                levelStyle[job.experienceLevel] || "bg-warm/50 text-graphite border-faint",
              ].join(" ")}
            >
              {levelLabel[job.experienceLevel] || job.experienceLevel}
            </span>
          )}
          {field && (
            <span className="font-mono text-xs tracking-wider text-pencil">
              {field.name}
            </span>
          )}
        </div>
        <h4 className="text-base font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-rust">
          {job.title}
        </h4>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-sm tracking-wider text-pencil">
            {job.company}
          </span>
          <span className="text-faint">|</span>
          <span className="font-mono text-sm tracking-wider text-pencil">
            {job.location}
          </span>
        </div>
      </div>

      {/* Salary */}
      <span className="shrink-0 font-mono text-xs tracking-wider text-graphite">
        {job.salaryMin.toLocaleString("pl-PL")}
        {" - "}
        {job.salaryMax.toLocaleString("pl-PL")} PLN
      </span>
    </Link>
  );
}
