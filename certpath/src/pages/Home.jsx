import { useState } from "react";
import { Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";
import useProgress from "../hooks/useProgress";
import JobRow from "../components/JobRow";
import {
  CybersecurityIcon, CloudIcon, DevOpsIcon, DataScienceIcon,
  BackendIcon, NetworkingIcon, ITSMIcon, FrontendIcon,
  FinanceIcon, ManagementIcon, LogisticsIcon,
} from "../components/Icons";

const fieldIcons = {
  cybersecurity: CybersecurityIcon,
  "cloud-engineering": CloudIcon,
  devops: DevOpsIcon,
  "data-science": DataScienceIcon,
  "backend-development": BackendIcon,
  networking: NetworkingIcon,
  itsm: ITSMIcon,
  "frontend-development": FrontendIcon,
  "finance-accounting": FinanceIcon,
  management: ManagementIcon,
  "logistics-supply-chain": LogisticsIcon,
};

const stageNames = { 1: "Foundation", 2: "Associate", 3: "Professional", 4: "Expert" };

const difficultyColors = {
  beginner: "bg-success/10 text-success",
  intermediate: "bg-warning/10 text-amber-700",
  advanced: "bg-rust/10 text-rust",
  expert: "bg-rust/10 text-rust",
};

export default function Home() {
  const [activeSlug, setActiveSlug] = useState("cybersecurity");
  const { isOnboarded } = useProgress();

  const activeField = fields.find((f) => f.slug === activeSlug) || fields[0];
  const activeCerts = certifications[activeSlug] || [];
  const activeJobs = jobs.filter((j) => j.fieldId === activeField.id);
  const totalCerts = Object.values(certifications).flat().length;

  // Group certs by stage
  const stages = {};
  activeCerts.forEach((c) => {
    if (!stages[c.stage]) stages[c.stage] = [];
    stages[c.stage].push(c);
  });
  const stageNums = Object.keys(stages).map(Number).sort((a, b) => a - b);

  // Salary range
  const salaryMin = activeJobs.length > 0 ? Math.min(...activeJobs.map((j) => j.salaryMin)) : 0;
  const salaryMax = activeJobs.length > 0 ? Math.max(...activeJobs.map((j) => j.salaryMax)) : 0;

  return (
    <section>
      {/* ═══════════════════ HERO — compact, drives to interaction ═══════════════════ */}
      <div className="py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="inline-block font-mono text-sm uppercase tracking-widest text-merito animate-fade-in-up">
            Made for WSB Merito students
          </span>

          <h1 className="mt-4 font-serif text-4xl italic leading-tight text-ink sm:text-5xl lg:text-6xl animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            Start building your career while you're still studying.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-graphite animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            Pick a field below and see the full certification roadmap, matched jobs, and salary ranges — all personalized for WSB Merito students.
          </p>

          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
            {isOnboarded ? (
              <Link
                to="/dashboard"
                className="inline-block rounded-lg bg-rust px-8 py-3.5 font-mono text-sm uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rust/20"
              >
                Go to your dashboard
              </Link>
            ) : (
              <Link
                to="/onboarding"
                className="inline-block rounded-lg bg-rust px-8 py-3.5 font-mono text-sm uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rust/20"
              >
                Get your personalized plan
              </Link>
            )}
            <span className="mx-3 text-pencil">or explore below</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════ INTERACTIVE FIELD PICKER ═══════════════════ */}
      <div className="bg-warm/40 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4">
          {/* Field selector pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {fields.map((field) => {
              const Icon = fieldIcons[field.slug];
              const isActive = field.slug === activeSlug;
              return (
                <button
                  key={field.slug}
                  type="button"
                  onClick={() => setActiveSlug(field.slug)}
                  className={[
                    "flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm tracking-wider transition-all duration-200",
                    isActive
                      ? "border-rust bg-rust text-white shadow-md scale-105"
                      : "border-faint bg-card text-graphite hover:border-rust/40 hover:text-ink hover:shadow-sm",
                  ].join(" ")}
                >
                  {Icon && <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-pencil"}`} />}
                  {field.name}
                </button>
              );
            })}
          </div>

          {/* ── Active field header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6" key={activeSlug}>
            <div>
              <h2 className="font-sans text-3xl font-bold text-ink sm:text-4xl">
                {activeField.name}
              </h2>
              <p className="mt-1 max-w-xl text-base text-graphite">{activeField.description}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="rounded-lg border border-faint bg-card px-4 py-2 text-center shadow-sm">
                <span className="block font-sans text-xl font-bold text-ink">{activeCerts.length}</span>
                <span className="font-mono text-sm text-pencil">certs</span>
              </div>
              <div className="rounded-lg border border-faint bg-card px-4 py-2 text-center shadow-sm">
                <span className="block font-sans text-xl font-bold text-ink">{activeJobs.length}</span>
                <span className="font-mono text-sm text-pencil">jobs</span>
              </div>
              {salaryMax > 0 && (
                <div className="rounded-lg border border-success/20 bg-success/5 px-4 py-2 text-center shadow-sm">
                  <span className="block font-sans text-xl font-bold text-ink">
                    {(salaryMin / 1000).toFixed(0)}-{(salaryMax / 1000).toFixed(0)}k
                  </span>
                  <span className="font-mono text-sm text-pencil">PLN/mo</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Staged roadmap ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" key={`stages-${activeSlug}`}>
            {stageNums.map((stageNum, idx) => {
              const stageCerts = stages[stageNum];
              const stageMonths = Math.round(
                stageCerts.reduce((sum, c) => sum + c.durationWeeks, 0) / 4
              );
              return (
                <div
                  key={stageNum}
                  className="rounded-xl border border-faint bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium transition-colors ${
                        idx === 0
                          ? "bg-rust text-white"
                          : "border-2 border-pencil/20 text-pencil"
                      }`}
                    >
                      {stageNum}
                    </div>
                    <div>
                      <span className="block font-sans text-lg font-semibold text-ink">
                        {stageNames[stageNum] || `Stage ${stageNum}`}
                      </span>
                      <span className="block font-mono text-sm text-pencil">~{stageMonths} mo</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {stageCerts.map((cert) => (
                      <Link
                        key={cert.id}
                        to={`/fields/${activeSlug}/certs/${cert.id}`}
                        className="group block rounded-lg border border-faint bg-paper/50 px-3.5 py-2.5 transition-all duration-200 hover:border-rust/30 hover:shadow-sm"
                      >
                        <span className="block text-sm font-medium text-ink group-hover:text-rust transition-colors">
                          {cert.name}
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-sm text-pencil">{cert.provider}</span>
                          <span className="text-faint">·</span>
                          <span className="font-mono text-sm text-pencil">
                            {cert.costPln > 0 ? `${cert.costPln.toLocaleString("pl-PL")} PLN` : "Free"}
                          </span>
                          {cert.difficulty && (
                            <>
                              <span className="text-faint">·</span>
                              <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${difficultyColors[cert.difficulty] || "text-pencil"}`}>
                                {cert.difficulty}
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full roadmap link */}
          <div className="mt-6 text-center">
            <Link
              to={`/fields/${activeSlug}`}
              className="inline-block rounded-lg border border-rust bg-rust/5 px-6 py-3 font-mono text-sm uppercase tracking-wider text-rust transition-all duration-200 hover:bg-rust hover:text-white hover:shadow-md"
            >
              See full {activeField.name} roadmap with study resources &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════ MATCHING JOBS for selected field ═══════════════════ */}
      {activeJobs.length > 0 && (
        <div className="py-10 sm:py-14">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="font-mono text-sm uppercase tracking-widest text-pencil">
                  {activeField.name} jobs
                </span>
                <h2 className="mt-1 font-sans text-2xl font-bold text-ink">
                  {activeJobs.length} positions in Poland right now
                </h2>
              </div>
              <Link
                to="/jobs"
                className="hidden sm:block font-mono text-sm uppercase tracking-wider text-rust transition-colors hover:text-ink"
              >
                All {jobs.length} jobs &rarr;
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {activeJobs.slice(0, 4).map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ BOTTOM CTA ═══════════════════ */}
      <div className="pb-14">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl bg-ink p-10 sm:p-14 text-center shadow-xl">
            <h2 className="font-sans text-3xl font-bold text-white sm:text-4xl">
              Get a plan tailored to you
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-white/60">
              Answer 3 quick questions — your year, program, and interests. We'll build
              your personalized roadmap with matched jobs and study resources.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {isOnboarded ? (
                <Link
                  to="/dashboard"
                  className="inline-block rounded-lg bg-rust px-10 py-4 font-mono text-base uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Go to your dashboard
                </Link>
              ) : (
                <Link
                  to="/onboarding"
                  className="inline-block rounded-lg bg-rust px-10 py-4 font-mono text-base uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Get started — 30 seconds
                </Link>
              )}
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-white/40">
              <div className="text-center">
                <span className="block font-sans text-2xl font-bold text-white/80">{fields.length}</span>
                <span className="font-mono text-sm">fields</span>
              </div>
              <span className="h-6 w-px bg-white/10" />
              <div className="text-center">
                <span className="block font-sans text-2xl font-bold text-white/80">{totalCerts}</span>
                <span className="font-mono text-sm">certs</span>
              </div>
              <span className="h-6 w-px bg-white/10" />
              <div className="text-center">
                <span className="block font-sans text-2xl font-bold text-white/80">{jobs.length}</span>
                <span className="font-mono text-sm">jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
