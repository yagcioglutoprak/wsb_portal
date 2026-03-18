import { Link } from "react-router-dom";
import { skills, lessons } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import useProgress from "../hooks/useProgress";
import ProgressBar from "../components/widgets/ProgressBar";
import useScrollReveal from "../hooks/useScrollReveal";

function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Lessons() {
  const { progress, isLessonCompleted, getLessonProgress } = useProgress();

  return (
    <section className="py-8 lg:py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
        <span className="inline-block bg-rust/8 text-rust border border-rust/15 rounded-full px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest mb-4">
          Interactive
        </span>
        <h1 className="font-sans text-3xl font-bold text-ink sm:text-4xl tracking-tight leading-tight mb-2">
          Lessons
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-pencil">
          Bite-sized, interactive lessons to build real skills. Learn by doing — not watching.
        </p>
      </div>

      {/* Skill Sections */}
      <div className="space-y-12">
        {skills.map((skill, si) => {
          const skillLessons = lessons
            .filter((l) => l.skillId === skill.id)
            .sort((a, b) => a.number - b.number);

          return (
            <RevealOnScroll key={skill.id} delay={si * 80}>
              <section>
                <Link
                  to={`/skills/${skill.slug}`}
                  className="group flex items-center gap-3 mb-4"
                >
                  <h2 className="font-sans text-xl font-bold text-ink group-hover:text-rust transition-colors">
                    {skill.name}
                  </h2>
                  <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-semibold text-pencil">
                    {skillLessons.length} lessons
                  </span>
                </Link>

                <div className="space-y-3">
                  {skillLessons.map((lesson, i) => {
                    const unlocked =
                      i === 0 || isLessonCompleted(skillLessons[i - 1].id);
                    const done = isLessonCompleted(lesson.id);
                    const lessonProgress = getLessonProgress(lesson.id);
                    const hasContent = !!lessonRegistry[lesson.id];

                    return (
                      <div
                        key={lesson.id}
                        className={[
                          "rounded-xl border-[1.5px] bg-card p-5 transition-all duration-200",
                          unlocked
                            ? "border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                            : "border-ink/6 opacity-50",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs text-pencil">
                                {String(lesson.number).padStart(2, "0")}
                              </span>
                              <h3 className="font-sans font-semibold text-ink truncate">
                                {lesson.title}
                              </h3>
                              {done && (
                                <span className="shrink-0 flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                  Done
                                </span>
                              )}
                              {!unlocked && (
                                <span className="shrink-0 flex items-center gap-1 text-xs text-pencil">
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </span>
                              )}
                              {!hasContent && unlocked && !done && (
                                <span className="shrink-0 rounded-full bg-arcade/10 px-2.5 py-0.5 text-xs font-semibold text-arcade">
                                  Coming soon
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-pencil truncate">
                              {lesson.description}
                            </p>
                            {hasContent && (
                              <div className="mt-3">
                                <ProgressBar
                                  phases={lesson.phases}
                                  completedSteps={progress.completedSteps}
                                  lessonId={lesson.id}
                                />
                              </div>
                            )}
                            {!hasContent && (
                              <p className="mt-1.5 text-xs text-pencil/60">
                                ~{lesson.estimatedMinutes} min
                              </p>
                            )}
                          </div>
                          {unlocked && (
                            <Link
                              to={`/skills/${skill.slug}/${lesson.id}`}
                              className={[
                                "shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                                hasContent
                                  ? "bg-rust text-white hover:bg-rust/90 hover:-translate-y-px shadow-[0_2px_0_0_rgba(0,0,0,0.1)]"
                                  : "bg-ink/5 text-pencil hover:bg-ink/10",
                              ].join(" ")}
                            >
                              {done
                                ? "Review"
                                : hasContent
                                  ? lessonProgress.completed > 0
                                    ? "Continue"
                                    : "Start"
                                  : "Preview"}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
