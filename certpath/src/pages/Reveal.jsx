import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fields, certifications, jobs, skills, lessons } from "../data/mock";
import { programs } from "../data/programs";
import { getFieldColor } from "../data/fieldColors";
import useProgress from "../hooks/useProgress";
import {
  CybersecurityIcon, CloudIcon, DevOpsIcon, DataScienceIcon,
  BackendIcon, NetworkingIcon, ITSMIcon, FrontendIcon,
  FinanceIcon, ManagementIcon, LogisticsIcon, ArrowRightIcon
} from "../components/Icons";

const fieldIcons = {
  cybersecurity: CybersecurityIcon, "cloud-engineering": CloudIcon,
  devops: DevOpsIcon, "data-science": DataScienceIcon,
  "backend-development": BackendIcon, networking: NetworkingIcon,
  itsm: ITSMIcon, "frontend-development": FrontendIcon,
  "finance-accounting": FinanceIcon, management: ManagementIcon,
  "logistics-supply-chain": LogisticsIcon,
};

function getYears(t) {
  return [
    { id: "1", label: t("onboarding.1stYear") }, { id: "2", label: t("onboarding.2ndYear") },
    { id: "3", label: t("onboarding.3rdYear") }, { id: "4", label: t("onboarding.4thYear") },
    { id: "5", label: t("onboarding.5thYear") },
  ];
}

function getStageNames(t) {
  return { 1: t("reveal.stageFoundation"), 2: t("reveal.stageAssociate"), 3: t("reveal.stageProfessional"), 4: t("reveal.stageExpert") };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Animated count-up                                                   */
/* ──────────────────────────────────────────────────────────────────── */
function useCountUpLocal(target, duration = 900, shouldStart = true) {
  const [val, setVal] = useState(0);
  const frame = useRef(null);
  useEffect(() => {
    if (!shouldStart || typeof target !== "number" || target === 0) return;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration, shouldStart]);
  return val;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Animated hero SVG — abstract path visualization                     */
/* ──────────────────────────────────────────────────────────────────── */
function PathHeroSVG({ stageCount, fieldColor = "#DF5433", stageNames }) {
  // We align this with the "Roadmap" visual style from Dashboard
  return (
    <svg viewBox="0 0 800 160" className="w-full h-auto" style={{ maxWidth: 800 }}>
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={fieldColor} stopOpacity="0.1" />
          <stop offset="100%" stopColor={fieldColor} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Background dashed line */}
      <path
        d="M 40 100 C 120 100, 160 40, 260 40 S 400 120, 520 80 S 680 40, 760 60"
        fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-ink/10"
      />
      {/* Animated reveal path */}
      <path
        d="M 40 100 C 120 100, 160 40, 260 40 S 400 120, 520 80 S 680 40, 760 60"
        fill="none" stroke="url(#pathGrad)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray="1000" strokeDashoffset="1000"
        style={{ animation: "drawRevealPath 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards" }}
      />
      <path
        d="M 40 100 C 120 100, 160 40, 260 40 S 400 120, 520 80 S 680 40, 760 60"
        fill="none" stroke={fieldColor} strokeWidth="3" strokeLinecap="round"
        strokeDasharray="1000" strokeDashoffset="1000"
        style={{ animation: "drawRevealPath 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards" }}
      />
      
      {/* Stage milestone dots — appear sequentially */}
      {[
        { cx: 40, cy: 100 },
        { cx: 260, cy: 40 },
        { cx: 520, cy: 80 },
        { cx: 760, cy: 60 },
      ].slice(0, stageCount).map((pt, i) => (
        <g key={i}>
          {/* Pulse ring outer */}
          <circle cx={pt.cx} cy={pt.cy} r="24" fill={fieldColor} opacity="0.05"
            style={{ animation: `pulseRing 2.5s ease-in-out ${1 + i * 0.4}s infinite` }}
          />
          {/* Inner ring */}
          <circle cx={pt.cx} cy={pt.cy} r="16" fill={fieldColor} opacity="0.1"
            style={{ animation: `pulseRingInner 2.5s ease-in-out ${1.1 + i * 0.4}s infinite` }}
          />
          {/* Solid dot container */}
          <circle cx={pt.cx} cy={pt.cy} r="12" fill="#fdfcfa" stroke={fieldColor} strokeWidth="2.5"
            style={{ opacity: 0, animation: `dotAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.8 + i * 0.4}s forwards` }}
          />
          {/* Stage label text */}
          <text x={pt.cx} y={pt.cy + 1.5} textAnchor="middle" dominantBaseline="central"
            fill={fieldColor} fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif"
            style={{ opacity: 0, animation: `dotAppear 0.5s ease-out ${0.9 + i * 0.4}s forwards` }}
          >
            {i + 1}
          </text>
          {/* Stage name below */}
          <text x={pt.cx} y={pt.cy + 34} textAnchor="middle" fill="#6b7280"
            fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.05em" className="uppercase"
            style={{ opacity: 0, animation: `dotAppear 0.5s ease-out ${1 + i * 0.4}s forwards` }}
          >
            {Object.values(stageNames)[i]}
          </text>
        </g>
      ))}
      <style>{`
        @keyframes drawRevealPath { to { stroke-dashoffset: 0; } }
        @keyframes dotAppear { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
        @keyframes pulseRing { 0%,100% { r:24; opacity:0.05; } 50% { r:32; opacity:0.02; } }
        @keyframes pulseRingInner { 0%,100% { r:16; opacity:0.1; } 50% { r:20; opacity:0.04; } }
      `}</style>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Salary bar visualization                                            */
/* ──────────────────────────────────────────────────────────────────── */
function SalaryBar({ min, max, show, accent = "#DF5433" }) {
  const maxScale = 50000;
  const leftPct = (min / maxScale) * 100;
  const widthPct = ((max - min) / maxScale) * 100;
  return (
    <div className="mt-2">
      <div className="relative h-4 rounded-full bg-ink/5 overflow-hidden border-[1px] border-ink/5 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]"
          style={{
            background: `linear-gradient(90deg, ${accent}, #FFB020)`,
            left: `${leftPct}%`,
            width: show ? `${widthPct}%` : "0%",
            transition: "width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s",
          }}
        />
      </div>
      <div className="mt-3 flex justify-between">
        <span className="font-mono text-xs font-semibold text-pencil">0</span>
        <span className="font-mono text-xs font-semibold text-pencil">50k PLN/mo</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Stage card — clickable, rich                                        */
/* ──────────────────────────────────────────────────────────────────── */
function StageCard({ stageNum, certs, fieldSlug, delay, show, accent, stageNames, t }) {
  const name = stageNames[stageNum] || `Stage ${stageNum}`;
  const months = Math.round(certs.reduce((s, c) => s + c.durationWeeks, 0) / 4);
  const cost = certs.reduce((s, c) => s + c.costPln, 0);

  return (
    <Link
      to={`/fields/${fieldSlug}`}
      className="group block rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-[#fdfcfa] p-6 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 relative overflow-hidden"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/80 to-transparent pointer-events-none rounded-tr-xl" />
      
      {/* Stage header */}
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-mono text-lg font-bold shadow-sm"
          style={{ background: accent }}
        >
          {stageNum}
        </div>
        <div>
          <span className="block font-sans text-xl font-bold text-ink group-hover:text-ink/80 transition-colors tracking-tight">
            {name}
          </span>
          <span className="block font-mono text-xs font-bold text-pencil uppercase tracking-wider mt-0.5">
            ~{months} {t("reveal.months_short")}
          </span>
        </div>
      </div>

      {/* Cert list */}
      <div className="space-y-3 relative z-10 font-sans">
        {certs.map((cert) => (
          <div key={cert.id} className="flex items-start gap-3 p-3 rounded-lg border border-ink/5 bg-white/50 group-hover:bg-[#fdfcfa] transition-colors">
            <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{ background: accent }} />
            <div className="min-w-0">
              <span className="block text-sm font-bold text-ink">{cert.name}</span>
              <span className="block font-sans text-xs font-medium text-pencil mt-1">
                {cert.provider} <span className="mx-1 opacity-50">&middot;</span> {cert.costPln > 0 ? `${cert.costPln.toLocaleString("pl-PL")} PLN` : t("common.free")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-ink/8 flex items-center justify-between relative z-10">
        <span className="font-mono text-xs font-bold text-pencil uppercase tracking-wider">
          {cost > 0 ? `~${cost.toLocaleString("pl-PL")} PLN` : t("reveal.freeOverall")}
        </span>
        <span className="font-sans text-xs font-bold transition-all group-hover:opacity-100 flex items-center gap-1 opacity-0" style={{ color: accent }}>
          {t("reveal.viewDetails")} <ArrowRightIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Job card — clickable, visual                                        */
/* ──────────────────────────────────────────────────────────────────── */
function JobCard({ job, delay, show }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-[#fdfcfa] p-5 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col justify-between"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className={`inline-block rounded border px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider ${job.type === "Internship" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
          {job.type}
        </span>
        <span className="block font-mono text-base font-bold text-rust shrink-0">
          {(job.salaryMin / 1000).toFixed(0)}k–{(job.salaryMax / 1000).toFixed(0)}k <span className="text-xs text-pencil uppercase tracking-wider ml-0.5">PLN</span>
        </span>
      </div>
      <h3 className="font-sans text-lg font-bold text-ink leading-tight mb-2 group-hover:text-rust transition-colors truncate">
        {job.title}
      </h3>
      <p className="font-sans text-sm font-medium text-pencil mb-4">{job.company}</p>
      
      <div className="pt-4 border-t border-ink/8 flex items-center justify-between text-xs font-semibold text-pencil uppercase tracking-wider">
        <span>{job.location}</span>
        <span>{job.type}</span>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Loading phase                                                       */
/* ──────────────────────────────────────────────────────────────────── */
function LoadingPhase({ visible, fieldColor }) {
  const { t } = useTranslation();
  const messages = [
    t("reveal.analyzingMajor"),
    t("reveal.findingCerts"),
    t("reveal.matchingRoles"),
    t("reveal.generatingRoadmap"),
    t("reveal.finalizingPath"),
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 450); // fast switching
    return () => clearInterval(interval);
  }, [visible, messages.length]);

  return (
    <div className={[
      "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 px-6",
      visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98] pointer-events-none",
    ].join(" ")}>
      {/* Animated geometric builder */}
      <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-ink/20" style={{ animation: "spinSlow 12s linear infinite" }} />
        <div className="absolute inset-4 rounded-full border-[1.5px] border-ink/10" style={{ animation: "spinSlow 8s linear infinite reverse" }} />
        <div className="absolute inset-8 rounded-full border-[1px] border-ink/15" style={{ animation: "spinSlow 4s linear infinite" }} />
        
        <div className="absolute w-2 h-2 rounded-full" style={{ backgroundColor: fieldColor || '#F0562E', top: '10%', animation: "pulseDot 1.5s ease-in-out infinite" }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-ink/30" style={{ bottom: '20%', left: '15%', animation: "pulseDot 1.5s ease-in-out infinite 0.7s" }} />
        <div className="absolute w-3 h-3 rounded-full bg-ink" style={{ right: '10%', top: '40%', animation: "pulseDot 1.5s ease-in-out infinite 0.4s" }} />
        
        <div className="h-6 w-6 rounded-lg bg-ink shadow-lg" style={{ animation: "pulseCore 2s ease-in-out infinite" }} />
      </div>

      <div className="h-[2px] w-48 bg-ink/10 rounded-full overflow-hidden mb-8">
         <div className="h-full bg-ink rounded-full" style={{ width: '100%', animation: "loadingBar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite" }} />
      </div>

      <h2 className="font-sans text-3xl font-bold text-ink mb-4 tracking-tight">{t("reveal.buildingRoadmap")}</h2>
      <div className="overflow-hidden h-[24px]">
        <p className="text-base text-pencil font-medium font-sans text-center transition-transform duration-300"
           key={msgIdx} style={{ animation: "slideUpText 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both" }}>
          {messages[msgIdx]}
        </p>
      </div>
      
      <style>{`
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes pulseDot { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.5); opacity: 1; } }
        @keyframes pulseCore { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.1) rotate(45deg); } }
        @keyframes slideUpText { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes loadingBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Reveal page                                                         */
/* ──────────────────────────────────────────────────────────────────── */
export default function Reveal() {
  const { t } = useTranslation();
  const { profile, isOnboarded } = useProgress();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);
  const years = getYears(t);
  const stageNames = getStageNames(t);

  useEffect(() => {
    // Reveal length controls
    const timer = setTimeout(() => setPhase(2), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  const fieldObj = fields.find((f) => f.slug === profile.field);
  const FieldIcon = fieldIcons[profile.field];
  const fc = getFieldColor(profile.field);
  const accent = fc.accent;
  const fieldCerts = certifications[profile.field] || [];
  const fieldJobs = fieldObj ? jobs.filter((j) => j.fieldId === fieldObj.id) : [];
  const salaryMin = fieldJobs.length ? Math.min(...fieldJobs.map((j) => j.salaryMin)) : 0;
  const salaryMax = fieldJobs.length ? Math.max(...fieldJobs.map((j) => j.salaryMax)) : 0;

  const stages = {};
  fieldCerts.forEach((cert) => {
    if (!stages[cert.stage]) stages[cert.stage] = [];
    stages[cert.stage].push(cert);
  });
  const stageNums = Object.keys(stages).map(Number).sort((a, b) => a - b);

  const yearLabel = years.find((y) => y.id === profile.year)?.label || "";
  const ys = profile.year === "1" ? "st" : profile.year === "2" ? "nd" : profile.year === "3" ? "rd" : "th";
  const programLabel = programs.find((p) => p.id === profile.program)?.name || "";

  const firstSkill = skills.find((s) => s.fieldIds?.includes(profile.field));
  const firstLesson = firstSkill ? lessons.find((l) => l.skillId === firstSkill.id) : null;
  const firstLessonUrl = firstSkill && firstLesson ? `/skills/${firstSkill.slug}/${firstLesson.id}` : "/dashboard";

  const totalMonths = Math.round(fieldCerts.reduce((s, c) => s + c.durationWeeks, 0) / 4);

  const show = phase === 2;
  const stagesCount = useCountUpLocal(stageNums.length, 1000, show);
  const certsCount = useCountUpLocal(fieldCerts.length, 1200, show);
  const jobsCount = useCountUpLocal(fieldJobs.length, 1400, show);
  const monthsCount = useCountUpLocal(totalMonths, 1600, show);

  return (
    <div className="min-h-screen bg-[#f5f3ef] selection:bg-ink selection:text-white relative overflow-hidden flex flex-col justify-center">
      
      <LoadingPhase visible={phase === 1} fieldColor={accent} />

      <section className={[
        "w-full mx-auto max-w-[1240px] px-6 md:px-12 py-16 transition-all duration-1000",
        show ? "opacity-100" : "opacity-0 pointer-events-none scale-[0.98]",
      ].join(" ")}>

        {/* ═══════════════ HERO ═══════════════ */}
        <div className="text-center mb-10" style={{ animation: show ? "fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) both" : "none" }}>
          <div className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/10 bg-white/60 shadow-sm px-4 py-1.5 mb-6">
            {FieldIcon && <div className="w-5 h-5 flex items-center justify-center rounded-md" style={{ backgroundColor: `${accent}15`, color: accent }}><FieldIcon className="w-3.5 h-3.5" /></div>}
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-ink">
              {t("reveal.yourPersonalizedPath")}
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[80px] leading-[0.9] text-ink tracking-tight mb-6">
            {fieldObj?.name || "Your Path"}
          </h1>
          <p className="font-sans text-lg md:text-xl text-pencil font-medium max-w-2xl mx-auto">
            {t("reveal.tailoredFor", { year: `${profile.year}${ys}`, program: programLabel })}
          </p>
        </div>

        {/* ═══════════════ STATS BENTO ═══════════════ */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
          style={{ animation: show ? "fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both" : "none" }}
        >
          {[
            { value: stagesCount, label: t("reveal.stages"), suffix: "" },
            { value: certsCount, label: t("reveal.certificationsLabel"), suffix: "" },
            { value: jobsCount, label: t("reveal.jobsInPoland"), suffix: "+" },
            { value: monthsCount, label: t("reveal.months"), suffix: "mo" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-xl p-6 md:p-8 flex flex-col justify-center shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">
              <span className="font-mono text-4xl md:text-5xl font-bold text-ink mb-2 tracking-tighter">
                {stat.value}{stat.suffix}
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-pencil">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ═══════════════ ANIMATED PATH ═══════════════ */}
        <div className="mb-20 max-w-4xl mx-auto hidden md:block" style={{ animation: show ? "fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s both" : "none" }}>
          <PathHeroSVG stageCount={stageNums.length} fieldColor={accent} stageNames={stageNames} />
        </div>

        {/* ═══════════════ TWO COLUMNS: ROADMAP & CAREER ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          
          {/* Column 1: Roadmap */}
          <div style={{ animation: show ? "fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s both" : "none" }}>
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-ink/8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{t("reveal.stepByStep")}</span>
                <h2 className="font-sans text-3xl font-bold text-ink tracking-tight mt-2">{t("reveal.theRoadmap")}</h2>
              </div>
              <Link to={`/fields/${profile.field}`} className="font-sans text-sm font-bold transition-colors flex items-center gap-1.5" style={{ color: accent }}>
                {t("reveal.fullDetails")} <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {stageNums.map((num, idx) => (
                <StageCard
                  key={num}
                  stageNum={num}
                  certs={stages[num]}
                  fieldSlug={profile.field}
                  delay={800 + idx * 100}
                  show={show}
                  accent={accent}
                  stageNames={stageNames}
                  t={t}
                />
              ))}
            </div>
          </div>

          {/* Column 2: Jobs & Salary */}
          <div style={{ animation: show ? "fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.7s both" : "none" }}>
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-ink/8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-rust">{t("reveal.marketRealities")}</span>
                <h2 className="font-sans text-3xl font-bold text-ink tracking-tight mt-2">{t("reveal.careerOutlook")}</h2>
              </div>
              <Link to="/jobs" className="font-sans text-sm font-bold text-rust hover:text-rust/80 transition-colors flex items-center gap-1.5">
                {t("reveal.allJobs", { count: fieldJobs.length })} <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Salary Visualizer */}
            {salaryMin > 0 && (
              <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-8 mb-8" style={{ animation: show ? "fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 1s both" : "none" }}>
                <span className="block font-sans text-sm font-bold text-ink mb-1">{t("reveal.earningPotential")}</span>
                <span className="block font-sans text-xs text-pencil mb-5">{t("reveal.basedOnRoles", { field: fieldObj?.name })}</span>
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-mono text-3xl font-bold text-ink tracking-tighter">
                    {salaryMin.toLocaleString("pl-PL")}–{salaryMax.toLocaleString("pl-PL")}
                  </span>
                  <span className="font-sans text-sm font-semibold text-pencil pb-1">{t("reveal.plnMo")}</span>
                </div>
                <SalaryBar min={salaryMin} max={salaryMax} show={show} accent={accent} />
              </div>
            )}

            {/* Job listings */}
            <div className="grid grid-cols-1 gap-5">
              {fieldJobs.slice(0, 3).map((job, i) => (
                <JobCard key={job.id} job={job} delay={1100 + i * 150} show={show} />
              ))}
            </div>
          </div>

        </div>

        {/* ═══════════════ CTA TICKET ═══════════════ */}
        <div
          className="relative bg-[#fdfcfa] border-[2px] border-dashed border-ink/20 rounded-2xl p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden"
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 1.5s",
          }}
        >
          {/* Ticket Cutouts */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 bg-[#f5f3ef] border-r-[2px] border-dashed border-ink/20 rounded-full" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 bg-[#f5f3ef] border-l-[2px] border-dashed border-ink/20 rounded-full" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-4xl md:text-5xl font-bold text-ink tracking-tight mb-5">{t("reveal.readyToBegin")}</h3>
            <p className="font-sans text-lg text-pencil mb-10 leading-relaxed">
              {t("reveal.firstLessonDesc", { field: fieldObj?.name })}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={firstLessonUrl}
                className="w-full sm:w-auto text-white rounded-xl px-10 py-4 font-sans text-base font-bold inline-flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: accent, boxShadow: `0 8px 24px -6px ${accent}60` }}
              >
                {t("reveal.startFirstLesson")}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-[#fdfcfa] border border-ink/10 rounded-xl px-10 py-4 font-sans text-base font-bold text-ink hover:bg-ink/[0.02] transition-colors"
              >
                {t("reveal.skipToDashboard")}
              </Link>
            </div>
            
            <button
              onClick={() => navigate("/onboarding")}
              className="mt-8 font-sans text-sm font-semibold text-pencil underline underline-offset-4 hover:text-ink transition-colors"
            >
              {t("reveal.tryDifferentField")}
            </button>
          </div>
        </div>

      </section>
      
      {/* Global CSS for fadeInUp if needed, already provided by tailwind or previous files, 
          but adding it inline just in case so animations trigger correctly. */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
