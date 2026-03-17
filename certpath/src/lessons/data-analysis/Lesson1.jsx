import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Quiz from "../../components/widgets/Quiz";
import InsightBox from "../../components/widgets/InsightBox";
import DataFilterPuzzle from "../../components/lesson-widgets/DataFilterPuzzle";

/* =======================================================================
   LESSON 1 — "Foundations of Datasets"
   A story in 7 steps: Build → Sort → Explore → Discover → Quiz → Filter → Challenge
   Every step requires interaction. Zero passive "next" buttons.
   ======================================================================= */

/* ── Global keyframes ──────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.querySelector("[data-ds1]")) {
  const s = document.createElement("style");
  s.setAttribute("data-ds1", "");
  s.textContent = `
    @keyframes ds1-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes ds1-in{from{opacity:0}to{opacity:1}}
    @keyframes ds1-pop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
    @keyframes ds1-snap{0%{transform:scale(1.15);opacity:.7}50%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}
    @keyframes ds1-glow-pulse{0%,100%{filter:drop-shadow(0 0 4px rgba(139,92,246,.2))}50%{filter:drop-shadow(0 0 12px rgba(139,92,246,.45))}}
    @keyframes ds1-shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-6px)}30%{transform:translateX(6px)}45%{transform:translateX(-4px)}60%{transform:translateX(4px)}75%{transform:translateX(-2px)}90%{transform:translateX(2px)}}
    @keyframes ds1-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes ds1-confetti{0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) rotate(var(--rot)) scale(0);opacity:0}}
    @keyframes ds1-slide-in{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes ds1-draw-line{from{stroke-dashoffset:100%}to{stroke-dashoffset:0}}
    @keyframes ds1-ripple{0%{transform:scale(0);opacity:.6}100%{transform:scale(2.5);opacity:0}}
    @keyframes ds1-counter{0%{transform:translateY(8px);opacity:0}100%{transform:translateY(0);opacity:1}}
    @keyframes ds1-celebrate{0%{transform:scale(1)}25%{transform:scale(1.08)}50%{transform:scale(0.97)}75%{transform:scale(1.03)}100%{transform:scale(1)}}
    @keyframes ds1-bar-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
    @keyframes ds1-dot-enter{0%{transform:scale(0);opacity:0}60%{transform:scale(1.3);opacity:1}100%{transform:scale(1);opacity:1}}
    @keyframes ds1-pulse-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.8);opacity:0}}
    @keyframes ds1-bounce-back{0%{transform:translateX(0)}30%{transform:translateX(8px)}60%{transform:translateX(-5px)}100%{transform:translateX(0)}}
  `;
  document.head.appendChild(s);
}

/* ── Employee data for a Polish tech company ─────────────────────── */
const EMPLOYEE_DATA = [
  { id: 1, name: "Anna Kowalska", department: "IT", salary: 6500, hireDate: "2021-03-15", city: "Warsaw" },
  { id: 2, name: "Jan Nowak", department: "Marketing", salary: 4800, hireDate: "2023-06-01", city: "Krakow" },
  { id: 3, name: "Maria Wisniewska", department: "IT", salary: 7200, hireDate: "2019-09-20", city: "Warsaw" },
  { id: 4, name: "Piotr Lewandowski", department: "HR", salary: 5100, hireDate: "2022-01-10", city: "Poznan" },
  { id: 5, name: "Kasia Zielinska", department: "IT", salary: 5500, hireDate: "2023-08-01", city: "Warsaw" },
  { id: 6, name: "Tomek Szymanski", department: "Marketing", salary: 5200, hireDate: "2022-04-18", city: "Krakow" },
  { id: 7, name: "Ola Dabrowska", department: "HR", salary: 4500, hireDate: "2020-07-22", city: "Poznan" },
  { id: 8, name: "Michal Kozlowski", department: "IT", salary: 8000, hireDate: "2018-02-14", city: "Warsaw" },
  { id: 9, name: "Ewa Kaminska", department: "Marketing", salary: 4200, hireDate: "2023-11-30", city: "Gdansk" },
  { id: 10, name: "Adam Wojcik", department: "IT", salary: 6800, hireDate: "2020-05-05", city: "Krakow" },
  { id: 11, name: "Zofia Mazur", department: "HR", salary: 4700, hireDate: "2021-10-01", city: "Warsaw" },
  { id: 12, name: "Bartek Krawczyk", department: "IT", salary: 7500, hireDate: "2019-01-15", city: "Gdansk" },
];

const COLUMNS = ["id", "name", "department", "salary", "hireDate", "city"];

const TYPE_INFO = {
  id: { type: "INT", color: "#8b5cf6", bg: "#f5f3ff" },
  name: { type: "TEXT", color: "#14b8a6", bg: "#f0fdfa" },
  department: { type: "TEXT", color: "#14b8a6", bg: "#f0fdfa" },
  salary: { type: "DECIMAL", color: "#f97316", bg: "#fff7ed" },
  hireDate: { type: "DATE", color: "#3b82f6", bg: "#eff6ff" },
  city: { type: "TEXT", color: "#14b8a6", bg: "#f0fdfa" },
};

/* ── Palette ───────────────────────────────────────────────────────── */
const P = {
  violet: "#8b5cf6", indigo: "#6366f1", teal: "#14b8a6", orange: "#f97316",
  blue: "#3b82f6", green: "#16a34a", red: "#ef4444", emerald: "#10b981",
  ink: "#1a1a18", graphite: "#5a5a56", pencil: "#7a7a76",
  stone: "#d6d3cd", border: "#e5e2dc", card: "#fdfcfa", paper: "#f5f3ef",
};

/* ── Tiny confetti burst ─────────────────────────────────────────── */
function ConfettiBurst({ active, x = "50%", y = "50%" }) {
  if (!active) return null;
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * 360 + Math.random() * 20;
    const dist = 30 + Math.random() * 40;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;
    const rot = Math.random() * 360;
    const colors = ["#8b5cf6", "#14b8a6", "#f97316", "#3b82f6", "#10b981", "#f43f5e"];
    const size = 3 + Math.random() * 4;
    return (
      <span key={i} className="pointer-events-none absolute" style={{
        left: x, top: y, width: size, height: size,
        backgroundColor: colors[i % colors.length],
        borderRadius: Math.random() > 0.5 ? "50%" : "1px",
        animation: `ds1-confetti 0.7s cubic-bezier(.15,.85,.3,1) forwards`,
        animationDelay: `${i * 15}ms`,
        "--tx": `${tx}px`, "--ty": `${ty}px`, "--rot": `${rot}deg`,
      }} />
    );
  });
  return <div className="pointer-events-none absolute inset-0 overflow-visible">{particles}</div>;
}

/* ── Progress badge ──────────────────────────────────────────────── */
function ProgressBadge({ current, total, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-violet-100 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <span className="font-mono text-xs font-bold text-violet-400">{current}/{total} {label}</span>
    </div>
  );
}

/* =======================================================================
   STEP 0 — "Build a Dataset"
   Students drag scattered data chips into the correct table slots.
   They discover the structure BY constructing it.
   ======================================================================= */
function BuildDataset({ onComplete }) {
  // We use first 4 employees for manageable interaction
  const ROWS = EMPLOYEE_DATA.slice(0, 4);
  const COLS = ["name", "department", "salary", "city"];

  // Each chip = { rowIdx, colKey, value, placed }
  const allChips = useMemo(() => {
    const chips = [];
    ROWS.forEach((row, ri) => {
      COLS.forEach((col) => {
        chips.push({
          id: `${ri}-${col}`,
          rowIdx: ri,
          colKey: col,
          value: col === "salary" ? `${row[col]} PLN` : row[col],
          rawValue: row[col],
        });
      });
    });
    // Shuffle deterministically
    const shuffled = [...chips];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = ((i * 7 + 3) * 13) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const totalSlots = ROWS.length * COLS.length;
  const [placed, setPlaced] = useState({}); // { "rowIdx-colKey": chipId }
  const [selectedChip, setSelectedChip] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(null); // slot id that flashed wrong
  const [snapEffect, setSnapEffect] = useState(null); // chip id that just snapped
  const [complete, setComplete] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const placedCount = Object.keys(placed).length;
  const placedChipIds = new Set(Object.values(placed));

  // Check completion
  useEffect(() => {
    if (placedCount === totalSlots && !complete) {
      setComplete(true);
      setShowConfetti(true);
      setTimeout(() => setShowLabels(true), 500);
      setTimeout(() => setShowConfetti(false), 1200);
    }
  }, [placedCount, totalSlots, complete]);

  const handleChipClick = (chip) => {
    if (complete) return;
    if (placedChipIds.has(chip.id)) return;
    setSelectedChip(chip.id === selectedChip ? null : chip.id);
  };

  const handleSlotClick = (rowIdx, colKey) => {
    if (complete) return;
    const slotId = `${rowIdx}-${colKey}`;
    if (placed[slotId]) return; // already filled
    if (!selectedChip) return;

    const chip = allChips.find((c) => c.id === selectedChip);
    if (!chip) return;

    // Check if correct placement
    if (chip.rowIdx === rowIdx && chip.colKey === colKey) {
      // Correct!
      setPlaced((prev) => ({ ...prev, [slotId]: chip.id }));
      setSnapEffect(chip.id);
      setSelectedChip(null);
      setTimeout(() => setSnapEffect(null), 400);
    } else {
      // Wrong slot - shake + bounce back
      setWrongFlash(slotId);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  const getChipColor = (colKey) => TYPE_INFO[colKey] || { color: P.violet, bg: "#f5f3ff" };

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Build a Dataset</h2>
      <p className="text-base leading-relaxed text-graphite">
        A dataset is a structured collection of data. Instead of just reading about it,
        <strong className="text-violet-700"> build one yourself</strong>. Click a data chip below,
        then click the correct empty slot in the table.
      </p>

      <ProgressBadge current={placedCount} total={totalSlots} label="placed" />

      {/* Floating data chips */}
      <div className="relative rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/40 to-indigo-50/30 p-4 shadow-sm">
        <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-3">
          Data Chips -- click one to select
        </p>
        <div className="flex flex-wrap gap-2">
          {allChips.map((chip) => {
            const isPlaced = placedChipIds.has(chip.id);
            const isSelected = selectedChip === chip.id;
            const colors = getChipColor(chip.colKey);
            const isSnapping = snapEffect === chip.id;

            if (isPlaced) {
              return (
                <span key={chip.id} className="rounded-lg border border-dashed border-violet-200 px-3 py-1.5 font-mono text-xs text-violet-300 line-through opacity-40">
                  {chip.value}
                </span>
              );
            }

            return (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip)}
                className="relative rounded-lg border-2 px-3 py-1.5 font-mono text-xs font-semibold transition-all duration-200"
                style={{
                  borderColor: isSelected ? colors.color : `${colors.color}40`,
                  backgroundColor: isSelected ? colors.color : colors.bg,
                  color: isSelected ? "white" : colors.color,
                  transform: isSelected ? "scale(1.08) translateY(-2px)" : "scale(1)",
                  boxShadow: isSelected
                    ? `0 4px 16px ${colors.color}30, 0 0 0 3px ${colors.color}15`
                    : `0 1px 3px ${colors.color}10`,
                  animation: isSnapping ? "ds1-snap 0.35s ease-out" : isSelected ? "ds1-float 1.5s ease-in-out infinite" : "none",
                  cursor: "pointer",
                }}
              >
                {chip.value}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white border-2"
                    style={{ borderColor: colors.color, animation: "ds1-glow-pulse 1s ease-in-out infinite" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table grid with empty slots */}
      <div className="relative overflow-hidden rounded-xl border border-violet-200/60 shadow-md">
        <div className="flex items-center justify-between bg-gradient-to-r from-violet-900 to-indigo-900 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" />
            </div>
            <span className="font-mono text-xs text-violet-200/80">employees.csv</span>
          </div>
          <span className="font-mono text-xs text-violet-400">
            {placedCount} / {totalSlots} cells filled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-200 bg-violet-50">
                {COLS.map((col) => {
                  const info = TYPE_INFO[col];
                  return (
                    <th key={col} className="px-3 py-2.5 text-left">
                      <span className="font-mono text-xs font-bold" style={{ color: info.color }}>{col}</span>
                      <span className="ml-1.5 rounded px-1 py-0.5 font-sans text-[8px] font-bold uppercase"
                        style={{ backgroundColor: info.bg, color: info.color }}>
                        {info.type}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={ri} className={`border-b border-violet-50 ${ri % 2 === 0 ? "bg-white" : "bg-violet-50/20"}`}>
                  {COLS.map((col) => {
                    const slotId = `${ri}-${col}`;
                    const chipId = placed[slotId];
                    const chip = chipId ? allChips.find((c) => c.id === chipId) : null;
                    const isWrong = wrongFlash === slotId;
                    const colors = getChipColor(col);

                    if (chip) {
                      return (
                        <td key={col} className="px-3 py-2">
                          <span className="inline-block rounded-md px-2 py-1 font-mono text-xs font-semibold"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.color,
                              animation: "ds1-pop 0.3s cubic-bezier(.34,1.56,.64,1)",
                            }}>
                            {chip.value}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={col} className="px-3 py-2">
                        <button
                          onClick={() => handleSlotClick(ri, col)}
                          className="w-full rounded-md border-2 border-dashed px-2 py-1.5 text-center font-mono text-xs transition-all duration-200"
                          style={{
                            borderColor: isWrong ? P.red : selectedChip ? `${colors.color}60` : `${colors.color}25`,
                            backgroundColor: isWrong ? "#fef2f2" : selectedChip ? `${colors.bg}` : "transparent",
                            color: isWrong ? P.red : `${colors.color}60`,
                            animation: isWrong ? "ds1-shake 0.4s ease-out" : "none",
                            cursor: selectedChip ? "pointer" : "default",
                          }}
                        >
                          {isWrong ? "wrong slot" : selectedChip ? "drop here" : "---"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ConfettiBurst active={showConfetti} x="50%" y="40%" />
      </div>

      {/* Structural labels revealed on completion */}
      {showLabels && (
        <div className="grid grid-cols-3 gap-3" style={{ animation: "ds1-up 0.5s ease-out" }}>
          {[
            { icon: "row", label: "Row = Record", desc: "Each row is one employee", color: P.violet, borderColor: "#ddd6fe" },
            { icon: "col", label: "Column = Variable", desc: "Each column is one attribute", color: P.teal, borderColor: "#99f6e4" },
            { icon: "cell", label: "Cell = Value", desc: "Each cell holds one data point", color: P.orange, borderColor: "#fed7aa" },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border-2 p-3 text-center"
              style={{
                borderColor: item.borderColor,
                background: `linear-gradient(135deg, ${item.color}08, ${item.color}04)`,
                animation: `ds1-pop 0.4s cubic-bezier(.34,1.56,.64,1) ${i * 120}ms both`,
              }}>
              <div className="mb-1">
                <svg width="28" height="28" viewBox="0 0 28 28" className="mx-auto">
                  <defs>
                    <linearGradient id={`ds1-ico-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={item.color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={item.color} stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  {item.icon === "row" && (
                    <g fill="none" stroke={`url(#ds1-ico-${i})`} strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="10" width="22" height="8" rx="2" fill={`${item.color}10`} />
                      <line x1="3" y1="6" x2="25" y2="6" opacity=".3" />
                      <line x1="3" y1="22" x2="25" y2="22" opacity=".3" />
                    </g>
                  )}
                  {item.icon === "col" && (
                    <g fill="none" stroke={`url(#ds1-ico-${i})`} strokeWidth="2" strokeLinecap="round">
                      <rect x="10" y="3" width="8" height="22" rx="2" fill={`${item.color}10`} />
                      <line x1="6" y1="3" x2="6" y2="25" opacity=".3" />
                      <line x1="22" y1="3" x2="22" y2="25" opacity=".3" />
                    </g>
                  )}
                  {item.icon === "cell" && (
                    <g fill="none" stroke={`url(#ds1-ico-${i})`} strokeWidth="2" strokeLinecap="round">
                      <rect x="8" y="8" width="12" height="12" rx="2" fill={`${item.color}15`} />
                      <circle cx="14" cy="14" r="2" fill={item.color} />
                    </g>
                  )}
                </svg>
              </div>
              <p className="font-sans text-xs font-bold uppercase" style={{ color: item.color }}>{item.label}</p>
              <p className="mt-0.5 text-[11px] text-graphite">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Next button appears only after complete */}
      {complete && showLabels && (
        <button
          onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ animation: "ds1-up 0.4s ease-out 0.3s both" }}
        >
          Next -- Data Types
        </button>
      )}
    </div>
  );
}


/* =======================================================================
   STEP 1 — "Data Types Laboratory"
   Sort mixed values into correct type buckets by clicking.
   ======================================================================= */
function DataTypesLab({ onComplete }) {
  const TYPE_BUCKETS = [
    { type: "TEXT", color: "#14b8a6", bg: "#f0fdfa", label: "Text", desc: "Names, labels, categories" },
    { type: "INT", color: "#8b5cf6", bg: "#f5f3ff", label: "Integer", desc: "Whole numbers" },
    { type: "DECIMAL", color: "#f97316", bg: "#fff7ed", label: "Decimal", desc: "Numbers with precision" },
    { type: "DATE", color: "#3b82f6", bg: "#eff6ff", label: "Date", desc: "Temporal values" },
  ];

  const VALUES = useMemo(() => [
    { id: 0, display: '"Anna Kowalska"', type: "TEXT", source: "name" },
    { id: 1, display: "6500", type: "DECIMAL", source: "salary" },
    { id: 2, display: '"2021-03-15"', type: "DATE", source: "hireDate" },
    { id: 3, display: '"Warsaw"', type: "TEXT", source: "city" },
    { id: 4, display: "1", type: "INT", source: "id" },
    { id: 5, display: "4800", type: "DECIMAL", source: "salary" },
    { id: 6, display: '"Marketing"', type: "TEXT", source: "department" },
    { id: 7, display: '"2019-09-20"', type: "DATE", source: "hireDate" },
    { id: 8, display: "3", type: "INT", source: "id" },
    { id: 9, display: "7200", type: "DECIMAL", source: "salary" },
    { id: 10, display: '"Krakow"', type: "TEXT", source: "city" },
    { id: 11, display: '"2023-08-01"', type: "DATE", source: "hireDate" },
  ], []);

  const [sorted, setSorted] = useState({}); // { chipId: bucketType }
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(null); // chipId
  const [correctFlash, setCorrectFlash] = useState(null);
  const [showInsight, setShowInsight] = useState(false);
  const [showMiniChallenge, setShowMiniChallenge] = useState(false);
  const [miniAnswer, setMiniAnswer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const sortedCount = Object.keys(sorted).length;
  const totalValues = VALUES.length;

  useEffect(() => {
    if (sortedCount === totalValues && !allDone) {
      setAllDone(true);
      setShowConfetti(true);
      setTimeout(() => setShowInsight(true), 600);
      setTimeout(() => setShowMiniChallenge(true), 1200);
      setTimeout(() => setShowConfetti(false), 1000);
    }
  }, [sortedCount, totalValues, allDone]);

  const handleBucketSelect = (type) => {
    setSelectedBucket(selectedBucket === type ? null : type);
  };

  const handleValueClick = (chip) => {
    if (sorted[chip.id] !== undefined) return;
    if (!selectedBucket) return;

    if (chip.type === selectedBucket) {
      // Correct
      setSorted((prev) => ({ ...prev, [chip.id]: selectedBucket }));
      setCorrectFlash(chip.id);
      setTimeout(() => setCorrectFlash(null), 500);
    } else {
      // Wrong
      setWrongFlash(chip.id);
      setTimeout(() => setWrongFlash(null), 600);
    }
  };

  const getBucketCount = (type) => Object.values(sorted).filter((t) => t === type).length;

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Data Types Laboratory</h2>
      <p className="text-base leading-relaxed text-graphite">
        Every value has a <strong className="text-violet-700">type</strong> that determines what operations you can perform on it.
        First <strong className="text-violet-700">select a type bucket</strong> below, then <strong className="text-violet-700">click matching values</strong> to sort them.
      </p>

      <ProgressBadge current={sortedCount} total={totalValues} label="sorted" />

      {/* Type buckets */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TYPE_BUCKETS.map((bucket) => {
          const count = getBucketCount(bucket.type);
          const isSelected = selectedBucket === bucket.type;
          return (
            <button
              key={bucket.type}
              onClick={() => handleBucketSelect(bucket.type)}
              className="relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all duration-300"
              style={{
                borderColor: isSelected ? bucket.color : `${bucket.color}35`,
                backgroundColor: isSelected ? bucket.color : bucket.bg,
                transform: isSelected ? "scale(1.03) translateY(-2px)" : "scale(1)",
                boxShadow: isSelected ? `0 6px 20px ${bucket.color}25` : "none",
              }}
            >
              {isSelected && (
                <div className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{ animation: "ds1-pulse-ring 1.5s ease-out infinite", border: `2px solid ${bucket.color}40` }} />
              )}
              <p className="font-sans text-xs font-bold uppercase"
                style={{ color: isSelected ? "rgba(255,255,255,0.85)" : bucket.color }}>
                {bucket.label}
              </p>
              <p className="text-xs mt-0.5"
                style={{ color: isSelected ? "rgba(255,255,255,0.65)" : P.pencil }}>
                {bucket.desc}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-1.5 w-4 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i < count
                        ? (isSelected ? "rgba(255,255,255,0.9)" : bucket.color)
                        : (isSelected ? "rgba(255,255,255,0.2)" : `${bucket.color}20`),
                    }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Value chips to sort */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
        <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-3">
          {selectedBucket
            ? `Click all ${selectedBucket} values below`
            : "Select a type bucket above first"}
        </p>
        <div className="flex flex-wrap gap-2">
          {VALUES.map((chip) => {
            const isSorted = sorted[chip.id] !== undefined;
            const isWrong = wrongFlash === chip.id;
            const isCorrect = correctFlash === chip.id;
            const chipColor = TYPE_INFO[chip.source]?.color || P.violet;
            const chipBg = TYPE_INFO[chip.source]?.bg || "#f5f3ff";

            if (isSorted) {
              const sortedType = sorted[chip.id];
              const bk = TYPE_BUCKETS.find((b) => b.type === sortedType);
              return (
                <span key={chip.id} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold"
                  style={{
                    borderColor: `${bk.color}30`,
                    backgroundColor: bk.bg,
                    color: bk.color,
                    animation: isCorrect ? "ds1-celebrate 0.4s ease-out" : "none",
                  }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke={bk.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {chip.display}
                </span>
              );
            }

            return (
              <button
                key={chip.id}
                onClick={() => handleValueClick(chip)}
                disabled={!selectedBucket}
                className="rounded-lg border-2 px-3 py-1.5 font-mono text-xs font-semibold transition-all duration-200"
                style={{
                  borderColor: isWrong ? P.red : `${chipColor}30`,
                  backgroundColor: isWrong ? "#fef2f2" : "white",
                  color: isWrong ? P.red : P.ink,
                  animation: isWrong ? "ds1-shake 0.4s ease-out" : "none",
                  cursor: selectedBucket ? "pointer" : "not-allowed",
                  opacity: selectedBucket ? 1 : 0.5,
                }}
              >
                {chip.display}
                {isWrong && <span className="ml-1 text-[9px] text-red-400">-- try another bucket</span>}
              </button>
            );
          })}
        </div>
        <ConfettiBurst active={showConfetti} />
      </div>

      {/* Insight after sorting all */}
      {showInsight && (
        <InsightBox title="Why types matter">
          The data type determines what operations you can perform. You can calculate the <strong>average</strong> of salary (DECIMAL) or <strong>sort</strong> by id (INT), but you cannot compute an "average name" (TEXT). Mixing types causes errors. The type is a contract with the database.
        </InsightBox>
      )}

      {/* Mini challenge: Can you average text? */}
      {showMiniChallenge && (
        <div className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/60 to-indigo-50/40 p-5"
          style={{ animation: "ds1-up 0.4s ease-out" }}>
          <p className="text-sm font-semibold text-ink mb-3">
            Quick challenge: Can you calculate the average of these values?
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['"IT"', '"Marketing"', '"HR"', '"IT"', '"Marketing"'].map((v, i) => (
              <span key={i} className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 font-mono text-xs font-semibold text-teal-600">
                {v}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setMiniAnswer("yes")}
              disabled={miniAnswer !== null}
              className={`rounded-xl border-2 px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                miniAnswer === "yes"
                  ? "border-red-300 bg-red-50 text-red-600"
                  : miniAnswer !== null
                    ? "border-violet-100 bg-violet-50/30 text-violet-300"
                    : "border-violet-200 bg-white text-violet-700 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md"
              }`}
            >
              Yes, I can average them
            </button>
            <button
              onClick={() => setMiniAnswer("no")}
              disabled={miniAnswer !== null}
              className={`rounded-xl border-2 px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                miniAnswer === "no"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20 shadow-md"
                  : miniAnswer !== null
                    ? "border-violet-100 bg-violet-50/30 text-violet-300"
                    : "border-violet-200 bg-white text-violet-700 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md"
              }`}
            >
              No, these are TEXT
            </button>
          </div>
          {miniAnswer && (
            <div className={`mt-3 rounded-xl border p-3 ${
              miniAnswer === "no"
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/60"
            }`} style={{ animation: "ds1-up 0.3s ease-out" }}>
              <p className={`text-xs font-semibold ${miniAnswer === "no" ? "text-emerald-700" : "text-amber-700"}`}>
                {miniAnswer === "no"
                  ? "Exactly right! TEXT values have no numerical meaning -- you cannot sum or average them."
                  : 'Not quite. These are TEXT (string) values. "Average of IT and Marketing" has no meaning. Only numeric types support mathematical operations.'}
              </p>
            </div>
          )}
        </div>
      )}

      {miniAnswer === "no" && (
        <button
          onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ animation: "ds1-up 0.4s ease-out" }}
        >
          Next -- Outliers
        </button>
      )}
    </div>
  );
}


/* =======================================================================
   STEP 2 — "The Outlier Effect"
   Drag a slider to add an employee with a custom salary. Watch how
   mean moves dramatically while median barely shifts.
   ======================================================================= */
function OutlierEffect({ onComplete }) {
  const salaries = EMPLOYEE_DATA.map((e) => e.salary);
  const sorted = useMemo(() => [...salaries].sort((a, b) => a - b), []);

  const [extraSalary, setExtraSalary] = useState(null); // null = not added yet
  const [sliderValue, setSliderValue] = useState(6000);
  const [hasAdded, setHasAdded] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null); // "mean" or "median"
  const [showNullSection, setShowNullSection] = useState(false);
  const [nullAnswer, setNullAnswer] = useState(null); // "exclude" or "zero"
  const [complete, setComplete] = useState(false);

  const baseMean = useMemo(() => Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length), []);
  const baseMedian = useMemo(() => {
    const s = sorted;
    return s.length % 2 === 0 ? (s[s.length / 2 - 1] + s[s.length / 2]) / 2 : s[Math.floor(s.length / 2)];
  }, [sorted]);

  const currentSalaries = useMemo(() =>
    extraSalary !== null ? [...salaries, extraSalary] : salaries,
    [salaries, extraSalary]
  );
  const currentMean = useMemo(() =>
    Math.round(currentSalaries.reduce((a, b) => a + b, 0) / currentSalaries.length),
    [currentSalaries]
  );
  const currentMedian = useMemo(() => {
    const s = [...currentSalaries].sort((a, b) => a - b);
    return s.length % 2 === 0 ? (s[s.length / 2 - 1] + s[s.length / 2]) / 2 : s[Math.floor(s.length / 2)];
  }, [currentSalaries]);

  const minVal = 2000;
  const maxVal = 50000;
  const chartMin = Math.min(minVal, ...currentSalaries) - 500;
  const chartMax = Math.max(maxVal, ...currentSalaries) + 500;
  const toX = (val) => 40 + ((val - chartMin) / (chartMax - chartMin)) * 320;

  const handleAdd = () => {
    setExtraSalary(sliderValue);
    setHasAdded(true);
  };

  const meanDiff = Math.abs(currentMean - baseMean);
  const medianDiff = Math.abs(currentMedian - baseMedian);

  useEffect(() => {
    if (quizAnswer === "median" && !showNullSection) {
      setTimeout(() => setShowNullSection(true), 600);
    }
  }, [quizAnswer, showNullSection]);

  useEffect(() => {
    if (nullAnswer === "exclude" && !complete) {
      setComplete(true);
    }
  }, [nullAnswer, complete]);

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">The Outlier Effect</h2>
      <p className="text-base leading-relaxed text-graphite">
        You are about to hire employee #13. Use the slider to set their salary,
        then <strong className="text-violet-700">add them to the dataset</strong> and watch what happens to the statistics.
      </p>

      {/* Salary slider */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400">
            New Employee Salary
          </span>
          <span className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1 font-mono text-sm font-bold text-white shadow-sm">
            {sliderValue.toLocaleString()} PLN
          </span>
        </div>

        <div className="relative mt-3 mb-1">
          <input
            type="range"
            min={minVal}
            max={maxVal}
            step={100}
            value={sliderValue}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSliderValue(v);
              if (hasAdded) setExtraSalary(v);
            }}
            className="w-full h-2 appearance-none rounded-full bg-gradient-to-r from-teal-200 via-violet-200 to-red-200 cursor-pointer"
            style={{
              accentColor: sliderValue > 15000 ? P.red : sliderValue > 9000 ? P.orange : P.violet,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[9px] text-teal-500">{minVal.toLocaleString()}</span>
            <span className="font-mono text-[9px] text-violet-400">typical range</span>
            <span className="font-mono text-[9px] text-red-400">{maxVal.toLocaleString()}</span>
          </div>
        </div>

        {!hasAdded && (
          <button
            onClick={handleAdd}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Add to dataset
          </button>
        )}
        {hasAdded && (
          <p className="mt-2 text-center font-mono text-xs text-violet-400">
            Drag the slider to see the effect in real-time
          </p>
        )}
      </div>

      {/* Number line visualization */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">
          Salary Distribution
        </p>
        <svg viewBox="0 0 400 130" className="w-full">
          <defs>
            <linearGradient id="ds1-mean-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={P.orange} stopOpacity="0.9" />
              <stop offset="100%" stopColor={P.orange} stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="ds1-median-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={P.teal} stopOpacity="0.9" />
              <stop offset="100%" stopColor={P.teal} stopOpacity="0.3" />
            </linearGradient>
            <filter id="ds1-dot-glow">
              <feGaussianBlur stdDeviation="2" />
              <feFlood floodColor={P.violet} floodOpacity="0.3" />
              <feComposite in2="SourceGraphic" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="ds1-extra-glow">
              <feGaussianBlur stdDeviation="3" />
              <feFlood floodColor={sliderValue > 15000 ? P.red : P.emerald} floodOpacity="0.5" />
              <feComposite in2="SourceGraphic" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Number line */}
          <line x1="40" y1="75" x2="360" y2="75" stroke="#ddd6fe" strokeWidth="2" />

          {/* Tick marks */}
          {[4000, 6000, 8000, 10000, 20000, 30000, 40000, 50000].map((v) => {
            const x = toX(v);
            if (x < 40 || x > 360) return null;
            return (
              <g key={v}>
                <line x1={x} y1="72" x2={x} y2="78" stroke="#c4b5fd" strokeWidth="1" />
                <text x={x} y="90" textAnchor="middle" fill={P.pencil}
                  style={{ fontSize: 7, fontFamily: "IBM Plex Mono" }}>
                  {v >= 10000 ? `${v / 1000}k` : v}
                </text>
              </g>
            );
          })}

          {/* Data points */}
          {sorted.map((val, i) => (
            <circle key={i} cx={toX(val)} cy="75" r="5"
              fill={P.violet} opacity="0.55" filter="url(#ds1-dot-glow)"
              style={{ animation: `ds1-dot-enter 0.3s cubic-bezier(.34,1.56,.64,1) ${i * 50}ms both` }}>
              <title>{val.toLocaleString()} PLN</title>
            </circle>
          ))}

          {/* Extra employee dot */}
          {extraSalary !== null && (
            <g>
              <circle cx={toX(extraSalary)} cy="75" r="7"
                fill={extraSalary > 15000 ? P.red : P.emerald}
                filter="url(#ds1-extra-glow)"
                style={{ animation: "ds1-pop 0.3s cubic-bezier(.34,1.56,.64,1)" }}>
                <title>New: {extraSalary.toLocaleString()} PLN</title>
              </circle>
              <text x={toX(extraSalary)} y="62" textAnchor="middle"
                fill={extraSalary > 15000 ? P.red : P.emerald}
                style={{ fontSize: 8, fontFamily: "IBM Plex Mono", fontWeight: 700 }}>
                NEW
              </text>
            </g>
          )}

          {/* Mean line */}
          <line x1={toX(currentMean)} y1="25" x2={toX(currentMean)} y2="75"
            stroke="url(#ds1-mean-grad)" strokeWidth="2.5" strokeDasharray="4 2"
            style={{ transition: "all 0.3s ease-out" }} />
          <rect x={toX(currentMean) - 28} y="8" width="56" height="18" rx="4"
            fill={P.orange} opacity="0.9"
            style={{ transition: "all 0.3s ease-out" }} />
          <text x={toX(currentMean)} y="20" textAnchor="middle" fill="white"
            style={{ fontSize: 8, fontFamily: "IBM Plex Mono", fontWeight: 700, transition: "all 0.3s ease-out" }}>
            Mean: {currentMean.toLocaleString()}
          </text>

          {/* Median line */}
          <line x1={toX(currentMedian)} y1="38" x2={toX(currentMedian)} y2="75"
            stroke="url(#ds1-median-grad)" strokeWidth="2.5" strokeDasharray="4 2"
            style={{ transition: "all 0.3s ease-out" }} />
          <rect x={toX(currentMedian) - 32} y="28" width="64" height="14" rx="3"
            fill={P.teal} opacity="0.85"
            style={{ transition: "all 0.3s ease-out" }} />
          <text x={toX(currentMedian)} y="38" textAnchor="middle" fill="white"
            style={{ fontSize: 7, fontFamily: "IBM Plex Mono", fontWeight: 700, transition: "all 0.3s ease-out" }}>
            Median: {currentMedian.toLocaleString()}
          </text>

          {/* Legend */}
          <g transform="translate(40, 110)">
            <circle cx="0" cy="0" r="3" fill={P.violet} opacity="0.6" />
            <text x="8" y="3" fill={P.pencil} style={{ fontSize: 7, fontFamily: "IBM Plex Mono" }}>
              Existing ({salaries.length})
            </text>
            {extraSalary !== null && (
              <g transform="translate(90, 0)">
                <circle cx="0" cy="0" r="4" fill={extraSalary > 15000 ? P.red : P.emerald} />
                <text x="8" y="3" fill={P.pencil} style={{ fontSize: 7, fontFamily: "IBM Plex Mono" }}>
                  New employee
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Stats comparison */}
      {hasAdded && (
        <div className="grid grid-cols-2 gap-3" style={{ animation: "ds1-up 0.4s ease-out" }}>
          <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/40 p-4">
            <p className="font-sans text-xs font-bold uppercase text-orange-500">Mean Shift</p>
            <p className="font-mono text-2xl font-black text-orange-600">
              {meanDiff > 0 ? "+" : ""}{(currentMean - baseMean).toLocaleString()}
            </p>
            <p className="text-xs text-orange-400">{baseMean.toLocaleString()} {"\u2192"} {currentMean.toLocaleString()} PLN</p>
            <div className="mt-2 h-1.5 rounded-full bg-orange-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-300"
                style={{ width: `${Math.min((meanDiff / 3000) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50/40 p-4">
            <p className="font-sans text-xs font-bold uppercase text-teal-500">Median Shift</p>
            <p className="font-mono text-2xl font-black text-teal-600">
              {medianDiff > 0 ? "+" : ""}{(currentMedian - baseMedian).toLocaleString()}
            </p>
            <p className="text-xs text-teal-400">{baseMedian.toLocaleString()} {"\u2192"} {currentMedian.toLocaleString()} PLN</p>
            <div className="mt-2 h-1.5 rounded-full bg-teal-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min((medianDiff / 3000) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Robustness quiz -- only after adding */}
      {hasAdded && !quizAnswer && (
        <div className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/60 to-indigo-50/40 p-5"
          style={{ animation: "ds1-up 0.4s ease-out" }}>
          <p className="text-sm font-semibold text-ink mb-3">
            Based on what you just observed, which measure is more robust against outliers?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setQuizAnswer("mean")}
              className="flex-1 rounded-xl border-2 border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md"
            >
              Mean (average)
            </button>
            <button
              onClick={() => setQuizAnswer("median")}
              className="flex-1 rounded-xl border-2 border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-teal-600 transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md"
            >
              Median (middle)
            </button>
          </div>
        </div>
      )}

      {quizAnswer && (
        <div className={`rounded-xl border p-4 ${
          quizAnswer === "median"
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
            : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40"
        }`} style={{ animation: "ds1-up 0.3s ease-out" }}>
          <p className={`text-sm font-semibold ${quizAnswer === "median" ? "text-emerald-700" : "text-amber-700"}`}>
            {quizAnswer === "median"
              ? "Exactly! The median barely moves because it only cares about the middle position, not extreme values. The mean gets dragged toward outliers."
              : "Not quite. You saw that the mean shifted much more than the median. The mean is sensitive to extreme values -- the median is more robust."}
          </p>
          {quizAnswer !== "median" && (
            <button onClick={() => setQuizAnswer(null)}
              className="mt-2 text-xs font-semibold text-amber-600 underline">Try again</button>
          )}
        </div>
      )}

      {/* NULL section */}
      {showNullSection && (
        <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm"
          style={{ animation: "ds1-up 0.5s ease-out" }}>
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">
            Bonus: NULL Values
          </p>
          <p className="text-sm text-graphite mb-3">
            Two employees have missing salary data (NULL). Your current average is{" "}
            <strong className="text-violet-700">{currentMean.toLocaleString()} PLN</strong>.
            What happens if you treat NULLs as zero?
          </p>

          {/* Mini viz: two approaches */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setNullAnswer("zero")}
              disabled={nullAnswer !== null}
              className={`rounded-xl border-2 p-3 text-left transition-all duration-300 ${
                nullAnswer === "zero"
                  ? "border-red-300 bg-red-50"
                  : nullAnswer !== null
                    ? "border-violet-100 bg-violet-50/20 opacity-50"
                    : "border-violet-200 bg-white hover:border-violet-400 hover:shadow-md"
              }`}
            >
              <p className="font-mono text-xs font-bold text-violet-500">Include as 0</p>
              <p className="font-mono text-lg font-black mt-1" style={{ color: nullAnswer === "zero" ? P.red : P.ink }}>
                {Math.round(currentSalaries.concat([0, 0]).reduce((a, b) => a + b, 0) / (currentSalaries.length + 2)).toLocaleString()} PLN
              </p>
              <p className="text-xs text-graphite mt-1">Artificially deflates the mean</p>
            </button>
            <button
              onClick={() => setNullAnswer("exclude")}
              disabled={nullAnswer !== null}
              className={`rounded-xl border-2 p-3 text-left transition-all duration-300 ${
                nullAnswer === "exclude"
                  ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-400/20"
                  : nullAnswer !== null
                    ? "border-violet-100 bg-violet-50/20 opacity-50"
                    : "border-violet-200 bg-white hover:border-violet-400 hover:shadow-md"
              }`}
            >
              <p className="font-mono text-xs font-bold text-violet-500">Exclude NULLs</p>
              <p className="font-mono text-lg font-black mt-1" style={{ color: nullAnswer === "exclude" ? P.emerald : P.ink }}>
                {currentMean.toLocaleString()} PLN
              </p>
              <p className="text-xs text-graphite mt-1">Only average known values</p>
            </button>
          </div>

          {nullAnswer && (
            <div className={`rounded-xl border p-3 ${
              nullAnswer === "exclude"
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/60"
            }`} style={{ animation: "ds1-up 0.3s ease-out" }}>
              <p className={`text-xs font-semibold ${nullAnswer === "exclude" ? "text-emerald-700" : "text-amber-700"}`}>
                {nullAnswer === "exclude"
                  ? "Correct! NULL means 'unknown,' not zero. Excluding NULLs preserves the true average. Treating missing data as zero introduces bias and distorts your analysis."
                  : "Not ideal. NULL means the data is unknown -- it does NOT mean the employee earns zero. Treating it as zero artificially drags the mean down and gives misleading results."}
              </p>
              {nullAnswer !== "exclude" && (
                <button onClick={() => setNullAnswer(null)}
                  className="mt-2 text-xs font-semibold text-amber-600 underline">Try again</button>
              )}
            </div>
          )}
        </div>
      )}

      {complete && (
        <button
          onClick={onComplete}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ animation: "ds1-up 0.4s ease-out" }}
        >
          Next -- Summary Statistics
        </button>
      )}
    </div>
  );
}


/* =======================================================================
   STEP 3 — "Summary Statistics Dashboard"
   Student finds min, max, median, and predicts the mean by clicking.
   Each stat is discovered through interaction, not revealed passively.
   ======================================================================= */
function SummaryStatsDashboard({ onComplete }) {
  const salaries = EMPLOYEE_DATA.map((e) => e.salary);
  const sorted = useMemo(() => [...salaries].sort((a, b) => a - b), []);
  const realMin = Math.min(...salaries);
  const realMax = Math.max(...salaries);
  const realMedian = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  const realMean = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);

  // Phases: findMin -> findMax -> pickMedian -> guessMean -> complete
  const [phase, setPhase] = useState("findMin");
  const [foundMin, setFoundMin] = useState(null);
  const [foundMax, setFoundMax] = useState(null);
  const [medianChoice, setMedianChoice] = useState(null);
  const [meanGuess, setMeanGuess] = useState(6000);
  const [meanSubmitted, setMeanSubmitted] = useState(false);
  const [wrongClicks, setWrongClicks] = useState(new Set());
  const [showDashboard, setShowDashboard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSalaryClick = (val, idx) => {
    if (phase === "findMin") {
      if (val === realMin) {
        setFoundMin(val);
        setTimeout(() => setPhase("findMax"), 600);
      } else {
        setWrongClicks((prev) => new Set(prev).add(`min-${idx}`));
        setTimeout(() => {
          setWrongClicks((prev) => {
            const next = new Set(prev);
            next.delete(`min-${idx}`);
            return next;
          });
        }, 600);
      }
    } else if (phase === "findMax") {
      if (val === realMax) {
        setFoundMax(val);
        setTimeout(() => setPhase("pickMedian"), 600);
      } else {
        setWrongClicks((prev) => new Set(prev).add(`max-${idx}`));
        setTimeout(() => {
          setWrongClicks((prev) => {
            const next = new Set(prev);
            next.delete(`max-${idx}`);
            return next;
          });
        }, 600);
      }
    }
  };

  const handleMedianChoice = (choice) => {
    setMedianChoice(choice);
    if (choice === "median") {
      setTimeout(() => setPhase("guessMean"), 600);
    }
  };

  const handleMeanSubmit = () => {
    setMeanSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowDashboard(true);
      setPhase("complete");
    }, 800);
    setTimeout(() => setShowConfetti(false), 1200);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "findMin": return "Click the LOWEST salary value in the pile below";
      case "findMax": return "Now click the HIGHEST salary value";
      case "pickMedian": return "When values are sorted, the middle value is called the...";
      case "guessMean": return "Drag the pointer to where you think the MEAN (average) is";
      case "complete": return "All five summary statistics discovered!";
      default: return "";
    }
  };

  return (
    <div className="skill-theme-data space-y-5 animate-lesson-enter">
      <h2 className="text-xl font-bold text-ink">Summary Statistics Dashboard</h2>
      <p className="text-base leading-relaxed text-graphite">
        Before analyzing data, you need a quick overview. Discover the five key summary statistics
        <strong className="text-violet-700"> by finding them yourself</strong>.
      </p>

      {/* Phase indicator */}
      <div className="rounded-xl border border-violet-200/60 bg-gradient-to-r from-violet-50 via-fuchsia-50/30 to-violet-50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shadow-md shadow-violet-200">
            {phase === "findMin" ? 1 : phase === "findMax" ? 2 : phase === "pickMedian" ? 3 : phase === "guessMean" ? 4 : "!"}
          </span>
          <p className="text-sm font-semibold text-ink">{getPhaseInstruction()}</p>
        </div>
        <div className="mt-3 flex gap-1">
          {["findMin", "findMax", "pickMedian", "guessMean", "complete"].map((p, i) => (
            <div key={p} className="h-1.5 flex-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor:
                  (phase === "complete" || ["findMin", "findMax", "pickMedian", "guessMean", "complete"].indexOf(phase) > i)
                    ? P.violet : `${P.violet}20`,
              }} />
          ))}
        </div>
      </div>

      {/* Salary pile for min/max finding */}
      {(phase === "findMin" || phase === "findMax") && (
        <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm">
          <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-4">
            Salary Values (unsorted)
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {salaries.map((val, idx) => {
              const isMinFound = foundMin === val && phase !== "findMin";
              const isMaxFound = foundMax === val && phase !== "findMax";
              const isWrong = wrongClicks.has(`${phase === "findMin" ? "min" : "max"}-${idx}`);
              const justFoundMin = foundMin === val && idx === salaries.indexOf(val);
              const justFoundMax = foundMax === val && idx === salaries.indexOf(val);

              let bgColor = "white";
              let borderColor = `${P.violet}30`;
              let textColor = P.ink;

              if (justFoundMin) {
                bgColor = "#eff6ff"; borderColor = P.blue; textColor = P.blue;
              } else if (justFoundMax) {
                bgColor = "#fef2f2"; borderColor = "#f43f5e"; textColor = "#f43f5e";
              } else if (isWrong) {
                bgColor = "#fef2f2"; borderColor = P.red; textColor = P.red;
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSalaryClick(val, idx)}
                  disabled={justFoundMin || justFoundMax}
                  className="rounded-lg border-2 px-4 py-2.5 font-mono text-sm font-bold transition-all duration-200"
                  style={{
                    borderColor,
                    backgroundColor: bgColor,
                    color: textColor,
                    animation: isWrong ? "ds1-shake 0.4s ease-out" : (justFoundMin || justFoundMax) ? "ds1-celebrate 0.5s ease-out" : "none",
                    cursor: (justFoundMin || justFoundMax) ? "default" : "pointer",
                    opacity: (justFoundMin || justFoundMax) ? 1 : undefined,
                  }}
                >
                  {val.toLocaleString()}
                  {justFoundMin && <span className="ml-1 text-[9px] font-bold text-blue-400">MIN</span>}
                  {justFoundMax && <span className="ml-1 text-[9px] font-bold text-rose-400">MAX</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Found stats so far */}
      {(foundMin !== null || foundMax !== null) && phase !== "complete" && (
        <div className="flex gap-3">
          {foundMin !== null && (
            <div className="flex-1 rounded-xl border-2 border-blue-200 bg-blue-50/50 p-3 text-center"
              style={{ animation: "ds1-pop 0.3s cubic-bezier(.34,1.56,.64,1)" }}>
              <p className="font-sans text-[9px] font-bold uppercase text-blue-400">Minimum</p>
              <p className="font-mono text-xl font-black text-blue-600">{foundMin.toLocaleString()}</p>
              <p className="text-[9px] text-blue-400">PLN</p>
            </div>
          )}
          {foundMax !== null && (
            <div className="flex-1 rounded-xl border-2 border-rose-200 bg-rose-50/50 p-3 text-center"
              style={{ animation: "ds1-pop 0.3s cubic-bezier(.34,1.56,.64,1)" }}>
              <p className="font-sans text-[9px] font-bold uppercase text-rose-400">Maximum</p>
              <p className="font-mono text-xl font-black text-rose-600">{foundMax.toLocaleString()}</p>
              <p className="text-[9px] text-rose-400">PLN</p>
            </div>
          )}
        </div>
      )}

      {/* Median quiz */}
      {phase === "pickMedian" && (
        <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm"
          style={{ animation: "ds1-up 0.4s ease-out" }}>
          <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-3">
            Sorted salaries
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {sorted.map((val, i) => {
              const isMiddle = i === Math.floor(sorted.length / 2) - 1 || i === Math.floor(sorted.length / 2);
              return (
                <span key={i} className="rounded-md border px-2.5 py-1.5 font-mono text-xs font-semibold transition-all duration-300"
                  style={{
                    borderColor: isMiddle && medianChoice === "median" ? P.teal : `${P.violet}20`,
                    backgroundColor: isMiddle && medianChoice === "median" ? "#f0fdfa" : "white",
                    color: isMiddle && medianChoice === "median" ? P.teal : P.ink,
                    animation: `ds1-slide-in 0.3s ease-out ${i * 40}ms both`,
                  }}>
                  {val.toLocaleString()}
                </span>
              );
            })}
          </div>
          <p className="text-sm font-semibold text-ink mb-3">The middle value of a sorted dataset is called the...</p>
          <div className="flex gap-3">
            {[
              { key: "mean", label: "Mean" },
              { key: "median", label: "Median" },
              { key: "mode", label: "Mode" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleMedianChoice(opt.key)}
                disabled={medianChoice !== null}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  medianChoice === opt.key && opt.key === "median"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400/20 shadow-md"
                    : medianChoice === opt.key && opt.key !== "median"
                      ? "border-red-300 bg-red-50 text-red-600"
                      : medianChoice !== null
                        ? "border-violet-100 bg-violet-50/20 text-violet-300"
                        : "border-violet-200 bg-white text-violet-700 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {medianChoice && medianChoice !== "median" && (
            <p className="mt-2 text-xs text-amber-600 font-semibold" style={{ animation: "ds1-up 0.2s ease-out" }}>
              {medianChoice === "mean" ? "The mean is the average (sum / count). The middle of a sorted list is the median." : "The mode is the most frequent value. The middle of a sorted list is the median."}
              <button onClick={() => setMedianChoice(null)} className="ml-2 underline">Try again</button>
            </p>
          )}
          {medianChoice === "median" && (
            <p className="mt-2 text-xs text-emerald-600 font-semibold" style={{ animation: "ds1-up 0.2s ease-out" }}>
              Correct! The median is {realMedian.toLocaleString()} PLN -- the value right in the middle when sorted.
            </p>
          )}
        </div>
      )}

      {/* Mean guessing game */}
      {phase === "guessMean" && (
        <div className="rounded-xl border border-violet-200/60 bg-white p-5 shadow-sm"
          style={{ animation: "ds1-up 0.4s ease-out" }}>
          <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-2">
            Find the Mean
          </p>
          <p className="text-sm text-graphite mb-4">
            The mean is the balance point of all values. Drag the pointer to where you think it falls.
          </p>

          {/* Balance beam visualization */}
          <svg viewBox="0 0 400 100" className="w-full mb-4">
            <defs>
              <linearGradient id="ds1-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={P.violet} stopOpacity="0.15" />
                <stop offset="50%" stopColor={P.violet} stopOpacity="0.3" />
                <stop offset="100%" stopColor={P.violet} stopOpacity="0.15" />
              </linearGradient>
              <filter id="ds1-pointer-glow">
                <feGaussianBlur stdDeviation="2" />
                <feFlood floodColor={P.orange} floodOpacity="0.4" />
                <feComposite in2="SourceGraphic" operator="in" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Beam */}
            <rect x="30" y="55" width="340" height="4" rx="2" fill="url(#ds1-beam-grad)" />

            {/* Salary dots */}
            {sorted.map((val, i) => {
              const x = 30 + ((val - realMin) / (realMax - realMin)) * 340;
              return (
                <circle key={i} cx={x} cy="57" r="5" fill={P.violet} opacity="0.5" />
              );
            })}

            {/* User's guess pointer */}
            {(() => {
              const gx = 30 + ((meanGuess - realMin) / (realMax - realMin)) * 340;
              return (
                <g>
                  <polygon points={`${gx},45 ${gx - 6},30 ${gx + 6},30`}
                    fill={P.orange} filter="url(#ds1-pointer-glow)"
                    style={{ transition: "all 0.15s ease-out" }} />
                  <text x={gx} y="22" textAnchor="middle" fill={P.orange}
                    style={{ fontSize: 9, fontFamily: "IBM Plex Mono", fontWeight: 700, transition: "all 0.15s ease-out" }}>
                    {meanGuess.toLocaleString()}
                  </text>
                </g>
              );
            })()}

            {/* Revealed mean (only after submit) */}
            {meanSubmitted && (() => {
              const mx = 30 + ((realMean - realMin) / (realMax - realMin)) * 340;
              return (
                <g style={{ animation: "ds1-pop 0.4s cubic-bezier(.34,1.56,.64,1)" }}>
                  <polygon points={`${mx},70 ${mx - 6},85 ${mx + 6},85`}
                    fill={P.teal} />
                  <text x={mx} y="95" textAnchor="middle" fill={P.teal}
                    style={{ fontSize: 9, fontFamily: "IBM Plex Mono", fontWeight: 700 }}>
                    Actual: {realMean.toLocaleString()}
                  </text>
                </g>
              );
            })()}

            {/* Min/Max labels */}
            <text x="30" y="75" textAnchor="middle" fill={P.pencil}
              style={{ fontSize: 7, fontFamily: "IBM Plex Mono" }}>{realMin.toLocaleString()}</text>
            <text x="370" y="75" textAnchor="middle" fill={P.pencil}
              style={{ fontSize: 7, fontFamily: "IBM Plex Mono" }}>{realMax.toLocaleString()}</text>
          </svg>

          <input
            type="range"
            min={realMin}
            max={realMax}
            step={50}
            value={meanGuess}
            onChange={(e) => !meanSubmitted && setMeanGuess(Number(e.target.value))}
            disabled={meanSubmitted}
            className="w-full h-2 appearance-none rounded-full bg-gradient-to-r from-violet-200 to-orange-200 cursor-pointer mb-3"
            style={{ accentColor: P.orange }}
          />

          {!meanSubmitted && (
            <button
              onClick={handleMeanSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Lock in my guess: {meanGuess.toLocaleString()} PLN
            </button>
          )}

          {meanSubmitted && (
            <div className={`rounded-xl border p-4 ${
              Math.abs(meanGuess - realMean) < 300
                ? "border-emerald-200 bg-emerald-50/60"
                : Math.abs(meanGuess - realMean) < 800
                  ? "border-amber-200 bg-amber-50/60"
                  : "border-violet-200 bg-violet-50/60"
            }`} style={{ animation: "ds1-up 0.3s ease-out" }}>
              <p className="text-sm font-semibold" style={{
                color: Math.abs(meanGuess - realMean) < 300 ? P.emerald
                  : Math.abs(meanGuess - realMean) < 800 ? "#d97706" : P.violet
              }}>
                {Math.abs(meanGuess - realMean) < 300
                  ? `Impressive! You were only ${Math.abs(meanGuess - realMean).toLocaleString()} PLN off. The actual mean is ${realMean.toLocaleString()} PLN.`
                  : Math.abs(meanGuess - realMean) < 800
                    ? `Close! You guessed ${meanGuess.toLocaleString()} PLN -- the actual mean is ${realMean.toLocaleString()} PLN (off by ${Math.abs(meanGuess - realMean).toLocaleString()}).`
                    : `The actual mean is ${realMean.toLocaleString()} PLN. You were off by ${Math.abs(meanGuess - realMean).toLocaleString()} PLN. The mean is the "balance point" -- pulled toward clusters of values.`}
              </p>
            </div>
          )}

          <ConfettiBurst active={showConfetti} />
        </div>
      )}

      {/* Final summary dashboard */}
      {showDashboard && (
        <div className="space-y-4" style={{ animation: "ds1-up 0.5s ease-out" }}>
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-violet-400">
            Complete Dashboard
          </p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Count", value: salaries.length, unit: "records", color: "#6366f1", icon: "#" },
              { label: "Min", value: realMin, unit: "PLN", color: "#3b82f6", icon: "\u2193" },
              { label: "Median", value: realMedian, unit: "PLN", color: "#14b8a6", icon: "M" },
              { label: "Mean", value: realMean, unit: "PLN", color: "#f97316", icon: "x\u0304" },
              { label: "Max", value: realMax, unit: "PLN", color: "#f43f5e", icon: "\u2191" },
            ].map((s, i) => (
              <div key={s.label} className="rounded-xl border bg-white p-3 text-center shadow-sm"
                style={{
                  borderColor: `${s.color}30`,
                  animation: `ds1-pop 0.4s cubic-bezier(.34,1.56,.64,1) ${i * 100}ms both`,
                }}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white mx-auto mb-1"
                  style={{ backgroundColor: s.color }}>{s.icon}</span>
                <p className="font-sans text-[8px] font-bold uppercase tracking-wider" style={{ color: `${s.color}90` }}>{s.label}</p>
                <p className="text-base font-bold" style={{ color: s.color }}>{s.value.toLocaleString()}</p>
                <p className="text-[8px] text-graphite">{s.unit}</p>
              </div>
            ))}
          </div>

          {/* Distribution with all markers */}
          <div className="rounded-xl border border-violet-200/60 bg-white p-4 shadow-sm">
            <svg viewBox="0 0 400 80" className="w-full">
              <defs>
                <linearGradient id="ds1-final-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={P.blue} stopOpacity="0.5" />
                  <stop offset="50%" stopColor={P.violet} stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <line x1="20" y1="45" x2="380" y2="45" stroke="url(#ds1-final-line)" strokeWidth="3" />
              {/* Dots */}
              {sorted.map((val, i) => {
                const x = 20 + ((val - realMin) / (realMax - realMin)) * 360;
                return <circle key={i} cx={x} cy="45" r="5" fill={P.violet} opacity="0.5"
                  style={{ animation: `ds1-dot-enter 0.3s ease-out ${i * 40}ms both` }} />;
              })}
              {/* Min marker */}
              <line x1="20" y1="38" x2="20" y2="52" stroke={P.blue} strokeWidth="2" />
              <text x="20" y="65" textAnchor="middle" fill={P.blue}
                style={{ fontSize: 7, fontFamily: "IBM Plex Mono", fontWeight: 600 }}>
                {realMin.toLocaleString()}
              </text>
              {/* Max marker */}
              <line x1="380" y1="38" x2="380" y2="52" stroke="#f43f5e" strokeWidth="2" />
              <text x="380" y="65" textAnchor="middle" fill="#f43f5e"
                style={{ fontSize: 7, fontFamily: "IBM Plex Mono", fontWeight: 600 }}>
                {realMax.toLocaleString()}
              </text>
              {/* Median */}
              {(() => {
                const x = 20 + ((realMedian - realMin) / (realMax - realMin)) * 360;
                return (
                  <g>
                    <line x1={x} y1="20" x2={x} y2="45" stroke={P.teal} strokeWidth="2" strokeDasharray="3 2" />
                    <text x={x} y="14" textAnchor="middle" fill={P.teal}
                      style={{ fontSize: 7, fontFamily: "IBM Plex Mono", fontWeight: 700 }}>
                      Md: {realMedian.toLocaleString()}
                    </text>
                  </g>
                );
              })()}
              {/* Mean */}
              {(() => {
                const x = 20 + ((realMean - realMin) / (realMax - realMin)) * 360;
                return (
                  <g>
                    <line x1={x} y1="28" x2={x} y2="45" stroke={P.orange} strokeWidth="2" strokeDasharray="3 2" />
                    <text x={x} y="22" textAnchor="middle" fill={P.orange}
                      style={{ fontSize: 7, fontFamily: "IBM Plex Mono", fontWeight: 700 }}>
                      x\u0304: {realMean.toLocaleString()}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <button
            onClick={onComplete}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Let's practice
          </button>
        </div>
      )}
    </div>
  );
}


/* =======================================================================
   MAIN LESSON COMPONENT
   4 Learn + 2 Apply + 1 Challenge
   ======================================================================= */
export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  /* ── Learn Phase ─────────────────────────────────────────────────── */
  if (currentPhase === "learn") {
    if (currentStep === 0) return <BuildDataset onComplete={onComplete} />;
    if (currentStep === 1) return <DataTypesLab onComplete={onComplete} />;
    if (currentStep === 2) return <OutlierEffect onComplete={onComplete} />;
    if (currentStep === 3) return <SummaryStatsDashboard onComplete={onComplete} />;
  }

  /* ── Apply Phase ─────────────────────────────────────────────────── */
  if (currentPhase === "apply") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Spot the Pattern</h2>
          <Quiz
            data={{
              question: "What does a missing value (NULL/N/A) in a salary column indicate?",
              options: [
                "The employee earns zero",
                "The data was not collected or recorded for this employee",
                "The employee was fired",
                "The salary is confidential and stored elsewhere",
              ],
              correctIndex: 1,
              explanation:
                "A missing value means the data was not collected, not entered, or was lost during processing. It does NOT mean zero -- that is a common mistake. The absence of data is different from a data value of zero.",
            }}
            onComplete={onComplete}
          />
        </div>
      );
    if (currentStep === 1)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Filter the Data</h2>
          <p className="text-base text-graphite leading-relaxed">
            Use the filters to explore the dataset and answer the question.
          </p>
          <DataFilterPuzzle
            data={{
              rows: EMPLOYEE_DATA,
              columns: ["id", "name", "department", "salary", "hireDate", "city"],
              question: "How many employees are in the IT department?",
              options: ["3", "4", "5", "6"],
              correctIndex: 2,
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  /* ── Challenge Phase ─────────────────────────────────────────────── */
  if (currentPhase === "challenge") {
    if (currentStep === 0)
      return (
        <div className="skill-theme-data space-y-6 animate-lesson-enter">
          <h2 className="text-xl font-bold text-ink">Data Challenge</h2>
          <p className="text-base text-graphite leading-relaxed">
            This one requires filtering AND mental calculation. Take your time.
          </p>
          <DataFilterPuzzle
            data={{
              rows: EMPLOYEE_DATA,
              columns: ["id", "name", "department", "salary", "hireDate", "city"],
              question: "What is the average salary of employees hired after 2022-01-01? (Filter first, then calculate the mean of matching salaries.)",
              options: ["4,833 PLN", "5,175 PLN", "4,925 PLN", "5,500 PLN"],
              correctIndex: 0,
            }}
            onComplete={onComplete}
          />
        </div>
      );
  }

  return null;
}
