import { useParams, Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";
import { getFieldColor } from "../data/fieldColors";
import StageCard from "../components/StageCard";
import useScrollReveal from "../hooks/useScrollReveal";
import {
  CybersecurityIcon,
  CloudIcon,
  DevOpsIcon,
  DataScienceIcon,
  BackendIcon,
  NetworkingIcon,
  ITSMIcon,
  FrontendIcon,
  FinanceIcon,
  ManagementIcon,
  LogisticsIcon,
  ArrowRightIcon,
  CheckIcon,
  TrendUpIcon,
  StageIcon,
  BriefcaseIcon,
  ClockIcon
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

const stageNames = {
  1: "Foundation",
  2: "Associate",
  3: "Professional",
  4: "Expert",
};

function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className="transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Roadmap() {
  const { slug } = useParams();
  const field = fields.find((f) => f.slug === slug);

  if (!field) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-sans text-3xl font-medium text-ink">Field not found</h1>
        <Link
          to="/explore"
          className="mt-4 inline-block font-sans text-sm font-semibold text-rust hover:underline"
        >
          Back to fields
        </Link>
      </div>
    );
  }

  const color = getFieldColor(slug);
  const Icon = fieldIcons[slug];

  const fieldCerts = certifications[slug] || [];
  const fieldJobs = jobs.filter((j) => j.fieldId === field.id);

  // Group certs by stage
  const stages = {};
  fieldCerts.forEach((cert) => {
    if (!stages[cert.stage]) stages[cert.stage] = [];
    stages[cert.stage].push(cert);
  });
  const stageNums = Object.keys(stages)
    .map(Number)
    .sort((a, b) => a - b);

  // Total duration estimate
  const totalMonths = Math.round(
    fieldCerts.reduce((sum, c) => sum + c.durationWeeks, 0) / 4
  );

  // Salary range from jobs data
  const salaryMin = fieldJobs.length > 0
    ? Math.min(...fieldJobs.map((j) => j.salaryMin))
    : null;
  const salaryMax = fieldJobs.length > 0
    ? Math.max(...fieldJobs.map((j) => j.salaryMax))
    : null;

  return (
    <section className="py-6 md:py-8 selection:bg-ink selection:text-white">
      {/* Breadcrumbs */}
      <nav className="mb-10 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
        <ol className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-pencil">
          <li>
            <Link to="/" className="transition-colors hover:text-ink">Home</Link>
          </li>
          <li className="opacity-40">/</li>
          <li>
            <Link to="/explore" className="transition-colors hover:text-ink">Explore</Link>
          </li>
          <li className="opacity-40">/</li>
          <li style={{ color: color.accent }}>{field.name}</li>
        </ol>
      </nav>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div 
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shrink-0 border-[1.5px] shadow-sm transition-transform hover:scale-105" 
          style={{ backgroundColor: `${color.accent}10`, borderColor: `${color.accent}30`, color: color.accent }}
        >
          {Icon && <Icon className="w-8 h-8 md:w-10 md:h-10" />}
        </div>
        <div>
          <span className="font-sans text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: color.accent }}>
            Certification Roadmap
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.1]">
            {field.name}
          </h1>
          <p className="mt-4 text-base md:text-lg text-pencil leading-relaxed font-medium max-w-3xl">
            {field.description}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <StageIcon className="w-5 h-5 mb-4 opacity-50" style={{ color: color.accent }} />
          <div>
            <span className="block font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-1">Stages</span>
            <span className="font-mono text-2xl font-bold text-ink">{stageNums.length}</span>
          </div>
        </div>
        <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <CheckIcon className="w-5 h-5 mb-4 opacity-50" style={{ color: color.accent }} />
          <div>
            <span className="block font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-1">Certifications</span>
            <span className="font-mono text-2xl font-bold text-ink">{fieldCerts.length}</span>
          </div>
        </div>
        <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <BriefcaseIcon className="w-5 h-5 mb-4 opacity-50" style={{ color: color.accent }} />
          <div>
            <span className="block font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-1">Matching Jobs</span>
            <span className="font-mono text-2xl font-bold text-ink">{fieldJobs.length}</span>
          </div>
        </div>
        <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all">
          <ClockIcon className="w-5 h-5 mb-4 opacity-50" style={{ color: color.accent }} />
          <div>
            <span className="block font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-1">Est. Timeline</span>
            <span className="font-mono text-2xl font-bold text-ink">~{totalMonths}<span className="text-sm text-pencil font-semibold ml-1">mo</span></span>
          </div>
        </div>
      </div>

      {/* Salary & Outcomes Box */}
      {salaryMin !== null && salaryMax !== null && (
        <div 
          className="mb-16 bg-[#fdfcfa] border-[1.5px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up" 
          style={{ animationDelay: "300ms", borderColor: `${color.accent}30` }}
        >
          <div>
            <span className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest mb-2" style={{ color: color.accent }}>
              <TrendUpIcon className="w-4 h-4" /> Market Value Estimate
            </span>
            <h3 className="font-sans text-3xl md:text-4xl font-bold text-ink tracking-tight">
              {(salaryMin / 1000).toFixed(0)}k – {(salaryMax / 1000).toFixed(0)}k <span className="text-lg text-pencil font-semibold">PLN/mo</span>
            </h3>
            <p className="font-sans text-sm text-pencil mt-1.5 font-medium">
              Based on {fieldJobs.length} active entry-level and junior positions in Poland.
            </p>
          </div>
          <Link to="/jobs" className="shrink-0 bg-ink text-white rounded-xl px-6 py-3.5 font-sans text-sm font-bold inline-flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300">
            View {fieldJobs.length} Jobs <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Timeline / Stages Section */}
      <div className="relative max-w-3xl mx-auto custom-roadmap-stages pt-4 pb-12">
        <style>{`
          .custom-roadmap-stages .rounded-full.border-2 {
            background-color: #f5f3ef;
            border-color: ${color.accent}40 !important;
            color: ${color.accent} !important;
          }
          .custom-roadmap-stages .bg-rust {
            background-color: ${color.accent} !important;
            box-shadow: 0 0 0 4px ${color.accent}15;
          }
          /* Align CertCards nicely next to the vertical line */
          .custom-roadmap-stages > .relative > div > div > .pl-4 {
            padding-left: 56px !important;
          }
        `}</style>
        
        {/* The dashed vertical line */}
        <div 
          className="absolute left-[22px] top-[40px] bottom-[40px] w-[2px] border-l-[2px] border-dashed z-0" 
          style={{ borderColor: `${color.accent}30` }} 
        />

        <div className="flex flex-col gap-16 relative z-10">
          {stageNums.map((num, i) => (
            <RevealOnScroll key={num} delay={i * 100}>
              <div className="relative group">
                <StageCard
                  stageNum={num}
                  stageName={stageNames[num]}
                  certs={stages[num]}
                  fieldSlug={slug}
                  isActive={num === 1}
                />
              </div>
            </RevealOnScroll>
          ))}

          {/* Career Outcomes — real jobs */}
          {fieldJobs.length > 0 && (
            <RevealOnScroll delay={stageNums.length * 100}>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pencil/30 text-pencil font-sans text-base font-medium">
                    <BriefcaseIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-sans text-xs uppercase tracking-wide text-pencil">Your Goal</span>
                    <span className="block font-sans text-xl font-semibold text-ink">Career Outcomes</span>
                    <span className="block font-mono text-xs tracking-wide text-pencil">{fieldJobs.length} live positions</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pl-4">
                  {fieldJobs.slice(0, 6).map((job) => (
                    <a
                      key={job.id}
                      href={job.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border-[1.5px] border-ink/12 bg-card shadow-[0_2px_0_0_rgba(0,0,0,0.06)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-sans text-base font-semibold text-ink group-hover:text-rust transition-colors truncate">
                            {job.title}
                          </h4>
                          <span className={`shrink-0 inline-block border px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${job.type === "Working Student" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                            {job.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm text-pencil font-medium">{job.company}</span>
                          <span className="text-ink/20">·</span>
                          <span className="font-sans text-sm text-pencil">{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-sm font-bold text-ink">
                          {(job.salaryMin / 1000).toFixed(1)}k–{(job.salaryMax / 1000).toFixed(1)}k
                        </span>
                        {job.source === "LinkedIn" && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2" className="shrink-0">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        )}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-pencil/40 group-hover:text-rust transition-colors">
                          <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </a>
                  ))}

                  {fieldJobs.length > 6 && (
                    <Link
                      to="/jobs"
                      className="mt-2 inline-flex items-center gap-2 font-sans text-sm font-bold transition-colors hover:opacity-80 ml-1"
                      style={{ color: color.accent }}
                    >
                      View all {fieldJobs.length} positions
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div 
        className="mt-12 relative overflow-hidden rounded-2xl border-[1.5px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] bg-[#fdfcfa] p-10 md:p-14 text-center animate-fade-in-up hover:-translate-y-1 transition-transform duration-500" 
        style={{ animationDelay: `${Math.min(stageNums.length * 100 + 400, 800)}ms`, borderColor: `${color.accent}30` }}
      >
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" style={{ color: color.accent }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-current opacity-[0.03] rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" style={{ color: color.accent }} />
        
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-[1.5px] shadow-sm" style={{ backgroundColor: `${color.accent}10`, borderColor: `${color.accent}30`, color: color.accent }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
            Ready to start your journey?
          </h2>
          <p className="mx-auto max-w-lg text-base md:text-lg leading-relaxed text-pencil mb-8">
            Sign up to save your progress, track your certifications, and unlock personalized job matches tailored to your new skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/onboarding"
              className="text-white rounded-xl px-8 py-3.5 font-sans text-sm font-bold hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-200 inline-block"
              style={{ backgroundColor: color.accent }}
            >
              Start your path
            </Link>
            <Link 
              to="/onboarding" 
              className="font-sans text-sm font-bold px-8 py-3.5 rounded-xl border-[1.5px] border-ink/10 text-ink hover:bg-ink/[0.02] transition-colors"
            >
              Take the path quiz
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
