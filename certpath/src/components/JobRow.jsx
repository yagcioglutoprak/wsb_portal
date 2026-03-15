import { Link } from "react-router-dom";

export default function JobRow({ job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex items-center justify-between gap-4 rounded-md border border-faint bg-white px-4 py-3 transition-all duration-200 hover:translate-x-1 hover:border-pencil/30"
    >
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-rust">
          {job.title}
        </h4>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] tracking-wider text-pencil">
            {job.company}
          </span>
          <span className="text-faint">|</span>
          <span className="font-mono text-[11px] tracking-wider text-pencil">
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
