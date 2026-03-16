import { useState, useEffect, useRef } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import QueryBuilder from "../../components/lesson-widgets/QueryBuilder";

/* ── Shared employee data ───────────────────────────────────── */
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

/* ── SQL code block helpers ─────────────────────────────────── */
function SQLBlock({ filename, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-lg">
      <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        </div>
        <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {filename}
        </span>
      </div>
      <div className="px-4 py-3 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function L({ num, children }) {
  return (
    <p>
      <span className="text-slate-600 mr-3 select-none inline-block w-3 text-right">{num}</span>
      {children}
    </p>
  );
}

/* ── Styled data grid component ─────────────────────────────── */
function DataGrid({
  tableName,
  cols,
  rows,
  highlightCols,
  matchFn,
  showCount,
  rowClass,
  headerLabel,
}) {
  const visibleRows = matchFn ? rows : rows;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-slate-400">
            <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" />
            <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {tableName || "Result"}
          </span>
        </div>
        {headerLabel && (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 font-mono text-[10px] font-bold text-orange-600">
            {headerLabel}
          </span>
        )}
        {showCount && matchFn && (
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-400 line-through">
              {rows.length} rows
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-slate-400">
              <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
              {rows.filter(matchFn).length} rows
            </span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {cols.map((col) => (
                <th
                  key={col}
                  className={`px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ${
                    highlightCols?.has(col)
                      ? "text-blue-700 bg-blue-50/60"
                      : "text-slate-500 bg-slate-50/80"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => {
              const isMatch = matchFn ? matchFn(row) : true;
              const customCls = rowClass ? rowClass(row, i, isMatch) : "";
              return (
                <tr
                  key={row.id || i}
                  className={`border-b border-slate-100 transition-all duration-500 ${customCls} ${
                    !customCls
                      ? matchFn
                        ? isMatch
                          ? "animate-sql-row-sweep"
                          : "opacity-25"
                        : i % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/40"
                      : ""
                  }`}
                >
                  {cols.map((col) => (
                    <td
                      key={col}
                      className={`px-4 py-2 font-mono text-xs transition-all duration-500 ${
                        highlightCols?.has(col)
                          ? "text-slate-800 font-semibold"
                          : matchFn && !isMatch
                            ? "text-slate-300"
                            : "text-slate-700"
                      }`}
                    >
                      {col === "salary" ? `${row[col]?.toLocaleString?.() || row[col]}` : row[col]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {matchFn && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
          <p className="font-mono text-[10px] text-slate-500">
            <span className="font-bold text-emerald-600">{rows.filter(matchFn).length}</span> of{" "}
            {rows.length} rows match the filter
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Learn Step 0: "SELECT basics"
   Full table -> SELECT name, salary -> columns highlight
   ═══════════════════════════════════════════════════════════════ */
function SelectBasics({ onComplete }) {
  const [selectedCols, setSelectedCols] = useState(new Set(ALL_COLS));
  const [phase, setPhase] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedCols(new Set(["name", "salary"]));
      setPhase("selected");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">SELECT: Reading Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">SELECT</strong> is the most fundamental SQL command -- it
        retrieves data from a table. Every query starts with SELECT.
      </p>

      {/* SQL code */}
      <SQLBlock filename="query.sql">
        <L num="1">
          <span className="text-blue-400 font-bold">SELECT</span>{" "}
          <span className={`transition-colors duration-500 ${phase === "selected" ? "text-white font-semibold" : "text-slate-400"}`}>
            {phase === "selected" ? "name, salary" : "*"}
          </span>{" "}
          <span className="text-emerald-400 font-bold">FROM</span>{" "}
          <span className="text-slate-300">employees</span>
          <span className="text-slate-500">;</span>
        </L>
      </SQLBlock>

      {/* Table with column fading */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Result
          </span>
          {phase === "selected" && (
            <span className="animate-lesson-enter rounded-full bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
              2 of 5 columns selected
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {ALL_COLS.map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-700 ${
                      selectedCols.has(col)
                        ? "text-blue-700 bg-blue-50/60"
                        : "text-slate-200 bg-slate-50/30"
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
                        selectedCols.has(col) ? "text-slate-700" : "text-slate-200"
                      }`}
                    >
                      {col === "salary" ? e[col].toLocaleString() : e[col]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={ALL_COLS.length} className="px-4 py-1.5 text-[10px] text-slate-400 italic">
                  ... {EMPLOYEES.length - 5} more rows
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InsightBox title="SELECT * means everything">
        Use <code className="font-mono text-xs">SELECT *</code> to get all columns. Handy for
        exploring, but in production code, list specific columns -- it is faster and clearer.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-[#2856a6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Learn Step 1: "FROM clause"
   Multiple table icons, FROM selects which one to query
   ═══════════════════════════════════════════════════════════════ */
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
        <strong className="text-ink">FROM</strong> tells SQL which table to read from. A database
        can have dozens of tables -- FROM specifies the one you want.
      </p>

      {/* Table selector */}
      <div className="grid gap-3 sm:grid-cols-3">
        {["employees", "courses", "grades"].map((table) => (
          <div
            key={table}
            className={`rounded-xl border-2 p-4 text-center font-mono text-sm font-bold transition-all duration-500 ${
              activeTable === table
                ? "border-blue-400 bg-blue-50 text-blue-700 shadow-md shadow-blue-100 scale-105"
                : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className={activeTable === table ? "text-blue-500" : "text-slate-300"}>
                <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" />
                <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {table}
              {activeTable === table && (
                <p className="font-sans text-[10px] font-normal text-blue-500 animate-lesson-enter">
                  selected
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <SQLBlock filename="query.sql">
        <L num="1">
          <span className="text-blue-400 font-bold">SELECT</span>{" "}
          <span className="text-slate-300">name, salary</span>
        </L>
        <L num="2">
          <span className="text-emerald-400 font-bold">FROM</span>{" "}
          <span className="text-amber-300 font-bold">employees</span>
          <span className="text-slate-500">;</span>{" "}
          <span className="text-slate-600">-- reads from the employees table</span>
        </L>
      </SQLBlock>

      <button
        onClick={onComplete}
        className="rounded-lg bg-[#2856a6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Learn Step 2: "WHERE filtering"
   Table with sweep-highlight for matching rows
   ═══════════════════════════════════════════════════════════════ */
function WhereFiltering({ onComplete }) {
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFilterActive(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const matchFn = (e) => e.salary > 5000;
  const matchCount = EMPLOYEES.filter(matchFn).length;

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">WHERE: Filtering Rows</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">WHERE</strong> filters which rows are returned. Only rows
        matching the condition appear in the result.
      </p>

      {/* SQL code */}
      <SQLBlock filename="query.sql">
        <L num="1">
          <span className="text-blue-400 font-bold">SELECT</span>{" "}
          <span className="text-slate-300">*</span>{" "}
          <span className="text-emerald-400 font-bold">FROM</span>{" "}
          <span className="text-slate-300">employees</span>
        </L>
        <L num="2">
          <span className="text-orange-400 font-bold">WHERE</span>{" "}
          <span className="text-slate-300">salary</span>{" "}
          <span className="text-slate-500">&gt;</span>{" "}
          <span className="text-orange-300">5000</span>
          <span className="text-slate-500">;</span>
        </L>
      </SQLBlock>

      {/* Table with animated filtering */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            employees
          </span>
          {filterActive && (
            <div className="flex items-center gap-1.5 animate-lesson-enter">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-400 line-through">
                {EMPLOYEES.length} rows
              </span>
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-slate-400">
                <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                {matchCount} rows matching
              </span>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["id", "name", "department", "salary"].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map((e, i) => {
                const isMatch = matchFn(e);
                return (
                  <tr
                    key={e.id}
                    className={`border-b border-slate-100 transition-all duration-600 ${
                      filterActive
                        ? isMatch
                          ? "animate-sql-row-sweep"
                          : "opacity-20"
                        : i % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/30"
                    }`}
                    style={filterActive && !isMatch ? { transitionDelay: `${i * 50}ms` } : undefined}
                  >
                    <td className="px-4 py-2 font-mono text-xs font-bold text-blue-700">{e.id}</td>
                    <td className="px-4 py-2 text-xs text-slate-700">{e.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-600">{e.department}</td>
                    <td className={`px-4 py-2 font-mono text-xs transition-all duration-500 ${
                      filterActive && isMatch ? "font-bold text-emerald-700" : "text-slate-700"
                    }`}>
                      {e.salary.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filterActive && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2 animate-lesson-enter">
            <p className="font-mono text-[10px] text-slate-500">
              <span className="font-bold text-emerald-600">{matchCount}</span> of {EMPLOYEES.length} rows match{" "}
              <code className="text-orange-600">salary &gt; 5000</code>
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-[#2856a6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Learn Step 3: "AND / OR operators"
   Venn diagram + interactive toggle + table
   ═══════════════════════════════════════════════════════════════ */
function AndOrOperators({ onComplete }) {
  const [mode, setMode] = useState("and");

  const andFn = (e) => e.department === "IT" && e.salary > 6000;
  const orFn = (e) => e.department === "IT" || e.department === "Marketing";
  const activeFn = mode === "and" ? andFn : orFn;
  const andCount = EMPLOYEES.filter(andFn).length;
  const orCount = EMPLOYEES.filter(orFn).length;

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">AND / OR: Combining Conditions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Combine conditions with <strong className="text-ink">AND</strong> (both must be true) or{" "}
        <strong className="text-ink">OR</strong> (either can be true).
      </p>

      {/* Toggle */}
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

      {/* SQL code */}
      <SQLBlock filename="query.sql">
        <L num="1"><span className="text-blue-400 font-bold">SELECT</span> <span className="text-slate-300">name, salary</span></L>
        <L num="2"><span className="text-emerald-400 font-bold">FROM</span> <span className="text-slate-300">employees</span></L>
        {mode === "and" ? (
          <>
            <L num="3"><span className="text-orange-400 font-bold">WHERE</span> <span className="text-slate-300">department</span> <span className="text-slate-500">=</span> <span className="text-green-400">'IT'</span></L>
            <L num="4">  <span className="text-orange-400 font-bold">AND</span> <span className="text-slate-300">salary</span> <span className="text-slate-500">&gt;</span> <span className="text-orange-300">6000</span><span className="text-slate-500">;</span></L>
          </>
        ) : (
          <>
            <L num="3"><span className="text-orange-400 font-bold">WHERE</span> <span className="text-slate-300">department</span> <span className="text-slate-500">=</span> <span className="text-green-400">'IT'</span></L>
            <L num="4">  <span className="text-blue-400 font-bold">OR</span> <span className="text-slate-300">department</span> <span className="text-slate-500">=</span> <span className="text-green-400">'Marketing'</span><span className="text-slate-500">;</span></L>
          </>
        )}
      </SQLBlock>

      {/* Venn diagram */}
      <div className="flex justify-center rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 py-8">
        <div className="relative h-36 w-60">
          {/* Left circle - condition A */}
          <div
            className={`absolute left-0 top-0 h-36 w-36 rounded-full border-2 transition-all duration-500 ${
              mode === "and" ? "border-orange-300 opacity-40" : "border-blue-300 opacity-100"
            }`}
            style={{ backgroundColor: mode === "and" ? "rgba(234,88,12,0.08)" : "rgba(59,130,246,0.12)" }}
          />
          {/* Right circle - condition B */}
          <div
            className={`absolute right-0 top-0 h-36 w-36 rounded-full border-2 transition-all duration-500 ${
              mode === "and" ? "border-orange-300 opacity-40" : "border-blue-300 opacity-100"
            }`}
            style={{ backgroundColor: mode === "and" ? "rgba(234,88,12,0.08)" : "rgba(59,130,246,0.12)" }}
          />
          {/* Intersection highlight */}
          <div
            className={`absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
              mode === "and" ? "opacity-100 scale-100" : "opacity-40 scale-75"
            }`}
            style={{ backgroundColor: mode === "and" ? "rgba(234,88,12,0.25)" : "rgba(59,130,246,0.15)" }}
          />
          {/* Labels */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold text-slate-500">
            {mode === "and" ? "dept='IT'" : "dept='IT'"}
          </span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold text-slate-500">
            {mode === "and" ? "salary>6000" : "dept='Mkt'"}
          </span>
          <span className={`absolute left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold ${
            mode === "and" ? "bottom-0 text-orange-600" : "bottom-0 text-blue-600"
          }`}>
            {mode === "and" ? `AND: ${andCount} rows` : `OR: ${orCount} rows`}
          </span>
        </div>
      </div>

      {/* Result table */}
      <DataGrid
        tableName="Result"
        cols={["name", "department", "salary"]}
        rows={EMPLOYEES}
        matchFn={activeFn}
        showCount
      />

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl border-2 p-3 text-center transition-all ${mode === "and" ? "border-orange-300 bg-orange-50/50" : "border-slate-200 bg-white"}`}>
          <p className="font-mono text-xs font-bold text-orange-600">AND narrows</p>
          <p className="mt-1 text-[11px] text-slate-600">Both conditions must be true</p>
          <p className="mt-1 font-mono text-lg font-bold text-orange-500">{andCount} rows</p>
        </div>
        <div className={`rounded-xl border-2 p-3 text-center transition-all ${mode === "or" ? "border-blue-300 bg-blue-50/50" : "border-slate-200 bg-white"}`}>
          <p className="font-mono text-xs font-bold text-blue-600">OR widens</p>
          <p className="mt-1 text-[11px] text-slate-600">Either condition can be true</p>
          <p className="mt-1 font-mono text-lg font-bold text-blue-500">{orCount} rows</p>
        </div>
      </div>

      <InsightBox title="AND narrows, OR widens">
        Adding <strong>AND</strong> gives you fewer results (more restrictive). Adding{" "}
        <strong>OR</strong> gives you more results (less restrictive). Think: "must be in IT AND
        earn over 6000" vs "in IT OR in Marketing".
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-[#2856a6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Learn Step 4: "ORDER BY"
   Animated row sorting with sliding animation
   ═══════════════════════════════════════════════════════════════ */
function OrderByStep({ onComplete }) {
  const [sortDir, setSortDir] = useState("desc");
  const [sortKey, setSortKey] = useState(0); // increment to trigger re-animation

  const sorted = [...EMPLOYEES].sort((a, b) =>
    sortDir === "desc" ? b.salary - a.salary : a.salary - b.salary
  );

  const toggleSort = (dir) => {
    setSortDir(dir);
    setSortKey((k) => k + 1);
  };

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">ORDER BY: Sorting Results</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">ORDER BY</strong> sorts your results. Use{" "}
        <code className="font-mono text-xs bg-slate-100 px-1 rounded">ASC</code> for ascending or{" "}
        <code className="font-mono text-xs bg-slate-100 px-1 rounded">DESC</code> for descending.
      </p>

      {/* Toggle ASC/DESC */}
      <div className="flex gap-2">
        <button
          onClick={() => toggleSort("asc")}
          className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold transition-all ${
            sortDir === "asc"
              ? "border-purple-400 bg-purple-50 text-purple-700"
              : "border-slate-200 bg-white text-slate-400 hover:border-purple-200"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 2L8 7H2L5 2Z" fill="currentColor" /></svg>
          ASC (lowest first)
        </button>
        <button
          onClick={() => toggleSort("desc")}
          className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold transition-all ${
            sortDir === "desc"
              ? "border-purple-400 bg-purple-50 text-purple-700"
              : "border-slate-200 bg-white text-slate-400 hover:border-purple-200"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 8L2 3H8L5 8Z" fill="currentColor" /></svg>
          DESC (highest first)
        </button>
      </div>

      {/* SQL code */}
      <SQLBlock filename="query.sql">
        <L num="1"><span className="text-blue-400 font-bold">SELECT</span> <span className="text-slate-300">name, salary</span></L>
        <L num="2"><span className="text-emerald-400 font-bold">FROM</span> <span className="text-slate-300">employees</span></L>
        <L num="3"><span className="text-purple-400 font-bold">ORDER BY</span> <span className="text-slate-300">salary</span> <span className="text-amber-300">{sortDir.toUpperCase()}</span><span className="text-slate-500">;</span></L>
      </SQLBlock>

      {/* Sorted table with animation */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">Result</span>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-700">
            Sorted by salary {sortDir.toUpperCase()}
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80 w-8">#</th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80">name</th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50/40">
                <div className="flex items-center gap-1">
                  salary
                  <svg width="10" height="10" viewBox="0 0 10 10" className="text-purple-500">
                    {sortDir === "asc"
                      ? <path d="M5 2L8 7H2L5 2Z" fill="currentColor" />
                      : <path d="M5 8L2 3H8L5 8Z" fill="currentColor" />
                    }
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, i) => (
              <tr
                key={`${e.id}-${sortKey}`}
                className={`border-b border-slate-100 animate-sql-row-sort ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                style={{
                  animationDelay: `${i * 50}ms`,
                  "--sort-offset": `${(i % 2 === 0 ? -1 : 1) * 12}px`,
                }}
              >
                <td className="px-4 py-2 font-mono text-[10px] text-slate-400">{i + 1}</td>
                <td className="px-4 py-2 text-xs text-slate-700">{e.name}</td>
                <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-700">
                  {e.salary.toLocaleString()} PLN
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-[#2856a6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-300"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════ */
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <SelectBasics onComplete={onComplete} />;
    if (currentStep === 1) return <FromClause onComplete={onComplete} />;
    if (currentStep === 2) return <WhereFiltering onComplete={onComplete} />;
    if (currentStep === 3) return <AndOrOperators onComplete={onComplete} />;
    if (currentStep === 4) return <OrderByStep onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build a Query</h2>
          <p className="text-sm text-graphite">
            Get all employees with salary greater than 5000. Arrange the SQL clauses in the correct order.
          </p>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT name, salary", type: "select" },
                { id: "c2", sql: "FROM employees", type: "from" },
                { id: "c3", sql: "WHERE salary > 5000", type: "where", filterFn: (row) => row.salary > 5000 },
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
          <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-blue-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-blue-700">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 11.5c0-1.5 1.12-2.5 2.5-2.5s2.5 1 2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Manager request
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "I need a list of all IT employees hired after 2023-01-01 who earn over 5000 PLN.
              Show me their names and salaries, sorted by salary from highest to lowest."
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
