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
      className="group flex items-center justify-between gap-4 rounded-xl border-[1.5px] border-ink/12 bg-card px-5 py-4 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {job.experienceLevel && (
            <span
              className={[
                "rounded-full border px-2.5 py-0.5 font-sans text-xs font-semibold tracking-wide",
                levelStyle[job.experienceLevel] || "bg-warm/50 text-graphite border-faint",
              ].join(" ")}
            >
              {levelLabel[job.experienceLevel] || job.experienceLevel}
            </span>
          )}
          {field && (
            <span className="font-sans text-xs tracking-wide text-pencil">
              {field.name}
            </span>
          )}
        </div>
        <h4 className="text-lg font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-rust">
          {job.title}
        </h4>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-sans text-sm tracking-wide text-pencil">
            {job.company}
          </span>
          <span className="text-faint">|</span>
          <span className="font-sans text-sm tracking-wide text-pencil">
            {job.location}
          </span>
        </div>
      </div>

      {/* Salary */}
      <span className="shrink-0 font-mono text-xs tracking-wide text-graphite">
        {job.salaryMin.toLocaleString("pl-PL")}
        {" - "}
        {job.salaryMax.toLocaleString("pl-PL")} PLN
      </span>
    </Link>
  );
}
