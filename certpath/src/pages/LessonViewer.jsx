import { useState, useCallback, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { lessons, skills } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import useProgress from "../hooks/useProgress";
import LessonSidebar from "../components/LessonSidebar";

const PHASE_ORDER = ["learn", "apply", "challenge"];

export default function LessonViewer() {
  const { skillSlug, lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId);
  const skill = skills.find((s) => s.slug === skillSlug);
  const { progress, completeStep, completeLesson, completeSkill, xp } =
    useProgress();

  const [currentPhase, setCurrentPhase] = useState("learn");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const LessonComponent = lessonRegistry[lessonId];

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
    // Lesson complete
    completeLesson(lessonId);
    // Check if skill is complete
    const skillLessons = lessons.filter((l) => l.skillId === skill.id);
    const allDone = skillLessons.every(
      (l) =>
        l.id === lessonId || progress.completedLessons.includes(l.id)
    );
    if (allDone) completeSkill(skill.id);
  }, [
    lesson,
    currentPhase,
    currentStepIndex,
    lessonId,
    skill,
    completeLesson,
    completeSkill,
    progress.completedLessons,
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
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-3">
          <Link
            to={`/skills/${skillSlug}`}
            className="text-sm text-graphite hover:text-rust"
          >
            ← {skill.name}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-pencil">
              Lesson {lesson.number} of{" "}
              {lessons.filter((l) => l.skillId === skill.id).length}
            </span>
            <span className="rounded-full bg-rust/10 px-2 py-0.5 text-xs font-semibold text-rust">
              {xp} XP
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 px-8 py-6">
          <div className="mx-auto max-w-3xl">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-rust">
              {currentPhase} · Step {currentStepIndex + 1}
            </p>
            <Suspense
              fallback={
                <div className="py-12 text-center text-pencil">Loading lesson...</div>
              }
            >
              <LessonComponent
                currentPhase={currentPhase}
                currentStep={currentStepIndex}
                onComplete={handleComplete}
              />
            </Suspense>
            {/* Next button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!isStepDone}
                className="rounded-lg bg-rust px-6 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              >
                {currentPhase === "challenge" &&
                currentStepIndex === lesson.phases.challenge.steps - 1
                  ? "Complete Lesson"
                  : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
