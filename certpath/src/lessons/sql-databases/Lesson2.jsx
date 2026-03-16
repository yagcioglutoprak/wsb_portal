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

/* ─── Learn Step 0: What is SELECT? ──────────────────────────────── */
function SelectIntro({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">SELECT: Reading Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">SELECT</strong> is the most fundamental SQL command — it retrieves data from a table. Every query starts with SELECT.
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Basic syntax</p>
        <div className="space-y-1 font-mono text-sm">
          <p><span className="text-blue-400">SELECT</span> <span className="text-stone-300">column1, column2</span></p>
          <p><span className="text-blue-400">FROM</span> <span className="text-stone-300">table_name</span><span className="text-stone-400">;</span></p>
        </div>
      </div>

      {/* Show query and highlighted result */}
      <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
        <div className="rounded-lg bg-stone-900 px-3 py-2 mb-3">
          <code className="font-mono text-xs"><span className="text-blue-400">SELECT</span> <span className="text-stone-300">name, department</span> <span className="text-blue-400">FROM</span> <span className="text-stone-300">employees</span><span className="text-stone-400">;</span></code>
        </div>
        <div className="overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-blue-50">
                <th className="px-3 py-1.5 text-left font-mono text-xs font-bold text-blue-700">name</th>
                <th className="px-3 py-1.5 text-left font-mono text-xs font-bold text-blue-700">department</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.slice(0, 4).map((e) => (
                <tr key={e.id} className="border-b border-stone-100">
                  <td className="px-3 py-1.5 text-xs text-ink">{e.name}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{e.department}</td>
                </tr>
              ))}
              <tr><td colSpan={2} className="px-3 py-1 text-[10px] text-pencil">... {EMPLOYEES.length - 4} more rows</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <InsightBox title="SELECT * means everything">
        Use <code className="font-mono text-xs">SELECT *</code> to get all columns. It is handy for exploring, but in production code, always list specific columns — it is faster and clearer.
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

/* ─── Learn Step 1: FROM ─────────────────────────────────────────── */
function FromClause({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">FROM: Which Table?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">FROM</strong> tells SQL which table to read from. A database can have dozens of tables — FROM specifies the one you want.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {["employees", "courses", "grades"].map((table, i) => (
          <div
            key={table}
            className={`rounded-xl border-2 p-4 text-center font-mono text-sm font-bold transition-all ${
              i === 0 ? "border-rust bg-rust/5 text-rust shadow-md scale-105" : "border-stone-200 bg-card text-graphite"
            }`}
          >
            {table}
            {i === 0 && <p className="mt-1 font-sans text-[10px] font-normal text-rust">selected</p>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1 font-mono text-sm">
          <p><span className="text-blue-400">SELECT</span> <span className="text-stone-300">name, salary</span></p>
          <p><span className="text-blue-400">FROM</span> <span className="text-amber-300">employees</span><span className="text-stone-400">;</span>  <span className="text-stone-600">-- reads from the employees table</span></p>
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

/* ─── Learn Step 2: WHERE ────────────────────────────────────────── */
function WhereClause({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">WHERE: Filtering Rows</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">WHERE</strong> filters which rows are returned. Only rows that match the condition are included in the result.
      </p>

      <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
        <div className="rounded-lg bg-stone-900 px-3 py-2 mb-3">
          <code className="font-mono text-xs">
            <span className="text-blue-400">SELECT</span> <span className="text-stone-300">*</span>{" "}
            <span className="text-blue-400">FROM</span> <span className="text-stone-300">employees</span>{" "}
            <span className="text-blue-400">WHERE</span> <span className="text-stone-300">department</span>{" "}
            <span className="text-stone-500">=</span> <span className="text-green-400">'IT'</span><span className="text-stone-400">;</span>
          </code>
        </div>
        <div className="overflow-hidden rounded-lg border border-stone-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-100">
                {["id", "name", "department", "salary"].map((col) => (
                  <th key={col} className="px-3 py-1.5 text-left font-mono text-xs font-bold text-graphite">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.filter((e) => e.department === "IT").map((e) => (
                <tr key={e.id} className="border-b border-stone-100 bg-green-50/50">
                  <td className="px-3 py-1.5 font-mono text-xs text-rust">{e.id}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{e.name}</td>
                  <td className="px-3 py-1.5 text-xs font-semibold text-green-700">{e.department}</td>
                  <td className="px-3 py-1.5 font-mono text-xs text-ink">{e.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-pencil">Only IT department employees are returned — {EMPLOYEES.filter((e) => e.department === "IT").length} out of {EMPLOYEES.length} rows.</p>
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

/* ─── Learn Step 3: AND / OR ─────────────────────────────────────── */
function AndOrStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">AND / OR: Combining Conditions</h2>
      <p className="text-sm leading-relaxed text-graphite">
        You can combine multiple conditions with <strong className="text-ink">AND</strong> (both must be true) or <strong className="text-ink">OR</strong> (either can be true).
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1 font-mono text-sm">
          <p><span className="text-blue-400">SELECT</span> <span className="text-stone-300">name, salary</span></p>
          <p><span className="text-blue-400">FROM</span> <span className="text-stone-300">employees</span></p>
          <p><span className="text-blue-400">WHERE</span> <span className="text-stone-300">department</span> <span className="text-stone-500">=</span> <span className="text-green-400">'IT'</span></p>
          <p>  <span className="text-blue-400">AND</span> <span className="text-stone-300">salary</span> <span className="text-stone-500">&gt;</span> <span className="text-amber-300">6000</span><span className="text-stone-400">;</span></p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className="px-3 py-1.5 text-left font-mono text-xs font-bold text-graphite">name</th>
              <th className="px-3 py-1.5 text-left font-mono text-xs font-bold text-graphite">salary</th>
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES.filter((e) => e.department === "IT" && e.salary > 6000).map((e) => (
              <tr key={e.id} className="border-b border-stone-100 bg-green-50/50">
                <td className="px-3 py-1.5 text-xs text-ink">{e.name}</td>
                <td className="px-3 py-1.5 font-mono text-xs text-ink">{e.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InsightBox title="AND narrows, OR widens">
        Adding <strong>AND</strong> gives you fewer results (more restrictive). Adding <strong>OR</strong> gives you more results (less restrictive). Think: "must be in IT AND earn over 6000" vs "in IT OR in Marketing".
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

/* ─── Learn Step 4: ORDER BY ─────────────────────────────────────── */
function OrderByStep({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">ORDER BY: Sorting Results</h2>
      <p className="text-sm leading-relaxed text-graphite">
        <strong className="text-ink">ORDER BY</strong> sorts your results. Use <code className="font-mono text-xs">ASC</code> for ascending (default) or <code className="font-mono text-xs">DESC</code> for descending.
      </p>

      <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
        <div className="space-y-1 font-mono text-sm">
          <p><span className="text-blue-400">SELECT</span> <span className="text-stone-300">name, salary</span></p>
          <p><span className="text-blue-400">FROM</span> <span className="text-stone-300">employees</span></p>
          <p><span className="text-blue-400">ORDER BY</span> <span className="text-stone-300">salary</span> <span className="text-amber-300">DESC</span><span className="text-stone-400">;</span></p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className="px-3 py-1.5 text-left font-mono text-xs font-bold text-graphite">name</th>
              <th className="px-3 py-1.5 text-left font-mono text-xs font-bold text-graphite">salary</th>
            </tr>
          </thead>
          <tbody>
            {[...EMPLOYEES].sort((a, b) => b.salary - a.salary).slice(0, 5).map((e) => (
              <tr key={e.id} className="border-b border-stone-100">
                <td className="px-3 py-1.5 text-xs text-ink">{e.name}</td>
                <td className="px-3 py-1.5 font-mono text-xs text-ink">{e.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
export default function Lesson2({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <SelectIntro onComplete={onComplete} />;
    if (currentStep === 1) return <FromClause onComplete={onComplete} />;
    if (currentStep === 2) return <WhereClause onComplete={onComplete} />;
    if (currentStep === 3) return <AndOrStep onComplete={onComplete} />;
    if (currentStep === 4) return <OrderByStep onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
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
        <div className="space-y-6 animate-fade-in-up">
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
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Business Challenge</h2>
          <div className="rounded-xl border border-stone-200 bg-card p-4 shadow-sm">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-graphite mb-2">Manager request</p>
            <p className="text-sm text-graphite leading-relaxed">
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
