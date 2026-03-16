import { Link } from "react-router-dom";

export default function SkillCard({ skill, progress, currentLesson }) {
  const isComplete = progress.completedSkills.includes(skill.id);

  return (
    <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
      <h3 className="mb-1 text-sm font-bold text-ink">
        Continue Learning
      </h3>
      {currentLesson ? (
        <div className="mt-2 rounded-lg border-l-3 border-rust bg-stone-50 p-3">
          <p className="text-sm font-semibold text-ink">
            {skill.name} · Lesson {currentLesson.number}
          </p>
          <p className="mt-0.5 text-xs text-graphite">
            {currentLesson.title}
          </p>
          <Link
            to={`/skills/${skill.slug}/${currentLesson.id}`}
            className="mt-2 inline-block rounded-lg bg-rust px-4 py-2 text-xs font-semibold text-white hover:bg-rust/90"
          >
            {isComplete ? "Review →" : "Continue →"}
          </Link>
        </div>
      ) : (
        <div className="mt-2 rounded-lg bg-stone-50 p-3">
          <p className="text-sm text-graphite">
            Start your first lesson to begin learning.
          </p>
          <Link
            to={`/skills/${skill.slug}`}
            className="mt-2 inline-block rounded-lg bg-rust px-4 py-2 text-xs font-semibold text-white"
          >
            Start Learning →
          </Link>
        </div>
      )}
    </div>
  );
}
