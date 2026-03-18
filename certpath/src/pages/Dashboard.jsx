import { Navigate, Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { fields, certifications, skills, lessons, jobs, skillJobMap } from "../data/mock";
import { getFieldColor } from "../data/fieldColors";
import useProgress from "../hooks/useProgress";
import useCountUp from "../hooks/useCountUp";
import useScrollReveal from "../hooks/useScrollReveal";

/* ═══════════════════════════════════════════════════════════════════════
   STREAK TRACKING
   ═══════════════════════════════════════════════════════════════════════ */

const STREAK_KEY = "clairy:streak-visits";
function todayStr() { return new Date().toISOString().slice(0, 10); }
function readStreak() {
  try { const r = localStorage.getItem(STREAK_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
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


/* ═══════════════════════════════════════════════════════════════════════
   STREAK FLAME (animated SVG)
   ═══════════════════════════════════════════════════════════════════════ */

function StreakFlame({ streak }) {
  const t = Math.min(streak / 7, 1);
  return (
    <div className="relative" style={{ width: 32, height: 40 }}>
      <svg viewBox="0 0 32 40" className="w-full h-full" aria-hidden="true">
        <ellipse cx="16" cy="30" rx={7 + t * 2} ry="14" fill="#f97316" opacity={0.3 + t * 0.15}
          style={{ transformOrigin: "16px 34px", animation: "flameSway 3s ease-in-out infinite" }} />
        <ellipse cx="16" cy="31" rx={5 + t} ry="11" fill="#fb923c" opacity={0.55 + t * 0.2}
          style={{ transformOrigin: "16px 34px", animation: "flameSway 2.2s ease-in-out infinite .3s" }} />
        <ellipse cx="16" cy="32" rx={3 + t * 0.5} ry="8" fill="#fbbf24" opacity={0.8 + t * 0.2}
          style={{ transformOrigin: "16px 34px", animation: "flameSway 1.6s ease-in-out infinite .1s" }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-sans text-xs font-black text-white pt-2"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,.3)" }}>{streak}</span>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   SKILL ILLUSTRATIONS (per-topic animated SVGs)
   ═══════════════════════════════════════════════════════════════════════ */

function NetworkIllust() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes np{0%,100%{r:2.5;opacity:.4}50%{r:4;opacity:.8}}@keyframes ns{0%,100%{opacity:.25}50%{opacity:.6}}`}</style></defs>
      {[[30,25],[60,15],[90,25],[20,60],[50,55],[80,60],[100,55],[40,90],[70,95],[90,85]].map(([x,y],i)=>
        <circle key={i} cx={x} cy={y} r="1" fill="#0d9488" opacity=".12" />)}
      <line x1="30" y1="40" x2="60" y2="30" stroke="#0d9488" strokeWidth="1" opacity=".2" strokeDasharray="3 2"/>
      <line x1="60" y1="30" x2="90" y2="40" stroke="#0d9488" strokeWidth="1" opacity=".2" strokeDasharray="3 2"/>
      <line x1="30" y1="40" x2="45" y2="75" stroke="#0d9488" strokeWidth="1" opacity=".2" strokeDasharray="3 2"/>
      <line x1="90" y1="40" x2="75" y2="75" stroke="#0d9488" strokeWidth="1" opacity=".2" strokeDasharray="3 2"/>
      <line x1="45" y1="75" x2="75" y2="75" stroke="#0d9488" strokeWidth="1" opacity=".2" strokeDasharray="3 2"/>
      <circle cx="30" cy="40" r="6" fill="none" stroke="#0d9488" strokeWidth="1.2" opacity=".5"/>
      <circle cx="60" cy="30" r="6" fill="none" stroke="#0d9488" strokeWidth="1.2" opacity=".5"/>
      <circle cx="90" cy="40" r="6" fill="none" stroke="#0d9488" strokeWidth="1.2" opacity=".5"/>
      <circle cx="45" cy="75" r="6" fill="none" stroke="#0d9488" strokeWidth="1.2" opacity=".5"/>
      <circle cx="75" cy="75" r="6" fill="none" stroke="#0d9488" strokeWidth="1.2" opacity=".5"/>
      <circle cx="60" cy="30" r="2.5" fill="#0d9488" style={{animation:"np 2s ease-in-out infinite"}}/>
      <circle cx="45" cy="75" r="2.5" fill="#0d9488" style={{animation:"np 2s ease-in-out infinite .7s"}}/>
      <path d="M60 55 L68 61 L68 75 Q68 82 60 86 Q52 82 52 75 L52 61Z" fill="none" stroke="#0d9488" strokeWidth="1.2"
        style={{animation:"ns 3s ease-in-out infinite"}}/>
    </svg>
  );
}

function PythonIllust() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes tc{0%,100%{opacity:1}50%{opacity:0}}`}</style></defs>
      <rect x="15" y="15" width="90" height="90" rx="6" fill="#1c1917" stroke="#44403c" strokeWidth=".8"/>
      <circle cx="26" cy="24" r="2.5" fill="#ef4444" opacity=".6"/><circle cx="34" cy="24" r="2.5" fill="#f59e0b" opacity=".6"/><circle cx="42" cy="24" r="2.5" fill="#22c55e" opacity=".6"/>
      <rect x="24" y="38" width="42" height="2.5" rx="1" fill="#f59e0b" opacity=".7"/>
      <rect x="24" y="46" width="60" height="2.5" rx="1" fill="#a8a29e" opacity=".35"/>
      <rect x="30" y="54" width="48" height="2.5" rx="1" fill="#22c55e" opacity=".5"/>
      <rect x="30" y="62" width="36" height="2.5" rx="1" fill="#a8a29e" opacity=".35"/>
      <rect x="24" y="74" width="24" height="2.5" rx="1" fill="#8b5cf6" opacity=".5"/>
      <rect x="30" y="82" width="54" height="2.5" rx="1" fill="#f59e0b" opacity=".45"/>
      <rect x="24" y="92" width="2" height="8" rx="1" fill="#f59e0b" style={{animation:"tc 1.2s step-end infinite"}}/>
    </svg>
  );
}

function SqlIllust() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes sc{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}`}</style></defs>
      <rect x="8" y="18" width="42" height="55" rx="3" fill="none" stroke="#6366f1" strokeWidth="1" opacity=".4"/>
      <rect x="8" y="18" width="42" height="11" rx="3" fill="#6366f1" opacity=".1"/>
      <text x="29" y="27" textAnchor="middle" fill="#6366f1" fontSize="6" fontWeight="600" fontFamily="Inter">users</text>
      {[0,1,2].map(i=><g key={i}><rect x="12" y={34+i*12} width="16" height="2.5" rx="1" fill="#6366f1" opacity={.25+i*.05}/><rect x="32" y={34+i*12} width="12" height="2.5" rx="1" fill="#6366f1" opacity=".15"/></g>)}
      <rect x="70" y="18" width="42" height="55" rx="3" fill="none" stroke="#6366f1" strokeWidth="1" opacity=".4"/>
      <rect x="70" y="18" width="42" height="11" rx="3" fill="#6366f1" opacity=".1"/>
      <text x="91" y="27" textAnchor="middle" fill="#6366f1" fontSize="6" fontWeight="600" fontFamily="Inter">orders</text>
      {[0,1,2].map(i=><g key={i}><rect x="74" y={34+i*12} width="14" height="2.5" rx="1" fill="#6366f1" opacity={.25+i*.05}/><rect x="92" y={34+i*12} width="16" height="2.5" rx="1" fill="#6366f1" opacity=".15"/></g>)}
      <path d="M50 40 Q60 40 70 40" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" opacity=".4"
        style={{animation:"sc 2s ease-in-out infinite alternate"}}/>
      <path d="M50 52 Q60 52 70 52" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" opacity=".3"
        style={{animation:"sc 2s ease-in-out infinite alternate .5s"}}/>
      <rect x="22" y="88" width="76" height="18" rx="4" fill="#6366f1" opacity=".06"/>
      <rect x="28" y="94" width="30" height="2.5" rx="1" fill="#6366f1" opacity=".35"/>
      <rect x="64" y="94" width="26" height="2.5" rx="1" fill="#22c55e" opacity=".35"/>
    </svg>
  );
}

function CloudIllust() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes cf{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes sb{0%,100%{fill:#22c55e;opacity:.4}50%{opacity:.9}}`}</style></defs>
      <g style={{animation:"cf 4s ease-in-out infinite"}}>
        <path d="M32 42Q32 26 48 26Q56 14 72 20Q92 18 96 38Q110 38 110 52Q110 65 96 65L32 65Q18 65 18 52Q18 42 32 42Z"
          fill="#0ea5e9" opacity=".07" stroke="#0ea5e9" strokeWidth=".8"/>
      </g>
      {[30,52,74].map((x,i)=><g key={i}>
        <rect x={x} y="78" width="16" height="24" rx="2" fill="none" stroke="#0ea5e9" strokeWidth=".8" opacity=".35"/>
        <rect x={x+2} y="81" width="12" height="1.5" rx=".75" fill="#0ea5e9" opacity=".25"/>
        <rect x={x+2} y="85" width="12" height="1.5" rx=".75" fill="#0ea5e9" opacity=".25"/>
        <circle cx={x+12} cy="97" r="1.5" style={{animation:`sb 2s ease-in-out infinite ${i*.4}s`}}/>
      </g>)}
    </svg>
  );
}

function DataIllust() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs><style>{`@keyframes bg{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes td{from{stroke-dashoffset:160}to{stroke-dashoffset:0}}@keyframes da{from{r:0;opacity:0}to{r:3;opacity:1}}`}</style></defs>
      <line x1="18" y1="98" x2="105" y2="98" stroke="#8b5cf6" strokeWidth=".8" opacity=".25"/>
      <line x1="18" y1="98" x2="18" y2="18" stroke="#8b5cf6" strokeWidth=".8" opacity=".25"/>
      {[{x:26,h:30},{x:42,h:50},{x:58,h:38},{x:74,h:62},{x:90,h:44}].map((b,i)=>
        <rect key={i} x={b.x} y={98-b.h} width="10" height={b.h} rx="1.5" fill="#8b5cf6" opacity=".18"
          style={{transformOrigin:`${b.x+5}px 98px`,animation:`bg .8s cubic-bezier(.34,1.56,.64,1) ${i*.1}s both`}}/>)}
      <polyline points="31,72 47,54 63,65 79,40 95,58" fill="none" stroke="#8b5cf6" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="160" strokeDashoffset="160"
        style={{animation:"td 2s ease-out .4s forwards"}}/>
      {[[31,72],[47,54],[63,65],[79,40],[95,58]].map(([cx,cy],i)=>
        <circle key={i} cx={cx} cy={cy} r="0" fill="#8b5cf6" style={{animation:`da .3s cubic-bezier(.34,1.56,.64,1) ${.7+i*.12}s both`}}/>)}
    </svg>
  );
}

const SKILL_ILLUSTS = {
  "network-security": NetworkIllust, "python-basics": PythonIllust,
  "sql-databases": SqlIllust, "cloud-architecture": CloudIllust, "data-analysis": DataIllust,
};


/* ═══════════════════════════════════════════════════════════════════════
   SKILL PATH — compact horizontal node chain
   ═══════════════════════════════════════════════════════════════════════ */

function SkillPath({ relevantSkills, progress, activeSkill, getSkillProgress, accent }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2">
      {relevantSkills.map((skill, i) => {
        const sp = getSkillProgress(skill.id);
        const done = progress.completedSkills.includes(skill.id);
        const active = activeSkill?.id === skill.id;
        const locked = !done && !active;

        return (
          <div key={skill.id} className="flex items-center gap-3 shrink-0">
            <Link to={`/skills/${skill.slug}`}
              className={`group flex flex-col items-center gap-1.5 transition-all duration-200 ${locked ? "opacity-35" : ""}`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done ? "text-white" :
                  active ? "border-2" :
                  "border border-dashed border-ink/20 text-pencil"
                }`}
                style={{
                  backgroundColor: done ? accent : undefined,
                  borderColor: active ? accent : undefined,
                  color: active ? accent : undefined,
                  ...(active ? { boxShadow: `0 0 0 3px ${accent}15` } : {}),
                }}
              >
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8L7 11L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : locked ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" opacity=".4">
                    <rect x="3" y="8" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 8V5.5C5 3.5 6.5 2 8 2S11 3.5 11 5.5V8" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ) : (
                  `${sp.completed}/${sp.total}`
                )}
              </div>
              <span className={`text-xs font-semibold text-center leading-tight max-w-[80px] ${
                active ? "text-ink" : done ? "text-ink/60" : "text-pencil/30"
              }`}>
                {skill.name}
              </span>
              {active && (
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>Active</span>
              )}
            </Link>
            {i < relevantSkills.length - 1 && (
              <div className={`w-8 h-[2px] shrink-0 ${done ? "" : "border-t border-dashed border-ink/12"}`}
                style={done ? { backgroundColor: accent, opacity: 0.3 } : undefined} />
            )}
          </div>
        );
      })}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD — Career Document Layout
   ═══════════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const {
    profile, isOnboarded, progress, xp, level,
    getCurrentLesson, getSkillProgress, getLessonProgress,
  } = useProgress();

  const [streak, setStreak] = useState(0);
  const [weekDays, setWeekDays] = useState([]);
  useEffect(() => { recordVisit(); setStreak(computeStreak()); setWeekDays(getWeekVisits()); }, []);

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
    <div className="pb-16">
      <style>{`
        @keyframes flameSway{0%,100%{transform:translateX(0) scaleY(1)}33%{transform:translateX(-1px) scaleY(1.04)}66%{transform:translateX(1px) scaleY(.97)}}
        @keyframes sIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fillW{from{width:0}}
        @keyframes breatheDot{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.3);opacity:1}}
        @keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 var(--pc,rgba(40,86,166,.3))}50%{box-shadow:0 0 0 5px var(--pc,rgba(40,86,166,0))}}
        @keyframes radarSweep{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>

      {/* ═══════════════════════════════════════════════════════════
          HEADER: Career document title + stats + streak
          ═══════════════════════════════════════════════════════════ */}
      <header className="mb-8" style={{ animation: "sIn .6s ease-out both" }}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accent }}>
              Your Career Path
            </p>
            <h1 className="font-sans text-3xl lg:text-4xl font-bold text-ink leading-tight tracking-tight">
              {fieldName}
            </h1>
            <p className="font-sans text-sm text-pencil mt-1.5">
              {profile.year}{ys} Year &middot; {profile.program}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-5 text-center">
              <div>
                <span className="font-mono text-lg font-bold text-ink leading-none block">{xpCount}</span>
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-pencil">XP</span>
              </div>
              <div className="w-px h-8 bg-ink/8" />
              <div>
                <span className="font-sans text-lg font-bold leading-none block" style={{ color: accent }}>LVL {level}</span>
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-pencil">Level</span>
              </div>
              <div className="w-px h-8 bg-ink/8" />
              <div>
                <span className="font-mono text-lg font-bold text-ink leading-none block">{completedLessons}/{totalLessons}</span>
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-pencil">Lessons</span>
              </div>
            </div>

            {/* Streak + day tracker */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {weekDays.map((day, i) => (
                  <div key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      day.visited ? "text-white" : day.isToday ? "border-[1.5px] text-pencil" : "text-pencil/25 bg-ink/[0.03]"
                    }`}
                    style={{
                      backgroundColor: day.visited ? accent : undefined,
                      borderColor: day.isToday && !day.visited ? accent : undefined,
                      ...(day.isToday && !day.visited ? { "--pc": `${accent}30`, animation: "pulseRing 2.5s ease-in-out infinite" } : {}),
                    }}>
                    {day.label}
                  </div>
                ))}
              </div>
              <StreakFlame streak={streak} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 h-px bg-ink/6" />
      </header>


      {/* ═══════════════════════════════════════════════════════════
          MAIN: Two-column layout — Learning | Certifications
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start mb-10" style={{ animation: "sIn .6s ease-out .1s both" }}>

        {/* ──────── LEFT COLUMN: Learning ──────── */}
        <div className="space-y-6">
          {/* Continue Learning Card */}
          {activeSkill && currentLesson && !allDone ? (
            <Link
              to={`/skills/${activeSkill.slug}/${currentLesson.id}`}
              className="group block bg-card border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,.06)] rounded-xl p-5 lg:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="grid grid-cols-[1fr_100px] gap-5 items-start">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent, animation: "breatheDot 2s ease-in-out infinite" }} />
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-pencil">{activeSkill.name}</span>
                  </div>
                  <h2 className="font-sans text-2xl font-bold text-ink leading-tight mb-1.5">{currentLesson.title}</h2>
                  <p className="font-sans text-sm text-pencil">
                    Lesson {currentLesson.number} of {skillLessons.length}
                    <span className="mx-1.5 text-ink/10">&middot;</span>
                    ~{currentLesson.estimatedMinutes} min
                  </p>

                  {/* Phase blocks */}
                  <div className="flex items-center gap-1.5 mt-4">
                    {["learn", "apply", "challenge"].map(phase => {
                      const steps = currentLesson.phases[phase]?.steps || 0;
                      const lt = currentLesson.phases.learn.steps, at = currentLesson.phases.apply.steps;
                      let ps = 0; if (phase === "apply") ps = lt; if (phase === "challenge") ps = lt + at;
                      const pc = Math.max(0, Math.min(steps, lessonProg.completed - ps));
                      const complete = pc >= steps, isActive = phase === currentPhase;
                      return (
                        <div key={phase} className="flex-1">
                          <div className={`h-8 rounded-md flex items-center justify-center text-xs font-semibold uppercase tracking-wider ${
                            complete ? "text-white" : isActive ? "text-white" : "text-pencil/30 bg-ink/[0.04]"
                          }`} style={{
                            backgroundColor: complete || isActive ? accent : undefined,
                            opacity: complete ? 0.8 : isActive ? 1 : 0.5,
                          }}>
                            {complete && <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="mr-1"><path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            {phase}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex-1 mr-4">
                      <div className="h-[2px] w-full rounded-full bg-faint overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          backgroundColor: accent,
                          width: lessonProg.total > 0 ? `${(lessonProg.completed / lessonProg.total) * 100}%` : "0%",
                          animation: "fillW 1s ease-out .5s both",
                        }} />
                      </div>
                      <span className="font-sans text-xs text-pencil mt-1 block">{lessonProg.completed}/{lessonProg.total} steps</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-white rounded-lg px-6 py-3 font-sans text-sm font-semibold transition-all group-hover:shadow-md shrink-0"
                      style={{ backgroundColor: accent }}>
                      Continue
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block" style={{ width: 100, height: 100 }}>
                  <Illust />
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-card border-[1.5px] border-ink/12 rounded-xl p-6 text-center">
              <p className="font-sans text-lg font-bold text-ink">All caught up!</p>
              <p className="text-sm text-pencil mt-1">New content coming soon.</p>
            </div>
          )}

          {/* Skill Path */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-sm font-semibold uppercase tracking-wider text-pencil">Your Skills</span>
              <span className="font-sans text-xs text-pencil">{progress.completedSkills.length}/{relevantSkills.length} mastered</span>
            </div>
            <div className="bg-card border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,.06)] rounded-xl px-5 py-4">
              <SkillPath relevantSkills={relevantSkills} progress={progress}
                activeSkill={activeSkill} getSkillProgress={getSkillProgress} accent={accent} />
            </div>
          </div>
        </div>

        {/* ──────── RIGHT COLUMN: Certification Roadmap ──────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-sm font-semibold uppercase tracking-wider text-pencil">Certification Roadmap</span>
            <Link to={`/fields/${profile.field}`}
              className="group flex items-center gap-1 font-sans text-xs font-semibold hover:underline" style={{ color: accent }}>
              Full details
              <svg width="8" height="8" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="space-y-3">
            {stages.map((stg, si) => {
              const isCurrent = si === 0;
              return (
                <div key={stg.stage}
                  className={`bg-card border-[1.5px] rounded-xl transition-all duration-300 ${
                    isCurrent ? "border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,.06)]" : "border-ink/6 opacity-50"
                  }`}
                  style={undefined}
                >
                  {/* Stage header */}
                  <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent ? "text-white" : "text-pencil border border-ink/12"
                      }`} style={isCurrent ? { backgroundColor: accent } : undefined}>
                        {stg.stage}
                      </div>
                      <span className="font-sans text-base font-semibold text-ink">{stg.stageName}</span>
                    </div>
                    <span className="font-mono text-xs text-pencil">
                      ~{stg.totalWeeks >= 52 ? `${Math.round(stg.totalWeeks / 4)} mo` : `${stg.totalWeeks} wk`}
                    </span>
                  </div>

                  {/* Cert list — each clickable */}
                  <div className="border-t border-ink/5">
                    {stg.certs.map((cert, ci) => (
                      <Link key={cert.id}
                        to={`/fields/${profile.field}/certs/${cert.id}`}
                        className={`group flex items-center justify-between px-5 py-3 transition-colors hover:bg-paper/60 ${
                          ci < stg.certs.length - 1 ? "border-b border-ink/[0.04]" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-sans text-sm font-semibold text-ink group-hover:text-ink truncate transition-colors">
                            {cert.name}
                          </p>
                          <p className="font-sans text-xs text-pencil mt-0.5">
                            {cert.provider}
                            {cert.costPln > 0 && <> &middot; {cert.costPln.toLocaleString()} PLN</>}
                            {cert.costPln === 0 && <> &middot; Free</>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0 ml-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            cert.difficulty === "beginner" ? "bg-emerald-50 text-emerald-600" :
                            cert.difficulty === "intermediate" ? "bg-amber-50 text-amber-600" :
                            cert.difficulty === "advanced" ? "bg-orange-50 text-orange-600" :
                            "bg-red-50 text-red-600"
                          }`}>
                            {cert.difficulty}
                          </span>
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-pencil/30 group-hover:text-ink/50 transition-colors">
                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {isCurrent && (
                    <div className="px-5 py-2.5 border-t border-ink/5">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>In Progress</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════
          JOBS: Full-width career opportunities
          ═══════════════════════════════════════════════════════════ */}
      <section
        ref={jobsReveal.ref}
        className="transition-all duration-700"
        style={{
          opacity: jobsReveal.isVisible ? 1 : 0,
          transform: jobsReveal.isVisible ? "translateY(0)" : "translateY(16px)",
          animation: "sIn .6s ease-out .2s both",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm font-semibold uppercase tracking-wider text-pencil">Career Opportunities</span>
            {matchingJobs.length > 0 && (
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${accent}12`, color: accent }}>
                {matchingJobs.length} matches
              </span>
            )}
          </div>
          <Link to="/jobs" className="group flex items-center gap-1 font-sans text-xs font-semibold hover:underline" style={{ color: accent }}>
            Browse all jobs
            <svg width="8" height="8" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {matchingJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matchingJobs.slice(0, 6).map((job, i) => {
              return (
                <Link key={job.id} to={`/jobs/${job.id}`}
                  className="group bg-card border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,.06)] rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span className={`inline-block rounded-full border px-2 py-0.5 font-sans text-xs font-semibold ${job.type === "Internship" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                      {job.type}
                    </span>
                    <span className="font-mono text-base font-bold shrink-0" style={{ color: accent }}>
                      {(job.salaryMin / 1000).toFixed(0)}–{(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-ink group-hover:text-ink leading-tight">{job.title}</h3>
                  <p className="font-sans text-sm text-pencil mt-1">{job.company}</p>
                  <p className="font-sans text-xs text-pencil mt-0.5">{job.location} &middot; {job.type}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border-[1.5px] border-ink/12 rounded-xl p-6 text-center">
            <p className="font-sans text-sm font-semibold text-ink">Complete more skills to unlock job matches</p>
            <p className="font-sans text-xs text-pencil mt-1">Your skills connect directly to real job listings.</p>
          </div>
        )}
      </section>
    </div>
  );
}
