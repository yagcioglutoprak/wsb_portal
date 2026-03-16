import { lazy } from "react";

const NetworkLesson1 = lazy(() => import("./network-security/Lesson1"));
const NetworkLesson2 = lazy(() => import("./network-security/Lesson2"));
const NetworkLesson3 = lazy(() => import("./network-security/Lesson3"));
const PythonLesson1 = lazy(() => import("./python-basics/Lesson1"));
const PythonLesson2 = lazy(() => import("./python-basics/Lesson2"));
const PythonLesson3 = lazy(() => import("./python-basics/Lesson3"));
const PythonLesson4 = lazy(() => import("./python-basics/Lesson4"));
const SqlLesson1 = lazy(() => import("./sql-databases/Lesson1"));
const SqlLesson2 = lazy(() => import("./sql-databases/Lesson2"));
const SqlLesson3 = lazy(() => import("./sql-databases/Lesson3"));
const CloudLesson1 = lazy(() => import("./cloud-architecture/Lesson1"));
const CloudLesson2 = lazy(() => import("./cloud-architecture/Lesson2"));
const CloudLesson3 = lazy(() => import("./cloud-architecture/Lesson3"));
const DataLesson1 = lazy(() => import("./data-analysis/Lesson1"));
const DataLesson2 = lazy(() => import("./data-analysis/Lesson2"));
const DataLesson3 = lazy(() => import("./data-analysis/Lesson3"));

export const lessonRegistry = {
  "network-1": NetworkLesson1,
  "network-2": NetworkLesson2,
  "network-3": NetworkLesson3,
  "python-1": PythonLesson1,
  "python-2": PythonLesson2,
  "python-3": PythonLesson3,
  "python-4": PythonLesson4,
  "sql-1": SqlLesson1,
  "sql-2": SqlLesson2,
  "sql-3": SqlLesson3,
  "cloud-1": CloudLesson1,
  "cloud-2": CloudLesson2,
  "cloud-3": CloudLesson3,
  "data-1": DataLesson1,
  "data-2": DataLesson2,
  "data-3": DataLesson3,
};
