import { Link } from "react-router-dom";
import { lessons, skills } from "../data/mock";
import { lessonRegistry } from "../lessons/registry";
import { ArrowRightIcon } from "../components/Icons";

const skillMeta = {
  "network-security": { color: "#0d9488", icon: "shield" },
  "python-basics": { color: "#d97706", icon: "code" },
  "sql-databases": { color: "#6366f1", icon: "db" },
  "cloud-architecture": { color: "#0284c7", icon: "cloud" },
  "data-analysis": { color: "#e11d48", icon: "chart" },
};

const icons = {
  shield: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  db: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  cloud: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

export default function DevLessons() {
  const skillGroups = {};
  lessons.forEach((lesson) => {
    if (!skillGroups[lesson.skillId]) skillGroups[lesson.skillId] = [];
    skillGroups[lesson.skillId].push(lesson);
  });

  const totalLessons = lessons.length;
  const builtLessons = lessons.filter((l) => lessonRegistry[l.id]).length;

  return (
    <div className="min-h-screen bg-[#f5f3ef] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-rust bg-rust/10 px-3 py-1 rounded-full">
              Dev Mode
            </span>
          </div>
          <h1 className="font-sans text-4xl font-bold text-ink tracking-tight">
            Lesson Inventory
          </h1>
          <p className="mt-3 text-pencil text-base">
            {builtLessons} of {totalLessons} lessons built.{" "}
            <span className="font-mono text-sm">
              ({Math.round((builtLessons / totalLessons) * 100)}% complete)
            </span>
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-ink/10 rounded-full overflow-hidden max-w-md">
            <div
              className="h-full bg-rust rounded-full transition-all duration-700"
              style={{ width: `${(builtLessons / totalLessons) * 100}%` }}
            />
          </div>
        </div>

        {/* Skill Groups */}
        <div className="space-y-10">
          {Object.entries(skillGroups).map(([skillId, skillLessons]) => {
            const skill = skills.find((s) => s.id === skillId);
            const meta = skillMeta[skillId] || { color: "#666", icon: "code" };
            const builtCount = skillLessons.filter((l) => lessonRegistry[l.id]).length;

            return (
              <div key={skillId}>
                {/* Skill Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: meta.color }}
                  >
                    {icons[meta.icon]}
                  </div>
                  <div>
                    <h2 className="font-sans text-lg font-bold text-ink">
                      {skill?.name || skillId}
                    </h2>
                    <span className="font-mono text-xs text-pencil">
                      {builtCount}/{skillLessons.length} built
                    </span>
                  </div>
                </div>

                {/* Lesson Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillLessons.map((lesson) => {
                    const isBuilt = !!lessonRegistry[lesson.id];
                    const totalSteps =
                      lesson.phases.learn.steps +
                      lesson.phases.apply.steps +
                      lesson.phases.challenge.steps;

                    return (
                      <div
                        key={lesson.id}
                        className={`relative bg-white rounded-xl border-[1.5px] p-5 transition-all duration-200 ${
                          isBuilt
                            ? "border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                            : "border-dashed border-ink/15 opacity-60"
                        }`}
                      >
                        {/* Status badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-pencil">
                            {lesson.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isBuilt
                                ? "bg-success/10 text-success border border-success/20"
                                : "bg-ink/5 text-pencil border border-ink/10"
                            }`}
                          >
                            {isBuilt ? "Built" : "Not built"}
                          </span>
                        </div>

                        <h3 className="font-sans text-base font-bold text-ink leading-tight mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-pencil leading-relaxed mb-4">
                          {lesson.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-3 text-[10px] font-mono text-pencil uppercase tracking-wider mb-4">
                          <span>~{lesson.estimatedMinutes}m</span>
                          <span className="opacity-30">|</span>
                          <span>{totalSteps} steps</span>
                          <span className="opacity-30">|</span>
                          <span>
                            L{lesson.phases.learn.steps} A
                            {lesson.phases.apply.steps} C
                            {lesson.phases.challenge.steps}
                          </span>
                        </div>

                        {/* Action */}
                        {isBuilt ? (
                          <Link
                            to={`/skills/${lesson.skillId}/${lesson.id}`}
                            className="group flex items-center gap-2 text-sm font-bold transition-colors"
                            style={{ color: meta.color }}
                          >
                            Open lesson
                            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        ) : (
                          <span className="text-xs text-pencil italic">
                            Prompt ready in docs/lesson-prompts/
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-ink/8 text-center">
          <p className="text-xs text-pencil font-mono">
            Lesson routes: /skills/:skillSlug/:lessonId
          </p>
        </div>
      </div>
    </div>
  );
}
