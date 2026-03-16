import { Navigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { skills, lessons, jobs, skillJobMap } from "../data/mock";
import useProgress from "../hooks/useProgress";
import ActionPlan from "../components/ActionPlan";
import SkillCard from "../components/SkillCard";

/* Animated counter hook for stats */
function useAnimatedCounter(target, duration = 600) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (typeof target === "number") {
      startTime.current = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setCount(Math.round(eased * target));
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };
      frameRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameRef.current);
    }
  }, [target, duration]);

  return count;
}

/* Stat card with glassmorphism */
function StatCard({ value, label, delay = 0 }) {
  const isNumeric = typeof value === "number";
  const animatedValue = useAnimatedCounter(isNumeric ? value : 0);

  return (
    <div
      className="group relative overflow-hidden rounded-xl p-5 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      style={{
        background: "linear-gradient(135deg, rgba(253, 252, 250, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
        animation: `countUp 0.5s ease-out ${delay}s both`,
      }}
    >
      {/* Subtle hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(40, 86, 166, 0.04) 0%, transparent 70%)",
        }}
      />
      <p className="relative text-2xl font-bold text-rust">
        {isNumeric ? animatedValue : value}
      </p>
      <p className="relative mt-1 text-xs font-semibold uppercase tracking-wide text-pencil">
        {label}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { profile, isOnboarded, progress, xp, level, getCurrentLesson } =
    useProgress();

  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  // Find relevant skill for continue-learning
  const relevantSkills = skills.filter((s) =>
    s.fieldIds.includes(profile.field)
  );
  const activeSkill =
    relevantSkills.find((s) => !progress.completedSkills.includes(s.id)) ||
    relevantSkills[0];
  const currentLesson = activeSkill ? getCurrentLesson(activeSkill.id) : null;

  // Matching jobs
  const matchingJobIds = relevantSkills.flatMap(
    (s) => skillJobMap[s.id] || []
  );
  const matchingJobs = jobs
    .filter((j) => matchingJobIds.includes(j.id))
    .slice(0, 3);

  const totalLessons = lessons.length;
  const completedLessons = progress.completedLessons.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ animation: "fadeInUp 0.5s ease-out both" }}
      >
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Welcome back
          </h1>
          <p className="mt-0.5 text-sm text-pencil">
            {profile.year} year &middot; {profile.program} &middot; {profile.field}
          </p>
        </div>

        {/* Level/XP badge */}
        <div
          className="relative overflow-hidden rounded-full px-5 py-2 text-xs font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #2856a6 0%, #3b6ec4 50%, #2856a6 100%)",
            boxShadow: "0 2px 8px rgba(40, 86, 166, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <div className="shimmer-btn pointer-events-none absolute inset-0" />
          <span className="relative">Level {level} &middot; {xp} XP</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          value={`${progress.completedSkills.length}/${skills.length}`}
          label="Skills"
          delay={0}
        />
        <StatCard
          value={`${completedLessons}/${totalLessons}`}
          label="Lessons"
          delay={0.05}
        />
        <StatCard
          value={progress.earnedBadges.length}
          label="Badges"
          delay={0.1}
        />
        <StatCard
          value={matchingJobs.length}
          label="Matching Jobs"
          delay={0.15}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: Action Plan */}
        <div
          className="col-span-2"
          style={{ animation: "fadeInUp 0.5s ease-out 0.1s both" }}
        >
          <ActionPlan profile={profile} progress={progress} />
        </div>

        {/* Right: Continue + Jobs */}
        <div
          className="space-y-4"
          style={{ animation: "fadeInUp 0.5s ease-out 0.15s both" }}
        >
          {activeSkill && (
            <SkillCard
              skill={activeSkill}
              progress={progress}
              currentLesson={currentLesson}
            />
          )}

          {/* Top Opportunities */}
          <div
            className="overflow-hidden rounded-xl border border-stone-200/80 bg-card shadow-sm"
            style={{
              boxShadow: "0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            <div className="p-5">
              <h3 className="mb-4 text-sm font-bold text-ink">
                Top Opportunities
              </h3>
              <div className="space-y-3">
                {matchingJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="group flex items-start gap-3 rounded-lg border border-transparent p-2.5 transition-all duration-200 hover:border-stone-200/80 hover:bg-stone-50/80 hover:shadow-sm"
                  >
                    {/* Company avatar */}
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #2856a6 0%, #3b6ec4 100%)",
                      }}
                    >
                      {job.company.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink group-hover:text-rust transition-colors truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-pencil truncate">
                        {job.company} &middot; {job.location}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-rust">
                        {job.salaryMin.toLocaleString()} PLN/mo
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/jobs"
                className="group mt-4 flex items-center gap-1 text-xs font-semibold text-rust hover:underline"
              >
                View all opportunities
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
        </div>
      </div>
    </div>
  );
}
