import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { lessons } from "../data/mock";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const PROFILE_KEY = "clairy:profile";
const PROGRESS_KEY = "clairy:progress";

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

// Merge two progress objects, taking the union of all arrays
function mergeProgress(local, remote) {
  if (!remote) return local;
  if (!local) return remote;
  return {
    completedSteps: [...new Set([...local.completedSteps, ...remote.completedSteps])],
    completedLessons: [...new Set([...local.completedLessons, ...remote.completedLessons])],
    completedSkills: [...new Set([...local.completedSkills, ...remote.completedSkills])],
    earnedBadges: [...new Set([...local.earnedBadges, ...remote.earnedBadges])],
  };
}

// Load progress from Supabase
async function loadFromSupabase(userId) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found, which is fine for new users
      console.error("Failed to load progress from Supabase:", error.message);
      return null;
    }
    if (!data) return null;
    return {
      profile: data.profile || null,
      progress: {
        completedSteps: data.completed_steps || [],
        completedLessons: data.completed_lessons || [],
        completedSkills: data.completed_skills || [],
        earnedBadges: data.earned_badges || [],
      },
    };
  } catch (err) {
    console.error("Supabase load error:", err);
    return null;
  }
}

// Sync progress to Supabase
async function syncToSupabase(userId, profile, progress) {
  if (!supabase || !userId) return;
  try {
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        profile: profile || {},
        completed_steps: progress.completedSteps,
        completed_lessons: progress.completedLessons,
        completed_skills: progress.completedSkills,
        earned_badges: progress.earnedBadges,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) {
      console.error("Failed to sync progress to Supabase:", error.message);
    }
  } catch (err) {
    console.error("Supabase sync error:", err);
  }
}

export default function useProgress() {
  const { user } = useAuth();
  const [profile, setProfileState] = useState(() => readJSON(PROFILE_KEY, null));
  const [progress, setProgressState] = useState(() =>
    readJSON(PROGRESS_KEY, DEFAULT_PROGRESS)
  );
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);
  const syncTimeoutRef = useRef(null);

  // Debounced sync to Supabase — avoids hammering the API on rapid progress changes
  const debouncedSync = useCallback(
    (userId, prof, prog) => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        syncToSupabase(userId, prof, prog);
      }, 1000);
    },
    []
  );

  // On login: load from Supabase and merge with localStorage
  useEffect(() => {
    if (!user || supabaseLoaded) return;

    let cancelled = false;
    loadFromSupabase(user.id).then((remote) => {
      if (cancelled) return;
      setSupabaseLoaded(true);

      if (remote) {
        const localProfile = readJSON(PROFILE_KEY, null);
        const localProgress = readJSON(PROGRESS_KEY, DEFAULT_PROGRESS);

        // Merge profile: prefer remote if local is empty, otherwise keep local
        const mergedProfile = localProfile || remote.profile;
        const mergedProgress = mergeProgress(localProgress, remote.progress);

        // Update state
        setProfileState(mergedProfile);
        setProgressState(mergedProgress);

        // Persist merged data back to localStorage
        if (mergedProfile) {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(mergedProfile));
        }
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(mergedProgress));

        // Push merged data back to Supabase
        syncToSupabase(user.id, mergedProfile, mergedProgress);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, supabaseLoaded]);

  // Reset supabaseLoaded flag when user logs out
  useEffect(() => {
    if (!user) setSupabaseLoaded(false);
  }, [user]);

  const saveProfile = useCallback(
    (data) => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
      setProfileState(data);
      if (user) {
        setProgressState((currentProgress) => {
          debouncedSync(user.id, data, currentProgress);
          return currentProgress;
        });
      }
    },
    [user, debouncedSync]
  );

  const isOnboarded = profile !== null;

  const updateProgress = useCallback(
    (updater) => {
      setProgressState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
        if (user) {
          debouncedSync(user.id, profile, next);
        }
        return next;
      });
    },
    [user, profile, debouncedSync]
  );

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
