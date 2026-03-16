import { useParams, Link } from "react-router-dom";
import { skills, lessons } from "../data/mock";
import useProgress from "../hooks/useProgress";
import ProgressBar from "../components/widgets/ProgressBar";

export default function SkillOverview() {
  const { skillSlug } = useParams();
  const skill = skills.find((s) => s.slug === skillSlug);
  const { progress, isSkillCompleted, isLessonCompleted, getLessonProgress } =
    useProgress();

  if (!skill) {
    return <p className="py-12 text-center text-graphite">Skill not found.</p>;
  }

  const skillLessons = lessons
    .filter((l) => l.skillId === skill.id)
    .sort((a, b) => a.number - b.number);

  const completed = isSkillCompleted(skill.id);

  const isLessonUnlocked = (lesson, index) => {
    if (index === 0) return true;
    const prev = skillLessons[index - 1];
    return isLessonCompleted(prev.id);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-pencil">
        <Link to="/dashboard" className="hover:text-rust">
          Dashboard
        </Link>
        <span className="mx-2">\u203a</span>
        <span className="text-ink">{skill.name}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ink">{skill.name}</h1>
          {completed && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              \u2713 {skill.badgeName}
            </span>
          )}
        </div>
        <p className="mt-2 text-graphite">{skill.description}</p>
      </div>

      {/* Lesson list */}
      <div className="space-y-3">
        {skillLessons.map((lesson, i) => {
          const unlocked = isLessonUnlocked(lesson, i);
          const done = isLessonCompleted(lesson.id);
          const lessonProgress = getLessonProgress(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`rounded-xl border bg-card p-5 shadow-sm transition-all ${
                unlocked
                  ? "border-stone-200 hover:-translate-y-0.5 hover:shadow-md"
                  : "border-stone-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-pencil">
                      {String(lesson.number).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-ink">{lesson.title}</h3>
                    {done && (
                      <span className="text-xs text-green-600">\u2713 Complete</span>
                    )}
                    {!unlocked && (
                      <span className="text-xs text-pencil">\uD83D\uDD12 Locked</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-graphite">
                    {lesson.description}
                  </p>
                  <div className="mt-3">
                    <ProgressBar
                      phases={lesson.phases}
                      completedSteps={progress.completedSteps}
                      lessonId={lesson.id}
                    />
                  </div>
                </div>
                {unlocked && (
                  <Link
                    to={`/skills/${skillSlug}/${lesson.id}`}
                    className="ml-4 shrink-0 rounded-lg bg-rust px-4 py-2 text-sm font-semibold text-white hover:bg-rust/90"
                  >
                    {done
                      ? "Review"
                      : lessonProgress.completed > 0
                        ? "Continue"
                        : "Start"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
