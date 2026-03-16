import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DataFilterPuzzle from "../../components/lesson-widgets/DataFilterPuzzle";

const EMPLOYEE_DATA = [
  { id: 1, name: "Anna Kowalska", department: "IT", salary: 6500, years: 3, city: "Warsaw" },
  { id: 2, name: "Jan Nowak", department: "Marketing", salary: 4800, years: 1, city: "Krakow" },
  { id: 3, name: "Maria Wisniewska", department: "IT", salary: 7200, years: 5, city: "Warsaw" },
  { id: 4, name: "Piotr Lewandowski", department: "HR", salary: 5100, years: 2, city: "Poznan" },
  { id: 5, name: "Kasia Zielinska", department: "IT", salary: 5500, years: 1, city: "Warsaw" },
  { id: 6, name: "Tomek Szymanski", department: "Marketing", salary: 5200, years: 2, city: "Krakow" },
  { id: 7, name: "Ola Dabrowska", department: "HR", salary: 4500, years: 4, city: "Poznan" },
  { id: 8, name: "Michal Kozlowski", department: "IT", salary: 8000, years: 6, city: "Warsaw" },
  { id: 9, name: "Ewa Kaminska", department: "Marketing", salary: 4200, years: 1, city: "Gdansk" },
  { id: 10, name: "Adam Wojcik", department: "IT", salary: 6800, years: 4, city: "Krakow" },
];

/* ─── Learn Step 0: What is a dataset? ───────────────────────────── */
function WhatIsDataset({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">What is a Dataset?</h2>
      <p className="text-sm leading-relaxed text-graphite">
        A <strong className="text-ink">dataset</strong> is a structured collection of data, usually organized in rows and columns. Each row is one <strong className="text-ink">observation</strong> (a person, event, or measurement), and each column is a <strong className="text-ink">variable</strong> (an attribute being measured).
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
        <div className="bg-stone-800 px-4 py-2">
          <span className="font-mono text-xs text-stone-200">employees.csv</span>
          <span className="ml-2 font-mono text-[10px] text-stone-400">{EMPLOYEE_DATA.length} rows x 6 columns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-amber-50">
                {["id", "name", "department", "salary", "years", "city"].map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-mono text-xs font-bold text-amber-700">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMPLOYEE_DATA.slice(0, 4).map((row) => (
                <tr key={row.id} className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="px-3 py-1.5 font-mono text-xs text-rust">{row.id}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{row.name}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{row.department}</td>
                  <td className="px-3 py-1.5 font-mono text-xs text-ink">{row.salary}</td>
                  <td className="px-3 py-1.5 font-mono text-xs text-ink">{row.years}</td>
                  <td className="px-3 py-1.5 text-xs text-ink">{row.city}</td>
                </tr>
              ))}
              <tr><td colSpan={6} className="px-3 py-1 text-[10px] text-pencil">... {EMPLOYEE_DATA.length - 4} more rows</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="font-mono text-[10px] font-bold uppercase text-blue-600">Rows = Observations</p>
          <p className="mt-1 text-xs text-blue-700">Each row is one employee</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="font-mono text-[10px] font-bold uppercase text-amber-600">Columns = Variables</p>
          <p className="mt-1 text-xs text-amber-700">Each column measures one attribute</p>
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

/* ─── Learn Step 1: Data types ───────────────────────────────────── */
function DataTypesAnalysis({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Types of Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Understanding data types helps you choose the right analysis and visualization techniques. Data falls into two main categories:
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4">
          <p className="text-sm font-bold text-blue-800 mb-2">{"\uD83D\uDD22"} Quantitative (Numbers)</p>
          <div className="space-y-1.5">
            <div className="rounded-lg bg-white px-3 py-1.5">
              <p className="font-mono text-[10px] font-bold text-blue-600">Continuous</p>
              <p className="text-xs text-graphite">Can be any value: salary (5234.50), temperature (22.7)</p>
            </div>
            <div className="rounded-lg bg-white px-3 py-1.5">
              <p className="font-mono text-[10px] font-bold text-blue-600">Discrete</p>
              <p className="text-xs text-graphite">Only whole numbers: years of experience (3), number of courses (5)</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-4">
          <p className="text-sm font-bold text-green-800 mb-2">{"\uD83C\uDFF7\uFE0F"} Categorical (Labels)</p>
          <div className="space-y-1.5">
            <div className="rounded-lg bg-white px-3 py-1.5">
              <p className="font-mono text-[10px] font-bold text-green-600">Nominal</p>
              <p className="text-xs text-graphite">No order: department (IT, HR), city (Warsaw, Krakow)</p>
            </div>
            <div className="rounded-lg bg-white px-3 py-1.5">
              <p className="font-mono text-[10px] font-bold text-green-600">Ordinal</p>
              <p className="text-xs text-graphite">Has order: grade (A, B, C), satisfaction (low, medium, high)</p>
            </div>
          </div>
        </div>
      </div>

      <InsightBox title="Why does this matter?">
        You can calculate an average salary (quantitative), but you cannot calculate an "average department" (categorical). The data type determines which statistics and charts are appropriate.
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

/* ─── Learn Step 2: Basic statistics ─────────────────────────────── */
function BasicStats({ onComplete }) {
  const salaries = EMPLOYEE_DATA.map((e) => e.salary);
  const mean = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  const sorted = [...salaries].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Summary Statistics</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Before diving into analysis, get an overview of your data with <strong className="text-ink">summary statistics</strong>. These give you a quick sense of the data's center, spread, and range.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Mean", value: `${mean} PLN`, desc: "Average salary" },
          { label: "Median", value: `${median} PLN`, desc: "Middle value" },
          { label: "Min", value: `${min} PLN`, desc: "Lowest" },
          { label: "Max", value: `${max} PLN`, desc: "Highest" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rounded-xl border border-stone-200 bg-card p-3 text-center shadow-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="font-mono text-[10px] font-bold uppercase text-graphite">{s.label}</p>
            <p className="text-lg font-bold text-rust">{s.value}</p>
            <p className="text-[10px] text-pencil">{s.desc}</p>
          </div>
        ))}
      </div>

      <InsightBox title="Mean vs Median">
        The <strong>mean</strong> (average) is sensitive to extreme values. If one employee earns 50,000 PLN, the mean shoots up even though most earn around 5,500. The <strong>median</strong> (middle value) is more robust — it better represents the "typical" salary.
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

/* ─── Learn Step 3: Missing values ───────────────────────────────── */
function MissingValues({ onComplete }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-ink">Dealing with Missing Data</h2>
      <p className="text-sm leading-relaxed text-graphite">
        Real-world data is messy. Some values might be missing (null, empty, N/A). Before analyzing, you need to decide how to handle them.
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-graphite">name</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-graphite">salary</th>
              <th className="px-3 py-2 text-left font-mono text-xs font-bold text-graphite">department</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-stone-100">
              <td className="px-3 py-1.5 text-xs text-ink">Anna Kowalska</td>
              <td className="px-3 py-1.5 font-mono text-xs text-ink">6500</td>
              <td className="px-3 py-1.5 text-xs text-ink">IT</td>
            </tr>
            <tr className="border-b border-stone-100 bg-red-50/50">
              <td className="px-3 py-1.5 text-xs text-ink">Jan Nowak</td>
              <td className="px-3 py-1.5 font-mono text-xs text-red-500 font-bold">NULL</td>
              <td className="px-3 py-1.5 text-xs text-ink">Marketing</td>
            </tr>
            <tr className="border-b border-stone-100 bg-red-50/50">
              <td className="px-3 py-1.5 text-xs text-ink">Maria Wisniewska</td>
              <td className="px-3 py-1.5 font-mono text-xs text-ink">7200</td>
              <td className="px-3 py-1.5 font-mono text-xs text-red-500 font-bold">NULL</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        {[
          { strategy: "Remove rows", desc: "Delete any row with missing values. Simple but you lose data.", when: "Few missing values" },
          { strategy: "Fill with mean/median", desc: "Replace missing numbers with the average or median of that column.", when: "Numerical columns" },
          { strategy: "Fill with mode", desc: "Replace missing categories with the most common value.", when: "Categorical columns" },
          { strategy: "Flag as unknown", desc: "Create a special category like 'Unknown' for missing categorical data.", when: "When absence is meaningful" },
        ].map((s) => (
          <div key={s.strategy} className="rounded-lg border border-stone-200 bg-card px-4 py-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">{s.strategy}</span>
              <span className="rounded bg-stone-100 px-2 py-0.5 font-mono text-[9px] text-graphite">{s.when}</span>
            </div>
            <p className="mt-0.5 text-xs text-pencil">{s.desc}</p>
          </div>
        ))}
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
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === "learn") {
    if (currentStep === 0) return <WhatIsDataset onComplete={onComplete} />;
    if (currentStep === 1) return <DataTypesAnalysis onComplete={onComplete} />;
    if (currentStep === 2) return <BasicStats onComplete={onComplete} />;
    if (currentStep === 3) return <MissingValues onComplete={onComplete} />;
  }

  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Spot the Pattern</h2>
          <Quiz
            data={{
              question: "Looking at the employee dataset, which department has the highest average salary?",
              options: ["Marketing", "HR", "IT", "All departments are equal"],
              correctIndex: 2,
              explanation:
                "IT department employees earn the most on average. IT salaries: 6500, 7200, 5500, 8000, 6800 — average ~6800 PLN. Marketing: 4800, 5200, 4200 — average ~4733 PLN. HR: 5100, 4500 — average 4800 PLN.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Filter the Data</h2>
          <p className="text-sm text-graphite">
            Use the filters to explore the dataset and answer the question.
          </p>
          <DataFilterPuzzle
            data={{
              rows: EMPLOYEE_DATA,
              columns: ["id", "name", "department", "salary", "years", "city"],
              question: "How many employees work in Warsaw and earn more than 6000 PLN?",
              options: ["1", "2", "3", "4"],
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
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-ink">Data Challenge</h2>
          <DataFilterPuzzle
            data={{
              rows: EMPLOYEE_DATA,
              columns: ["id", "name", "department", "salary", "years", "city"],
              question: "The HR manager asks: 'How many employees have been with us for more than 3 years?' Use filters to find the answer.",
              options: ["2", "3", "4", "5"],
              correctIndex: 2,
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
