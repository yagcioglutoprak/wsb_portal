import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DragDrop from "../../components/widgets/DragDrop";

/* ─── Learn Step 0: What is a table? ─────────────────────────────── */
function WhatIsTable({ onComplete }) {
  const rows = [
    { id: 1, name: "Anna Kowalska", email: "anna@wsb.pl", year: 2 },
    { id: 2, name: "Jan Nowak", email: "jan@wsb.pl", year: 3 },
    { id: 3, name: "Maria Wisniewska", email: "maria@wsb.pl", year: 1 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Database Table?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">database</strong> stores data in <strong className="text-ink">tables</strong> — structured grids of rows and columns, similar to a spreadsheet. Each table represents one type of thing (students, courses, grades).
      </p>

      {/* Interactive table with highlighted parts */}
      <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
        <div className="bg-stone-800 px-4 py-2 flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-stone-200">students</span>
          <span className="rounded bg-stone-600 px-2 py-0.5 font-mono text-[9px] text-stone-300">TABLE</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-amber-50">
              {["id", "name", "email", "year"].map((col) => (
                <th key={col} className="px-4 py-2 text-left font-mono text-xs font-bold text-amber-700">
                  {col}
                  {col === "id" && <span className="ml-1 rounded bg-amber-200 px-1 font-mono text-[8px] text-amber-800">PK</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className="border-b border-stone-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2 font-mono text-xs font-bold text-rust">{row.id}</td>
                <td className="px-4 py-2 text-xs text-ink">{row.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-graphite">{row.email}</td>
                <td className="px-4 py-2 font-mono text-xs text-ink">{row.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="font-mono text-[10px] font-bold uppercase text-amber-600">Column (field)</p>
          <p className="mt-1 text-xs text-amber-700">A specific attribute — like "name" or "email"</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="font-mono text-[10px] font-bold uppercase text-blue-600">Row (record)</p>
          <p className="mt-1 text-xs text-blue-700">One complete entry — one student's data</p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 1: Primary keys ─────────────────────────────────── */
function PrimaryKeys({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Primary Keys</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Every table needs a way to uniquely identify each row. This is the <strong className="text-ink">primary key (PK)</strong> — a column whose value is unique for every row and never null.
      </p>

      <div className="rounded-xl border border-stone-200 bg-card p-5">
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">Without primary key</p>
            <div className="space-y-1">
              {["Jan Nowak", "Jan Nowak", "Jan Nowak"].map((n, i) => (
                <div key={i} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-mono text-xs text-red-700">
                  {n} <span className="text-red-400">Which one?</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">With primary key</p>
            <div className="space-y-1">
              {[
                { id: 1, name: "Jan Nowak" },
                { id: 2, name: "Jan Nowak" },
                { id: 3, name: "Jan Nowak" },
              ].map((r) => (
                <div key={r.id} className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5">
                  <span className="font-mono text-xs font-bold text-rust">#{r.id}</span>
                  <span className="font-mono text-xs text-green-700">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InsightBox title="Auto-increment IDs">
        Most databases automatically generate primary key values using auto-increment — the database assigns 1, 2, 3, etc. automatically. You do not need to set the ID yourself when adding a new row.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 2: Data types in SQL ────────────────────────────── */
function SqlDataTypes({ onComplete }) {
  const types = [
    { name: "INTEGER", example: "42", desc: "Whole numbers", color: "bg-green-100 text-green-700" },
    { name: "VARCHAR(n)", example: "'Anna K.'", desc: "Text up to n characters", color: "bg-blue-100 text-blue-700" },
    { name: "DECIMAL", example: "3500.50", desc: "Precise decimal numbers (money)", color: "bg-amber-100 text-amber-700" },
    { name: "DATE", example: "'2024-03-15'", desc: "Calendar dates", color: "bg-purple-100 text-purple-700" },
    { name: "BOOLEAN", example: "TRUE", desc: "True or False values", color: "bg-pink-100 text-pink-700" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">SQL Data Types</h2>
      <p className="text-sm leading-relaxed text-graphite">
        When creating a table, you must specify the <strong className="text-ink">data type</strong> for each column. This tells the database what kind of values to expect and enforces data integrity.
      </p>

      <div className="space-y-2">
        {types.map((t, i) => (
          <div
            key={t.name}
            className="flex items-center gap-3 rounded-lg border border-stone-200 bg-card px-4 py-2.5 shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${t.color}`}>{t.name}</span>
            <span className="text-xs text-graphite flex-1">{t.desc}</span>
            <code className="font-mono text-xs text-pencil">{t.example}</code>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">CREATE TABLE example</p>
        <div className="space-y-1 font-mono text-sm">
          <p><span className="text-blue-400">CREATE TABLE</span> <span className="text-stone-300">students</span> <span className="text-stone-400">(</span></p>
          <p>    <span className="text-stone-300">id</span> <span className="text-green-400">INTEGER</span> <span className="text-amber-300">PRIMARY KEY</span><span className="text-stone-400">,</span></p>
          <p>    <span className="text-stone-300">name</span> <span className="text-green-400">VARCHAR(100)</span><span className="text-stone-400">,</span></p>
          <p>    <span className="text-stone-300">gpa</span> <span className="text-green-400">DECIMAL(3,2)</span><span className="text-stone-400">,</span></p>
          <p>    <span className="text-stone-300">enrolled</span> <span className="text-green-400">DATE</span></p>
          <p><span className="text-stone-400">);</span></p>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Got it — next
      </button>
    </div>
  );
}

/* ─── Learn Step 3: NULL and constraints ──────────────────────────── */
function NullConstraints({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">NULL and Constraints</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">NULL</strong> means "no value" — the field is empty. It is not zero, not an empty string — it is literally nothing. Constraints are rules that enforce data quality.
      </p>

      <div className="space-y-3">
        {[
          { name: "NOT NULL", desc: "This column must always have a value", example: "name VARCHAR(100) NOT NULL" },
          { name: "UNIQUE", desc: "No two rows can have the same value", example: "email VARCHAR(200) UNIQUE" },
          { name: "PRIMARY KEY", desc: "Combines NOT NULL + UNIQUE — the row identifier", example: "id INTEGER PRIMARY KEY" },
          { name: "DEFAULT", desc: "Auto-fill if no value is provided", example: "status VARCHAR(20) DEFAULT 'active'" },
        ].map((c, i) => (
          <div key={c.name} className="rounded-lg border border-stone-200 bg-card px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded bg-rust/10 px-2 py-0.5 font-mono text-xs font-bold text-rust">{c.name}</span>
              <span className="text-sm text-ink">{c.desc}</span>
            </div>
            <code className="font-mono text-xs text-pencil">{c.example}</code>
          </div>
        ))}
      </div>

      <InsightBox title="Why constraints matter">
        Without constraints, someone could insert a student with no name, or create two accounts with the same email. Constraints prevent bad data from entering your database — they are your first line of defense.
      </InsightBox>

      <button
        onClick={onComplete}
        className="rounded-lg bg-rust px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        Let's practice
      </button>
    </div>
  );
}

/* ─── Main Lesson Component ──────────────────────────────────────── */
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatIsTable onComplete={onComplete} />;
    if (currentStep === 1) return <PrimaryKeys onComplete={onComplete} />;
    if (currentStep === 2) return <SqlDataTypes onComplete={onComplete} />;
    if (currentStep === 3) return <NullConstraints onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
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
        <div className="space-y-6 animate-fade-in-up">
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
        <div className="space-y-6 animate-fade-in-up">
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
