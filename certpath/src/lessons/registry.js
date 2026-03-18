import { lazy } from "react";

export const lessonRegistry = {
  // Python Basics
  "python-1": lazy(() => import("./python-basics/Lesson1")),
  "python-2": lazy(() => import("../components/ConditionalsLogicLesson")),

  // Network Security
  "network-1": lazy(() => import("../components/NetworkSecurityLesson")),

  // SQL & Databases
  "sql-1": lazy(() => import("../components/TablesAndDataLesson")),

  // Cloud Architecture
  "cloud-1": lazy(() => import("../components/CloudBasicsLesson")),
  "cloud-2": lazy(() => import("../components/CloudArchitectureComponentsLesson")),

  // Data Analysis
  "data-1": lazy(() => import("../components/ReadingDataLesson")),
  "data-2": lazy(() => import("../components/VisualizationLesson")),
};
