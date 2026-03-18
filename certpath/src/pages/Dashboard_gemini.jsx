import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { fields, certifications, skills, lessons, jobs, skillJobMap } from "../data/mock";
import { getFieldColor } from "../data/fieldColors";
import useProgress from "../hooks/useProgress";
import useCountUp from "../hooks/useCountUp";
import useScrollReveal from "../hooks/useScrollReveal";

/* ═══════════════════════════════════════════════════════════════════════
   STREAK TRACKING & FLAME
   ═══════════════════════════════════════════════════════════════════════ */
const STREAK_KEY = "clairy:streak-visits";
function todayStr() { return new Date().toISOString().slice(0, 10); }
function readStreak() { try { const r = localStorage.getItem(STREAK_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function recordVisit() {
  const v = readStreak(); const t = todayStr();
  if (!v.includes(t)) {
    v.push(t);
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);
    localStorage.setItem(STREAK_KEY, JSON.stringify(v.filter(d => new Date(d) >= cutoff)));
  }
}
function computeStreak() {
  const v = readStreak().sort().reverse();
  if (!v.length) return 0;
  let s = 0, d = new Date(todayStr());
  for (let i = 0; i < 365; i++) {
    if (v.includes(d.toISOString().slice(0, 10))) { s++; d = new Date(d); d.setDate(d.getDate() - 1); }
    else break;
  }
  return s;
}
function getWeekVisits() {
  const v = readStreak(), today = new Date(todayStr());
  const dow = today.getDay(), mon = new Date(today);
  mon.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const ds = d.toISOString().slice(0, 10);
    return { label: "MTWTFSS"[i], date: ds, visited: v.includes(ds), isToday: ds === todayStr() };
  });
}

function StreakFlame({ streak }) {
  const t = Math.min(streak / 7, 1);
  return (
    <div className="relative w-12 h-14 shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 32 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <ellipse cx="16" cy="27" rx={10 + t * 2} ry="15" fill="#F0562E" opacity={0.45 + t * 0.15} style={{ transformOrigin: "16px 34px", animation: "flameSway 3s ease-in-out infinite" }} />
        <ellipse cx="16" cy="29" rx={7.5 + t} ry="12" fill="#f97316" opacity={0.65 + t * 0.2} style={{ transformOrigin: "16px 34px", animation: "flameSway 2.2s ease-in-out infinite .3s" }} />
        <ellipse cx="16" cy="31" rx={4.5 + t * 0.5} ry="9" fill="#FFB020" opacity={0.9 + t * 0.1} style={{ transformOrigin: "16px 34px", animation: "flameSway 1.6s ease-in-out infinite .1s" }} />
      </svg>
      <span className="relative z-10 font-mono text-base font-bold text-white mt-3.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>{streak}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SKILL ILLUSTRATIONS (Uses field accent color)
   ═══════════════════════════════════════════════════════════════════════ */
function NetworkIllust({ accent }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes np{0%,100%{r:2.5;opacity:.4}50%{r:4;opacity:.8}}@keyframes ns{0%,100%{opacity:.25}50%{opacity:.6}}`}</style></defs>
      {[[30,25],[60,15],[90,25],[20,60],[50,55],[80,60],[100,55],[40,90],[70,95],[90,85]].map(([x,y],i)=>
        <circle key={i} cx={x} cy={y} r="1" fill={accent} opacity=".2" />)}
      <line x1="30" y1="40" x2="60" y2="30" stroke={accent} strokeWidth="1" opacity=".3" strokeDasharray="3 2"/>
      <line x1="60" y1="30" x2="90" y2="40" stroke={accent} strokeWidth="1" opacity=".3" strokeDasharray="3 2"/>
      <line x1="30" y1="40" x2="45" y2="75" stroke={accent} strokeWidth="1" opacity=".3" strokeDasharray="3 2"/>
      <line x1="90" y1="40" x2="75" y2="75" stroke={accent} strokeWidth="1" opacity=".3" strokeDasharray="3 2"/>
      <line x1="45" y1="75" x2="75" y2="75" stroke={accent} strokeWidth="1" opacity=".3" strokeDasharray="3 2"/>
      <circle cx="30" cy="40" r="6" fill="none" stroke={accent} strokeWidth="1.5" opacity=".6"/>
      <circle cx="60" cy="30" r="6" fill="none" stroke={accent} strokeWidth="1.5" opacity=".6"/>
      <circle cx="90" cy="40" r="6" fill="none" stroke={accent} strokeWidth="1.5" opacity=".6"/>
      <circle cx="45" cy="75" r="6" fill="none" stroke={accent} strokeWidth="1.5" opacity=".6"/>
      <circle cx="75" cy="75" r="6" fill="none" stroke={accent} strokeWidth="1.5" opacity=".6"/>
      <circle cx="60" cy="30" r="2.5" fill={accent} style={{animation:"np 2s ease-in-out infinite"}}/>
      <circle cx="45" cy="75" r="2.5" fill={accent} style={{animation:"np 2s ease-in-out infinite .7s"}}/>
      <path d="M60 55 L68 61 L68 75 Q68 82 60 86 Q52 82 52 75 L52 61Z" fill="none" stroke={accent} strokeWidth="1.5" style={{animation:"ns 3s ease-in-out infinite"}}/>
    </svg>
  );
}

function PythonIllust({ accent }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes tc{0%,100%{opacity:1}50%{opacity:0}}`}</style></defs>
      <rect x="15" y="15" width="90" height="90" rx="6" fill="#1c1917" stroke="#44403c" strokeWidth="1"/>
      <circle cx="26" cy="24" r="2.5" fill="#ef4444" opacity=".8"/><circle cx="34" cy="24" r="2.5" fill="#f59e0b" opacity=".8"/><circle cx="42" cy="24" r="2.5" fill="#22c55e" opacity=".8"/>
      <rect x="24" y="38" width="42" height="2.5" rx="1" fill={accent} opacity=".9"/>
      <rect x="24" y="46" width="60" height="2.5" rx="1" fill="#a8a29e" opacity=".5"/>
      <rect x="30" y="54" width="48" height="2.5" rx="1" fill={accent} opacity=".7"/>
      <rect x="30" y="62" width="36" height="2.5" rx="1" fill="#a8a29e" opacity=".5"/>
      <rect x="24" y="74" width="24" height="2.5" rx="1" fill={accent} opacity=".9"/>
      <rect x="30" y="82" width="54" height="2.5" rx="1" fill="#a8a29e" opacity=".5"/>
      <rect x="24" y="92" width="2" height="8" rx="1" fill={accent} style={{animation:"tc 1.2s step-end infinite"}}/>
    </svg>
  );
}

function SqlIllust({ accent }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes sc{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}`}</style></defs>
      <rect x="8" y="18" width="42" height="55" rx="3" fill="none" stroke={accent} strokeWidth="1.5" opacity=".6"/>
      <rect x="8" y="18" width="42" height="11" rx="3" fill={accent} opacity=".15"/>
      <text x="29" y="27" textAnchor="middle" fill={accent} fontSize="6" fontWeight="600" fontFamily="Inter">users</text>
      {[0,1,2].map(i=><g key={i}><rect x="12" y={34+i*12} width="16" height="2.5" rx="1" fill={accent} opacity={.4+i*.1}/><rect x="32" y={34+i*12} width="12" height="2.5" rx="1" fill={accent} opacity=".25"/></g>)}
      <rect x="70" y="18" width="42" height="55" rx="3" fill="none" stroke={accent} strokeWidth="1.5" opacity=".6"/>
      <rect x="70" y="18" width="42" height="11" rx="3" fill={accent} opacity=".15"/>
      <text x="91" y="27" textAnchor="middle" fill={accent} fontSize="6" fontWeight="600" fontFamily="Inter">orders</text>
      {[0,1,2].map(i=><g key={i}><rect x="74" y={34+i*12} width="14" height="2.5" rx="1" fill={accent} opacity={.4+i*.1}/><rect x="92" y={34+i*12} width="16" height="2.5" rx="1" fill={accent} opacity=".25"/></g>)}
      <path d="M50 40 Q60 40 70 40" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="3 2" opacity=".6" style={{animation:"sc 2s ease-in-out infinite alternate"}}/>
      <path d="M50 52 Q60 52 70 52" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="3 2" opacity=".4" style={{animation:"sc 2s ease-in-out infinite alternate .5s"}}/>
      <rect x="22" y="88" width="76" height="18" rx="4" fill={accent} opacity=".1"/>
      <rect x="28" y="94" width="30" height="2.5" rx="1" fill={accent} opacity=".6"/>
      <rect x="64" y="94" width="26" height="2.5" rx="1" fill={accent} opacity=".4"/>
    </svg>
  );
}

function CloudIllust({ accent }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes cf{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes sb{0%,100%{opacity:.4}50%{opacity:.9}}`}</style></defs>
      <g style={{animation:"cf 4s ease-in-out infinite"}}>
        <path d="M32 42Q32 26 48 26Q56 14 72 20Q92 18 96 38Q110 38 110 52Q110 65 96 65L32 65Q18 65 18 52Q18 42 32 42Z" fill={accent} opacity=".1" stroke={accent} strokeWidth="1.5"/>
      </g>
      {[30,52,74].map((x,i)=><g key={i}>
        <rect x={x} y="78" width="16" height="24" rx="2" fill="none" stroke={accent} strokeWidth="1.5" opacity=".5"/>
        <rect x={x+2} y="81" width="12" height="1.5" rx=".75" fill={accent} opacity=".4"/>
        <rect x={x+2} y="85" width="12" height="1.5" rx=".75" fill={accent} opacity=".4"/>
        <circle cx={x+12} cy="97" r="1.5" fill={accent} style={{animation:`sb 2s ease-in-out infinite ${i*.4}s`}}/>
      </g>)}
    </svg>
  );
}

function DataIllust({ accent }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes bg{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes td{from{stroke-dashoffset:160}to{stroke-dashoffset:0}}@keyframes da{from{r:0;opacity:0}to{r:3;opacity:1}}`}</style></defs>
      <line x1="18" y1="98" x2="105" y2="98" stroke={accent} strokeWidth="1.5" opacity=".4"/>
      <line x1="18" y1="98" x2="18" y2="18" stroke={accent} strokeWidth="1.5" opacity=".4"/>
      {[{x:26,h:30},{x:42,h:50},{x:58,h:38},{x:74,h:62},{x:90,h:44}].map((b,i)=>
        <rect key={i} x={b.x} y={98-b.h} width="10" height={b.h} rx="1.5" fill={accent} opacity=".25" style={{transformOrigin:`${b.x+5}px 98px`,animation:`bg .8s cubic-bezier(.34,1.56,.64,1) ${i*.1}s both`}}/>)}
      <polyline points="31,72 47,54 63,65 79,40 95,58" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="160" strokeDashoffset="160" style={{animation:"td 2s ease-out .4s forwards"}}/>
      {[[31,72],[47,54],[63,65],[79,40],[95,58]].map(([cx,cy],i)=>
        <circle key={i} cx={cx} cy={cy} r="0" fill={accent} style={{animation:`da .3s cubic-bezier(.34,1.56,.64,1) ${.7+i*.12}s both`}}/>)}
    </svg>
  );
}

const SKILL_ILLUSTS = {
  "network-security": NetworkIllust, "python-basics": PythonIllust,
  "sql-databases": SqlIllust, "cloud-architecture": CloudIllust, "data-analysis": DataIllust,
};

/* ═══════════════════════════════════════════════════════════════════════
   SKILL PATH COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
function SkillPath({ relevantSkills, progress, activeSkill, getSkillProgress, accent }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
      {relevantSkills.map((skill, i) => {
        const sp = getSkillProgress(skill.id);
        const done = progress.completedSkills.includes(skill.id);
        const active = activeSkill?.id === skill.id;
        const locked = !done && !active;

        return (
          <div key={skill.id} className="flex items-center shrink-0">
            <Link to={`/skills/${skill.slug}`}
              className={`group flex flex-col items-center gap-3 transition-all duration-200 ${locked ? "opacity-50 hover:opacity-70" : ""}`}
              style={{ width: '72px' }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                  done ? "text-white shadow-sm" :
                  active ? "border-[2px] bg-[#fdfcfa] shadow-sm" :
                  "border-[1.5px] border-dashed border-ink/20 text-pencil bg-transparent"
                }`}
                style={{
                  backgroundColor: done ? accent : undefined,
                  borderColor: active ? accent : undefined,
                  color: active ? accent : undefined,
                }}
              >
                {done ? (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8.5L7 11.5L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : locked ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-70">
                    <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 7V4.5C5 2.5 6.5 1 8 1S11 2.5 11 4.5V7" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ) : (
                  `${sp.completed}/${sp.total}`
                )}
              </div>
              <div className="flex flex-col items-center h-[32px] justify-start">
                {active && (
                  <span className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>{t("dashboard.active")}</span>
                )}
                <span className={`text-xs text-center leading-tight px-1 line-clamp-2 ${
                  active ? "font-bold text-ink" : done ? "font-semibold text-ink/80" : "font-medium text-pencil"
                }`}>
                  {skill.name}
                </span>
              </div>
            </Link>
            {i < relevantSkills.length - 1 && (
              <div className={`w-8 h-[2px] -mt-[44px] mx-1 rounded-full ${done ? "" : "border-t-[1.5px] border-dashed border-ink/15"}`}
                style={done ? { backgroundColor: accent, opacity: 0.4 } : undefined} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WELCOME OVERLAY — dopaminergic intro after onboarding
   ═══════════════════════════════════════════════════════════════════════ */
function WelcomeOverlay({ fieldName, accent, onDone }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(0); // 0=enter, 1=show, 2=exit
  const canvasRef = useRef(null);

  // Particle confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const colors = [accent, "#FFB020", "#00C48C", "#FF505F", "#6366f1", "#f97316"];
    const particles = Array.from({ length: 80 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 1) * 16 - 4,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      life: 1,
    }));

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      particles.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.life -= 0.008;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(animate);
    };

    const t = setTimeout(() => animate(), 400);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [accent]);

  // Phase timing
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 3200);
    const t3 = setTimeout(() => onDone(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "#f5f3ef",
        opacity: phase === 2 ? 0 : 1,
        transition: "opacity 0.8s ease-out",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }} />

      <div
        className="relative z-10 flex flex-col items-center gap-6"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
          transition: "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Pulsing ring */}
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${accent}15` }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accent }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${accent}`,
              animation: "welcomePulse 1.5s ease-out infinite",
            }}
          />
        </div>

        <div className="text-center">
          <p className="font-sans text-sm font-bold uppercase tracking-widest text-pencil mb-2">{t("dashboard.yourPathIsSet")}</p>
          <h1
            className="font-sans text-5xl lg:text-6xl font-bold tracking-tight leading-none"
            style={{ color: accent }}
          >
            {fieldName}
          </h1>
          <p className="font-sans text-lg text-graphite mt-4 font-medium max-w-md">
            {t("dashboard.personalizedReady")}
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: accent,
                animation: `welcomeBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes welcomePulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes welcomeBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function DashboardGemini() {
  const { t } = useTranslation();
  const {
    profile, isOnboarded, progress, xp, level,
    getCurrentLesson, getSkillProgress, getLessonProgress,
  } = useProgress();

  const [searchParams, setSearchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(() => searchParams.get("welcome") === "1");
  const [streak, setStreak] = useState(0);
  const [weekDays, setWeekDays] = useState([]);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    recordVisit();
    setStreak(computeStreak());
    setWeekDays(getWeekVisits());
  }, []);

  const { count: xpCount } = useCountUp(xp, 1000);
  const jobsReveal = useScrollReveal({ threshold: 0.1 });

  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  const field = fields.find(f => f.id === profile.field);
  const fieldName = field?.name || profile.field;
  const fc = getFieldColor(profile.field);
  const accent = fc.accent;

  const relevantSkills = skills.filter(s => s.fieldIds.includes(profile.field));
  const activeSkill = relevantSkills.find(s => !progress.completedSkills.includes(s.id)) || relevantSkills[0];
  const currentLesson = activeSkill ? getCurrentLesson(activeSkill.id) : null;
  const lessonProg = currentLesson ? getLessonProgress(currentLesson.id) : { completed: 0, total: 0 };
  const skillLessons = activeSkill ? lessons.filter(l => l.skillId === activeSkill.id) : [];

  const currentPhase = currentLesson
    ? (() => { const l = currentLesson.phases.learn.steps, a = currentLesson.phases.apply.steps;
        if (lessonProg.completed < l) return "learn"; if (lessonProg.completed < l + a) return "apply"; return "challenge"; })()
    : "learn";

  const matchingJobIds = [...new Set(relevantSkills.flatMap(s => skillJobMap[s.id] || []))];
  const matchingJobs = jobs.filter(j => matchingJobIds.includes(j.id));
  const totalLessons = lessons.length;
  const completedLessons = progress.completedLessons.length;

  const fieldCerts = certifications[profile.field] || [];
  const stageMap = {};
  fieldCerts.forEach(c => {
    if (!stageMap[c.stage]) stageMap[c.stage] = { stage: c.stage, stageName: c.stageName, certs: [], totalWeeks: 0 };
    stageMap[c.stage].certs.push(c);
    stageMap[c.stage].totalWeeks += c.durationWeeks;
  });
  const stages = Object.values(stageMap).sort((a, b) => a.stage - b.stage);

  const Illust = activeSkill ? (SKILL_ILLUSTS[activeSkill.id] || NetworkIllust) : NetworkIllust;
  const allDone = !currentLesson || progress.completedLessons.includes(currentLesson?.id);
  const ys = profile.year === "1" ? "st" : profile.year === "2" ? "nd" : profile.year === "3" ? "rd" : "th";

  return (
    <div className="pb-24 bg-[#f5f3ef] min-h-screen font-sans selection:bg-ink selection:text-white">
      {showWelcome && <WelcomeOverlay fieldName={fieldName} accent={accent} onDone={dismissWelcome} />}
      <style>{`
        @keyframes flameSway{0%,100%{transform:translateX(0) scaleY(1)}33%{transform:translateX(-1px) scaleY(1.04)}66%{transform:translateX(1px) scaleY(.97)}}
        @keyframes sIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fillW{from{width:0}}
        @keyframes breatheDot{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.2);opacity:1}}
      `}</style>

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-12">
        
        {/* 1. HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-ink/8" style={{ animation: "sIn .6s ease-out both" }}>
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              {t("dashboard.yourCareerPath")}
            </p>
            <h1 className="font-sans text-4xl lg:text-5xl font-bold text-ink leading-none tracking-tight">
              {fieldName}
            </h1>
            <p className="font-sans text-sm text-pencil mt-3 font-medium">
              {profile.year}{ys} {t("dashboard.year")} &middot; {profile.program}
            </p>
          </div>

          <div className="flex items-center bg-[#fdfcfa] px-6 py-3 rounded-2xl border-[1.5px] border-ink/8 shadow-[0_2px_0_0_rgba(0,0,0,0.04)] h-[84px] justify-between sm:justify-start">
            {/* Inline Stats */}
            <div className="flex items-center">
              <div className="flex flex-col items-center justify-center min-w-[3.5rem]">
                <span className="font-sans text-[32px] font-bold text-arcade drop-shadow-[0_2px_8px_rgba(255,176,32,0.3)] leading-none mb-1.5">{xpCount}</span>
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-arcade">{t("dashboard.xp")}</span>
              </div>
              
              <div className="w-px h-10 bg-ink/10 mx-5 lg:mx-7" />
              
              <div className="flex flex-col items-center justify-center min-w-[3.5rem]">
                <span className="font-sans text-[32px] font-bold leading-none mb-1.5" style={{ color: accent }}>{level}</span>
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-pencil">{t("dashboard.level")}</span>
              </div>
              
              <div className="w-px h-10 bg-ink/10 mx-5 lg:mx-7" />
              
              <div className="flex flex-col items-center justify-center min-w-[5.5rem]">
                <span className="font-mono text-[32px] font-bold text-ink leading-none mb-1.5 tracking-tight">{completedLessons}/{totalLessons}</span>
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-pencil">{t("dashboard.lessonsLabel")}</span>
              </div>
            </div>

            {/* Divider between stats and streak */}
            <div className="hidden sm:block w-px h-10 bg-ink/10 mx-5 lg:mx-8" />

            {/* Streak Tracker */}
            <div className="hidden sm:flex items-center">
              <div className="flex items-center gap-2 lg:gap-2.5">
                {weekDays.map((day, i) => (
                  <div key={i}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-sm font-bold transition-colors ${
                      day.visited ? "text-white shadow-sm" : day.isToday ? "border-[2px] text-ink" : "text-pencil bg-ink/5"
                    }`}
                    style={{
                      backgroundColor: day.visited ? accent : undefined,
                      borderColor: day.isToday && !day.visited ? accent : undefined,
                    }}>
                    {day.label}
                  </div>
                ))}
              </div>
              <div className="pl-5 lg:pl-6 flex items-center justify-center">
                <StreakFlame streak={streak} />
              </div>
            </div>
          </div>
        </header>

        {/* 2. TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 mt-10" style={{ animation: "sIn .6s ease-out .1s both" }}>
          
          {/* LEFT COLUMN: Learning Path (~60%) */}
          <div className="flex flex-col gap-10">
            
            {/* Continue Learning Card */}
            {activeSkill && currentLesson && !allDone ? (
              <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl overflow-hidden flex flex-col group">
                <div className="p-6 sm:p-8 lg:p-10 flex-1 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 sm:gap-10 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent, animation: "breatheDot 2s ease-in-out infinite" }} />
                      <span className="font-sans text-xs font-bold uppercase tracking-widest text-pencil">{activeSkill.name}</span>
                    </div>
                    <h2 className="font-sans text-3xl font-bold text-ink leading-tight mb-3 tracking-tight">{currentLesson.title}</h2>
                    <p className="font-mono text-sm text-pencil font-medium">
                      {t("dashboard.lessonOf", { current: currentLesson.number, total: skillLessons.length })} <span className="mx-2 opacity-30">|</span> ~{currentLesson.estimatedMinutes}min
                    </p>

                    {/* Phase Indicator */}
                    <div className="flex items-center gap-2 mt-8">
                      {["learn", "apply", "challenge"].map(phase => {
                        const steps = currentLesson.phases[phase]?.steps || 0;
                        const lt = currentLesson.phases.learn.steps, at = currentLesson.phases.apply.steps;
                        let ps = 0; if (phase === "apply") ps = lt; if (phase === "challenge") ps = lt + at;
                        const pc = Math.max(0, Math.min(steps, lessonProg.completed - ps));
                        const complete = pc >= steps, isActive = phase === currentPhase;
                        return (
                          <div key={phase} className="flex-1">
                            <div className={`h-[6px] rounded-full transition-all duration-300 ${
                              complete ? "" : isActive ? "" : "bg-ink/10"
                            }`} style={{
                              backgroundColor: complete || isActive ? accent : undefined,
                              opacity: complete ? 0.4 : isActive ? 1 : undefined,
                            }} />
                            <span className={`block mt-2.5 text-xs font-bold uppercase tracking-widest text-center transition-colors ${
                              complete || isActive ? "text-ink" : "text-pencil"
                            }`}>{t(`dashboard.${phase}`)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Animated SVG */}
                  <div className="hidden sm:block w-[160px] h-[160px] opacity-90 group-hover:opacity-100 transition-opacity">
                    <Illust accent={accent} />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t-[1.5px] border-ink/12 bg-ink/[0.015] p-6 flex items-center justify-between">
                  <div className="flex-1 max-w-[240px]">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-pencil mb-2">
                      <span>{t("dashboard.progress")}</span>
                      <span>{t("dashboard.steps", { completed: lessonProg.completed, total: lessonProg.total })}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{
                        backgroundColor: accent,
                        width: lessonProg.total > 0 ? `${(lessonProg.completed / lessonProg.total) * 100}%` : "0%",
                        animation: "fillW 1s ease-out .3s both",
                      }} />
                    </div>
                  </div>
                  <Link to={`/skills/${activeSkill.slug}/${currentLesson.id}`}
                    className="inline-flex items-center justify-center gap-2 text-white rounded-xl px-10 py-4 font-sans text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: accent, outlineColor: accent }}
                  >
                    {t("dashboard.continue")}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 3L11 8L5 13" />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <h2 className="font-sans text-3xl font-bold text-ink">{t("dashboard.allCaughtUp")}</h2>
                <p className="font-sans text-base text-pencil mt-3">{t("dashboard.completedAllLessons")}</p>
              </div>
            )}

            {/* Your Skills Node Chain */}
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-4 ml-1">{t("dashboard.yourSkills")}</h3>
              <SkillPath relevantSkills={relevantSkills} progress={progress} activeSkill={activeSkill} getSkillProgress={getSkillProgress} accent={accent} />
            </div>
          </div>

          {/* RIGHT COLUMN: Certification Roadmap (~40%) */}
          <div className="flex flex-col w-full lg:w-[380px] shrink-0">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-pencil mb-4 ml-1">{t("dashboard.certificationRoadmap")}</h3>
            <div className="flex flex-col gap-5">
              {stages.map((stg, si) => {
                const isCurrent = si === 0;
                return (
                  <div key={stg.stage}
                    className={`bg-[#fdfcfa] border-[1.5px] rounded-xl overflow-hidden transition-opacity duration-300 ${
                      isCurrent ? "border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]" : "border-ink/10 opacity-50 hover:opacity-75"
                    }`}
                  >
                    {/* Stage Header */}
                    <div className="px-5 py-4 flex items-center justify-between border-b border-ink/8 bg-white/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isCurrent ? "text-white" : "text-pencil bg-ink/5"
                        }`} style={isCurrent ? { backgroundColor: accent } : undefined}>
                          {stg.stage}
                        </div>
                        <span className="font-sans text-base font-bold text-ink tracking-tight">{stg.stageName}</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-pencil">
                        ~{stg.totalWeeks >= 52 ? `${Math.round(stg.totalWeeks / 4)}mo` : `${stg.totalWeeks}wk`}
                      </span>
                    </div>

                    {/* Cert Rows */}
                    <div className="flex flex-col">
                      {stg.certs.map((cert, ci) => (
                        <Link key={cert.id} to={`/fields/${profile.field}/certs/${cert.id}`}
                          className={`group flex flex-col px-5 py-4 transition-colors hover:bg-ink/[0.02] ${
                            ci < stg.certs.length - 1 ? "border-b border-ink/5" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-sans text-sm font-bold text-ink leading-tight pr-4">{cert.name}</h4>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-pencil group-hover:text-ink transition-colors mt-0.5 shrink-0">
                              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-sans text-xs text-pencil font-medium">
                              {cert.provider} &middot; <span className="font-mono">{cert.costPln > 0 ? `${cert.costPln.toLocaleString()} PLN` : t("common.free")}</span>
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              cert.difficulty === "beginner" ? "bg-emerald-50 text-emerald-700" :
                              cert.difficulty === "intermediate" ? "bg-amber-50 text-amber-700" :
                              cert.difficulty === "advanced" ? "bg-orange-50 text-orange-700" :
                              "bg-rose-50 text-rose-700"
                            }`}>
                              {cert.difficulty}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Current Stage Indicator */}
                    {isCurrent && (
                      <div className="bg-ink/[0.02] px-5 py-3 border-t border-ink/8 flex items-center justify-center">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{t("dashboard.inProgress")}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. CAREER OPPORTUNITIES (Full-width below columns) */}
        <section
          ref={jobsReveal.ref}
          className="mt-16 transition-all duration-700"
          style={{
            opacity: jobsReveal.isVisible ? 1 : 0,
            transform: jobsReveal.isVisible ? "translateY(0)" : "translateY(16px)",
            animation: "sIn .6s ease-out .2s both",
          }}
        >
          <div className="flex items-end mb-8 border-b border-ink/8 pb-5">
            <div className="flex items-center gap-4">
              <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-ink m-0">{t("dashboard.careerOpportunities")}</h3>
              {matchingJobs.length > 0 && (
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  {t("dashboard.matches", { count: matchingJobs.length })}
                </span>
              )}
            </div>
          </div>

          {matchingJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingJobs.slice(0, 6).map((job) => {
                return (
                  <Link key={job.id} to={`/jobs/${job.id}`}
                    className="group bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className={`inline-block border px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${job.type === "Internship" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                          {job.type}
                        </span>
                        <span className="font-mono text-sm font-bold shrink-0" style={{ color: accent }}>
                          {(job.salaryMin / 1000).toFixed(0)}k–{(job.salaryMax / 1000).toFixed(0)}k <span className="text-xs text-pencil uppercase tracking-wider ml-0.5">PLN</span>
                        </span>
                      </div>
                      <h4 className="font-sans text-lg font-bold text-ink leading-tight mb-2 group-hover:text-ink/80 transition-colors">{job.title}</h4>
                      <p className="font-sans text-sm font-medium text-pencil">{job.company}</p>
                    </div>
                    <div className="mt-6 pt-5 border-t border-ink/8 flex items-center justify-between">
                      <p className="font-sans text-xs font-semibold text-pencil uppercase tracking-wider">{job.location} &middot; {job.type}</p>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-pencil/30 group-hover:text-ink/60 transition-colors">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </Link>
                );
              })}
              </div>
              <div className="mt-10 flex justify-center">
                <Link to="/jobs" className="group bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 transition-all duration-200 inline-flex items-center gap-2">
                  {t("dashboard.browseAllJobs")}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 border-dashed rounded-xl p-10 text-center max-w-2xl mx-auto mt-10">
              <p className="font-sans text-lg font-bold text-ink mb-2">{t("dashboard.completeMoreSkills")}</p>
              <p className="font-sans text-sm text-pencil">{t("dashboard.skillsConnectJobs")}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
