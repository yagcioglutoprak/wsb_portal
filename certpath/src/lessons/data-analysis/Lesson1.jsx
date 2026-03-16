import { useState, useEffect, useRef } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DataFilterPuzzle from "../../components/lesson-widgets/DataFilterPuzzle";

/* ── Employee data for a Polish tech company ─────────────────────── */
const EMPLOYEE_DATA = [
  { id: 1, name: "Anna Kowalska", department: "IT", salary: 6500, hireDate: "2021-03-15", city: "Warsaw" },
  { id: 2, name: "Jan Nowak", department: "Marketing", salary: 4800, hireDate: "2023-06-01", city: "Krakow" },
  { id: 3, name: "Maria Wisniewska", department: "IT", salary: 7200, hireDate: "2019-09-20", city: "Warsaw" },
  { id: 4, name: "Piotr Lewandowski", department: "HR", salary: 5100, hireDate: "2022-01-10", city: "Poznan" },
  { id: 5, name: "Kasia Zielinska", department: "IT", salary: 5500, hireDate: "2023-08-01", city: "Warsaw" },
  { id: 6, name: "Tomek Szymanski", department: "Marketing", salary: 5200, hireDate: "2022-04-18", city: "Krakow" },
  { id: 7, name: "Ola Dabrowska", department: "HR", salary: 4500, hireDate: "2020-07-22", city: "Poznan" },
  { id: 8, name: "Michal Kozlowski", department: "IT", salary: 8000, hireDate: "2018-02-14", city: "Warsaw" },
  { id: 9, name: "Ewa Kaminska", department: "Marketing", salary: 4200, hireDate: "2023-11-30", city: "Gdansk" },
  { id: 10, name: "Adam Wojcik", department: "IT", salary: 6800, hireDate: "2020-05-05", city: "Krakow" },
  { id: 11, name: "Zofia Mazur", department: "HR", salary: 4700, hireDate: "2021-10-01", city: "Warsaw" },
  { id: 12, name: "Bartek Krawczyk", department: "IT", salary: 7500, hireDate: "2019-01-15", city: "Gdansk" },
];

const COLUMNS = ["id", "name", "department", "salary", "hireDate", "city"];

const TYPE_INFO = {
  id: { type: "INT", label: "Identifier", color: "#8b5cf6", bg: "#f5f3ff" },
  name: { type: "TEXT", label: "Name", color: "#14b8a6", bg: "#f0fdfa" },
  department: { type: "TEXT", label: "Category", color: "#14b8a6", bg: "#f0fdfa" },
  salary: { type: "DECIMAL", label: "Currency", color: "#f97316", bg: "#fff7ed" },
  hireDate: { type: "DATE", label: "Date", color: "#3b82f6", bg: "#eff6ff" },
  city: { type: "TEXT", label: "Location", color: "#14b8a6", bg: "#f0fdfa" },
};

/* ─── Learn Step 0: Animated dataset construction ──────────────── */
function WhatIsDataset({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=nothing, 1=headers, 2=rows, 3=labels
  const [visibleRows, setVisibleRows] = useState(0);
  const [labelIdx, setLabelIdx] = useState(-1);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    const t = setTimeout(() => setPhase(2), 600);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    if (visibleRows >= 6) {
      const t = setTimeout(() => setPhase(3), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleRows((v) => v + 1), 140);
    return () => clearTimeout(t);
  }, [phase, visibleRows]);

  useEffect(() => {
    if (phase !== 3) return;
    if (labelIdx >= 2) return;
    const t = setTimeout(() => setLabelIdx((l) => l + 1), 500);
    return () => clearTimeout(t);
  }, [phase, labelIdx]);

  const labels = [
    { text: "Row = one record (employee)", top: "35%", left: "-2%", arrow: "right", color: "#8b5cf6" },
    { text: "Column = one attribute", top: "-4%", left: "40%", arrow: "down", color: "#14b8a6" },
    { text: "Cell = one data value", top: "55%", left: "75%", arrow: "left", color: "#f97316" },
  ];

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">What is a Dataset?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-violet-700">dataset</strong> is a structured collection of data, organized in rows and columns -- like a spreadsheet. Watch as one gets built before your eyes:
      </p>

      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-md">
          {/* Terminal header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-900 to-indigo-900 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80"></span>
                <span className="h-3 w-3 rounded-full bg-amber-400/80"></span>
                <span className="h-3 w-3 rounded-full bg-green-400/80"></span>
              </div>
              <span className="font-mono text-xs text-violet-200/80">employees.csv</span>
            </div>
            <span className="font-mono text-[10px] text-violet-400">
              {visibleRows} / 6 rows loaded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b border-violet-200 bg-violet-50 transition-all duration-500 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}>
                  {COLUMNS.map((col, ci) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-left"
                      style={{
                        opacity: phase >= 1 ? 1 : 0,
                        transform: phase >= 1 ? "translateY(0)" : "translateY(-10px)",
                        transition: `all 0.35s ease-out ${ci * 60}ms`,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: TYPE_INFO[col].color }}>{col}</span>
                      <span className="ml-1.5 rounded px-1 py-0.5 font-mono text-[8px] font-bold uppercase"
                        style={{ backgroundColor: TYPE_INFO[col].bg, color: TYPE_INFO[col].color }}>
                        {TYPE_INFO[col].type}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EMPLOYEE_DATA.slice(0, visibleRows).map((row, ri) => (
                  <tr
                    key={row.id}
                    className={`border-b border-violet-50 ${ri % 2 === 0 ? "bg-white" : "bg-violet-50/20"}`}
                    style={{
                      animation: "lesson-enter 0.3s ease-out forwards",
                      animationDelay: `${ri * 40}ms`,
                    }}
                  >
                    <td className="px-3 py-1.5 font-mono text-xs text-violet-500">{row.id}</td>
                    <td className="px-3 py-1.5 text-xs font-medium text-ink">{row.name}</td>
                    <td className="px-3 py-1.5 text-xs text-ink">{row.department}</td>
                    <td className="px-3 py-1.5 font-mono text-xs text-ink">{row.salary} PLN</td>
                    <td className="px-3 py-1.5 font-mono text-xs text-ink">{row.hireDate}</td>
                    <td className="px-3 py-1.5 text-xs text-ink">{row.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Animated labels */}
        {phase >= 3 && labels.map((label, i) => (
          <div
            key={i}
            className="absolute rounded-lg border-2 px-3 py-1.5 text-xs font-bold shadow-lg bg-white"
            style={{
              borderColor: label.color,
              color: label.color,
              top: label.top,
              left: label.left,
              opacity: labelIdx >= i ? 1 : 0,
              transform: labelIdx >= i ? "scale(1)" : "scale(0.8)",
              transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              zIndex: 10,
            }}
          >
            {label.text}
          </div>
        ))}
      </div>

      {/* Row / Column summary cards */}
      {phase >= 3 && (
        <div className="grid grid-cols-2 gap-3 animate-lesson-enter">
          <div className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="8" x2="14" y2="8" />
              </svg>
              <p className="font-mono text-[10px] font-bold uppercase text-violet-600">Rows = Records</p>
            </div>
            <p className="text-xs text-violet-700">Each row is one employee observation</p>
          </div>
          <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round">
                <line x1="8" y1="2" x2="8" y2="14" />
              </svg>
              <p className="font-mono text-[10px] font-bold uppercase text-teal-600">Columns = Variables</p>
            </div>
            <p className="text-xs text-teal-700">Each column measures one attribute (6 total)</p>
          </div>
        </div>
      )}

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Color-coded data types ───────────────────────── */
function DataTypesExplorer({ onComplete }) {
  const [highlightType, setHighlightType] = useState(null);
  const [autoStep, setAutoStep] = useState(-1);
  const types = ["TEXT", "INT", "DECIMAL", "DATE"];
  const typeColors = { TEXT: "#14b8a6", INT: "#8b5cf6", DECIMAL: "#f97316", DATE: "#3b82f6" };
  const typeBgs = { TEXT: "#f0fdfa", INT: "#f5f3ff", DECIMAL: "#fff7ed", DATE: "#eff6ff" };
  const typeDescs = {
    TEXT: "Names, categories, labels -- text values that cannot be averaged or summed.",
    INT: "Whole numbers like IDs or counts. Can be used in calculations.",
    DECIMAL: "Numbers with precision, like salary or price. Essential for financial analysis.",
    DATE: "Temporal data. Enables time-based filtering and trend analysis.",
  };

  useEffect(() => {
    if (autoStep >= types.length - 1) return;
    const t = setTimeout(() => {
      const next = autoStep + 1;
      setAutoStep(next);
      setHighlightType(types[next]);
    }, autoStep === -1 ? 800 : 1800);
    return () => clearTimeout(t);
  }, [autoStep]);

  const getColType = (col) => TYPE_INFO[col].type;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Data Types in Datasets</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Every column has a <strong className="text-violet-700">data type</strong> that determines what operations you can perform. Watch each type highlight in sequence:
      </p>

      {/* Type legend */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setHighlightType(highlightType === t ? null : t)}
            className={`rounded-full border-2 px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-all duration-300 ${
              highlightType === t
                ? "shadow-md scale-105"
                : "opacity-60 hover:opacity-100"
            }`}
            style={{
              borderColor: typeColors[t],
              backgroundColor: highlightType === t ? typeColors[t] : typeBgs[t],
              color: highlightType === t ? "white" : typeColors[t],
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table with highlighting */}
      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-200 bg-gradient-to-r from-violet-700 to-indigo-700">
                {COLUMNS.map((col) => (
                  <th key={col} className="px-3 py-2.5 text-left">
                    <span className="font-mono text-xs font-bold text-white/90">{col}</span>
                    <span className="ml-1 rounded px-1 py-0.5 font-mono text-[8px] font-bold uppercase text-white/70 bg-white/15">
                      {getColType(col)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEE_DATA.slice(0, 5).map((row, ri) => (
                <tr key={row.id} className={`border-b border-violet-50 ${ri % 2 === 0 ? "bg-white" : "bg-violet-50/20"}`}>
                  {COLUMNS.map((col) => {
                    const colType = getColType(col);
                    const isHighlighted = highlightType === colType;
                    return (
                      <td key={col} className="px-3 py-2 text-xs transition-all duration-400"
                        style={{
                          backgroundColor: isHighlighted ? typeBgs[colType] : "transparent",
                          color: isHighlighted ? typeColors[colType] : "",
                          fontWeight: isHighlighted ? 600 : 400,
                          borderBottom: isHighlighted ? `2px solid ${typeColors[colType]}` : "",
                        }}>
                        {col === "salary" ? `${row[col]} PLN` : row[col]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Type explanation */}
      {highlightType && (
        <div className="rounded-xl border-2 p-4 animate-lesson-enter"
          style={{ borderColor: typeColors[highlightType], backgroundColor: typeBgs[highlightType] }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold text-white"
              style={{ backgroundColor: typeColors[highlightType] }}>
              {highlightType}
            </span>
            <span className="font-mono text-xs font-semibold" style={{ color: typeColors[highlightType] }}>
              {highlightType === "TEXT" ? "name, department, city" : highlightType === "INT" ? "id" : highlightType === "DECIMAL" ? "salary" : "hireDate"}
            </span>
          </div>
          <p className="text-xs" style={{ color: typeColors[highlightType] }}>
            {typeDescs[highlightType]}
          </p>
        </div>
      )}

      <InsightBox title="Why does this matter?">
        You can calculate an average salary (DECIMAL), but you cannot calculate an "average department" (TEXT). The data type determines which statistics and charts are appropriate. Mixing types leads to errors.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 2: Missing values and outliers ──────────────────── */
function MissingValuesAndOutliers({ onComplete }) {
  const [highlightPhase, setHighlightPhase] = useState(0); // 0=none, 1=missing, 2=outliers
  const DIRTY_DATA = [
    { name: "Anna Kowalska", salary: 6500, department: "IT", hireDate: "2021-03-15" },
    { name: "Jan Nowak", salary: null, department: "Marketing", hireDate: "2023-06-01" },
    { name: "Maria Wisniewska", salary: 7200, department: null, hireDate: "2019-09-20" },
    { name: "Piotr Lewandowski", salary: 5100, department: "HR", hireDate: null },
    { name: "Kasia Zielinska", salary: 999999, department: "IT", hireDate: "2023-08-01" },
    { name: "Tomek Szymanski", salary: 5200, department: "Marketing", hireDate: "2022-04-18" },
    { name: "Ola Dabrowska", salary: null, department: null, hireDate: "2020-07-22" },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setHighlightPhase(1), 600);
    const t2 = setTimeout(() => setHighlightPhase(2), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const nullCount = DIRTY_DATA.reduce((c, r) =>
    c + (r.salary === null ? 1 : 0) + (r.department === null ? 1 : 0) + (r.hireDate === null ? 1 : 0), 0);
  const outlierCount = DIRTY_DATA.filter((r) => r.salary > 100000).length;
  const isOutlier = (v) => v !== null && v > 100000;

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Missing Values & Outliers</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Real-world data is messy. Two common issues are <strong className="text-red-600">missing values</strong> (empty cells) and <strong className="text-amber-600">outliers</strong> (extreme values that do not fit the pattern).
      </p>

      {/* Issue counters */}
      <div className="flex gap-3">
        <div className={`flex-1 rounded-xl border-2 p-3 text-center transition-all duration-500 ${
          highlightPhase >= 1 ? "border-red-300 bg-red-50 shadow-sm" : "border-violet-100 bg-white"
        }`}>
          <p className="font-mono text-2xl font-black text-red-500">{nullCount}</p>
          <p className="font-mono text-[9px] font-bold uppercase text-red-400">Missing values</p>
        </div>
        <div className={`flex-1 rounded-xl border-2 p-3 text-center transition-all duration-500 ${
          highlightPhase >= 2 ? "border-amber-300 bg-amber-50 shadow-sm" : "border-violet-100 bg-white"
        }`}>
          <p className="font-mono text-2xl font-black text-amber-500">{outlierCount}</p>
          <p className="font-mono text-[9px] font-bold uppercase text-amber-400">Outliers detected</p>
        </div>
      </div>

      {/* Table with problems highlighted */}
      <div className="overflow-hidden rounded-xl border border-violet-200/60 shadow-sm">
        <div className="flex items-center justify-between bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/90">
            Dirty Dataset
          </span>
          <div className="flex gap-2">
            <span className="rounded-full bg-red-400/20 px-2 py-0.5 font-mono text-[9px] font-bold text-red-200">
              NULL = missing
            </span>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-200">
              !!! = outlier
            </span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-violet-100 bg-violet-50/50">
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-600">name</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-600">salary</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-600">department</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-violet-600">hireDate</th>
            </tr>
          </thead>
          <tbody>
            {DIRTY_DATA.map((row, i) => {
              const hasNull = row.salary === null || row.department === null || row.hireDate === null;
              const hasOutlier = isOutlier(row.salary);
              return (
                <tr key={i} className={`border-b border-violet-50 transition-all duration-500 ${
                  hasNull && highlightPhase >= 1 ? "bg-red-50/40" : hasOutlier && highlightPhase >= 2 ? "bg-amber-50/40" : i % 2 === 0 ? "bg-white" : "bg-violet-50/20"
                }`}>
                  <td className="px-3 py-2 text-xs font-medium text-ink">{row.name}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {row.salary === null ? (
                      <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-bold transition-all duration-500 ${
                        highlightPhase >= 1 ? "border-red-300 bg-red-100 text-red-600 animate-data-pulse-red" : "border-violet-200 bg-violet-50 text-violet-400"
                      }`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="5" r="3.5" strokeDasharray="2 2"/></svg>
                        N/A
                      </span>
                    ) : isOutlier(row.salary) ? (
                      <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-bold transition-all duration-500 ${
                        highlightPhase >= 2 ? "border-amber-300 bg-amber-100 text-amber-700 shadow-sm shadow-amber-200" : "text-ink"
                      }`}>
                        {highlightPhase >= 2 && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#d97706" strokeWidth="1.5"><path d="M5 2v4M5 7.5v.5"/></svg>}
                        {row.salary.toLocaleString()} PLN
                      </span>
                    ) : (
                      <span className="text-ink">{row.salary.toLocaleString()} PLN</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {row.department !== null ? (
                      <span className="text-ink">{row.department}</span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono font-bold transition-all duration-500 ${
                        highlightPhase >= 1 ? "border-red-300 bg-red-100 text-red-600 animate-data-pulse-red" : "border-violet-200 bg-violet-50 text-violet-400"
                      }`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="5" r="3.5" strokeDasharray="2 2"/></svg>
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {row.hireDate !== null ? (
                      <span className="text-ink">{row.hireDate}</span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-bold transition-all duration-500 ${
                        highlightPhase >= 1 ? "border-red-300 bg-red-100 text-red-600 animate-data-pulse-red" : "border-violet-200 bg-violet-50 text-violet-400"
                      }`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="5" r="3.5" strokeDasharray="2 2"/></svg>
                        N/A
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explanation cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4 animate-lesson-enter" style={{ animationDelay: "200ms" }}>
          <p className="font-mono text-[10px] font-bold uppercase text-red-600 mb-2">Missing Values</p>
          <ul className="space-y-1 text-xs text-red-700">
            <li>Break calculations (average salary becomes wrong)</li>
            <li>Strategies: delete row, fill with mean/median, or flag as "Unknown"</li>
          </ul>
        </div>
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4 animate-lesson-enter" style={{ animationDelay: "400ms" }}>
          <p className="font-mono text-[10px] font-bold uppercase text-amber-600 mb-2">Outliers</p>
          <ul className="space-y-1 text-xs text-amber-700">
            <li>Salary of 999,999 among ~5,000 values -- likely a data entry error</li>
            <li>Distort mean, standard deviation, and visualizations</li>
          </ul>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 3: Summary statistics + InsightBox ──────────────── */
function SummaryStats({ onComplete }) {
  const salaries = EMPLOYEE_DATA.map((e) => e.salary);
  const mean = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  const sorted = [...salaries].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const count = salaries.length;

  const stats = [
    { label: "Count", value: count, unit: "records", color: "#6366f1", icon: "#" },
    { label: "Mean", value: mean, unit: "PLN", color: "#8b5cf6", icon: "x\u0304" },
    { label: "Median", value: median, unit: "PLN", color: "#14b8a6", icon: "M\u0303" },
    { label: "Min", value: min, unit: "PLN", color: "#3b82f6", icon: "\u2193" },
    { label: "Max", value: max, unit: "PLN", color: "#f43f5e", icon: "\u2191" },
  ];

  const [visibleStats, setVisibleStats] = useState(0);
  useEffect(() => {
    if (visibleStats >= stats.length) return;
    const t = setTimeout(() => setVisibleStats((v) => v + 1), 200);
    return () => clearTimeout(t);
  }, [visibleStats]);

  return (
    <div className="skill-theme-data space-y-6 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Summary Statistics</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Before diving into analysis, get a quick overview with <strong className="text-violet-700">summary statistics</strong>. These numbers describe the center, spread, and shape of your data.
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-xl border bg-white p-3 text-center shadow-sm"
            style={{
              borderColor: i < visibleStats ? s.color + "40" : "#e5e7eb",
              opacity: i < visibleStats ? 1 : 0.3,
              transform: i < visibleStats ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
              transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`,
            }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: s.color }}>
                {s.icon}
              </span>
            </div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: s.color + "90" }}>{s.label}</p>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value.toLocaleString()}</p>
            <p className="text-[9px] text-graphite">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Salary distribution mini-chart */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Salary Distribution</p>
        <svg viewBox="0 0 360 80" className="w-full">
          {/* Number line */}
          <line x1="20" y1="50" x2="340" y2="50" stroke="#ddd6fe" strokeWidth="2" />
          {/* Min/Max markers */}
          <line x1="20" y1="42" x2="20" y2="58" stroke="#3b82f6" strokeWidth="2" />
          <text x="20" y="70" textAnchor="middle" fill="#3b82f6" style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>{min}</text>
          <line x1="340" y1="42" x2="340" y2="58" stroke="#f43f5e" strokeWidth="2" />
          <text x="340" y="70" textAnchor="middle" fill="#f43f5e" style={{ fontSize: 8, fontFamily: "var(--font-mono)" }}>{max}</text>
          {/* Data points */}
          {sorted.map((s, i) => {
            const x = 20 + ((s - min) / (max - min)) * 320;
            return (
              <circle key={i} cx={x} cy="50" r="5" fill="#8b5cf6" opacity="0.6"
                style={{ animation: `scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms both` }} />
            );
          })}
          {/* Mean marker */}
          <line x1={20 + ((mean - min) / (max - min)) * 320} y1="30" x2={20 + ((mean - min) / (max - min)) * 320} y2="50"
            stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
          <text x={20 + ((mean - min) / (max - min)) * 320} y="24" textAnchor="middle" fill="#f97316"
            style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>Mean: {mean}</text>
          {/* Median marker */}
          <line x1={20 + ((median - min) / (max - min)) * 320} y1="30" x2={20 + ((median - min) / (max - min)) * 320} y2="50"
            stroke="#14b8a6" strokeWidth="2" strokeDasharray="3 2" />
          <text x={20 + ((median - min) / (max - min)) * 320} y="16" textAnchor="middle" fill="#14b8a6"
            style={{ fontSize: 8, fontFamily: "var(--font-mono)", fontWeight: 700 }}>Median: {median}</text>
        </svg>
      </div>

      <InsightBox title="Mean vs Median">
        The <strong>mean</strong> (average) is sensitive to extreme values. If one employee earns 50,000 PLN, the mean jumps even though most earn around 5,500. The <strong>median</strong> (middle value) is more robust -- it better represents the "typical" salary. When mean and median differ significantly, your data is skewed.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
    if (currentStep === 1) return <DataTypesExplorer onComplete={onComplete} />;
    if (currentStep === 2) return <MissingValuesAndOutliers onComplete={onComplete} />;
    if (currentStep === 3) return <SummaryStats onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Spot the Pattern</h2>
          <Quiz
            data={{
              question: "What does a missing value (NULL/N/A) in a salary column indicate?",
              options: [
                "The employee earns zero",
                "The data was not collected or recorded for this employee",
                "The employee was fired",
                "The salary is confidential and stored elsewhere",
              ],
              correctIndex: 1,
              explanation:
                "A missing value means the data was not collected, not entered, or was lost during processing. It does NOT mean zero -- that is a common mistake. The absence of data is different from a data value of zero.",
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
              columns: ["id", "name", "department", "salary", "hireDate", "city"],
              question: "How many employees are in the IT department?",
              options: ["3", "4", "5", "6"],
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
          <p className="text-sm text-graphite">
            This one requires filtering AND mental calculation. Take your time.
          </p>
          <DataFilterPuzzle
            data={{
              rows: EMPLOYEE_DATA,
              columns: ["id", "name", "department", "salary", "hireDate", "city"],
              question: "What is the average salary of employees hired after 2022-01-01? (Filter first, then calculate the mean of matching salaries.)",
              options: ["4,833 PLN", "5,175 PLN", "4,925 PLN", "5,500 PLN"],
              correctIndex: 0,
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
