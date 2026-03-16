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

// Joined data for query builder
const JOINED_DATA = [
  { student_name: "Anna Kowalska", course_title: "Databases 101", grade: "A", credits: 5 },
  { student_name: "Anna Kowalska", course_title: "Web Development", grade: "B", credits: 4 },
  { student_name: "Jan Nowak", course_title: "Databases 101", grade: "C", credits: 5 },
  { student_name: "Maria Wisniewska", course_title: "Data Structures", grade: "A", credits: 6 },
];

/* ─── Learn Step 0: Why relationships? ───────────────────────────── */
function WhyRelationships({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Why Tables Need Relationships</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Storing everything in one giant table leads to repeated data. Instead, we split data into related tables and connect them with <strong className="text-ink">foreign keys</strong>.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4">
          <p className="font-mono text-[10px] font-bold uppercase text-red-600 mb-2">Bad: One big table</p>
          <div className="space-y-1 text-xs text-red-700 font-mono">
            <p>Anna | Databases 101 | 5cr | A</p>
            <p>Anna | Web Dev | 4cr | B</p>
            <p>Anna | Web Dev | 4cr | B <span className="text-red-400">(duplicated!)</span></p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-4">
          <p className="font-mono text-[10px] font-bold uppercase text-green-600 mb-2">Good: Related tables</p>
          <div className="space-y-1 text-xs text-green-700">
            <p className="font-mono">students: Anna (id=1)</p>
            <p className="font-mono">courses: Databases (id=101)</p>
            <p className="font-mono">enrollments: student_id=1, course_id=101</p>
          </div>
        </div>
      </div>

      <InsightBox title="Foreign keys create connections">
        A <strong>foreign key (FK)</strong> in one table references the primary key of another table. In our example, <code className="font-mono text-xs">enrollments.student_id</code> references <code className="font-mono text-xs">students.id</code> — linking each enrollment to its student.
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

/* ─── Learn Step 1: ER Diagram (interactive) ─────────────────────── */
function ERDiagramStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
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

/* ─── Learn Step 2: What is a JOIN? ──────────────────────────────── */
function JoinIntro({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">JOIN: Combining Tables</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">JOIN</strong> combines rows from two tables based on a matching column. It is how you query related data together.
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">INNER JOIN syntax</p>
        <div className="space-y-1 font-mono text-sm">
          <p><span className="text-blue-400">SELECT</span> <span className="text-stone-300">s.name, c.title, e.grade</span></p>
          <p><span className="text-blue-400">FROM</span> <span className="text-stone-300">students s</span></p>
          <p><span className="text-blue-400">JOIN</span> <span className="text-stone-300">enrollments e</span> <span className="text-blue-400">ON</span> <span className="text-stone-300">s.id = e.student_id</span></p>
          <p><span className="text-blue-400">JOIN</span> <span className="text-stone-300">courses c</span> <span className="text-blue-400">ON</span> <span className="text-stone-300">e.course_id = c.course_id</span><span className="text-stone-400">;</span></p>
        </div>
      </div>

      {/* Visual: JOIN = matching keys */}
      <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-graphite mb-2">How JOIN works</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <p className="font-mono text-[10px] font-bold text-blue-600">students</p>
            <div className="rounded border border-blue-200 bg-blue-50 px-2 py-1 font-mono text-xs">id=<span className="font-bold text-rust">1</span> Anna</div>
          </div>
          <div className="text-lg text-stone-300">+</div>
          <div className="flex-1 space-y-1">
            <p className="font-mono text-[10px] font-bold text-green-600">enrollments</p>
            <div className="rounded border border-green-200 bg-green-50 px-2 py-1 font-mono text-xs">student_id=<span className="font-bold text-rust">1</span> grade=A</div>
          </div>
          <div className="text-lg text-stone-300">=</div>
          <div className="flex-1 space-y-1">
            <p className="font-mono text-[10px] font-bold text-amber-600">result</p>
            <div className="rounded border border-amber-200 bg-amber-50 px-2 py-1 font-mono text-xs">Anna | A</div>
          </div>
        </div>
      </div>

      <InsightBox title="INNER JOIN is the most common">
        An INNER JOIN returns only rows that have matching values in both tables. If a student has no enrollments, they will not appear in the result. Other types (LEFT JOIN, RIGHT JOIN) handle this differently.
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

/* ─── Learn Step 3: JOIN result table ────────────────────────────── */
function JoinResult({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">JOIN in Action</h2>
      <p className="text-sm text-graphite">
        Here is the result of joining our three tables. Notice how each row combines data from students, enrollments, and courses.
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
        <div className="bg-stone-800 px-4 py-2">
          <span className="font-mono text-xs text-stone-200">Result of 3-table JOIN</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-blue-600">student_name</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-green-600">course_title</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-purple-600">grade</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-amber-600">credits</th>
            </tr>
          </thead>
          <tbody>
            {JOINED_DATA.map((row, i) => (
              <tr key={i} className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                <td className="px-3 py-2 text-xs text-ink">{row.student_name}</td>
                <td className="px-3 py-2 text-xs text-ink">{row.course_title}</td>
                <td className="px-3 py-2 font-mono text-xs font-bold text-ink">{row.grade}</td>
                <td className="px-3 py-2 font-mono text-xs text-ink">{row.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InsightBox title="Anna appears twice">
        Anna has two enrollments, so she appears in two rows. This is normal and expected — the JOIN produces one row for each matching combination.
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
export default function Lesson3({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhyRelationships onComplete={onComplete} />;
    if (currentStep === 1) return <ERDiagramStep onComplete={onComplete} />;
    if (currentStep === 2) return <JoinIntro onComplete={onComplete} />;
    if (currentStep === 3) return <JoinResult onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
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
        <div className="space-y-6 animate-fade-in-up">
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
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Business Challenge</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">Dean's request</p>
            <p className="text-sm text-graphite leading-relaxed">
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
