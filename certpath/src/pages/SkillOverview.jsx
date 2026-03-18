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
    return <p className="py-12 text-center text-pencil">Skill not found.</p>;
  }

  const skillLessons = lessons
    .filter((l) => l.skillId === skill.id)
    .sort((a, b) => a.number - b.number);

  const completed = isSkillCompleted(skill.id);
  const completedCount = skillLessons.filter((l) => isLessonCompleted(l.id)).length;

  const isLessonUnlocked = (lesson, index) => {
    if (index === 0) return true;
    const prev = skillLessons[index - 1];
    return isLessonCompleted(prev.id);
  };

  return (
    <section className="py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-pencil mb-8 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
        <Link to="/dashboard" className="hover:text-rust transition-colors">
          Dashboard
        </Link>
        <svg className="w-3.5 h-3.5 text-pencil/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        <span className="text-ink font-medium">{skill.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-sans text-3xl font-bold text-ink tracking-tight">{skill.name}</h1>
          {completed && (
            <span className="flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-3 py-1 text-xs font-bold text-success">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              {skill.badgeName}
            </span>
          )}
        </div>
        <p className="text-base text-pencil leading-relaxed">{skill.description}</p>
        <p className="mt-2 text-sm text-pencil/60">
          {completedCount} of {skillLessons.length} lessons completed
        </p>
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
              className={[
                "rounded-xl border-[1.5px] bg-card p-5 transition-all duration-200 animate-fade-in-up",
                unlocked
                  ? "border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                  : "border-ink/6 opacity-50",
              ].join(" ")}
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-pencil">
                      {String(lesson.number).padStart(2, "0")}
                    </span>
                    <h3 className="font-sans font-semibold text-ink">{lesson.title}</h3>
                    {done && (
                      <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        Complete
                      </span>
                    )}
                    {!unlocked && (
                      <span className="flex items-center gap-1 text-xs text-pencil">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-pencil">
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
                    className="ml-4 shrink-0 rounded-xl bg-rust px-5 py-2.5 text-sm font-semibold text-white hover:bg-rust/90 hover:-translate-y-px shadow-[0_2px_0_0_rgba(0,0,0,0.1)] transition-all duration-200"
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
    </section>
  );
}
