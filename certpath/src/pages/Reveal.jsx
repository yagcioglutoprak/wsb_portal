import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { fields, certifications, jobs, skills, lessons } from "../data/mock";
import { programs } from "../data/programs";
import useProgress from "../hooks/useProgress";
import {
  CybersecurityIcon, CloudIcon, DevOpsIcon, DataScienceIcon,
  BackendIcon, NetworkingIcon, ITSMIcon, FrontendIcon,
  FinanceIcon, ManagementIcon, LogisticsIcon,
} from "../components/Icons";

const fieldIcons = {
  cybersecurity: CybersecurityIcon, "cloud-engineering": CloudIcon,
  devops: DevOpsIcon, "data-science": DataScienceIcon,
  "backend-development": BackendIcon, networking: NetworkingIcon,
  itsm: ITSMIcon, "frontend-development": FrontendIcon,
  "finance-accounting": FinanceIcon, management: ManagementIcon,
  "logistics-supply-chain": LogisticsIcon,
};

const years = [
  { id: "1", label: "1st year" }, { id: "2", label: "2nd year" },
  { id: "3", label: "3rd year" }, { id: "4", label: "4th year" },
  { id: "5", label: "5th year" },
];

const stageNames = { 1: "Foundation", 2: "Associate", 3: "Professional", 4: "Expert" };
const stageColors = ["#2856a6", "#3a6bc5", "#5a8ad0", "#7ba3dc"];

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
function PathHeroSVG({ stageCount, fieldColor = "#2856a6" }) {
  return (
    <svg viewBox="0 0 600 120" className="w-full h-auto" style={{ maxWidth: 560 }}>
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={fieldColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={fieldColor} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Animated winding path */}
      <path
        d="M 30 90 C 100 90, 120 30, 200 30 S 320 90, 400 60 S 500 20, 570 30"
        fill="none" stroke="url(#pathGrad)" strokeWidth="28" strokeLinecap="round"
      />
      <path
        d="M 30 90 C 100 90, 120 30, 200 30 S 320 90, 400 60 S 500 20, 570 30"
        fill="none" stroke={fieldColor} strokeWidth="3" strokeLinecap="round"
        strokeDasharray="800" strokeDashoffset="800"
        style={{ animation: "drawRevealPath 2s ease-out 0.3s forwards" }}
      />
      {/* Stage milestone dots — appear sequentially */}
      {[
        { cx: 30, cy: 90 },
        { cx: 200, cy: 30 },
        { cx: 400, cy: 60 },
        { cx: 570, cy: 30 },
      ].slice(0, stageCount).map((pt, i) => (
        <g key={i}>
          {/* Pulse ring */}
          <circle cx={pt.cx} cy={pt.cy} r="16" fill={fieldColor} opacity="0.08"
            style={{ animation: `pulseRing 2s ease-in-out ${1 + i * 0.3}s infinite` }}
          />
          {/* Solid dot */}
          <circle cx={pt.cx} cy={pt.cy} r="8" fill="white" stroke={stageColors[i]} strokeWidth="3"
            style={{ opacity: 0, animation: `dotAppear 0.5s ease-out ${0.8 + i * 0.3}s forwards` }}
          />
          {/* Stage number */}
          <text x={pt.cx} y={pt.cy + 1} textAnchor="middle" dominantBaseline="central"
            fill={stageColors[i]} fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif"
            style={{ opacity: 0, animation: `dotAppear 0.5s ease-out ${0.8 + i * 0.3}s forwards` }}
          >
            {i + 1}
          </text>
          {/* Stage label below */}
          <text x={pt.cx} y={pt.cy + 26} textAnchor="middle" fill="#888"
            fontSize="9" fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.05em"
            style={{ opacity: 0, animation: `dotAppear 0.5s ease-out ${1 + i * 0.3}s forwards` }}
          >
            {Object.values(stageNames)[i]}
          </text>
        </g>
      ))}
      {/* Animated particle traveling along path */}
      <circle r="4" fill={fieldColor}>
        <animateMotion dur="4s" repeatCount="indefinite" begin="1.5s"
          path="M 30 90 C 100 90, 120 30, 200 30 S 320 90, 400 60 S 500 20, 570 30"
        />
      </circle>
      <style>{`
        @keyframes drawRevealPath { to { stroke-dashoffset: 0; } }
        @keyframes dotAppear { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
        @keyframes pulseRing { 0%,100% { r:16; opacity:0.08; } 50% { r:22; opacity:0.03; } }
      `}</style>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Salary bar visualization                                            */
/* ──────────────────────────────────────────────────────────────────── */
function SalaryBar({ min, max, show }) {
  const maxScale = 50000;
  const leftPct = (min / maxScale) * 100;
  const widthPct = ((max - min) / maxScale) * 100;
  return (
    <div className="mt-1">
      <div className="relative h-3 rounded-full bg-faint overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #2856a6, #5a8ad0)",
            left: `${leftPct}%`,
            width: show ? `${widthPct}%` : "0%",
            transition: "width 1.2s ease-out 0.5s",
          }}
        />
      </div>
      <div className="mt-2 flex justify-between">
        <span className="font-mono text-xs text-pencil">0</span>
        <span className="font-mono text-xs text-pencil">50k PLN/mo</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Stage card — clickable, rich                                        */
/* ──────────────────────────────────────────────────────────────────── */
function StageCard({ stageNum, certs, fieldSlug, delay, show }) {
  const name = stageNames[stageNum] || `Stage ${stageNum}`;
  const color = stageColors[stageNum - 1] || stageColors[0];
  const months = Math.round(certs.reduce((s, c) => s + c.durationWeeks, 0) / 4);
  const cost = certs.reduce((s, c) => s + c.costPln, 0);

  return (
    <Link
      to={`/fields/${fieldSlug}`}
      className="group block rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s ease-out ${delay}ms`,
      }}
    >
      {/* Stage header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-white font-sans text-sm font-bold"
          style={{ background: color }}
        >
          {stageNum}
        </div>
        <div>
          <span className="block font-sans text-lg font-bold text-ink group-hover:text-rust transition-colors">
            {name}
          </span>
          <span className="block font-sans text-xs text-pencil">
            ~{months} months
          </span>
        </div>
      </div>

      {/* Cert list */}
      <div className="space-y-2">
        {certs.map((cert) => (
          <div key={cert.id} className="flex items-start gap-2">
            <div className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} />
            <div className="min-w-0">
              <span className="block text-sm font-medium text-ink">{cert.name}</span>
              <span className="block font-sans text-xs text-pencil">
                {cert.provider} · {cert.costPln > 0 ? `${cert.costPln.toLocaleString("pl-PL")} PLN` : "Free"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-faint flex items-center justify-between">
        <span className="font-sans text-xs text-pencil">
          {cost > 0 ? `~${cost.toLocaleString("pl-PL")} PLN total` : "Free"}
        </span>
        <span className="font-sans text-xs font-semibold text-rust opacity-0 group-hover:opacity-100 transition-opacity">
          View details &rarr;
        </span>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Job card — clickable, visual                                        */
/* ──────────────────────────────────────────────────────────────────── */
function JobCard({ job, delay, show }) {
  const levelColors = {
    junior: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mid: "bg-amber-50 text-amber-700 border-amber-200",
    senior: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s ease-out ${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium capitalize ${levelColors[job.experienceLevel] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {job.experienceLevel}
          </span>
          <h3 className="mt-2 font-sans text-base font-bold text-ink group-hover:text-rust transition-colors truncate">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-pencil">{job.company} · {job.location}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="block font-sans text-lg font-bold text-rust">
            {(job.salaryMin / 1000).toFixed(0)}k
          </span>
          <span className="block font-sans text-xs text-pencil">PLN/mo</span>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Loading phase                                                       */
/* ──────────────────────────────────────────────────────────────────── */
function LoadingPhase({ visible }) {
  return (
    <div className={[
      "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700",
      visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
    ].join(" ")}>
      {/* Animated orbit rings */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-rust/10" style={{ animation: "spinSlow 8s linear infinite" }} />
        <div className="absolute inset-2 rounded-full border-2 border-rust/20" style={{ animation: "spinSlow 5s linear infinite reverse" }} />
        <div className="absolute inset-4 rounded-full border-2 border-rust/30" style={{ animation: "spinSlow 3s linear infinite" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-rust" style={{ animation: "pulseSoft 1.5s ease-in-out infinite" }} />
        </div>
      </div>
      <h2 className="font-sans text-2xl font-bold text-ink">Building your path...</h2>
      <p className="mt-3 text-sm text-pencil max-w-xs text-center leading-relaxed">
        Analyzing certifications, matching jobs, and personalizing your roadmap
      </p>
      <style>{`@keyframes spinSlow { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Reveal page                                                         */
/* ──────────────────────────────────────────────────────────────────── */
export default function Reveal() {
  const { profile, isOnboarded } = useProgress();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(2), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  const fieldObj = fields.find((f) => f.slug === profile.field);
  const FieldIcon = fieldIcons[profile.field];
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
  const programLabel = programs.find((p) => p.id === profile.program)?.name || "";

  const firstSkill = skills.find((s) => s.fieldIds?.includes(profile.field));
  const firstLesson = firstSkill ? lessons.find((l) => l.skillId === firstSkill.id) : null;
  const firstLessonUrl = firstSkill && firstLesson ? `/skills/${firstSkill.slug}/${firstLesson.id}` : "/dashboard";

  const totalMonths = Math.round(fieldCerts.reduce((s, c) => s + c.durationWeeks, 0) / 4);
  const totalCost = fieldCerts.reduce((s, c) => s + c.costPln, 0);

  const show = phase === 2;
  const stagesCount = useCountUpLocal(stageNums.length, 800, show);
  const certsCount = useCountUpLocal(fieldCerts.length, 800, show);
  const jobsCount = useCountUpLocal(fieldJobs.length, 800, show);

  return (
    <section className="relative min-h-[85vh] py-8 sm:py-12">
      <LoadingPhase visible={phase === 1} />

      <div className={[
        "mx-auto max-w-4xl px-4 transition-all duration-700",
        show ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}>

        {/* ═══════════════ HERO — field name + animated path ═══════════════ */}
        <div className="text-center mb-6" style={{ animation: show ? "fadeInUp 0.8s ease-out both" : "none" }}>
          <div className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/12 bg-card px-4 py-1.5 mb-5">
            {FieldIcon && <FieldIcon className="h-4 w-4 text-merito" />}
            <span className="font-sans text-xs uppercase tracking-wide text-merito font-semibold">
              Your personalized path
            </span>
          </div>
          <h1 className="font-sans text-5xl font-bold text-ink sm:text-6xl lg:text-7xl">
            {fieldObj?.name || "Your Path"}
          </h1>
          <p className="mt-3 text-lg text-graphite">
            Tailored for a <span className="font-medium text-ink">{yearLabel}</span> {programLabel !== "Other" ? <span className="font-medium text-ink">{programLabel}</span> : ""} student
          </p>
        </div>

        {/* Animated path visualization */}
        <div className="mb-10" style={{ animation: show ? "fadeInUp 0.8s ease-out 0.3s both" : "none" }}>
          <PathHeroSVG stageCount={stageNums.length} />
        </div>

        {/* ═══════════════ STATS — inline, not cards ═══════════════ */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-12 py-6 border-y border-faint"
          style={{ animation: show ? "fadeInUp 0.6s ease-out 0.6s both" : "none" }}
        >
          <div className="text-center">
            <span className="block font-sans text-4xl font-bold text-ink">{stagesCount}</span>
            <span className="block font-sans text-xs font-semibold text-pencil uppercase tracking-wide mt-1">Stages</span>
          </div>
          <div className="h-8 w-px bg-faint hidden sm:block" />
          <div className="text-center">
            <span className="block font-sans text-4xl font-bold text-ink">{certsCount}</span>
            <span className="block font-sans text-xs font-semibold text-pencil uppercase tracking-wide mt-1">Certifications</span>
          </div>
          <div className="h-8 w-px bg-faint hidden sm:block" />
          <div className="text-center">
            <span className="block font-sans text-4xl font-bold text-ink">{jobsCount}</span>
            <span className="block font-sans text-xs font-semibold text-pencil uppercase tracking-wide mt-1">Jobs in Poland</span>
          </div>
          <div className="h-8 w-px bg-faint hidden sm:block" />
          <div className="text-center">
            <span className="block font-sans text-4xl font-bold text-ink">~{totalMonths}</span>
            <span className="block font-sans text-xs font-semibold text-pencil uppercase tracking-wide mt-1">Months</span>
          </div>
        </div>

        {/* ═══════════════ SALARY RANGE — visual bar ═══════════════ */}
        {salaryMin > 0 && (
          <div
            className="mb-12 rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] bg-card p-6"
            style={{ animation: show ? "fadeInUp 0.6s ease-out 0.8s both" : "none" }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">What you could earn</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-sans text-3xl font-bold text-ink">
                    {salaryMin.toLocaleString("pl-PL")} - {salaryMax.toLocaleString("pl-PL")}
                  </span>
                  <span className="font-mono text-sm text-pencil">PLN/month</span>
                </div>
              </div>
              <span className="font-sans text-xs text-pencil">{fieldJobs.length} real listings</span>
            </div>
            <SalaryBar min={salaryMin} max={salaryMax} show={show} />
          </div>
        )}

        {/* ═══════════════ ROADMAP — clickable stage cards ═══════════════ */}
        <div style={{ animation: show ? "fadeInUp 0.6s ease-out 1s both" : "none" }}>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-sans text-xl font-bold text-ink">Your Certification Roadmap</h2>
            <Link to={`/fields/${profile.field}`} className="font-sans text-xs font-semibold text-rust hover:underline">
              Full roadmap &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stageNums.map((num, idx) => (
              <StageCard
                key={num}
                stageNum={num}
                certs={stages[num]}
                fieldSlug={profile.field}
                delay={1000 + idx * 150}
                show={show}
              />
            ))}
          </div>
        </div>

        {/* ═══════════════ JOBS — clickable cards ═══════════════ */}
        {fieldJobs.length > 0 && (
          <div className="mt-12" style={{ animation: show ? "fadeInUp 0.6s ease-out 1.5s both" : "none" }}>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-sans text-xl font-bold text-ink">
                {fieldJobs.length} Jobs Waiting in Poland
              </h2>
              <Link to="/jobs" className="font-sans text-xs font-semibold text-rust hover:underline">
                All jobs &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fieldJobs.slice(0, 4).map((job, i) => (
                <JobCard key={job.id} job={job} delay={1600 + i * 100} show={show} />
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ CTA — start learning ═══════════════ */}
        <div
          className="mt-14 rounded-2xl bg-ink p-10 text-center"
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease-out 2s",
          }}
        >
          <h3 className="font-sans text-xl font-bold text-white">Ready to start?</h3>
          <p className="mt-2 text-white/60 max-w-md mx-auto">
            Your first lesson is already waiting. Jump in and start building your {fieldObj?.name} skills today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to={firstLessonUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 font-sans font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start your first lesson
              <span>&rarr;</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-8 py-3.5 font-sans font-semibold text-white transition-all duration-200 hover:bg-white/10"
            >
              Go to dashboard
            </Link>
          </div>
          <button
            type="button"
            onClick={() => navigate("/onboarding")}
            className="mt-5 font-sans text-sm text-white/40 underline underline-offset-2 transition-colors hover:text-white/70"
          >
            Try a different field
          </button>
        </div>
      </div>
    </section>
  );
}
