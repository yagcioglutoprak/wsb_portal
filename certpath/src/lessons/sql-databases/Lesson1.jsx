import { useState, useEffect } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DragDrop from "../../components/widgets/DragDrop";

const STUDENT_ROWS = [
  { id: 1, name: "Anna Kowalska", email: "anna@wsb.pl", year: 2 },
  { id: 2, name: "Jan Nowak", email: "jan@wsb.pl", year: 3 },
  { id: 3, name: "Maria Wisniewska", email: "maria@wsb.pl", year: 1 },
  { id: 4, name: "Piotr Lewandowski", email: "piotr@wsb.pl", year: 2 },
];

const COLUMNS = [
  { name: "id", type: "INTEGER" },
  { name: "name", type: "VARCHAR(100)" },
  { name: "email", type: "VARCHAR(200)" },
  { name: "year", type: "INTEGER" },
];

const TYPE_COLORS = {
  INTEGER: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "VARCHAR(100)": "bg-blue-100 text-blue-700 border-blue-200",
  "VARCHAR(200)": "bg-blue-100 text-blue-700 border-blue-200",
  "VARCHAR(50)": "bg-blue-100 text-blue-700 border-blue-200",
  VARCHAR: "bg-blue-100 text-blue-700 border-blue-200",
  "DECIMAL": "bg-amber-100 text-amber-700 border-amber-200",
  "DECIMAL(3,2)": "bg-amber-100 text-amber-700 border-amber-200",
  DATE: "bg-purple-100 text-purple-700 border-purple-200",
  BOOLEAN: "bg-pink-100 text-pink-700 border-pink-200",
};

/* ─── Learn Step 0: Animated table construction ────────────── */
function AnimatedTable({ onComplete }) {
  const [colsVisible, setColsVisible] = useState(0);
  const [rowsVisible, setRowsVisible] = useState(0);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    // Stagger column headers first
    const colTimers = COLUMNS.map((_, i) =>
      setTimeout(() => setColsVisible(i + 1), 300 + i * 250)
    );
    // Then rows one by one
    const rowTimers = STUDENT_ROWS.map((_, i) =>
      setTimeout(() => setRowsVisible(i + 1), 300 + COLUMNS.length * 250 + 200 + i * 300)
    );
    // Then show labels
    const labelTimer = setTimeout(
      () => setShowLabels(true),
      300 + COLUMNS.length * 250 + 200 + STUDENT_ROWS.length * 300 + 300
    );

    return () => {
      colTimers.forEach(clearTimeout);
      rowTimers.forEach(clearTimeout);
      clearTimeout(labelTimer);
    };
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Database Table?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">database</strong> stores data in <strong className="text-ink">tables</strong> -- structured grids of rows and columns, just like a spreadsheet but with superpowers.
      </p>

      {/* Animated table build */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        {/* Table name header */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-slate-400">
            <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span className="font-mono text-xs font-bold text-slate-200">students</span>
          <span className="rounded-full bg-slate-600 px-2 py-0.5 font-mono text-[9px] text-slate-300">TABLE</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COLUMNS.map((col, i) => (
                <th
                  key={col.name}
                  className={`px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    i < colsVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-3"
                  } ${col.name === "id" ? "text-amber-600" : "text-slate-500"}`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-1.5">
                    {col.name}
                    {col.name === "id" && colsVisible > 0 && (
                      <span className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[8px] font-bold text-amber-700">PK</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENT_ROWS.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-slate-100 transition-all duration-400 ${
                  i < rowsVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                } ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <td className="px-4 py-2 font-mono text-xs font-bold text-indigo-600">{row.id}</td>
                <td className="px-4 py-2 text-xs text-slate-700">{row.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-500">{row.email}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-700">{row.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column/Row labels */}
      {showLabels && (
        <div className="grid grid-cols-2 gap-3 animate-lesson-enter">
          <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-600">Column (field)</p>
            <p className="mt-1 text-xs text-indigo-700">A specific attribute -- like "name" or "email"</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600">Row (record)</p>
            <p className="mt-1 text-xs text-emerald-700">One complete entry -- one student's full data</p>
          </div>
        </div>
      )}

      <button
        onClick={onComplete}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-300"
      >
        Got it -- next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Primary Keys with gold accent ──────────── */
function PrimaryKeys({ onComplete }) {
  const [highlightPK, setHighlightPK] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHighlightPK(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Primary Keys</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Every table needs a way to uniquely identify each row. This is the <strong className="text-ink">primary key (PK)</strong> -- a column whose value is unique for every row and never null.
      </p>

      {/* Table with highlighted PK column */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2.5">
          <span className="font-mono text-xs font-bold text-slate-200">students</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {COLUMNS.map((col) => (
                <th
                  key={col.name}
                  className={`px-4 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ${
                    col.name === "id" && highlightPK
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.name}
                    {col.name === "id" && (
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[8px] font-bold transition-all duration-500 ${
                        highlightPK
                          ? "bg-amber-200 text-amber-800 shadow-sm shadow-amber-200"
                          : "bg-slate-200 text-slate-500"
                      }`}>
                        <span className="flex items-center gap-0.5">
                          <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                            <path d="M10 2a3 3 0 00-2.83 4L3 10v3h3l1-1 1 1h2v-2l-1-1 .83-.83A3 3 0 0010 2zm1 3a1 1 0 11-2 0 1 1 0 012 0z" fill="currentColor"/>
                          </svg>
                          PK
                        </span>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENT_ROWS.map((row, i) => (
              <tr key={row.id} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                <td className={`px-4 py-2 font-mono text-xs font-bold transition-all duration-500 ${
                  highlightPK ? "text-amber-600 bg-amber-50/50" : "text-slate-600"
                }`}>
                  {row.id}
                </td>
                <td className="px-4 py-2 text-xs text-slate-700">{row.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-500">{row.email}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-700">{row.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Without vs With PK comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border-2 border-red-200 bg-red-50/30 p-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">Without PK</p>
          <div className="space-y-1.5">
            {["Jan Nowak", "Jan Nowak", "Jan Nowak"].map((n, i) => (
              <div key={i} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-mono text-xs text-red-600">
                {n} <span className="ml-1 text-red-400 italic">Which one?</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/30 p-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-2">With PK</p>
          <div className="space-y-1.5">
            {[{ id: 1 }, { id: 2 }, { id: 3 }].map((r) => (
              <div key={r.id} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-1.5">
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-700">#{r.id}</span>
                <span className="font-mono text-xs text-emerald-700">Jan Nowak</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InsightBox title="Auto-increment IDs">
        Most databases automatically generate primary key values using auto-increment -- the database assigns 1, 2, 3, etc. automatically. You do not need to set the ID yourself when adding a new row.
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

/* ─── Learn Step 2: Data types with type badges ────────────── */
function SqlDataTypes({ onComplete }) {
  const types = [
    { name: "INTEGER", example: "42", desc: "Whole numbers", color: TYPE_COLORS.INTEGER },
    { name: "VARCHAR(n)", example: "'Anna K.'", desc: "Text up to n characters", color: TYPE_COLORS["VARCHAR(100)"] },
    { name: "DECIMAL", example: "3500.50", desc: "Precise decimal numbers (money)", color: TYPE_COLORS.DECIMAL },
    { name: "DATE", example: "'2024-03-15'", desc: "Calendar dates", color: TYPE_COLORS.DATE },
    { name: "BOOLEAN", example: "TRUE", desc: "True or False values", color: TYPE_COLORS.BOOLEAN },
  ];

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">SQL Data Types</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When creating a table, you must specify the <strong className="text-ink">data type</strong> for each column. This tells the database what kind of values to expect and enforces data integrity.
      </p>

      {/* Table with type badges in column headers */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2.5">
          <span className="font-mono text-xs font-bold text-slate-200">students</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COLUMNS.map((col) => (
                <th key={col.name} className="px-4 py-2.5 text-left">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600">{col.name}</span>
                    <span className={`inline-flex w-fit rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-bold ${TYPE_COLORS[col.type] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      {col.type}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENT_ROWS.slice(0, 3).map((row, i) => (
              <tr key={row.id} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                <td className="px-4 py-2 font-mono text-xs font-bold text-indigo-600">{row.id}</td>
                <td className="px-4 py-2 text-xs text-slate-700">{row.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-500">{row.email}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-700">{row.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Type reference cards */}
      <div className="space-y-2">
        {types.map((t, i) => (
          <div
            key={t.name}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold ${t.color}`}>{t.name}</span>
            <span className="flex-1 text-xs text-slate-600">{t.desc}</span>
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">{t.example}</code>
          </div>
        ))}
      </div>

      {/* CREATE TABLE example */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
          <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            create_table.sql
          </span>
        </div>
        <div className="px-4 py-3 space-y-0.5 font-mono text-sm">
          <p><span className="text-slate-600 mr-3 select-none">1</span><span className="text-indigo-400">CREATE TABLE</span> <span className="text-slate-300">students</span> <span className="text-slate-500">(</span></p>
          <p><span className="text-slate-600 mr-3 select-none">2</span>    <span className="text-slate-300">id</span> <span className="text-emerald-400">INTEGER</span> <span className="text-amber-300">PRIMARY KEY</span><span className="text-slate-500">,</span></p>
          <p><span className="text-slate-600 mr-3 select-none">3</span>    <span className="text-slate-300">name</span> <span className="text-blue-400">VARCHAR(100)</span><span className="text-slate-500">,</span></p>
          <p><span className="text-slate-600 mr-3 select-none">4</span>    <span className="text-slate-300">gpa</span> <span className="text-amber-400">DECIMAL(3,2)</span><span className="text-slate-500">,</span></p>
          <p><span className="text-slate-600 mr-3 select-none">5</span>    <span className="text-slate-300">enrolled</span> <span className="text-purple-400">DATE</span></p>
          <p><span className="text-slate-600 mr-3 select-none">6</span><span className="text-slate-500">);</span></p>
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

/* ─── Learn Step 3: Schema Design InsightBox ───────────────── */
function SchemaDesign({ onComplete }) {
  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Schema Design Principles</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">schema</strong> is the blueprint of your database -- which tables exist, what columns they have, and how they relate. Good schema design is the foundation of every reliable application.
      </p>

      <div className="space-y-3">
        {[
          { name: "NOT NULL", desc: "This column must always have a value", example: "name VARCHAR(100) NOT NULL", badge: "bg-red-100 text-red-600 border-red-200" },
          { name: "UNIQUE", desc: "No two rows can have the same value", example: "email VARCHAR(200) UNIQUE", badge: "bg-violet-100 text-violet-600 border-violet-200" },
          { name: "PRIMARY KEY", desc: "Combines NOT NULL + UNIQUE -- the row identifier", example: "id INTEGER PRIMARY KEY", badge: "bg-amber-100 text-amber-600 border-amber-200" },
          { name: "DEFAULT", desc: "Auto-fill if no value is provided", example: "status VARCHAR(20) DEFAULT 'active'", badge: "bg-emerald-100 text-emerald-600 border-emerald-200" },
        ].map((c, i) => (
          <div
            key={c.name}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`rounded-full border px-2 py-0.5 font-mono text-xs font-bold ${c.badge}`}>{c.name}</span>
              <span className="text-sm text-slate-700">{c.desc}</span>
            </div>
            <code className="block rounded bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">{c.example}</code>
          </div>
        ))}
      </div>

      <InsightBox title="Why constraints matter">
        Without constraints, someone could insert a student with no name, or create two accounts with the same email. Constraints prevent bad data from entering your database -- they are your first line of defense.
      </InsightBox>

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
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <AnimatedTable onComplete={onComplete} />;
    if (currentStep === 1) return <PrimaryKeys onComplete={onComplete} />;
    if (currentStep === 2) return <SqlDataTypes onComplete={onComplete} />;
    if (currentStep === 3) return <SchemaDesign onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Primary Key Check</h2>
          <Quiz
            data={{
              question: "Which of these would make the BEST primary key for a 'students' table?",
              options: [
                "Student name",
                "Email address",
                "Auto-incrementing ID number",
                "Date of birth",
              ],
              correctIndex: 2,
              explanation:
                "An auto-incrementing ID is the best primary key because it's guaranteed to be unique and never changes. Names can be duplicated, emails can change, and birth dates are definitely not unique.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-sql space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Data Type Match</h2>
          <Quiz
            data={{
              question: "A column needs to store a student's monthly scholarship amount (e.g., 1500.00 PLN). Which data type is most appropriate?",
              options: [
                "VARCHAR(50)",
                "INTEGER",
                "DECIMAL",
                "BOOLEAN",
              ],
              correctIndex: 2,
              explanation:
                "DECIMAL is the correct choice for monetary values because it stores exact decimal numbers. INTEGER would lose the decimal places (1500 instead of 1500.50), and VARCHAR stores text, not numbers you can calculate with.",
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
          <p className="text-sm text-graphite">
            A university needs a table to store course information. Drag each column to its correct data type slot.
          </p>
          <DragDrop
            items={[
              { id: "course_id", label: "course_id (unique identifier)" },
              { id: "course_name", label: "course_name (e.g., 'Databases 101')" },
              { id: "credits", label: "credits (e.g., 5)" },
              { id: "is_online", label: "is_online (true/false)" },
            ]}
            zones={[
              { id: "z1", label: "INTEGER PRIMARY KEY" },
              { id: "z2", label: "VARCHAR(200)" },
              { id: "z3", label: "INTEGER" },
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
