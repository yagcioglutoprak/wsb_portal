import { lazy } from "react";

export const lessonRegistry = {
  // Python Basics
  "python-1": lazy(() => import("./python-basics/Lesson1")),
  "python-2": lazy(() => import("./python-basics/Lesson2")),
  
  // Data Analysis
  "data-1": lazy(() => import("./data-analysis/Lesson1")),
  "data-2": lazy(() => import("./data-analysis/Lesson2")),
  
  // Cloud Architecture
  "cloud-1": lazy(() => import("./cloud-architecture/Lesson1")),
  "cloud-2": lazy(() => import("./cloud-architecture/Lesson2")),

  // SQL Databases
  "sql-1": lazy(() => import("./sql-databases/Lesson1")),
  "sql-2": lazy(() => import("./sql-databases/Lesson2")),

  // Network Security
  "network-1": lazy(() => import("./network-security/Lesson1")),
  "network-2": lazy(() => import("./network-security/Lesson2")),
};
