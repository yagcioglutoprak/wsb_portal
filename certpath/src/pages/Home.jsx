import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fields, certifications, jobs, lessons } from "../data/mock";
import useProgress from "../hooks/useProgress";
import useCountUp from "../hooks/useCountUp";
import useScrollReveal from "../hooks/useScrollReveal";
import HeroShowcase from "../components/HeroShowcase";
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

function StatItem({ target, label, started, suffix = "" }) {
  const { count, start } = useCountUp(target, 1200, false);
  useEffect(() => { if (started) start(); }, [started, start]);
  return (
    <div className="bg-card rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] p-5 flex flex-col items-start">
      <div className="flex items-baseline">
        <span className="font-sans text-3xl lg:text-4xl font-bold text-ink">{count}</span>
        {suffix && <span className="font-sans text-xl text-ink/40 ml-1">{suffix}</span>}
      </div>
      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil mt-2">{label}</span>
    </div>
  );
}

export default function Home() {
  const [activeSlug, setActiveSlug] = useState("cybersecurity");
  const { isOnboarded, profile, xp, level } = useProgress();

  const activeField = fields.find((f) => f.slug === activeSlug) || fields[0];
  const activeCerts = certifications[activeSlug] || [];
  const activeJobs = jobs.filter((j) => j.fieldId === activeField.id);
  const totalCerts = Object.values(certifications).flat().length;
  const fieldName = isOnboarded ? fields.find((f) => f.slug === profile?.field)?.name || "career" : "";

  const salaryMin = activeJobs.length > 0 ? Math.min(...activeJobs.map((j) => j.salaryMin)) : 0;
  const salaryMax = activeJobs.length > 0 ? Math.max(...activeJobs.map((j) => j.salaryMax)) : 0;

  const statsReveal = useScrollReveal({ threshold: 0.2 });
  const stepsReveal = useScrollReveal({ threshold: 0.1 });
  const fieldsReveal = useScrollReveal({ threshold: 0.1 });
  const jobsReveal = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="bg-paper min-h-screen selection:bg-rust selection:text-white relative overflow-hidden">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative z-10 pt-20 pb-12 lg:pt-24 lg:pb-20 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-10 lg:gap-14 relative">

          <div className="max-w-4xl animate-fade-in-up">
            {isOnboarded ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-rust">Welcome back</span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink/40">LVL {level}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-ink tracking-tight">
                  Keep building <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink to-rust/80">your {fieldName} path.</span>
                </h1>
                <div className="mt-14 flex items-center gap-8">
                  <Link to="/dashboard" className="bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200 inline-flex items-center gap-3">
                    Go to dashboard
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                  <p className="font-sans text-sm text-pencil">
                    <strong className="text-rust">{xp} XP</strong> earned
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-10">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-rust">WSB Merito Students</span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-ink/40">Edition 2026</span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-ink tracking-tight">
                  From classroom <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink to-rust/80">to industry.</span>
                </h1>
                <p className="mt-10 max-w-xl text-base md:text-lg text-ink/60 font-normal leading-relaxed">
                  Input your major and semester. We compile a bespoke trajectory of interactive modules, verifiable certifications, and vetted roles.
                </p>
                <div className="mt-14 flex items-center gap-8">
                  <Link to="/onboarding" className="bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200 inline-flex items-center gap-3">
                    Start your path
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="font-sans text-sm text-pencil">
                    Takes ~30 seconds. No account needed.
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <HeroShowcase />
          </div>

        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section ref={statsReveal.ref} className="relative z-10 bg-paper overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-16">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
             <StatItem target={fields.length} label="Fields" started={statsReveal.isVisible} />
             <StatItem target={totalCerts} label="Certifications" started={statsReveal.isVisible} />
             <StatItem target={jobs.length} label="Job listings" started={statsReveal.isVisible} />
             <StatItem target={lessons.length} label="Lessons" started={statsReveal.isVisible} />
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section ref={stepsReveal.ref} className="relative z-10 py-16 lg:py-24 bg-white border-b border-ink/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${stepsReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>

            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="sticky top-32">
                 <h2 className="font-sans text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-8 leading-[0.9]">
                   How it works
                 </h2>
                 <p className="text-base text-ink/60 font-normal max-w-md leading-relaxed">
                   A streamlined path from where you are now to where you want to be — personalized for your goals.
                 </p>
                 {!isOnboarded && (
                   <div className="mt-16 hidden lg:block">
                     <Link to="/onboarding" className="font-sans text-sm font-semibold text-rust hover:text-rust/80 transition-colors flex items-center gap-3">
                       Get started
                       <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                     </Link>
                   </div>
                 )}
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-12 relative">
              {[
                { n: "1", t: "Tell us about you", d: "You provide minimal inputs: your academic major, current semester, and latent interests. We process this to formulate a baseline." },
                { n: "2", t: "Get your roadmap", d: "Our system compiles a bespoke roadmap. It intertwines theoretical modules, vendor-specific certifications, and technical milestones." },
                { n: "3", t: "Learn and get hired", d: "Execute the plan through interactive, high-fidelity simulations. Prove competency, acquire certifications, and seamlessly transition into vetted market roles." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 group relative">
                   <div className="font-sans text-sm font-bold text-white bg-rust rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-1">{step.n}</div>
                   <div>
                     <h3 className="font-sans text-xl font-bold text-ink tracking-tight mb-3">{step.t}</h3>
                     <p className="text-base text-ink/60 font-normal leading-relaxed">{step.d}</p>
                   </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════ FIELD EXPLORER ═══════════════════ */}
      <section ref={fieldsReveal.ref} className="relative z-10 py-16 lg:py-24 bg-paper">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">

          <div className="flex flex-col lg:flex-row justify-between items-end mb-10 lg:mb-14 gap-12 border-b border-ink/10 pb-12">
            <div>
              <h2 className="font-sans text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[0.9]">
                Find your field
              </h2>
            </div>
            <div className="flex gap-16 font-sans text-xs font-semibold uppercase tracking-wide text-ink/40 text-right">
              <div><strong className="block text-2xl font-bold text-ink mb-2">{fields.length}</strong> Fields</div>
              <div><strong className="block text-2xl font-bold text-ink mb-2">{totalCerts}</strong> Certifications</div>
            </div>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${fieldsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>

            {/* Hover Menu */}
            <div className="lg:col-span-5 flex flex-col">
              {fields.map((field) => {
                const isActive = activeSlug === field.slug;
                const Icon = fieldIcons[field.slug];
                return (
                  <button
                    key={field.slug}
                    onMouseEnter={() => setActiveSlug(field.slug)}
                    onClick={() => setActiveSlug(field.slug)}
                    className={`text-left group relative flex items-center justify-between py-6 border-b border-ink/5 transition-colors ${isActive ? 'text-rust' : 'text-ink/40 hover:text-ink'}`}
                  >
                    <div className="flex items-center gap-6 relative z-10">
                      <span className={`transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'scale-110' : 'scale-100 opacity-50 group-hover:opacity-100'}`}>
                        {Icon && <Icon className="w-6 h-6" />}
                      </span>
                      <span className="font-sans text-2xl lg:text-3xl font-normal tracking-tight">
                        {field.name}
                      </span>
                    </div>
                    {isActive && (
                      <ArrowRightIcon className="w-5 h-5 animate-fade-in text-rust" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Content Pane */}
            <div className="lg:col-span-6 lg:col-start-7 relative">
               <div className="bg-card rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] p-6 lg:p-10 flex flex-col justify-between min-h-[550px] transition-all duration-300 hover:border-ink/20 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                 <div key={activeSlug} className="animate-fade-in-up">
                   <div className="flex justify-between items-start mb-10">
                     <div className="w-12 h-12 bg-rust/10 rounded-xl flex items-center justify-center text-rust">
                       {(() => { const I = fieldIcons[activeSlug]; return I ? <I className="w-6 h-6"/> : null; })()}
                     </div>
                   </div>

                   <h3 className="font-sans text-xl font-bold text-ink mb-6">{activeField.name}</h3>

                   <p className="text-base text-ink/60 font-normal leading-relaxed mb-12">
                     {activeField.description}
                   </p>

                   <div className="grid grid-cols-2 gap-8 mb-12 border-t border-ink/10 pt-8">
                     <div>
                       <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-pencil mb-3">Market Value</span>
                       <span className="font-sans text-3xl font-bold text-ink">
                         {salaryMax > 0 ? `${(salaryMin / 1000).toFixed(0)}k - ${(salaryMax / 1000).toFixed(0)}k` : 'Var'}
                       </span>
                     </div>
                     <div>
                       <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-pencil mb-3">Core Certs</span>
                       <div className="flex flex-col gap-3 mt-4">
                         {activeCerts.slice(0,3).map(c => (
                           <div key={c.id} className="text-sm font-medium text-ink flex items-center gap-3">
                             <div className="w-1 h-1 bg-rust/60 rounded-full"></div>
                             {c.name}
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>

                 <Link to={`/fields/${activeSlug}`} className="group inline-flex items-center justify-between w-full pt-8 border-t border-ink/10 font-sans text-sm font-semibold text-rust hover:text-rust/80 transition-colors">
                   Explore this field
                   <ArrowRightIcon className="w-4 h-4 transform transition-transform group-hover:translate-x-2" />
                 </Link>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════ JOBS ═══════════════════ */}
      {activeJobs.length > 0 && (
        <section ref={jobsReveal.ref} className="relative z-10 py-16 lg:py-24 bg-white border-y border-ink/5">
          <div className={`max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] ${jobsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-8 border-b border-ink/10 pb-10">
              <h2 className="font-sans text-4xl font-bold text-ink tracking-tight leading-none">Jobs hiring now</h2>
              <Link to="/jobs" className="font-sans text-sm font-semibold text-rust hover:text-rust/80 transition-colors flex items-center gap-2">
                View all {jobs.length} jobs <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 pb-6 font-sans text-xs font-semibold uppercase tracking-wide text-pencil border-b border-ink/10">
                <div className="col-span-6 md:col-span-5">Role / Company</div>
                <div className="col-span-3 hidden md:block">Location</div>
                <div className="col-span-2 hidden md:block">Type</div>
                <div className="col-span-6 md:col-span-2 text-right">Salary</div>
              </div>

              {/* Rows */}
              {activeJobs.slice(0, 5).map((job, idx) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="group grid grid-cols-12 gap-4 py-6 border-b border-ink/5 hover:bg-paper/30 transition-all items-center relative">
                  <div className="col-span-8 md:col-span-5 flex flex-col gap-1">
                    <span className="text-base font-semibold text-ink group-hover:text-rust transition-colors">{job.title}</span>
                    <span className="font-sans text-sm text-pencil">{job.company}</span>
                  </div>
                  <div className="col-span-3 hidden md:flex items-center">
                    <span className="font-sans text-sm text-ink/60">{job.location}</span>
                  </div>
                  <div className="col-span-2 hidden md:flex items-center">
                    <span className="font-sans text-xs font-medium bg-paper rounded-lg px-2.5 py-1">{job.type}</span>
                  </div>
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end text-right">
                    <span className="font-sans text-sm font-semibold text-ink">{(job.salaryMin/1000).toFixed(0)}k-{(job.salaryMax/1000).toFixed(0)}k</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ FOOTER CTA ═══════════════════ */}
      <section className="relative z-10 bg-ink py-20 lg:py-32 px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-16">
            Ready to start?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
             <Link to={isOnboarded ? "/dashboard" : "/onboarding"} className="bg-white text-ink rounded-xl px-8 py-3.5 font-sans text-sm font-semibold inline-flex items-center gap-3 hover:-translate-y-px transition-all duration-200">
               {isOnboarded ? "Continue learning" : "Start now"}
               <ArrowRightIcon className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
