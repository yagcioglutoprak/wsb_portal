import { Link } from "react-router-dom";
import { skills, lessons } from "../data/mock";

export default function ActionPlan({ profile, progress }) {
  // Build action steps from skills relevant to user's field
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
        ? `${skillLessons.length} lessons \u00b7 Done`
        : `${completedLessons.length} of ${skillLessons.length} lessons${inProgress ? " \u00b7 In progress" : ""}`,
      status: isComplete ? "completed" : inProgress ? "in-progress" : "upcoming",
      link: `/skills/${skill.slug}`,
      progress: skillLessons.length
        ? completedLessons.length / skillLessons.length
        : 0,
    };
  });

  return (
    <div className="rounded-xl border border-stone-200 bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-ink">Your Action Plan</h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.id}
            to={step.link}
            className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
              step.status === "completed"
                ? "bg-green-50"
                : step.status === "in-progress"
                  ? "border-l-3 border-amber-400 bg-amber-50"
                  : "bg-stone-50"
            }`}
          >
            <span className="mt-0.5 text-sm">
              {step.status === "completed"
                ? "\u2713"
                : step.status === "in-progress"
                  ? "\u25b6"
                  : "\u25cb"}
            </span>
            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  step.status === "completed"
                    ? "text-green-700 line-through"
                    : step.status === "upcoming"
                      ? "text-pencil"
                      : "text-ink"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-pencil">{step.subtitle}</p>
              {step.status === "in-progress" && (
                <div className="mt-1.5 h-1 w-24 rounded-full bg-stone-200">
                  <div
                    className="h-1 rounded-full bg-amber-400 transition-all"
                    style={{ width: `${step.progress * 100}%` }}
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
