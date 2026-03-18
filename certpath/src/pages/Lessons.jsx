import { Link } from "react-router-dom";
import { skills, lessons } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import useProgress from "../hooks/useProgress";
import ProgressBar from "../components/widgets/ProgressBar";

export default function Lessons() {
  const { progress, isLessonCompleted, getLessonProgress } = useProgress();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-ink">Lessons</h1>
        <p className="mt-1 text-graphite">
          Interactive, bite-sized lessons to build real skills.
        </p>
      </div>

      {skills.map((skill) => {
        const skillLessons = lessons
          .filter((l) => l.skillId === skill.id)
          .sort((a, b) => a.number - b.number);

        return (
          <section key={skill.id} className="space-y-3">
            <Link
              to={`/skills/${skill.slug}`}
              className="group flex items-center gap-2"
            >
              <h2 className="text-lg font-bold text-ink group-hover:text-rust transition-colors">
                {skill.name}
              </h2>
              <span className="text-pencil text-xs">
                {skillLessons.length} lessons
              </span>
            </Link>

            <div className="space-y-2">
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
                      "rounded-xl border bg-card p-4 transition-all",
                      unlocked
                        ? "border-stone-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                        : "border-stone-100 opacity-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-pencil">
                            {String(lesson.number).padStart(2, "0")}
                          </span>
                          <h3 className="font-semibold text-ink truncate">
                            {lesson.title}
                          </h3>
                          {done && (
                            <span className="shrink-0 text-xs text-green-600">
                              ✓
                            </span>
                          )}
                          {!unlocked && (
                            <span className="shrink-0 text-xs text-pencil">
                              🔒
                            </span>
                          )}
                          {!hasContent && unlocked && !done && (
                            <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-xs font-medium text-pencil">
                              Coming soon
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-graphite truncate">
                          {lesson.description}
                        </p>
                        {hasContent && (
                          <div className="mt-2">
                            <ProgressBar
                              phases={lesson.phases}
                              completedSteps={progress.completedSteps}
                              lessonId={lesson.id}
                            />
                          </div>
                        )}
                        {!hasContent && (
                          <p className="mt-1.5 text-xs text-pencil">
                            ~{lesson.estimatedMinutes} min
                          </p>
                        )}
                      </div>
                      {unlocked && (
                        <Link
                          to={`/skills/${skill.slug}/${lesson.id}`}
                          className={[
                            "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                            hasContent
                              ? "bg-rust text-white hover:bg-rust/90"
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
        );
      })}
    </div>
  );
}
