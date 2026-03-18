import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckIcon } from '../../components/Icons';

// ============================================================================
// SCENE 1: What does data look like? (learn step 0)
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const [loaded, setLoaded] = useState(false);
  const [revealedRows, setRevealedRows] = useState(0);
  const [selectedCol, setSelectedCol] = useState(null);
  const [clickedCols, setClickedCols] = useState([]);
  const completeTimerRef = useRef(null);

  const data = [
    { id: 1, name: 'Anna K.', age: 22, dept: 'Computer Sci', hrs: 12, score: 88 },
    { id: 2, name: 'Jan N.', age: 21, dept: 'Information Tech', hrs: 10, score: 75 },
    { id: 3, name: 'Maria W.', age: 23, dept: 'Mathematics', hrs: 15, score: 92 },
    { id: 4, name: 'Piotr Z.', age: 20, dept: 'Physics', hrs: 8, score: 65 },
    { id: 5, name: 'Zofia L.', age: 24, dept: 'Computer Sci', hrs: 20, score: 95 },
    { id: 6, name: 'Michal P.', age: 22, dept: 'Information Tech', hrs: 14, score: 82 },
    { id: 7, name: 'Kasia J.', age: 21, dept: 'Mathematics', hrs: 11, score: 79 },
    { id: 8, name: 'Tomasz C.', age: 23, dept: 'Physics', hrs: 9, score: 68 },
    { id: 9, name: 'Julia S.', age: 20, dept: 'Computer Sci', hrs: 18, score: 90 },
    { id: 10, name: 'Oskar M.', age: 22, dept: 'Information Tech', hrs: 13, score: 85 }
  ];

  const columns = [
    { key: 'id', label: 'student_id', type: 'numeric (discrete)', unique: 10, min: 1, max: 10 },
    { key: 'name', label: 'name', type: 'text', unique: 10, min: null, max: null },
    { key: 'age', label: 'age', type: 'numeric (discrete)', unique: 5, min: 20, max: 24 },
    { key: 'dept', label: 'department', type: 'text', unique: 4, min: null, max: null },
    { key: 'hrs', label: 'hours_studied', type: 'numeric (continuous)', unique: 10, min: 8, max: 20 },
    { key: 'score', label: 'exam_score', type: 'numeric (continuous)', unique: 10, min: 65, max: 95 }
  ];

  useEffect(() => {
    if (loaded && revealedRows < data.length) {
      const timer = setTimeout(() => setRevealedRows(r => r + 1), 150);
      return () => clearTimeout(timer);
    }
  }, [loaded, revealedRows, data.length]);

  useEffect(() => {
    if (clickedCols.length === columns.length) {
      completeTimerRef.current = setTimeout(onComplete, 1500);
      return () => clearTimeout(completeTimerRef.current);
    }
  }, [clickedCols.length, columns.length, onComplete]);

  const handleColClick = (colKey) => {
    setSelectedCol(columns.find(c => c.key === colKey));
    if (!clickedCols.includes(colKey)) {
      setClickedCols([...clickedCols, colKey]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Data is everywhere. But raw data is just rows and columns until you learn to read it. Click the columns to see what they hold.
      </p>

      {!loaded ? (
        <button
          onClick={() => setLoaded(true)}
          className="bg-rust hover:bg-rust/90 text-white font-medium px-8 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
        >
          Load Dataset
        </button>
      ) : (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 overflow-x-auto bg-[#fdfcfa] rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.06)] border-[1.5px] border-ink/12">
            <table className="w-full text-left font-mono text-sm">
              <thead className="bg-paper border-b-2 border-ink/10">
                <tr>
                  {columns.map(c => (
                    <th
                      key={c.key}
                      onClick={() => handleColClick(c.key)}
                      className={`p-3 cursor-pointer hover:bg-ink/5 transition-colors relative ${selectedCol?.key === c.key ? 'bg-ink/5 text-rust' : 'text-ink'}`}
                    >
                      {c.label}
                      {clickedCols.includes(c.key) && <CheckIcon className="w-3 h-3 text-success absolute top-1 right-1" />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.id} className={`border-b border-ink/5 transition-opacity duration-300 ${i < revealedRows ? 'opacity-100' : 'opacity-0'}`}>
                    <td className="p-3 text-pencil">{row.id}</td>
                    <td className="p-3">{row.name}</td>
                    <td className="p-3">{row.age}</td>
                    <td className="p-3 text-pencil">{row.dept}</td>
                    <td className="p-3">{row.hrs}</td>
                    <td className="p-3">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-1">
            {selectedCol ? (
              <div className="bg-[#fdfcfa] rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.06)] border-[1.5px] border-ink/12 p-6 animate-[fade-in_0.3s_forwards]">
                <h3 className="text-lg font-bold font-mono text-rust mb-4 border-b border-ink/10 pb-2">{selectedCol.label}</h3>
                <div className="flex flex-col gap-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-pencil">Type:</span>
                    <span className="font-bold text-ink bg-ink/5 px-2 rounded">{selectedCol.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pencil">Unique Values:</span>
                    <span className="font-bold">{selectedCol.unique}</span>
                  </div>
                  {selectedCol.min !== null && (
                    <div className="flex justify-between">
                      <span className="text-pencil">Min / Max:</span>
                      <span className="font-bold">{selectedCol.min} / {selectedCol.max}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-paper rounded-xl border-[1.5px] border-dashed border-ink/20 p-8 flex items-center justify-center text-center text-pencil">
                Click any column header to view its metadata.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCENE 2: Rows, columns, and cells (learn step 1)
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const [clickedTypes, setClickedTypes] = useState(new Set());
  const [activeItem, setActiveItem] = useState(null);
  const completeTimerRef = useRef(null);

  const colInfo = [
    'This is a variable — IDs for all students',
    'This is a variable — names for all students',
    'This is a variable — scores for all students'
  ];
  const colKeys = ['id', 'name', 'score'];

  const handleInteract = (type, info) => {
    setClickedTypes(prev => new Set([...prev, type]));
    setActiveItem({ type, info });
  };

  useEffect(() => {
    if (clickedTypes.size === 4) {
      completeTimerRef.current = setTimeout(onComplete, 3000);
      return () => clearTimeout(completeTimerRef.current);
    }
  }, [clickedTypes, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Every dataset follows the same structure: rows are observations, columns are variables, and cells are individual values. Click on each type to learn more.
      </p>

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-[#fdfcfa] rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.06)] border-[1.5px] border-ink/12 p-4 overflow-hidden">
          <table className="w-full text-left font-mono text-sm border-separate border-spacing-1">
            <thead>
              <tr>
                {colKeys.map((col, ci) => (
                  <th
                    key={col}
                    className="p-2 rounded bg-paper hover:bg-rust/10 transition-colors border border-transparent hover:border-rust/30 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleInteract('header', 'These are field names — they tell you what each column contains'); }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(rowNum => (
                <tr
                  key={rowNum}
                  className="cursor-pointer group"
                  onClick={(e) => { e.stopPropagation(); handleInteract('row', `This is one observation — everything we know about student #${rowNum}`); }}
                >
                  <td
                    className="p-2 rounded group-hover:bg-blue-50 transition-colors hover:!bg-amber-100 hover:!ring-2 hover:!ring-amber-400 relative"
                    onClick={(e) => { e.stopPropagation(); handleInteract('cell', `This is a single value — student ID is ${rowNum}`); }}
                  >
                    {rowNum}
                  </td>
                  <td
                    className="p-2 rounded group-hover:bg-blue-50 transition-colors hover:!bg-amber-100 hover:!ring-2 hover:!ring-amber-400 relative"
                    onClick={(e) => { e.stopPropagation(); handleInteract('cell', `This is a single value — student name is Student ${rowNum}`); }}
                  >
                    Student {rowNum}
                  </td>
                  <td
                    className="p-2 rounded group-hover:bg-blue-50 transition-colors hover:!bg-amber-100 hover:!ring-2 hover:!ring-amber-400 relative"
                    onClick={(e) => { e.stopPropagation(); handleInteract('cell', `This is a single value — the score is ${80 + rowNum}`); }}
                  >
                    {80 + rowNum}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Column click areas rendered as a row below the header */}
          <div className="flex gap-1 mt-2 px-1">
            {colKeys.map((col, ci) => (
              <div
                key={col}
                className="flex-1 rounded cursor-pointer py-2 text-center text-xs font-mono text-emerald-600 opacity-0 hover:opacity-100 bg-emerald-400/20 border-2 border-emerald-400 transition-opacity"
                onClick={(e) => { e.stopPropagation(); handleInteract('col', colInfo[ci]); }}
              >
                Select column
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-paper p-6 rounded-xl border-[1.5px] border-ink/12 min-h-[120px] flex items-center justify-center text-center font-medium shadow-sm">
            {activeItem ? activeItem.info : "Click on a row, a cell, the header, or an entire column."}
          </div>

          <div className="flex flex-col gap-2">
            <div className={`p-2 rounded flex items-center gap-2 text-sm font-mono ${clickedTypes.has('row') ? 'text-success bg-success/10' : 'text-pencil bg-ink/5'}`}>
              <CheckIcon className={`w-4 h-4 ${clickedTypes.has('row') ? 'opacity-100' : 'opacity-0'}`} /> Row (Observation)
            </div>
            <div className={`p-2 rounded flex items-center gap-2 text-sm font-mono ${clickedTypes.has('col') ? 'text-success bg-success/10' : 'text-pencil bg-ink/5'}`}>
              <CheckIcon className={`w-4 h-4 ${clickedTypes.has('col') ? 'opacity-100' : 'opacity-0'}`} /> Column (Variable)
            </div>
            <div className={`p-2 rounded flex items-center gap-2 text-sm font-mono ${clickedTypes.has('cell') ? 'text-success bg-success/10' : 'text-pencil bg-ink/5'}`}>
              <CheckIcon className={`w-4 h-4 ${clickedTypes.has('cell') ? 'opacity-100' : 'opacity-0'}`} /> Cell (Value)
            </div>
            <div className={`p-2 rounded flex items-center gap-2 text-sm font-mono ${clickedTypes.has('header') ? 'text-success bg-success/10' : 'text-pencil bg-ink/5'}`}>
              <CheckIcon className={`w-4 h-4 ${clickedTypes.has('header') ? 'opacity-100' : 'opacity-0'}`} /> Header (Field Name)
            </div>
          </div>

          {clickedTypes.size === 4 && (
            <div className="bg-rust text-white p-4 rounded-xl text-center font-bold shadow-md animate-[fade-in_0.5s_forwards]">
              This dataset has 4 observations, 3 variables, and 12 values.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3: Dirty data (learn step 2)
// ============================================================================

const Scene3 = ({ onComplete }) => {
  const [foundProblems, setFoundProblems] = useState([]);
  const [wrongClick, setWrongClick] = useState(null);
  const wrongTimerRef = useRef(null);
  const completeTimerRef = useRef(null);

  const data = [
    { rowId: 0, id: 1, age: 22, dept: 'Computer Science', score: 88 },
    { rowId: 1, id: 2, age: 21, dept: 'Mathematics', score: 75 },
    { rowId: 2, id: 3, age: null, dept: 'Physics', score: 92, problem: 'age', desc: 'Missing value: age is blank for this student' },
    { rowId: 3, id: 4, age: 20, dept: 'Compter Science', score: 65, problem: 'dept', desc: 'Typo: "Compter Science" instead of "Computer Science"' },
    { rowId: 4, id: 5, age: 24, dept: 'Information Tech', score: 150, problem: 'score', desc: 'Impossible value: exam score is 150 (max is 100)' },
    { rowId: 5, id: 6, age: 22, dept: 'Mathematics', score: 82, problem: 'id', desc: 'Duplicate student_id — this row is identical to another' },
    { rowId: 6, id: 6, age: 22, dept: 'Mathematics', score: 82, problem: 'id', desc: 'Duplicate row: student ID 6 appears twice' },
    { rowId: 7, id: 7, age: 'twenty', dept: 'Physics', score: 68, problem: 'age', desc: 'Wrong type: age is a string "twenty" instead of a number 20' },
  ];

  const totalProblems = 6;

  useEffect(() => {
    if (foundProblems.length === totalProblems) {
      completeTimerRef.current = setTimeout(onComplete, 2000);
      return () => clearTimeout(completeTimerRef.current);
    }
  }, [foundProblems.length, onComplete]);

  useEffect(() => {
    return () => clearTimeout(wrongTimerRef.current);
  }, []);

  const handleCellClick = (rowId, colKey, isProblem) => {
    const key = `${rowId}-${colKey}`;
    if (isProblem) {
      if (!foundProblems.includes(key)) {
        setFoundProblems([...foundProblems, key]);
      }
    } else {
      clearTimeout(wrongTimerRef.current);
      setWrongClick(key);
      wrongTimerRef.current = setTimeout(() => setWrongClick(null), 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Real-world data is never perfect. Find the {totalProblems} deliberate problems hidden in this dataset.
      </p>

      <div className="w-full max-w-md bg-paper rounded-full h-4 overflow-hidden border border-ink/10 relative">
        <div
          className="h-full bg-rust transition-all duration-500"
          style={{ width: `${(foundProblems.length / totalProblems) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {foundProblems.length} / {totalProblems} FOUND
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-[#fdfcfa] rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.06)] border-[1.5px] border-ink/12">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-paper border-b-2 border-ink/10">
            <tr>
              <th className="p-3 text-ink">student_id</th>
              <th className="p-3 text-ink">age</th>
              <th className="p-3 text-ink">department</th>
              <th className="p-3 text-ink">exam_score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.rowId} className="border-b border-ink/5 relative">
                {['id', 'age', 'dept', 'score'].map((col) => {
                  const isProblemCell = row.problem === col;
                  const key = `${row.rowId}-${col}`;
                  const isFound = foundProblems.includes(key);
                  const isWrong = wrongClick === key;

                  return (
                    <td
                      key={col}
                      onClick={() => handleCellClick(row.rowId, col, isProblemCell)}
                      className={`p-3 cursor-pointer transition-all border-2
                        ${isFound ? 'border-success bg-success/10 text-success font-bold' :
                          isWrong ? 'border-red-400 bg-red-50 animate-[shake_0.4s_ease-in-out]' :
                          'border-transparent hover:border-ink/20 hover:bg-ink/5'}`}
                    >
                      {row[col] === null ? <span className="text-ink/20 italic">null</span> : row[col]}
                      {isFound && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-ink text-white text-xs p-2 rounded z-10 w-48 shadow-lg pointer-events-none whitespace-normal">
                          {row.desc}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: Data types: the four families (learn step 3)
// ============================================================================

const Scene4 = ({ onComplete }) => {
  const [placedItems, setPlacedItems] = useState([]);
  const [shakeItemId, setShakeItemId] = useState(null);
  const shakeTimerRef = useRef(null);
  const completeTimerRef = useRef(null);

  const items = [
    { id: '1', value: 'exam_score: 87.5', type: 'num-cont' },
    { id: '2', value: 'number_of_courses: 4', type: 'num-disc' },
    { id: '3', value: 'department: Finance', type: 'cat' },
    { id: '4', value: 'is_scholarship: True', type: 'bool' },
    { id: '5', value: 'height: 175.3 cm', type: 'num-cont' },
    { id: '6', value: 'semester: 3', type: 'num-disc' },
    { id: '7', value: 'blood_type: A+', type: 'cat' },
    { id: '8', value: 'passed: False', type: 'bool' },
    { id: '9', value: 'temperature: 36.6', type: 'num-cont' },
    { id: '10', value: 'number_of_siblings: 2', type: 'num-disc' }
  ];

  const types = [
    { id: 'num-cont', label: 'Numeric (Continuous)', desc: 'Measurements, decimals' },
    { id: 'num-disc', label: 'Numeric (Discrete)', desc: 'Whole counts' },
    { id: 'cat', label: 'Categorical', desc: 'Groups, names, text' },
    { id: 'bool', label: 'Boolean', desc: 'True or False' }
  ];

  const handleDrop = (targetType, itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (item.type === targetType) {
      if (!placedItems.includes(itemId)) {
        setPlacedItems(prev => [...prev, itemId]);
      }
    } else {
      clearTimeout(shakeTimerRef.current);
      setShakeItemId(itemId);
      shakeTimerRef.current = setTimeout(() => setShakeItemId(null), 500);
    }
  };

  useEffect(() => {
    if (placedItems.length === items.length) {
      completeTimerRef.current = setTimeout(onComplete, 2500);
      return () => clearTimeout(completeTimerRef.current);
    }
  }, [placedItems.length, items.length, onComplete]);

  useEffect(() => {
    return () => clearTimeout(shakeTimerRef.current);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Not all data is the same. Understanding types helps you know what operations are possible. Drag each value into the correct type family.
      </p>

      <div className="flex flex-wrap gap-3 justify-center max-w-4xl min-h-[100px]">
        {items.filter(i => !placedItems.includes(i.id)).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('itemId', item.id)}
            className={`px-4 py-2 font-mono text-sm rounded-lg shadow-sm border-[1.5px] border-ink/12 bg-[#fdfcfa] cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform ${shakeItemId === item.id ? 'animate-[shake_0.4s_ease-in-out] bg-red-50 text-red-600 border-red-200' : ''}`}
          >
            {item.value}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {types.map(t => {
          const slotItems = items.filter(i => i.type === t.id && placedItems.includes(i.id));
          return (
            <div
              key={t.id}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(t.id, e.dataTransfer.getData('itemId'))}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 min-h-[250px] ${
                slotItems.length > 0 ? 'border-rust/30 bg-[#fdfcfa] shadow-md' : 'border-dashed border-ink/15 bg-paper'
              }`}
            >
              <div className="text-sm font-bold text-rust">{t.label}</div>
              <div className="text-xs text-pencil">{t.desc}</div>

              <div className="flex-1 w-full flex flex-col gap-2 mt-2">
                {slotItems.map(item => (
                  <div key={item.id} className="font-mono text-xs bg-rust/5 px-2 py-2 rounded w-full border border-rust/10 text-ink truncate">
                    {item.value}
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-3 text-xs font-bold bg-[#fdfcfa] border border-ink/10 px-2 py-1 rounded shadow-sm text-pencil">
                {slotItems.length}
              </div>
            </div>
          );
        })}
      </div>

      {placedItems.length === items.length && (
        <div className="bg-rust/10 border-l-4 border-rust p-4 rounded max-w-2xl text-ink font-medium animate-[fade-in_0.5s_forwards]">
          Types dictate math: You can calculate the average of exam_score (numeric) but not the average of department (categorical).
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Clean the survey data (apply step 0)
// ============================================================================

const Scene5 = ({ onComplete }) => {
  const [fixes, setFixes] = useState({});
  const [activeProblem, setActiveProblem] = useState(1);
  const completeTimerRef = useRef(null);

  const problems = [
    { id: 1, text: "Satisfaction value of 7 (should be 1-5 scale)", opts: ["Remove row", "Cap at 5", "Leave it"], best: "Cap at 5" },
    { id: 2, text: "Department 'IT' and 'Information Technology' mixed", opts: ["Standardize to one name", "Keep both"], best: "Standardize to one name" },
    { id: 3, text: "Missing response_date for 2 rows", opts: ["Remove rows", "Fill with median date", "Leave as missing"], best: "Leave as missing" },
    { id: 4, text: "Duplicate student_id", opts: ["Keep first entry", "Keep latest", "Keep both"], best: "Keep latest" },
    { id: 5, text: "Comment field with HTML tags: <b>Great!</b>", opts: ["Strip tags", "Remove column"], best: "Strip tags" }
  ];

  const handleFix = (probId, opt) => {
    setFixes(prev => ({ ...prev, [probId]: opt }));
    if (activeProblem < 5) setActiveProblem(p => p + 1);
  };

  const isComplete = Object.keys(fixes).length === 5;

  useEffect(() => {
    if (isComplete) {
      completeTimerRef.current = setTimeout(onComplete, 3000);
      return () => clearTimeout(completeTimerRef.current);
    }
  }, [isComplete, onComplete]);

  const progress = (Object.keys(fixes).length / 5) * 100;

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        WSB Merito ran a student satisfaction survey. Before analyzing the results, you need to clean the data. Make the right calls.
      </p>

      <div className="w-full max-w-md flex items-center gap-4">
        <span className="text-sm font-bold text-pencil">Data Quality:</span>
        <div className="flex-1 bg-paper rounded-full h-3 overflow-hidden border border-ink/10">
          <div className="h-full bg-success transition-all duration-1000" style={{ width: `${Math.max(43, progress)}%` }} />
        </div>
        <span className="text-sm font-bold text-success">{Math.max(43, Math.round(progress))}%</span>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#fdfcfa] rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.06)] border-[1.5px] border-ink/12 p-6 flex flex-col gap-6 relative overflow-hidden">
          {isComplete && (
            <div className="absolute inset-0 bg-success/5 flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="bg-[#fdfcfa] p-6 rounded-xl shadow-xl flex flex-col items-center gap-3">
                <CheckIcon className="w-12 h-12 text-success" />
                <h3 className="text-xl font-bold text-ink">Dataset Cleaned!</h3>
              </div>
            </div>
          )}

          <h3 className="font-bold text-ink flex items-center justify-between">
            Decision Log
            <span className="text-xs font-normal text-pencil px-2 py-1 bg-paper rounded">{Object.keys(fixes).length}/5 fixed</span>
          </h3>

          <div className="flex flex-col gap-4">
            {problems.map((p, i) => {
              const isActive = activeProblem === p.id && !fixes[p.id];
              const isFixed = !!fixes[p.id];

              return (
                <div key={p.id} className={`p-4 rounded-xl border-[1.5px] transition-all ${isActive ? 'border-rust ring-4 ring-rust/10 bg-[#fdfcfa] shadow-md' : isFixed ? 'border-success/30 bg-success/5' : 'border-ink/5 bg-paper opacity-50'}`}>
                  <div className="text-sm font-medium text-ink mb-3">{p.id}. {p.text}</div>

                  {isActive && (
                    <div className="flex flex-wrap gap-2">
                      {p.opts.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleFix(p.id, opt)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-ink/20 hover:border-rust hover:bg-rust/5 transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {isFixed && (
                    <div className="text-xs font-bold text-success flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" /> Selected: {fixes[p.id]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-6 font-mono text-xs overflow-hidden relative border border-[#333] shadow-2xl">
          <div className="text-pencil mb-4 pb-2 border-b border-stone-700">survey_results.csv preview</div>
          <div className="flex flex-col gap-2 opacity-80">
            <div className="text-pencil">id, satisfaction, dept, date, comment</div>

            <div className={`transition-colors duration-500 ${!fixes[1] ? 'text-red-400 bg-red-400/10 p-1 rounded -mx-1' : 'text-ink/70'}`}>
              101, {fixes[1] === 'Cap at 5' ? '5' : fixes[1] === 'Remove row' ? '<removed>' : '7'}, Math, 2024-01-01, OK
            </div>

            <div className={`transition-colors duration-500 ${!fixes[2] ? 'text-red-400 bg-red-400/10 p-1 rounded -mx-1' : 'text-ink/70'}`}>
              102, 4, {fixes[2] === 'Standardize to one name' ? 'IT' : 'Information Technology'}, 2024-01-02, Good
            </div>

            <div className={`transition-colors duration-500 ${!fixes[3] ? 'text-red-400 bg-red-400/10 p-1 rounded -mx-1' : 'text-ink/70'}`}>
              103, 5, IT, {fixes[3] === 'Fill with median date' ? '2024-01-02' : fixes[3] === 'Remove rows' ? '<removed>' : 'null'}, Great
            </div>

            <div className={`transition-colors duration-500 ${!fixes[4] ? 'text-red-400 bg-red-400/10 p-1 rounded -mx-1' : 'text-ink/70'}`}>
              104, 3, Physics, 2024-01-04, Hard
              <br/>
              {fixes[4] === 'Keep latest' || fixes[4] === 'Keep first entry' ? '<removed duplicate>' : '104, 3, Physics, 2024-01-04, Hard'}
            </div>

            <div className={`transition-colors duration-500 ${!fixes[5] ? 'text-red-400 bg-red-400/10 p-1 rounded -mx-1' : 'text-ink/70'}`}>
              105, 5, Math, 2024-01-05, {fixes[5] === 'Strip tags' ? 'Awesome' : '<b>Awesome</b>'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Dataset detective (challenge step 0)
// ============================================================================

const Scene6 = ({ onComplete }) => {
  const [answers, setAnswers] = useState({ q1: null, q2: null, q3: null, q4: null });
  const [q1Input, setQ1Input] = useState("");
  const completeTimerRef = useRef(null);

  const handleQ1Submit = (e) => {
    e.preventDefault();
    if (q1Input.trim() === '3') {
      setAnswers(prev => ({ ...prev, q1: true }));
    } else {
      setQ1Input("");
    }
  };

  const handleCellClick = (q, val) => {
    if (q === 'q2' && val === 'category') setAnswers(prev => ({ ...prev, q2: true }));
    if (q === 'q3' && val === '-500') setAnswers(prev => ({ ...prev, q3: true }));
  };

  const handleQ4 = (val) => {
    if (val === 'Date') setAnswers(prev => ({ ...prev, q4: true }));
  };

  const allDone = answers.q1 && answers.q2 && answers.q3 && answers.q4;

  useEffect(() => {
    if (allDone) {
      completeTimerRef.current = setTimeout(onComplete, 3000);
      return () => clearTimeout(completeTimerRef.current);
    }
  }, [allDone, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Final Challenge: Investigate this mystery sales report. Find the clues to earn your Data Detective badge.
      </p>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 overflow-x-auto bg-[#fdfcfa] rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.06)] border-[1.5px] border-ink/12 p-2">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-paper">
              <tr>
                <th className="p-2 border-b">id</th>
                <th className="p-2 border-b cursor-pointer hover:bg-rust/10 transition-colors rounded" onClick={() => handleCellClick('q2', 'date')}>date</th>
                <th className={`p-2 border-b cursor-pointer hover:bg-rust/10 transition-colors rounded ${answers.q2 ? 'bg-success/20 text-success' : ''}`} onClick={() => handleCellClick('q2', 'category')}>category</th>
                <th className="p-2 border-b cursor-pointer hover:bg-rust/10 transition-colors rounded" onClick={() => handleCellClick('q2', 'revenue')}>revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border-b border-ink/5">1</td><td className="p-2 border-b border-ink/5">2024-01-01</td><td className="p-2 border-b border-ink/5">Electronics</td><td className="p-2 border-b border-ink/5">1200</td></tr>
              <tr><td className="p-2 border-b border-ink/5">2</td><td className="p-2 border-b border-ink/5">2024-01-02</td><td className="p-2 border-b border-ink/5">Electrncs</td><td className="p-2 border-b border-ink/5">800</td></tr>
              <tr><td className="p-2 border-b border-ink/5">3</td><td className="p-2 border-b border-ink/5">2024-01-02</td><td className="p-2 border-b border-ink/5">Clothing</td><td className="p-2 border-b border-ink/5"></td></tr>
              <tr><td className="p-2 border-b border-ink/5">4</td><td className="p-2 border-b border-ink/5">2024-01-03</td><td className="p-2 border-b border-ink/5">Electronic</td><td className="p-2 border-b border-ink/5">1500</td></tr>
              <tr><td className="p-2 border-b border-ink/5">5</td><td className="p-2 border-b border-ink/5">2024-01-03</td><td className="p-2 border-b border-ink/5">Food</td><td className={`p-2 border-b border-ink/5 cursor-pointer hover:bg-rust/10 rounded transition-colors ${answers.q3 ? 'bg-success/20 text-success font-bold' : ''}`} onClick={() => handleCellClick('q3', '-500')}>-500</td></tr>
              <tr><td className="p-2 border-b border-ink/5">6</td><td className="p-2 border-b border-ink/5"></td><td className="p-2 border-b border-ink/5">Clothing</td><td className="p-2 border-b border-ink/5">300</td></tr>
              <tr><td className="p-2">7</td><td className="p-2">2024-01-05</td><td className="p-2"></td><td className="p-2">450</td></tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4">
          <div className={`p-4 rounded-xl border-[1.5px] transition-all ${answers.q1 ? 'bg-success/10 border-success text-success' : 'bg-[#fdfcfa] border-ink/12 shadow-sm'}`}>
            <div className="text-sm font-bold mb-2">1. How many rows have missing values?</div>
            {!answers.q1 ? (
              <form onSubmit={handleQ1Submit} className="flex gap-2">
                <input type="number" value={q1Input} onChange={e => setQ1Input(e.target.value)} className="w-20 px-3 py-1.5 border border-ink/20 rounded font-mono" placeholder="?" />
                <button type="submit" className="bg-rust text-white px-3 py-1.5 rounded text-xs font-bold">Check</button>
              </form>
            ) : <span className="font-mono text-xl">3</span>}
          </div>

          <div className={`p-4 rounded-xl border-[1.5px] transition-all ${answers.q2 ? 'bg-success/10 border-success text-success' : 'bg-[#fdfcfa] border-ink/12 shadow-sm'}`}>
            <div className="text-sm font-bold mb-2">2. Which column has the most inconsistent data?</div>
            {!answers.q2 ? <span className="text-xs text-pencil italic">Click the column header in the table</span> : <span className="font-mono text-lg">category</span>}
          </div>

          <div className={`p-4 rounded-xl border-[1.5px] transition-all ${answers.q3 ? 'bg-success/10 border-success text-success' : 'bg-[#fdfcfa] border-ink/12 shadow-sm'}`}>
            <div className="text-sm font-bold mb-2">3. Is there an outlier in the revenue column?</div>
            {!answers.q3 ? <span className="text-xs text-pencil italic">Click the suspicious value in the table</span> : <span className="font-mono text-lg">-500</span>}
          </div>

          <div className={`p-4 rounded-xl border-[1.5px] transition-all ${answers.q4 ? 'bg-success/10 border-success text-success' : 'bg-[#fdfcfa] border-ink/12 shadow-sm'}`}>
            <div className="text-sm font-bold mb-2">4. Correct data type for the 'date' column?</div>
            {!answers.q4 ? (
              <div className="flex flex-wrap gap-2">
                {['Numeric', 'Categorical', 'Date', 'Boolean'].map(opt => (
                  <button key={opt} onClick={() => handleQ4(opt)} className="px-3 py-1.5 text-xs border border-ink/20 rounded hover:bg-ink/5">{opt}</button>
                ))}
              </div>
            ) : <span className="font-mono text-lg">Date</span>}
          </div>
        </div>
      </div>

      {allDone && (
        <div className="bg-rust text-white px-8 py-6 rounded-2xl flex flex-col items-center gap-2 shadow-xl animate-[fade-in_0.5s_forwards] scale-110 mt-4">
          <div className="text-4xl mb-2">🕵️‍♂️</div>
          <h2 className="text-2xl font-bold font-serif tracking-wide">Data Detective Badge Unlocked!</h2>
          <p className="opacity-90 font-medium">You know how to read the matrix.</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ReadingDataLesson({ currentPhase, currentStep, onComplete }) {
  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const sceneKey = `${currentPhase}-${currentStep}`;

  const scenes = {
    'learn-0': <Scene1 onComplete={handleComplete} />,
    'learn-1': <Scene2 onComplete={handleComplete} />,
    'learn-2': <Scene3 onComplete={handleComplete} />,
    'learn-3': <Scene4 onComplete={handleComplete} />,
    'apply-0': <Scene5 onComplete={handleComplete} />,
    'challenge-0': <Scene6 onComplete={handleComplete} />,
  };

  return (
    <div className="animate-[fade-in_0.3s_ease-out]">
      {scenes[sceneKey] || <div className="text-pencil text-center py-12">Scene not found.</div>}
    </div>
  );
}
