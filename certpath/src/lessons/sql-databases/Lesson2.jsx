import React, { useState, useEffect, useRef } from 'react';
import { sounds } from "../../hooks/useSound";

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const STUDENTS_DATA = [
  { id: 1, name: "Anna Nowak", email: "anna@merito.pl", department: "Computer Science", gpa: 4.8 },
  { id: 2, name: "Jan Kowalski", email: "jan@merito.pl", department: "Business", gpa: 3.4 },
  { id: 3, name: "Piotr Wiśniewski", email: "piotr@merito.pl", department: "Computer Science", gpa: 3.9 },
  { id: 4, name: "Kasia Zielińska", email: "kasia@merito.pl", department: "Psychology", gpa: 4.2 },
  { id: 5, name: "Michał Kamiński", email: "michal@merito.pl", department: "Computer Science", gpa: 2.8 },
  { id: 6, name: "Zofia Wójcik", email: "zofia@merito.pl", department: "Business", gpa: 4.5 },
  { id: 7, name: "Tomasz Lewandowski", email: "tomasz@merito.pl", department: "Design", gpa: 3.7 },
  { id: 8, name: "Magda Dąbrowska", email: "magda@merito.pl", department: "Computer Science", gpa: 4.1 },
];

const COLUMNS = Object.keys(STUDENTS_DATA[0]);

// Scene 1: Asking questions
const Scene1 = ({ onComplete }) => {
  const [selectedCols, setSelectedCols] = useState(['name']);
  const [hasRun, setHasRun] = useState(false);
  const [explorationCount, setExplorationCount] = useState(0);
  const completedRef = useRef(false);

  const toggleCol = (col) => {
    sounds.pop();
    setSelectedCols(prev => {
      if (prev.includes(col)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(c => c !== col);
      } else {
        return [...prev, col];
      }
    });
    if (hasRun) {
       setExplorationCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (explorationCount >= 3 && !completedRef.current) {
      completedRef.current = true;
      sounds.correct();
      const t = setTimeout(onComplete, 2000);
      return () => clearTimeout(t);
    }
  }, [explorationCount, onComplete]);

  const handleRun = () => {
    sounds.pop();
    setHasRun(true);
    setExplorationCount(1);
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Asking questions</h2>
        <p className="text-graphite">
          A database is useless if you can't ask it questions. SQL is the language you use to ask. The most basic question: <i>"Show me this data."</i>
        </p>
      </div>

      <div className="w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm mb-6">
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-paper border-b border-ink/10">
                {COLUMNS.map(col => (
                  <th 
                    key={col} 
                    onClick={() => hasRun && toggleCol(col)}
                    className={`p-2 text-left text-sm font-semibold transition-colors duration-300 ${hasRun ? 'cursor-pointer hover:bg-ink/5' : ''} ${hasRun && !selectedCols.includes(col) ? 'text-ink/30' : 'text-ink'}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STUDENTS_DATA.slice(0, 5).map(row => (
                <tr key={row.id} className="border-b border-ink/5">
                  {COLUMNS.map(col => (
                    <td 
                      key={`${row.id}-${col}`} 
                      className={`p-2 text-sm transition-all duration-500 ${hasRun && selectedCols.includes(col) ? 'bg-success/5 font-medium' : hasRun ? 'text-ink/40' : ''}`}
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center text-xs text-ink/40 mt-2 font-medium">Showing 5 of 8 rows</div>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-5 relative overflow-hidden">
          <div className="font-mono text-lg text-white mb-4">
            <span className="text-[#2a9d8f] font-bold">SELECT</span>{' '}
            {hasRun ? (
              <span className="text-[#f9c74f]">
                {selectedCols.length === COLUMNS.length ? '*' : selectedCols.join(', ')}
              </span>
            ) : (
              <span className="text-[#f9c74f]">name</span>
            )}{' '}
            <span className="text-[#2a9d8f] font-bold">FROM</span> <span className="text-[#e0fbfc]">students</span>;
          </div>

          {!hasRun ? (
            <button 
              onClick={handleRun}
              className="bg-rust text-white rounded-xl px-6 py-2.5 font-sans text-sm font-bold hover:bg-rust/90 flex items-center gap-2"
            >
              Run Query <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          ) : (
            <div className="mt-4 pt-4 border-t border-white/10 animate-lesson-enter">
              <p className="text-white/70 text-sm mb-3">Click columns to toggle them in the SELECT statement:</p>
              <div className="flex flex-wrap gap-2">
                {COLUMNS.map(col => (
                  <button
                    key={`btn-${col}`}
                    onClick={() => toggleCol(col)}
                    className={`px-3 py-1 rounded-full font-mono text-xs transition-colors ${selectedCols.includes(col) ? 'bg-[#f9c74f] text-[#1a1a2e] font-bold' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {explorationCount >= 3 && (
        <div className="text-success font-bold flex items-center gap-2 animate-lesson-enter">
          <CheckIcon /> Great! You can select specific columns or all of them (*).
        </div>
      )}
    </div>
  );
};

// Scene 2: Filtering with WHERE
const Scene2 = ({ onComplete }) => {
  const [whereCol, setWhereCol] = useState('gpa');
  const [whereOp, setWhereOp] = useState('>');
  const [whereVal, setWhereVal] = useState('3.5');
  const [hasChanged, setHasChanged] = useState(false);
  const completedRef = useRef(false);

  const checkCondition = (row) => {
    if (!whereVal) return true;
    const val = row[whereCol];
    let compVal = whereVal;

    if (whereCol === 'gpa' || whereCol === 'id') {
      compVal = parseFloat(whereVal);
      if (isNaN(compVal)) return true; // invalid number input
    } else {
      compVal = whereVal.replace(/['"]/g, ''); // strip quotes for string compare
    }

    switch (whereOp) {
      case '=': return val == compVal;
      case '>': return val > compVal;
      case '<': return val < compVal;
      case '>=': return val >= compVal;
      case '<=': return val <= compVal;
      case '!=': return val != compVal;
      default: return true;
    }
  };

  useEffect(() => {
    if (hasChanged && !completedRef.current) {
      completedRef.current = true;
      sounds.correct();
      const timer = setTimeout(onComplete, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasChanged, onComplete]);

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Filtering with WHERE</h2>
        <p className="text-graphite">
          SELECT chooses which columns to show. <span className="font-mono text-rust">WHERE</span> chooses which rows to show.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1 bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm flex flex-col">
          <h3 className="font-bold mb-4">Query Builder</h3>
          
          <div className="bg-[#1a1a2e] rounded-xl p-5 mb-4 font-mono text-white flex-1">
            <div className="mb-2">
              <span className="text-[#2a9d8f] font-bold">SELECT</span> name, {whereCol}
            </div>
            <div className="mb-2">
              <span className="text-[#2a9d8f] font-bold">FROM</span> students
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#e76f51] font-bold">WHERE</span>
              <select 
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm outline-none"
                value={whereCol}
                onChange={(e) => { sounds.pop(); setWhereCol(e.target.value); setHasChanged(true); }}
              >
                {COLUMNS.map(c => <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>)}
              </select>
              <select 
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm outline-none"
                value={whereOp}
                onChange={(e) => { sounds.pop(); setWhereOp(e.target.value); setHasChanged(true); }}
              >
                {['=', '>', '<', '>=', '<=', '!='].map(op => <option key={op} value={op} className="bg-[#1a1a2e]">{op}</option>)}
              </select>
              <input 
                type="text" 
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm w-24 outline-none"
                value={whereVal}
                onChange={(e) => { setWhereVal(e.target.value); setHasChanged(true); }}
              />
            </div>
          </div>
          <div className="text-sm text-graphite italic">
            Try: <span className="font-mono bg-paper px-1 rounded cursor-pointer hover:bg-ink/10" onClick={() => {sounds.pop(); setWhereCol('department'); setWhereOp('='); setWhereVal('Computer Science'); setHasChanged(true);}}>department = "Computer Science"</span> or <span className="font-mono bg-paper px-1 rounded cursor-pointer hover:bg-ink/10" onClick={() => {sounds.pop(); setWhereCol('gpa'); setWhereOp('>='); setWhereVal('4.0'); setHasChanged(true);}}>gpa &gt;= 4.0</span>
          </div>
        </div>

        <div className="flex-1 bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm">
          <h3 className="font-bold mb-4 flex justify-between">
            <span>Result Preview</span>
            <span className="text-sm font-normal text-graphite">{STUDENTS_DATA.filter(checkCondition).length} rows match</span>
          </h3>
          <div className="overflow-hidden rounded-lg border border-ink/10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-paper border-b border-ink/10">
                  <th className="p-2 text-left text-xs font-semibold">name</th>
                  <th className="p-2 text-left text-xs font-semibold">{whereCol}</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS_DATA.map(row => {
                  const isMatch = checkCondition(row);
                  return (
                    <tr 
                      key={row.id} 
                      className={`border-b border-ink/5 transition-all duration-300 ${isMatch ? 'bg-success/10' : 'opacity-30 grayscale'}`}
                    >
                      <td className={`p-2 text-sm ${isMatch ? 'font-medium text-success' : ''}`}>{row.name}</td>
                      <td className={`p-2 text-sm font-mono ${isMatch ? 'font-bold text-success' : ''}`}>{row[whereCol]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene 3: Combining conditions
const Scene3 = ({ onComplete }) => {
  const [operator, setOperator] = useState('AND');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const andCount = STUDENTS_DATA.filter(r => r.department === "Computer Science" && r.gpa > 3.5).length; // 3
  const orCount = STUDENTS_DATA.filter(r => r.department === "Computer Science" || r.gpa > 3.5).length; // 6

  const correctAnswers = { q1: 3, q2: 6, q3: 4 };
  const handleQuiz = (q, val) => {
    if (val === correctAnswers[q]) {
      sounds.correct();
    } else {
      sounds.wrong();
    }
    setQuizAnswers(prev => {
      const next = { ...prev, [q]: val };
      if (Object.keys(next).length === 3) {
        setShowResult(true);
        timerRef.current = setTimeout(onComplete, 3000);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Combining conditions</h2>
        <p className="text-graphite">
          You can combine multiple conditions with <span className="font-mono font-bold text-rust">AND</span> (both must be true) and <span className="font-mono font-bold text-rust">OR</span> (either can be true).
        </p>
      </div>

      <div className="w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm mb-6 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <div className="bg-[#1a1a2e] rounded-xl p-5 font-mono text-white mb-4">
            <div><span className="text-[#2a9d8f] font-bold">SELECT</span> name, department, gpa</div>
            <div><span className="text-[#2a9d8f] font-bold">FROM</span> students</div>
            <div><span className="text-[#e76f51] font-bold">WHERE</span> department = 'Computer Science'</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-white/10 rounded-lg p-1 flex">
                <button
                  className={`px-3 py-1 rounded text-sm font-bold transition-all ${operator === 'AND' ? 'bg-[#e76f51] text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                  onClick={() => { sounds.pop(); setOperator('AND'); }}
                >AND</button>
                <button
                  className={`px-3 py-1 rounded text-sm font-bold transition-all ${operator === 'OR' ? 'bg-[#e76f51] text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                  onClick={() => { sounds.pop(); setOperator('OR'); }}
                >OR</button>
              </div>
              <span>gpa &gt; 3.5</span>
            </div>
          </div>
          <p className="text-sm text-graphite mb-2">
            Matching rows: <span className="font-bold">{operator === 'AND' ? andCount : orCount}</span>
          </p>
        </div>

        {/* Visual Venn / Table Highlight */}
        <div className="flex-1 w-full max-h-[300px] overflow-y-auto border border-ink/10 rounded-lg relative">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-paper">
              <tr className="border-b border-ink/10">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Dept (CS)</th>
                <th className="p-2 text-left">GPA (&gt;3.5)</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS_DATA.map(row => {
                const isCs = row.department === "Computer Science";
                const isGpa = row.gpa > 3.5;
                const isMatch = operator === 'AND' ? (isCs && isGpa) : (isCs || isGpa);
                
                return (
                  <tr key={row.id} className={`border-b border-ink/5 transition-colors duration-300 ${isMatch ? 'bg-success/10' : 'opacity-40'}`}>
                    <td className="p-2 font-medium">{row.name}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${isCs ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}>{row.department}</span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${isGpa ? 'bg-purple-100 text-purple-700 font-bold' : ''}`}>{row.gpa}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm">
        <h3 className="font-bold mb-4">Quick Exercise</h3>
        <p className="text-sm mb-4">Based on the data above, how many students match each query?</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-ink/10 rounded-lg bg-paper">
            <code className="text-sm font-bold">WHERE department = 'CS' AND gpa &gt; 3.5</code>
            <div className="flex gap-2">
              {[2, 3, 4].map(num => (
                <button 
                  key={num}
                  onClick={() => handleQuiz('q1', num)}
                  className={`w-8 h-8 rounded-full font-bold transition-all ${quizAnswers.q1 === num ? (num === 3 ? 'bg-success text-white' : 'bg-error text-white') : 'bg-[#fdfcfa] border border-ink/20 hover:border-rust'}`}
                  disabled={showResult}
                >{num}</button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-ink/10 rounded-lg bg-paper">
            <code className="text-sm font-bold">WHERE department = 'CS' OR gpa &gt; 3.5</code>
            <div className="flex gap-2">
              {[5, 6, 8].map(num => (
                <button 
                  key={num}
                  onClick={() => handleQuiz('q2', num)}
                  className={`w-8 h-8 rounded-full font-bold transition-all ${quizAnswers.q2 === num ? (num === 6 ? 'bg-success text-white' : 'bg-error text-white') : 'bg-[#fdfcfa] border border-ink/20 hover:border-rust'}`}
                  disabled={showResult}
                >{num}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-ink/10 rounded-lg bg-paper">
            <code className="text-sm font-bold">WHERE NOT department = 'CS'</code>
            <div className="flex gap-2">
              {[3, 4, 5].map(num => (
                <button 
                  key={num}
                  onClick={() => handleQuiz('q3', num)}
                  className={`w-8 h-8 rounded-full font-bold transition-all ${quizAnswers.q3 === num ? (num === 4 ? 'bg-success text-white' : 'bg-error text-white') : 'bg-[#fdfcfa] border border-ink/20 hover:border-rust'}`}
                  disabled={showResult}
                >{num}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene 4: Sorting and limiting
const Scene4 = ({ onComplete }) => {
  const [sortCol, setSortCol] = useState('id');
  const [sortDir, setSortDir] = useState('ASC');
  const [limit, setLimit] = useState(8);
  const [interacted, setInteracted] = useState(false);

  const sortedData = [...STUDENTS_DATA].sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDir === 'ASC' ? -1 : 1;
    if (valA > valB) return sortDir === 'ASC' ? 1 : -1;
    return 0;
  });

  const displayData = sortedData.slice(0, limit);

  useEffect(() => {
    if (interacted && limit < 8 && sortCol !== 'id') {
      sounds.correct();
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [interacted, limit, sortCol, onComplete]);

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Sorting and Limiting</h2>
        <p className="text-graphite">
          <span className="font-mono text-rust">ORDER BY</span> sorts your results. <span className="font-mono text-rust">LIMIT</span> controls how many rows you get back.
        </p>
      </div>

      <div className="w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm mb-6">
        <div className="bg-[#1a1a2e] rounded-xl p-5 font-mono text-white flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1 space-y-3">
            <div><span className="text-[#2a9d8f] font-bold">SELECT</span> * <span className="text-[#2a9d8f] font-bold">FROM</span> students</div>
            
            <div className="flex items-center gap-2">
              <span className="text-[#e76f51] font-bold">ORDER BY</span>
              <select 
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm outline-none"
                value={sortCol}
                onChange={(e) => { sounds.pop(); setSortCol(e.target.value); setInteracted(true); }}
              >
                {COLUMNS.map(c => <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>)}
              </select>
              <button 
                onClick={() => { sounds.pop(); setSortDir(prev => prev === 'ASC' ? 'DESC' : 'ASC'); setInteracted(true); }}
                className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm font-bold transition-colors w-16"
              >
                {sortDir}
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[#e76f51] font-bold">LIMIT</span>
              <span className="text-[#f9c74f] font-bold w-4">{limit}</span>
              <input 
                type="range" min="1" max="8" value={limit} 
                onChange={(e) => { setLimit(parseInt(e.target.value)); setInteracted(true); }}
                className="flex-1 accent-[#f9c74f]"
              />
            </div>
          </div>
        </div>

        <div className="relative min-h-[350px] border border-ink/10 rounded-lg overflow-hidden bg-paper/50 p-2">
          {/* We use absolute positioning with transforms for smooth reordering animation */}
          <div className="grid grid-cols-4 px-4 py-2 text-xs font-bold text-ink/50 border-b border-ink/10 mb-2">
            <div>Name</div>
            <div>Email</div>
            <div>Department</div>
            <div>GPA</div>
          </div>
          
          <div className="relative h-[320px]">
            {STUDENTS_DATA.map(row => {
              const index = displayData.findIndex(d => d.id === row.id);
              const isVisible = index !== -1;
              const yPos = isVisible ? index * 40 : -40; // 40px height per row
              
              return (
                <div 
                  key={row.id}
                  className={`absolute left-0 right-0 grid grid-cols-4 px-4 py-2 text-sm bg-[#fdfcfa] border border-ink/5 rounded mb-1 transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  style={{ transform: `translateY(${yPos}px)`, zIndex: isVisible ? 10 : 0 }}
                >
                  <div className="font-medium truncate pr-2">{row.name}</div>
                  <div className="truncate pr-2 text-ink/70">{row.email}</div>
                  <div className="truncate pr-2">{row.department}</div>
                  <div className="font-mono text-rust font-bold">{row.gpa}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Scene 5: Real World: University database queries
const Scene5 = ({ onComplete }) => {
  const questions = [
    {
      text: "Which Computer Science students have a GPA above 3.5?",
      reqs: { whereCol1: 'department', whereVal1: 'Computer Science', op: 'AND', whereCol2: 'gpa', whereVal2: '> 3.5' },
      queryMatch: (q) => q.includes("department = 'Computer Science'") && q.includes("gpa > 3.5") && q.includes("AND")
    },
    {
      text: "List all scholarship students, sorted by GPA highest to lowest",
      reqs: { where: 'scholarship = TRUE', order: 'gpa DESC' },
      queryMatch: (q) => q.includes("scholarship = TRUE") && q.includes("ORDER BY gpa DESC")
    },
    {
      text: "Who are the top 3 students overall?",
      reqs: { order: 'gpa DESC', limit: 3 },
      queryMatch: (q) => q.includes("ORDER BY gpa DESC") && q.includes("LIMIT 3")
    },
    {
      text: "Find students in semester 1 or 2 who don't have a scholarship",
      reqs: { logic: 'complex' },
      queryMatch: (q) => (q.includes("semester = 1") || q.includes("semester IN (1,2)")) && q.includes("scholarship = FALSE")
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [queryInput, setQueryInput] = useState("");
  const [error, setError] = useState(false);
  const errorTimerRef = useRef(null);
  const successTimerRef = useRef(null);

  useEffect(() => () => {
    clearTimeout(errorTimerRef.current);
    clearTimeout(successTimerRef.current);
  }, []);

  const predefinedQueries = [
    "SELECT name, gpa FROM students WHERE department = 'Computer Science' AND gpa > 3.5",
    "SELECT name, department, gpa FROM students WHERE scholarship = TRUE ORDER BY gpa DESC",
    "SELECT name, gpa FROM students ORDER BY gpa DESC LIMIT 3",
    "SELECT name, semester FROM students WHERE (semester = 1 OR semester = 2) AND scholarship = FALSE"
  ];

  const handleRun = () => {
    // simplified validation for prototype: exact string match from expected list, or using match function
    const qClean = queryInput.replace(/\s+/g, ' ').trim();
    if (questions[currentQ].queryMatch(qClean) || queryInput === predefinedQueries[currentQ]) {
      sounds.correct();
      setError(false);
      clearTimeout(errorTimerRef.current);
      if (currentQ < questions.length - 1) {
        successTimerRef.current = setTimeout(() => {
          setCurrentQ(prev => prev + 1);
          setQueryInput("");
        }, 1500);
      } else {
        successTimerRef.current = setTimeout(onComplete, 1500);
      }
    } else {
      sounds.wrong();
      setError(true);
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(false), 600);
    }
  };

  // Helper to insert predefined text for user to avoid typing everything
  const handleInsert = () => {
    sounds.pop();
    setQueryInput(predefinedQueries[currentQ]);
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Real World: University Queries</h2>
        <p className="text-graphite">
          The dean needs answers from the student database. Write the SQL queries.
        </p>
      </div>

      <div className="w-full bg-[#fdfcfa] p-8 rounded-xl border-[1.5px] border-ink/12 shadow-sm mb-6 relative">
        <div className="absolute top-4 right-6 text-sm font-bold text-rust">
          Task {currentQ + 1} of 4
        </div>
        
        <div className="flex items-start gap-4 mb-6 mt-2">
          <div className="bg-rust/10 p-3 rounded-full text-rust">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-ink">"{questions[currentQ].text}"</h3>
            <p className="text-sm text-graphite mt-1">Columns available: <code className="text-xs bg-paper px-1 rounded">name, department, semester, gpa, scholarship</code></p>
          </div>
        </div>

        <div className={`bg-[#1a1a2e] rounded-xl p-1 relative border-2 transition-colors ${error ? 'border-error animate-shake' : 'border-transparent'}`}>
          <textarea
            className="w-full bg-transparent text-white font-mono p-4 outline-none resize-none min-h-[120px]"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="SELECT ... FROM students ..."
            spellCheck="false"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={handleInsert}
              className="text-white/50 hover:text-white text-xs px-3 py-1 bg-white/5 rounded transition-colors"
            >
              Insert Hint
            </button>
            <button 
              onClick={handleRun}
              className="bg-rust text-white rounded px-4 py-1.5 font-bold hover:bg-rust/90 flex items-center gap-1 text-sm"
            >
              Run
            </button>
          </div>
        </div>

        {error && <p className="text-error text-sm font-bold mt-2 animate-lesson-enter">Query didn't match the requirements. Try the hint!</p>}
      </div>
    </div>
  );
};

// Scene 6: Challenge: Debug the queries
const Scene6 = ({ onComplete }) => {
  const [fixed, setFixed] = useState({});
  const [activeProblem, setActiveProblem] = useState(null);
  const completeTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(completeTimerRef.current), []);

  const problems = [
    { 
      id: 'q1', 
      bad: "SELCT name FROM students;", 
      errorZone: "SELCT", 
      desc: "Missing 'E' in SELECT",
      options: [
        { text: "Change to: SELECT", correct: true },
        { text: "Change to: SELECTS", correct: false }
      ],
      fixedStr: "SELECT name FROM students;"
    },
    { 
      id: 'q2', 
      bad: "SELECT name FROM students WHERE gpa = > 3.5;", 
      errorZone: "= >", 
      desc: "Invalid operator syntax",
      options: [
        { text: "Change to: =>", correct: false },
        { text: "Change to: >=", correct: true }
      ],
      fixedStr: "SELECT name FROM students WHERE gpa >= 3.5;"
    },
    { 
      id: 'q3', 
      bad: "SELECT name FROM students WHERE department = Computer Science;", 
      errorZone: "Computer Science", 
      desc: "Strings need quotes",
      options: [
        { text: "Change to: 'Computer Science'", correct: true },
        { text: "Change to: [Computer Science]", correct: false }
      ],
      fixedStr: "SELECT name FROM students WHERE department = 'Computer Science';"
    },
    { 
      id: 'q4', 
      bad: "SELECT * FROM students ORDER BY gpa LIMIT 5 DESC;", 
      errorZone: "LIMIT 5 DESC", 
      desc: "Wrong clause order",
      options: [
        { text: "Change to: DESC LIMIT 5", correct: true },
        { text: "Remove LIMIT", correct: false }
      ],
      fixedStr: "SELECT * FROM students ORDER BY gpa DESC LIMIT 5;"
    }
  ];

  const handleFix = (pid, isCorrect) => {
    if (isCorrect) {
      sounds.correct();
      const newFixed = { ...fixed, [pid]: true };
      setFixed(newFixed);
      setActiveProblem(null);
      if (Object.keys(newFixed).length === problems.length) {
        completeTimerRef.current = setTimeout(onComplete, 1000);
      }
    } else {
      sounds.wrong();
      setActiveProblem(null);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
      <div className="mb-6 text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Challenge: Debug the queries</h2>
        <p className="text-graphite">
          Find and fix syntax errors in these 4 queries. Click the highlighted error to fix it.
        </p>
      </div>

      <div className="w-full space-y-4">
        {problems.map((prob) => {
          const isFixed = fixed[prob.id];
          
          return (
            <div key={prob.id} className={`p-4 rounded-xl border-[1.5px] transition-all ${isFixed ? 'bg-success/10 border-success/30' : 'bg-[#fdfcfa] border-ink/12 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isFixed ? 'text-success' : 'text-error'}`}>
                  {isFixed ? 'Fixed' : 'Error'}
                </span>
                {isFixed && <CheckIcon className="w-5 h-5 text-success" />}
              </div>
              
              <div className="font-mono text-sm bg-paper p-3 rounded">
                {isFixed ? (
                  <span className="text-success font-bold">{prob.fixedStr}</span>
                ) : (
                  <span>
                    {prob.bad.split(prob.errorZone)[0]}
                    <span 
                      onClick={() => { sounds.pop(); setActiveProblem(prob.id); }}
                      className="bg-error/20 text-error font-bold border-b-2 border-error border-dashed cursor-pointer hover:bg-error/30 px-1 rounded animate-pulse"
                    >
                      {prob.errorZone}
                    </span>
                    {prob.bad.split(prob.errorZone)[1]}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeProblem && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#fdfcfa] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold mb-2">Fix the Syntax</h3>
            <p className="text-graphite mb-6">{problems.find(p=>p.id === activeProblem).desc}</p>
            <div className="space-y-3">
              {problems.find(p=>p.id === activeProblem).options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleFix(activeProblem, opt.correct)}
                  className="w-full text-left p-4 border-[1.5px] border-ink/20 rounded-xl hover:border-rust hover:bg-paper transition-all font-medium font-mono text-sm"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setActiveProblem(null)}
              className="mt-6 w-full py-3 text-ink/50 font-medium hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default function Lesson2({ currentPhase, currentStep, onComplete }) {
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
