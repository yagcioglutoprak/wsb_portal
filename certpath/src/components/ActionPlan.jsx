import { Link } from "react-router-dom";
import { skills, lessons } from "../data/mock";

function TimelineCheckmark() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5L6.5 12L13 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ActionPlan({ profile, progress }) {
  const relevantSkills = skills.filter((s) =>
    s.fieldIds.includes(profile.field)
  );

  const steps = relevantSkills.map((skill) => {
    const skillLessons = lessons.filter((l) => l.skillId === skill.id);
    const completedLessons = skillLessons.filter((l) =>
      progress.completedLessons.includes(l.id)
    );
    const isComplete = progress.completedSkills.includes(skill.id);
    const inProgress = completedLessons.length > 0 && !isComplete;

    return {
      id: skill.id,
      title: `Complete ${skill.name}`,
      subtitle: isComplete
        ? `${skillLessons.length} lessons \u00B7 Done`
        : `${completedLessons.length} of ${skillLessons.length} lessons${inProgress ? " \u00B7 In progress" : ""}`,
      status: isComplete ? "completed" : inProgress ? "in-progress" : "upcoming",
      link: `/skills/${skill.slug}`,
      progress: skillLessons.length
        ? completedLessons.length / skillLessons.length
        : 0,
    };
  });

  return (
    <div
      className="overflow-hidden rounded-xl border border-stone-200/80 bg-card shadow-sm"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      <div className="p-5">
        <h2 className="mb-5 text-base font-bold text-ink">Your Action Plan</h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[15px] top-4 bottom-4 w-0.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #22c55e, #2856a6, #e5e7eb)",
            }}
          />

          <div className="space-y-1">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;

              return (
                <Link
                  key={step.id}
                  to={step.link}
                  className={[
                    "group relative flex items-start gap-4 rounded-xl p-3.5 transition-all duration-200",
                    step.status === "in-progress"
                      ? "bg-gradient-to-r from-rust/5 to-transparent hover:from-rust/8 hover:shadow-sm"
                      : step.status === "completed"
                        ? "hover:bg-emerald-50/50 hover:shadow-sm"
                        : "hover:bg-paper/80 hover:shadow-sm",
                  ].join(" ")}
                  style={{
                    animation: `countUp 0.4s ease-out ${idx * 0.06}s both`,
                  }}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 mt-0.5 shrink-0">
                    {step.status === "completed" ? (
                      <div
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-200/60"
                        style={{
                          animation: `scaleBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.06 + 0.2}s both`,
                        }}
                      >
                        <TimelineCheckmark />
                      </div>
                    ) : step.status === "in-progress" ? (
                      <div
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#fdfcfa] shadow-md animate-timeline-pulse"
                        style={{
                          border: "3px solid #2856a6",
                        }}
                      >
                        <div className="h-2.5 w-2.5 rounded-full bg-rust" />
                      </div>
                    ) : (
                      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-stone-300 bg-[#fdfcfa]">
                        <div className="h-2 w-2 rounded-full bg-stone-300" />
                      </div>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-0.5">
                    <p
                      className={[
                        "text-sm font-semibold transition-colors duration-200",
                        step.status === "completed"
                          ? "text-emerald-700"
                          : step.status === "in-progress"
                            ? "text-ink group-hover:text-rust"
                            : "text-pencil group-hover:text-graphite",
                      ].join(" ")}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-pencil">{step.subtitle}</p>

                    {/* Progress bar for in-progress */}
                    {step.status === "in-progress" && (
                      <div className="mt-2.5 h-1.5 w-32 overflow-hidden rounded-full bg-paper/80">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${step.progress * 100}%`,
                            background: "linear-gradient(90deg, #2856a6, #3b82f6)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Arrow on hover */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mt-1.5 shrink-0 text-pencil/0 transition-all duration-200 group-hover:text-pencil group-hover:translate-x-0.5"
                  >
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
