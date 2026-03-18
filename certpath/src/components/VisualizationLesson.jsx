import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, LineChart, PieChart, ScatterChart as ScatterIcon,
  CheckCircle, AlertTriangle, MousePointerClick, MoveDiagonal
} from 'lucide-react';
// Assuming standard lucide-react doesn't have ScatterChart in older versions, we can use Activity or Grid if needed, but modern lucide has it, or we'll mock. Let's use generic shapes if not.

// --- SHARED UTILS --- 
const colors = ['#F4A261', '#2A9D8F', '#E76F51', '#264653', '#E9C46A'];

// --- SCENE 1: Why visualize? ---
const RAW_SCORES = [72, 85, 91, 64, 78, 88, 76, 95, 82, 69, 73, 81, 79, 87, 92, 68, 75, 84, 77, 80];

// Histogram bins
const BINS = [
  { range: '60-69', label: '60s', count: 3 },
  { range: '70-79', label: '70s', count: 7 },
  { range: '80-89', label: '80s', count: 7 },
  { range: '90-100', label: '90s', count: 3 }
];

function Scene1({ onComplete }) {
  const [step, setStep] = useState(0); // 0=table, 1=chart, 2=quiz
  const [chartAnim, setChartAnim] = useState(false);
  const [selectedWrongChart, setSelectedWrongChart] = useState(null);

  const handleShowChart = () => {
    setStep(1);
    setTimeout(() => setChartAnim(true), 100);
    setTimeout(() => setStep(2), 3500); // go to quiz part
  };

  const handleQuiz = (type) => {
    if (type === 'pie') {
      setSelectedWrongChart('correct');
      setTimeout(onComplete, 3000);
    } else {
      setSelectedWrongChart('error');
      setTimeout(() => setSelectedWrongChart(null), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20">
        <h2 className="text-2xl font-bold text-ink mb-2">Why visualize?</h2>
        <p className="text-ink/70">
          Staring at a table of numbers tells you almost nothing. One chart tells you everything.
        </p>
      </div>

      <div className="flex-1 bg-white border border-pencil/20 rounded-xl p-8 relative overflow-hidden shadow-sm flex flex-col">
        {step === 0 && (
          <div className="animate-fade-in flex flex-col items-center flex-1 justify-center relative">
            <div className="grid grid-cols-5 gap-3 mb-8 w-full max-w-2xl opacity-80">
              {RAW_SCORES.map((score, i) => (
                <div key={i} className="bg-paper p-3 text-center border border-pencil/20 font-mono text-ink rounded-lg shadow-sm">
                  {score}
                </div>
              ))}
            </div>
            <button 
              onClick={handleShowChart}
              className="bg-rust text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-rust/90 transition transform hover:scale-105 flex items-center space-x-2 z-10"
            >
              <BarChart2 className="w-5 h-5" />
              <span>Show as chart</span>
            </button>
          </div>
        )}

        {step >= 1 && (
          <div className="animate-fade-in flex flex-col items-center flex-1 w-full justify-center">
            {step === 1 && <h3 className="text-xl font-bold text-ink mb-6">Distribution of Scores</h3>}
            {step === 2 && <h3 className="text-xl font-bold text-ink mb-2">Which chart is WRONG for this data?</h3>}
            {step === 2 && <p className="text-ink/60 mb-8 max-w-lg text-center">We want to show the distribution of continuous test scores. Pick the chart type that makes the least sense.</p>}

            {step === 1 ? (
              <div className="h-64 flex items-end justify-center w-full max-w-lg gap-8 border-b-2 border-pencil/20 pb-2 relative">
                {BINS.map((bin, i) => {
                  const maxCount = 8;
                  const heightPct = chartAnim ? (bin.count / maxCount) * 100 : 0;
                  return (
                    <div key={i} className="flex flex-col items-center w-16 group">
                      <div className="text-rust font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{bin.count}</div>
                      <div 
                        className="w-full bg-rust rounded-t-sm transition-all duration-1000 ease-out" 
                        style={{ height: `${heightPct}%`, transitionDelay: `${i * 150}ms` }} 
                      />
                      <div className="absolute -bottom-8 text-sm font-medium text-ink/70">{bin.label}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-6 w-full max-w-3xl justify-center">
                <button onClick={() => handleQuiz('bar')} className="flex-1 p-6 border-2 border-pencil/20 rounded-xl hover:bg-pencil/5 transition flex flex-col items-center">
                  <BarChart2 className="w-16 h-16 text-rust mb-4" />
                  <span className="font-bold">Bar Chart / Histogram</span>
                </button>
                <button onClick={() => handleQuiz('line')} className="flex-1 p-6 border-2 border-pencil/20 rounded-xl hover:bg-pencil/5 transition flex flex-col items-center">
                  <LineChart className="w-16 h-16 text-[#2A9D8F] mb-4" />
                  <span className="font-bold">Line Chart</span>
                </button>
                <button onClick={() => handleQuiz('pie')} className="flex-1 p-6 border-2 border-pencil/20 rounded-xl hover:border-error group transition flex flex-col items-center relative overflow-hidden">
                  <PieChart className="w-16 h-16 text-[#E76F51] mb-4 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Pie Chart</span>
                  {selectedWrongChart === 'correct' && (
                    <div className="absolute inset-0 bg-success/90 text-white flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                      <CheckCircle className="w-10 h-10 mb-2" />
                      <p className="text-sm font-bold">Correct!</p>
                      <p className="text-xs">Pie charts are for parts of a whole, not continuous scores.</p>
                    </div>
                  )}
                </button>
              </div>
            )}
            
            {selectedWrongChart === 'error' && (
              <div className="mt-8 text-error font-bold flex items-center bg-error/10 px-4 py-2 rounded-lg animate-fade-in">
                <AlertTriangle className="w-5 h-5 mr-2" /> This chart is actually okay for showing distributions or trends over time. Try again!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- SCENE 2: The chart family ---
function Scene2({ onComplete }) {
  const [activeTab, setActiveTab] = useState('bar');
  const [visited, setVisited] = useState(new Set(['bar']));
  const [quizStep, setQuizStep] = useState(-1);
  const [quizAnswers, setQuizAnswers] = useState({});

  useEffect(() => {
    if (visited.size === 4 && quizStep === -1) {
      setTimeout(() => setQuizStep(0), 1000);
    }
  }, [visited, quizStep]);

  const TABS = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart2 },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'scatter', label: 'Scatter Plot', icon: Activity },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
  ];

  const handleTab = (id) => {
    setActiveTab(id);
    setVisited(prev => new Set(prev).add(id));
  };

  // Bar specific state
  const [isHorizontal, setIsHorizontal] = useState(false);
  const barData = [
    { label: 'CS', val: 120 }, { label: 'Business', val: 95 }, { label: 'Arts', val: 60 }, { label: 'Physics', val: 40 }
  ];

  // Line specific state
  const [lineValue, setLineValue] = useState(150); // The draggable point (Y val)
  const isDragging = useRef(false);

  const handlePointerDown = (e) => { isDragging.current = true; e.target.setPointerCapture(e.pointerId); };
  const handlePointerUp = (e) => { isDragging.current = false; e.target.releasePointerCapture(e.pointerId); };
  const handlePointerMove = (e) => {
    if (isDragging.current) {
      const rect = e.target.closest('svg').getBoundingClientRect();
      const yPos = e.clientY - rect.top;
      // map yPos (20 to 220) to value (200 to 0)
      let val = 200 - ((yPos - 20) / 200) * 200;
      val = Math.max(0, Math.min(200, val));
      setLineValue(val);
    }
  };

  // Scatter specific state
  const [hoveredScatter, setHoveredScatter] = useState(null);
  const scatterData = Array.from({length: 20}, (_, i) => ({
    x: 150 + Math.random()*40, // height 150-190
    y: 50 + Math.random()*40 + ((i*2) % 10), // weight trend slightly up
    id: i
  }));

  // Pie specific state
  const [pulledOut, setPulledOut] = useState(null);

  // Quiz questions
  const SCENARIOS = [
    { text: "Tracking company revenue growth over the past 5 years.", correct: "line" },
    { text: "Comparing the number of users in 4 different subscription tiers.", correct: "bar" },
    { text: "Seeing if taller students tend to run faster.", correct: "scatter" },
  ];

  const handleQuizAnswer = (typeId) => {
    if (SCENARIOS[quizStep].correct === typeId) {
      setQuizAnswers(prev => ({...prev, [quizStep]: typeId}));
      if (quizStep + 1 === SCENARIOS.length) {
        setTimeout(onComplete, 2000);
        setQuizStep(99); // done
      } else {
        setQuizStep(prev => prev + 1);
      }
    } else {
      // animate error or just flash, will keep simple
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink mb-2">The chart family</h2>
          <p className="text-ink/70">
            Different data stories need different chart types. Using the wrong chart is like using a hammer to turn a screw.
          </p>
        </div>
      </div>

      {quizStep === -1 ? (
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Sidebar */}
          <div className="w-full lg:w-48 flex flex-col gap-2">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all
                    ${activeTab === tab.id ? 'bg-rust text-white shadow-md' : 
                      visited.has(tab.id) ? 'bg-white text-ink/70 border border-pencil/20 hover:border-rust/50 hover:bg-rust/5' : 
                      'bg-paper text-ink/50 border border-transparent hover:bg-pencil/10'}`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {visited.has(tab.id) && activeTab !== tab.id && <CheckCircle className="w-4 h-4 ml-auto opacity-50 text-success" />}
                </button>
              );
            })}
            <div className="mt-auto text-xs text-ink/40 p-4 font-medium uppercase tracking-wider">
              Explore all 4 charts to continue.
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="flex-1 bg-white border border-pencil/20 rounded-xl p-8 shadow-sm flex flex-col">
            
            {activeTab === 'bar' && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Bar Chart</h3>
                    <p className="text-sm text-ink/60">Best for: comparing categories of data.</p>
                  </div>
                  <button 
                    onClick={() => setIsHorizontal(!isHorizontal)}
                    className="px-4 py-2 border border-pencil/30 rounded-lg text-sm font-medium hover:bg-rust/5 transition flex items-center"
                  >
                    <MoveDiagonal className="w-4 h-4 mr-2" />
                    Toggle {isHorizontal ? 'Vertical' : 'Horizontal'}
                  </button>
                </div>
                
                <div className="flex-1 bg-paper/30 rounded-xl border border-pencil/10 p-6 flex items-end justify-center">
                  {!isHorizontal ? (
                     <div className="flex items-end justify-center w-full max-w-md h-full gap-8 border-b-2 border-pencil/30 relative pb-2">
                        {barData.map((d, i) => (
                           <div key={i} className="flex flex-col items-center group w-16">
                             <div className="text-rust font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{d.val}</div>
                             <div className={`w-full rounded-t-sm transition-all duration-500`} style={{ height: `${(d.val/150)*100}%`, backgroundColor: colors[i] }} />
                             <div className="absolute -bottom-8 text-sm font-medium">{d.label}</div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="flex flex-col justify-center w-full max-w-md h-full gap-6 border-l-2 border-pencil/30 relative pl-2">
                       {barData.map((d, i) => (
                          <div key={i} className="flex items-center group relative h-12">
                            <div className="absolute -left-20 w-18 text-right pr-4 text-sm font-medium leading-[48px]">{d.label}</div>
                            <div className={`h-full rounded-r-sm transition-all duration-500`} style={{ width: `${(d.val/150)*100}%`, backgroundColor: colors[i] }} />
                            <div className="text-rust font-bold ml-4 opacity-0 group-hover:opacity-100 transition-opacity">{d.val}</div>
                          </div>
                        ))}
                     </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'line' && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Line Chart</h3>
                  <p className="text-sm text-ink/60">Best for: showing trends over time. <span className="text-rust font-medium">Drag the middle point to change the trend!</span></p>
                </div>
                <div className="flex-1 bg-paper/30 rounded-xl border border-pencil/10 p-6 flex items-center justify-center">
                   <svg width="100%" height="240" viewBox="0 0 500 240" className="overflow-visible touch-none">
                     <path d="M 50 180 L 150 120" stroke="#E76F51" strokeWidth="4" fill="none" />
                     {/* The dynamic line segments linking to the dragged point */}
                     <path d={`M 150 120 L 250 ${240 - ((lineValue/200)*200 + 20)}`} stroke="#E76F51" strokeWidth="4" fill="none" />
                     <path d={`M 250 ${240 - ((lineValue/200)*200 + 20)} L 350 140`} stroke="#E76F51" strokeWidth="4" fill="none" />
                     <path d="M 350 140 L 450 60" stroke="#E76F51" strokeWidth="4" fill="none" />
                     
                     <circle cx="50" cy="180" r="6" fill="#E76F51" />
                     <circle cx="150" cy="120" r="6" fill="#E76F51" />
                     
                     {/* Draggable point */}
                     <circle cx="250" cy={240 - ((lineValue/200)*200 + 20)} r="12" fill="#2A9D8F" className="cursor-pointer"
                             onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} />
                     <circle cx="250" cy={240 - ((lineValue/200)*200 + 20)} r="4" fill="white" className="pointer-events-none" />
                     <text x="250" y={240 - ((lineValue/200)*200 + 40)} textAnchor="middle" fill="#2A9D8F" fontSize="14" fontWeight="bold" className="pointer-events-none">
                       {Math.round(lineValue)}
                     </text>

                     <circle cx="350" cy="140" r="6" fill="#E76F51" />
                     <circle cx="450" cy="60" r="6" fill="#E76F51" />

                     {/* Axes limits */}
                     <line x1="50" y1="220" x2="450" y2="220" stroke="#CBD5E1" strokeWidth="2" />
                     <text x="50" y="240" fontSize="12" fill="#64748B">Jan</text>
                     <text x="450" y="240" fontSize="12" fill="#64748B">Dec</text>
                   </svg>
                </div>
              </div>
            )}

            {activeTab === 'scatter' && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Scatter Plot</h3>
                  <p className="text-sm text-ink/60">Best for: relationships between two number variables.</p>
                </div>
                <div className="flex-1 bg-paper/30 rounded-xl border border-pencil/10 p-6 flex items-center justify-center relative">
                  <svg width="100%" height="240" viewBox="0 0 500 240" className="overflow-visible">
                     <line x1="50" y1="220" x2="450" y2="220" stroke="#CBD5E1" strokeWidth="2" />
                     <line x1="50" y1="220" x2="50" y2="20" stroke="#CBD5E1" strokeWidth="2" />
                     <text x="250" y="245" textAnchor="middle" fontSize="12" fill="#64748B">Height (cm) - 150 to 190</text>
                     <text x="20" y="120" textAnchor="middle" fontSize="12" fill="#64748B" transform="rotate(-90 20 120)">Weight (kg)</text>

                     {scatterData.map(pt => {
                       const cx = 50 + ((pt.x - 150)/40)*400;
                       const cy = 220 - ((pt.y - 50)/50)*200;
                       return (
                         <circle 
                            key={pt.id} cx={cx} cy={cy} r="6" 
                            fill={hoveredScatter === pt.id ? '#E76F51' : '#2A9D8F'} 
                            fillOpacity="0.7"
                            className="transition-colors cursor-pointer"
                            onMouseEnter={() => setHoveredScatter(pt.id)}
                            onMouseLeave={() => setHoveredScatter(null)}
                         />
                       )
                     })}
                  </svg>
                  {hoveredScatter !== null && (
                    <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border border-pencil/20 text-sm animate-fade-in pointer-events-none">
                      <div className="font-bold text-ink">Student {hoveredScatter}</div>
                      <div>Height: {Math.round(scatterData[hoveredScatter].x)} cm</div>
                      <div>Weight: {Math.round(scatterData[hoveredScatter].y)} kg</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'pie' && (
              <div className="flex-1 flex flex-col animate-fade-in">
                <div className="mb-6">
                  <h3 className="text-lg font-bold">Pie Chart</h3>
                  <p className="text-sm text-ink/60">Best for: showing parts of a whole (proportions). <span className="text-rust font-medium">Click a slice!</span></p>
                </div>
                <div className="flex-1 bg-paper/30 rounded-xl border border-pencil/10 p-6 flex items-center justify-center relative">
                  <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible cursor-pointer">
                    {/* Simplified static pie slices for demo */}
                    <path onClick={()=>setPulledOut(0)} d="M 120 120 L 120 20 A 100 100 0 0 1 215 89 Z" fill={colors[0]} className="transition-transform duration-300" style={{ transform: pulledOut===0 ? 'translate(10px, -10px)' : ''}} />
                    <path onClick={()=>setPulledOut(1)} d="M 120 120 L 215 89 A 100 100 0 0 1 184 196 Z" fill={colors[1]} className="transition-transform duration-300" style={{ transform: pulledOut===1 ? 'translate(15px, 10px)' : ''}} />
                    <path onClick={()=>setPulledOut(2)} d="M 120 120 L 184 196 A 100 100 0 0 1 25 151 Z" fill={colors[2]} className="transition-transform duration-300" style={{ transform: pulledOut===2 ? 'translate(-10px, 15px)' : ''}} />
                    <path onClick={()=>setPulledOut(3)} d="M 120 120 L 25 151 A 100 100 0 0 1 120 20 Z" fill={colors[3]} className="transition-transform duration-300" style={{ transform: pulledOut===3 ? 'translate(-15px, -15px)' : ''}} />
                  </svg>
                  {pulledOut !== null && (
                    <div className="absolute right-8 top-12 bg-white p-4 rounded-xl shadow-md border border-pencil/20 text-sm animate-fade-in text-center font-bold">
                       <div className="text-2xl" style={{color: colors[pulledOut]}}>
                         {[35, 25, 20, 20][pulledOut]}%
                       </div>
                       <div className="text-ink/60 text-xs mt-1">
                         {['Marketing', 'Engineering', 'Sales', 'HR'][pulledOut]}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-pencil/20 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center animate-fade-in">
          {quizStep < SCENARIOS.length ? (
             <div className="max-w-xl w-full text-center">
                <div className="text-sm font-bold text-rust uppercase tracking-wider mb-2">Pop Quiz ({quizStep + 1}/{SCENARIOS.length})</div>
                <h3 className="text-2xl font-bold text-ink mb-10 leading-tight">Which chart would you use for:<br/><span className="text-pencil font-medium italic">"{SCENARIOS[quizStep].text}"</span></h3>
                <div className="grid grid-cols-2 gap-4">
                   {TABS.map(tab => {
                     const Icon = tab.icon;
                     return (
                       <button key={tab.id} onClick={() => handleQuizAnswer(tab.id)} className="p-6 border-2 border-pencil/20 rounded-xl hover:bg-rust/5 hover:border-rust/40 transition flex flex-col items-center">
                         <Icon className="w-10 h-10 mb-3 text-ink/70" />
                         <span className="font-bold text-ink">{tab.label}</span>
                       </button>
                     );
                   })}
                </div>
             </div>
          ) : (
             <div className="text-center animate-fade-in text-success-dark">
               <CheckCircle className="w-20 h-20 mb-4 mx-auto" />
               <h3 className="text-3xl font-bold mb-2">Chart Master!</h3>
               <p className="text-lg opacity-80">You matched every scenario to the right tool.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- SCENE 3: Reading a chart ---
const LABELS = [
  { id: 'title', text: "Student GPA vs Hours Studied", pos: "top" },
  { id: 'x', text: "Hours Studied", pos: "bottom" },
  { id: 'y', text: "GPA", pos: "left" },
  { id: 'legend', text: "Dept: CS vs Business", pos: "corner" },
  { id: 'source', text: "Source: Merito Survey 2026", pos: "bottom-right" }
];

function Scene3({ onComplete }) {
  const [placed, setPlaced] = useState({});
  const [feedback, setFeedback] = useState("");

  const pendingLabels = LABELS.filter(L => !placed[L.pos]);
  const currentLabel = pendingLabels.length > 0 ? pendingLabels[0] : null;

  const handleZoneClick = (pos) => {
    if (!currentLabel) return;
    if (currentLabel.pos === pos) {
      setPlaced(prev => ({...prev, [pos]: currentLabel}));
      setFeedback("Perfect.");
      if (pendingLabels.length === 1) { // last one placed
        setTimeout(onComplete, 4000);
      }
    } else {
      setFeedback("Not the right spot for this label.");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  const isDone = pendingLabels.length === 0;

  const getZoneClass = (pos) => {
    if (placed[pos]) return "bg-white border-pencil/20 opacity-100 text-ink font-semibold";
    if (currentLabel) return "border-rust border-dashed bg-rust/5 cursor-pointer text-transparent hover:bg-rust/10 transition";
    return "border-transparent text-transparent";
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20">
        <h2 className="text-2xl font-bold text-ink mb-2">Reading a chart</h2>
        <p className="text-ink/70">
          A chart without labels is just art. Every good chart has a title, labeled axes, a legend, and a source.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Next label to place */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-rust/5 border border-rust/20 p-6 rounded-xl shadow-sm text-center min-h-[160px] flex flex-col items-center justify-center transition-all duration-300">
             {currentLabel ? (
               <>
                 <div className="text-xs font-bold text-rust uppercase tracking-wider mb-4">Place this label</div>
                 <div className="bg-white px-4 py-3 rounded-lg shadow-sm font-bold text-ink border border-pencil/20 animate-fade-in-up">
                   {currentLabel.text}
                 </div>
                 <div className="h-6 mt-4 text-sm font-medium text-error">{feedback}</div>
               </>
             ) : (
               <div className="text-success-dark flex flex-col items-center text-center animate-fade-in">
                 <CheckCircle className="w-12 h-12 mb-3" />
                 <span className="font-bold text-lg mb-1">Fully Labeled!</span>
                 <span className="text-sm opacity-80">Now the chart tells a clear story, and the trendline adds insight.</span>
               </div>
             )}
          </div>

          <div className="mt-auto">
            <div className="flex justify-between text-xs text-ink/50 mb-2 font-medium">
              <span>Progress</span>
              <span>{Object.keys(placed).length} / 5</span>
            </div>
            <div className="w-full h-2 bg-pencil/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rust transition-all duration-500"
                style={{ width: `${(Object.keys(placed).length / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* The interactive chart canvas */}
        <div className="flex-1 bg-white border border-pencil/20 rounded-xl p-6 shadow-sm flex items-center justify-center relative min-h-[350px]">
          
          {/* Top Title Zone */}
          <div onClick={() => handleZoneClick("top")} className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 border-2 rounded-lg text-sm text-center min-w-[200px] h-10 ${getZoneClass('top')}`}>
            {placed["top"]?.text || "Title Area"}
          </div>

          {/* Left Y Zone */}
          <div onClick={() => handleZoneClick("left")} className={`absolute left-4 top-1/2 -translate-y-1/2 px-4 py-2 border-2 rounded-lg text-sm text-center w-[120px] -rotate-90 origin-center h-10 flex items-center justify-center ${getZoneClass('left')}`}>
            {placed["left"]?.text || "Y Axis Area"}
          </div>

          {/* Bottom X Zone */}
          <div onClick={() => handleZoneClick("bottom")} className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 border-2 rounded-lg text-sm text-center min-w-[150px] h-10 ${getZoneClass('bottom')}`}>
            {placed["bottom"]?.text || "X Axis Area"}
          </div>

          {/* Corner Legend Zone */}
          <div onClick={() => handleZoneClick("corner")} className={`absolute top-16 right-6 px-4 py-2 border-2 rounded-lg text-xs leading-relaxed ${getZoneClass('corner')}`}>
            {placed["corner"]?.text ? (
              <div>
                <div className="font-bold mb-1 max-w-[120px]">Dept</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#2A9D8F] rounded-full" /> CS</div>
                <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 bg-[#F4A261] rounded-full" /> Bus</div>
              </div>
            ) : "Legend Area"}
          </div>

          {/* Bottom Right Source Zone */}
          <div onClick={() => handleZoneClick("bottom-right")} className={`absolute bottom-4 right-6 px-3 py-1 border-2 rounded-lg text-[10px] h-6 flex items-center opacity-60 ${getZoneClass('bottom-right')}`}>
            {placed["bottom-right"]?.text || "Source Area"}
          </div>

          {/* Meaningless dots until everything is placed */}
          <div className="w-full h-full max-w-sm max-h-64 border-l-2 border-b-2 border-pencil/20 mt-4 ml-8 relative pt-4 pr-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAzMCAwIEwgMCAwIDAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2YxZjVmOSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat">
             {/* Some randomized dots representing GPA vs Hours */}
             <div className="absolute left-[10%] bottom-[20%] w-3 h-3 bg-[#2A9D8F] rounded-full opacity-80" />
             <div className="absolute left-[30%] bottom-[35%] w-3 h-3 bg-[#F4A261] rounded-full opacity-80" />
             <div className="absolute left-[20%] bottom-[20%] w-3 h-3 bg-[#2A9D8F] rounded-full opacity-80" />
             <div className="absolute left-[40%] bottom-[50%] w-3 h-3 bg-[#F4A261] rounded-full opacity-80" />
             <div className="absolute left-[50%] bottom-[60%] w-3 h-3 bg-[#2A9D8F] rounded-full opacity-80" />
             <div className="absolute left-[70%] bottom-[75%] w-3 h-3 bg-[#F4A261] rounded-full opacity-80" />
             <div className="absolute left-[80%] bottom-[90%] w-3 h-3 bg-[#2A9D8F] rounded-full opacity-80" />
             {/* Trendline */}
             <div className={`absolute left-0 bottom-[10%] h-1 bg-rust transform origin-bottom-left -rotate-[40deg] w-[110%] transition-opacity duration-1000 ${isDone ? 'opacity-50' : 'opacity-0'}`} />
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SCENE 4: Lying with charts ---
function Scene4({ onComplete }) {
  const [step, setStep] = useState(0);

  // Trick 1
  const [yStart, setYStart] = useState(94);
  const [trick1Done, setTrick1Done] = useState(false);
  useEffect(() => { if (yStart === 0 && !trick1Done) setTrick1Done(true); }, [yStart, trick1Done]);

  // Trick 2
  const [timeRange, setTimeRange] = useState(2);
  const [trick2Done, setTrick2Done] = useState(false);
  useEffect(() => { if (timeRange >= 20 && !trick2Done) setTrick2Done(true); }, [timeRange, trick2Done]);

  // Trick 3
  const [is3D, setIs3D] = useState(true);
  const [trick3Done, setTrick3Done] = useState(false);

  // Trick 4
  const [showContext, setShowContext] = useState(false);
  const [trick4Done, setTrick4Done] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const isCurrentDone = (step === 0 && trick1Done) || (step === 1 && trick2Done) || (step === 2 && trick3Done) || (step === 3 && trick4Done);
  const isAllDone = trick1Done && trick2Done && trick3Done && trick4Done;

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink mb-2">Lying with charts</h2>
          <p className="text-ink/70">
            Charts can mislead — sometimes on purpose. Learn to spot the visual tricks.
          </p>
        </div>
        <div className="text-sm font-bold text-ink/40">Trick {step + 1} of 4</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Chart View Area */}
        <div className="flex-1 bg-white border border-pencil/20 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center relative min-h-[350px]">
          
          {step === 0 && (
            <div className="w-full max-w-sm flex flex-col items-center animate-fade-in">
              <h3 className="font-bold mb-4 text-center text-lg leading-tight">Customer Satisfaction<br/><span className="text-pencil font-normal text-sm">(Looks like a massive difference)</span></h3>
              <div className="flex items-end justify-center w-full gap-8 border-b-2 border-pencil/20 pb-0 h-48 relative pl-10 pr-6">
                {/* Y-axis start val */}
                <div className="absolute left-0 bottom-0 text-xs font-bold text-ink/50">{yStart}%</div>
                <div className="absolute left-0 top-0 text-xs font-bold text-ink/50">100%</div>
                
                {/* 98 vs 95 */}
                {/* If yStart is 94, range is 6 (94 to 100). 98 is 4/6 = 66% height. 95 is 1/6 = 16% height. */}
                <div className="flex flex-col items-center w-20 relative group">
                  <div className="text-[10px] font-bold mb-2 absolute -top-5">{yStart < 50 ? 'Company A (98%)' : '98%'}</div>
                  <div className="w-full bg-rust/90 rounded-t-lg transition-all duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]" 
                       style={{ height: `${((98 - yStart)/(100 - yStart))*100}%` }} />
                  <div className="mt-2 text-sm font-bold">A</div>
                </div>
                <div className="flex flex-col items-center w-20 relative group">
                  <div className="text-[10px] font-bold mb-2 absolute -top-5 text-ink/60">{yStart < 50 ? 'Company B (95%)' : '95%'}</div>
                  <div className="w-full bg-[#E9C46A] rounded-t-lg transition-all duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]" 
                       style={{ height: `${((95 - yStart)/(100 - yStart))*100}%` }} />
                  <div className="mt-2 text-sm font-bold">B</div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <h3 className="font-bold mb-4 text-center text-lg leading-tight text-error">"Revenue is Crashing!"<br/><span className="text-ink/50 font-normal text-sm">Viewing {Math.round(timeRange)} weeks</span></h3>
              <div className="w-full max-w-lg h-48 border-b-2 border-l-2 border-pencil/20 relative overflow-hidden flex items-end ml-4">
                 <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" className="absolute bottom-0 left-0">
                   <path d="M 0 90 L 20 80 L 40 60 L 60 50 L 80 30 L 90 20 L 100 60" fill="none" stroke="#E76F51" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                   <rect x={100 - (timeRange/24)*100} y="0" width="100" height="100" fill="none" stroke="#2A9D8F" strokeWidth="2" strokeDasharray="4 4"/>
                 </svg>
                 <div className="absolute right-0 bottom-0 top-0 bg-rust/10 border-l border-rust/50 pointer-events-none transition-all duration-300" style={{ width: `${(timeRange/24)*100}%`}} />
                 <div className="absolute right-4 bottom-2 text-xs font-bold text-rust">Visible framing</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <h3 className="font-bold mb-6 text-center text-lg leading-tight">Market Share<br/><span className="text-pencil font-normal text-sm">Distorted perspective</span></h3>
              <div className="w-full max-w-sm h-64 relative flex items-center justify-center perspective-[500px]">
                {/* Fake 3D pie using scaleY */}
                <div className={`w-48 h-48 border-[16px] border-l-[#F4A261] border-b-[#F4A261] border-t-pencil/20 border-r-pencil/20 rounded-full transition-all duration-700 mx-auto ${is3D ? 'rotate-[-45deg] scale-y-[0.35] shadow-xl' : 'rotate-[-45deg] scale-y-[1] shadow-none'}`}>
                </div>
                {/* 2D overlay labels manually placed */}
                {is3D ? (
                  <div className="absolute bottom-12 bg-white px-3 py-1 text-xs font-bold rounded shadow-md text-rust z-10 animate-fade-in transition-all">Product A (65%??)</div>
                ) : (
                  <div className="absolute bottom-20 left-10 bg-white px-3 py-1 text-xs font-bold rounded shadow-md text-rust z-10 animate-fade-in transition-all">Product A (45%)</div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <h3 className="font-bold mb-4 text-center text-lg leading-tight">"Our Product is #1 Rated!"</h3>
              <div className="flex items-end justify-center w-full gap-4 border-b-2 border-pencil/20 h-48 relative pl-10 pr-6 max-w-lg">
                <div className="absolute left-0 top-0 text-xs font-bold text-ink/50">5.0</div>
                <div className="absolute left-0 bottom-0 text-xs font-bold text-ink/50">0.0</div>
                
                <div className="flex flex-col items-center w-24 group">
                  <div className="text-rust font-bold mb-2">4.1</div>
                  <div className="w-full bg-rust rounded-t-lg shadow-sm" style={{ height: '82%' }} />
                  <div className="mt-2 text-sm font-bold text-center">Us</div>
                </div>
                <div className={`flex flex-col items-center w-24 transition-opacity duration-1000 ${showContext ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="text-ink/60 font-bold mb-2">4.0</div>
                  <div className="w-full bg-pencil/40 rounded-t-lg shadow-sm" style={{ height: '80%' }} />
                  <div className="mt-2 text-sm font-bold text-center truncate w-full">Comp. X</div>
                </div>
                <div className={`flex flex-col items-center w-24 transition-opacity duration-1000 ${showContext ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="text-ink/60 font-bold mb-2">3.9</div>
                  <div className="w-full bg-pencil/40 rounded-t-lg shadow-sm" style={{ height: '78%' }} />
                  <div className="mt-2 text-sm font-bold text-center truncate w-full">Comp. Y</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Interaction Panel */}
        <div className="w-full lg:w-80 flex flex-col">
          {!isAllDone || step < 3 ? (
            <div className="bg-rust/5 border border-rust/20 p-6 rounded-xl shadow-sm h-full flex flex-col">
              <h3 className="font-bold text-rust mb-4 text-lg">Trick: {TRICKS[step].title}</h3>

              {step === 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium text-ink/80 leading-relaxed">Looks like Company A is crushing B, right? Drag the slider to set the Y-axis start point to 0.</p>
                  <input type="range" min="0" max="94" value={yStart} onChange={(e) => setYStart(Number(e.target.value))} className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer outline-none border border-pencil/20" />
                  <div className="font-bold text-ink/60 text-center text-sm">{yStart}</div>
                  {trick1Done && <p className="text-success-dark font-bold text-sm mt-4 animate-fade-in text-center flex justify-center"><CheckCircle className="w-5 h-5 mr-1" /> They are almost identical!</p>}
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium text-ink/80 leading-relaxed">Focusing on a short drop hides the big picture. Drag to expand the time range visible.</p>
                  <input type="range" min="2" max="24" value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer outline-none border border-pencil/20" />
                  <div className="font-bold text-ink/60 text-center text-sm">{Math.round(timeRange)} weeks</div>
                  {trick2Done && <p className="text-success-dark font-bold text-sm mt-4 animate-fade-in text-center flex justify-center"><CheckCircle className="w-5 h-5 mr-1" /> The overall trend is actually up!</p>}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium text-ink/80 leading-relaxed">3D tilts make the front slice look massive. Click below to see the actual 2D proportions.</p>
                  <button onClick={() => { setIs3D(false); setTrick3Done(true); }} className="bg-white border border-pencil/20 px-4 py-3 rounded-xl font-bold hover:bg-pencil/5 hover:border-rust/40 transition shadow-sm text-rust">
                    Flatten to 2D
                  </button>
                  {trick3Done && <p className="text-success-dark font-bold text-sm mt-4 animate-fade-in text-center flex justify-center"><CheckCircle className="w-5 h-5 mr-1" /> They pulled a fast one with 3D!</p>}
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-medium text-ink/80 leading-relaxed">"Rated #1!" sounds great. But out of what? Reveal the context.</p>
                  <button onClick={() => { setShowContext(true); setTrick4Done(true); }} className="bg-white border border-pencil/20 px-4 py-3 rounded-xl font-bold hover:bg-pencil/5 hover:border-rust/40 transition shadow-sm text-rust">
                    Reveal Context
                  </button>
                  {trick4Done && <p className="text-success-dark font-bold text-sm mt-4 animate-fade-in text-center flex justify-center"><CheckCircle className="w-5 h-5 mr-1" /> "Number 1" out of 3, by 0.1 points.</p>}
                </div>
              )}

              {/* Next Button */}
              <div className="mt-auto">
                {isCurrentDone && step < 3 && (
                  <button onClick={handleNext} className="w-full bg-rust text-white p-3 rounded-xl font-bold shadow-md hover:bg-rust/90 transition animate-fade-in flex items-center justify-center">
                    Next Trick &rarr;
                  </button>
                )}
                {isCurrentDone && step === 3 && (
                  <button onClick={onComplete} className="w-full bg-success text-white p-3 rounded-xl font-bold shadow-md hover:bg-success/90 transition animate-fade-in flex items-center justify-center">
                    Done! See Summary
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
// --- SCENE 5: Real World: Visualize the survey ---
const TASKS_5 = [
  { id: 1, q: "Show average satisfaction ratings by department.", ct: 'bar', cx: 'department', cy: 'satisfaction' },
  { id: 2, q: "Show the distribution of student GPAs.", ct: 'histogram', cx: 'gpa', cy: 'count' },
  { id: 3, q: "Is there a relationship between hours studied and GPA?", ct: 'scatter', cx: 'hours_studied', cy: 'gpa' },
  { id: 4, q: "What proportion of our students are in each department?", ct: 'pie', cx: 'department', cy: 'percentage' }
];

const OPTIONS_5 = {
  types: ['bar', 'line', 'pie', 'histogram', 'scatter'],
  vars: ['department', 'satisfaction', 'gpa', 'hours_studied', 'count', 'percentage', 'date']
};

function Scene5({ onComplete }) {
  const [step, setStep] = useState(0);
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  const t = TASKS_5[step];
  const isDone = step >= TASKS_5.length;
  const isCorrect = chartType === t?.ct && xAxis === t?.cx && yAxis === t?.cy;
  
  // Accept bar chart for task 4 as a valid alternative to pie
  const isAltCorrect = step === 3 && chartType === 'bar' && xAxis === 'department' && yAxis === 'percentage';
  const success = isCorrect || isAltCorrect;

  const handleNext = () => {
    setChartType(""); setXAxis(""); setYAxis("");
    setStep(prev => prev + 1);
    if (step + 1 === TASKS_5.length) {
      setTimeout(onComplete, 4000);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink mb-2">Real World: Visualize the survey</h2>
          <p className="text-ink/70">
            WSB Merito surveyed 200 students. Build the right visualizations for the dean's presentation.
          </p>
        </div>
        <div className="text-sm font-bold text-ink/40">Task {Math.min(step + 1, 4)} of 4</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Configuration Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {!isDone ? (
            <div className="bg-rust/5 border border-rust/20 p-6 rounded-xl shadow-sm h-full flex flex-col">
              <h3 className="font-bold text-lg text-ink mb-6">{t.q}</h3>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-bold text-rust uppercase tracking-wider mb-1 block">Chart Type</label>
                  <select value={chartType} onChange={e=>setChartType(e.target.value)} className="w-full p-3 rounded-lg border border-pencil/20 bg-white font-medium text-ink focus:outline-none focus:border-rust">
                    <option value="" disabled>Select Type...</option>
                    {OPTIONS_5.types.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-rust uppercase tracking-wider mb-1 block">X-Axis / Category</label>
                  <select value={xAxis} onChange={e=>setXAxis(e.target.value)} className="w-full p-3 rounded-lg border border-pencil/20 bg-white font-medium text-ink focus:outline-none focus:border-rust">
                    <option value="" disabled>Select Variable...</option>
                    {OPTIONS_5.vars.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-rust uppercase tracking-wider mb-1 block">Y-Axis / Value</label>
                  <select value={yAxis} onChange={e=>setYAxis(e.target.value)} className="w-full p-3 rounded-lg border border-pencil/20 bg-white font-medium text-ink focus:outline-none focus:border-rust">
                     <option value="" disabled>Select Variable...</option>
                     {OPTIONS_5.vars.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                {success ? (
                  <button onClick={handleNext} className="w-full bg-success text-white p-3 rounded-lg font-bold shadow-md hover:bg-success/90 transition animate-fade-in flex items-center justify-center">
                    Perfect! Next Task &rarr;
                  </button>
                ) : (chartType && xAxis && yAxis) ? (
                  <div className="text-error font-bold text-sm text-center bg-error/10 p-3 rounded-lg border border-error/20 animate-fade-in">
                    This combination doesn't effectively answer the question. Re-evaluate your choices.
                  </div>
                ) : (
                  <div className="text-ink/40 text-sm font-medium text-center">Configure all options to see the result.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-success/10 border border-success/30 p-8 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center animate-fade-in">
               <CheckCircle className="w-16 h-16 text-success-dark mb-4" />
               <h3 className="text-xl font-bold text-success-dark mb-2">Presentation Ready</h3>
               <p className="text-success-dark/80 text-sm">
                 You successfully built clear, communicative charts for the dean's presentation.
               </p>
            </div>
          )}
        </div>

        {/* Chart View Area */}
        <div className="flex-1 bg-white border border-pencil/20 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center relative min-h-[350px]">
          {!isDone && (chartType && xAxis && yAxis) ? (
            success ? (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                <h3 className="text-lg font-bold text-ink mb-6 text-center">{t.q}</h3>
                <div className="w-full max-w-sm h-48 border-b-2 border-l-2 border-ink/20 relative flex items-end justify-around px-4 pb-0 bg-rust/5 rounded-tr-xl">
                  {/* Generic mock of a successful chart rendering */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rust font-bold text-xl flex flex-col items-center opacity-80">
                    <CheckCircle className="w-12 h-12 mb-2" />
                    Valid Configuration Generated
                  </div>
                </div>
                <div className="mt-6 text-success-dark font-bold text-sm bg-success/10 px-4 py-2 rounded-lg border border-success/20">
                  {isAltCorrect ? "A bar chart is actually a great alternative to a pie chart here!" : "This chart type and variable mapping perfectly represent the answer."}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in opacity-50">
                <AlertTriangle className="w-16 h-16 text-error mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">Meaningless Chart</h3>
                <p className="text-sm font-medium">"{chartType}" with X="{xAxis}" and Y="{yAxis}" obscures the insight.</p>
              </div>
            )
          ) : (
            <div className="text-ink/30 flex flex-col items-center text-center">
              <BarChart2 className="w-16 h-16 mb-4" />
              <div className="font-bold text-lg">Chart Preview Builder</div>
              <div className="text-sm">Select options to render visually.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- SCENE 6: Challenge: Dashboard builder ---
const TASKS_6 = [
  { id: 1, q: "Which product category generated the most revenue?", ct: 'horizontal bar', cx: 'revenue', cy: 'category' },
  { id: 2, q: "How are total sales trending over the current month?", ct: 'line', cx: 'date', cy: 'revenue' },
  { id: 3, q: "Where are the majority of our customers located?", ct: 'map or bar', cx: 'region', cy: 'customers' }
];

const OPTIONS_6 = {
  types: ['bar', 'horizontal bar', 'line', 'pie', 'map or bar'],
  vars: ['category', 'revenue', 'quantity', 'date', 'region', 'customers', 'product']
};

function Scene6({ onComplete }) {
  const [step, setStep] = useState(0);
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  const t = TASKS_6[step];
  const isDone = step >= TASKS_6.length;
  
  // Custom logic for the dashboard builder
  const isCorrect = 
    chartType === t?.ct && 
    ((xAxis === t?.cx && yAxis === t?.cy) || (xAxis === t?.cy && yAxis === t?.cx)); // allow swapped axes if horizontal bar

  const handleNext = () => {
    setChartType(""); setXAxis(""); setYAxis("");
    setStep(prev => prev + 1);
    // don't auto-complete, let user view dashboard
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 max-w-5xl mx-auto">
      <div className="bg-paper p-6 rounded-2xl shadow-sm border border-pencil/20 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink mb-2">Challenge: Dashboard builder</h2>
          <p className="text-ink/70">
            Build a 3-chart dashboard to answer the CEO's critical business questions.
          </p>
        </div>
        {!isDone && <div className="text-sm font-bold text-rust">Chart {step + 1} of 3</div>}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {!isDone ? (
          <>
            <div className="w-full lg:w-80 flex flex-col gap-4">
              <div className="bg-rust/5 border border-rust/20 p-6 rounded-xl shadow-sm h-full flex flex-col">
                <div className="text-xs font-bold text-rust uppercase tracking-wider mb-2">CEO asks:</div>
                <h3 className="font-bold text-lg text-ink mb-6">"{t.q}"</h3>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-bold text-rust uppercase tracking-wider mb-1 block">Chart Type</label>
                    <select value={chartType} onChange={e=>setChartType(e.target.value)} className="w-full p-3 rounded-lg border border-pencil/20 bg-white font-medium text-ink focus:outline-none focus:border-rust">
                      <option value="" disabled>Select...</option>
                      {OPTIONS_6.types.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-rust uppercase tracking-wider mb-1 block">X-Axis</label>
                    <select value={xAxis} onChange={e=>setXAxis(e.target.value)} className="w-full p-3 rounded-lg border border-pencil/20 bg-white font-medium text-ink focus:outline-none focus:border-rust">
                      <option value="" disabled>Select...</option>
                      {OPTIONS_6.vars.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-rust uppercase tracking-wider mb-1 block">Y-Axis</label>
                    <select value={yAxis} onChange={e=>setYAxis(e.target.value)} className="w-full p-3 rounded-lg border border-pencil/20 bg-white font-medium text-ink focus:outline-none focus:border-rust">
                      <option value="" disabled>Select...</option>
                      {OPTIONS_6.vars.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  {isCorrect ? (
                    <button onClick={handleNext} className="w-full bg-rust text-white p-3 rounded-lg font-bold shadow-md hover:bg-rust/90 transition animate-fade-in">
                      Lock Chart into Dashboard &rarr;
                    </button>
                  ) : (chartType && xAxis && yAxis) ? (
                    <div className="text-error font-bold text-sm text-center">
                      Incorrect config. Think about what metric needs to be measured against what dimension.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white border border-pencil/20 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center relative min-h-[350px]">
              {(chartType && xAxis && yAxis) ? (
                isCorrect ? (
                  <div className="text-success-dark flex flex-col items-center text-center animate-fade-in">
                    <CheckCircle className="w-16 h-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Chart Looks Great</h3>
                    <p className="text-sm opacity-80">This exactly answers the CEO's question.</p>
                  </div>
                ) : (
                  <div className="text-ink/40 flex flex-col items-center text-center animate-fade-in">
                    <AlertTriangle className="w-16 h-16 mb-4 text-error/50" />
                    <h3 className="text-xl font-bold text-ink mb-2">Does not compute</h3>
                    <p className="text-sm opacity-80">Recheck the chart constraints and variable assignments.</p>
                  </div>
                )
              ) : (
                <div className="text-ink/30 font-bold text-xl uppercase tracking-wider">Dashboard Viewpoint Active</div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full animate-fade-in flex flex-col">
            <div className="bg-white border2 border-pencil/20 rounded-2xl shadow-xl overflow-hidden">
               <div className="bg-ink p-4 flex justify-between items-center text-white">
                  <div className="font-bold">CEO Executive Dashboard</div>
                  <div className="text-xs opacity-50">Live Sync</div>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-paper">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-pencil/10">
                   <div className="font-bold text-ink mb-4 text-sm border-b border-pencil/10 pb-2">Revenue by Category</div>
                   <div className="h-32 bg-rust/10 rounded border-l-4 border-rust flex flex-col justify-around py-2 pl-2">
                     <div className="h-3 bg-rust rounded-r w-[80%]" />
                     <div className="h-3 bg-rust rounded-r w-[60%]" />
                     <div className="h-3 bg-rust rounded-r w-[40%]" />
                     <div className="h-3 bg-rust rounded-r w-[90%]" />
                   </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-pencil/10">
                   <div className="font-bold text-ink mb-4 text-sm border-b border-pencil/10 pb-2">Sales Trend (MTD)</div>
                   <div className="h-32 bg-pencil/5 rounded border-l border-b border-pencil/20 flex items-end">
                      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M 0 80 L 25 60 L 50 70 L 75 30 L 100 20" fill="none" stroke="#2A9D8F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      </svg>
                   </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-pencil/10">
                   <div className="font-bold text-ink mb-4 text-sm border-b border-pencil/10 pb-2">Customer Regions</div>
                   <div className="h-32 bg-[#E9C46A]/10 rounded border-l border-b border-pencil/20 flex items-end justify-around px-2">
                     <div className="w-6 bg-[#E9C46A] rounded-t h-[40%]" />
                     <div className="w-6 bg-[#E9C46A] rounded-t h-[70%]" />
                     <div className="w-6 bg-[#E9C46A] rounded-t h-[30%]" />
                     <div className="w-6 bg-[#E9C46A] rounded-t h-[90%]" />
                   </div>
                 </div>
               </div>
               <div className="bg-success text-white p-4 text-center font-bold flex items-center justify-center cursor-pointer hover:bg-success/90 transition" onClick={onComplete}>
                  <CheckCircle className="w-5 h-5 mr-2" /> Complete Lesson
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VisualizationLesson({ currentPhase = 'learn', currentStep = 0, onComplete }) {
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
