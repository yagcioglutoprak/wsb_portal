import { Navigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fields, certifications, skills, lessons, jobs, skillJobMap } from "../data/mock";
import useProgress from "../hooks/useProgress";
import useScrollReveal from "../hooks/useScrollReveal";

/* ── Animated firewall SVG for continue-learning card ─────────────────── */
function FirewallIllustration() {
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
      <defs>
        <style>{`
          @keyframes brickAppear {
            from { opacity: 0; transform: scaleY(0); }
            to { opacity: 1; transform: scaleY(1); }
          }
          @keyframes shieldDraw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes packetFlyRight {
            0% { opacity: 0; cx: 10; }
            15% { opacity: 1; }
            50% { opacity: 1; cx: 55; }
            55% { opacity: 1; cx: 55; }
            70% { opacity: 1; cx: 55; }
            100% { opacity: 1; cx: 120; }
          }
          @keyframes packetBounce {
            0% { opacity: 0; cx: 10; }
            15% { opacity: 1; }
            50% { opacity: 1; cx: 50; }
            55% { opacity: 0.8; cx: 46; }
            100% { opacity: 0; cx: 10; }
          }
          @keyframes dashedPulse {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.35; }
          }
        `}</style>
      </defs>

      {/* Dashed network lines */}
      <line x1="10" y1="70" x2="55" y2="70" stroke="#2856a6" strokeWidth="1" strokeDasharray="4 3"
        style={{ animation: "dashedPulse 2.5s ease-in-out infinite" }} />
      <line x1="85" y1="70" x2="130" y2="70" stroke="#2856a6" strokeWidth="1" strokeDasharray="4 3"
        style={{ animation: "dashedPulse 2.5s ease-in-out infinite 0.5s" }} />

      {/* Wall base */}
      <rect x="55" y="35" width="30" height="70" rx="3" fill="#e8e4de" opacity="0.5" />

      {/* Bricks - staggered appearance */}
      {[
        { x: 57, y: 38, w: 12, h: 8, d: "0.3s" },
        { x: 71, y: 38, w: 12, h: 8, d: "0.5s" },
        { x: 57, y: 49, w: 12, h: 8, d: "0.7s" },
        { x: 71, y: 49, w: 12, h: 8, d: "0.9s" },
        { x: 57, y: 60, w: 12, h: 8, d: "1.1s" },
        { x: 71, y: 60, w: 12, h: 8, d: "1.3s" },
        { x: 57, y: 71, w: 12, h: 8, d: "1.5s" },
        { x: 71, y: 71, w: 12, h: 8, d: "1.7s" },
        { x: 57, y: 82, w: 12, h: 8, d: "1.9s" },
        { x: 71, y: 82, w: 12, h: 8, d: "2.1s" },
        { x: 57, y: 93, w: 12, h: 8, d: "2.3s" },
        { x: 71, y: 93, w: 12, h: 8, d: "2.5s" },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5"
          fill="#2856a6" opacity="0.75"
          style={{
            transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h}px`,
            animation: `brickAppear 0.4s ease-out ${b.d} both`,
          }}
        />
      ))}

      {/* Shield outline drawn with stroke animation */}
      <path
        d="M70 20 L82 28 L82 48 Q82 58 70 64 Q58 58 58 48 L58 28 Z"
        fill="none" stroke="#2856a6" strokeWidth="1.5"
        strokeDasharray="120" strokeDashoffset="120"
        style={{ animation: "shieldDraw 1.5s ease-out 1s forwards" }}
      />

      {/* Packets - some pass through, some bounce */}
      <circle r="3" cy="60" fill="#2856a6" opacity="0"
        style={{ animation: "packetFlyRight 3s ease-in-out 2s infinite" }} />
      <circle r="3" cy="80" fill="#2856a6" opacity="0"
        style={{ animation: "packetFlyRight 3s ease-in-out 3.2s infinite" }} />
      <circle r="3" cy="70" fill="#dc2626" opacity="0"
        style={{ animation: "packetBounce 2.5s ease-in-out 2.6s infinite" }} />
      <circle r="2.5" cy="50" fill="#dc2626" opacity="0"
        style={{ animation: "packetBounce 2.5s ease-in-out 3.8s infinite" }} />

      {/* Source & destination nodes */}
      <circle cx="10" cy="70" r="4" fill="none" stroke="#2856a6" strokeWidth="1" opacity="0.4" />
      <circle cx="130" cy="70" r="4" fill="none" stroke="#2856a6" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* ── Animated progress ring SVG ───────────────────────────────────────── */
function ProgressRing({ progress }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - progress);

  return (
    <div className="relative h-[110px] w-[110px] shrink-0">
      <svg
        viewBox="0 0 110 110"
        className="h-full w-full"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="55" cy="55" r={radius}
          stroke="#e8e4de" strokeWidth="5" fill="none"
        />
        <circle
          cx="55" cy="55" r={radius}
          stroke="#2856a6" strokeWidth="5" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            animation: `ringFill 1.4s ease-out 0.5s forwards`,
            "--target-offset": targetOffset,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: "none" }}>
        <span className="font-sans text-xl font-bold text-ink">
          {Math.round(progress * 100)}%
        </span>
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
          Complete
        </span>
      </div>
    </div>
  );
}

/* ── Stage icon SVGs ──────────────────────────────────────────────────── */
function StageIcon({ stage }) {
  const icons = {
    1: ( // Shield - Foundation
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 2L20 6V12C20 17 16.5 20.5 12 22C7.5 20.5 4 17 4 12V6L12 2Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    2: ( // Wrench - Associate / Hands-On
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    3: ( // Star - Professional
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    4: ( // Crown - Expert
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M2 20H22L20 8L15 12L12 4L9 12L4 8L2 20Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 20V22H19V20" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[stage] || icons[1];
}

/* ── Stat icon SVGs ───────────────────────────────────────────────────── */
function StatIcon({ type }) {
  if (type === "lessons") return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
      <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
        <path d="M4 3H16C16.5523 3 17 3.44772 17 4V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3Z"
          stroke="#2856a6" strokeWidth="1.3" />
        <path d="M7 7H13M7 10H13M7 13H10" stroke="#2856a6" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </div>
  );
  if (type === "skills") return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
      <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
        <path d="M10 2L12.4 7.3L18 8L14 12L15 17.5L10 14.8L5 17.5L6 12L2 8L7.6 7.3L10 2Z"
          stroke="#d97706" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
  if (type === "badges") return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
      <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
        <circle cx="10" cy="8" r="5" stroke="#7c3aed" strokeWidth="1.3" />
        <path d="M7 13L6 18L10 16L14 18L13 13" stroke="#7c3aed" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
      <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
        <rect x="2" y="7" width="4" height="10" rx="1" stroke="#059669" strokeWidth="1.3" />
        <rect x="8" y="4" width="4" height="13" rx="1" stroke="#059669" strokeWidth="1.3" />
        <rect x="14" y="2" width="4" height="15" rx="1" stroke="#059669" strokeWidth="1.3" />
      </svg>
    </div>
  );
}

/* ── Main Dashboard ───────────────────────────────────────────────────── */
export default function Dashboard() {
  const {
    profile, isOnboarded, progress, xp, level,
    getCurrentLesson, getSkillProgress, getLessonProgress,
  } = useProgress();

  const roadmapReveal = useScrollReveal();
  const skillsReveal = useScrollReveal();
  const jobsReveal = useScrollReveal();

  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  // Field info
  const field = fields.find((f) => f.id === profile.field);
  const fieldName = field?.name?.toUpperCase() || profile.field.toUpperCase();

  // Relevant skills for this field
  const relevantSkills = skills.filter((s) => s.fieldIds.includes(profile.field));

  // Active skill = first not completed
  const activeSkill =
    relevantSkills.find((s) => !progress.completedSkills.includes(s.id)) ||
    relevantSkills[0];

  // Current lesson
  const currentLesson = activeSkill ? getCurrentLesson(activeSkill.id) : null;
  const currentLessonProgress = currentLesson
    ? getLessonProgress(currentLesson.id)
    : { completed: 0, total: 0 };
  const activeSkillProgress = activeSkill
    ? getSkillProgress(activeSkill.id)
    : { completed: 0, total: 0 };
  const activeSkillLessons = activeSkill
    ? lessons.filter((l) => l.skillId === activeSkill.id)
    : [];

  // Matching jobs
  const matchingJobIds = [
    ...new Set(relevantSkills.flatMap((s) => skillJobMap[s.id] || [])),
  ];
  const matchingJobs = jobs.filter((j) => matchingJobIds.includes(j.id));
  const displayJobs = matchingJobs.slice(0, 5);

  // Lesson progress
  const totalLessons = lessons.length;
  const completedLessons = progress.completedLessons.length;
  const completedSkillsCount = progress.completedSkills.length;
  const progressRatio = totalLessons > 0 ? completedLessons / totalLessons : 0;

  // Certifications by stage for roadmap
  const fieldCerts = certifications[profile.field] || [];
  const stageMap = {};
  fieldCerts.forEach((cert) => {
    if (!stageMap[cert.stage]) {
      stageMap[cert.stage] = {
        stage: cert.stage,
        stageName: cert.stageName,
        certs: [],
        totalWeeks: 0,
      };
    }
    stageMap[cert.stage].certs.push(cert);
    stageMap[cert.stage].totalWeeks += cert.durationWeeks;
  });
  const stages = Object.values(stageMap).sort((a, b) => a.stage - b.stage);

  // Determine current phase for the current lesson
  const currentPhase = currentLesson
    ? (() => {
        const learnSteps = currentLesson.phases.learn.steps;
        const applySteps = currentLesson.phases.apply.steps;
        if (currentLessonProgress.completed < learnSteps) return "Learn";
        if (currentLessonProgress.completed < learnSteps + applySteps) return "Apply";
        return "Challenge";
      })()
    : "Learn";

  // Determine current step within phase
  const currentStepInPhase = currentLesson
    ? (() => {
        const learnSteps = currentLesson.phases.learn.steps;
        const applySteps = currentLesson.phases.apply.steps;
        const c = currentLessonProgress.completed;
        if (c < learnSteps) return c + 1;
        if (c < learnSteps + applySteps) return c - learnSteps + 1;
        return c - learnSteps - applySteps + 1;
      })()
    : 1;

  const totalStepsInPhase = currentLesson
    ? currentLesson.phases[currentPhase.toLowerCase()]?.steps || 1
    : 1;

  // Skill statuses for the skill list
  const getSkillStatus = (skill) => {
    if (progress.completedSkills.includes(skill.id)) return "completed";
    if (activeSkill && skill.id === activeSkill.id) return "active";
    const idx = relevantSkills.indexOf(skill);
    const activeIdx = relevantSkills.indexOf(activeSkill);
    if (idx === activeIdx + 1) return "next";
    return "locked";
  };

  return (
    <div className="space-y-10">
      {/* Global keyframes */}
      <style>{`
        @keyframes ringFill {
          to { stroke-dashoffset: var(--target-offset); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 0 0 rgba(40,86,166,0); }
          50% { opacity: 1; box-shadow: 0 0 0 5px rgba(40,86,166,0.1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes stageAppear {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fillBar {
          from { width: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ═══ 1. WELCOME ROW ═══ */}
      <div
        className="flex items-center justify-between"
        style={{ animation: "fadeInUp 0.6s ease-out both" }}
      >
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-merito">
            Your Path &middot; {fieldName}
          </p>
          <h1 className="mt-1 font-sans text-3xl font-bold text-ink">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-pencil">
            {profile.year} year &middot; {profile.program}
          </p>
        </div>

        <ProgressRing progress={progressRatio} />
      </div>

      {/* ═══ 2. CONTINUE LEARNING + STATS ═══ */}
      <div
        className="grid gap-8"
        style={{
          gridTemplateColumns: "2fr 1fr",
          animation: "fadeInUp 0.6s ease-out 0.15s both",
        }}
      >
        {/* ── Continue Learning Card ── */}
        {activeSkill && currentLesson ? (
          <Link
            to={`/skills/${activeSkill.slug}/${currentLesson.id}`}
            className="group block bg-card border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 160px" }}>
              <div className="flex flex-col justify-between">
                {/* Overline with pulse dot */}
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-rust"
                      style={{ animation: "breathe 2s ease-in-out infinite" }}
                    />
                    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                      Continue where you left off
                    </span>
                  </div>

                  <h2 className="font-sans text-xl font-bold text-ink mb-1.5">
                    {currentLesson.title}
                  </h2>
                  <p className="text-sm text-pencil">
                    {activeSkill.name} &middot; Lesson {currentLesson.number} of{" "}
                    {activeSkillLessons.length}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="h-[3px] w-full rounded-full bg-faint overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rust"
                      style={{
                        width:
                          currentLessonProgress.total > 0
                            ? `${(currentLessonProgress.completed / currentLessonProgress.total) * 100}%`
                            : "0%",
                        animation: "fillBar 1s ease-out 0.6s both",
                      }}
                    />
                  </div>
                  <p className="mt-2 font-sans text-sm text-pencil">
                    Phase: {currentPhase} &middot; Step {currentStepInPhase} of{" "}
                    {totalStepsInPhase}
                  </p>
                </div>

                {/* Button */}
                <div className="mt-5">
                  <span className="inline-flex items-center gap-1.5 bg-rust text-white rounded-lg px-6 py-3 font-semibold text-sm transition-all duration-200 group-hover:shadow-md">
                    Continue lesson
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Firewall illustration */}
              <div className="hidden sm:flex items-center justify-center">
                <FirewallIllustration />
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-card border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="font-sans text-xl font-bold text-ink">All caught up!</p>
              <p className="mt-2 text-sm text-pencil">You have completed all available lessons.</p>
            </div>
          </div>
        )}

        {/* ── Stats Column ── */}
        <div className="flex flex-col gap-3">
          {[
            { type: "lessons", value: `${completedLessons}/${totalLessons}`, label: "Lessons Completed" },
            { type: "skills", value: `${completedSkillsCount}/${relevantSkills.length}`, label: "Skills Mastered" },
            { type: "badges", value: `${progress.earnedBadges.length}`, label: "Badges Earned" },
            { type: "jobs", value: `${matchingJobs.length}`, label: "Matching Jobs" },
          ].map((stat, i) => (
            <div
              key={stat.type}
              className="bg-card border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-4 flex items-center gap-4"
              style={{
                animation: `fadeSlideIn 0.5s ease-out ${0.3 + i * 0.15}s both`,
              }}
            >
              <StatIcon type={stat.type} />
              <div>
                <p className="font-sans text-xl font-bold text-ink leading-none">{stat.value}</p>
                <p className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 3. ROADMAP SECTION ═══ */}
      {stages.length > 0 && (
        <div
          ref={roadmapReveal.ref}
          className="transition-all duration-700"
          style={{
            opacity: roadmapReveal.isVisible ? 1 : 0,
            transform: roadmapReveal.isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
              Your Roadmap
            </p>
            <Link
              to={`/fields/${profile.field}`}
              className="group flex items-center gap-1 font-sans text-sm font-semibold text-rust hover:underline"
            >
              View full roadmap
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stages.map((stg, i) => {
              const isActive = i === 0;
              const certsInStage = stg.certs;
              const durationLabel =
                stg.totalWeeks >= 52
                  ? `${Math.round(stg.totalWeeks / 4)} mo`
                  : `${stg.totalWeeks} wk`;

              return (
                <div
                  key={stg.stage}
                  className={`bg-card border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] rounded-xl p-5 transition-all duration-300 ${
                    isActive ? "border-t-[3px] border-t-rust" : "opacity-50"
                  }`}
                  style={{
                    animation: roadmapReveal.isVisible
                      ? `stageAppear 0.5s ease-out ${i * 0.12}s both`
                      : "none",
                  }}
                >
                  {/* Stage icon + number */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                        isActive
                          ? "border-rust text-rust"
                          : "border-faint text-pencil"
                      }`}
                    >
                      <StageIcon stage={stg.stage} />
                    </div>
                    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                      Stage {stg.stage}
                    </span>
                  </div>

                  {/* Stage name */}
                  <p className="font-semibold text-ink text-sm mb-1">
                    {stg.stageName}
                  </p>

                  {/* Duration */}
                  <p className="font-sans text-sm text-pencil mb-3">
                    {durationLabel}
                  </p>

                  {/* Cert names */}
                  <div className="space-y-1 mb-3">
                    {certsInStage.map((cert) => (
                      <p
                        key={cert.id}
                        className="text-xs text-pencil truncate"
                        title={cert.name}
                      >
                        {cert.name}
                      </p>
                    ))}
                  </div>

                  {/* Active badge + mini progress */}
                  {isActive && (
                    <div>
                      <div className="h-[3px] w-full rounded-full bg-faint overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full bg-rust"
                          style={{
                            width: `${Math.max(5, (completedLessons / Math.max(totalLessons, 1)) * 100)}%`,
                            animation: "fillBar 1s ease-out 0.8s both",
                          }}
                        />
                      </div>
                      <span className="inline-block font-sans text-xs font-semibold uppercase tracking-wide text-rust">
                        In Progress
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ 4. BOTTOM ROW: SKILLS + OPPORTUNITIES ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ── Your Skills ── */}
        <div
          ref={skillsReveal.ref}
          className="transition-all duration-700"
          style={{
            opacity: skillsReveal.isVisible ? 1 : 0,
            transform: skillsReveal.isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil mb-5">
            Your Skills
          </p>

          <div className="divide-y divide-faint">
            {relevantSkills.map((skill) => {
              const sp = getSkillProgress(skill.id);
              const status = getSkillStatus(skill);
              const progressPct =
                sp.total > 0 ? (sp.completed / sp.total) * 100 : 0;

              return (
                <Link
                  key={skill.id}
                  to={`/skills/${skill.slug}`}
                  className="group block py-4 transition-colors duration-200 hover:bg-paper/50 -mx-2 px-2 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-semibold text-sm text-ink group-hover:text-rust transition-colors">
                      {skill.name}
                    </p>
                    {status === "active" && (
                      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-merito bg-merito/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                    {status === "completed" && (
                      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Done
                      </span>
                    )}
                    {status === "next" && (
                      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                        Up next
                      </span>
                    )}
                    {status === "locked" && (
                      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-pencil mb-2">
                    {sp.completed} of {sp.total} lessons &middot;{" "}
                    {status === "completed"
                      ? "all done"
                      : status === "active"
                        ? "in progress"
                        : status === "next"
                          ? "up next"
                          : "locked"}
                  </p>

                  {/* Mini progress bar */}
                  <div className="h-[3px] w-full rounded-full bg-faint overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === "completed" ? "bg-emerald-500" : "bg-rust"
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Matching Opportunities ── */}
        <div
          ref={jobsReveal.ref}
          className="transition-all duration-700"
          style={{
            opacity: jobsReveal.isVisible ? 1 : 0,
            transform: jobsReveal.isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
              Matching Opportunities
            </p>
            <Link
              to="/jobs"
              className="group flex items-center gap-1 font-sans text-sm font-semibold text-rust hover:underline"
            >
              See all
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="divide-y divide-faint">
            {displayJobs.map((job) => {
              const levelLabel =
                job.experienceLevel === "junior"
                  ? "Junior"
                  : job.experienceLevel === "mid"
                    ? "Mid"
                    : "Senior";

              return (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="group grid gap-3 py-4 transition-colors duration-200 hover:bg-paper/50 -mx-2 px-2 rounded-lg"
                  style={{ gridTemplateColumns: "50px 1fr auto" }}
                >
                  <div className="flex items-start pt-0.5">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
                      {levelLabel}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-ink group-hover:text-rust transition-colors">
                      {job.title}
                    </p>
                    <p className="text-xs text-pencil mt-0.5">
                      {job.company} &middot; {job.location}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-sans text-sm font-semibold text-rust whitespace-nowrap">
                      {job.salaryMin.toLocaleString()} PLN
                    </span>
                  </div>
                </Link>
              );
            })}

            {displayJobs.length === 0 && (
              <p className="py-6 text-center text-sm text-pencil">
                No matching opportunities yet. Complete more skills to unlock jobs.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
