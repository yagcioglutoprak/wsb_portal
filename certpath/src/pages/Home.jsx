import { useState } from "react";
import { Link } from "react-router-dom";
import { fields, certifications, jobs, skills, lessons } from "../data/mock";
import { getFieldColor } from "../data/fieldColors";
import useProgress from "../hooks/useProgress";
import useScrollReveal from "../hooks/useScrollReveal";
import HomepageLesson from "../components/HomepageLesson";
import BentoGrid from "../components/BentoGrid";
import {
  CybersecurityIcon, CloudIcon, DevOpsIcon, DataScienceIcon,
  BackendIcon, NetworkingIcon, ITSMIcon, FrontendIcon,
  FinanceIcon, ManagementIcon, LogisticsIcon,
  ArrowRightIcon
} from "../components/Icons";

const fieldIcons = {
  cybersecurity: CybersecurityIcon, "cloud-engineering": CloudIcon,
  devops: DevOpsIcon, "data-science": DataScienceIcon,
  "backend-development": BackendIcon, networking: NetworkingIcon,
  itsm: ITSMIcon, "frontend-development": FrontendIcon,
  "finance-accounting": FinanceIcon, management: ManagementIcon,
  "logistics-supply-chain": LogisticsIcon,
};

export default function Home() {
  const [activeSlug, setActiveSlug] = useState("cybersecurity");
  const { isOnboarded, profile, xp, level } = useProgress();

  const activeField = fields.find((f) => f.slug === activeSlug) || fields[0];
  const activeCerts = certifications[activeSlug] || [];
  const activeJobs = jobs.filter((j) => j.fieldId === activeField.id);
  const totalCerts = Object.values(certifications).flat().length;
  const fieldName = isOnboarded ? fields.find((f) => f.slug === profile?.field)?.name || "career" : "";
  const activeColor = getFieldColor(activeSlug);

  const salaryMin = activeJobs.length > 0 ? Math.min(...activeJobs.map((j) => j.salaryMin)) : 0;
  const salaryMax = activeJobs.length > 0 ? Math.max(...activeJobs.map((j) => j.salaryMax)) : 0;

  const fieldsReveal = useScrollReveal({ threshold: 0.1 });
  const jobsReveal = useScrollReveal({ threshold: 0.1 });

  // For the node map
  const fieldSkills = skills.filter(s => s.fieldIds.includes(activeSlug));
  const skillIds = fieldSkills.map(s => s.id);
  const fieldLessons = lessons.filter(l => skillIds.includes(l.skillId));

  const certStages = activeCerts.reduce((acc, cert) => {
    const stageName = cert.stageName || "Foundation";
    if (!acc[stageName]) acc[stageName] = [];
    acc[stageName].push(cert);
    return acc;
  }, {});
  const stageNames = Object.keys(certStages);

  return (
    <div className="min-h-screen selection:bg-rust selection:text-white relative overflow-hidden bg-[#f5f3ef]">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative z-10 pt-16 pb-8 lg:pt-20 lg:pb-16 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative">
          <div className="animate-fade-in-up">
            {isOnboarded ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-rust">Welcome back</span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">LVL {level}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-ink tracking-tight">
                  Keep building <br />
                  <span className="text-rust">your {fieldName} path.</span>
                </h1>
                <div className="mt-10 flex items-center gap-8">
                  <Link to="/dashboard" className="bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200 inline-flex items-center gap-3">
                    Go to dashboard <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                  <p className="font-sans text-sm text-pencil"><strong className="text-arcade drop-shadow-[0_2px_8px_rgba(255,176,32,0.3)]">{xp} XP</strong> earned</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-rust">WSB Merito Students</span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">Edition 2026</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-ink tracking-tight">
                  From classroom <br />
                  <span className="text-rust">to industry.</span>
                </h1>
                <p className="mt-8 max-w-lg text-base md:text-lg text-pencil font-normal leading-relaxed">
                  Tell us your major and semester. We'll build you a personalized path with interactive lessons, certifications, and real job opportunities.
                </p>
                <div className="mt-10 flex items-center gap-8">
                  <Link to="/onboarding" className="bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200 inline-flex items-center gap-3">
                    Start your path <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                  <div className="font-sans text-sm text-pencil">Takes ~30 seconds. No account needed.</div>
                </div>
              </>
            )}
          </div>
          <div className="relative animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <HomepageLesson />
          </div>
        </div>
      </section>

      {/* ═══════════════════ BENTO GRID ═══════════════════ */}
      <section className="relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-14 lg:py-20">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="font-sans text-3xl lg:text-4xl font-bold text-ink tracking-tight">
              Everything you need to launch your career
            </h2>
            <p className="mt-3 text-base text-pencil max-w-xl mx-auto">
              Interactive lessons, real certifications, and student jobs — all in one platform.
            </p>
          </div>
          <BentoGrid />
        </div>
      </section>

      {/* ═══════════════════ INTERACTIVE FIELD EXPLORER ═══════════════════ */}
      <section ref={fieldsReveal.ref} className="relative z-10 py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 lg:mb-14 gap-8 border-b border-ink/8 pb-8">
            <div>
              <h2 className="font-sans text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[0.9]">Find your field</h2>
              <p className="mt-4 text-pencil max-w-md text-sm md:text-base">Explore learning paths designed for the most in-demand careers in tech and business.</p>
            </div>
            <div className="flex gap-8 font-sans text-xs font-semibold uppercase tracking-wide text-pencil text-right shrink-0">
              <div><strong className="block text-2xl font-bold text-ink mb-1">{fields.length}</strong> Fields</div>
              <div><strong className="block text-2xl font-bold text-ink mb-1">{totalCerts}</strong> Certifications</div>
            </div>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${fieldsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>

            {/* Left Side: Tactile Field List */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {fields.map((field) => {
                const isActive = activeSlug === field.slug;
                const Icon = fieldIcons[field.slug];
                const color = getFieldColor(field.slug);
                return (
                  <button
                    key={field.slug}
                    onMouseEnter={() => setActiveSlug(field.slug)}
                    onClick={() => setActiveSlug(field.slug)}
                    className={`text-left group relative flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 border-[1.5px] ${isActive
                        ? 'bg-[#fdfcfa] shadow-[0_2px_0_0_rgba(0,0,0,0.06)]'
                        : 'border-transparent hover:bg-white/40 hover:border-ink/5'
                      }`}
                    style={isActive ? { borderColor: color.accent, color: color.accent } : { color: 'inherit' }}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-[#fdfcfa]' : 'bg-ink/[0.03] text-pencil group-hover:bg-ink/[0.05]'
                        }`} style={isActive ? { backgroundColor: `${color.accent}15`, color: color.accent } : {}}>
                        {Icon && <Icon className="w-5 h-5" />}
                      </div>
                      <span className={`font-sans text-base tracking-tight transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium text-ink/70 group-hover:text-ink'
                        }`}>
                        {field.name}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#fdfcfa] border-[1.5px] shadow-sm animate-fade-in" style={{ borderColor: color.accent }}>
                        <ArrowRightIcon className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Side: Interactive Node Map */}
            <div className="lg:col-span-7 relative">
              <div
                className="bg-[#fdfcfa] rounded-2xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] p-8 lg:p-10 flex flex-col min-h-[520px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(0,0,0,0.06)]"
              >
                <div key={activeSlug} className="animate-fade-in-up flex-1 flex flex-col">

                  {/* Header */}
                  <div className="flex justify-between items-start mb-10 pb-8 border-b border-ink/8">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor.accent }} />
                        <span className="font-sans text-xs font-bold uppercase tracking-widest" style={{ color: activeColor.accent }}>{activeField.name}</span>
                      </div>
                      <h3 className="font-sans text-2xl font-bold text-ink mb-3 leading-tight tracking-tight">The Roadmap</h3>
                      <p className="text-sm text-pencil max-w-[280px] leading-relaxed mb-6">{activeField.description}</p>
                      <Link to={`/fields/${activeSlug}`} className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-sans text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-offset-2"
                        style={{ backgroundColor: activeColor.accent, outlineColor: activeColor.accent }}>
                        Explore roadmap
                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                    <div className="text-right shrink-0 bg-[#fdfcfa] border-[1.5px] border-ink/10 shadow-sm rounded-xl p-4">
                      <span className="block font-sans text-xs font-bold uppercase tracking-wider text-pencil mb-1">Market Value</span>
                      <span className="font-mono text-xl font-bold text-ink">
                        {salaryMax > 0 ? `${(salaryMin / 1000).toFixed(0)}k–${(salaryMax / 1000).toFixed(0)}k` : 'Var'}
                      </span>
                      <span className="block font-sans text-xs text-pencil mt-1">PLN / month</span>
                    </div>
                  </div>

                  {/* The Node Map -> Vertical Timeline */}
                  <div className="flex-1 flex flex-col justify-center py-4 pr-2 pl-4">
                    <div className="relative border-l-[2px] border-dashed ml-3 space-y-8" style={{ borderColor: `${activeColor.accent}40` }}>
                      {/* Timeline Items */}
                      {stageNames.map((stageName, stageIdx) => (
                        <div key={stageName} className="relative">
                          {/* Stage Dot */}
                          <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#fdfcfa] border-[2px]" style={{ borderColor: activeColor.accent }} />

                          <div className="pl-6">
                            <span className="font-sans text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: activeColor.accent }}>{stageName} Stage</span>

                            <div className="space-y-3">
                              {certStages[stageName].slice(0, 2).map((cert) => (
                                <a key={cert.id} href={cert.url} target="_blank" rel="noopener noreferrer" className="group block bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-xl p-4 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20 hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] transition-all duration-200">
                                  <div className="flex justify-between items-start gap-4">
                                    <div>
                                      <h4 className="font-sans text-sm font-bold text-ink leading-tight group-hover:text-rust transition-colors">{cert.name}</h4>
                                      <p className="font-sans text-xs text-pencil mt-1">{cert.provider} · <span className="font-mono">{cert.costPln > 0 ? `${cert.costPln.toLocaleString()} PLN` : 'Free'}</span></p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="inline-block px-1.5 py-0.5 rounded border border-ink/10 font-sans text-xs font-bold uppercase tracking-wider text-pencil bg-ink/5">
                                          {cert.difficulty}
                                        </span>
                                        <span className="font-mono text-xs text-pencil">{cert.durationWeeks}W</span>
                                      </div>
                                      {cert.examCode && (
                                        <span className="font-mono text-xs text-pencil">{cert.examCode}</span>
                                      )}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>

                            {/* Insert a lesson after the stage */}
                            {stageIdx < 2 && fieldLessons[stageIdx] && (
                              <div className="mt-6 -ml-3 pl-3 border-l-[2px] border-transparent">
                                <Link to={`/skills/${fieldLessons[stageIdx].skillId}/${fieldLessons[stageIdx].id}`} className="group block bg-[#fdfcfa] border-[1.5px] border-ink/5 rounded-xl p-3 hover:bg-[#fdfcfa] hover:border-ink/15 hover:shadow-[0_2px_0_0_rgba(0,0,0,0.06)] transition-all duration-200">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200" style={{ backgroundColor: `${activeColor.accent}15`, color: activeColor.accent }}>
                                      <svg className="w-3.5 h-3.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-pencil">Interactive Lesson</span>
                                      </div>
                                      <h4 className="font-sans text-xs font-bold text-ink mt-0.5 group-hover:text-rust transition-colors">{fieldLessons[stageIdx].title}</h4>
                                    </div>
                                    <span className="font-mono text-xs text-pencil shrink-0">~{fieldLessons[stageIdx].estimatedMinutes}m</span>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Career Outcomes at bottom of timeline */}
                      <div className="relative pt-2">
                        <div className="absolute -left-[23px] top-4 w-3 h-3 rounded-full bg-[#fdfcfa] border-[2px]" style={{ borderColor: activeColor.accent }} />
                        <div className="pl-6">
                          <span className="font-sans text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: activeColor.accent }}>Career Outcomes</span>
                          <div className="flex flex-wrap gap-2">
                            {activeJobs.slice(0, 3).map(job => (
                              <a key={job.id} href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="group bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-lg px-3 py-2 flex items-center gap-2 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20 hover:-translate-y-0.5 transition-all duration-200">
                                {job.source === "LinkedIn" && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2" className="shrink-0">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                  </svg>
                                )}
                                <span className="font-sans text-xs font-bold text-ink group-hover:text-rust transition-colors">{job.title}</span>
                                <span className="font-mono text-xs text-pencil">{(job.salaryMin / 1000).toFixed(1)}k–{(job.salaryMax / 1000).toFixed(1)}k</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer / CTA */}
                <div className="mt-8 pt-6 border-t border-ink/8 flex justify-center items-center">
                  <div className="font-sans text-xs font-medium text-pencil">
                    <strong className="text-ink">{activeCerts.length}</strong> certs <span className="mx-1.5 opacity-40">&middot;</span> <strong className="text-ink">{fieldLessons.length}</strong> lessons <span className="mx-1.5 opacity-40">&middot;</span> <strong className="text-ink">{activeJobs.length}</strong> jobs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ JOBS ═══════════════════ */}
      {activeJobs.length > 0 && (
        <section ref={jobsReveal.ref} className="relative z-10 py-16 lg:py-20">
          <div className={`max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${jobsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 pb-8 border-b border-ink/8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-rust">Hiring now</span>
                <h2 className="mt-3 font-sans text-3xl lg:text-4xl font-bold text-ink tracking-tight leading-none">Jobs for students</h2>
              </div>
              <Link to="/jobs" className="font-sans text-sm font-bold text-rust hover:text-rust/80 transition-colors flex items-center gap-2">
                View all {jobs.length} jobs <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeJobs.slice(0, 6).map((job, i) => {
                return (
                  <a
                    key={job.id}
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                    style={{
                      opacity: jobsReveal.isVisible ? 1 : 0,
                      transform: jobsReveal.isVisible ? "translateY(0)" : "translateY(16px)",
                      transition: `all 500ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className={`inline-block rounded border px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-wider ${job.type === "Internship" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                        {job.type}
                      </span>
                      <span className="font-mono text-sm font-bold text-ink shrink-0">
                        {(job.salaryMin / 1000).toFixed(1)}k–{(job.salaryMax / 1000).toFixed(1)}k <span className="text-xs text-pencil uppercase tracking-wider ml-0.5">PLN</span>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-ink leading-tight mb-1.5 group-hover:text-rust transition-colors">{job.title}</h3>
                    <p className="text-sm font-medium text-pencil mb-5">{job.company}</p>

                    <div className="pt-4 border-t border-ink/8 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {job.source === "LinkedIn" && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2" className="shrink-0">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        )}
                        <span className="text-xs font-semibold text-pencil uppercase tracking-wider">{job.location}</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-pencil/40 group-hover:text-rust transition-colors">
                        <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ THE ADMISSION TICKET CTA ═══════════════════ */}
      <section className="relative z-10 py-24 lg:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          {/* The Ticket Container */}
          <div className="relative bg-[#fdfcfa] border-[2px] border-dashed border-ink/20 rounded-2xl p-10 md:p-14 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden transition-transform duration-500 hover:-translate-y-1">

            {/* Ticket Cutouts */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 bg-[#f5f3ef] border-r-[2px] border-dashed border-ink/20 rounded-full" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 bg-[#f5f3ef] border-l-[2px] border-dashed border-ink/20 rounded-full" />

            {/* Ticket Content */}
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-rust/5 text-rust border-[1.5px] border-rust/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h2 className="font-sans text-4xl md:text-5xl font-bold text-ink tracking-tight mb-5">
                Ready to start your path?
              </h2>
              <p className="font-sans text-base md:text-lg text-pencil max-w-md mx-auto mb-10 leading-relaxed">
                Join WSB Merito students building real skills, earning industry certifications, and landing top jobs.
              </p>

              <Link to={isOnboarded ? "/dashboard" : "/onboarding"} className="bg-rust text-white rounded-xl px-10 py-4 font-sans text-sm md:text-base font-bold inline-flex items-center gap-3 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(240,86,46,0.25)] transition-all duration-300">
                {isOnboarded ? "Continue learning" : "Enroll now — it's free"}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>

            {/* Ticket Footer / Stub */}
            <div className="mt-14 pt-6 border-t-[2px] border-dashed border-ink/10 flex items-center justify-between text-left font-mono text-xs text-pencil">
              <div>
                <span className="block font-bold text-pencil mb-1">ISSUED TO</span>
                <span className="font-semibold text-ink">WSB Merito Student</span>
              </div>
              <div>
                <span className="block font-bold text-pencil mb-1">VALID FOR</span>
                <span className="font-semibold text-ink">EduTech Masters '26</span>
              </div>
              <div className="hidden sm:block text-right">
                <span className="block font-bold text-pencil mb-1">PRICE</span>
                <span className="font-semibold text-ink">0.00 PLN</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
