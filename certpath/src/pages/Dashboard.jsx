import { Navigate, Link } from "react-router-dom";
import { skills, lessons, jobs, skillJobMap } from "../data/mock";
import useProgress from "../hooks/useProgress";
import ActionPlan from "../components/ActionPlan";
import SkillCard from "../components/SkillCard";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-pencil">
            {profile.year} year · {profile.program} · {profile.field}
          </p>
        </div>
        <div className="rounded-full bg-rust px-4 py-1.5 text-xs font-semibold text-white">
          Level {level} · {xp} XP
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            value: `${progress.completedSkills.length}/${skills.length}`,
            label: "Skills",
          },
          {
            value: `${completedLessons}/${totalLessons}`,
            label: "Lessons",
          },
          {
            value: progress.earnedBadges.length,
            label: "Badges",
          },
          {
            value: matchingJobs.length,
            label: "Matching Jobs",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card p-4 text-center shadow-sm"
          >
            <p className="text-xl font-bold text-rust">{stat.value}</p>
            <p className="text-xs uppercase tracking-wide text-pencil">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: Action Plan */}
        <div className="col-span-2">
          <ActionPlan profile={profile} progress={progress} />
        </div>

        {/* Right: Continue + Jobs */}
        <div className="space-y-4">
          {activeSkill && (
            <SkillCard
              skill={activeSkill}
              progress={progress}
              currentLesson={currentLesson}
            />
          )}

          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-ink">
              Top Opportunities
            </h3>
            <div className="space-y-2">
              {matchingJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block border-b border-stone-100 pb-2 last:border-0"
                >
                  <p className="text-sm font-semibold text-ink">{job.title}</p>
                  <p className="text-xs text-pencil">
                    {job.company} · {job.location} ·{" "}
                    {job.salaryMin.toLocaleString()} PLN/mo
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/jobs"
              className="mt-3 block text-xs font-semibold text-rust hover:underline"
            >
              View all opportunities →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
