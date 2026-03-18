import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fields, jobs } from "../data/mock";
import useProgress from "../hooks/useProgress";
import useScrollReveal from "../hooks/useScrollReveal";

function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] h-full"
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

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border-[1.5px] px-5 py-2.5 font-sans text-sm font-semibold transition-all duration-300
        ${active 
          ? "border-rust bg-rust text-white shadow-[0_2px_0_0_rgba(40,86,166,0.3)] hover:bg-rust/95 hover:border-rust/95" 
          : "border-ink/12 bg-card text-graphite shadow-[0_2px_0_0_rgba(0,0,0,0.04)] hover:border-pencil/30 hover:text-ink hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
        }
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-pencil ml-1">{title}</h3>
      <div className="flex flex-wrap gap-2.5">
        {children}
      </div>
    </div>
  );
}

export default function Jobs() {
  const { t } = useTranslation();
  const { profile, isOnboarded } = useProgress();
  const [activeField, setActiveField] = useState(() =>
    isOnboarded && profile?.field ? profile.field : "all"
  );
  const [activeType, setActiveType] = useState("all");

  const jobTypes = [
    { value: "all", label: t("jobs.allTypes") },
    { value: "Internship", label: t("jobs.internship") },
    { value: "Working Student", label: t("jobs.workingStudent") },
  ];

  const filtered = jobs.filter((job) => {
    if (activeField !== "all" && job.fieldId !== activeField) return false;
    if (activeType !== "all" && job.type !== activeType) return false;
    return true;
  });

  return (
    <section className="py-8 lg:py-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <div
        className="mb-12 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <span className="inline-block bg-[#2a9d8f]/10 text-[#2a9d8f] border border-[#2a9d8f]/20 rounded-full px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest mb-4">
          {t("jobs.hiringNow")}
        </span>
        <h1 className="font-sans text-2xl font-bold text-ink sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none mb-4">
          {t("jobs.title")}
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-graphite font-medium">
          {t("jobs.subtitle")}
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-2xl p-6 sm:p-8 mb-12 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <div className="flex flex-col gap-8">
          {/* Field filter */}
          <FilterGroup title={t("jobs.fieldOfInterest")}>
            <FilterPill
              active={activeField === "all"}
              onClick={() => setActiveField("all")}
            >
              {t("jobs.allFields")}
            </FilterPill>
            {fields.map((f) => (
              <FilterPill
                key={f.slug}
                active={activeField === f.slug}
                onClick={() => setActiveField(f.slug)}
              >
                {f.name}
              </FilterPill>
            ))}
          </FilterGroup>

          {/* Job type filter */}
          <FilterGroup title={t("jobs.positionType")}>
            {jobTypes.map((jt) => (
              <FilterPill
                key={jt.value}
                active={activeType === jt.value}
                onClick={() => setActiveType(jt.value)}
              >
                {jt.label}
              </FilterPill>
            ))}
          </FilterGroup>
        </div>
      </div>

      {/* Results Header */}
      <div
        className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/8 pb-4 animate-fade-in-up"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-sans text-2xl font-bold text-ink tracking-tight">{t("jobs.availablePositions")}</h2>
          <span className="bg-rust/10 text-rust border border-rust/20 rounded-full px-3 py-0.5 font-mono text-sm font-bold">
            {filtered.length}
          </span>
        </div>
        {filtered.length > 0 && (
          <p className="font-sans text-sm font-medium text-pencil">
            {t("jobs.showingOf", { filtered: filtered.length, total: jobs.length })}
          </p>
        )}
      </div>

      {/* Job list grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((job, i) => {
            const isWorkingStudent = job.type === "Working Student";
            return (
              <RevealOnScroll key={job.id} delay={i * 50}>
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] h-full flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <span className={`inline-block border px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${isWorkingStudent ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                        {job.type}
                      </span>
                      <span className="font-mono text-sm font-bold text-ink shrink-0">
                        {(job.salaryMin / 1000).toFixed(1)}k–{(job.salaryMax / 1000).toFixed(1)}k <span className="text-xs text-pencil uppercase tracking-wider ml-0.5">PLN</span>
                      </span>
                    </div>
                    <h3 className="font-sans text-xl font-bold text-ink leading-tight mb-2 group-hover:text-rust transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="font-sans text-base font-medium text-graphite mb-2">
                      {job.company}
                    </p>
                  </div>
                  <div className="mt-8 pt-5 border-t border-ink/8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {job.source === "LinkedIn" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2" className="shrink-0">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      )}
                      <p className="font-sans text-xs font-semibold text-pencil uppercase tracking-wider">
                        {job.location}
                      </p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-pencil/40 group-hover:text-rust transition-colors transform group-hover:translate-x-0.5">
                      <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </a>
              </RevealOnScroll>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-12 sm:p-20 text-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="w-16 h-16 bg-rust/10 text-rust rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 className="font-sans text-2xl font-bold text-ink mb-3">{t("jobs.noMatching")}</h3>
          <p className="font-sans text-lg font-medium text-pencil max-w-md mx-auto mb-8">
            {t("jobs.noMatchingDesc")}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveField("all");
              setActiveType("all");
            }}
            className="bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 transition-all shadow-[0_2px_0_0_rgba(0,0,0,0.1)] inline-flex items-center gap-2"
          >
            {t("jobs.clearFilters")}
          </button>
        </div>
      )}
    </section>
  );
}
