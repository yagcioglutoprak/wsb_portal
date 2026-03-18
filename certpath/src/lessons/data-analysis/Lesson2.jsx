import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CheckIcon } from '../../components/Icons';
import { sounds } from '../../hooks/useSound';

// ============================================================================
// SHARED COMPONENTS
// ============================================================================
const Button = ({ children, onClick, active, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
      active 
        ? 'bg-rust text-white shadow-md' 
        : disabled 
          ? 'bg-ink/5 text-ink/40 cursor-not-allowed' 
          : 'bg-[#fdfcfa] border-[1.5px] border-ink/12 text-ink hover:border-rust/50 hover:bg-rust/5'
    } ${className}`}
  >
    {children}
  </button>
);

const ScatterTabContent = () => {
  const dots = useMemo(() => [...Array(30)].map((_, i) => {
    const x = 40 + Math.random() * 320;
    const y = 170 - (x * 0.3) - Math.random() * 60;
    return { x, y, i };
  }), []);

  return (
    <div className="w-full h-full flex flex-col items-center animate-[fade-in_0.3s_ease-out] relative">
      <svg className="w-full h-48 max-w-md" viewBox="0 0 400 200">
        <line x1="20" y1="180" x2="380" y2="180" stroke="#e5e5e5" strokeWidth="2" />
        <line x1="20" y1="20" x2="20" y2="180" stroke="#e5e5e5" strokeWidth="2" />
        {dots.map(({ x, y, i }) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#DF5433" className="opacity-60 hover:opacity-100 hover:r-6 transition-all cursor-pointer">
            <title>Student #{i+1}: {Math.round(x/2)}cm, {Math.round(200-y)}kg</title>
          </circle>
        ))}
      </svg>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-pencil">Best for: relationships between two numbers</div>
    </div>
  );
};

// ============================================================================
// SCENE 1: Why visualize? (learn step 0)
// ============================================================================
const Scene1 = ({ onComplete }) => {
  const [showChart, setShowChart] = useState(false);
  const [wrongChart, setWrongChart] = useState(null);
  const [reasonSelected, setReasonSelected] = useState(false);
  const scores = [45, 62, 75, 88, 92, 71, 84, 95, 68, 77, 81, 79, 85, 90, 73, 82, 76, 89, 94, 65];
  
  // Group into bins for the histogram
  const bins = [
    { label: '40-50', count: scores.filter(s => s >= 40 && s < 50).length },
    { label: '50-60', count: scores.filter(s => s >= 50 && s < 60).length },
    { label: '60-70', count: scores.filter(s => s >= 60 && s < 70).length },
    { label: '70-80', count: scores.filter(s => s >= 70 && s < 80).length },
    { label: '80-90', count: scores.filter(s => s >= 80 && s < 90).length },
    { label: '90-100', count: scores.filter(s => s >= 90 && s <= 100).length },
  ];
  
  const maxCount = Math.max(...bins.map(b => b.count));

  useEffect(() => {
    if (reasonSelected) {
      const id = setTimeout(onComplete, 2000);
      return () => clearTimeout(id);
    }
  }, [reasonSelected, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-[fade-in_0.5s_ease-out]">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Staring at a table of numbers tells you nothing. One chart tells you everything.
      </p>

      {!showChart ? (
        <div className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-5 gap-2 bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] font-mono text-sm">
            {scores.map((score, i) => (
              <div key={i} className="px-3 py-2 bg-ink/5 rounded text-center">{score}</div>
            ))}
          </div>
          <Button onClick={() => { sounds.pop(); setShowChart(true); }} className="bg-rust text-white border-transparent hover:bg-rust/90">
            Show as chart
          </Button>
        </div>
      ) : wrongChart !== 'pie' ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
          <div className="w-full bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">
            <h3 className="text-center font-bold text-ink mb-4">Exam Scores Distribution</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-8">
              {bins.map((bin, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div 
                    className="w-full bg-rust rounded-t-sm transition-all duration-1000 ease-out group-hover:bg-rust/80 relative"
                    style={{ height: `${(bin.count / maxCount) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {bin.count}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-pencil">{bin.label}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-ink/80 text-center max-w-2xl text-lg font-medium animate-[fade-in_1s_ease-out]">
            Suddenly the pattern is obvious: most students scored between 70-90.
          </p>
          <div className="w-full pt-8 border-t border-ink/10 flex flex-col items-center gap-4">
            <p className="font-medium text-ink">Which of these charts is WRONG for this data?</p>
            <div className="flex gap-4">
              <div onClick={() => { sounds.wrong(); setWrongChart('bar'); }} className="cursor-pointer bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/12 hover:border-rust/50 hover:shadow-md transition-all flex flex-col items-center gap-2 w-32">
                <svg width="40" height="40" viewBox="0 0 40 40"><rect x="5" y="15" width="8" height="25" fill="#DF5433"/><rect x="16" y="5" width="8" height="35" fill="#DF5433"/><rect x="27" y="20" width="8" height="20" fill="#DF5433"/></svg>
                <span className="text-sm">Bar Chart</span>
              </div>
              <div onClick={() => { sounds.wrong(); setWrongChart('line'); }} className="cursor-pointer bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/12 hover:border-rust/50 hover:shadow-md transition-all flex flex-col items-center gap-2 w-32">
                <svg width="40" height="40" viewBox="0 0 40 40"><polyline points="5,30 15,10 25,20 35,5" fill="none" stroke="#DF5433" strokeWidth="3"/></svg>
                <span className="text-sm">Line Chart</span>
              </div>
              <div onClick={() => { sounds.correct(); setWrongChart('pie'); }} className="cursor-pointer bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/12 hover:border-rust/50 hover:shadow-md transition-all flex flex-col items-center gap-2 w-32">
                <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="#DF5433" strokeWidth="8" strokeDasharray="25 75"/><circle cx="20" cy="20" r="16" fill="none" stroke="#2a9d8f" strokeWidth="8" strokeDasharray="40 60" strokeDashoffset="-25"/></svg>
                <span className="text-sm">Pie Chart</span>
              </div>
            </div>
            {wrongChart && wrongChart !== 'pie' && <span className="text-error text-sm font-medium animate-[shake_0.4s_ease-in-out]">Not quite. Think about how we show continuous ranges.</span>}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-[fade-in_0.5s_ease-out]">
          <div className="bg-error/10 border-error border-[1.5px] p-6 rounded-xl text-center max-w-md">
            <svg className="w-16 h-16 mx-auto mb-4 text-error" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="25 75"/><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="40 60" strokeDashoffset="-25"/></svg>
            <h3 className="font-bold text-error text-xl mb-2">Yes, the Pie Chart is wrong.</h3>
            <p className="text-ink/80 text-sm mb-4">Why is a pie chart a bad choice for exam scores?</p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => { sounds.correct(); setReasonSelected(true); }} active={reasonSelected} className="text-left text-sm">
                Pie charts are for parts of a whole, not continuous scores.
              </Button>
              <Button onClick={() => { sounds.wrong(); }} disabled={reasonSelected} className="text-left text-sm">
                Pie charts can only show up to 3 values.
              </Button>
            </div>
            {reasonSelected && (
              <div className="mt-4 flex items-center justify-center gap-2 text-success font-bold animate-[fade-in_0.5s_ease-out]">
                <CheckIcon className="w-5 h-5" /> Correct!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCENE 2: The chart family (learn step 1)
// ============================================================================
const Scene2 = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState('bar');
  const [explored, setExplored] = useState(new Set(['bar']));
  const [orientation, setOrientation] = useState('vertical');
  const [linePointY, setLinePointY] = useState(50);
  const [piePulled, setPiePulled] = useState(false);
  const [quizState, setQuizState] = useState({});

  const handleTabChange = (tab) => {
    sounds.pop();
    setActiveTab(tab);
    setExplored(prev => new Set([...prev, tab]));
  };

  const isAllExplored = explored.size === 4;

  const quiz = [
    { id: 1, q: "Comparing department sizes", a: "bar" },
    { id: 2, q: "Website visits over 12 months", a: "line" },
    { id: 3, q: "Height vs. weight of 30 students", a: "scatter" },
    { id: 4, q: "Budget split among 5 categories", a: "pie" }
  ];

  const handleQuizDrop = (qId, type) => {
    sounds.snap();
    const correct = quiz.find(q => q.id === qId);
    if (correct && type === correct.a) { sounds.correct(); }
    else { sounds.wrong(); }
    setQuizState(prev => {
      if (correct && prev[qId] === correct.a) return prev;
      return { ...prev, [qId]: type };
    });
  };

  const quizComplete = quiz.every(q => quizState[q.id] === q.a);

  useEffect(() => {
    if (quizComplete) {
      const id = setTimeout(onComplete, 2000);
      return () => clearTimeout(id);
    }
  }, [quizComplete, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-[fade-in_0.5s_ease-out]">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Different data stories need different chart types. Using the wrong chart is like using a hammer to turn a screw.
      </p>

      <div className="w-full max-w-3xl bg-[#fdfcfa] rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex border-b border-ink/12 bg-paper/50">
          {['bar', 'line', 'scatter', 'pie'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-3 font-medium text-sm capitalize transition-colors ${activeTab === tab ? 'bg-[#fdfcfa] text-rust border-b-2 border-rust' : 'text-pencil hover:bg-white/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 h-80 flex flex-col items-center justify-center relative">
          {activeTab === 'bar' && (
            <div className="w-full h-full flex flex-col items-center gap-4 animate-[fade-in_0.3s_ease-out]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-pencil">Orientation:</span>
                <Button onClick={() => { sounds.pop(); setOrientation(o => o === 'vertical' ? 'horizontal' : 'vertical'); }} className="py-1 px-3 text-xs">
                  Toggle {orientation === 'vertical' ? 'Horizontal' : 'Vertical'}
                </Button>
              </div>
              <div className={`flex w-full h-48 max-w-md gap-4 items-end ${orientation === 'horizontal' ? 'flex-col items-start justify-center' : 'flex-row justify-center'}`}>
                {[
                  { label: 'CS', val: 80 }, { label: 'Math', val: 45 }, { label: 'Physics', val: 60 }, { label: 'Biz', val: 90 }
                ].map((d, i) => (
                  <div key={i} className={`group relative bg-rust rounded-sm transition-all duration-500 hover:bg-rust/80 flex items-center justify-center ${orientation === 'horizontal' ? 'h-8' : 'w-12'}`}
                       style={orientation === 'vertical' ? { height: `${d.val}%` } : { width: `${d.val}%` }}>
                    <span className={`absolute font-mono text-xs opacity-0 group-hover:opacity-100 bg-ink text-white px-2 py-1 rounded z-10 ${orientation === 'vertical' ? '-top-8' : '-right-10'}`}>
                      {d.val}
                    </span>
                    <span className={`absolute text-xs font-mono text-pencil ${orientation === 'vertical' ? '-bottom-6' : '-left-12'}`}>
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-pencil">Best for: comparing categories</div>
            </div>
          )}

          {activeTab === 'line' && (
            <div className="w-full h-full flex flex-col items-center animate-[fade-in_0.3s_ease-out] relative">
              <svg className="w-full h-48 max-w-md overflow-visible" viewBox="0 0 400 200">
                <polyline
                  points={`0,150 50,120 100,130 150,90 200,${200 - linePointY} 250,70 300,40 350,50 400,20`}
                  fill="none" stroke="#DF5433" strokeWidth="3" strokeLinejoin="round"
                />
                <circle cx="200" cy={200 - linePointY} r="6" fill="#DF5433" className="cursor-ns-resize hover:fill-rust/80"
                  onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
                  onPointerMove={(e) => {
                    if (e.buttons === 1) {
                      const rect = e.currentTarget.parentElement.getBoundingClientRect();
                      const y = Math.max(10, Math.min(190, e.clientY - rect.top));
                      setLinePointY(200 - y);
                    }
                  }}
                />
                <text x="200" y={200 - linePointY - 15} textAnchor="middle" className="font-mono text-xs fill-pencil select-none">Drag me</text>
              </svg>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-pencil">Best for: trends over time</div>
            </div>
          )}

          {activeTab === 'scatter' && (
             <ScatterTabContent />
          )}

          {activeTab === 'pie' && (
            <div className="w-full h-full flex flex-col items-center justify-center animate-[fade-in_0.3s_ease-out] relative">
              <svg className="w-48 h-48 overflow-visible cursor-pointer" viewBox="-1 -1 2 2" onClick={() => { sounds.pop(); setPiePulled(!piePulled); }}>
                 {/* Slices calculated using basic trigonometry */}
                 <path d="M 0 0 L 1 0 A 1 1 0 0 1 0.309 0.951 Z" fill="#DF5433" transform={piePulled ? "translate(0.1, 0.05)" : ""} className="transition-transform duration-300" />
                 <path d="M 0 0 L 0.309 0.951 A 1 1 0 0 1 -0.809 0.587 Z" fill="#2a9d8f" />
                 <path d="M 0 0 L -0.809 0.587 A 1 1 0 0 1 -0.809 -0.587 Z" fill="#d97706" />
                 <path d="M 0 0 L -0.809 -0.587 A 1 1 0 0 1 0.309 -0.951 Z" fill="#e76f51" />
                 <path d="M 0 0 L 0.309 -0.951 A 1 1 0 0 1 1 0 Z" fill="#264653" />
                 
                 {piePulled && (
                   <text x="0.6" y="0.4" fontSize="0.15" fill="white" textAnchor="middle" className="font-mono">40%</text>
                 )}
              </svg>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-pencil text-center">
                Best for: parts of a whole<br/><span className="text-xs opacity-70">(but usually avoid — bar charts are better)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAllExplored && (
        <div className="w-full max-w-3xl bg-paper p-6 rounded-xl border-[1.5px] border-ink/12 animate-[fade-in_0.5s_ease-out]">
          <h3 className="font-bold text-ink mb-4 text-center">Which chart for...?</h3>
          
          <div className="flex gap-4 mb-6 justify-center">
             {['bar', 'line', 'scatter', 'pie'].map(type => (
                <div key={type} draggable onDragStart={e => e.dataTransfer.setData('type', type)} className="bg-[#fdfcfa] border-[1.5px] border-ink/12 px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing font-mono text-sm capitalize shadow-sm hover:-translate-y-0.5 transition-transform">
                  {type} chart
                </div>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quiz.map(q => (
              <div key={q.id} className="flex flex-col gap-2 p-3 bg-[#fdfcfa] rounded-lg border border-ink/10">
                <span className="text-sm font-medium text-ink/80">{q.q}</span>
                <div 
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleQuizDrop(q.id, e.dataTransfer.getData('type'))}
                  className={`h-10 rounded border-2 border-dashed flex items-center justify-center text-sm font-mono transition-colors ${
                    quizState[q.id] === q.a 
                      ? 'border-success/50 bg-success/10 text-success font-bold' 
                      : quizState[q.id] 
                        ? 'border-error/50 bg-error/5 text-error' 
                        : 'border-ink/20 text-pencil'
                  }`}
                >
                  {quizState[q.id] === q.a ? `${q.a} chart ✓` : quizState[q.id] ? 'Try again' : 'Drop chart here'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Scene3Scatter = ({ isComplete }) => {
  const dots = useMemo(() => [...Array(40)].map((_, i) => {
    const isCS = i % 2 === 0;
    const x = 10 + Math.random() * 80;
    const y = 100 - (x * 0.5 + Math.random() * 30 + 10);
    return { isCS, x, y };
  }), []);

  return (
    <div className="w-[80%] h-[70%] border-l-2 border-b-2 border-ink/20 relative mt-4">
      {dots.map((dot, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 ${dot.isCS ? 'bg-rust' : 'bg-amber-500'} ${isComplete ? 'opacity-80' : 'opacity-40'}`}
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        />
      ))}
      {isComplete && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[fade-in_1s_ease-out]">
          <line x1="10%" y1="80%" x2="90%" y2="20%" stroke="#2a9d8f" strokeWidth="3" strokeDasharray="5,5" className="opacity-50" />
        </svg>
      )}
    </div>
  );
};

// ============================================================================
// SCENE 3: Reading a chart (learn step 2)
// ============================================================================
const Scene3 = ({ onComplete }) => {
  const [placed, setPlaced] = useState({ title: false, x: false, y: false, legend: false, source: false });
  
  const labels = [
    { id: 'title', text: "Student GPA vs Hours Studied" },
    { id: 'x', text: "Hours Studied per Week" },
    { id: 'y', text: "GPA" },
    { id: 'legend', text: "• CS  • Business" },
    { id: 'source', text: "Source: Survey 2026" }
  ];

  const handleDrop = (id, e) => {
    const draggedId = e.dataTransfer.getData('id');
    sounds.snap();
    if (draggedId === id) {
      sounds.correct();
      setPlaced(prev => ({ ...prev, [id]: true }));
    } else {
      sounds.wrong();
    }
  };

  const isComplete = Object.values(placed).every(Boolean);

  useEffect(() => {
    if (isComplete) {
      const id = setTimeout(onComplete, 2500);
      return () => clearTimeout(id);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-[fade-in_0.5s_ease-out]">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        A chart without labels is just art. Drag the labels to their correct positions to make the chart readable.
      </p>

      <div className="flex flex-wrap gap-3 justify-center mb-4 min-h-[40px]">
        {labels.map(l => !placed[l.id] && (
          <div 
            key={l.id} 
            draggable 
            onDragStart={e => e.dataTransfer.setData('id', l.id)}
            className="px-4 py-2 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-lg text-sm font-medium cursor-grab shadow-sm"
          >
            {l.text}
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl aspect-[4/3] bg-[#fdfcfa] rounded-xl border-[1.5px] border-ink/12 shadow-lg relative p-8 flex items-center justify-center">
        
        {/* Drop zones */}
        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop('title', e)} className={`absolute top-4 left-1/2 -translate-x-1/2 w-64 h-8 flex items-center justify-center font-bold text-lg border-2 ${placed.title ? 'border-transparent text-ink' : 'border-dashed border-ink/20 text-ink/30 bg-paper'}`}>
          {placed.title ? labels.find(l => l.id === 'title').text : 'Title'}
        </div>

        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop('y', e)} className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-48 flex items-center justify-center font-medium text-sm -rotate-90 border-2 ${placed.y ? 'border-transparent text-ink' : 'border-dashed border-ink/20 text-ink/30 bg-paper'}`}>
          {placed.y ? labels.find(l => l.id === 'y').text : 'Y-Axis'}
        </div>

        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop('x', e)} className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 flex items-center justify-center font-medium text-sm border-2 ${placed.x ? 'border-transparent text-ink' : 'border-dashed border-ink/20 text-ink/30 bg-paper'}`}>
          {placed.x ? labels.find(l => l.id === 'x').text : 'X-Axis'}
        </div>

        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop('legend', e)} className={`absolute top-12 right-8 w-32 h-12 flex items-center justify-center text-xs border-2 ${placed.legend ? 'border-ink/10 text-ink bg-paper/50 rounded' : 'border-dashed border-ink/20 text-ink/30 bg-paper'}`}>
          {placed.legend ? <div className="flex flex-col"><span className="text-rust">• CS</span><span className="text-amber-600">• Business</span></div> : 'Legend'}
        </div>

        <div onDragOver={e => e.preventDefault()} onDrop={e => handleDrop('source', e)} className={`absolute bottom-2 right-4 w-32 h-6 flex items-center justify-center text-xs border-2 ${placed.source ? 'border-transparent text-pencil' : 'border-dashed border-ink/20 text-ink/30 bg-paper'}`}>
          {placed.source ? labels.find(l => l.id === 'source').text : 'Source'}
        </div>

        {/* The Plot */}
        <Scene3Scatter isComplete={isComplete} />
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: Lying with charts (learn step 3)
// ============================================================================
const Scene4 = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [fixed, setFixed] = useState(false);
  const [yStart, setYStart] = useState(94);
  const [timeRange, setTimeRange] = useState(20); // % of full range
  const [is3D, setIs3D] = useState(true);
  const [showContext, setShowContext] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const nextStep = () => {
    if (step < 4) {
      setStep(s => s + 1);
      setFixed(false);
    } else {
      timerRef.current = setTimeout(onComplete, 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-[fade-in_0.5s_ease-out]">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Charts can mislead — sometimes on purpose. Fix the charts to reveal the truth.
      </p>

      <div className="w-full max-w-3xl bg-[#fdfcfa] p-8 rounded-xl border-[1.5px] border-ink/12 shadow-lg min-h-[400px] flex flex-col items-center justify-between">
        
        {step === 1 && (
          <div className="w-full flex flex-col items-center gap-6 animate-[fade-in_0.3s]">
            <h3 className="font-bold text-lg">Trick 1: Truncated Y-Axis</h3>
            <p className="text-pencil text-sm">Looks like A is crushing B, right? Drag the slider to set the Y-axis to 0.</p>
            
            <div className="flex items-end gap-12 h-48 border-b-2 border-ink/20 w-64 relative">
              <div className="absolute -left-8 bottom-0 flex flex-col justify-between h-full text-xs font-mono text-pencil">
                <span>100%</span>
                <span className="text-rust font-bold transition-all">{yStart}%</span>
              </div>
              
              <div className="w-16 bg-rust transition-all duration-300" style={{ height: `${((98 - yStart) / (100 - yStart)) * 100}%` }}></div>
              <div className="w-16 bg-amber-500 transition-all duration-300" style={{ height: `${((95 - yStart) / (100 - yStart)) * 100}%` }}></div>
            </div>
            <div className="flex gap-12 w-64 text-center font-bold mt-2">
              <span className="w-16">A (98%)</span><span className="w-16">B (95%)</span>
            </div>

            <input 
              type="range" min="0" max="94" value={yStart} 
              onChange={e => {
                setYStart(Number(e.target.value));
                if (Number(e.target.value) === 0 && !fixed) { sounds.correct(); setFixed(true); }
              }}
              className="w-64 mt-4 accent-rust"
            />
          </div>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col items-center gap-6 animate-[fade-in_0.3s]">
            <h3 className="font-bold text-lg">Trick 2: Cherry-picked Time Range</h3>
            <p className="text-pencil text-sm">"Revenue is crashing!" — Expand the time range to see the big picture.</p>
            
            <div className="w-full max-w-lg h-48 bg-paper border-[1.5px] border-ink/10 rounded overflow-hidden relative">
              {/* Full invisible trend */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline points="0,80 20,70 40,50 60,30 80,40 100,50" fill="none" stroke="#2a9d8f" strokeWidth="2" className="opacity-20" />
              </svg>
              {/* Visible trend window */}
              <div className="absolute right-0 top-0 bottom-0 bg-[#fdfcfa] border-l-2 border-rust overflow-hidden transition-all duration-300" style={{ width: `${timeRange}%` }}>
                <svg className="absolute top-0 right-0 w-[500px] h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ right: 0 }}>
                  <polyline points="0,80 20,70 40,50 60,30 80,40 100,50" fill="none" stroke={timeRange > 80 ? "#2a9d8f" : "#dc2626"} strokeWidth="2" />
                </svg>
              </div>
            </div>

            <input 
              type="range" min="20" max="100" value={timeRange} 
              onChange={e => {
                setTimeRange(Number(e.target.value));
                if (Number(e.target.value) === 100 && !fixed) { sounds.correct(); setFixed(true); }
              }}
              className="w-64 accent-rust"
            />
          </div>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center gap-6 animate-[fade-in_0.3s]">
            <h3 className="font-bold text-lg">Trick 3: 3D Pie Chart</h3>
            <p className="text-pencil text-sm">The 3D tilt makes the front green slice look bigger than the blue one. Are they?</p>
            
            <div className={`w-48 h-48 rounded-full transition-all duration-700 relative overflow-hidden ${is3D ? 'rotate-x-[60deg] scale-y-50 shadow-[0_20px_0_0_#1e3a8a]' : 'rotate-x-0 scale-y-100'}`} style={{ transformStyle: 'preserve-3d', transform: is3D ? 'rotateX(60deg)' : 'rotateX(0deg)' }}>
              {/* Fake pie using conic gradients for simplicity in CSS */}
              <div className="absolute inset-0" style={{ background: 'conic-gradient(#DF5433 0% 40%, #2a9d8f 40% 70%, #d97706 70% 100%)' }}></div>
            </div>
            
            <Button onClick={() => { sounds.correct(); setIs3D(false); setFixed(true); }}>Flatten to 2D</Button>
            {!is3D && <p className="text-sm font-bold text-success animate-[fade-in_0.3s]">Red is 40%, Green is 30%!</p>}
          </div>
        )}

        {step === 4 && (
          <div className="w-full flex flex-col items-center gap-6 animate-[fade-in_0.3s]">
            <h3 className="font-bold text-lg">Trick 4: Missing Context</h3>
            <p className="text-pencil text-sm">"Our product is rated #1!"</p>
            
            <div className="flex items-end gap-4 h-48 border-b-2 border-ink/20 w-80">
              <div className="w-16 bg-success h-[90%] relative"><span className="absolute -top-6 left-2 font-bold text-sm">4.1</span><span className="absolute -bottom-6 left-0 text-xs">Us</span></div>
              {showContext && (
                <>
                  <div className="w-16 bg-ink/20 h-[88%] relative animate-[fade-in_0.5s]"><span className="absolute -top-6 left-2 font-bold text-sm">4.0</span><span className="absolute -bottom-6 left-0 text-xs">Comp A</span></div>
                  <div className="w-16 bg-ink/20 h-[85%] relative animate-[fade-in_0.5s]"><span className="absolute -top-6 left-2 font-bold text-sm">3.9</span><span className="absolute -bottom-6 left-0 text-xs">Comp B</span></div>
                </>
              )}
            </div>
            
            {!showContext ? (
              <Button onClick={() => { sounds.correct(); setShowContext(true); setFixed(true); }}>Reveal Competitors</Button>
            ) : (
              <p className="text-sm font-bold text-success animate-[fade-in_0.3s]">#1 out of 3, by a tiny margin.</p>
            )}
          </div>
        )}

        <div className="mt-8 h-12">
          {fixed && (
            <Button onClick={() => { sounds.pop(); nextStep(); }} className="bg-rust text-white border-transparent hover:bg-rust/90 animate-[fade-in_0.3s]">
              {step === 4 ? 'Finish' : 'Next Trick →'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Visualize the survey (apply step 0)
// ============================================================================
const Scene5ScatterPreview = () => {
  const dots = useMemo(() => [...Array(20)].map(() => ({
    left: `${10 + Math.random() * 80}%`,
    bottom: `${10 + Math.random() * 80}%`,
  })), []);

  return (
    <div className="w-64 h-48 border-b-2 border-l-2 border-ink/20 relative">
      {dots.map((pos, i) => (
        <div key={i} className="absolute w-2 h-2 bg-rust rounded-full opacity-60" style={{ left: pos.left, bottom: pos.bottom }} />
      ))}
    </div>
  );
};

const Scene5 = ({ onComplete }) => {
  const [task, setTask] = useState(1);
  const [chartType, setChartType] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [error, setError] = useState(null);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); };
  }, []);

  const tasks = [
    { id: 1, text: "Show satisfaction ratings by department", type: 'bar', x: 'dept', y: 'satisfaction' },
    { id: 2, text: "Is there a relationship between hours studied and GPA?", type: 'scatter', x: 'hours', y: 'gpa' },
    { id: 3, text: "What percentage of students are in each department?", type: 'bar', x: 'dept', y: 'count' }
  ];

  const currentTask = tasks[task - 1];

  const handleVerify = () => {
    if (chartType === currentTask.type && xAxis === currentTask.x && yAxis === currentTask.y) {
      sounds.correct();
      setError(null);
      if (task < 3) {
        setTask(t => t + 1);
        setChartType(null); setXAxis(null); setYAxis(null);
      } else {
        onComplete();
      }
    } else {
      sounds.wrong();
      setError("Not quite right. Check your chart type and axes.");
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 2000);
    }
  };

  const isCorrect = chartType === currentTask.type && xAxis === currentTask.x && yAxis === currentTask.y;

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-[fade-in_0.5s_ease-out]">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        The dean needs a presentation. Build the right charts for the data.
      </p>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#fdfcfa] p-6 rounded-xl border-[1.5px] border-ink/12 shadow-sm flex flex-col gap-6">
          <div className="bg-paper p-3 rounded font-medium text-rust text-sm border-l-4 border-rust">
            Task {task}/3: {currentTask.text}
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-pencil uppercase">Chart Type</label>
            <div className="flex gap-2">
              {['bar', 'scatter', 'pie'].map(t => (
                <button key={t} onClick={() => { sounds.pop(); setChartType(t); }} className={`px-3 py-1.5 rounded text-sm capitalize border ${chartType === t ? 'bg-rust/10 border-rust text-rust font-bold' : 'border-ink/20 text-ink/80'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-pencil uppercase">X-Axis</label>
            <select value={xAxis || ''} onChange={e => setXAxis(e.target.value)} className="p-2 border border-ink/20 rounded text-sm bg-[#fdfcfa]">
              <option value="">Select...</option>
              <option value="dept">Department</option>
              <option value="hours">Hours Studied</option>
              <option value="gpa">GPA</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-pencil uppercase">Y-Axis</label>
            <select value={yAxis || ''} onChange={e => setYAxis(e.target.value)} className="p-2 border border-ink/20 rounded text-sm bg-[#fdfcfa]">
              <option value="">Select...</option>
              <option value="satisfaction">Satisfaction (Avg)</option>
              <option value="gpa">GPA</option>
              <option value="count">Student Count</option>
            </select>
          </div>

          <Button onClick={handleVerify} disabled={!chartType || !xAxis || !yAxis} className="mt-4">
            Verify Chart
          </Button>
          {error && (
            <div className="mt-2 px-4 py-2 bg-error/10 border border-error/30 rounded-lg text-error text-sm font-medium animate-[fade-in_0.3s_ease-out]">
              {error}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-paper p-8 rounded-xl border-[1.5px] border-dashed border-ink/20 flex items-center justify-center min-h-[300px] relative">
          {!chartType ? (
            <span className="text-pencil font-medium">Chart Preview</span>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdfcfa] rounded-lg shadow-sm border border-ink/10 p-4 animate-[fade-in_0.3s]">
              {isCorrect && <div className="absolute top-4 right-4 bg-success text-white px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1"><CheckIcon className="w-3 h-3"/> Perfect</div>}
              
              <div className="text-sm font-bold mb-4">{yAxis} by {xAxis}</div>
              
              {chartType === 'bar' && (
                <div className="flex items-end gap-8 h-48 border-b-2 border-l-2 border-ink/20 px-8 pt-4">
                  <div className="w-12 bg-rust h-[80%] relative rounded-t-sm"><span className="absolute -bottom-6 text-xs w-full text-center">CS</span></div>
                  <div className="w-12 bg-rust h-[60%] relative rounded-t-sm"><span className="absolute -bottom-6 text-xs w-full text-center">Math</span></div>
                  <div className="w-12 bg-rust h-[90%] relative rounded-t-sm"><span className="absolute -bottom-6 text-xs w-full text-center">Biz</span></div>
                </div>
              )}
              {chartType === 'scatter' && (
                 <Scene5ScatterPreview />
              )}
              {chartType === 'pie' && (
                 <div className="w-32 h-32 rounded-full border-4 border-rust/30 flex items-center justify-center text-xs text-pencil">Pie Preview</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Dashboard builder (challenge step 0)
// ============================================================================
const ChartBuilder = ({ qId, title, isComplete, checkChart }) => {
  const [t, setT] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  useEffect(() => {
    checkChart(qId, t, x, y);
  }, [t, x, y, qId, checkChart]);

  if (isComplete) {
    return (
      <div className="bg-[#fdfcfa] p-4 rounded-xl border-2 border-success/50 shadow-sm flex flex-col items-center justify-center h-48 animate-[fade-in_0.5s]">
        <CheckIcon className="w-8 h-8 text-success mb-2" />
        <div className="font-bold text-sm text-center">{title}</div>
        <div className="text-xs text-pencil mt-1">Chart built successfully</div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfcfa] p-4 rounded-xl border-[1.5px] border-ink/12 shadow-sm flex flex-col gap-3">
      <div className="text-sm font-bold text-ink h-10 leading-tight">{title}</div>
      <select value={t} onChange={e=>{ sounds.pop(); setT(e.target.value); }} className="text-xs p-1.5 border rounded">
        <option value="">Chart Type...</option>
        <option value="bar">Vertical Bar</option>
        <option value="bar_h">Horizontal Bar</option>
        <option value="line">Line Chart</option>
      </select>
      <select value={x} onChange={e=>{ sounds.pop(); setX(e.target.value); }} className="text-xs p-1.5 border rounded">
        <option value="">X Axis...</option>
        <option value="category">Category</option>
        <option value="date">Date</option>
        <option value="orders">Total Orders</option>
      </select>
      <select value={y} onChange={e=>{ sounds.pop(); setY(e.target.value); }} className="text-xs p-1.5 border rounded">
        <option value="">Y Axis...</option>
        <option value="revenue">Revenue</option>
        <option value="region">Region</option>
      </select>
    </div>
  );
};

const Scene6 = ({ onComplete }) => {
  const [charts, setCharts] = useState({ q1: false, q2: false, q3: false });

  const checkChart = useCallback((q, type, x, y) => {
    if (q === 'q1' && type === 'bar' && x === 'category' && y === 'revenue') { sounds.correct(); setCharts(prev => ({...prev, q1: true})); }
    if (q === 'q2' && type === 'line' && x === 'date' && y === 'revenue') { sounds.correct(); setCharts(prev => ({...prev, q2: true})); }
    if (q === 'q3' && type === 'bar_h' && x === 'orders' && y === 'region') { sounds.correct(); setCharts(prev => ({...prev, q3: true})); }
  }, []);

  const allDone = charts.q1 && charts.q2 && charts.q3;

  useEffect(() => {
    if (allDone) {
      const id = setTimeout(onComplete, 3000);
      return () => clearTimeout(id);
    }
  }, [allDone, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-[fade-in_0.5s_ease-out]">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Final Challenge: Build a dashboard for the CEO answering 3 key questions.
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 bg-paper p-6 rounded-2xl border-[1.5px] border-ink/12">
        <ChartBuilder qId="q1" title="1. Which category sells the most?" isComplete={charts.q1} checkChart={checkChart} />
        <ChartBuilder qId="q2" title="2. How are sales trending this month?" isComplete={charts.q2} checkChart={checkChart} />
        <ChartBuilder qId="q3" title="3. Where are our customers?" isComplete={charts.q3} checkChart={checkChart} />
      </div>

      {allDone && (
        <div className="bg-rust text-white px-8 py-6 rounded-2xl flex flex-col items-center gap-2 shadow-xl animate-[fade-in_0.5s_forwards] scale-110 mt-4">
          <div className="text-4xl mb-2">📊</div>
          <h2 className="text-2xl font-bold font-serif tracking-wide">Data Storyteller Badge Unlocked!</h2>
          <p className="opacity-90 font-medium">You know how to make numbers speak.</p>
        </div>
      )}
    </div>
  );
};


// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function VisualizationLesson({ currentPhase, currentStep, onComplete }) {
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
    <div className="animate-[fade-in_0.3s_ease-out] w-full">
      {scenes[sceneKey] || <div className="text-pencil text-center py-12">Scene not found.</div>}
    </div>
  );
}
