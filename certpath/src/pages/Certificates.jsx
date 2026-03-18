import { useState } from "react";
import { fields, certifications } from "../data/mock";
import { getFieldColor } from "../data/fieldColors";
import useScrollReveal from "../hooks/useScrollReveal";

const difficultyStyle = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-orange-50 text-orange-700 border-orange-200",
  expert: "bg-rose-50 text-rose-700 border-rose-200",
};

function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
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

export default function Certificates() {
  const [activeField, setActiveField] = useState("all");

  const allCerts = Object.values(certifications).flat();
  const displayFields = activeField === "all"
    ? fields.filter((f) => (certifications[f.slug] || []).length > 0)
    : fields.filter((f) => f.slug === activeField);

  const totalCerts = allCerts.length;
  const freeCerts = allCerts.filter((c) => c.costPln === 0).length;
  const avgWeeks = Math.round(allCerts.reduce((s, c) => s + c.durationWeeks, 0) / totalCerts);

  return (
    <section className="py-8 lg:py-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-12 animate-fade-in-up">
        <span className="inline-block bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest mb-4">
          Certification Hub
        </span>
        <h1 className="font-sans text-4xl font-bold text-ink sm:text-5xl lg:text-6xl tracking-tight leading-none mb-4">
          Certifications
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-graphite font-medium">
          Real certifications with verified prices, exam codes, and direct links
          to official registration pages.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5">
          <span className="block font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-1">Total</span>
          <span className="font-mono text-2xl font-bold text-ink">{totalCerts}</span>
        </div>
        <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5">
          <span className="block font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-1">Free</span>
          <span className="font-mono text-2xl font-bold text-success">{freeCerts}</span>
        </div>
        <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5">
          <span className="block font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-1">Avg. Duration</span>
          <span className="font-mono text-2xl font-bold text-ink">~{avgWeeks}<span className="text-sm text-pencil font-semibold ml-1">wk</span></span>
        </div>
      </div>

      {/* Field Filter */}
      <div className="flex flex-wrap gap-2.5 mb-10 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <button
          onClick={() => setActiveField("all")}
          className={`rounded-xl border-[1.5px] px-5 py-2.5 font-sans text-sm font-semibold transition-all duration-300 ${
            activeField === "all"
              ? "border-rust bg-rust text-white shadow-[0_2px_0_0_rgba(40,86,166,0.3)]"
              : "border-ink/12 bg-card text-graphite shadow-[0_2px_0_0_rgba(0,0,0,0.04)] hover:border-pencil/30 hover:text-ink"
          }`}
        >
          All fields
        </button>
        {fields
          .filter((f) => (certifications[f.slug] || []).length > 0)
          .map((f) => (
            <button
              key={f.slug}
              onClick={() => setActiveField(f.slug)}
              className={`rounded-xl border-[1.5px] px-5 py-2.5 font-sans text-sm font-semibold transition-all duration-300 ${
                activeField === f.slug
                  ? "border-rust bg-rust text-white shadow-[0_2px_0_0_rgba(40,86,166,0.3)]"
                  : "border-ink/12 bg-card text-graphite shadow-[0_2px_0_0_rgba(0,0,0,0.04)] hover:border-pencil/30 hover:text-ink"
              }`}
            >
              {f.name}
            </button>
          ))}
      </div>

      {/* Cert Sections by Field */}
      <div className="space-y-14">
        {displayFields.map((field, fi) => {
          const certs = certifications[field.slug] || [];
          if (certs.length === 0) return null;
          const color = getFieldColor(field.slug);
          const stages = {};
          certs.forEach((c) => {
            const key = c.stageName || "General";
            if (!stages[key]) stages[key] = [];
            stages[key].push(c);
          });

          return (
            <RevealOnScroll key={field.slug} delay={fi * 60}>
              <div>
                {/* Field Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/8">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color.accent }}
                  />
                  <h2 className="font-sans text-2xl font-bold text-ink tracking-tight">
                    {field.name}
                  </h2>
                  <span className="font-mono text-sm font-bold rounded-full px-3 py-0.5" style={{ backgroundColor: `${color.accent}15`, color: color.accent }}>
                    {certs.length}
                  </span>
                </div>

                {/* Stages */}
                <div className="space-y-8">
                  {Object.entries(stages).map(([stageName, stageCerts]) => (
                    <div key={stageName}>
                      <h3
                        className="font-sans text-xs font-bold uppercase tracking-widest mb-4 ml-1"
                        style={{ color: color.accent }}
                      >
                        {stageName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {stageCerts.map((cert) => (
                          <a
                            key={cert.id}
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-ink/20 flex flex-col"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <span className={`inline-block border px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${difficultyStyle[cert.difficulty] || "bg-ink/5 text-pencil border-ink/10"}`}>
                                {cert.difficulty}
                              </span>
                              {cert.examCode && (
                                <span className="font-mono text-xs text-pencil shrink-0">
                                  {cert.examCode}
                                </span>
                              )}
                            </div>

                            <h4 className="font-sans text-base font-bold text-ink leading-tight mb-1.5 group-hover:text-rust transition-colors">
                              {cert.name}
                            </h4>
                            <p className="font-sans text-sm text-pencil mb-3">{cert.provider}</p>

                            <p className="font-sans text-sm text-graphite leading-relaxed line-clamp-2 mb-4 flex-1">
                              {cert.description}
                            </p>

                            <div className="pt-4 border-t border-ink/8 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-ink">
                                  {cert.costPln > 0
                                    ? `${cert.costPln.toLocaleString("pl-PL")} PLN`
                                    : "Free"}
                                </span>
                                <span className="text-ink/20">·</span>
                                <span className="font-mono text-sm text-pencil">
                                  ~{cert.durationWeeks}wk
                                </span>
                              </div>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="text-pencil/40 group-hover:text-rust transition-colors"
                              >
                                <path
                                  d="M4 12L12 4M12 4H5M12 4V11"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
