import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { lessons, skills } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import useProgress from "../hooks/useProgress";
import LessonSidebar from "../components/LessonSidebar";

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

  const handleStepClick = useCallback((phase, stepIndex) => {
    setCurrentPhase(phase);
    setCurrentStepIndex(stepIndex);
    setContentKey((k) => k + 1);
  }, []);

  if (!lesson || !skill || !LessonComponent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-graphite">Lesson not found.</p>
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

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <LessonSidebar
        lesson={lesson}
        completedSteps={progress.completedSteps}
        currentPhase={currentPhase}
        currentStepIndex={currentStepIndex}
        onStepClick={handleStepClick}
      />
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Top bar with gradient bottom border */}
        <div
          className="relative flex items-center justify-between px-6 py-3"
          style={{
            background: "linear-gradient(to bottom, rgba(253, 252, 250, 0.95), rgba(253, 252, 250, 0.8))",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Gradient bottom border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(40, 86, 166, 0.15) 30%, rgba(40, 86, 166, 0.15) 70%, transparent 100%)",
            }}
          />

          <Link
            to={`/skills/${skillSlug}`}
            className="group flex items-center gap-1.5 text-sm text-graphite transition-colors hover:text-rust"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {skill.name}
          </Link>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-pencil tracking-wide">
              Lesson {lesson.number} of{" "}
              {lessons.filter((l) => l.skillId === skill.id).length}
            </span>
            <div className="relative">
              <span
                className={[
                  "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold text-rust transition-transform duration-300",
                  xpBouncing ? "animate-xp-bounce" : "",
                ].join(" ")}
                style={{
                  background: "linear-gradient(135deg, rgba(40, 86, 166, 0.08) 0%, rgba(59, 130, 246, 0.06) 100%)",
                  boxShadow: "0 1px 3px rgba(40, 86, 166, 0.1)",
                }}
              >
                {xp} XP
              </span>
              {/* XP delta animation */}
              {xpDelta !== null && (
                <span
                  className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-emerald-500"
                  style={{
                    animation: "counter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                  }}
                >
                  +{xpDelta}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6">
          <div className="mx-auto max-w-2xl">
            <p className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wider text-rust">
              {currentPhase} &middot; Step {currentStepIndex + 1}
            </p>

            <div
              key={contentKey}
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
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!isStepDone}
                className={[
                  "group relative flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white transition-all duration-300",
                  isStepDone
                    ? isLastStep
                      ? "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:brightness-110 active:scale-[0.98]"
                      : "bg-gradient-to-r from-rust to-blue-700 shadow-md shadow-rust/20 hover:shadow-lg hover:shadow-rust/30 hover:brightness-110 active:scale-[0.98]"
                    : "cursor-not-allowed bg-stone-300 opacity-50",
                ].join(" ")}
              >
                {/* Shimmer on complete */}
                {isLastStep && isStepDone && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <div className="shimmer-btn absolute inset-0" />
                  </div>
                )}
                <span className="relative">
                  {isLastStep ? "Complete Lesson" : "Next"}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={[
                    "relative transition-transform duration-200",
                    isStepDone ? "group-hover:translate-x-0.5" : "",
                  ].join(" ")}
                >
                  {isLastStep ? (
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
