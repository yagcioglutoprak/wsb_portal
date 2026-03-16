import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import QueryBuilder from "../../components/lesson-widgets/QueryBuilder";

const EMPLOYEES = [
  { id: 1, name: "Anna Kowalska", department: "IT", salary: 6500, hired: "2022-03-15" },
  { id: 2, name: "Jan Nowak", department: "Marketing", salary: 4800, hired: "2023-07-01" },
  { id: 3, name: "Maria Wisniewska", department: "IT", salary: 7200, hired: "2021-11-20" },
  { id: 4, name: "Piotr Lewandowski", department: "HR", salary: 5100, hired: "2024-01-10" },
  { id: 5, name: "Kasia Zielinska", department: "IT", salary: 5500, hired: "2023-09-05" },
  { id: 6, name: "Tomek Szymanski", department: "Marketing", salary: 5200, hired: "2024-02-28" },
  { id: 7, name: "Ola Dabrowska", department: "HR", salary: 4500, hired: "2022-06-14" },
  { id: 8, name: "Michal Kozlowski", department: "IT", salary: 8000, hired: "2020-08-01" },
];

const ALL_COLS = ["id", "name", "department", "salary", "hired"];

/* ─── Learn Step 0: SELECT visual -- columns highlight ─────── */
function SelectVisual({ onComplete }) {
  const [selectedCols, setSelectedCols] = useState(new Set(ALL_COLS));
  const [phase, setPhase] = useState("all"); // "all" -> "selected"

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedCols(new Set(["name", "department"]));
      setPhase("selected");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">SELECT: Reading Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">SELECT</strong> is the most fundamental SQL command -- it retrieves data from a table. Every query starts with SELECT.
      </p>

      {/* Code block showing the query */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
          <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">query.sql</span>
        </div>
        <div className="px-4 py-3 font-mono text-sm">
          <span className="text-slate-600 mr-3 select-none">1</span>
          <span className="text-indigo-400">SELECT</span>{" "}
          <span className={`transition-colors duration-500 ${phase === "selected" ? "text-white font-semibold" : "text-slate-400"}`}>
            {phase === "selected" ? "name, department" : "*"}
          </span>{" "}
          <span className="text-emerald-400">FROM</span>{" "}
          <span className="text-slate-300">employees</span>
          <span className="text-slate-500">;</span>
        </div>
      </div>

      {/* Visual table with column fading */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">Result</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                {ALL_COLS.map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-700 ${
                      selectedCols.has(col)
                        ? "text-indigo-600 bg-indigo-50/50"
                        : "text-slate-300 bg-slate-50/50"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.slice(0, 5).map((e, i) => (
                <tr key={e.id} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                  {ALL_COLS.map((col) => (
                    <td
                      key={col}
                      className={`px-4 py-2 font-mono text-xs transition-all duration-700 ${
                        selectedCols.has(col)
                          ? "text-slate-700"
                          : "text-slate-200"
                      }`}
                    >
                      {e[col]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={ALL_COLS.length} className="px-4 py-1 text-[10px] text-slate-400 italic">
                  ... {EMPLOYEES.length - 5} more rows
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InsightBox title="SELECT * means everything">
        Use <code className="font-mono text-xs">SELECT *</code> to get all columns. It is handy for exploring, but in production code, always list specific columns -- it is faster and clearer.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: FROM ──────────────────────────────────── */
function FromClause({ onComplete }) {
  const [activeTable, setActiveTable] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setActiveTable("employees"), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">FROM: Which Table?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">FROM</strong> tells SQL which table to read from. A database can have dozens of tables -- FROM specifies the one you want.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {["employees", "courses", "grades"].map((table) => (
          <div
            key={table}
            className={`rounded-xl border-2 p-4 text-center font-mono text-sm font-bold transition-all duration-500 ${
              activeTable === table
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100 scale-105"
                : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={activeTable === table ? "text-indigo-500" : "text-slate-300"}>
                <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {table}
            </div>
            {activeTable === table && (
              <p className="mt-1 font-sans text-[10px] font-normal text-indigo-500 animate-lesson-enter">selected</p>
            )}
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <div className="px-4 py-3 font-mono text-sm">
          <p>
            <span className="text-slate-600 mr-3 select-none">1</span>
            <span className="text-indigo-400">SELECT</span>{" "}
            <span className="text-slate-300">name, salary</span>
          </p>
          <p>
            <span className="text-slate-600 mr-3 select-none">2</span>
            <span className="text-emerald-400">FROM</span>{" "}
            <span className="text-amber-300">employees</span>
            <span className="text-slate-500">;</span>{" "}
            <span className="text-slate-600">-- reads from the employees table</span>
          </p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 2: WHERE -- matching rows glow ──────────── */
function WhereClause({ onComplete }) {
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFilterActive(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">WHERE: Filtering Rows</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">WHERE</strong> filters which rows are returned. Only rows that match the condition are included in the result.
      </p>

      {/* Query */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
        </div>
        <div className="px-4 py-3 font-mono text-sm">
          <span className="text-slate-600 mr-3 select-none">1</span>
          <span className="text-indigo-400">SELECT</span>{" "}
          <span className="text-slate-300">*</span>{" "}
          <span className="text-emerald-400">FROM</span>{" "}
          <span className="text-slate-300">employees</span>{" "}
          <span className="text-amber-400">WHERE</span>{" "}
          <span className="text-slate-300">department</span>{" "}
          <span className="text-slate-500">=</span>{" "}
          <span className="text-green-400">'IT'</span>
          <span className="text-slate-500">;</span>
        </div>
      </div>

      {/* Table with row highlighting */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">employees</span>
          {filterActive && (
            <span className="animate-lesson-enter rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600">
              WHERE department = 'IT'
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                {["id", "name", "department", "salary"].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map((e, i) => {
                const isMatch = e.department === "IT";
                return (
                  <tr
                    key={e.id}
                    className={`border-b border-slate-100 transition-all duration-700 ${
                      filterActive
                        ? isMatch
                          ? "bg-indigo-50/60"
                          : "opacity-30"
                        : i % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/30"
                    }`}
                  >
                    <td className="px-4 py-2 font-mono text-xs font-bold text-indigo-600">{e.id}</td>
                    <td className="px-4 py-2 text-xs text-slate-700">{e.name}</td>
                    <td className={`px-4 py-2 text-xs font-mono transition-all duration-500 ${
                      filterActive && isMatch ? "font-bold text-emerald-600" : "text-slate-600"
                    }`}>{e.department}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-700">{e.salary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filterActive && (
          <div className="animate-lesson-enter border-t border-slate-100 bg-slate-50/50 px-4 py-2">
            <p className="font-mono text-[10px] text-slate-500">
              {EMPLOYEES.filter((e) => e.department === "IT").length} of {EMPLOYEES.length} rows match the filter
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 3: AND / OR logic ─────────────────────────── */
function AndOrStep({ onComplete }) {
  const [mode, setMode] = useState("and"); // "and" | "or"

  const andRows = EMPLOYEES.filter((e) => e.department === "IT" && e.salary > 6000);
  const orRows = EMPLOYEES.filter((e) => e.department === "IT" || e.department === "Marketing");

  const activeRows = mode === "and" ? andRows : orRows;

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">AND / OR: Combining Conditions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        You can combine multiple conditions with <strong className="text-ink">AND</strong> (both must be true) or <strong className="text-ink">OR</strong> (either can be true).
      </p>

      {/* Toggle between AND/OR */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("and")}
          className={`rounded-lg border-2 px-4 py-2 font-mono text-sm font-bold transition-all ${
            mode === "and"
              ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
              : "border-slate-200 bg-white text-slate-400 hover:border-orange-200"
          }`}
        >
          AND
        </button>
        <button
          onClick={() => setMode("or")}
          className={`rounded-lg border-2 px-4 py-2 font-mono text-sm font-bold transition-all ${
            mode === "or"
              ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
              : "border-slate-200 bg-white text-slate-400 hover:border-blue-200"
          }`}
        >
          OR
        </button>
      </div>

      {/* Query */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <div className="px-4 py-3 font-mono text-sm">
          <p><span className="text-slate-600 mr-3 select-none">1</span><span className="text-indigo-400">SELECT</span> <span className="text-slate-300">name, salary</span></p>
          <p><span className="text-slate-600 mr-3 select-none">2</span><span className="text-emerald-400">FROM</span> <span className="text-slate-300">employees</span></p>
          {mode === "and" ? (
            <>
              <p><span className="text-slate-600 mr-3 select-none">3</span><span className="text-amber-400">WHERE</span> <span className="text-slate-300">department</span> <span className="text-slate-500">=</span> <span className="text-green-400">'IT'</span></p>
              <p><span className="text-slate-600 mr-3 select-none">4</span>  <span className="text-orange-400">AND</span> <span className="text-slate-300">salary</span> <span className="text-slate-500">&gt;</span> <span className="text-amber-300">6000</span><span className="text-slate-500">;</span></p>
            </>
          ) : (
            <>
              <p><span className="text-slate-600 mr-3 select-none">3</span><span className="text-amber-400">WHERE</span> <span className="text-slate-300">department</span> <span className="text-slate-500">=</span> <span className="text-green-400">'IT'</span></p>
              <p><span className="text-slate-600 mr-3 select-none">4</span>  <span className="text-blue-400">OR</span> <span className="text-slate-300">department</span> <span className="text-slate-500">=</span> <span className="text-green-400">'Marketing'</span><span className="text-slate-500">;</span></p>
            </>
          )}
        </div>
      </div>

      {/* Result table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">Result</span>
          <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
            mode === "and" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
          }`}>
            {activeRows.length} rows
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">name</th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">department</th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">salary</th>
            </tr>
          </thead>
          <tbody>
            {activeRows.map((e, i) => (
              <tr key={e.id} className={`border-b border-slate-100 animate-sql-row-in ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`} style={{ animationDelay: `${i * 60}ms` }}>
                <td className="px-4 py-2 text-xs text-slate-700">{e.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-600">{e.department}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-700">{e.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual explanation */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl border-2 p-3 text-center transition-all ${mode === "and" ? "border-orange-300 bg-orange-50/50" : "border-slate-200 bg-white"}`}>
          <p className="font-mono text-xs font-bold text-orange-600">AND narrows</p>
          <p className="mt-1 text-[11px] text-slate-600">Both conditions must be true</p>
          <p className="mt-1 font-mono text-lg font-bold text-orange-500">{andRows.length} rows</p>
        </div>
        <div className={`rounded-xl border-2 p-3 text-center transition-all ${mode === "or" ? "border-blue-300 bg-blue-50/50" : "border-slate-200 bg-white"}`}>
          <p className="font-mono text-xs font-bold text-blue-600">OR widens</p>
          <p className="mt-1 text-[11px] text-slate-600">Either condition can be true</p>
          <p className="mt-1 font-mono text-lg font-bold text-blue-500">{orRows.length} rows</p>
        </div>
      </div>

      <InsightBox title="AND narrows, OR widens">
        Adding <strong>AND</strong> gives you fewer results (more restrictive). Adding <strong>OR</strong> gives you more results (less restrictive). Think: "must be in IT AND earn over 6000" vs "in IT OR in Marketing".
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 4: ORDER BY ───────────────────────────────── */
function OrderByStep({ onComplete }) {
  const [sortDir, setSortDir] = useState("desc");
  const sorted = [...EMPLOYEES].sort((a, b) =>
    sortDir === "desc" ? b.salary - a.salary : a.salary - b.salary
  );

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">ORDER BY: Sorting Results</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">ORDER BY</strong> sorts your results. Use <code className="font-mono text-xs bg-slate-100 px-1 rounded">ASC</code> for ascending (default) or <code className="font-mono text-xs bg-slate-100 px-1 rounded">DESC</code> for descending.
      </p>

      {/* Toggle ASC/DESC */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortDir("asc")}
          className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold transition-all ${
            sortDir === "asc"
              ? "border-pink-400 bg-pink-50 text-pink-700"
              : "border-slate-200 bg-white text-slate-400 hover:border-pink-200"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 2L8 7H2L5 2Z" fill="currentColor"/></svg>
          ASC
        </button>
        <button
          onClick={() => setSortDir("desc")}
          className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold transition-all ${
            sortDir === "desc"
              ? "border-pink-400 bg-pink-50 text-pink-700"
              : "border-slate-200 bg-white text-slate-400 hover:border-pink-200"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 8L2 3H8L5 8Z" fill="currentColor"/></svg>
          DESC
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <div className="px-4 py-3 font-mono text-sm">
          <p><span className="text-slate-600 mr-3 select-none">1</span><span className="text-indigo-400">SELECT</span> <span className="text-slate-300">name, salary</span></p>
          <p><span className="text-slate-600 mr-3 select-none">2</span><span className="text-emerald-400">FROM</span> <span className="text-slate-300">employees</span></p>
          <p><span className="text-slate-600 mr-3 select-none">3</span><span className="text-pink-400">ORDER BY</span> <span className="text-slate-300">salary</span> <span className="text-amber-300">{sortDir.toUpperCase()}</span><span className="text-slate-500">;</span></p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-1">#</div>
              </th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">name</th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-pink-500">
                <div className="flex items-center gap-1">
                  salary
                  <svg width="10" height="10" viewBox="0 0 10 10" className="text-pink-500">
                    {sortDir === "asc"
                      ? <path d="M5 2L8 7H2L5 2Z" fill="currentColor"/>
                      : <path d="M5 8L2 3H8L5 8Z" fill="currentColor"/>
                    }
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 6).map((e, i) => (
              <tr
                key={e.id}
                className={`border-b border-slate-100 animate-sql-row-in ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-4 py-2 font-mono text-[10px] text-slate-400">{i + 1}</td>
                <td className="px-4 py-2 text-xs text-slate-700">{e.name}</td>
                <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-700">{e.salary.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-300"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ─── Main Lesson Component ──────────────────────────────────── */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <SelectVisual onComplete={onComplete} />;
    if (currentStep === 1) return <FromClause onComplete={onComplete} />;
    if (currentStep === 2) return <WhereClause onComplete={onComplete} />;
    if (currentStep === 3) return <AndOrStep onComplete={onComplete} />;
    if (currentStep === 4) return <OrderByStep onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build a Query</h2>
          <p className="text-sm text-graphite">
            Get all IT department employees. Arrange the SQL clauses in the correct order.
          </p>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT *", type: "select" },
                { id: "c2", sql: "FROM employees", type: "from" },
                { id: "c3", sql: "WHERE department = 'IT'", type: "where", filterFn: (row) => row.department === "IT" },
                { id: "c4", sql: "GROUP BY department", type: "group", isDistractor: true },
              ],
              correctOrder: ["c1", "c2", "c3"],
              sampleData: EMPLOYEES,
              columns: ["id", "name", "department", "salary", "hired"],
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Complex Query</h2>
          <p className="text-sm text-graphite">
            Find employees in IT who earn more than 6000, sorted by salary descending.
          </p>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT name, salary", type: "select" },
                { id: "c2", sql: "FROM employees", type: "from" },
                { id: "c3", sql: "WHERE department = 'IT'", type: "where", filterFn: (row) => row.department === "IT" },
                { id: "c4", sql: "AND salary > 6000", type: "where", filterFn: (row) => row.salary > 6000 },
                { id: "c5", sql: "ORDER BY salary DESC", type: "order" },
                { id: "c6", sql: "HAVING salary > 6000", type: "having", isDistractor: true },
              ],
              correctOrder: ["c1", "c2", "c3", "c4", "c5"],
              sampleData: EMPLOYEES,
              columns: ["id", "name", "department", "salary", "hired"],
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Business Challenge</h2>
          <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-indigo-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-indigo-600">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 11.5c0-1.5 1.12-2.5 2.5-2.5s2.5 1 2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-600">Manager request</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "I need a list of all employees hired after 2023-01-01 who earn over 5000 PLN. Show me their names and salaries, sorted by salary from highest to lowest."
            </p>
          </div>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT name, salary", type: "select" },
                { id: "c2", sql: "FROM employees", type: "from" },
                { id: "c3", sql: "WHERE hired > '2023-01-01'", type: "where", filterFn: (row) => row.hired > "2023-01-01" },
                { id: "c4", sql: "AND salary > 5000", type: "where", filterFn: (row) => row.salary > 5000 },
                { id: "c5", sql: "ORDER BY salary DESC", type: "order" },
                { id: "c6", sql: "WHERE salary > 5000", type: "where", isDistractor: true },
                { id: "c7", sql: "ORDER BY name ASC", type: "order", isDistractor: true },
              ],
              correctOrder: ["c1", "c2", "c3", "c4", "c5"],
              sampleData: EMPLOYEES,
              columns: ["id", "name", "department", "salary", "hired"],
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
