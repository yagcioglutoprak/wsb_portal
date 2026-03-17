import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DragDrop from "../../components/widgets/DragDrop";

/* ── Shared data ────────────────────────────────────────────── */
const EMPLOYEES = [
  { id: 1, name: "Anna Kowalska", department: "IT", salary: 6500, hire_date: "2022-03-15" },
  { id: 2, name: "Jan Nowak", department: "Marketing", salary: 4800, hire_date: "2023-07-01" },
  { id: 3, name: "Maria Wisniewska", department: "IT", salary: 7200, hire_date: "2021-11-20" },
  { id: 4, name: "Piotr Lewandowski", department: "HR", salary: 5100, hire_date: "2024-01-10" },
];

const COLUMNS = [
  { name: "id", type: "INT" },
  { name: "name", type: "VARCHAR" },
  { name: "department", type: "VARCHAR" },
  { name: "salary", type: "INT" },
  { name: "hire_date", type: "DATE" },
];

const TYPE_COLORS = {
  INT:     { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", full: "bg-orange-500" },
  VARCHAR: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", full: "bg-emerald-500" },
  DATE:    { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", full: "bg-blue-500" },
  DECIMAL: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", full: "bg-amber-500" },
  BOOLEAN: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200", full: "bg-pink-500" },
};

const getTypeColor = (type) => TYPE_COLORS[type] || TYPE_COLORS.VARCHAR;

/* ── Shared styled table component ──────────────────────────── */
function DataTable({ tableName, columns, rows, highlightCol, highlightPK, dimRows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      {/* Table name header bar */}
      <div className="flex items-center gap-2 bg-[#2856a6] px-4 py-2.5">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-blue-200">
          <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" />
          <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="font-mono text-xs font-bold text-white">{tableName}</span>
        <span className="ml-auto rounded-full bg-white/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-blue-100">
          TABLE
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((col) => {
              const isHL = highlightCol === col.name;
              const isPK = highlightPK && col.name === "id";
              const tc = getTypeColor(col.type);
              return (
                <th
                  key={col.name}
                  className={`px-4 py-2.5 text-left font-sans text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ${
                    isPK
                      ? "bg-amber-50 text-amber-700"
                      : isHL
                        ? `${tc.bg}/50 ${tc.text}`
                        : "text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.name}
                    {isPK && (
                      <span className="rounded bg-amber-200 px-1 py-0.5 font-mono text-[8px] font-bold text-amber-800 shadow-sm shadow-amber-200/50">
                        <span className="flex items-center gap-0.5">
                          <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                            <path d="M10 2a3 3 0 00-2.83 4L3 10v3h3l1-1 1 1h2v-2l-1-1 .83-.83A3 3 0 0010 2zm1 3a1 1 0 11-2 0 1 1 0 012 0z" fill="currentColor" />
                          </svg>
                          PK
                        </span>
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-slate-100 transition-all duration-300 ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
              }`}
            >
              {columns.map((col) => {
                const isPK = highlightPK && col.name === "id";
                const isHL = highlightCol === col.name;
                return (
                  <td
                    key={col.name}
                    className={`px-4 py-2 font-mono text-xs transition-all duration-500 ${
                      isPK
                        ? "font-bold text-amber-600 bg-amber-50/40"
                        : isHL
                          ? `font-semibold ${getTypeColor(col.type).text}`
                          : col.type === "INT" || col.type === "DATE"
                            ? "text-slate-600"
                            : "text-slate-700"
                    }`}
                  >
                    {row[col.name]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── SQL Code Block ─────────────────────────────────────────── */
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
      <div className="px-4 py-3 space-y-0.5 font-mono text-sm">{children}</div>
    </div>
  );
}

function SQLLine({ num, children }) {
  return (
    <p>
      <span className="text-slate-600 mr-3 select-none inline-block w-3 text-right">{num}</span>
      {children}
    </p>
  );
}

function Kw({ children, color = "text-blue-400" }) {
  return <span className={`font-bold ${color}`}>{children}</span>;
}

function Str({ children }) {
  return <span className="text-green-400">{children}</span>;
}

function Num({ children }) {
  return <span className="text-orange-300">{children}</span>;
}

function Id({ children }) {
  return <span className="text-slate-300">{children}</span>;
}

function Typ({ children }) {
  return <span className="text-emerald-400">{children}</span>;
}

function Cmt({ children }) {
  return <span className="text-slate-600">{children}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   Learn Step 0: "What is a database table?"
   Animated SVG table construction
   ═══════════════════════════════════════════════════════════════ */
function WhatIsTable({ onComplete }) {
  const [gridDrawn, setGridDrawn] = useState(false);
  const [colsVisible, setColsVisible] = useState(0);
  const [rowsVisible, setRowsVisible] = useState(0);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => setGridDrawn(true), 200));
    COLUMNS.forEach((_, i) => {
      timers.push(setTimeout(() => setColsVisible(i + 1), 600 + i * 200));
    });
    EMPLOYEES.forEach((_, i) => {
      timers.push(
        setTimeout(() => setRowsVisible(i + 1), 600 + COLUMNS.length * 200 + 300 + i * 250)
      );
    });
    timers.push(
      setTimeout(
        () => setShowLabels(true),
        600 + COLUMNS.length * 200 + 300 + EMPLOYEES.length * 250 + 400
      )
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Database Table?</h2>
      <p className="text-base leading-relaxed text-graphite">
        A <strong className="text-ink">database</strong> stores data in{" "}
        <strong className="text-ink">tables</strong> -- structured grids of rows and columns, like
        a spreadsheet but with superpowers.
      </p>

      {/* Animated table construction */}
      <div
        className={`overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all duration-700 ${
          gridDrawn ? "opacity-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center gap-2 bg-[#2856a6] px-4 py-2.5">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-blue-200">
            <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" />
            <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="font-mono text-xs font-bold text-white">employees</span>
          <span className="ml-auto rounded-full bg-white/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-blue-100">
            TABLE
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COLUMNS.map((col, i) => (
                <th
                  key={col.name}
                  className={`px-3 py-2.5 text-left font-sans text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    i < colsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                  } ${col.name === "id" ? "text-amber-600" : "text-slate-500"}`}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-slate-100 transition-all duration-400 ${
                  i < rowsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                } ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <td className="px-3 py-2 font-mono text-xs font-bold text-blue-700">{row.id}</td>
                <td className="px-3 py-2 text-xs text-slate-700">{row.name}</td>
                <td className="px-3 py-2 font-mono text-sm text-slate-600">{row.department}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">{row.salary.toLocaleString()} PLN</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">{row.hire_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Anatomy labels */}
      {showLabels && (
        <div className="grid grid-cols-3 gap-3 animate-lesson-enter">
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-blue-600">
              Column / Field
            </p>
            <p className="mt-1 text-xs text-blue-700">
              A specific attribute -- like "name" or "salary"
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-600">
              Row / Record
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              One complete entry -- one employee's full data
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-purple-600">
              Cell / Value
            </p>
            <p className="mt-1 text-xs text-purple-700">
              A single piece of data at a row-column intersection
            </p>
          </div>
        </div>
      )}

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
   Learn Step 1: "Columns and data types"
   ═══════════════════════════════════════════════════════════════ */
function ColumnsAndTypes({ onComplete }) {
  const [hoveredCol, setHoveredCol] = useState(null);

  const types = [
    { name: "VARCHAR", example: "'Anna K.'", desc: "Text of variable length", color: TYPE_COLORS.VARCHAR },
    { name: "INT", example: "6500", desc: "Whole numbers", color: TYPE_COLORS.INT },
    { name: "DATE", example: "'2024-03-15'", desc: "Calendar dates", color: TYPE_COLORS.DATE },
    { name: "DECIMAL", example: "3500.50", desc: "Precise decimal numbers (money)", color: TYPE_COLORS.DECIMAL },
    { name: "BOOLEAN", example: "TRUE", desc: "True or False values", color: TYPE_COLORS.BOOLEAN },
  ];

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Columns and Data Types</h2>
      <p className="text-base leading-relaxed text-graphite">
        Each column has a <strong className="text-ink">data type</strong> that defines what kind of
        values it stores. Hover a column to highlight all its cells.
      </p>

      {/* Table with type badges and hover highlight */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 bg-[#2856a6] px-4 py-2.5">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-blue-200">
            <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" />
            <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="font-mono text-xs font-bold text-white">employees</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COLUMNS.map((col) => {
                const tc = getTypeColor(col.type);
                const isHovered = hoveredCol === col.name;
                return (
                  <th
                    key={col.name}
                    onMouseEnter={() => setHoveredCol(col.name)}
                    onMouseLeave={() => setHoveredCol(null)}
                    className={`px-3 py-2.5 text-left cursor-pointer transition-all duration-300 ${
                      isHovered ? `${tc.bg}` : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        {col.name}
                      </span>
                      <span
                        className={`inline-flex w-fit rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-bold ${tc.bg} ${tc.text} ${tc.border}`}
                      >
                        {col.type}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES.map((row, i) => (
              <tr key={row.id} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                {COLUMNS.map((col) => {
                  const tc = getTypeColor(col.type);
                  const isHovered = hoveredCol === col.name;
                  return (
                    <td
                      key={col.name}
                      onMouseEnter={() => setHoveredCol(col.name)}
                      onMouseLeave={() => setHoveredCol(null)}
                      className={`px-3 py-2 font-mono text-xs transition-all duration-300 ${
                        isHovered
                          ? `${tc.bg}/40 font-semibold ${tc.text}`
                          : "text-slate-700"
                      }`}
                    >
                      {col.name === "salary" ? `${row[col.name].toLocaleString()} PLN` : row[col.name]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded type info when hovering */}
      {hoveredCol && (
        <div className="animate-lesson-enter rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-xs font-bold ${
                getTypeColor(COLUMNS.find((c) => c.name === hoveredCol)?.type).bg
              } ${getTypeColor(COLUMNS.find((c) => c.name === hoveredCol)?.type).text} ${
                getTypeColor(COLUMNS.find((c) => c.name === hoveredCol)?.type).border
              }`}
            >
              {COLUMNS.find((c) => c.name === hoveredCol)?.type}
            </span>
            <span className="text-sm text-slate-600">
              Column "{hoveredCol}" stores{" "}
              {COLUMNS.find((c) => c.name === hoveredCol)?.type === "VARCHAR"
                ? "text values"
                : COLUMNS.find((c) => c.name === hoveredCol)?.type === "INT"
                  ? "whole numbers"
                  : "date values"}
            </span>
          </div>
        </div>
      )}

      {/* CREATE TABLE code */}
      <SQLBlock filename="create_table.sql">
        <SQLLine num="1"><Kw>CREATE TABLE</Kw> <Id>employees</Id> <Cmt>(</Cmt></SQLLine>
        <SQLLine num="2">    <Id>id</Id> <Typ>INT</Typ> <Kw color="text-amber-300">PRIMARY KEY</Kw><Cmt>,</Cmt></SQLLine>
        <SQLLine num="3">    <Id>name</Id> <Typ>VARCHAR(100)</Typ><Cmt>,</Cmt></SQLLine>
        <SQLLine num="4">    <Id>department</Id> <Typ>VARCHAR(50)</Typ><Cmt>,</Cmt></SQLLine>
        <SQLLine num="5">    <Id>salary</Id> <Typ>INT</Typ><Cmt>,</Cmt></SQLLine>
        <SQLLine num="6">    <Id>hire_date</Id> <Typ>DATE</Typ></SQLLine>
        <SQLLine num="7"><Cmt>);</Cmt></SQLLine>
      </SQLBlock>

      {/* Type reference cards */}
      <div className="space-y-2">
        {types.map((t, i) => (
          <div
            key={t.name}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold ${t.color.bg} ${t.color.text} ${t.color.border}`}>
              {t.name}
            </span>
            <span className="flex-1 text-sm text-slate-600">{t.desc}</span>
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">{t.example}</code>
          </div>
        ))}
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
   Learn Step 2: "Primary keys"
   Duplicate ID bounces back with red flash
   ═══════════════════════════════════════════════════════════════ */
function PrimaryKeys({ onComplete }) {
  const [highlightPK, setHighlightPK] = useState(false);
  const [showDupAttempt, setShowDupAttempt] = useState(false);
  const [dupBounced, setDupBounced] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHighlightPK(true), 500);
    const t2 = setTimeout(() => setShowDupAttempt(true), 2000);
    const t3 = setTimeout(() => setDupBounced(true), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Primary Keys</h2>
      <p className="text-base leading-relaxed text-graphite">
        Every table needs a <strong className="text-ink">primary key (PK)</strong> -- a column
        whose value is unique for every row and never null.
      </p>

      {/* Table with highlighted PK column */}
      <DataTable
        tableName="employees"
        columns={COLUMNS}
        rows={EMPLOYEES}
        highlightPK={highlightPK}
      />

      {/* Duplicate attempt animation */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          What happens when you try to insert a duplicate ID?
        </p>
        <div className="space-y-2">
          {/* Existing row */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs font-bold text-amber-700">id=1</span>
            <span className="text-xs text-slate-700">Anna Kowalska -- already exists</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="ml-auto text-emerald-500">
              <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Attempted duplicate */}
          {showDupAttempt && (
            <div
              className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 transition-all duration-300 ${
                dupBounced
                  ? "border-red-300 bg-red-50/50 animate-sql-bounce"
                  : "border-blue-300 bg-blue-50/50"
              }`}
            >
              <span className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold ${
                dupBounced ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              }`}>
                id=1
              </span>
              <span className="text-xs text-slate-700">
                {dupBounced ? "REJECTED -- duplicate primary key!" : "Trying to insert id=1 again..."}
              </span>
              {dupBounced && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="ml-auto text-red-500">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Without vs With PK comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border-2 border-red-200 bg-red-50/30 p-4">
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
            Without PK
          </p>
          <div className="space-y-1.5">
            {["Jan Nowak", "Jan Nowak", "Jan Nowak"].map((n, i) => (
              <div key={i} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-mono text-xs text-red-600">
                {n} <span className="ml-1 text-red-400 italic">Which one?</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/30 p-4">
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">
            With PK
          </p>
          <div className="space-y-1.5">
            {[1, 2, 3].map((id) => (
              <div key={id} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-1.5">
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs font-bold text-amber-700">
                  #{id}
                </span>
                <span className="font-mono text-xs text-emerald-700">Jan Nowak</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InsightBox title="Auto-increment IDs">
        Most databases automatically generate primary key values using auto-increment -- the
        database assigns 1, 2, 3, etc. You do not need to set the ID yourself.
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
   Learn Step 3: "Relationships between tables"
   Two tables + animated SVG FK line
   ═══════════════════════════════════════════════════════════════ */
function Relationships({ onComplete }) {
  const [lineDrawn, setLineDrawn] = useState(false);
  const [highlightFK, setHighlightFK] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLineDrawn(true), 800);
    const t2 = setTimeout(() => setHighlightFK(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const DEPT_TABLE = [
    { id: 1, name: "IT" },
    { id: 2, name: "Marketing" },
    { id: 3, name: "HR" },
  ];

  const EMP_WITH_FK = [
    { id: 1, name: "Anna Kowalska", dept_id: 1 },
    { id: 2, name: "Jan Nowak", dept_id: 2 },
    { id: 3, name: "Maria Wisniewska", dept_id: 1 },
    { id: 4, name: "Piotr Lewandowski", dept_id: 3 },
  ];

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Relationships Between Tables</h2>
      <p className="text-base leading-relaxed text-graphite">
        Instead of repeating "IT" everywhere, we store departments in a separate table and use a{" "}
        <strong className="text-ink">foreign key</strong> to connect them.
      </p>

      {/* Two side-by-side mini tables with SVG line */}
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

        <div className="relative flex items-start justify-center gap-16">
          {/* Employees table */}
          <div className="animate-sql-table-slide w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm z-10" style={{ "--slide-dir": "-40px" }}>
            <div className="bg-[#2856a6] px-3 py-2">
              <span className="font-mono text-[11px] font-bold text-white">employees</span>
            </div>
            <div className="divide-y divide-slate-100 text-[11px]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 font-sans font-bold text-slate-500 uppercase text-xs">
                <span className="w-6">id</span>
                <span className="flex-1">name</span>
                <span id="emp-dept-id" className={`transition-all duration-500 ${highlightFK ? "text-blue-600 font-bold" : ""}`}>
                  dept_id
                </span>
              </div>
              {EMP_WITH_FK.map((e) => (
                <div key={e.id} className="flex items-center gap-2 px-3 py-1.5 font-mono text-slate-600">
                  <span className="w-6 font-bold text-amber-600">{e.id}</span>
                  <span className="flex-1 text-slate-700">{e.name.split(" ")[0]}</span>
                  <span className={`transition-all duration-500 ${highlightFK ? "font-bold text-blue-600" : ""}`}>
                    {e.dept_id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SVG connection line */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full z-20">
            <path
              d="M 228 82 C 268 82, 268 52, 308 52"
              fill="none"
              stroke={highlightFK ? "#2856a6" : "#94a3b8"}
              strokeWidth={highlightFK ? 2.5 : 1.5}
              strokeDasharray="200"
              strokeDashoffset={lineDrawn ? 0 : 200}
              style={{ transition: "stroke-dashoffset 0.9s ease-out, stroke 0.3s, stroke-width 0.3s" }}
              markerEnd="url(#fk-arrow)"
            />
            <defs>
              <marker id="fk-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={highlightFK ? "#2856a6" : "#94a3b8"} />
              </marker>
            </defs>
            {highlightFK && (
              <text x="260" y="46" textAnchor="middle" className="font-mono text-[9px] font-bold" fill="#2856a6">
                FK
              </text>
            )}
          </svg>

          {/* Departments table */}
          <div className="animate-sql-table-slide w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm z-10" style={{ "--slide-dir": "40px", animationDelay: "150ms" }}>
            <div className="bg-[#2856a6] px-3 py-2">
              <span className="font-mono text-[11px] font-bold text-white">departments</span>
            </div>
            <div className="divide-y divide-slate-100 text-[11px]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 font-sans font-bold text-slate-500 uppercase text-xs">
                <span id="dept-id" className={`transition-all duration-500 ${highlightFK ? "text-amber-600" : ""}`}>
                  id
                </span>
                <span className="flex-1">name</span>
              </div>
              {DEPT_TABLE.map((d) => (
                <div key={d.id} className="flex items-center gap-2 px-3 py-1.5 font-mono text-slate-600">
                  <span className={`font-bold transition-all duration-500 ${highlightFK ? "text-amber-600" : "text-slate-600"}`}>
                    {d.id}
                  </span>
                  <span className="flex-1 text-slate-700">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FK explanation */}
      {highlightFK && (
        <div className="animate-lesson-enter rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-3">
          <p className="text-sm text-slate-700">
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs font-bold text-blue-700">
              employees.dept_id
            </code>{" "}
            references{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs font-bold text-amber-700">
              departments.id
            </code>{" "}
            -- this foreign key links each employee to their department.
          </p>
        </div>
      )}

      <InsightBox title="Data integrity">
        Foreign keys prevent "orphan" data. You cannot set an employee's dept_id to 99 if no
        department with id=99 exists. The database enforces this automatically.
      </InsightBox>

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
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatIsTable onComplete={onComplete} />;
    if (currentStep === 1) return <ColumnsAndTypes onComplete={onComplete} />;
    if (currentStep === 2) return <PrimaryKeys onComplete={onComplete} />;
    if (currentStep === 3) return <Relationships onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Data Type Check</h2>
          <Quiz
            data={{
              question: "Which data type would you use to store a person's name?",
              options: ["INT", "VARCHAR", "DATE", "BOOLEAN"],
              correctIndex: 1,
              explanation:
                "VARCHAR (variable character) stores text strings of variable length. Names are text, so VARCHAR is the correct choice. INT is for numbers, DATE for dates, and BOOLEAN for true/false values.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Primary Key Properties</h2>
          <Quiz
            data={{
              question: "What makes a primary key special?",
              options: [
                "It can store any data type",
                "It is always named 'id'",
                "It must be unique and never null",
                "It automatically encrypts data",
              ],
              correctIndex: 2,
              explanation:
                "A primary key must be UNIQUE (no two rows can share the same value) and NOT NULL (every row must have a value). This guarantees every row can be uniquely identified.",
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
          <h2 className="text-xl font-bold text-ink">Challenge: Design a Table</h2>
          <p className="text-base text-graphite leading-relaxed">
            A university needs a table to store course information. Drag each column to its correct
            data type slot.
          </p>
          <DragDrop
            items={[
              { id: "course_id", label: "course_id (unique identifier)" },
              { id: "course_name", label: "course_name (e.g., 'Databases 101')" },
              { id: "credits", label: "credits (e.g., 5)" },
              { id: "is_online", label: "is_online (true/false)" },
            ]}
            zones={[
              { id: "z1", label: "INT PRIMARY KEY" },
              { id: "z2", label: "VARCHAR(200)" },
              { id: "z3", label: "INT" },
              { id: "z4", label: "BOOLEAN" },
            ]}
            checkCorrect={(pl) =>
              pl.z1 === "course_id" &&
              pl.z2 === "course_name" &&
              pl.z3 === "credits" &&
              pl.z4 === "is_online"
            }
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
