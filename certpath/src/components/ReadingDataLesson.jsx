import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Database, Search, 
  AlertTriangle, PlayCircle, Eye, ChevronRight, HelpCircle
} from 'lucide-react';
import { CheckIcon } from './Icons';

// --- SHARED DATA ---
const SURVEY_DATA = [
  { student_id: 1, name: "Alice Jenkins", age: 20, department: "Computer Science", hours_studied: 15, exam_score: 85 },
  { student_id: 2, name: "Bob Smith", age: 19, department: "Business", hours_studied: 10, exam_score: 72 },
  { student_id: 3, name: "Charlie Davis", age: 21, department: "Engineering", hours_studied: 22, exam_score: 91 },
  { student_id: 4, name: "Diana Prince", age: 22, department: "Mathematics", hours_studied: 18, exam_score: 88 },
  { student_id: 5, name: "Evan Wright", age: 20, department: "Physics", hours_studied: 12, exam_score: 76 },
  { student_id: 6, name: "Fiona Gallagher", age: 23, department: "Literature", hours_studied: 14, exam_score: 82 },
  { student_id: 7, name: "George Costanza", age: 21, department: "Architecture", hours_studied: 8, exam_score: 65 },
  { student_id: 8, name: "Hannah Abbott", age: 19, department: "Biology", hours_studied: 20, exam_score: 89 },
  { student_id: 9, name: "Ian Malcolm", age: 22, department: "Chaos Theory", hours_studied: 25, exam_score: 95 },
  { student_id: 10, name: "Julia Roberts", age: 20, department: "Arts", hours_studied: 16, exam_score: 84 },
];

const METADATA = {
  student_id: { name: 'student_id', type: 'Numeric', unique: 10, range: '1-10', preview: 'ID sequence' },
  name: { name: 'name', type: 'Text', unique: 10, range: 'A-Z', preview: 'Unique names' },
  age: { name: 'age', type: 'Numeric', unique: 5, range: '19-23', preview: 'Age distribution' },
  department: { name: 'department', type: 'Text', unique: 10, range: 'N/A', preview: 'Categories' },
  hours_studied: { name: 'hours_studied', type: 'Numeric (Continuous)', unique: 9, range: '8-25', preview: 'Distribution' },
  exam_score: { name: 'exam_score', type: 'Numeric', unique: 10, range: '65-95', preview: 'Score range' },
};

// --- SCENE 1: What does data look like? ---
function Scene1({ onComplete }) {
  const [loadedRows, setLoadedRows] = useState(0);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [exploredColumns, setExploredColumns] = useState(new Set());

  // Typewriter effect
  useEffect(() => {
    if (hasStartedLoading && loadedRows < SURVEY_DATA.length) {
      const timer = setTimeout(() => {
        setLoadedRows((prev) => prev + 1);
      }, 150); // 150ms per row
      return () => clearTimeout(timer);
    }
  }, [hasStartedLoading, loadedRows]);

  const handleColumnClick = (key) => {
    if (loadedRows < SURVEY_DATA.length) return;
    setActiveColumn(key);
    const newExplored = new Set(exploredColumns).add(key);
    setExploredColumns(newExplored);
    
    if (newExplored.size === Object.keys(METADATA).length) {
      setTimeout(onComplete, 1500);
    }
  };

  const columns = Object.keys(METADATA);

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-8 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20">
        <h2 className="text-2xl font-bold text-ink mb-2">What does data look like?</h2>
        <p className="text-ink/70">
          Data is everywhere — every time you scroll social media, order food, or check your grades, you're generating data. 
          But raw data is just rows and columns until you learn to read it.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white border border-pencil/20 rounded-xl overflow-hidden shadow-sm relative text-sm">
          {!hasStartedLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <button 
                onClick={() => setHasStartedLoading(true)}
                className="bg-rust text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-rust/90 transition transform hover:scale-105 flex items-center space-x-2"
              >
                <Database className="w-5 h-5" />
                <span>Load Dataset</span>
              </button>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-paper border-b border-pencil/20">
                  {columns.map((col) => (
                    <th 
                      key={col} 
                      onClick={() => handleColumnClick(col)}
                      className={`p-3 font-semibold text-ink/70 uppercase tracking-wider text-xs cursor-pointer transition 
                        ${hasStartedLoading && loadedRows === SURVEY_DATA.length ? 'hover:bg-rust/5 hover:text-rust' : ''} 
                        ${activeColumn === col ? 'bg-rust/10 text-rust' : ''}
                        ${exploredColumns.has(col) ? 'border-b-2 border-success' : ''}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SURVEY_DATA.map((row, idx) => {
                  const isVisible = idx < loadedRows;
                  return (
                    <tr key={idx} className={`border-b border-pencil/10 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                      {columns.map((col) => (
                        <td key={col} className={`p-3 text-ink/80 ${activeColumn === col ? 'bg-rust/5' : ''}`}>
                          {hasStartedLoading ? row[col] : '••••'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-72">
          {activeColumn ? (
            <div className="bg-paper p-6 rounded-xl border border-pencil/20 shadow-sm sticky top-6 animate-fade-in-up">
              <h3 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Column Explorer</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-ink/50">Column Name</div>
                  <div className="font-mono text-rust font-medium">{METADATA[activeColumn].name}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/50">Data Type</div>
                  <div className="font-medium text-ink">{METADATA[activeColumn].type}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/50">Unique Values</div>
                  <div className="font-medium text-ink">{METADATA[activeColumn].unique}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/50">Min/Max Range</div>
                  <div className="font-medium text-ink">{METADATA[activeColumn].range}</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-pencil/20">
                <div className="text-xs text-ink/50 mb-2">Progress</div>
                <div className="flex gap-1">
                  {columns.map(c => (
                    <div key={c} className={`h-2 flex-1 rounded-full ${exploredColumns.has(c) ? 'bg-success' : 'bg-pencil/20'}`} />
                  ))}
                </div>
                {exploredColumns.size === columns.length && (
                  <div className="text-sm text-success font-medium mt-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> Dataset Explored!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-pencil/30 rounded-xl flex items-center justify-center p-6 text-center text-ink/50 bg-white">
              {hasStartedLoading && loadedRows === SURVEY_DATA.length 
                ? "Click any column header to explore its metadata."
                : "Load the dataset to begin."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SCENE 2: Rows, columns, and cells ---
function Scene2({ onComplete }) {
  const [hoveredType, setHoveredType] = useState(null);
  const [clickedTypes, setClickedTypes] = useState(new Set());
  
  const handleClick = (type) => {
    const newTypes = new Set(clickedTypes).add(type);
    setClickedTypes(newTypes);
    setHoveredType(type);
    if (newTypes.size === 4) {
      setTimeout(onComplete, 2500);
    }
  };

  const isComplete = clickedTypes.size === 4;

  const getHighlightClass = (type) => {
    if (hoveredType === type) return 'bg-rust/20 ring-2 ring-rust z-10 relative';
    if (clickedTypes.has(type)) return 'bg-rust/5';
    return '';
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20">
        <h2 className="text-2xl font-bold text-ink mb-2">Rows, columns, and cells</h2>
        <p className="text-ink/70">
          Every dataset follows the same structure: rows are observations (one per subject), columns are variables (things you measured), and cells are individual values.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative">
        <div className="flex-1 bg-white border border-pencil/20 rounded-xl overflow-hidden shadow-sm relative text-sm"
             onMouseLeave={() => setHoveredType(null)}
        >
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse cursor-default">
              <thead>
                <tr 
                  className={`bg-paper border-b border-pencil/20 cursor-pointer transition ${getHighlightClass('header')} hover:bg-rust/10`}
                  onClick={() => handleClick('header')}
                  onMouseEnter={() => setHoveredType('header')}
                >
                  <th className="p-3 font-semibold text-ink/70">student_id</th>
                  <th className="p-3 font-semibold text-ink/70">name</th>
                  <th className="p-3 font-semibold text-ink/70">age</th>
                  <th className="p-3 font-semibold text-ink/70">department</th>
                  <th className="p-3 font-semibold text-ink/70">hours_studied</th>
                  <th className="p-3 font-semibold text-ink/70">exam_score</th>
                </tr>
              </thead>
              <tbody>
                {SURVEY_DATA.slice(0, 5).map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-pencil/10 transition group
                      ${idx === 3 && hoveredType === 'row' ? 'bg-rust/20 ring-2 ring-rust z-10 relative' : 
                        hoveredType === 'row' ? 'opacity-50' : ''}
                      ${idx === 3 ? 'cursor-pointer' : ''}`}
                    onClick={() => { if(idx === 3) handleClick('row') }}
                    onMouseEnter={() => { if(idx === 3) setHoveredType('row') }}
                  >
                    <td className="p-3 text-ink/80">{row.student_id}</td>
                    <td className="p-3 text-ink/80">{row.name}</td>
                    <td className="p-3 text-ink/80">{row.age}</td>
                    <td className="p-3 text-ink/80">{row.department}</td>
                    
                    {/* Column 4 (hours_studied) is our 'column' target demo */}
                    <td 
                      className={`p-3 text-ink/80 transition cursor-pointer
                        ${hoveredType === 'column' ? 'bg-rust/20 ring-2 ring-rust z-20 relative' : ''}
                        ${hoveredType !== 'column' && hoveredType ? 'opacity-50' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleClick('column'); }}
                      onMouseEnter={() => setHoveredType('column')}
                    >
                      {row.hours_studied}
                    </td>

                    {/* Cell target demo for row 3 (Diana Prince), exam_score  */}
                    {idx === 3 ? (
                      <td 
                        className={`p-3 text-ink/80 font-bold transition cursor-pointer
                          ${hoveredType === 'cell' ? 'bg-rust/20 ring-2 ring-rust z-30 relative' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleClick('cell'); }}
                        onMouseEnter={() => setHoveredType('cell')}
                      >
                        {row.exam_score}
                      </td>
                    ) : (
                      <td className={`p-3 text-ink/80 ${hoveredType === 'cell' ? 'opacity-50' : ''}`}>
                        {row.exam_score}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 text-center text-ink/50 text-xs bg-paper/50">
              Interactive structural map. Tap parts of the table to identify them. <br/>
              (Try row #4, the 'hours_studied' column, the header, and Diana's exam score)
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="bg-paper p-6 rounded-xl border border-pencil/20 shadow-sm flex-1">
            <h3 className="text-sm font-semibold text-ink/50 uppercase tracking-wider mb-4">Structure Guide</h3>
            
            {hoveredType === 'row' && (
              <div className="animate-fade-in-up text-rust">
                <div className="font-bold text-lg mb-1">Observation (Row)</div>
                <p className="text-sm">This is one observation — everything we know about student #4 in a single record.</p>
              </div>
            )}
            
            {hoveredType === 'column' && (
              <div className="animate-fade-in-up text-rust">
                <div className="font-bold text-lg mb-1">Variable (Column)</div>
                <p className="text-sm">This is a variable — the "hours_studied" recorded for all students.</p>
              </div>
            )}
            
            {hoveredType === 'cell' && (
              <div className="animate-fade-in-up text-rust">
                <div className="font-bold text-lg mb-1">Value (Cell)</div>
                <p className="text-sm">This is a single value — specifically, student #4 scored 88 on her exam.</p>
              </div>
            )}
            
            {hoveredType === 'header' && (
              <div className="animate-fade-in-up text-rust">
                <div className="font-bold text-lg mb-1">Fields (Header Row)</div>
                <p className="text-sm">These are field names — they tell you exactly what each column contains.</p>
              </div>
            )}

            {!hoveredType && !isComplete && (
              <div className="text-ink/60 text-sm italic py-4">Hover over or tap the table elements left to reveal their structural names.</div>
            )}
            
            <div className="mt-8 space-y-2">
              <div className="flex items-center text-sm gap-2">
                <div className={`w-3 h-3 rounded-full ${clickedTypes.has('row') ? 'bg-success' : 'bg-pencil/30'}`} /> Row identified
              </div>
              <div className="flex items-center text-sm gap-2">
                <div className={`w-3 h-3 rounded-full ${clickedTypes.has('column') ? 'bg-success' : 'bg-pencil/30'}`} /> Column identified
              </div>
              <div className="flex items-center text-sm gap-2">
                <div className={`w-3 h-3 rounded-full ${clickedTypes.has('cell') ? 'bg-success' : 'bg-pencil/30'}`} /> Cell identified
              </div>
              <div className="flex items-center text-sm gap-2">
                <div className={`w-3 h-3 rounded-full ${clickedTypes.has('header') ? 'bg-success' : 'bg-pencil/30'}`} /> Header identified
              </div>
            </div>
          </div>
          
          {isComplete && (
            <div className="bg-success/10 border border-success/30 p-4 rounded-xl shadow-sm animate-fade-in-up text-success-dark">
              <div className="font-bold flex items-center mb-1"><CheckCircle className="w-5 h-5 mr-1" /> Structure Mastered</div>
              <p className="text-sm text-success-dark/80">This entire dataset has 10 observations, 6 variables, and 60 single values.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SCENE 3: Dirty data ---
const DIRTY_DATA = [
  { rowId: 0, student_id: "101", name: "Ali", age: 20, department: "Engineering", exam_score: 85, problemField: null, desc: "" },
  { rowId: 1, student_id: "102", name: "Ben", age: "", department: "Business", exam_score: 72, problemField: 'age', desc: "Missing value: age is blank for this student" },
  { rowId: 2, student_id: "103", name: "Cid", age: 21, department: "Compter Science", exam_score: 91, problemField: 'department', desc: "Typo: 'Compter' isn't a department" },
  { rowId: 3, student_id: "104", name: "Dan", age: 22, department: "Arts", exam_score: 150, problemField: 'exam_score', desc: "Impossible score: 150 (max is 100)" },
  { rowId: 4, student_id: "105", name: "Eve", age: 20, department: "Physics", exam_score: 76, problemField: null, desc: "" },
  { rowId: 5, student_id: "105", name: "Eve", age: 20, department: "Physics", exam_score: 76, problemField: 'student_id', desc: "Duplicate row: same student_id appears twice" },
  { rowId: 6, student_id: "106", name: "Fox", age: "twenty", department: "Literature", exam_score: 82, problemField: 'age', desc: "Type error: string 'twenty' instead of number 20" },
  { rowId: 7, student_id: "107", name: "Gia", age: 21, department: "Architecture", exam_score: 65, problemField: null, desc: "" },
];

function Scene3({ onComplete }) {
  const [foundProblems, setFoundProblems] = useState(new Set());
  const [feedback, setFeedback] = useState({ type: '', msg: 'Scan the dataset and tap on cells that look wrong.' });
  const totalProblems = 5;

  const handleCellClick = (rowId, field) => {
    const row = DIRTY_DATA[rowId];
    if (row.problemField === field) {
      if (!foundProblems.has(rowId)) {
        const newSet = new Set(foundProblems).add(rowId);
        setFoundProblems(newSet);
        setFeedback({ type: 'success', msg: `Correct! ${row.desc}` });
        if (newSet.size === totalProblems) {
          setTimeout(onComplete, 3000);
        }
      }
    } else {
      setFeedback({ type: 'error', msg: "This one looks fine. Keep looking!" });
    }
  };

  const getCellClass = (rowId, field) => {
    if (DIRTY_DATA[rowId].problemField === field && foundProblems.has(rowId)) {
      return "bg-success/20 text-success-dark font-medium border-success/50 ring-1 ring-inset ring-success";
    }
    return "hover:bg-rust/5 cursor-pointer transition";
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20 flex gap-6 items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-ink mb-2">Dirty data</h2>
          <p className="text-ink/70">
            Real-world data is never perfect. Missing values, typos, and inconsistencies are everywhere. 
            Learning to spot them is the first skill of a data analyst. Find all 5 problems below.
          </p>
        </div>
        <div className="w-32 flex flex-col items-center">
          <div className="text-sm font-semibold text-ink/50 mb-1">Data Health</div>
          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-bold transition-colors duration-500 bg-white"
               style={{
                 borderColor: foundProblems.size === totalProblems ? '#10B981' : '#F4A261',
                 color: foundProblems.size === totalProblems ? '#10B981' : '#F4A261'
               }}>
            {foundProblems.size === totalProblems ? '100%' : `${Math.floor((foundProblems.size / totalProblems) * 100)}%`}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className={`p-4 rounded-xl text-sm font-medium transition flex items-center gap-2
          ${feedback.type === 'success' ? 'bg-success/10 text-success-dark border border-success/20' : 
            feedback.type === 'error' ? 'bg-error/10 text-error-dark border border-error/20' : 
            'bg-pencil/5 text-ink/60 border border-pencil/10'}`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
           feedback.type === 'error' ? <XCircle className="w-5 h-5" /> : 
           <AlertTriangle className="w-5 h-5" />}
          {feedback.msg}
        </div>

        <div className="bg-white border border-pencil/20 rounded-xl overflow-hidden shadow-sm text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-paper border-b border-pencil/20">
                  {['student_id', 'name', 'age', 'department', 'exam_score'].map(col => (
                     <th key={col} className="p-3 font-semibold text-ink/70">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DIRTY_DATA.map((row) => (
                  <tr key={row.rowId} className="border-b border-pencil/10 group">
                    <td onClick={() => handleCellClick(row.rowId, 'student_id')} className={`p-3 border-r border-pencil/5 ${getCellClass(row.rowId, 'student_id')}`}>{row.student_id}</td>
                    <td onClick={() => handleCellClick(row.rowId, 'name')} className={`p-3 border-r border-pencil/5 ${getCellClass(row.rowId, 'name')}`}>{row.name}</td>
                    <td onClick={() => handleCellClick(row.rowId, 'age')} className={`p-3 border-r border-pencil/5 ${getCellClass(row.rowId, 'age')}`}>
                      {row.age === "" ? <span className="text-ink/30 italic">null</span> : row.age}
                    </td>
                    <td onClick={() => handleCellClick(row.rowId, 'department')} className={`p-3 border-r border-pencil/5 ${getCellClass(row.rowId, 'department')}`}>{row.department}</td>
                    <td onClick={() => handleCellClick(row.rowId, 'exam_score')} className={`p-3 ${getCellClass(row.rowId, 'exam_score')}`}>{row.exam_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SCENE 4: Data types: the four families ---
const DATA_TYPES = [
  { id: 'nc', name: 'Numeric (Continuous)', desc: 'Measurements or fractions (e.g. 1.5, 3.14)' },
  { id: 'nd', name: 'Numeric (Discrete)', desc: 'Whole numbers or counts (e.g. 1, 2, 3)' },
  { id: 'cat', name: 'Categorical', desc: 'Groups or labels (e.g. Red, Blue, Tech)' },
  { id: 'bool', name: 'Boolean', desc: 'True/False or Yes/No ONLY' },
];

const TYPE_EXAMPLES = [
  { id: 1, text: "Wait time: 5.2 mins", type: 'nc' },
  { id: 2, text: "Pets owned: 3", type: 'nd' },
  { id: 3, text: "Industry: Finance", type: 'cat' },
  { id: 4, text: "Is verified: True", type: 'bool' },
  { id: 5, text: "Height: 182 cm", type: 'nc' },
  { id: 6, text: "Children: 0", type: 'nd' },
  { id: 7, text: "Priority: High", type: 'cat' },
  { id: 8, text: "Subscribed: False", type: 'bool' },
  { id: 9, text: "Revenue: $15.99", type: 'nc' },
  { id: 10, text: "Errors: 4", type: 'nd' },
];

function Scene4({ onComplete }) {
  const [placed, setPlaced] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [feedback, setFeedback] = useState("");

  const pendingItems = TYPE_EXAMPLES.filter(e => !placed[e.id]);
  const currentItem = pendingItems.length > 0 ? pendingItems[0] : null;

  const handleTypeClick = (typeId) => {
    if (!currentItem) return;
    
    if (currentItem.type === typeId) {
      setPlaced(prev => ({...prev, [currentItem.id]: typeId}));
      setFeedback("Correct! " + currentItem.text + " is " + DATA_TYPES.find(t=>t.id === typeId).name);
      if (pendingItems.length === 1) { // this was the last one
        setTimeout(onComplete, 3500);
      }
    } else {
      setFeedback("Oops! Look closer at the value.");
      // shake animation can be done with external classes, we'll just show text
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20">
        <h2 className="text-2xl font-bold text-ink mb-2">Data types: the four families</h2>
        <p className="text-ink/70">
          Not all data is the same. Understanding a variable's type helps you know what mathematical operations and charts are possible.
          Sort the examples below.
        </p>
      </div>

      <div className="flex flex-col items-center flex-1 gap-8">
        
        {/* Active item to sort */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-rust w-full max-w-lg text-center min-h-[140px] flex flex-col justify-center items-center transition-all duration-300">
          {currentItem ? (
            <>
              <div className="text-sm font-semibold text-rust uppercase tracking-wider mb-2">Classify this value</div>
              <div className="text-2xl font-mono text-ink bg-paper px-6 py-3 rounded-lg border border-pencil/20 shadow-inner">
                {currentItem.text}
              </div>
            </>
          ) : (
            <div className="text-success-dark text-xl font-bold flex flex-col items-center animate-fade-in-up">
              <CheckCircle className="w-12 h-12 mb-2" />
              All sorted! You can calculate the average of Numeric data, but not Categorical data.
            </div>
          )}
          <div className="h-6 mt-4 text-sm font-medium text-ink/60">{feedback}</div>
        </div>

        {/* 4 Buckets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {DATA_TYPES.map(type => {
            const itemCount = Object.values(placed).filter(v => v === type.id).length;
            return (
              <button 
                key={type.id}
                onClick={() => handleTypeClick(type.id)}
                disabled={!currentItem}
                className="flex flex-col p-6 rounded-xl border-2 border-pencil/20 bg-white hover:border-rust hover:bg-rust/5 transition text-left group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-pencil/20 disabled:hover:bg-white relative overflow-hidden"
              >
                <div className="font-bold text-ink mb-1 group-hover:text-rust transition-colors">{type.name}</div>
                <div className="text-xs text-ink/60 min-h-[32px]">{type.desc}</div>
                
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-paper flex items-center justify-center text-xs font-bold text-ink/50 border border-pencil/10 font-mono">
                  {itemCount}
                </div>
              </button>
            )
          })}
        </div>

        {/* Progress indicator */}
        <div className="w-full max-w-lg mt-auto pb-4">
          <div className="flex justify-between text-xs text-ink/50 mb-2 font-medium">
            <span>Progress</span>
            <span>{Object.keys(placed).length} / 10</span>
          </div>
          <div className="w-full h-2 bg-pencil/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rust transition-all duration-500"
              style={{ width: `${(Object.keys(placed).length / 10) * 100}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
// --- SCENE 5: Real World: Clean the survey data ---
const SURVEY_RAW = [
  { id: 1, s_id: "S001", sat: 4, dept: "Business", date: "2023-10-01", comments: "Good layout" },
  { id: 2, s_id: "S002", sat: 7, dept: "IT", date: "2023-10-02", comments: "Too hard" },
  { id: 3, s_id: "S003", sat: 5, dept: "Information Technology", date: "2023-10-02", comments: "Loved it" },
  { id: 4, s_id: "S004", sat: 3, dept: "Engineering", date: null, comments: "Okay" },
  { id: 5, s_id: "S005", sat: 4, dept: "Arts", date: "2023-10-03", comments: "Great instructors" },
  { id: 6, s_id: "S002", sat: 2, dept: "IT", date: "2023-10-04", comments: "Changed my mind" },
  { id: 7, s_id: "S006", sat: 5, dept: "Business", date: "2023-10-04", comments: "<b>Excellent!</b>" },
  { id: 8, s_id: "S007", sat: 4, dept: "Engineering", date: null, comments: "Needs examples" },
  { id: 9, s_id: "S008", sat: 5, dept: "IT", date: "2023-10-05", comments: "Perfect" },
  { id: 10, s_id: "S009", sat: 1, dept: "Information Technology", date: "2023-10-05", comments: "Not what I expected" },
  { id: 11, s_id: "S010", sat: 3, dept: "Arts", date: "2023-10-06", comments: "<i>Average</i> course" },
  { id: 12, s_id: "S011", sat: 4, dept: "Business", date: "2023-10-06", comments: "Solid content" },
];

const FIXES = [
  { id: 1, 
    desc: "Problem 1: Satisfaction score of 7 on row 2 (scale is 1-5).",
    opts: ["Remove row", "Cap at 5", "Leave it"],
    correct: "Cap at 5" },
  { id: 2, 
    desc: "Problem 2: Mixed naming 'IT' and 'Information Technology'.",
    opts: ["Standardize to one name", "Leave as is"],
    correct: "Standardize to one name" },
  { id: 3, 
    desc: "Problem 3: Missing response dates for rows 4 and 8.",
    opts: ["Remove rows", "Fill with median date", "Leave as missing"],
    correct: "Remove rows" },
  { id: 4, 
    desc: "Problem 4: Duplicate student_id 'S002'.",
    opts: ["Keep first entry", "Keep latest", "Keep both"],
    correct: "Keep latest" },
  { id: 5, 
    desc: "Problem 5: Comments contain HTML tags (<b>, <i>).",
    opts: ["Strip tags", "Remove column"],
    correct: "Strip tags" }
];

function Scene5({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(SURVEY_RAW);
  const [feedback, setFeedback] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const applyFix = (opt) => {
    if (isAnimating) return;
    const currentFix = FIXES[step];
    if (opt !== currentFix.correct) {
      setFeedback("That might not be the best approach here. Try another option!");
      setTimeout(() => setFeedback(""), 2500);
      return;
    }

    setFeedback(`Correct! Implementing fix: "${opt}"...`);
    setIsAnimating(true);
    
    setTimeout(() => {
      let newData = [...data];
      if (step === 0) newData[1] = {...newData[1], sat: 5};
      if (step === 1) newData = newData.map(r => ({...r, dept: r.dept === 'Information Technology' ? 'IT' : r.dept}));
      if (step === 2) newData = newData.filter(r => r.date !== null);
      if (step === 3) newData = newData.filter(r => !(r.s_id === 'S002' && r.sat === 7)); // remove first entry by S002
      if (step === 4) newData = newData.map(r => ({...r, comments: r.comments.replace(/<[^>]+>/g, '')}));
      
      setData(newData);
      setFeedback("");
      setIsAnimating(false);
      
      const next = step + 1;
      setStep(next);
      if (next === FIXES.length) {
        setTimeout(onComplete, 4000);
      }
    }, 1200);
  };

  const currentFix = FIXES[step];
  const isDone = step === FIXES.length;

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20 flex gap-6 items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-ink mb-2">Real World: Clean the survey data</h2>
          <p className="text-ink/70">
            WSB Merito ran a student satisfaction survey. Before analyzing the results, you need to clean the data.
            Review the problems below and choose the best standard practice to fix them.
          </p>
        </div>
        {!isDone && (
           <div className="w-32 flex flex-col items-end text-sm text-ink/50">
             <div className="font-bold">Cleaning...</div>
             <div>Step {step + 1} of 5</div>
           </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white border border-pencil/20 rounded-xl overflow-hidden shadow-sm text-xs relative">
            {isAnimating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10" />}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-paper border-b border-pencil/20">
                  <th className="p-2 font-semibold text-ink/70">student_id</th>
                  <th className="p-2 font-semibold text-ink/70">satisfaction</th>
                  <th className="p-2 font-semibold text-ink/70">department</th>
                  <th className="p-2 font-semibold text-ink/70">date</th>
                  <th className="p-2 font-semibold text-ink/70">comments</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => {
                  // highlight issue for current step visually
                  let isIssue = false;
                  if (step === 0 && row.sat > 5) isIssue = true;
                  if (step === 1 && row.dept === 'Information Technology') isIssue = true;
                  if (step === 2 && row.date === null) isIssue = true;
                  if (step === 3 && row.s_id === 'S002') isIssue = true;
                  if (step === 4 && row.comments.includes('<')) isIssue = true;
                  
                  return (
                    <tr key={idx} className={`border-b border-pencil/10 ${isIssue ? 'bg-error/10 text-error-dark border-error/20 font-medium' : 'text-ink/80'}`}>
                      <td className="p-2 border-r border-pencil/5">{row.s_id}</td>
                      <td className="p-2 border-r border-pencil/5">{row.sat}</td>
                      <td className="p-2 border-r border-pencil/5">{row.dept}</td>
                      <td className="p-2 border-r border-pencil/5">{row.date === null ? <span className="italic opacity-50">null</span> : row.date}</td>
                      <td className="p-2 truncate max-w-[150px]">{row.comments}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-80">
          {!isDone ? (
            <div className={`bg-paper p-6 rounded-xl border border-pencil/20 shadow-sm transition ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
              <h3 className="text-rust font-bold mb-4">{currentFix.desc}</h3>
              <div className="space-y-3">
                {currentFix.opts.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => applyFix(opt)}
                    className="w-full text-left p-3 rounded-lg border border-pencil/20 bg-white hover:border-rust hover:bg-rust/5 transition text-sm font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback && (
                 <div className="mt-4 text-sm font-medium text-rust animate-fade-in">{feedback}</div>
              )}
            </div>
          ) : (
             <div className="bg-success/10 border border-success/30 p-8 rounded-xl shadow-sm text-center flex flex-col items-center justify-center h-full">
               <CheckCircle className="w-16 h-16 text-success-dark mb-4" />
               <h3 className="text-xl font-bold text-success-dark mb-2">Data is Clean!</h3>
               <p className="text-success-dark/80 text-sm">
                 You successfully handled all anomalies. Data quality jumped to 100%. Ready for analysis!
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SCENE 6: Challenge: Dataset detective ---
const MYSTERY_DATA = [
  { id: 1, date: "10-10", category: "Electronics", rev: "$120" },
  { id: 2, date: "10-10", category: "Electrncs", rev: "$45" },
  { id: 3, date: null, category: "Books", rev: "$12" },
  { id: 4, date: "10-11", category: "Electronics", rev: "-$500" },
  { id: 5, date: "10-11", category: "Books", rev: "$25" },
  { id: 6, date: "10-12", category: "Books", rev: null },
  { id: 7, date: "10-12", category: "Apparel", rev: "$55" },
  { id: 8, date: "10-13", category: "electro", rev: "$210" },
  { id: 9, date: "10-13", category: "Apparel", rev: "$30" },
  { id: 10, date: "10-14", category: "Books", rev: "$14" },
  { id: 11, date: "10-14", category: null, rev: "$60" },
  { id: 12, date: "10-15", category: "Apparel", rev: "$40" },
  { id: 13, date: "10-15", category: "Electronics", rev: "$110" },
  { id: 14, date: "10-16", category: "Books", rev: "$22" },
  { id: 15, date: "10-16", category: "Apparel", rev: "$95" }
];

const QUESTIONS = [
  { id: 1, label: "Q1", q: "How many rows have missing values?", type: "button", opts: [1, 2, 3, 4], a: 3 },
  { id: 2, label: "Q2", q: "Which column has the most inconsistent data?", type: "col", a: "category" },
  { id: 3, label: "Q3", q: "Is there an outlier in the revenue column?", type: "cell", a: "-$500" },
  { id: 4, label: "Q4", q: "What's the correct data type for the 'date' column?", type: "button", opts: ["Numeric", "Categorical", "Date", "Boolean"], a: "Date" }
];

function Scene6({ onComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [badges, setBadges] = useState(0);
  const [feedback, setFeedback] = useState("");

  const currentQ = QUESTIONS[qIndex];
  const isDone = qIndex >= QUESTIONS.length;

  const handleAnswer = (answer) => {
    if (isDone) return;
    if (answer === currentQ.a) {
      setFeedback("Correct! You earned a badge.");
      setBadges(prev => prev + 1);
      setTimeout(() => {
        setFeedback("");
        setQIndex(prev => prev + 1);
        if (qIndex + 1 === QUESTIONS.length) {
          setTimeout(onComplete, 4000);
        }
      }, 1500);
    } else {
      setFeedback("Not quite right. Look closer at the table!");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink mb-2">Challenge: Dataset detective</h2>
          <p className="text-ink/70">
            A messy sales report from a small shop. Scan the data and answer the questions.
          </p>
        </div>
        <div className="flex bg-white px-4 py-2 rounded-full border border-pencil/20 gap-2 items-center text-sm font-bold text-rust">
          <Search className="w-4 h-4" /> 
          Badges: {badges} / 4
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        <div className="w-full lg:w-72">
          {!isDone ? (
            <div className="bg-rust/5 border border-rust/20 p-6 rounded-xl shadow-sm h-full flex flex-col">
              <div className="text-xs font-bold text-rust uppercase tracking-wider mb-2">{currentQ.label}</div>
              <h3 className="font-bold text-lg text-ink mb-6">{currentQ.q}</h3>
              
              {currentQ.type === "button" && (
                <div className="flex flex-col gap-2">
                  {currentQ.opts.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="p-3 bg-white border border-pencil/20 rounded-lg hover:border-rust hover:text-rust transition font-medium text-sm text-left"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === "col" && (
                <div className="text-sm text-ink/60 italic bg-paper p-4 rounded-lg flex items-start gap-2 border border-pencil/20">
                  <PlayCircle className="w-5 h-5 text-rust shrink-0 mt-0.5" />
                  Tap the correct column header in the table to answer.
                </div>
              )}

              {currentQ.type === "cell" && (
                <div className="text-sm text-ink/60 italic bg-paper p-4 rounded-lg flex items-start gap-2 border border-pencil/20">
                  <PlayCircle className="w-5 h-5 text-rust shrink-0 mt-0.5" />
                  Tap the suspicious cell in the revenue column.
                </div>
              )}

              {feedback && (
                 <div className="mt-8 text-sm font-bold animate-fade-in text-success-dark bg-success/10 p-3 rounded-lg border border-success/30 text-center">
                   {feedback}
                 </div>
              )}
            </div>
          ) : (
            <div className="bg-rust text-white p-8 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center">
               <Search className="w-16 h-16 opacity-80 mb-4" />
               <h3 className="text-2xl font-bold mb-2">Data Detective!</h3>
               <p className="opacity-90 text-sm">
                 You successfully investigated the dataset and found all anomalies. Lesson complete!
               </p>
            </div>
          )}
        </div>

        <div className="flex-1 bg-white border border-pencil/20 rounded-xl overflow-hidden shadow-sm text-xs relative h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-paper border-b border-pencil/20">
                  <th className="p-2 font-semibold text-ink/70">date</th>
                  <th 
                    className={`p-2 font-semibold text-ink/70 ${currentQ?.type === 'col' ? 'hover:bg-rust/10 cursor-pointer transition' : ''}`}
                    onClick={() => currentQ?.type === 'col' ? handleAnswer("category") : null}
                  >
                    category
                  </th>
                  <th className="p-2 font-semibold text-ink/70">rev</th>
                </tr>
              </thead>
              <tbody>
                {MYSTERY_DATA.map((row) => (
                  <tr key={row.id} className="border-b border-pencil/10 text-ink/80">
                    <td className="p-2 border-r border-pencil/5">
                      {row.date === null ? <span className="opacity-40 italic">null</span> : row.date}
                    </td>
                    <td className="p-2 border-r border-pencil/5">
                      {row.category === null ? <span className="opacity-40 italic">null</span> : row.category}
                    </td>
                    <td 
                      className={`p-2 ${currentQ?.type === 'cell' ? 'hover:bg-rust/10 cursor-pointer transition' : ''}`}
                      onClick={() => currentQ?.type === 'cell' ? handleAnswer(row.rev) : null}
                    >
                      {row.rev === null ? <span className="opacity-40 italic">null</span> : row.rev}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ReadingDataLesson({ currentPhase = 'learn', currentStep = 0, onComplete }) {
  const getScene = () => {
    if (currentPhase === 'learn') {
      if (currentStep === 0) return <Scene1 onComplete={onComplete} />;
      if (currentStep === 1) return <Scene2 onComplete={onComplete} />;
      if (currentStep === 2) return <Scene3 onComplete={onComplete} />;
      if (currentStep === 3) return <Scene4 onComplete={onComplete} />;
    } else if (currentPhase === 'apply') {
      if (currentStep === 0) return <Scene5 onComplete={onComplete} />;
    } else if (currentPhase === 'challenge') {
      if (currentStep === 0) return <Scene6 onComplete={onComplete} />;
    }
    return <div>Completed!</div>;
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-pencil/10">
      {getScene()}
    </div>
  );
}
