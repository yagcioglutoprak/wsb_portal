import React, { useState, useEffect, useRef } from 'react';
import { sounds } from "../../hooks/useSound";

// Icon for completed steps
const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Scene 1: More than a spreadsheet
const Scene1 = ({ onComplete }) => {
  const [found, setFound] = useState({
    merged: false,
    mixed: false,
    duplicate: false,
    missing: false,
  });

  const [activeTooltip, setActiveTooltip] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const checkCompletion = (newFound) => {
    if (Object.values(newFound).every(Boolean)) {
      sounds.correct();
      timerRef.current = setTimeout(onComplete, 1000);
    }
  };

  const handleFind = (key, tooltipText) => {
    if (!found[key]) {
      sounds.pop();
      const newFound = { ...found, [key]: true };
      setFound(newFound);
      setActiveTooltip(tooltipText);
      checkCompletion(newFound);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
      <div className="mb-8 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">More than a spreadsheet</h2>
        <p className="text-lg text-graphite">
          You've used spreadsheets. A database is like a spreadsheet with superpowers — it can handle millions of rows, let hundreds of people use it at once, and never lose data.
        </p>
        <p className="text-sm text-rust font-semibold mt-4">Find 4 common spreadsheet problems on the left.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Messy Spreadsheet */}
        <div className="flex-1 bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm relative">
          <h3 className="font-bold mb-4 text-center">Messy Spreadsheet</h3>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-paper border-b border-ink/10">
                <th className="p-2 text-left text-sm font-semibold text-ink/70">ID</th>
                <th className="p-2 text-left text-sm font-semibold text-ink/70">Name</th>
                <th className="p-2 text-left text-sm font-semibold text-ink/70">Score</th>
                <th className="p-2 text-left text-sm font-semibold text-ink/70">Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Mixed data types */}
              <tr className="border-b border-ink/5 relative group cursor-pointer" onClick={() => handleFind('mixed', 'Databases enforce data types — a number column only allows numbers.')}>
                <td className="p-2 text-sm">1</td>
                <td className="p-2 text-sm">Jan Kowalski</td>
                <td className={`p-2 text-sm transition-colors duration-300 ${found.mixed ? 'bg-error/20 border-error border' : 'group-hover:bg-error/10'}`}>
                  "eighty" <span className="text-xs text-error ml-1 block">mixed type</span>
                </td>
                <td className="p-2 text-sm">2026-01-01</td>
              </tr>
              {/* Missing value */}
              <tr className="border-b border-ink/5 relative group cursor-pointer" onClick={() => handleFind('missing', 'Databases can require columns to always have a value (NOT NULL).')}>
                <td className="p-2 text-sm">2</td>
                <td className="p-2 text-sm">Anna Nowak</td>
                <td className="p-2 text-sm">95</td>
                <td className={`p-2 text-sm transition-colors duration-300 ${found.missing ? 'bg-error/20 border-error border' : 'group-hover:bg-error/10'}`}>
                  <span className="text-xs text-error italic">empty</span>
                </td>
              </tr>
              {/* Duplicate row */}
              <tr className="border-b border-ink/5 relative group cursor-pointer" onClick={() => handleFind('duplicate', 'Databases use Primary Keys to ensure every row is unique.')}>
                <td className={`p-2 text-sm transition-colors duration-300 ${found.duplicate ? 'bg-error/20 border-error border-l border-t border-b' : 'group-hover:bg-error/10'}`}>2</td>
                <td className={`p-2 text-sm transition-colors duration-300 ${found.duplicate ? 'bg-error/20 border-error border-t border-b' : 'group-hover:bg-error/10'}`}>Anna Nowak</td>
                <td className={`p-2 text-sm transition-colors duration-300 ${found.duplicate ? 'bg-error/20 border-error border-t border-b' : 'group-hover:bg-error/10'}`}>95</td>
                <td className={`p-2 text-sm transition-colors duration-300 ${found.duplicate ? 'bg-error/20 border-error border-r border-t border-b' : 'group-hover:bg-error/10'}`}>2026-01-02</td>
              </tr>
              {/* Merged cell (fake merged visual) */}
              <tr className="relative group cursor-pointer" onClick={() => handleFind('merged', 'Databases keep data structured. No merged cells allowed!')}>
                <td className="p-2 text-sm">4</td>
                <td colSpan="3" className={`p-2 text-sm text-center bg-paper transition-colors duration-300 ${found.merged ? 'bg-error/20 border-error border' : 'group-hover:bg-error/10'}`}>
                  Merged Project Team Data
                </td>
              </tr>
            </tbody>
          </table>

          {/* Tooltip Overlay */}
          {activeTooltip && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap z-10 animate-lesson-enter">
              {activeTooltip}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-ink rotate-45"></div>
            </div>
          )}
        </div>

        {/* Clean Database Table */}
        <div className="flex-1 bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-success/30 shadow-sm opacity-90">
          <h3 className="font-bold mb-4 text-center flex items-center justify-center gap-2 text-success">
            <CheckIcon className="w-5 h-5" /> Clean Database Table
          </h3>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-success/5 border-b border-success/20">
                <th className="p-2 text-left text-xs font-mono font-bold text-success">id (INT)</th>
                <th className="p-2 text-left text-xs font-mono font-bold text-success">name (VARCHAR)</th>
                <th className="p-2 text-left text-xs font-mono font-bold text-success">score (INT)</th>
                <th className="p-2 text-left text-xs font-mono font-bold text-success">date (DATE)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/5">
                <td className="p-2 text-sm font-mono">1</td>
                <td className="p-2 text-sm">Jan Kowalski</td>
                <td className="p-2 text-sm font-mono text-rust">80</td>
                <td className="p-2 text-sm font-mono text-ink/70">2026-01-01</td>
              </tr>
              <tr className="border-b border-ink/5">
                <td className="p-2 text-sm font-mono">2</td>
                <td className="p-2 text-sm">Anna Nowak</td>
                <td className="p-2 text-sm font-mono text-rust">95</td>
                <td className="p-2 text-sm font-mono text-ink/70">2026-01-02</td>
              </tr>
              <tr className="border-b border-ink/5">
                <td className="p-2 text-sm font-mono">3</td>
                <td className="p-2 text-sm">Michal Wisniewski</td>
                <td className="p-2 text-sm font-mono text-rust">88</td>
                <td className="p-2 text-sm font-mono text-ink/70">2026-01-03</td>
              </tr>
              <tr>
                <td className="p-2 text-sm font-mono">4</td>
                <td className="p-2 text-sm">Piotr Zielinski</td>
                <td className="p-2 text-sm font-mono text-rust">92</td>
                <td className="p-2 text-sm font-mono text-ink/70">2026-01-03</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Scene 2: Anatomy of a table
const Scene2 = ({ onComplete }) => {
  const [explored, setExplored] = useState({
    column: false,
    row: false,
    cell: false,
    primaryKey: false,
  });

  const [hoverLabel, setHoverLabel] = useState(null);
  const [exploredRowIdx, setExploredRowIdx] = useState(null);
  const [exploredCellIdx, setExploredCellIdx] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const checkCompletion = (newExplored) => {
    if (Object.values(newExplored).every(Boolean)) {
      sounds.correct();
      timerRef.current = setTimeout(onComplete, 1000);
    }
  };

  const handleExplore = (key, label, idx) => {
    if (!explored[key]) {
      sounds.pop();
      const newExplored = { ...explored, [key]: true };
      setExplored(newExplored);
      if (key === 'row') setExploredRowIdx(idx);
      if (key === 'cell') setExploredCellIdx(idx);
      checkCompletion(newExplored);
    }
    setHoverLabel(label);
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
      <div className="mb-8 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Anatomy of a table</h2>
        <p className="text-lg text-graphite">
          A database table has rows (records) and columns (fields). Each column has a name and a data type. Each row is one entry.
        </p>
        <p className="text-sm text-rust font-semibold mt-4">Hover over different parts of the table to explore.</p>
      </div>

      <div className="w-full bg-[#fdfcfa] p-8 rounded-xl border-[1.5px] border-ink/12 shadow-sm relative">
        <div className="h-8 mb-4 flex items-center justify-center">
          {hoverLabel ? (
            <div className="px-4 py-2 bg-rust text-white text-sm font-semibold rounded-lg animate-lesson-enter">
              {hoverLabel}
            </div>
          ) : (
            <div className="px-4 py-2 text-ink/40 text-sm font-medium italic">
              Explore the table below
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse" onMouseLeave={() => setHoverLabel(null)}>
            <thead>
              <tr className="bg-paper">
                <th 
                  className={`p-3 text-left border-b-2 border-ink/20 transition-colors duration-200 cursor-pointer ${explored.primaryKey ? 'bg-success/10' : 'hover:bg-rust/10'}`}
                  onMouseEnter={() => handleExplore('primaryKey', 'This is the primary key. Every row has a unique ID.')}
                >
                  <div className="font-mono text-sm font-bold text-ink flex items-center gap-1">
                    <span className="text-rust">🔑 id</span>
                  </div>
                  <div className="font-mono text-xs text-ink/50">INT</div>
                </th>
                <th 
                  className={`p-3 text-left border-b-2 border-ink/20 transition-colors duration-200 cursor-pointer ${explored.column ? 'bg-success/10' : 'hover:bg-rust/10'}`}
                  onMouseEnter={() => handleExplore('column', 'This is a column (field). It has a name and a type.')}
                >
                  <div className="font-mono text-sm font-bold text-ink">name</div>
                  <div className="font-mono text-xs text-ink/50">VARCHAR</div>
                </th>
                <th
                  className={`p-3 text-left border-b-2 border-ink/20 transition-colors duration-200 cursor-pointer ${explored.column ? 'bg-success/10' : 'hover:bg-rust/10'}`}
                  onMouseEnter={() => handleExplore('column', 'This is a column (field). It has a name and a type.')}
                >
                  <div className="font-mono text-sm font-bold text-ink">email</div>
                  <div className="font-mono text-xs text-ink/50">VARCHAR</div>
                </th>
                <th
                  className={`p-3 text-left border-b-2 border-ink/20 transition-colors duration-200 cursor-pointer ${explored.column ? 'bg-success/10' : 'hover:bg-rust/10'}`}
                  onMouseEnter={() => handleExplore('column', 'This is a column (field). It has a name and a type.')}
                >
                  <div className="font-mono text-sm font-bold text-ink">gpa</div>
                  <div className="font-mono text-xs text-ink/50">FLOAT</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'Jan Kowalski', email: 'jan@merito.pl', gpa: '4.5' },
                { id: 2, name: 'Anna Nowak', email: 'anna@merito.pl', gpa: '5.0' },
                { id: 3, name: 'Piotr Wisniewski', email: 'piotr@merito.pl', gpa: '3.8' },
                { id: 4, name: 'Kasia Zielinska', email: 'kasia@merito.pl', gpa: '4.2' },
                { id: 5, name: 'Michal Kaminski', email: 'michal@merito.pl', gpa: '4.0' },
              ].map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-ink/5 transition-colors duration-200 cursor-pointer ${explored.row && idx === exploredRowIdx ? 'bg-success/5' : 'hover:bg-rust/5'}`}
                  onMouseEnter={() => handleExplore('row', 'This is a row (record). It represents one student.', idx)}
                >
                  <td className="p-3 font-mono text-sm">{row.id}</td>
                  <td
                    className={`p-3 text-sm transition-colors duration-200 ${explored.cell && idx === exploredCellIdx ? 'bg-success/20 font-bold' : 'hover:bg-rust/20'}`}
                    onMouseEnter={(e) => { e.stopPropagation(); handleExplore('cell', 'This is a cell. It holds one value.', idx); }}
                  >
                    {row.name}
                  </td>
                  <td className="p-3 text-sm">{row.email}</td>
                  <td className="p-3 text-sm font-mono text-rust">{row.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Progress indicators */}
        <div className="mt-6 flex justify-center gap-4">
          {Object.entries(explored).map(([key, isDone]) => (
            <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${isDone ? 'bg-success/10 text-success' : 'bg-ink/5 text-ink/40'}`}>
              {isDone && <CheckIcon className="w-3.5 h-3.5" />}
              {key === 'primaryKey' ? 'Primary Key' : key.charAt(0).toUpperCase() + key.slice(1)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Scene 3: Data types matter
const Scene3 = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    id: "abc",
    name: "12345",
    email: "kasia@merito.pl",
    gpa: "excellent"
  });

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const shakeTimerRef = useRef(null);
  const completeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!/^\d+$/.test(formData.id)) newErrors.id = "Expected INT, got TEXT.";
    if (/^\d+(\.\d+)?$/.test(formData.name)) newErrors.name = "Expected VARCHAR, got NUMERIC.";
    if (!/^\d+(\.\d+)?$/.test(formData.gpa)) newErrors.gpa = "Expected FLOAT, got TEXT.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      shakeTimerRef.current = setTimeout(() => setShake(false), 500);
      return false;
    }
    return true;
  };

  const handleInsert = () => {
    if (validate()) {
      sounds.correct();
      setSuccess(true);
      completeTimerRef.current = setTimeout(onComplete, 2000);
    } else {
      sounds.wrong();
    }
  };

  const fixOptions = {
    id: ["abc", "6", "xyz"],
    name: ["12345", "Katarzyna Lewandowska", "true"],
    gpa: ["excellent", "4.8", "A+"]
  };

  const handleFix = (field, value) => {
    sounds.pop();
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowOptions(null);
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto w-full">
      <div className="mb-8 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Data types matter</h2>
        <p className="text-lg text-graphite">
          Every column has a data type that controls what values it can hold. Try to put the wrong type in — the database won't let you.
        </p>
      </div>

      <div className="w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4 text-ink font-bold font-sans text-sm">
          <svg className="w-5 h-5 text-rust" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          students table
        </div>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-paper border-b border-ink/10">
              <th className="p-2 text-left text-xs font-mono font-bold text-ink/70">id (INT)</th>
              <th className="p-2 text-left text-xs font-mono font-bold text-ink/70">name (VARCHAR)</th>
              <th className="p-2 text-left text-xs font-mono font-bold text-ink/70">email (VARCHAR)</th>
              <th className="p-2 text-left text-xs font-mono font-bold text-ink/70">gpa (FLOAT)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink/5">
              <td className="p-2 text-sm font-mono">1</td>
              <td className="p-2 text-sm">Jan Kowalski</td>
              <td className="p-2 text-sm">jan@merito.pl</td>
              <td className="p-2 text-sm font-mono text-rust">4.5</td>
            </tr>
            <tr className="border-b border-ink/5">
              <td className="p-2 text-sm font-mono">2</td>
              <td className="p-2 text-sm">Anna Nowak</td>
              <td className="p-2 text-sm">anna@merito.pl</td>
              <td className="p-2 text-sm font-mono text-rust">5.0</td>
            </tr>
            {success && (
              <tr className="bg-success/10 animate-lesson-enter">
                <td className="p-2 text-sm font-mono font-bold text-success">{formData.id}</td>
                <td className="p-2 text-sm font-bold text-success">{formData.name}</td>
                <td className="p-2 text-sm font-bold text-success">{formData.email}</td>
                <td className="p-2 text-sm font-mono font-bold text-success">{formData.gpa}</td>
              </tr>
            )}
          </tbody>
        </table>

        {!success && (
          <div className={`mt-6 p-4 bg-paper rounded-lg border-2 border-dashed ${shake ? 'border-error animate-shake' : 'border-ink/20'}`}>
            <h4 className="font-bold text-sm mb-3">Add Row</h4>
            <div className="grid grid-cols-4 gap-4 items-start">
              {['id', 'name', 'email', 'gpa'].map((field) => (
                <div key={field} className="relative">
                  <label className="block text-xs font-sans font-bold text-ink/60 mb-1">{field}</label>
                  <div 
                    className={`w-full p-2 text-sm bg-[#fdfcfa] border-[1.5px] rounded-lg cursor-pointer ${errors[field] ? 'border-error text-error bg-error/5' : 'border-ink/20 hover:border-rust/50'} ${field === 'email' ? 'pointer-events-none bg-ink/5' : ''}`}
                    onClick={() => field !== 'email' && setShowOptions(field)}
                  >
                    {formData[field]}
                  </div>
                  {errors[field] && (
                     <div className="absolute top-full left-0 mt-1 text-xs text-error font-bold w-[120%] z-10 bg-[#fdfcfa] p-1 rounded shadow-sm border border-error/20">
                       {errors[field]}
                     </div>
                  )}
                  {showOptions === field && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-[#fdfcfa] border border-ink/20 rounded-lg shadow-xl z-20 overflow-hidden">
                      {fixOptions[field].map((opt) => (
                        <div 
                          key={opt} 
                          className="px-3 py-2 text-sm hover:bg-rust hover:text-white cursor-pointer transition-colors"
                          onClick={() => handleFix(field, opt)}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleInsert}
                className="bg-rust text-white rounded-xl px-6 py-2.5 font-sans text-sm font-bold hover:bg-rust/90 flex items-center gap-2"
              >
                Insert <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
            <CheckIcon className="w-6 h-6" />
            <span className="font-bold">Row successfully inserted! The database verified all data types.</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Scene 4: Primary keys and uniqueness
const Scene4 = ({ onComplete }) => {
  const [attempted, setAttempted] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [quizPhase, setQuizPhase] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const quizTimerRef = useRef(null);
  const completeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (quizTimerRef.current) clearTimeout(quizTimerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  const handleInsert = () => {
    sounds.wrong();
    setAttempted(true);
  };

  const handleFixOption = (option) => {
    if (option === 'change_id') {
      sounds.correct();
      setFixed(true);
      quizTimerRef.current = setTimeout(() => setQuizPhase(true), 1500);
    }
  };

  const handleQuizAnswer = (answer) => {
    if (answer === 'id') {
      sounds.correct();
      setQuizDone(true);
      completeTimerRef.current = setTimeout(onComplete, 1500);
    } else {
      sounds.wrong();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto w-full">
      <div className="mb-8 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Primary keys and uniqueness</h2>
        <p className="text-lg text-graphite">
          A primary key is a column where every value must be unique. It's how the database identifies each row — like a student ID number.
        </p>
      </div>

      {!quizPhase ? (
        <div className="w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm mb-6 relative overflow-hidden">
          <table className="w-full border-collapse mb-4 relative z-10">
            <thead>
              <tr className="bg-paper border-b border-ink/10">
                <th className="p-2 text-left text-xs font-mono font-bold text-ink/70">id (🔑 PK)</th>
                <th className="p-2 text-left text-xs font-mono font-bold text-ink/70">name</th>
                <th className="p-2 text-left text-xs font-mono font-bold text-ink/70">email</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((id) => (
                <tr key={id} className="border-b border-ink/5">
                  <td className="p-2 text-sm font-mono font-bold">{id}</td>
                  <td className="p-2 text-sm">Student {id}</td>
                  <td className="p-2 text-sm">s{id}@merito.pl</td>
                </tr>
              ))}
              <tr className={`border-b border-ink/5 transition-colors duration-300 ${attempted && !fixed ? 'bg-error/20 border-error border-l border-r border-t' : ''}`}>
                <td className="p-2 text-sm font-mono font-bold">3</td>
                <td className="p-2 text-sm">Student 3</td>
                <td className="p-2 text-sm">s3@merito.pl</td>
              </tr>
              {attempted && !fixed && (
                <tr className="bg-error/10 border border-error border-dashed animate-lesson-enter">
                  <td className="p-2 text-sm font-mono font-bold text-error">3</td>
                  <td className="p-2 text-sm text-error font-bold">New Student</td>
                  <td className="p-2 text-sm text-error">new@merito.pl</td>
                </tr>
              )}
              {[4, 5].map((id) => (
                <tr key={id} className="border-b border-ink/5">
                  <td className="p-2 text-sm font-mono font-bold">{id}</td>
                  <td className="p-2 text-sm">Student {id}</td>
                  <td className="p-2 text-sm">s{id}@merito.pl</td>
                </tr>
              ))}
              {fixed && (
                <tr className="bg-success/10 border border-success animate-lesson-enter">
                  <td className="p-2 text-sm font-mono font-bold text-success">6</td>
                  <td className="p-2 text-sm text-success font-bold">New Student</td>
                  <td className="p-2 text-sm text-success">new@merito.pl</td>
                </tr>
              )}
            </tbody>
          </table>

          {!attempted ? (
            <div className="mt-6 p-4 bg-paper rounded-lg border-2 border-dashed border-ink/20 flex items-center justify-between">
              <div className="font-mono text-sm bg-[#fdfcfa] p-2 border border-ink/10 rounded">
                <span className="font-bold text-rust">INSERT INTO</span> students (id, name, email)<br/>
                <span className="font-bold text-rust">VALUES</span> (3, 'New Student', 'new@merito.pl');
              </div>
              <button 
                onClick={handleInsert}
                className="bg-rust text-white rounded-xl px-6 py-2.5 font-sans text-sm font-bold hover:bg-rust/90 flex items-center gap-2"
              >
                Run <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          ) : !fixed ? (
            <div className="mt-6 p-4 bg-error/10 border border-error rounded-lg animate-shake">
              <div className="text-error font-bold flex items-center gap-2 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Error: Duplicate primary key '3'.
              </div>
              <p className="text-sm mb-4">How should we fix this?</p>
              <div className="space-y-2">
                <button onClick={() => handleFixOption('change_id')} className="w-full text-left p-3 border border-ink/20 rounded-lg hover:border-success hover:bg-success/5 transition-colors text-sm font-medium">
                  Change the id to 6 (next available)
                </button>
                <button className="w-full text-left p-3 border border-ink/20 rounded-lg hover:border-error hover:bg-error/5 transition-colors text-sm font-medium opacity-70">
                  Delete the existing row with id 3 (valid but destructive)
                </button>
                <button className="w-full text-left p-3 border border-ink/20 rounded-lg hover:border-error hover:bg-error/5 transition-colors text-sm font-medium opacity-70">
                  Remove the primary key constraint (bad idea)
                </button>
              </div>
            </div>
          ) : (
             <div className="mt-6 p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
              <CheckIcon className="w-6 h-6" />
              <span className="font-bold">Perfect! The new row has a unique ID.</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full bg-[#fdfcfa] p-8 rounded-xl border-[1.5px] border-ink/12 shadow-sm animate-lesson-enter">
          <h3 className="text-xl font-bold mb-6 text-center">Quick Exercise</h3>
          <p className="mb-6 text-center">Which of these columns could be a good primary key?</p>
          <div className="space-y-3">
            {['name', 'email', 'id'].map((opt) => (
              <button 
                key={opt}
                onClick={() => handleQuizAnswer(opt)}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all ${quizDone && opt === 'id' ? 'border-success bg-success/10' : quizDone ? 'border-ink/10 opacity-50' : 'border-ink/10 hover:border-rust/50 hover:bg-paper'}`}
              >
                <div className="font-bold text-lg">
                  {opt === 'name' && 'Student name'}
                  {opt === 'email' && 'Student email'}
                  {opt === 'id' && 'Student ID number'}
                </div>
                <div className="text-sm text-graphite mt-1">
                  {opt === 'name' && 'Names can repeat (e.g., two Jan Kowalskis).'}
                  {opt === 'email' && 'Emails are unique, but people change them.'}
                  {opt === 'id' && 'Unique by design, never changes.'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Scene 5: Real World: Design the university database
const Scene5 = ({ onComplete }) => {
  const [columns] = useState([
    { id: 'c1', label: 'student_id', type: 'INT', table: null },
    { id: 'c2', label: 'student_name', type: 'VARCHAR', table: null },
    { id: 'c3', label: 'email', type: 'VARCHAR', table: null },
    { id: 'c4', label: 'semester', type: 'INT', table: null },
    
    { id: 'c5', label: 'course_id', type: 'INT', table: null },
    { id: 'c6', label: 'course_name', type: 'VARCHAR', table: null },
    { id: 'c7', label: 'professor', type: 'VARCHAR', table: null },
    { id: 'c8', label: 'credits', type: 'INT', table: null },

    { id: 'c9', label: 'enrollment_id', type: 'INT', table: null },
    { id: 'c10', label: 'grade', type: 'VARCHAR', table: null },
    { id: 'c11', label: 'enrollment_date', type: 'DATE', table: null },
  ]);

  // Simplified approach: just 3 pools, users click to assign to selected table
  const [activeTable, setActiveTable] = useState('students');
  const [completed, setCompleted] = useState(false);

  // Hardcode the target assignments to simplify the interaction without complex drag-and-drop libs
  const targetAssignments = {
    c1: ['students', 'enrollments'],
    c2: ['students'],
    c3: ['students'],
    c4: ['students'],
    c5: ['courses', 'enrollments'],
    c6: ['courses'],
    c7: ['courses'],
    c8: ['courses'],
    c9: ['enrollments'],
    c10: ['enrollments'],
    c11: ['enrollments'],
  };

  // Let's use a simpler state: which columns are assigned to which tables.
  const [assignments, setAssignments] = useState({
    students: [],
    courses: [],
    enrollments: []
  });

  const [pool, setPool] = useState([...columns, { id: 'c1_fk', label: 'student_id', type: 'INT', isFk: true, sourceId: 'c1' }, { id: 'c5_fk', label: 'course_id', type: 'INT', isFk: true, sourceId: 'c5' }]);
  const [shakingCol, setShakingCol] = useState(null);
  const shakeTimerRef = useRef(null);
  const completeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, []);

  const handleAssign = (col) => {
    if (activeTable) {
      // check if it's the correct table
      const isCorrect = col.isFk ? targetAssignments[col.sourceId].includes(activeTable) && activeTable === 'enrollments' : targetAssignments[col.id].includes(activeTable);

      if (isCorrect && !assignments[activeTable].find(c => c.id === col.id)) {
        sounds.snap();
        setAssignments(prev => ({
          ...prev,
          [activeTable]: [...prev[activeTable], col]
        }));
        setPool(prev => prev.filter(c => c.id !== col.id));
      } else {
        sounds.wrong();
        setShakingCol(col.id);
        if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
        shakeTimerRef.current = setTimeout(() => setShakingCol(null), 400);
      }
    }
  };

  useEffect(() => {
    if (pool.length === 0 && !completed) {
      sounds.correct();
      setTimeout(() => setCompleted(true), 0);
      completeTimerRef.current = setTimeout(onComplete, 3000);
    }
  }, [pool, completed, onComplete]);

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Design the university database</h2>
        <p className="text-sm text-graphite">
          Select a table blueprint, then click the correct columns to add them.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full mb-8">
        {['students', 'courses', 'enrollments'].map(table => (
          <div 
            key={table}
            onClick={() => setActiveTable(table)}
            className={`flex-1 rounded-xl p-4 border-2 transition-all cursor-pointer ${activeTable === table ? 'border-rust bg-[#fdfcfa] shadow-md scale-105' : 'border-ink/10 bg-paper hover:border-ink/30'}`}
          >
            <h3 className="font-bold text-center mb-3 text-lg capitalize flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-rust" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
              {table}
            </h3>
            <div className="space-y-2 min-h-[150px]">
              {assignments[table].map(col => (
                <div key={col.id} className="bg-[#fdfcfa] border border-ink/10 rounded px-3 py-2 flex justify-between items-center text-sm animate-slide-in-right">
                  <span className="font-mono font-bold">
                    {col.label.includes('_id') && table !== 'enrollments' && <span className="text-rust mr-1">🔑</span>}
                    {col.isFk && <span className="text-graphite mr-1">🔗</span>}
                    {col.label}
                  </span>
                  <span className="text-xs text-graphite font-mono">{col.type}</span>
                </div>
              ))}
              {assignments[table].length === 0 && (
                <div className="h-full flex items-center justify-center text-sm text-ink/30 italic mt-8 border-2 border-dashed border-ink/10 rounded-lg p-4">
                  Add columns here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Column Pool */}
      <div className={`w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm transition-opacity duration-500 ${completed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h4 className="text-sm font-bold text-ink/60 mb-4 text-center uppercase tracking-wider">Available Columns (Click to add to <span className="text-rust">{activeTable}</span>)</h4>
        <div className="flex flex-wrap gap-3 justify-center">
          {pool.map(col => (
            <button
              key={col.id}
              onClick={() => handleAssign(col)}
              className={`bg-[#fdfcfa] border-[1.5px] rounded-xl px-4 py-2.5 font-mono text-sm hover:border-rust hover:shadow-sm transition-all active:scale-95 flex flex-col items-center ${shakingCol === col.id ? 'animate-shake border-error text-error' : 'border-ink/20'}`}
            >
              <span className={`font-bold ${shakingCol === col.id ? 'text-error' : 'text-ink'}`}>{col.label}</span>
              <span className="text-xs text-graphite">{col.type}</span>
            </button>
          ))}
        </div>
      </div>

      {completed && (
        <div className="fixed inset-x-0 bottom-24 flex justify-center z-50 animate-bounce">
          <div className="bg-success text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
            <CheckIcon /> Schema Design Complete!
          </div>
        </div>
      )}
    </div>
  );
};

// Scene 6: Challenge: Spot the schema errors
const Scene6 = ({ onComplete }) => {
  const [fixed, setFixed] = useState({});
  const [activeProblem, setActiveProblem] = useState(null);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const completeTimerRef = useRef(null);
  const wrongTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
    };
  }, []);

  const problems = {
    p1: { desc: "id is text, not a number", table: "products", options: [{ text: "Change type to INT", correct: true }, { text: "Keep as text", correct: false }] },
    p2: { desc: "Price has a $ symbol (should be numeric)", table: "products", options: [{ text: "Change to FLOAT (e.g., 9.99)", correct: true }, { text: "Add € symbol", correct: false }] },
    p3: { desc: "Customer info mixed with order info", table: "orders", options: [{ text: "Move to separate 'customers' table", correct: true }, { text: "Add more customer columns", correct: false }] },
    p4: { desc: "Product referenced by name", table: "orders", options: [{ text: "Reference product_id instead", correct: true }, { text: "Keep name for readability", correct: false }] },
    p5: { desc: "No primary key", table: "reviews", options: [{ text: "Add review_id (INT) Primary Key", correct: true }, { text: "Use stars as Primary Key", correct: false }] }
  };

  const handleFix = (pid, isCorrect) => {
    if (isCorrect) {
      sounds.correct();
      const newFixed = { ...fixed, [pid]: true };
      setFixed(newFixed);
      setActiveProblem(null);
      setWrongAnswer(false);
      if (Object.keys(newFixed).length === 5) {
        completeTimerRef.current = setTimeout(onComplete, 1000);
      }
    } else {
      sounds.wrong();
      setWrongAnswer(true);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => setWrongAnswer(false), 800);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
      <div className="mb-8 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Challenge: Spot the schema errors</h2>
        <p className="text-lg text-graphite">
          Find and fix 5 design problems in these tables.
        </p>
      </div>

      <div className="space-y-6 w-full max-w-3xl">
        {/* Products Table */}
        <div className="bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm">
          <h3 className="font-bold mb-3 font-sans text-rust flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
            products
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-paper border-b border-ink/10">
                <th className="p-2 text-left text-sm font-sans font-semibold">id</th>
                <th className="p-2 text-left text-sm font-sans font-semibold">name</th>
                <th className="p-2 text-left text-sm font-sans font-semibold">price</th>
                <th className="p-2 text-left text-sm font-sans font-semibold">category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`p-2 font-mono ${fixed.p1 ? 'text-success font-bold' : 'text-error cursor-pointer hover:bg-error/10 border border-transparent hover:border-error rounded'}`} onClick={() => { if (!fixed.p1) { sounds.pop(); setActiveProblem('p1'); } }}>
                  {fixed.p1 ? '1' : '"one"'}
                </td>
                <td className="p-2">Widget</td>
                <td className={`p-2 font-mono ${fixed.p2 ? 'text-success font-bold' : 'text-error cursor-pointer hover:bg-error/10 border border-transparent hover:border-error rounded'}`} onClick={() => { if (!fixed.p2) { sounds.pop(); setActiveProblem('p2'); } }}>
                  {fixed.p2 ? '9.99' : '$9.99'}
                </td>
                <td className="p-2">Electronics</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Orders Table */}
        <div className="bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm overflow-x-auto">
          <h3 className="font-bold mb-3 font-sans text-rust flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
            orders
          </h3>
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-paper border-b border-ink/10">
                <th className="p-2 text-left text-sm font-sans font-semibold">order_id</th>
                <th className={`p-2 text-left text-sm font-sans font-semibold ${!fixed.p3 ? 'text-error cursor-pointer hover:bg-error/10' : 'text-ink/30 line-through'}`} onClick={() => { if (!fixed.p3) { sounds.pop(); setActiveProblem('p3'); } }}>customer_name</th>
                <th className={`p-2 text-left text-sm font-sans font-semibold ${!fixed.p3 ? 'text-error cursor-pointer hover:bg-error/10' : 'text-ink/30 line-through'}`} onClick={() => { if (!fixed.p3) { sounds.pop(); setActiveProblem('p3'); } }}>customer_email</th>
                {fixed.p3 && <th className="p-2 text-left text-sm font-sans font-semibold text-success">customer_id</th>}
                <th className="p-2 text-left text-sm font-sans font-semibold">product</th>
                <th className="p-2 text-left text-sm font-sans font-semibold">qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 font-mono">1</td>
                <td className={`p-2 ${!fixed.p3 ? 'text-error cursor-pointer hover:bg-error/10' : 'text-ink/30 line-through'}`} onClick={() => { if (!fixed.p3) { sounds.pop(); setActiveProblem('p3'); } }}>Jan K.</td>
                <td className={`p-2 ${!fixed.p3 ? 'text-error cursor-pointer hover:bg-error/10' : 'text-ink/30 line-through'}`} onClick={() => { if (!fixed.p3) { sounds.pop(); setActiveProblem('p3'); } }}>jan@mail.com</td>
                {fixed.p3 && <td className="p-2 text-success font-bold font-mono">42</td>}
                <td className={`p-2 font-mono ${fixed.p4 ? 'text-success font-bold' : 'text-error cursor-pointer hover:bg-error/10 border border-transparent hover:border-error rounded'}`} onClick={() => { if (!fixed.p4) { sounds.pop(); setActiveProblem('p4'); } }}>
                  {fixed.p4 ? '1 (id)' : '"Widget"'}
                </td>
                <td className="p-2 font-mono">2</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reviews Table */}
        <div className="bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm">
          <h3 className="font-bold mb-3 font-sans text-rust flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
              reviews
            </span>
            {!fixed.p5 && (
              <span className="text-xs bg-error/10 text-error px-2 py-1 rounded cursor-pointer animate-pulse" onClick={() => { sounds.pop(); setActiveProblem('p5'); }}>Missing PK!</span>
            )}
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-paper border-b border-ink/10">
                {fixed.p5 && <th className="p-2 text-left text-sm font-sans font-semibold text-success animate-lesson-enter">review_id 🔑</th>}
                <th className="p-2 text-left text-sm font-sans font-semibold">product_id</th>
                <th className="p-2 text-left text-sm font-sans font-semibold">review</th>
                <th className="p-2 text-left text-sm font-sans font-semibold">stars</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {fixed.p5 && <td className="p-2 font-mono text-success font-bold">1</td>}
                <td className="p-2 font-mono">1</td>
                <td className="p-2">"Great!"</td>
                <td className="p-2 font-mono">5</td>
              </tr>
              <tr>
                {fixed.p5 && <td className="p-2 font-mono text-success font-bold">2</td>}
                <td className="p-2 font-mono">1</td>
                <td className="p-2">"Okay"</td>
                <td className="p-2 font-mono">3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fix Modal */}
      {activeProblem && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-[#fdfcfa] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in ${wrongAnswer ? 'animate-shake' : ''}`}>
            <h3 className="text-xl font-bold mb-2">Fix the Schema</h3>
            <p className="text-graphite mb-6">{problems[activeProblem].desc}</p>
            <div className="space-y-3">
              {problems[activeProblem].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleFix(activeProblem, opt.correct)}
                  className={`w-full text-left p-4 border-[1.5px] rounded-xl transition-all font-medium ${wrongAnswer && !opt.correct ? 'border-error bg-error/5 text-error animate-shake' : 'border-ink/20 hover:border-rust hover:bg-paper'}`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setActiveProblem(null); setWrongAnswer(false); }}
              className="mt-6 w-full py-3 text-ink/50 font-medium hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="fixed bottom-8 bg-[#fdfcfa] border border-ink/10 shadow-lg rounded-full px-6 py-3 flex gap-2 z-40 font-bold">
        Found: <span className="text-rust">{Object.keys(fixed).length}/5</span>
      </div>
    </div>
  );
};

export default function Lesson1({ currentPhase, currentStep, onComplete }) {
  if (currentPhase === 'learn') {
    if (currentStep === 0) return <Scene1 onComplete={onComplete} />;
    if (currentStep === 1) return <Scene2 onComplete={onComplete} />;
    if (currentStep === 2) return <Scene3 onComplete={onComplete} />;
    if (currentStep === 3) return <Scene4 onComplete={onComplete} />;
  }
  
  if (currentPhase === 'apply') {
    if (currentStep === 0) return <Scene5 onComplete={onComplete} />;
  }

  if (currentPhase === 'challenge') {
    if (currentStep === 0) return <Scene6 onComplete={onComplete} />;
  }

  return <div>Unknown step</div>;
}
