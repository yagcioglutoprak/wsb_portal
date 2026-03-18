import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { lessons, skills } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import useProgress from "../hooks/useProgress";

const PHASE_ORDER = ["learn", "apply", "challenge"];

/* Star burst particle for completion celebration */
function CelebrationStar({ index, total }) {
  const angle = (index / total) * 360;
  const distance = 60 + Math.random() * 50;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  const colors = ["#2856a6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
  const color = colors[index % colors.length];
  const size = 6 + Math.random() * 8;
  const delay = index * 0.06;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: index % 2 === 0 ? "50%" : "2px",
        left: "50%",
        top: "50%",
        transform: "scale(0)",
        animation: `confettiBurst 0.8s ease-out ${delay}s forwards`,
      }}
    />
  );
}

export default function LessonViewer() {
  const { skillSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === lessonId);
  const skill = skills.find((s) => s.slug === skillSlug);
  const { progress, completeStep, completeLesson, completeSkill, xp } =
    useProgress();

  const [currentPhase, setCurrentPhase] = useState("learn");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [xpDelta, setXpDelta] = useState(null);
  const [xpBouncing, setXpBouncing] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const prevXpRef = useRef(xp);

  const LessonComponent = lessonRegistry[lessonId];

  // Track XP changes for animation
  useEffect(() => {
    if (xp > prevXpRef.current) {
      const delta = xp - prevXpRef.current;
      setXpDelta(delta);
      setXpBouncing(true);
      const t1 = setTimeout(() => setXpDelta(null), 1500);
      const t2 = setTimeout(() => setXpBouncing(false), 500);
      prevXpRef.current = xp;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevXpRef.current = xp;
  }, [xp]);

  const handleComplete = useCallback(() => {
    const stepId = `${lessonId}-${currentPhase}-${currentStepIndex + 1}`;
    completeStep(stepId);
  }, [lessonId, currentPhase, currentStepIndex, completeStep]);

  const handleNext = useCallback(() => {
    const phaseSteps = lesson.phases[currentPhase].steps;
    if (currentStepIndex < phaseSteps - 1) {
      setCurrentStepIndex((i) => i + 1);
      setContentKey((k) => k + 1);
      return;
    }
    // Move to next phase
    const phaseIdx = PHASE_ORDER.indexOf(currentPhase);
    if (phaseIdx < PHASE_ORDER.length - 1) {
      setCurrentPhase(PHASE_ORDER[phaseIdx + 1]);
      setCurrentStepIndex(0);
      setContentKey((k) => k + 1);
      return;
    }
    // Lesson complete -- show celebration
    setShowCompletion(true);
    completeLesson(lessonId);
    // Check if skill is complete
    const skillLessons = lessons.filter((l) => l.skillId === skill.id);
    const allDone = skillLessons.every(
      (l) =>
        l.id === lessonId || progress.completedLessons.includes(l.id)
    );
    if (allDone) completeSkill(skill.id);

    // Navigate after celebration
    setTimeout(() => {
      navigate(`/skills/${skillSlug}`);
    }, 3000);
  }, [
    lesson,
    currentPhase,
    currentStepIndex,
    lessonId,
    skill,
    skillSlug,
    completeLesson,
    completeSkill,
    progress.completedLessons,
    navigate,
  ]);



  if (!lesson || !skill) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-graphite">Lesson not found.</p>
      </div>
    );
  }

  if (!LessonComponent) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-paper px-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-ink/5">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-ink">Coming Soon</h2>
        <p className="mt-2 max-w-sm text-graphite">
          We're building <span className="font-semibold text-ink">{lesson.title}</span> right now. Check back soon!
        </p>
        <Link
          to={`/lessons`}
          className="mt-8 rounded-xl bg-rust px-6 py-3 text-sm font-semibold text-white hover:bg-rust/90 transition-colors"
        >
          Back to Lessons
        </Link>
      </div>
    );
  }

  const stepId = `${lessonId}-${currentPhase}-${currentStepIndex + 1}`;
  const isStepDone = progress.completedSteps.includes(stepId);
  const isLastStep =
    currentPhase === "challenge" &&
    currentStepIndex === lesson.phases.challenge.steps - 1;

  // Completion overlay
  if (showCompletion) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-gradient-to-br from-paper via-white to-paper">
        {/* Background radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative text-center">
          {/* Celebration particles */}
          <div className="pointer-events-none absolute inset-0 -inset-x-20 -inset-y-20 overflow-visible">
            {Array.from({ length: 20 }, (_, i) => (
              <CelebrationStar key={i} index={i} total={20} />
            ))}
          </div>

          <div
            style={{
              animation: "scaleBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <div
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%)",
                boxShadow: "0 8px 32px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  style={{
                    strokeDasharray: 60,
                    strokeDashoffset: 0,
                    animation: "checkDraw 0.8s ease-out forwards",
                  }}
                />
                <path
                  d="M22 4L12 14.01l-3-3"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 0,
                    animation: "checkDraw 0.4s ease-out 0.4s forwards",
                  }}
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-ink">Lesson Complete!</h2>
            <p className="mt-2 text-graphite">{lesson.title}</p>

            <div
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2"
              style={{
                background: "linear-gradient(135deg, rgba(40, 86, 166, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)",
                animation: "countUp 0.5s ease-out 0.3s both",
              }}
            >
              <span className="text-lg font-bold text-rust">+{lesson.xp || 30} XP</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total progress
  const trackSteps = (lesson.phases.learn?.steps || 0) + (lesson.phases.apply?.steps || 0);
  const challengeSteps = lesson.phases.challenge?.steps || 0;

  let absoluteStepIndex = 0;
  for (const phase of PHASE_ORDER) {
    if (phase === currentPhase) {
      absoluteStepIndex += currentStepIndex;
      break;
    }
    absoluteStepIndex += lesson.phases[phase]?.steps || 0;
  }

  const trackProgress =
    absoluteStepIndex >= trackSteps
      ? 100
      : (absoluteStepIndex / Math.max(1, trackSteps)) * 100;

  return (
    <div className="flex h-screen flex-col bg-paper">
      {/* Top menu bar (Brilliant style) */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 bg-[#fdfcfa] border-b-[1.5px] border-ink/5">
        <Link
          to={`/skills/${skillSlug}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink/80"
          title="Exit lesson"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </Link>

        {/* Center Progress Container */}
        <div className="flex flex-1 items-center justify-center gap-2 px-8 max-w-2xl">
          {/* Main track */}
          <div className="relative h-2.5 flex-1 rounded-full bg-paper overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 rounded-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${trackProgress}%` }}
            />
          </div>

          {/* Challenge dots */}
          {Array.from({ length: challengeSteps }).map((_, i) => {
            const isFilled = absoluteStepIndex >= trackSteps + i;
            return (
              <div
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${
                  isFilled ? "bg-emerald-500" : "bg-paper"
                }`}
              />
            );
          })}
        </div>

        {/* Right side XP/streak */}
        <div className="relative flex items-center gap-1.5 font-bold text-ink">
          <span className={`text-lg transition-transform duration-300 ${xpBouncing ? 'animate-xp-bounce text-emerald-500' : ''}`}>
            {xp}
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
          </svg>
          {/* XP delta animation */}
          {xpDelta !== null && (
            <span
              className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-emerald-500"
              style={{
                animation: "counter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            >
              +{xpDelta}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
        <div className="mx-auto w-full max-w-4xl flex-1 flex flex-col justify-center pt-8 pb-12">
          <div className="mb-8">
            <p className="mb-2 text-center font-sans text-sm font-bold uppercase tracking-wider text-ink/40">
              {currentPhase} &middot; Step {currentStepIndex + 1}
            </p>
          </div>

          <div
            key={contentKey}
            className="flex-1 flex flex-col justify-center items-center"
            style={{
              animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-rust" />
                </div>
              }
            >
              <LessonComponent
                currentPhase={currentPhase}
                currentStep={currentStepIndex}
                onComplete={handleComplete}
              />
            </Suspense>
          </div>

          {/* Next button */}
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleNext}
              disabled={!isStepDone}
              className={[
                "group relative flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all duration-300",
                isStepDone
                  ? "bg-emerald-500 shadow-[0_4px_0_0_#059669] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#059669] active:translate-y-1 active:shadow-[0_0_0_0_#059669]"
                  : "cursor-not-allowed bg-rust/40 shadow-[0_4px_0_0_rgba(191,78,50,0.4)] opacity-70",
              ].join(" ")}
            >
              {isLastStep && isStepDone && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                  <div className="shimmer-btn absolute inset-0" />
                </div>
              )}
              <span className="relative">
                {isLastStep ? "Complete Lesson" : "Continue"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
