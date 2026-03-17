import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import TableRelationships from "../../components/lesson-widgets/TableRelationships";
import QueryBuilder from "../../components/lesson-widgets/QueryBuilder";

/* ── Shared data ────────────────────────────────────────────── */
const EMPLOYEES = [
  { id: 1, name: "Anna Kowalska", dept_id: 1, salary: 6500 },
  { id: 2, name: "Jan Nowak", dept_id: 2, salary: 4800 },
  { id: 3, name: "Maria Wisniewska", dept_id: 1, salary: 7200 },
  { id: 4, name: "Piotr Lewandowski", dept_id: 3, salary: 5100 },
  { id: 5, name: "Kasia Zielinska", dept_id: 1, salary: 5500 },
  { id: 6, name: "Tomek Szymanski", dept_id: 2, salary: 5200 },
  { id: 7, name: "Ola Dabrowska", dept_id: null, salary: 4500 },
];

const DEPARTMENTS = [
  { id: 1, name: "IT", budget: 500000 },
  { id: 2, name: "Marketing", budget: 300000 },
  { id: 3, name: "HR", budget: 200000 },
  { id: 4, name: "Finance", budget: 400000 },
];

const JOINED_DATA = [
  { employee_name: "Anna Kowalska", department_name: "IT", salary: 6500 },
  { employee_name: "Jan Nowak", department_name: "Marketing", salary: 4800 },
  { employee_name: "Maria Wisniewska", department_name: "IT", salary: 7200 },
  { employee_name: "Piotr Lewandowski", department_name: "HR", salary: 5100 },
  { employee_name: "Kasia Zielinska", department_name: "IT", salary: 5500 },
  { employee_name: "Tomek Szymanski", department_name: "Marketing", salary: 5200 },
];

const LEFT_JOINED_DATA = [
  ...JOINED_DATA,
  { employee_name: "Ola Dabrowska", department_name: null, salary: 4500 },
];

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
        <span className="ml-2 font-sans text-xs font-bold uppercase tracking-widest text-slate-500">
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

/* ── Mini table card for visual demonstrations ──────────────── */
function MiniTable({ name, header, rows, highlight, color = "blue", animDelay = 0, slideDir = "0px" }) {
  const bgMap = { blue: "bg-[#2856a6]", emerald: "bg-emerald-600", violet: "bg-violet-600" };
  return (
    <div
      className="animate-sql-table-slide w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      style={{ animationDelay: `${animDelay}ms`, "--slide-dir": slideDir }}
    >
      <div className={`${bgMap[color] || bgMap.blue} px-3 py-2`}>
        <span className="font-mono text-[11px] font-bold text-white">{name}</span>
      </div>
      <div className="divide-y divide-slate-100 text-[11px]">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 font-sans font-bold text-slate-500 uppercase text-xs">
          {header.map((h) => (
            <span key={h} className={`flex-1 ${highlight?.includes(h) ? "text-blue-700" : ""}`}>
              {h}
            </span>
          ))}
        </div>
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 font-mono text-slate-600">
            {row.map((cell, j) => (
              <span
                key={j}
                className={`flex-1 ${
                  highlight?.includes(header[j])
                    ? "font-bold text-blue-600"
                    : cell === null
                      ? "italic text-slate-300"
                      : ""
                }`}
              >
                {cell === null ? "NULL" : cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Learn Step 0: "Why JOINs?"
   Two separate tables with connecting column highlight
   ═══════════════════════════════════════════════════════════════ */
function WhyJoins({ onComplete }) {
  const [showConnection, setShowConnection] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConnection(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Why JOINs?</h2>
      <p className="text-base leading-relaxed text-graphite">
        Data is split across multiple tables to avoid repetition. But when you need to see data
        from two tables together -- like employee names with their department names -- you need a{" "}
        <strong className="text-ink">JOIN</strong>.
      </p>

      {/* Two tables side by side */}
      <div className="relative rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex items-start justify-center gap-12 z-10">
          <MiniTable
            name="employees"
            header={["id", "name", "dept_id"]}
            rows={[
              [1, "Anna", 1],
              [2, "Jan", 2],
              [3, "Maria", 1],
              [4, "Piotr", 3],
            ]}
            highlight={showConnection ? ["dept_id"] : []}
            slideDir="-40px"
          />

          {/* Connection arrow */}
          <div className={`flex flex-col items-center justify-center self-center transition-all duration-500 ${showConnection ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="rounded-full bg-blue-100 p-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue-600">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="mt-1 font-mono text-[9px] font-bold text-blue-600">JOIN ON</span>
            <span className="font-mono text-[8px] text-slate-400">dept_id = id</span>
          </div>

          <MiniTable
            name="departments"
            header={["id", "name"]}
            rows={[
              [1, "IT"],
              [2, "Marketing"],
              [3, "HR"],
            ]}
            highlight={showConnection ? ["id"] : []}
            slideDir="40px"
            animDelay={150}
          />
        </div>

        {/* Question overlay */}
        {showConnection && (
          <div className="mt-4 animate-lesson-enter text-center">
            <p className="text-base text-slate-600 leading-relaxed">
              <strong className="text-blue-700">How do we combine them?</strong> -- The{" "}
              <code className="font-mono text-xs bg-blue-50 px-1 rounded text-blue-700">dept_id</code>{" "}
              column connects to{" "}
              <code className="font-mono text-xs bg-blue-50 px-1 rounded text-blue-700">departments.id</code>
            </p>
          </div>
        )}
      </div>

      <InsightBox title="Foreign keys are the bridge">
        A foreign key in one table references the primary key of another. This relationship is what
        makes JOINs possible -- it tells the database which rows to match together.
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
   Learn Step 1: "INNER JOIN visualized"
   Animated: tables slide together, rows connect like a zipper
   ═══════════════════════════════════════════════════════════════ */
function InnerJoinViz({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // 0: tables apart, 1: slide together, 2: lines connect, 3: result appears

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const matchPairs = [
    { empName: "Anna", deptId: 1, deptName: "IT", salary: 6500 },
    { empName: "Jan", deptId: 2, deptName: "Marketing", salary: 4800 },
    { empName: "Maria", deptId: 1, deptName: "IT", salary: 7200 },
    { empName: "Piotr", deptId: 3, deptName: "HR", salary: 5100 },
    { empName: "Kasia", deptId: 1, deptName: "IT", salary: 5500 },
    { empName: "Tomek", deptId: 2, deptName: "Marketing", salary: 5200 },
  ];

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">INNER JOIN Visualized</h2>
      <p className="text-base leading-relaxed text-graphite">
        An <strong className="text-ink">INNER JOIN</strong> combines rows from two tables based on
        matching column values. Watch the tables come together:
      </p>

      {/* SQL code */}
      <SQLBlock filename="join_query.sql">
        <L num="1"><span className="text-blue-400 font-bold">SELECT</span> <span className="text-slate-300">e.name, d.name, e.salary</span></L>
        <L num="2"><span className="text-emerald-400 font-bold">FROM</span> <span className="text-slate-300">employees e</span></L>
        <L num="3"><span className="text-violet-400 font-bold">INNER JOIN</span> <span className="text-slate-300">departments d</span></L>
        <L num="4">  <span className="text-violet-400 font-bold">ON</span> <span className="text-slate-300">e.dept_id = d.id</span><span className="text-slate-500">;</span></L>
      </SQLBlock>

      {/* Animated join visualization */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6 overflow-hidden">
        <div
          className="flex items-start justify-center"
          style={{
            gap: phase >= 1 ? "16px" : "80px",
            transition: "gap 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Employees mini-table */}
          <div
            className="w-44 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm transition-all duration-700"
            style={{ transform: phase >= 1 ? "translateX(0)" : "translateX(-20px)" }}
          >
            <div className="bg-[#2856a6] px-3 py-2">
              <span className="font-mono text-xs font-bold text-white">employees</span>
            </div>
            {EMPLOYEES.slice(0, 6).map((e) => (
              <div
                key={e.id}
                className={`flex items-center gap-2 border-b border-blue-100 px-3 py-1.5 transition-all duration-500 ${
                  phase >= 2 ? "bg-blue-50/50" : ""
                }`}
              >
                <span className="font-mono text-xs font-bold text-blue-700">
                  dept_id={e.dept_id}
                </span>
                <span className="text-xs text-slate-600 truncate">{e.name.split(" ")[0]}</span>
              </div>
            ))}
            {/* Ola has no dept - show she will be excluded */}
            <div className={`flex items-center gap-2 border-b border-blue-100 px-3 py-1.5 transition-all duration-500 ${
              phase >= 2 ? "opacity-20 bg-red-50/30" : ""
            }`}>
              <span className="font-mono text-xs text-slate-400">dept_id=null</span>
              <span className="text-xs text-slate-400">Ola</span>
              {phase >= 2 && (
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" className="ml-auto text-red-400">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>

          {/* Join connector */}
          <div className={`flex flex-col items-center justify-center self-center transition-all duration-500 ${phase >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="rounded-full bg-violet-100 p-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-violet-600">
                <path d="M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 6l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="mt-1 font-mono text-[8px] font-bold text-violet-600">INNER JOIN</span>
          </div>

          {/* Departments mini-table */}
          <div
            className="w-36 overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm transition-all duration-700"
            style={{ transform: phase >= 1 ? "translateX(0)" : "translateX(20px)" }}
          >
            <div className="bg-emerald-600 px-3 py-2">
              <span className="font-mono text-xs font-bold text-white">departments</span>
            </div>
            {DEPARTMENTS.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className={`flex items-center gap-2 border-b border-emerald-100 px-3 py-1.5 transition-all duration-500 ${
                  phase >= 2 ? "bg-emerald-50/50" : ""
                }`}
              >
                <span className="font-mono text-xs font-bold text-emerald-700">id={d.id}</span>
                <span className="text-xs text-slate-600">{d.name}</span>
              </div>
            ))}
            {/* Finance dept - no employees reference it */}
            <div className={`flex items-center gap-2 border-b border-emerald-100 px-3 py-1.5 transition-all duration-500 ${
              phase >= 2 ? "opacity-20 bg-red-50/30" : ""
            }`}>
              <span className="font-mono text-xs text-slate-400">id=4</span>
              <span className="text-xs text-slate-400">Finance</span>
              {phase >= 2 && (
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" className="ml-auto text-red-400">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Result table */}
        {phase >= 3 && (
          <div className="mt-6 animate-lesson-enter">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="font-mono text-xs font-bold text-violet-600">INNER JOIN RESULT</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="overflow-hidden rounded-xl border border-violet-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-violet-100 bg-violet-50/50 px-4 py-2">
                <span className="font-mono text-xs font-bold text-violet-600">Result</span>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 font-mono text-xs font-bold text-violet-700">
                  {matchPairs.length} rows
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-violet-100 bg-white">
                    <th className="px-3 py-2 text-left font-mono text-xs font-bold text-blue-600">e.name</th>
                    <th className="px-3 py-2 text-left font-mono text-xs font-bold text-emerald-600">d.name</th>
                    <th className="px-3 py-2 text-left font-mono text-xs font-bold text-slate-500">salary</th>
                  </tr>
                </thead>
                <tbody>
                  {matchPairs.map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-violet-50 animate-sql-row-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <td className="px-3 py-1.5 text-[11px] text-slate-700">{p.empName}</td>
                      <td className="px-3 py-1.5 text-[11px] text-slate-700">{p.deptName}</td>
                      <td className="px-3 py-1.5 font-mono text-[11px] text-slate-600">{p.salary.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-violet-100 bg-violet-50/30 px-4 py-2">
                <p className="font-mono text-xs text-slate-500">
                  Ola (no dept) and Finance (no employees) are <strong className="text-red-500">excluded</strong> from INNER JOIN
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <InsightBox title="INNER JOIN = only matches">
        An INNER JOIN returns only rows that have matching values in both tables. If an employee
        has no department (NULL dept_id), they will not appear in the result.
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
   Learn Step 2: "LEFT JOIN vs INNER JOIN"
   Side-by-side comparison
   ═══════════════════════════════════════════════════════════════ */
function LeftVsInner({ onComplete }) {
  const [activeType, setActiveType] = useState("inner");

  const joinTypes = [
    { id: "inner", label: "INNER JOIN", desc: "Only rows with matches in BOTH tables", color: "violet" },
    { id: "left", label: "LEFT JOIN", desc: "All rows from LEFT table, matched rows from right (NULLs for no match)", color: "blue" },
  ];

  const activeData = activeType === "inner" ? JOINED_DATA : LEFT_JOINED_DATA;

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">LEFT JOIN vs INNER JOIN</h2>
      <p className="text-base leading-relaxed text-graphite">
        A <strong className="text-ink">LEFT JOIN</strong> keeps ALL rows from the left table, even
        if there is no match in the right table. Unmatched cells show NULL.
      </p>

      {/* Type selector */}
      <div className="flex gap-2">
        {joinTypes.map((jt) => (
          <button
            key={jt.id}
            onClick={() => setActiveType(jt.id)}
            className={`rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold transition-all ${
              activeType === jt.id
                ? jt.id === "inner"
                  ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm"
                  : "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-400 hover:border-blue-200"
            }`}
          >
            {jt.label}
          </button>
        ))}
      </div>

      {/* Venn diagram */}
      <div className="flex justify-center rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 py-8">
        <div className="relative h-36 w-56">
          {/* Left circle */}
          <div
            className={`absolute left-0 top-0 h-36 w-36 rounded-full border-2 transition-all duration-500 ${
              activeType === "left" ? "border-blue-400 opacity-100" : "border-violet-300 opacity-40"
            }`}
            style={{ backgroundColor: activeType === "left" ? "rgba(37,99,235,0.12)" : "rgba(124,58,237,0.06)" }}
          />
          {/* Right circle */}
          <div
            className={`absolute right-0 top-0 h-36 w-36 rounded-full border-2 transition-all duration-500 ${
              activeType === "inner" ? "border-violet-300 opacity-40" : "border-blue-300 opacity-40"
            }`}
            style={{ backgroundColor: activeType === "left" ? "rgba(37,99,235,0.06)" : "rgba(124,58,237,0.06)" }}
          />
          {/* Overlap */}
          <div
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{
              backgroundColor: activeType === "inner" ? "rgba(124,58,237,0.3)" : "rgba(37,99,235,0.2)",
            }}
          />
          {/* Labels */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold text-slate-500">
            employees
          </span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold text-slate-500">
            departments
          </span>
        </div>
      </div>

      {/* Result table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">
            {activeType === "inner" ? "INNER JOIN" : "LEFT JOIN"} Result
          </span>
          <span className={`rounded-full px-2 py-0.5 font-mono text-xs font-bold ${
            activeType === "inner" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"
          }`}>
            {activeData.length} rows
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold text-blue-600 bg-slate-50/80">employee_name</th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold text-emerald-600 bg-slate-50/80">department_name</th>
              <th className="px-4 py-2.5 text-left font-mono text-[11px] font-bold text-slate-500 bg-slate-50/80">salary</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((row, i) => {
              const isNull = row.department_name === null;
              return (
                <tr
                  key={i}
                  className={`border-b border-slate-100 animate-sql-row-in ${
                    isNull ? "bg-amber-50/40" : i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <td className="px-4 py-2 text-xs text-slate-700">{row.employee_name}</td>
                  <td className={`px-4 py-2 text-xs ${isNull ? "italic text-slate-400" : "text-slate-700"}`}>
                    {isNull ? "NULL" : row.department_name}
                  </td>
                  <td className="px-4 py-2 font-mono text-sm text-slate-600">{row.salary.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {activeType === "left" && (
          <div className="border-t border-slate-100 bg-amber-50/30 px-4 py-2">
            <p className="font-mono text-xs text-slate-500">
              Ola has <strong className="text-amber-600">NULL</strong> for department -- LEFT JOIN
              keeps her even without a match
            </p>
          </div>
        )}
      </div>

      {/* Comparison summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl border-2 p-3 transition-all ${activeType === "inner" ? "border-violet-300 bg-violet-50/50" : "border-slate-200 bg-white"}`}>
          <p className="font-mono text-xs font-bold text-violet-600">INNER JOIN</p>
          <p className="mt-1 text-[11px] text-slate-600">Only matched rows</p>
          <p className="mt-1 font-mono text-lg font-bold text-violet-500">{JOINED_DATA.length} rows</p>
        </div>
        <div className={`rounded-xl border-2 p-3 transition-all ${activeType === "left" ? "border-blue-300 bg-blue-50/50" : "border-slate-200 bg-white"}`}>
          <p className="font-mono text-xs font-bold text-blue-600">LEFT JOIN</p>
          <p className="mt-1 text-[11px] text-slate-600">All left + matched right</p>
          <p className="mt-1 font-mono text-lg font-bold text-blue-500">{LEFT_JOINED_DATA.length} rows</p>
        </div>
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
   Learn Step 3: Interactive ER Diagram + InsightBox
   Uses the TableRelationships widget
   ═══════════════════════════════════════════════════════════════ */
function ERDiagramStep({ onComplete }) {
  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Entity-Relationship Diagram</h2>
      <p className="text-base text-graphite leading-relaxed">
        Click the relationship buttons to see how the tables connect. The lines show which columns
        link together.
      </p>
      <TableRelationships
        data={{
          tables: [
            {
              name: "employees",
              columns: [
                { name: "id", type: "INT", isPK: true },
                { name: "name", type: "VARCHAR" },
                { name: "dept_id", type: "INT", isFK: true },
                { name: "salary", type: "INT" },
              ],
            },
            {
              name: "departments",
              columns: [
                { name: "id", type: "INT", isPK: true },
                { name: "name", type: "VARCHAR" },
                { name: "budget", type: "DECIMAL" },
              ],
            },
          ],
          relationships: [
            {
              from: "employees.dept_id",
              to: "departments.id",
              label: "Each employee belongs to one department (many-to-one)",
            },
          ],
          question: "What type of relationship exists between employees and departments?",
          options: [
            "One-to-One",
            "Many-to-One (many employees per department)",
            "Many-to-Many",
            "No relationship",
          ],
          correctIndex: 1,
        }}
        onComplete={onComplete}
      />

      <InsightBox title="Relationships define your JOINs">
        Understanding table relationships is essential for writing correct JOINs. The ER diagram
        shows you exactly which columns to use in your ON clause.
      </InsightBox>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Lesson Component
   ═══════════════════════════════════════════════════════════════ */
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhyJoins onComplete={onComplete} />;
    if (currentStep === 1) return <InnerJoinViz onComplete={onComplete} />;
    if (currentStep === 2) return <LeftVsInner onComplete={onComplete} />;
    if (currentStep === 3) return <ERDiagramStep onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Relationship Quiz</h2>
          <TableRelationships
            data={{
              tables: [
                {
                  name: "orders",
                  columns: [
                    { name: "order_id", type: "INT", isPK: true },
                    { name: "customer_id", type: "INT", isFK: true },
                    { name: "total", type: "DECIMAL" },
                  ],
                },
                {
                  name: "customers",
                  columns: [
                    { name: "id", type: "INT", isPK: true },
                    { name: "name", type: "VARCHAR" },
                    { name: "email", type: "VARCHAR" },
                  ],
                },
              ],
              relationships: [
                {
                  from: "customers.id",
                  to: "orders.customer_id",
                  label: "One customer can have many orders",
                },
              ],
              question:
                "Which column connects these tables?",
              options: [
                "orders.order_id = customers.id",
                "customers.id = orders.customer_id",
                "customers.name = orders.total",
                "orders.total > 100",
              ],
              correctIndex: 1,
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Build a JOIN Query</h2>
          <p className="text-base text-graphite leading-relaxed">
            Get all employee names with their department names using a JOIN.
          </p>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT e.name, d.name", type: "select" },
                { id: "c2", sql: "FROM employees e", type: "from" },
                { id: "c3", sql: "JOIN departments d ON e.dept_id = d.id", type: "join" },
                { id: "c4", sql: "ORDER BY e.name", type: "order" },
                { id: "c5", sql: "JOIN salaries s ON e.id = s.emp_id", type: "join", isDistractor: true },
              ],
              correctOrder: ["c1", "c2", "c3", "c4"],
              sampleData: JOINED_DATA,
              columns: ["employee_name", "department_name", "salary"],
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
          <h2 className="text-xl font-bold text-ink">Multi-Table Challenge</h2>
          <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-blue-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-blue-700">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 11.5c0-1.5 1.12-2.5 2.5-2.5s2.5 1 2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-blue-700">
                Manager request
              </p>
            </div>
            <p className="text-base text-slate-600 leading-relaxed leading-relaxed">
              "Show me employee names with their department names, sorted by salary from highest to
              lowest. I need to see the salary too."
            </p>
          </div>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT e.name, d.name, e.salary", type: "select" },
                { id: "c2", sql: "FROM employees e", type: "from" },
                { id: "c3", sql: "JOIN departments d ON e.dept_id = d.id", type: "join" },
                { id: "c4", sql: "ORDER BY e.salary DESC", type: "order" },
                { id: "c5", sql: "WHERE e.salary > 5000", type: "where", isDistractor: true },
                { id: "c6", sql: "HAVING d.name = 'IT'", type: "having", isDistractor: true },
              ],
              correctOrder: ["c1", "c2", "c3", "c4"],
              sampleData: JOINED_DATA,
              columns: ["employee_name", "department_name", "salary"],
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
