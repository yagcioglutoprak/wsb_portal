import { useState, useEffect } from "react";
import InsightBox from "../../components/widgets/InsightBox";
import TableRelationships from "../../components/lesson-widgets/TableRelationships";
import QueryBuilder from "../../components/lesson-widgets/QueryBuilder";

const STUDENTS = [
  { id: 1, name: "Anna Kowalska", program: "Computer Science" },
  { id: 2, name: "Jan Nowak", program: "Marketing" },
  { id: 3, name: "Maria Wisniewska", program: "Computer Science" },
];

const ENROLLMENTS = [
  { enrollment_id: 1, student_id: 1, course_id: 101, grade: "A" },
  { enrollment_id: 2, student_id: 1, course_id: 102, grade: "B" },
  { enrollment_id: 3, student_id: 2, course_id: 101, grade: "C" },
  { enrollment_id: 4, student_id: 3, course_id: 103, grade: "A" },
];

const COURSES = [
  { course_id: 101, title: "Databases 101", credits: 5 },
  { course_id: 102, title: "Web Development", credits: 4 },
  { course_id: 103, title: "Data Structures", credits: 6 },
];

const JOINED_DATA = [
  { student_name: "Anna Kowalska", course_title: "Databases 101", grade: "A", credits: 5 },
  { student_name: "Anna Kowalska", course_title: "Web Development", grade: "B", credits: 4 },
  { student_name: "Jan Nowak", course_title: "Databases 101", grade: "C", credits: 5 },
  { student_name: "Maria Wisniewska", course_title: "Data Structures", grade: "A", credits: 6 },
];

/* ─── Learn Step 0: Why relationships? ───────────────────────── */
function WhyRelationships({ onComplete }) {
  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Why Tables Need Relationships</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Storing everything in one giant table leads to repeated data. Instead, we split data into related tables and connect them with <strong className="text-ink">foreign keys</strong>.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-red-200 bg-red-50/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-red-400">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-500">Bad: One big table</p>
          </div>
          <div className="space-y-1 text-xs text-red-700 font-mono rounded-lg bg-white/60 p-2">
            <p>Anna | Databases 101 | 5cr | A</p>
            <p>Anna | Web Dev | 4cr | B</p>
            <p className="text-red-400 italic">Anna's name stored 2x!</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-emerald-500">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 8.5L7 11l4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-500">Good: Related tables</p>
          </div>
          <div className="space-y-1 text-xs text-emerald-700 font-mono rounded-lg bg-white/60 p-2">
            <p>students: Anna (id=<span className="font-bold text-indigo-600">1</span>)</p>
            <p>courses: Databases (id=101)</p>
            <p>enrollments: student_id=<span className="font-bold text-indigo-600">1</span>, course_id=101</p>
          </div>
        </div>
      </div>

      <InsightBox title="Foreign keys create connections">
        A <strong>foreign key (FK)</strong> in one table references the primary key of another table. In our example, <code className="font-mono text-xs">enrollments.student_id</code> references <code className="font-mono text-xs">students.id</code> -- linking each enrollment to its student.
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

/* ─── Learn Step 1: Interactive ER Diagram ─────────────────── */
function ERDiagramStep({ onComplete }) {
  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Entity-Relationship Diagram</h2>
      <p className="text-sm text-graphite">
        Click on the relationships below to see how the tables connect. The lines show which columns link together.
      </p>
      <TableRelationships
        data={{
          tables: [
            {
              name: "students",
              columns: [
                { name: "id", type: "INT", isPK: true },
                { name: "name", type: "VARCHAR" },
                { name: "program", type: "VARCHAR" },
              ],
            },
            {
              name: "enrollments",
              columns: [
                { name: "enrollment_id", type: "INT", isPK: true },
                { name: "student_id", type: "INT", isFK: true },
                { name: "course_id", type: "INT", isFK: true },
                { name: "grade", type: "CHAR" },
              ],
            },
            {
              name: "courses",
              columns: [
                { name: "course_id", type: "INT", isPK: true },
                { name: "title", type: "VARCHAR" },
                { name: "credits", type: "INT" },
              ],
            },
          ],
          relationships: [
            { from: "students.id", to: "enrollments.student_id", label: "One student has many enrollments" },
            { from: "courses.course_id", to: "enrollments.course_id", label: "One course has many enrollments" },
          ],
          question: "What type of relationship exists between students and courses?",
          options: [
            "One-to-One",
            "One-to-Many",
            "Many-to-Many (through enrollments)",
            "No relationship",
          ],
          correctIndex: 2,
        }}
        onComplete={onComplete}
      />
    </div>
  );
}

/* ─── Learn Step 2: Animated JOIN ──────────────────────────── */
function AnimatedJoin({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // 0: tables separate, 1: tables slide together, 2: lines connect, 3: result table

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const matchPairs = [
    { studentId: 1, studentName: "Anna", enrollGrade: "A", courseId: 101 },
    { studentId: 1, studentName: "Anna", enrollGrade: "B", courseId: 102 },
    { studentId: 2, studentName: "Jan", enrollGrade: "C", courseId: 101 },
    { studentId: 3, studentName: "Maria", enrollGrade: "A", courseId: 103 },
  ];

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">JOIN: Combining Tables</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">JOIN</strong> combines rows from two tables based on a matching column. Watch the tables come together:
      </p>

      {/* SQL query */}
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
        </div>
        <div className="px-4 py-3 font-mono text-sm">
          <p><span className="text-slate-600 mr-3 select-none">1</span><span className="text-indigo-400">SELECT</span> <span className="text-slate-300">s.name, c.title, e.grade</span></p>
          <p><span className="text-slate-600 mr-3 select-none">2</span><span className="text-emerald-400">FROM</span> <span className="text-slate-300">students s</span></p>
          <p><span className="text-slate-600 mr-3 select-none">3</span><span className="text-violet-400">JOIN</span> <span className="text-slate-300">enrollments e</span> <span className="text-violet-400">ON</span> <span className="text-slate-300">s.id = e.student_id</span></p>
          <p><span className="text-slate-600 mr-3 select-none">4</span><span className="text-violet-400">JOIN</span> <span className="text-slate-300">courses c</span> <span className="text-violet-400">ON</span> <span className="text-slate-300">e.course_id = c.course_id</span><span className="text-slate-500">;</span></p>
        </div>
      </div>

      {/* Animated tables sliding together */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6">
        <div className="flex items-start justify-center gap-4" style={{ transition: "gap 0.8s ease-out", gap: phase >= 1 ? "16px" : "64px" }}>
          {/* Students mini-table */}
          <div className="w-36 overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm transition-all duration-700" style={{ transform: phase >= 1 ? "translateX(0)" : "translateX(-20px)" }}>
            <div className="bg-blue-500 px-3 py-1.5">
              <span className="font-mono text-[10px] font-bold text-white">students</span>
            </div>
            {STUDENTS.map((s) => (
              <div key={s.id} className={`flex items-center gap-2 border-b border-blue-100 px-3 py-1.5 transition-all duration-500 ${
                phase >= 2 ? "bg-blue-50/50" : ""
              }`}>
                <span className="font-mono text-[10px] font-bold text-indigo-600">id={s.id}</span>
                <span className="text-[10px] text-slate-600 truncate">{s.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>

          {/* Connection indicator */}
          <div className={`flex flex-col items-center justify-center self-center transition-all duration-500 ${phase >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-400 animate-pulse">
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-mono text-[8px] font-bold text-indigo-400">JOIN</span>
          </div>

          {/* Enrollments mini-table */}
          <div className="w-44 overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm transition-all duration-700" style={{ transform: phase >= 1 ? "translateX(0)" : "translateX(20px)" }}>
            <div className="bg-emerald-500 px-3 py-1.5">
              <span className="font-mono text-[10px] font-bold text-white">enrollments</span>
            </div>
            {ENROLLMENTS.map((e) => (
              <div key={e.enrollment_id} className={`flex items-center gap-2 border-b border-emerald-100 px-3 py-1.5 transition-all duration-500 ${
                phase >= 2 ? "bg-emerald-50/50" : ""
              }`}>
                <span className="font-mono text-[10px] text-indigo-600">s_id={e.student_id}</span>
                <span className="font-mono text-[10px] text-slate-500">grade={e.grade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Result table appears at bottom */}
        {phase >= 3 && (
          <div className="mt-6 animate-lesson-enter">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="font-mono text-[10px] font-bold text-indigo-500">RESULT</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="overflow-hidden rounded-lg border border-indigo-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-indigo-100 bg-indigo-50/50">
                    <th className="px-3 py-1.5 text-left font-mono text-[10px] font-bold text-blue-600">s.name</th>
                    <th className="px-3 py-1.5 text-left font-mono text-[10px] font-bold text-emerald-600">e.grade</th>
                  </tr>
                </thead>
                <tbody>
                  {matchPairs.map((p, i) => (
                    <tr key={i} className="border-b border-indigo-50 animate-sql-row-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <td className="px-3 py-1 text-[10px] text-slate-700">{p.studentName}</td>
                      <td className="px-3 py-1 font-mono text-[10px] font-bold text-slate-700">{p.enrollGrade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <InsightBox title="INNER JOIN is the most common">
        An INNER JOIN returns only rows that have matching values in both tables. If a student has no enrollments, they will not appear in the result. Other types (LEFT JOIN, RIGHT JOIN) handle this differently.
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

/* ─── Learn Step 3: JOIN types as Venn diagrams ───────────── */
function JoinTypes({ onComplete }) {
  const [activeType, setActiveType] = useState("inner");

  const joinTypes = [
    { id: "inner", label: "INNER JOIN", desc: "Only rows with matches in BOTH tables" },
    { id: "left", label: "LEFT JOIN", desc: "All rows from LEFT table, matched rows from right" },
    { id: "right", label: "RIGHT JOIN", desc: "All rows from RIGHT table, matched rows from left" },
  ];

  // Venn diagram fill logic
  const getVennStyle = (type) => {
    switch (type) {
      case "inner": return { left: "opacity-20", right: "opacity-20", overlap: "opacity-100" };
      case "left": return { left: "opacity-100", right: "opacity-20", overlap: "opacity-100" };
      case "right": return { left: "opacity-20", right: "opacity-100", overlap: "opacity-100" };
      default: return { left: "opacity-20", right: "opacity-20", overlap: "opacity-100" };
    }
  };

  const venn = getVennStyle(activeType);

  return (
    <div className="skill-theme-sql space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">JOIN Types Visualized</h2>
      <p className="text-sm text-graphite">
        Different JOIN types control which rows appear when there is no match. Click to compare.
      </p>

      {/* Type selector */}
      <div className="flex gap-2">
        {joinTypes.map((jt) => (
          <button
            key={jt.id}
            onClick={() => setActiveType(jt.id)}
            className={`rounded-lg border-2 px-3 py-2 font-mono text-xs font-bold transition-all ${
              activeType === jt.id
                ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-400 hover:border-violet-200"
            }`}
          >
            {jt.label}
          </button>
        ))}
      </div>

      {/* Venn diagram */}
      <div className="flex justify-center rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 py-8">
        <div className="relative h-40 w-64">
          {/* Left circle */}
          <div
            className={`absolute left-0 top-0 h-40 w-40 rounded-full border-2 border-blue-300 transition-all duration-500 ${venn.left}`}
            style={{ backgroundColor: "rgba(99, 102, 241, 0.15)" }}
          />
          {/* Right circle */}
          <div
            className={`absolute right-0 top-0 h-40 w-40 rounded-full border-2 border-emerald-300 transition-all duration-500 ${venn.right}`}
            style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}
          />
          {/* Overlap highlight */}
          <div
            className={`absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${venn.overlap}`}
            style={{ backgroundColor: "rgba(99, 102, 241, 0.35)" }}
          />
          {/* Labels */}
          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-blue-600">
            students
          </span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-emerald-600">
            enrollments
          </span>
          <span className="absolute left-1/2 bottom-1 -translate-x-1/2 font-mono text-[9px] text-indigo-500">
            matched
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg border border-violet-200 bg-violet-50/50 px-4 py-3">
        <p className="font-mono text-xs font-bold text-violet-600">
          {joinTypes.find((jt) => jt.id === activeType)?.label}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {joinTypes.find((jt) => jt.id === activeType)?.desc}
        </p>
      </div>

      {/* Full result table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">Result of 3-table JOIN</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="px-3 py-2 text-left font-mono text-[11px] font-bold text-blue-600">student_name</th>
              <th className="px-3 py-2 text-left font-mono text-[11px] font-bold text-emerald-600">course_title</th>
              <th className="px-3 py-2 text-left font-mono text-[11px] font-bold text-violet-600">grade</th>
              <th className="px-3 py-2 text-left font-mono text-[11px] font-bold text-amber-600">credits</th>
            </tr>
          </thead>
          <tbody>
            {JOINED_DATA.map((row, i) => (
              <tr key={i} className={`border-b border-slate-100 animate-sql-row-in ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`} style={{ animationDelay: `${i * 80}ms` }}>
                <td className="px-3 py-2 text-xs text-slate-700">{row.student_name}</td>
                <td className="px-3 py-2 text-xs text-slate-700">{row.course_title}</td>
                <td className="px-3 py-2 font-mono text-xs font-bold text-slate-700">{row.grade}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">{row.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InsightBox title="Anna appears twice">
        Anna has two enrollments, so she appears in two rows. This is normal and expected -- the JOIN produces one row for each matching combination.
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
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhyRelationships onComplete={onComplete} />;
    if (currentStep === 1) return <ERDiagramStep onComplete={onComplete} />;
    if (currentStep === 2) return <AnimatedJoin onComplete={onComplete} />;
    if (currentStep === 3) return <JoinTypes onComplete={onComplete} />;
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
                { from: "customers.id", to: "orders.customer_id", label: "One customer can have many orders" },
              ],
              question: "To get a list of customer names with their order totals, what JOIN condition do you need?",
              options: [
                "ON orders.order_id = customers.id",
                "ON customers.id = orders.customer_id",
                "ON customers.name = orders.total",
                "ON orders.total > 100",
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
          <p className="text-sm text-graphite">
            Get all student names with their course titles by joining the three tables.
          </p>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT s.name, c.title", type: "select" },
                { id: "c2", sql: "FROM students s", type: "from" },
                { id: "c3", sql: "JOIN enrollments e ON s.id = e.student_id", type: "join" },
                { id: "c4", sql: "JOIN courses c ON e.course_id = c.course_id", type: "join" },
                { id: "c5", sql: "JOIN grades g ON s.id = g.student_id", type: "join", isDistractor: true },
              ],
              correctOrder: ["c1", "c2", "c3", "c4"],
              sampleData: JOINED_DATA,
              columns: ["student_name", "course_title", "grade", "credits"],
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
          <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-indigo-50/30 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-indigo-600">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 11.5c0-1.5 1.12-2.5 2.5-2.5s2.5 1 2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-600">Dean's request</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              "I need to see which students got an A grade. Show me their names, course titles, and grades. Only include the A grades."
            </p>
          </div>
          <QueryBuilder
            data={{
              clauses: [
                { id: "c1", sql: "SELECT s.name, c.title, e.grade", type: "select" },
                { id: "c2", sql: "FROM students s", type: "from" },
                { id: "c3", sql: "JOIN enrollments e ON s.id = e.student_id", type: "join" },
                { id: "c4", sql: "JOIN courses c ON e.course_id = c.course_id", type: "join" },
                { id: "c5", sql: "WHERE e.grade = 'A'", type: "where", filterFn: (row) => row.grade === "A" },
                { id: "c6", sql: "WHERE e.grade > 'B'", type: "where", isDistractor: true },
                { id: "c7", sql: "HAVING grade = 'A'", type: "having", isDistractor: true },
              ],
              correctOrder: ["c1", "c2", "c3", "c4", "c5"],
              sampleData: JOINED_DATA,
              columns: ["student_name", "course_title", "grade", "credits"],
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
