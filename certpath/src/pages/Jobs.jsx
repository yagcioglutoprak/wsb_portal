import { useState } from "react";
import { fields, jobs } from "../data/mock";
import JobRow from "../components/JobRow";
import useProgress from "../hooks/useProgress";
import useScrollReveal from "../hooks/useScrollReveal";

const experienceLevels = [
  { value: "all", label: "All levels" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
];

function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Jobs() {
  const { profile, isOnboarded } = useProgress();
  const [activeField, setActiveField] = useState(() =>
    isOnboarded && profile?.field ? profile.field : "all"
  );
  const [activeLevel, setActiveLevel] = useState(() =>
    isOnboarded ? "junior" : "all"
  );

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
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
          Opportunities
        </span>
        <h1 className="mt-2 font-sans text-4xl font-bold text-ink sm:text-5xl">
          Opportunities for students
        </h1>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-graphite">
          Internships, working student positions, and full-time roles in
          Poland. Filter by field and experience level to find what fits your
          schedule.
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
      <div
        className="mb-4 flex items-center gap-2 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <span className="font-sans text-3xl font-bold text-ink">
          {filtered.length}
        </span>
        <span className="font-sans text-base text-pencil">
          of {jobs.length} positions
        </span>
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((job, i) => (
            <RevealOnScroll key={job.id} delay={i * 60}>
              <JobRow job={job} />
            </RevealOnScroll>
          ))
        ) : (
          <div className="rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-12 text-center">
            <p className="font-sans text-xl font-medium text-pencil">
              No jobs match the current filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveField("all");
                setActiveLevel("all");
              }}
              className="mt-3 font-sans text-sm font-semibold text-rust hover:underline"
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
        "rounded-full border px-4 py-1.5 font-sans text-sm font-medium transition-all duration-200",
        active
          ? "border-rust bg-rust text-white"
          : "border-faint bg-card text-graphite hover:border-pencil/30 hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
