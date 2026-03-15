import { useState } from "react";
import { fields, jobs } from "../data/mock";
import JobRow from "../components/JobRow";

const experienceLevels = [
  { value: "all", label: "All levels" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
];

export default function Jobs() {
  const [activeField, setActiveField] = useState("all");
  const [activeLevel, setActiveLevel] = useState("all");

  const filtered = jobs.filter((job) => {
    if (activeField !== "all" && job.fieldId !== activeField) return false;
    if (activeLevel !== "all" && job.experienceLevel !== activeLevel)
      return false;
    return true;
  });

  return (
    <section className="py-4">
      {/* Header */}
      <div
        className="mb-8 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-pencil">
          Job board
        </span>
        <h1 className="mt-2 font-serif text-3xl italic text-ink sm:text-4xl">
          Jobs in Poland
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
          Current openings that list specific certifications in their
          requirements. Filter by field and experience level.
        </p>
      </div>

      {/* Field filter tabs */}
      <div
        className="mb-4 flex flex-wrap gap-2 animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <FilterTab
          active={activeField === "all"}
          onClick={() => setActiveField("all")}
        >
          All fields
        </FilterTab>
        {fields.map((f) => (
          <FilterTab
            key={f.slug}
            active={activeField === f.slug}
            onClick={() => setActiveField(f.slug)}
          >
            {f.name}
          </FilterTab>
        ))}
      </div>

      {/* Experience level filter */}
      <div
        className="mb-8 flex flex-wrap gap-2 animate-fade-in-up"
        style={{ animationDelay: "160ms" }}
      >
        {experienceLevels.map((lvl) => (
          <FilterTab
            key={lvl.value}
            active={activeLevel === lvl.value}
            onClick={() => setActiveLevel(lvl.value)}
          >
            {lvl.label}
          </FilterTab>
        ))}
      </div>

      {/* Count */}
      <p
        className="mb-4 font-mono text-xs tracking-wider text-pencil animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        Showing {filtered.length} of {jobs.length} positions
      </p>

      {/* Job list */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((job, i) => (
            <div
              key={job.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(i + 3) * 60}ms` }}
            >
              <JobRow job={job} />
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-faint bg-white p-12 text-center">
            <p className="font-serif text-lg italic text-pencil">
              No jobs match the current filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveField("all");
                setActiveLevel("all");
              }}
              className="mt-3 font-mono text-xs uppercase tracking-wider text-rust hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 font-mono text-[11px] tracking-wider transition-all duration-200",
        active
          ? "border-rust bg-rust text-white"
          : "border-faint bg-white text-graphite hover:border-pencil/30 hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
