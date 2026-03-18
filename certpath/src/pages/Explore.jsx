import { Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";
import { getFieldColor } from "../data/fieldColors";
import useScrollReveal from "../hooks/useScrollReveal";
import {
  CybersecurityIcon, CloudIcon, DevOpsIcon, DataScienceIcon,
  BackendIcon, NetworkingIcon, ITSMIcon, FrontendIcon,
  FinanceIcon, ManagementIcon, LogisticsIcon,
  ArrowRightIcon
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

export default function Explore() {
  return (
    <div className="py-8 md:py-12 selection:bg-rust selection:text-white">
      {/* Header Section */}
      <header className="mb-12 md:mb-16 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-pencil">
            <li>
              <Link to="/" className="transition-colors hover:text-rust">Home</Link>
            </li>
            <li className="opacity-40">/</li>
            <li className="text-rust">Explore Fields</li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-ink/8">
          <div className="max-w-2xl">
            <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.1]">
              Find the path that fits your ambition.
            </h1>
            <p className="mt-4 text-base md:text-lg text-pencil leading-relaxed font-medium">
              Each field comes with a curated roadmap of certifications, interactive lessons, and real job opportunities. Choose a direction to see how far you can go.
            </p>
          </div>
          <div className="shrink-0 flex gap-4 sm:gap-6 md:text-right font-sans text-xs font-semibold uppercase tracking-wider text-pencil">
            <div>
              <strong className="block text-2xl font-bold text-ink mb-1">{fields.length}</strong>
              Fields
            </div>
            <div>
              <strong className="block text-2xl font-bold text-ink mb-1">{jobs.length}</strong>
              Active Jobs
            </div>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field, i) => {
          const Icon = fieldIcons[field.slug];
          const color = getFieldColor(field.slug);
          const fieldCerts = certifications[field.slug] || [];
          const fieldJobs = jobs.filter((j) => j.fieldId === field.id);
          const months = Math.round(
            fieldCerts.reduce((sum, c) => sum + c.durationWeeks, 0) / 4
          );

          return (
            <RevealOnScroll key={field.id} delay={i * 60}>
              <Link
                to={`/fields/${field.slug}`}
                className="group block bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20 flex flex-col h-full relative overflow-hidden"
              >
                {/* Subtle top accent line */}
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 origin-left" 
                  style={{ backgroundColor: color.accent }} 
                />

                {/* Header & Icon */}
                <div className="flex items-start gap-4 mb-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300" 
                    style={{ backgroundColor: `${color.accent}15`, color: color.accent }}
                  >
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <div className="pt-0.5">
                    <h3 className="font-sans text-lg md:text-xl font-bold text-ink leading-tight group-hover:text-ink/80 transition-colors">
                      {field.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color.accent, opacity: 0.6 }} />
                      <span className="font-mono text-xs md:text-xs font-semibold text-pencil uppercase tracking-wider">
                        {fieldJobs.length > 0 ? `${fieldJobs.length} jobs available` : "Emerging field"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-pencil leading-relaxed flex-1 mb-8">
                  {field.description}
                </p>

                {/* Footer Metrics */}
                <div className="pt-5 border-t border-ink/8 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-5 text-xs font-medium text-pencil">
                    <div className="flex flex-col">
                      <span className="uppercase tracking-wider opacity-60 text-xs mb-0.5">Certs</span>
                      <strong className="text-ink font-mono text-sm">{fieldCerts.length}</strong>
                    </div>
                    <div className="w-px h-6 bg-ink/10" />
                    <div className="flex flex-col">
                      <span className="uppercase tracking-wider opacity-60 text-xs mb-0.5">Timeline</span>
                      <strong className="text-ink font-mono text-sm">{months > 0 ? `~${months}mo` : 'TBD'}</strong>
                    </div>
                  </div>
                  
                  <div 
                    className="w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300 group-hover:scale-110" 
                    style={{ borderColor: `${color.accent}30`, color: color.accent, backgroundColor: `${color.accent}10` }}
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          );
        })}
      </div>

      {/* Footer Note */}
      <div 
        className="mt-16 text-center animate-fade-in-up" 
        style={{ animationDelay: `${Math.min(fields.length * 60 + 200, 800)}ms` }}
      >
        <p className="font-sans text-sm font-medium text-pencil bg-[#fdfcfa] inline-flex items-center gap-3 px-6 py-3 rounded-full border-[1.5px] border-ink/10 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-rust animate-pulse" />
          No sign-up required. Choose a path to preview real outcomes.
        </p>
      </div>
    </div>
  );
}
