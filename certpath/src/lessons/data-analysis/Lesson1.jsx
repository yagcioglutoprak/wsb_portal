import { useState, useEffect, useRef } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DataFilterPuzzle from "../../components/lesson-widgets/DataFilterPuzzle";

const EMPLOYEE_DATA = [
  { id: 1, name: "Anna Kowalska", department: "IT", salary: 6500, years: 3, city: "Warsaw" },
  { id: 2, name: "Jan Nowak", department: "Marketing", salary: 4800, years: 1, city: "Krakow" },
  { id: 3, name: "Maria Wisniewska", department: "IT", salary: 7200, years: 5, city: "Warsaw" },
  { id: 4, name: "Piotr Lewandowski", department: "HR", salary: 5100, years: 2, city: "Poznan" },
  { id: 5, name: "Kasia Zielinska", department: "IT", salary: 5500, years: 1, city: "Warsaw" },
  { id: 6, name: "Tomek Szymanski", department: "Marketing", salary: 5200, years: 2, city: "Krakow" },
  { id: 7, name: "Ola Dabrowska", department: "HR", salary: 4500, years: 4, city: "Poznan" },
  { id: 8, name: "Michal Kozlowski", department: "IT", salary: 8000, years: 6, city: "Warsaw" },
  { id: 9, name: "Ewa Kaminska", department: "Marketing", salary: 4200, years: 1, city: "Gdansk" },
  { id: 10, name: "Adam Wojcik", department: "IT", salary: 6800, years: 4, city: "Krakow" },
];

const COLUMNS = ["id", "name", "department", "salary", "years", "city"];

const DATA_TYPES = {
  id: { type: "Discrete (integer)", category: "Quantitative", color: "violet" },
  name: { type: "Nominal (text)", category: "Categorical", color: "teal" },
  department: { type: "Nominal (text)", category: "Categorical", color: "teal" },
  salary: { type: "Continuous (number)", category: "Quantitative", color: "violet" },
  years: { type: "Discrete (integer)", category: "Quantitative", color: "violet" },
  city: { type: "Nominal (text)", category: "Categorical", color: "teal" },
};

/* ─── Learn Step 0: Animated dataset construction ──────────────── */
function WhatIsDataset({ onComplete }) {
  const [headersDone, setHeadersDone] = useState(false);
  const [visibleRows, setVisibleRows] = useState(0);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setHeadersDone(true), 400);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!headersDone) return;
    if (visibleRows >= EMPLOYEE_DATA.length) return;
    const t = setTimeout(() => {
      setVisibleRows((v) => v + 1);
      setCounter((c) => c + 1);
    }, 180);
    return () => clearTimeout(t);
  }, [headersDone, visibleRows]);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">What is a Dataset?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-violet-700">dataset</strong> is a structured collection of data, organized in rows and columns. Watch as one gets built before your eyes:
      </p>

      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-md">
        {/* Terminal-style header */}
        <div className="flex items-center justify-between bg-violet-900 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
            </div>
            <span className="font-mono text-xs text-violet-200">employees.csv</span>
          </div>
          <span className="font-mono text-[10px] text-violet-400">
            {visibleRows} / {EMPLOYEE_DATA.length} rows loaded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b border-violet-200 bg-violet-50 transition-all duration-500 ${headersDone ? "opacity-100" : "opacity-0"}`}>
                {COLUMNS.map((col, ci) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-600"
                    style={{
                      opacity: headersDone ? 1 : 0,
                      transform: headersDone ? "translateY(0)" : "translateY(-8px)",
                      transition: `all 0.3s ease-out ${ci * 80}ms`,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEE_DATA.slice(0, visibleRows).map((row, ri) => (
                <tr
                  key={row.id}
                  className={`border-b border-violet-50 ${ri % 2 === 0 ? "bg-white" : "bg-violet-50/30"}`}
                  style={{
                    animation: "lesson-enter 0.35s ease-out forwards",
                  }}
                >
                  <td className="px-3 py-1.5 font-mono text-xs text-violet-500">{row.id}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{row.name}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{row.department}</td>
                  <td className="px-3 py-1.5 font-mono text-xs text-ink">{row.salary}</td>
                  <td className="px-3 py-1.5 font-mono text-xs text-ink">{row.years}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{row.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row / Column callouts */}
      {visibleRows >= EMPLOYEE_DATA.length && (
        <div className="grid grid-cols-2 gap-3 animate-lesson-enter">
          <div className="rounded-xl border-2 border-violet-200 bg-violet-50/50 p-3">
            <p className="font-mono text-[10px] font-bold uppercase text-violet-600">Rows = Observations</p>
            <p className="mt-1 text-xs text-violet-700">Each row is one employee (10 total)</p>
          </div>
          <div className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-3">
            <p className="font-mono text-[10px] font-bold uppercase text-teal-600">Columns = Variables</p>
            <p className="mt-1 text-xs text-teal-700">Each column measures one attribute (6 total)</p>
          </div>
        </div>
      )}

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Interactive column type explorer ───────────── */
function DataTypesAnalysis({ onComplete }) {
  const [activeCol, setActiveCol] = useState(null);
  const info = activeCol ? DATA_TYPES[activeCol] : null;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Types of Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Click any column header below to see its data type. Understanding types helps you pick the right analysis.
      </p>

      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-200 bg-violet-50">
                {COLUMNS.map((col) => {
                  const isActive = activeCol === col;
                  const dt = DATA_TYPES[col];
                  const accent = dt.color === "violet" ? "bg-violet-500 text-white" : "bg-teal-500 text-white";
                  return (
                    <th
                      key={col}
                      onClick={() => setActiveCol(col)}
                      className={`cursor-pointer select-none px-3 py-2 text-left font-mono text-xs font-bold transition-all duration-200 ${
                        isActive ? accent : "text-violet-600 hover:bg-violet-100"
                      }`}
                    >
                      {col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEE_DATA.slice(0, 5).map((row, ri) => (
                <tr key={row.id} className={`border-b border-violet-50 ${ri % 2 === 0 ? "bg-white" : "bg-violet-50/30"}`}>
                  {COLUMNS.map((col) => {
                    const isActive = activeCol === col;
                    const dt = DATA_TYPES[col];
                    const highlight = isActive
                      ? dt.color === "violet" ? "bg-violet-100 text-violet-800 font-semibold" : "bg-teal-100 text-teal-800 font-semibold"
                      : "";
                    return (
                      <td key={col} className={`px-3 py-1.5 text-xs text-ink transition-all duration-200 ${highlight}`}>
                        {col === "salary" ? `${row[col]}` : row[col]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tooltip for active column */}
      {info && (
        <div className={`rounded-xl border-2 p-4 animate-lesson-enter ${
          info.color === "violet"
            ? "border-violet-200 bg-violet-50/60"
            : "border-teal-200 bg-teal-50/60"
        }`}>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase ${
              info.color === "violet" ? "bg-violet-200 text-violet-700" : "bg-teal-200 text-teal-700"
            }`}>
              {info.category}
            </span>
            <span className={`font-mono text-xs font-semibold ${
              info.color === "violet" ? "text-violet-600" : "text-teal-600"
            }`}>
              {activeCol}
            </span>
          </div>
          <p className={`mt-2 text-xs ${info.color === "violet" ? "text-violet-700" : "text-teal-700"}`}>
            Data type: <strong>{info.type}</strong>
          </p>
          <p className="mt-1 text-xs text-graphite">
            {info.category === "Quantitative"
              ? "You can calculate averages, sums, and ranges for this column."
              : "You can count frequencies and find the mode, but not calculate averages."}
          </p>
        </div>
      )}

      <InsightBox title="Why does this matter?">
        You can calculate an average salary (quantitative), but you cannot calculate an "average department" (categorical). The data type determines which statistics and charts are appropriate.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 2: Missing values / nulls ─────────────────────── */
function MissingValues({ onComplete }) {
  const DIRTY_DATA = [
    { name: "Anna Kowalska", salary: 6500, department: "IT" },
    { name: "Jan Nowak", salary: null, department: "Marketing" },
    { name: "Maria Wisniewska", salary: 7200, department: null },
    { name: "Piotr Lewandowski", salary: 5100, department: "HR" },
    { name: "Kasia Zielinska", salary: null, department: null },
  ];

  const nullCount = DIRTY_DATA.reduce((c, r) => c + (r.salary === null ? 1 : 0) + (r.department === null ? 1 : 0), 0);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Dealing with Missing Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Real-world data is messy. Missing values (shown in <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-xs font-bold text-red-600">NULL</span>) can break calculations and mislead analysis.
      </p>

      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
        <div className="flex items-center justify-between bg-violet-50 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-500">
            Dirty Dataset
          </span>
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-red-600">
            {nullCount} missing values
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-violet-100 bg-white">
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-500">name</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-500">salary</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-500">department</th>
            </tr>
          </thead>
          <tbody>
            {DIRTY_DATA.map((row, i) => (
              <tr key={i} className={`border-b border-violet-50 ${
                row.salary === null || row.department === null ? "bg-red-50/50" : i % 2 === 0 ? "bg-white" : "bg-violet-50/30"
              }`}>
                <td className="px-3 py-1.5 text-xs text-ink">{row.name}</td>
                <td className="px-3 py-1.5 font-mono text-xs">
                  {row.salary !== null
                    ? <span className="text-ink">{row.salary}</span>
                    : <span className="rounded bg-red-200/60 px-1.5 py-0.5 font-bold text-red-600 animate-data-pulse-red">NULL</span>
                  }
                </td>
                <td className="px-3 py-1.5 text-xs">
                  {row.department !== null
                    ? <span className="text-ink">{row.department}</span>
                    : <span className="rounded bg-red-200/60 px-1.5 py-0.5 font-mono font-bold text-red-600 animate-data-pulse-red">NULL</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Strategies */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-500">Strategies</p>
        {[
          { strategy: "Remove rows", desc: "Delete any row with missing values. Simple but you lose data.", when: "Few missing values", icon: "trash" },
          { strategy: "Fill with mean/median", desc: "Replace missing numbers with the average or median.", when: "Numerical columns", icon: "calc" },
          { strategy: "Fill with mode", desc: "Replace missing categories with the most common value.", when: "Categorical columns", icon: "tag" },
          { strategy: "Flag as unknown", desc: "Create a special category 'Unknown' for missing data.", when: "When absence is meaningful", icon: "flag" },
        ].map((s, i) => (
          <div key={s.strategy} className="rounded-xl border border-violet-200/60 bg-white px-4 py-3 shadow-sm animate-lesson-enter"
            style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-700">{s.strategy}</span>
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-violet-600">{s.when}</span>
            </div>
            <p className="mt-0.5 text-xs text-graphite">{s.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 3: InsightBox about data quality ──────────────── */
function DataQuality({ onComplete }) {
  const salaries = EMPLOYEE_DATA.map((e) => e.salary);
  const mean = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  const sorted = [...salaries].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Summary Statistics</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Before analyzing, get a quick overview with <strong className="text-violet-700">summary statistics</strong>. These numbers describe the center, spread, and range of your data.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Mean", value: `${mean}`, desc: "Average salary", icon: "avg" },
          { label: "Median", value: `${median}`, desc: "Middle value", icon: "mid" },
          { label: "Min", value: `${min}`, desc: "Lowest", icon: "min" },
          { label: "Max", value: `${max}`, desc: "Highest", icon: "max" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rounded-xl border border-violet-200/60 bg-white p-3 text-center shadow-sm animate-lesson-enter"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="font-mono text-[10px] font-bold uppercase text-violet-400">{s.label}</p>
            <p className="text-lg font-bold text-violet-600">{s.value} <span className="text-xs font-normal text-violet-400">PLN</span></p>
            <p className="text-[10px] text-graphite">{s.desc}</p>
          </div>
        ))}
      </div>

      <InsightBox title="Mean vs Median">
        The <strong>mean</strong> (average) is sensitive to extreme values. If one employee earns 50,000 PLN, the mean shoots up even though most earn around 5,500. The <strong>median</strong> (middle value) is more robust -- it better represents the "typical" salary.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-violet-700"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ─── Main Lesson Component ────────────────────────────────────── */
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatIsDataset onComplete={onComplete} />;
    if (currentStep === 1) return <DataTypesAnalysis onComplete={onComplete} />;
    if (currentStep === 2) return <MissingValues onComplete={onComplete} />;
    if (currentStep === 3) return <DataQuality onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Spot the Pattern</h2>
          <Quiz
            data={{
              question: "Looking at the employee dataset, which department has the highest average salary?",
              options: ["Marketing", "HR", "IT", "All departments are equal"],
              correctIndex: 2,
              explanation:
                "IT department employees earn the most on average. IT salaries: 6500, 7200, 5500, 8000, 6800 -- average ~6800 PLN. Marketing: 4800, 5200, 4200 -- average ~4733 PLN. HR: 5100, 4500 -- average 4800 PLN.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Filter the Data</h2>
          <p className="text-sm text-graphite">
            Use the filters to explore the dataset and answer the question.
          </p>
          <DataFilterPuzzle
            data={{
              rows: EMPLOYEE_DATA,
              columns: ["id", "name", "department", "salary", "years", "city"],
              question: "How many employees work in Warsaw and earn more than 6000 PLN?",
              options: ["1", "2", "3", "4"],
              correctIndex: 2,
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Data Challenge</h2>
          <DataFilterPuzzle
            data={{
              rows: EMPLOYEE_DATA,
              columns: ["id", "name", "department", "salary", "years", "city"],
              question: "The HR manager asks: 'How many employees have been with us for more than 3 years?' Use filters to find the answer.",
              options: ["2", "3", "4", "5"],
              correctIndex: 2,
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
