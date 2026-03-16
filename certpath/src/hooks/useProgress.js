import { useState, useCallback, useMemo } from "react";
import { lessons } from "../data/mock";

const PROFILE_KEY = "certpath:profile";
const PROGRESS_KEY = "certpath:progress";

const XP_RATES = { learn: 10, apply: 20, challenge: 30 };
const LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 300 },
  { level: 4, xp: 600 },
  { level: 5, xp: 1000 },
];

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_PROGRESS = {
  completedSteps: [],
  completedLessons: [],
  completedSkills: [],
  earnedBadges: [],
};

export default function useProgress() {
  const [profile, setProfileState] = useState(() => readJSON(PROFILE_KEY, null));
  const [progress, setProgressState] = useState(() =>
    readJSON(PROGRESS_KEY, DEFAULT_PROGRESS)
  );

  const saveProfile = useCallback((data) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    setProfileState(data);
  }, []);

  const isOnboarded = profile !== null;

  const updateProgress = useCallback((updater) => {
    setProgressState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeStep = useCallback(
    (stepId) => {
      updateProgress((prev) => {
        if (prev.completedSteps.includes(stepId)) return prev;
        return { ...prev, completedSteps: [...prev.completedSteps, stepId] };
      });
    },
    [updateProgress]
  );

  const completeLesson = useCallback(
    (lessonId) => {
      updateProgress((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        return { ...prev, completedLessons: [...prev.completedLessons, lessonId] };
      });
    },
    [updateProgress]
  );

  const completeSkill = useCallback(
    (skillId) => {
      updateProgress((prev) => {
        if (prev.completedSkills.includes(skillId)) return prev;
        const badgeId = `${skillId}-foundations`;
        return {
          ...prev,
          completedSkills: [...prev.completedSkills, skillId],
          earnedBadges: prev.earnedBadges.includes(badgeId)
            ? prev.earnedBadges
            : [...prev.earnedBadges, badgeId],
        };
      });
    },
    [updateProgress]
  );

  const xp = useMemo(() => {
    return progress.completedSteps.reduce((total, stepId) => {
      const parts = stepId.split("-");
      const phase = parts[parts.length - 2];
      return total + (XP_RATES[phase] || 0);
    }, 0);
  }, [progress.completedSteps]);

  const level = useMemo(() => {
    const current = [...LEVELS].reverse().find((l) => xp >= l.xp);
    return current ? current.level : 1;
  }, [xp]);

  const isStepCompleted = useCallback(
    (stepId) => progress.completedSteps.includes(stepId),
    [progress.completedSteps]
  );

  const isLessonCompleted = useCallback(
    (lessonId) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const isSkillCompleted = useCallback(
    (skillId) => progress.completedSkills.includes(skillId),
    [progress.completedSkills]
  );

  const getLessonProgress = useCallback(
    (lessonId) => {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (!lesson) return { completed: 0, total: 0 };
      const totalSteps =
        lesson.phases.learn.steps +
        lesson.phases.apply.steps +
        lesson.phases.challenge.steps;
      const completedCount = progress.completedSteps.filter((s) =>
        s.startsWith(`${lessonId}-`)
      ).length;
      return { completed: completedCount, total: totalSteps };
    },
    [progress.completedSteps]
  );

  const getSkillProgress = useCallback(
    (skillId) => {
      const skillLessons = lessons.filter((l) => l.skillId === skillId);
      const total = skillLessons.length;
      const completed = skillLessons.filter((l) =>
        progress.completedLessons.includes(l.id)
      ).length;
      return { completed, total };
    },
    [progress.completedLessons]
  );

  const getCurrentLesson = useCallback(
    (skillId) => {
      const skillLessons = lessons
        .filter((l) => l.skillId === skillId)
        .sort((a, b) => a.number - b.number);
      return (
        skillLessons.find((l) => !progress.completedLessons.includes(l.id)) ||
        skillLessons[skillLessons.length - 1]
      );
    },
    [progress.completedLessons]
  );

  const resetAll = useCallback(() => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    setProfileState(null);
    setProgressState(DEFAULT_PROGRESS);
  }, []);

  return {
    profile,
    saveProfile,
    isOnboarded,
    progress,
    completeStep,
    completeLesson,
    completeSkill,
    xp,
    level,
    isStepCompleted,
    isLessonCompleted,
    isSkillCompleted,
    getLessonProgress,
    getSkillProgress,
    getCurrentLesson,
    resetAll,
  };
}
