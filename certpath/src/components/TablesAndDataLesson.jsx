import React, { useState, useEffect } from 'react';
import { CheckIcon } from './Icons';

// Simple ArrowRightIcon if not in Icons
const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

const SceneContainer = ({ title, children, nextEnabled, onNext, isLast, hideNav }) => (
  <div className="flex flex-col w-full h-full min-h-[600px] border border-stone-200/50 dark:border-white/10 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-xl shadow-2xl transition-all duration-500">
    <div className="p-8 flex-1 flex flex-col relative w-full h-full">
      <h2 className="text-2xl font-light text-stone-800 dark:text-stone-100 tracking-tight mb-8">
        {title}
      </h2>
      <div className="flex-1 w-full flex flex-col justify-center items-center max-w-4xl mx-auto h-full min-h-[400px]">
        {children}
      </div>
    </div>
    {!hideNav && (
      <div className="border-t border-stone-100/50 dark:border-white/5 p-4 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
        <div className="text-sm text-stone-500 dark:text-stone-400 font-mono tracking-widest uppercase">
          SQL & Databases • Tables & Data
        </div>
        <button
          onClick={onNext}
          disabled={!nextEnabled}
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            nextEnabled
              ? 'bg-ink text-white dark:bg-white dark:text-ink hover:scale-105 active:scale-95 shadow-md'
              : 'bg-stone-200 text-stone-400 dark:bg-white/5 dark:text-white/20 cursor-not-allowed hidden'
          }`}
        >
          {isLast ? 'Complete Lesson' : 'Next Scene'}
          <ArrowRightIcon className={`w-4 h-4 transition-transform ${nextEnabled ? 'group-hover:translate-x-1' : ''}`} />
        </button>
      </div>
    )}
  </div>
);

// ============================================================================
// SCENE 1: "More than a spreadsheet"
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const [fixedIssues, setFixedIssues] = useState(new Set());
  
  const issues = [
    { id: 'merged', title: 'Merged Cell', tooltip: 'Databases use atomic values — no merged cells allowed. Every row must be distinct.' },
    { id: 'mixed', title: 'Mixed Types', tooltip: 'Databases enforce data types — a number column only allows numbers, not text.' },
    { id: 'dup', title: 'Duplicate Row', tooltip: 'Databases use Primary Keys to ensure every row is uniquely identifiable.' },
    { id: 'missing', title: 'Missing Value', tooltip: 'Databases can enforce required fields (NOT NULL) to prevent missing data.' }
  ];

  const toggleIssue = (id) => {
    setFixedIssues(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  useEffect(() => {
    if (fixedIssues.size === 4) {
      setTimeout(() => onComplete(true), 1500);
    }
  }, [fixedIssues, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in relative z-10 w-full">
      <p className="text-graphite text-center max-w-2xl text-lg mb-4">
        You've used spreadsheets. A database is like a spreadsheet with superpowers — it can handle millions of rows, let hundreds of people use it at once, and never lose data.
      </p>
      
      <div className="flex flex-col md:flex-row w-full gap-8 justify-center items-start">
        
        {/* Messy Spreadsheet */}
        <div className="flex-1 flex flex-col gap-2 w-full max-w-sm">
          <h3 className="text-sm font-bold text-error uppercase tracking-widest mb-2 flex flex-col">
            <span>Messy Spreadsheet</span>
            <span className="text-xs font-normal text-stone-400 normal-case mt-1">Found {fixedIssues.size}/4 problems</span>
          </h3>
          <div className="border-2 border-stone-200 rounded-lg bg-white overflow-hidden shadow-sm flex flex-col font-sans text-sm pb-4">
            <div className="grid grid-cols-3 bg-stone-100 border-b border-stone-200 font-bold p-2 text-xs text-stone-500 uppercase">
              <div>Name</div>
              <div>Age</div>
              <div>Email</div>
            </div>
            
            {/* Merged Cell Issue */}
            <div 
              onClick={() => toggleIssue('merged')}
              className={`relative grid grid-cols-3 p-2 border-b border-stone-100 transition-all cursor-pointer group ${fixedIssues.has('merged') ? 'bg-success/10' : 'hover:bg-error/5'}`}
            >
              {!fixedIssues.has('merged') && <div className="absolute inset-0 border-2 border-error/40 rounded animate-pulse m-1 pointer-events-none"></div>}
              <div className="col-span-2 text-center text-stone-500 italic bg-stone-50 border border-dashed border-stone-300">Merged: Jan & Anna Kowalski</div>
              <div className="truncate">family@mail.com</div>
              
              {fixedIssues.has('merged') && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-ink text-white text-xs p-2 rounded shadow-xl z-20 w-48 text-center animate-fade-in">
                  {issues.find(i => i.id === 'merged').tooltip}
                </div>
              )}
            </div>

            {/* Mixed Types Issue */}
            <div 
              onClick={() => toggleIssue('mixed')}
              className={`relative grid grid-cols-3 p-2 border-b border-stone-100 transition-all cursor-pointer group ${fixedIssues.has('mixed') ? 'bg-success/10' : 'hover:bg-error/5'}`}
            >
              {!fixedIssues.has('mixed') && <div className="absolute inset-0 border-2 border-error/40 rounded animate-pulse m-1 pointer-events-none"></div>}
              <div>Piotr N.</div>
              <div className="text-error font-bold">"Twenty"</div>
              <div className="truncate">piotr@mail.com</div>
              
              {fixedIssues.has('mixed') && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-ink text-white text-xs p-2 rounded shadow-xl z-20 w-48 text-center animate-fade-in">
                  {issues.find(i => i.id === 'mixed').tooltip}
                </div>
              )}
            </div>

            {/* Duplicate Row Issue */}
            <div 
              onClick={() => toggleIssue('dup')}
              className={`relative grid grid-cols-3 p-2 border-b border-stone-100 transition-all cursor-pointer group ${fixedIssues.has('dup') ? 'bg-success/10' : 'hover:bg-error/5'}`}
            >
              {!fixedIssues.has('dup') && <div className="absolute inset-0 border-2 border-error/40 rounded animate-pulse m-1 pointer-events-none"></div>}
              <div>Kasia W.</div>
              <div>22</div>
              <div className="truncate text-error">kasia@mail.pl</div>
              
              {fixedIssues.has('dup') && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-ink text-white text-xs p-2 rounded shadow-xl z-20 w-48 text-center animate-fade-in">
                  {issues.find(i => i.id === 'dup').tooltip}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 p-2 border-b border-stone-100 text-stone-400 opacity-50">
              <div>Kasia W.</div>
              <div>22</div>
              <div className="truncate">kasia@mail.pl</div>
            </div>

            {/* Missing Value Issue */}
            <div 
              onClick={() => toggleIssue('missing')}
              className={`relative grid grid-cols-3 p-2 transition-all cursor-pointer group ${fixedIssues.has('missing') ? 'bg-success/10' : 'hover:bg-error/5'}`}
            >
              {!fixedIssues.has('missing') && <div className="absolute inset-0 border-2 border-error/40 rounded animate-pulse m-1 pointer-events-none"></div>}
              <div>Michal K.</div>
              <div>24</div>
              <div className="bg-error/10 text-error px-1 text-center font-bold">???</div>
              
              {fixedIssues.has('missing') && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-white text-xs p-2 rounded shadow-xl z-20 w-48 text-center animate-fade-in">
                  {issues.find(i => i.id === 'missing').tooltip}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Clean Database Table */}
        <div className={`flex-1 flex flex-col gap-2 w-full max-w-sm transition-all duration-700 ${fixedIssues.size === 4 ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none grayscale'}`}>
          <h3 className="text-sm font-bold text-success uppercase tracking-widest mb-2 flex flex-col">
            <span>Clean Database</span>
            <span className="text-xs font-normal text-stone-400 normal-case mt-1">Strict, atomic, and unique.</span>
          </h3>
          <div className="border-2 border-success/30 rounded-lg bg-white overflow-hidden shadow-lg flex flex-col font-mono text-xs">
            <div className="grid grid-cols-4 bg-success/10 border-b border-success/20 font-bold p-3 text-success uppercase tracking-wider">
              <div>id</div>
              <div>name</div>
              <div>age</div>
              <div className="truncate">email</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-stone-100">
              <div className="text-stone-400">1</div><div>Jan K.</div><div className="text-rust">25</div><div className="truncate text-blue-600">jan@mail.com</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-stone-100">
              <div className="text-stone-400">2</div><div>Anna K.</div><div className="text-rust">23</div><div className="truncate text-blue-600">anna@mail.com</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-stone-100">
              <div className="text-stone-400">3</div><div>Piotr N.</div><div className="text-rust">20</div><div className="truncate text-blue-600">piotr@mail.com</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-stone-100">
              <div className="text-stone-400">4</div><div>Kasia W.</div><div className="text-rust">22</div><div className="truncate text-blue-600">kasia@mail.pl</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b border-stone-100">
              <div className="text-stone-400">5</div><div>Michal K.</div><div className="text-rust">24</div><div className="truncate text-blue-600">michal@mail.com</div>
            </div>
            <div className="bg-stone-50 p-2 text-center text-stone-400 text-[10px] uppercase tracking-widest border-t border-stone-200">
              users table (5 rows)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// SCENE 2: "Anatomy of a table"
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const [hovered, setHovered] = useState(null); // 'column', 'row', 'cell', 'pk'
  const [discovered, setDiscovered] = useState(new Set());

  const handleHover = (type) => {
    setHovered(type);
    if (type) {
      setDiscovered(prev => new Set(prev).add(type));
    }
  };

  useEffect(() => {
    if (discovered.size === 4) {
      setTimeout(() => onComplete(true), 1500);
    }
  }, [discovered, onComplete]);

  const tooltips = {
    column: "This is a column (field). It has a name and a specific data type.",
    row: "This is a row (record). It represents one single entity (e.g. one student).",
    cell: "This is a cell. It holds one atomic value.",
    pk: "This is the primary key. Every row has a unique ID."
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <p className="text-graphite text-center max-w-2xl text-lg mb-4">
        A database table has rows (records) and columns (fields). Each column has a name and a data type. Hover over the parts of the table to explore.
      </p>

      <div className="font-mono bg-stone-100 px-4 py-2 rounded-full text-sm font-bold text-stone-600 mb-2">
        Found {discovered.size} / 4 elements
      </div>

      <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-xl shadow-xl overflow-visible font-mono text-sm">
        
        {hovered && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-2 rounded shadow-2xl z-30 transition-all text-center min-w-[300px] text-xs leading-relaxed animate-fade-in">
            {tooltips[hovered]}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-ink"></div>
          </div>
        )}

        {/* Table Header */}
        <div className="grid grid-cols-4 bg-stone-50 border-b-2 border-stone-200 relative">
          
          {/* Column Highlight Overlay */}
          <div className={`absolute top-0 bottom-[-250px] left-[25%] w-[25%] bg-blue-500/10 border-x-2 border-blue-500/40 pointer-events-none transition-opacity duration-300 z-10 ${hovered === 'column' ? 'opacity-100' : 'opacity-0'}`}></div>

          <div 
            onMouseEnter={() => handleHover('pk')}
            onMouseLeave={() => handleHover(null)}
            className={`p-4 font-bold text-stone-600 flex flex-col gap-1 cursor-help relative z-20 ${hovered === 'pk' ? 'bg-amber-100' : ''}`}
          >
            <span className="flex items-center gap-2"><span className="text-amber-500">🔑</span> id</span>
            <span className="text-[10px] text-stone-400 uppercase">INT</span>
          </div>

          <div 
            onMouseEnter={() => handleHover('column')}
            onMouseLeave={() => handleHover(null)}
            className={`p-4 font-bold text-stone-600 flex flex-col gap-1 cursor-help relative z-20 ${hovered === 'column' ? 'bg-blue-100' : ''}`}
          >
            <span>name</span>
            <span className="text-[10px] text-stone-400 uppercase">VARCHAR</span>
          </div>

          <div className="p-4 font-bold text-stone-600 flex flex-col gap-1">
            <span>email</span>
            <span className="text-[10px] text-stone-400 uppercase">VARCHAR</span>
          </div>

          <div className="p-4 font-bold text-stone-600 flex flex-col gap-1">
            <span>gpa</span>
            <span className="text-[10px] text-stone-400 uppercase">FLOAT</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="relative z-10">
          {[
            { id: 1, name: 'Jan Kowalski', email: 'jan@wsb.pl', gpa: '4.5' },
            { id: 2, name: 'Anna Nowak', email: 'anna@wsb.pl', gpa: '4.8' },
            { id: 3, name: 'Piotr Wisniewski', email: 'piotr@wsb.pl', gpa: '3.9' },
            { id: 4, name: 'Kasia Maj', email: 'kasia@wsb.pl', gpa: '4.2' },
            { id: 5, name: 'Michal Krol', email: 'michal@wsb.pl', gpa: '4.0' }
          ].map((row, i) => (
            <div 
              key={row.id}
              onMouseEnter={i === 2 ? () => handleHover('row') : undefined}
              onMouseLeave={i === 2 ? () => handleHover(null) : undefined}
              className={`grid grid-cols-4 border-b border-stone-100 transition-colors ${i === 2 && hovered === 'row' ? 'bg-green-100/50 outline outline-2 outline-green-400 z-20 relative' : 'hover:bg-stone-50'}`}
            >
              <div className={`p-4 text-stone-400 ${hovered === 'pk' ? 'font-bold text-amber-600 bg-amber-50/50' : ''}`}>{row.id}</div>
              <div className="p-4">{row.name}</div>
              <div className="p-4 text-Rust truncate">{row.email}</div>
              <div 
                onMouseEnter={i === 1 ? (e) => { e.stopPropagation(); handleHover('cell'); } : undefined}
                onMouseLeave={i === 1 ? (e) => { e.stopPropagation(); handleHover(null); } : undefined}
                className={`p-4 font-bold ${i === 1 && hovered === 'cell' ? 'bg-purple-200 text-purple-800' : 'text-Rust'}`}
              >
                {row.gpa}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ============================================================================
// SCENE 3: "Data types matter"
// ============================================================================
const Scene3 = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    id: 'abc', // should be number
    name: '12345', // should be text
    email: 'kasia@merito.pl', // correct
    gpa: 'excellent' // should be float
  });
  
  const [errors, setErrors] = useState({});
  const [inserted, setInserted] = useState(false);
  const [editing, setEditing] = useState(null);

  const correctTypes = {
    id: { type: 'INT', valid: (v) => !isNaN(v) && Number.isInteger(Number(v)) },
    name: { type: 'VARCHAR', valid: (v) => isNaN(v) && v.length > 0 },
    email: { type: 'VARCHAR', valid: (v) => v.includes('@') },
    gpa: { type: 'FLOAT', valid: (v) => !isNaN(v) && !Number.isInteger(Number(v)) || Number(v) % 1 !== 0 }
  };

  const handleInsert = () => {
    const newErrors = {};
    let hasError = false;
    
    if (!correctTypes.id.valid(formData.id)) { newErrors.id = 'Expected INT, got TEXT'; hasError = true; }
    if (!correctTypes.name.valid(formData.name)) { newErrors.name = 'Expected TEXT, got INT'; hasError = true; }
    if (!correctTypes.email.valid(formData.email)) { newErrors.email = 'Expected valid Email'; hasError = true; }
    if (!correctTypes.gpa.valid(formData.gpa) && !(!isNaN(formData.gpa))) { newErrors.gpa = 'Expected FLOAT, got TEXT'; hasError = true; }

    setErrors(newErrors);

    if (!hasError) {
      setInserted(true);
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const fixOptions = {
    id: ['abc', '6', 'nine'],
    name: ['12345', 'Tomek M.', 'true'],
    gpa: ['excellent', '4.3', 'A+']
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <p className="text-graphite text-center max-w-2xl text-lg mb-4">
        Every column has a data type that controls what values it can hold. Try to put the wrong type in — the database won't let you.
      </p>

      <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-xl overflow-hidden font-mono text-sm shadow-md">
        <div className="bg-stone-50 border-b border-stone-200 p-2 text-center text-xs text-stone-400 font-bold uppercase tracking-widest">
          students table
        </div>
        <div className="grid grid-cols-4 bg-stone-100 border-b border-stone-200 font-bold p-3 uppercase tracking-wider text-xs">
          <div className="flex flex-col">id <span className="text-[10px] text-stone-400 font-normal">INT</span></div>
          <div className="flex flex-col">name <span className="text-[10px] text-stone-400 font-normal">VARCHAR</span></div>
          <div className="flex flex-col">email <span className="text-[10px] text-stone-400 font-normal">VARCHAR</span></div>
          <div className="flex flex-col">gpa <span className="text-[10px] text-stone-400 font-normal">FLOAT</span></div>
        </div>
        <div className="grid grid-cols-4 p-3 border-b border-stone-100 text-stone-500">
          <div>1</div><div>Jan K.</div><div className="truncate">jan@wsb.pl</div><div>4.5</div>
        </div>
        <div className="grid grid-cols-4 p-3 border-b border-stone-100 text-stone-500">
          <div>2</div><div>Anna N.</div><div className="truncate">anna@wsb.pl</div><div>4.8</div>
        </div>
        
        {/* The newly inserted row sliding in */}
        {inserted && (
          <div className="grid grid-cols-4 p-3 bg-success/10 text-success border-b border-stone-100 animate-slide-up origin-bottom">
            <div className="font-bold">{formData.id}</div>
            <div className="font-bold">{formData.name}</div>
            <div className="truncate font-bold">{formData.email}</div>
            <div className="font-bold">{formData.gpa}</div>
          </div>
        )}
      </div>

      <div className={`w-full max-w-2xl bg-stone-50 border border-stone-200 p-6 rounded-xl flex flex-col gap-4 shadow-inner transition-all duration-500 ${inserted ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="font-bold text-stone-700 uppercase tracking-widest text-sm flex items-center gap-2">
          <span>Add New Row</span>
        </h3>
        
        <div className="grid grid-cols-4 gap-4 font-mono text-sm">
          {['id', 'name', 'email', 'gpa'].map(field => (
            <div key={field} className="flex flex-col gap-1 relative">
              <label className="text-xs text-stone-500">{field}</label>
              
              <div 
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  errors[field] 
                    ? 'border-error bg-error/10 text-error' 
                    : formData[field] !== (field==='email'?'kasia@merito.pl':(field==='id'?'abc':(field==='name'?'12345':'excellent'))) // crude check if changed
                      ? 'border-success text-success bg-success/5' 
                      : 'border-stone-300 bg-white'
                }`}
                onClick={() => {
                  if (fixOptions[field]) setEditing(editing === field ? null : field);
                }}
              >
                {formData[field]}
              </div>
              
              {errors[field] && (
                <div className="text-[10px] text-error font-bold mt-1 absolute top-full left-0 animate-fade-in w-max">
                  {errors[field]}
                </div>
              )}

              {/* Fix Dropdown */}
              {editing === field && fixOptions[field] && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-stone-300 rounded shadow-xl z-20 overflow-hidden">
                  {fixOptions[field].map(opt => (
                    <div 
                      key={opt}
                      className="p-2 hover:bg-stone-100 cursor-pointer text-xs"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, [field]: opt }));
                        setEditing(null);
                        setErrors(prev => ({ ...prev, [field]: null }));
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={handleInsert}
          className="mt-6 self-end px-6 py-2 bg-ink text-white rounded-full font-bold text-sm hover:bg-stone-800 transition-colors shadow-md"
        >
          {inserted ? 'Inserted ✓' : 'Insert Row'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SCENE 4: "Primary keys and uniqueness"
// ============================================================================
const Scene4 = ({ onComplete }) => {
  const [insertAttempted, setInsertAttempted] = useState(false);
  const [fixedId, setFixedId] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(null);

  const handleFix = (opt) => {
    if (opt === 6) {
      setFixedId(6);
      setInsertAttempted(false); // Clear error state for display
    } else {
      alert(opt === 'delete' ? "Valid technically, but destroys data!" : "Removing constraints defeats the purpose of a database!");
    }
  };

  useEffect(() => {
    if (fixedId === 6 && quizAnswered === 'id') {
      setTimeout(() => onComplete(true), 1500);
    }
  }, [fixedId, quizAnswered, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <p className="text-graphite text-center max-w-2xl text-lg mb-4">
        A primary key is a column where every value must be unique. It's how the database identifies each row — like a student ID number.
      </p>

      <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-xl overflow-hidden font-mono text-sm shadow-md">
        <div className="bg-stone-50 border-b border-stone-200 p-2 text-center text-xs text-stone-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="text-amber-500">🔑</span> students table
        </div>
        <div className="grid grid-cols-3 bg-stone-100 border-b border-stone-200 font-bold p-3 uppercase tracking-wider text-xs">
          <div>id (PK)</div>
          <div>name</div>
          <div>email</div>
        </div>
        
        {/* Existing Data */}
        <div className="grid grid-cols-3 p-3 border-b border-stone-100 text-stone-500"><div>1</div><div>Jan K.</div><div>jan@wsb.pl</div></div>
        <div className="grid grid-cols-3 p-3 border-b border-stone-100 text-stone-500"><div>2</div><div>Anna N.</div><div>anna@wsb.pl</div></div>
        <div className={`grid grid-cols-3 p-3 border-b border-stone-100 transition-colors duration-500 ${insertAttempted ? 'bg-error/20 text-error font-bold' : 'text-stone-500'}`}>
          <div>3</div><div>Piotr W.</div><div>piotr@wsb.pl</div>
        </div>
        <div className="grid grid-cols-3 p-3 border-b border-stone-100 text-stone-500"><div>4</div><div>Kasia M.</div><div>kasia@wsb.pl</div></div>
        <div className="grid grid-cols-3 p-3 border-b border-stone-100 text-stone-500"><div>5</div><div>Michal K.</div><div>michal@wsb.pl</div></div>

        {/* The new row trying to be inserted */}
        {fixedId === 6 ? (
          <div className="grid grid-cols-3 p-3 bg-success/10 text-success font-bold border-b border-stone-100 animate-slide-up">
            <div>6</div><div>Tomek L.</div><div>tomek@wsb.pl</div>
          </div>
        ) : (
          <div className={`grid grid-cols-3 p-3 transition-colors duration-500 ${insertAttempted ? 'bg-error/20 text-error font-bold line-through outline outline-2 outline-error relative z-10' : 'bg-stone-50 text-stone-500 outline outline-2 outline-dashed outline-stone-300 m-1 rounded'}`}>
            <div>3</div><div>Tomek L.</div><div>tomek@wsb.pl</div>
          </div>
        )}
      </div>

      {!fixedId ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl animate-fade-in">
          {!insertAttempted ? (
             <button 
               onClick={() => setInsertAttempted(true)}
               className="px-6 py-2 bg-ink text-white rounded-full font-bold text-sm hover:bg-stone-800 transition-colors shadow-md animate-pulse"
             >
               Insert Row
             </button>
          ) : (
            <div className="flex flex-col items-center w-full gap-4">
              <div className="text-error font-bold flex items-center gap-2 bg-error/10 px-4 py-2 rounded-lg border border-error/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Error: Duplicate primary key '3'
              </div>
              <div className="w-full flex justify-center gap-4">
                <button onClick={() => handleFix(6)} className="flex-1 py-3 bg-white border-2 border-dashed border-success hover:bg-success/5 rounded-xl font-bold text-success transition-all hover:-translate-y-1 shadow-sm">
                  Change ID to next available (6)
                </button>
                <button onClick={() => handleFix('delete')} className="flex-1 py-3 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-stone-500 transition-all shadow-sm">
                  Delete existing row with ID 3
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl bg-stone-50 border border-stone-200 p-6 rounded-xl animate-fade-in shadow-inner">
          <h3 className="font-bold text-stone-700">Quick Exercise: Which of these makes the best primary key?</h3>
          <div className="flex flex-col gap-2 w-full">
            {[
              { id: 'name', label: 'Student Name', detail: '(Names can repeat)', correct: false },
              { id: 'email', label: 'Student Email', detail: '(People change emails sometimes)', correct: false },
              { id: 'id', label: 'University Student ID Number', detail: '(Unique by design)', correct: true },
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => setQuizAnswered(opt.id)}
                className={`flex justify-between items-center p-4 rounded-lg border-2 transition-all ${
                  quizAnswered === opt.id 
                    ? (opt.correct ? 'bg-success/10 border-success text-success' : 'bg-error/10 border-error text-error')
                    : 'bg-white border-stone-200 hover:border-stone-400 text-stone-600'
                }`}
              >
                <span className="font-bold">{opt.label}</span>
                <span className={`text-xs ${quizAnswered === opt.id ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  {opt.detail}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ============================================================================
// SCENE 5: "Real World: Design the university database"
// ============================================================================
const Scene5 = ({ onComplete }) => {
  const [columns, setColumns] = useState([
    { id: 'c1', name: 'student_id', type: 'INT', table: null, isPK: true, belongsTo: 'students' },
    { id: 'c2', name: 'student_name', type: 'VARCHAR', table: null, belongsTo: 'students' },
    { id: 'c3', name: 'email', type: 'VARCHAR', table: null, belongsTo: 'students' },
    { id: 'c4', name: 'semester', type: 'INT', table: null, belongsTo: 'students' },
    { id: 'c5', name: 'course_id', type: 'INT', table: null, isPK: true, belongsTo: 'courses' },
    { id: 'c6', name: 'course_name', type: 'VARCHAR', table: null, belongsTo: 'courses' },
    { id: 'c7', name: 'professor', type: 'VARCHAR', table: null, belongsTo: 'courses' },
    { id: 'c8', name: 'credits', type: 'INT', table: null, belongsTo: 'courses' },
    { id: 'c9', name: 'enrollment_id', type: 'INT', table: null, isPK: true, belongsTo: 'enrollments' },
    { id: 'c10', name: 'student_id', type: 'INT', table: null, belongsTo: 'enrollments', isFK: true },
    { id: 'c11', name: 'course_id', type: 'INT', table: null, belongsTo: 'enrollments', isFK: true },
    { id: 'c12', name: 'grade', type: 'VARCHAR', table: null, belongsTo: 'enrollments' },
    { id: 'c13', name: 'enrollment_date', type: 'DATE', table: null, belongsTo: 'enrollments' },
  ].sort(() => Math.random() - 0.5));

  const tables = ['students', 'enrollments', 'courses'];

  const handleDrop = (tableId, colId) => {
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, table: tableId } : c));
  };

  const isComplete = columns.every(c => c.table === c.belongsTo);
  const unplaced = columns.filter(c => c.table === null);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 4000);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="text-graphite text-center max-w-2xl text-lg mb-2">
        WSB Merito needs a database for their student portal. Drag the columns into the correct tables.
      </p>

      {/* Table Blueprints */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        {/* SVG Relations when Complete */}
        {isComplete && (
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none animate-fade-in" style={{ minHeight: '300px' }}>
            {/* Very simple relationship lines conceptually drawing from left to middle, right to middle */}
            <path d="M 33% 100 Q 50% 120 50% 150" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" fill="none" className="opacity-50" />
            <path d="M 66% 100 Q 50% 120 50% 150" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" fill="none" className="opacity-50" />
            <text x="42%" y="130" fill="#f59e0b" fontSize="10" fontWeight="bold">Foreign Key</text>
            <text x="58%" y="130" fill="#f59e0b" fontSize="10" fontWeight="bold">Foreign Key</text>
          </svg>
        )}

        {tables.map(table => (
          <div 
            key={table}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(table, e.dataTransfer.getData('colId'))}
            className={`border-2 rounded-xl bg-white shadow-sm flex flex-col h-[300px] z-10 transition-colors ${
              isComplete ? 'border-success/50 bg-success/5' : 'border-stone-200'
            }`}
          >
            <div className="p-3 bg-ink text-white font-bold text-center rounded-t-lg uppercase tracking-widest text-xs flex justify-between items-center">
              <span>{table}</span>
              {isComplete && <CheckIcon className="w-4 h-4 text-success" />}
            </div>
            <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
              {columns.filter(c => c.table === table).map(c => (
                <div 
                  key={c.id}
                  draggable={!isComplete}
                  onDragStart={e => e.dataTransfer.setData('colId', c.id)}
                  className={`p-2 border rounded text-xs font-mono flex justify-between items-center bg-stone-50 cursor-grab ${c.table !== c.belongsTo ? 'border-error text-error' : (c.isPK ? 'border-amber-300 bg-amber-50 shadow-sm' : 'border-stone-200 text-stone-600')}`}
                >
                  <span className="font-bold flex items-center gap-1">
                    {c.isPK && <span className="text-amber-500">🔑</span>}
                    {c.name}
                  </span>
                  <span className="text-[9px] text-stone-400">{c.type}</span>
                </div>
              ))}
              {columns.filter(c => c.table === table).length === 0 && (
                <div className="m-auto text-stone-300 text-xs text-center border-2 border-dashed border-stone-200 p-4 rounded-lg w-full">
                  Drop columns here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Column Pool */}
      <div className={`w-full max-w-4xl p-6 bg-stone-50 border border-stone-200 rounded-xl transition-all ${isComplete ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100'}`}>
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Available Columns</h4>
        <div className="flex flex-wrap gap-2">
          {unplaced.map(c => (
             <div 
                key={c.id}
                draggable
                onDragStart={e => e.dataTransfer.setData('colId', c.id)}
                className="p-2 border border-stone-300 rounded text-xs font-mono flex justify-between gap-4 items-center bg-white shadow-sm cursor-grab hover:-translate-y-1 transition-transform"
              >
                <span className="font-bold text-stone-700">{c.name}</span>
                <span className="text-[10px] text-stone-400 bg-stone-100 px-1 rounded">{c.type}</span>
              </div>
          ))}
          {unplaced.length === 0 && !isComplete && (
            <div className="text-error text-sm animate-pulse">Some columns are in the wrong tables. Move them to fix!</div>
          )}
        </div>
      </div>
      
      {isComplete && (
        <div className="text-success font-bold text-xl animate-bounce mt-4 flex items-center gap-2">
          <CheckIcon className="w-8 h-8" /> Perfect Schema!
        </div>
      )}

    </div>
  );
}

// ============================================================================
// SCENE 6: "Challenge: Spot the schema errors"
// ============================================================================
const Scene6 = ({ onComplete }) => {
  const [fixedIssues, setFixedIssues] = useState(new Set());
  const [activeIssue, setActiveIssue] = useState(null);

  const issues = [
    {
      id: "prod_id", table: "products", cell: "id: 'one'",
      problem: "Primary Key is a string 'one' instead of an auto-incrementing integer.",
      options: [
        { text: "Change type to INT and value to 1", correct: true },
        { text: "Capitalize it to 'ONE'", correct: false }
      ]
    },
    {
      id: "prod_price", table: "products", cell: "price: '$9.99'",
      problem: "Price includes a '$' symbol, making it text instead of a number/decimal.",
      options: [
        { text: "Change column type to DECIMAL and value to 9.99", correct: true },
        { text: "Remove the decimal point", correct: false }
      ]
    },
    {
      id: "ord_cust", table: "orders", cell: "customer info",
      problem: "Customer details are duplicated in every order. This should be a separate table.",
      options: [
        { text: "Extract to a 'customers' table and use 'customer_id' foreign key here", correct: true },
        { text: "Make the email the primary key of orders", correct: false }
      ]
    },
    {
      id: "ord_prod", table: "orders", cell: "product: 'Widget'",
      problem: "Product is referenced by its name, which can change or be misspelled.",
      options: [
        { text: "Change to 'product_id' foreign key", correct: true },
        { text: "Make it a VARCHAR(255)", correct: false }
      ]
    },
    {
      id: "rev_pk", table: "reviews", cell: "Whole table lacks PK",
      problem: "The reviews table has no primary key to uniquely identify a review.",
      options: [
        { text: "Add an 'id' column as an auto-incrementing INT Primary Key", correct: true },
        { text: "Use the 'stars' column as the Primary Key", correct: false }
      ]
    }
  ];

  const handleFix = (isCorrect) => {
    if (isCorrect) {
      setFixedIssues(prev => new Set(prev).add(activeIssue));
      setActiveIssue(null);
    } else {
      alert("Not quite right. Think about database principles!");
    }
  };

  useEffect(() => {
    if (fixedIssues.size === 5) {
      setTimeout(() => onComplete(true), 2500);
    }
  }, [fixedIssues, onComplete]);

  const renderIssueCell = (issueId, label, isRow = false) => {
    const isFixed = fixedIssues.has(issueId);
    return (
      <div 
        onClick={() => !isFixed && setActiveIssue(issueId)}
        className={`p-2 transition-all cursor-pointer ${isFixed ? 'text-success font-bold bg-success/10 border border-success/30' : 'bg-error/10 text-error border border-error/40 hover:bg-error/20 outline-error outline-dashed outline-2 outline-offset-[-2px]'}`}
      >
        {isFixed ? (
          <span className="flex items-center gap-1"><CheckIcon className="w-3 h-3" /> Fixed</span>
        ) : label}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="flex justify-between items-center w-full max-w-4xl">
        <p className="text-graphite text-lg">
          Final Boss: This e-commerce schema is a mess. Click the highlighted errors to fix them.
        </p>
        <div className="bg-stone-100 px-4 py-2 font-mono text-sm font-bold text-stone-600 rounded-full">
          {fixedIssues.size} / 5 Fixed
        </div>
      </div>

      <div className="w-full flex gap-4 items-start justify-center relative flex-wrap">
        
        {/* Active Issue Modal */}
        {activeIssue && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="bg-white border text-center border-stone-200 p-8 rounded-2xl shadow-2xl max-w-md flex flex-col gap-6 animate-scale-in">
              <h3 className="font-bold text-error text-xl">Design Problem Detected</h3>
              <p className="text-stone-600">{issues.find(i => i.id === activeIssue).problem}</p>
              <div className="flex flex-col gap-3">
                {issues.find(i => i.id === activeIssue).options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleFix(opt.correct)}
                    className="p-3 border border-stone-200 rounded-xl hover:bg-stone-50 text-left transition-colors font-medium text-stone-700 hover:border-ink hover:text-ink"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              <button onClick={() => setActiveIssue(null)} className="text-stone-400 text-sm hover:underline mt-2">Cancel</button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden font-mono text-xs w-[280px] shadow-sm">
          <div className="bg-stone-800 text-white font-bold p-2 text-center uppercase">products</div>
          <div className="grid grid-cols-4 bg-stone-100 border-b font-bold p-2 text-[10px] uppercase">
            <div>id</div><div className="col-span-1">name</div><div>price</div><div>cat</div>
          </div>
          <div className="grid grid-cols-4 p-2">
            {renderIssueCell("prod_id", '"one"')}
            <div className="p-2 border border-transparent">Widget</div>
            {renderIssueCell("prod_price", '$9.99')}
            <div className="p-2 border border-transparent truncate">Electronics</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden font-mono text-xs w-[500px] shadow-sm">
          <div className="bg-stone-800 text-white font-bold p-2 text-center uppercase">orders</div>
          <div className="grid grid-cols-6 bg-stone-100 border-b font-bold p-2 text-[10px] uppercase">
            <div>ord_id</div><div className="col-span-2">customer_info</div><div className="col-span-2">product</div><div>qty</div>
          </div>
          <div className="grid grid-cols-6 p-2 items-center gap-1">
            <div className="p-2">1</div>
            <div className="col-span-2">
              {renderIssueCell("ord_cust", "Jan K., jan@mail.pl")}
            </div>
            <div className="col-span-2">
              {renderIssueCell("ord_prod", "'Widget'")}
            </div>
            <div className="p-2">2</div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden font-mono text-xs w-[300px] shadow-sm">
          <div className="bg-stone-800 text-white font-bold p-2 text-center uppercase flex justify-between items-center">
            <span>reviews</span>
          </div>
          <div className="p-0 border-b border-error">
             {renderIssueCell("rev_pk", "TABLE WARNING: NO PRIMARY KEY DEFINED")}
          </div>
          <div className="grid grid-cols-3 bg-stone-100 border-b font-bold p-2 text-[10px] uppercase">
            <div>prod_id</div><div>review</div><div>stars</div>
          </div>
          <div className="grid grid-cols-3 p-2">
            <div>1</div><div>"Great!"</div><div>5</div>
          </div>
        </div>

      </div>

      {fixedIssues.size === 5 && (
         <div className="mt-8 bg-success text-white p-6 rounded-2xl shadow-xl flex flex-col items-center animate-bounce gap-2">
           <span className="text-2xl font-bold">Lesson Complete!</span>
           <span className="opacity-90">You have successfully mastered the basics of tables and data.</span>
         </div>
      )}

    </div>
  );
}


// ============================================================================
// MAIN EXPORT
// ============================================================================
export default function TablesAndDataLesson({ currentPhase, currentStep, onComplete }) {
  let CurrentScene = Scene1;
  let isLastInLesson = false;

  if (currentPhase === 'learn') {
    if (currentStep === 0) CurrentScene = Scene1;
    if (currentStep === 1) CurrentScene = Scene2;
    if (currentStep === 2) CurrentScene = Scene3;
    if (currentStep === 3) CurrentScene = Scene4;
  } else if (currentPhase === 'apply') {
    CurrentScene = Scene5;
  } else if (currentPhase === 'challenge') {
    CurrentScene = Scene6;
    isLastInLesson = true;
  }

  const [sceneComplete, setSceneComplete] = useState(false);

  useEffect(() => {
    setSceneComplete(false);
  }, [currentPhase, currentStep]);

  const titles = {
    learn0: "More than a spreadsheet",
    learn1: "Anatomy of a table",
    learn2: "Data types matter",
    learn3: "Primary keys and uniqueness",
    apply0: "Real World: Design the university database",
    challenge0: "Challenge: Spot the schema errors"
  };

  const titleKey = currentPhase + currentStep;
  const title = titles[titleKey] || "Tables & Data";

  return (
    <SceneContainer
      title={title}
      nextEnabled={sceneComplete}
      onNext={() => onComplete()}
      isLast={isLastInLesson}
      hideNav={false}
    >
      <CurrentScene onComplete={(val) => setSceneComplete(val)} />
    </SceneContainer>
  );
}
