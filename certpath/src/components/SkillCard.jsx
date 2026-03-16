import { Link } from "react-router-dom";

const SKILL_GRADIENTS = {
  network: "linear-gradient(135deg, #0a1628 0%, #1a2744 100%)",
  python: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
  sql: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
  cloud: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
  data: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
};

const SKILL_ACCENT_COLORS = {
  network: "#00d4aa",
  python: "#f59e0b",
  sql: "#a5b4fc",
  cloud: "#7dd3fc",
  data: "#c4b5fd",
};

export default function SkillCard({ skill, progress, currentLesson }) {
  const isComplete = progress.completedSkills.includes(skill.id);
  const gradient = SKILL_GRADIENTS[skill.slug] || SKILL_GRADIENTS.sql;
  const accent = SKILL_ACCENT_COLORS[skill.slug] || "#a5b4fc";

  return (
    <div
      className="overflow-hidden rounded-xl border border-stone-200/80 bg-card shadow-sm"
      style={{
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      <div className="p-5">
        <h3 className="mb-3 text-sm font-bold text-ink">
          Continue Learning
        </h3>

        {currentLesson ? (
          <div
            className="overflow-hidden rounded-xl"
            style={{
              background: gradient,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Gradient accent strip */}
            <div
              className="h-1"
              style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            />

            <div className="p-4">
              <p className="text-sm font-semibold text-white/90">
                {skill.name}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: accent }}>
                Lesson {currentLesson.number} &middot; {currentLesson.title}
              </p>

              <Link
                to={`/skills/${skill.slug}/${currentLesson.id}`}
                className="group mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  backgroundColor: accent,
                  color: skill.slug === "network" || skill.slug === "python" ? "#1a1a1a" : "#ffffff",
                  boxShadow: `0 2px 8px ${accent}40`,
                }}
              >
                {isComplete ? "Review" : "Continue"}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-xl"
            style={{
              background: gradient,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="h-1"
              style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            />
            <div className="p-4">
              <p className="text-sm text-white/70">
                Start your first lesson to begin learning.
              </p>
              <Link
                to={`/skills/${skill.slug}`}
                className="group mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  backgroundColor: accent,
                  color: skill.slug === "network" || skill.slug === "python" ? "#1a1a1a" : "#ffffff",
                  boxShadow: `0 2px 8px ${accent}40`,
                }}
              >
                Start Learning
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
