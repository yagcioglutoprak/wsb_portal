import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { lessons, skills } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import useProgress from "../hooks/useProgress";
import LessonSidebar from "../components/LessonSidebar";

const PHASE_ORDER = ["learn", "apply", "challenge"];

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
  const [showCompletion, setShowCompletion] = useState(false);
  const prevXpRef = useRef(xp);

  const LessonComponent = lessonRegistry[lessonId];

  // Track XP changes for animation
  useEffect(() => {
    if (xp > prevXpRef.current) {
      const delta = xp - prevXpRef.current;
      setXpDelta(delta);
      const t = setTimeout(() => setXpDelta(null), 1200);
      prevXpRef.current = xp;
      return () => clearTimeout(t);
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
      return;
    }
    // Move to next phase
    const phaseIdx = PHASE_ORDER.indexOf(currentPhase);
    if (phaseIdx < PHASE_ORDER.length - 1) {
      setCurrentPhase(PHASE_ORDER[phaseIdx + 1]);
      setCurrentStepIndex(0);
      return;
    }
    // Lesson complete — show celebration
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
    }, 2500);
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
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-paper via-white to-paper">
        <div
          className="text-center"
          style={{
            animation: "counter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-ink">Lesson Complete!</h2>
          <p className="mt-2 text-graphite">{lesson.title}</p>
          <p className="mt-4 text-lg font-bold text-rust">+{lesson.xp || 30} XP</p>
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
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-3">
          <Link
            to={`/skills/${skillSlug}`}
            className="text-sm text-graphite transition-colors hover:text-rust"
          >
            <span className="mr-1">&larr;</span> {skill.name}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-pencil">
              Lesson {lesson.number} of{" "}
              {lessons.filter((l) => l.skillId === skill.id).length}
            </span>
            <div className="relative">
              <span className="inline-flex items-center rounded-full bg-rust/10 px-3 py-1 text-xs font-bold text-rust">
                {xp} XP
              </span>
              {/* XP delta animation */}
              {xpDelta !== null && (
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-500"
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
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-rust">
              {currentPhase} &middot; Step {currentStepIndex + 1}
            </p>

            <div
              key={`${currentPhase}-${currentStepIndex}`}
              className="animate-lesson-enter"
            >
              <Suspense
                fallback={
                  <div className="py-12 text-center text-pencil">
                    Loading lesson...
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
                  "rounded-xl px-8 py-3 text-sm font-bold text-white transition-all duration-300",
                  isStepDone
                    ? "bg-gradient-to-r from-rust to-blue-700 shadow-md shadow-rust/20 hover:shadow-lg hover:shadow-rust/30 hover:brightness-110 active:scale-[0.98]"
                    : "cursor-not-allowed bg-stone-300 opacity-50",
                ].join(" ")}
              >
                {isLastStep ? "Complete Lesson" : "Next \u2192"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
