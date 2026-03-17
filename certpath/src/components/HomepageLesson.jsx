import React, { useState, useEffect, useRef } from 'react';

// --- Icons (Raw SVGs to ensure zero dependencies) ---
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const RobotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="3" fill="white" fillOpacity="0.2" />
    <circle cx="8" cy="11" r="1" fill="white" stroke="none" />
    <circle cx="16" cy="11" r="1" fill="white" stroke="none" />
    <path d="M10 15h4" />
    <path d="M12 5V3" />
    <path d="M10 3h4" />
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

// --- Constants & Data ---
const CELL_SIZE = 56;
const COLS = 5;
const ROWS = 4;

const MAPS = [
  // Scene 1 (teach): robot at (0,0), pkg at top-right, no walls
  { pkg: { x: 4, y: 0 }, walls: [] },
  // Scene 2 (do): same — robot moves right to package
  { pkg: { x: 4, y: 0 }, walls: [] },
  // Scene 3 (teach): same map as Scene 4 so user sees the walls before interacting
  { pkg: { x: 1, y: 3 }, walls: [{ x: 2, y: 0 }] },
  // Scene 4 (do): robot goes right, hits wall at (2,0), turns right (down), goes to (2,3), turns right (left)...
  // With "turn right": robot spirals clockwise. Pkg at (4,3): right to wall→turn right(down)→down to (1,3)→...
  // Simpler: wall at col 2 row 0, pkg at (1,3). Right→hit wall→turn right(down)→go down to (1,3)=pkg!
  { pkg: { x: 1, y: 3 }, walls: [{ x: 2, y: 0 }] },
  // Scene 5 (do): needs both turn right AND turn left to fire
  // Walls: (2,0) blocks row 0, (1,2) blocks col 1 row 2, (0,1) blocks left when facing down at (1,1)
  // Path: right→(1,0)→wall(2,0)→right clear(1,1)→turnR(down)→(1,1)→wall(1,2) AND right(0,1) wall→turnL(right)→(2,1)→(3,1)→(4,1)→OOB→right(4,2)clear→turnR(down)→(4,2)→(4,3)=pkg
  // Correct answers: answers[0]="turn right", answers[1]="turn left"
  { pkg: { x: 4, y: 3 }, walls: [{ x: 2, y: 0 }, { x: 1, y: 2 }, { x: 0, y: 1 }] },
  // Scene 6 (teach): summary, grid hidden
  { pkg: { x: 0, y: 0 }, walls: [] },
];

const SCENES = [
  { title: "Meet the robot", text: "This robot delivers packages. But it can\u2019t think for itself \u2014 it needs rules. You\u2019ll write them using if and else.", type: "teach" },
  { title: "Your first rule", text: "The robot checks what\u2019s ahead. If the path is clear, it moves forward.", type: "do" },
  { title: "But what if there\u2019s a wall?", text: "Real paths aren\u2019t always clear. When the robot hits a wall, it needs a backup plan. That\u2019s what else is for.", type: "teach" },
  { title: "Write the rule", text: "Click or drag the right action into the else block to get the robot around the wall.", type: "do" },
  { title: "Level up: nested conditions", text: "Now there are TWO walls. The robot needs to check both directions.", type: "do" },
  { title: "What you just learned", text: "You just wrote a program. Every app, game, and website uses if/else logic like this \u2014 from Netflix recommendations to self-driving cars.", type: "teach" },
];

// --- Inline keyframe styles (static, no XSS risk) ---
const KEYFRAME_STYLES = [
  '@keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }',
  '.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }',
  '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }',
].join('\n');

export default function HomepageLesson() {
  const [step, setStep] = useState(0);
  const [robotState, setRobotState] = useState({ x: 0, y: 0 });
  const [activeLine, setActiveLine] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simStatus, setSimStatus] = useState('idle');
  const [answers, setAnswers] = useState([null, null]);
  const activeSimId = useRef(0);
  const styleRef = useRef(null);

  // Inject keyframe styles once
  useEffect(() => {
    if (styleRef.current) return;
    const style = document.createElement('style');
    style.textContent = KEYFRAME_STYLES;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => { if (style.parentNode) style.parentNode.removeChild(style); };
  }, []);

  useEffect(() => {
    activeSimId.current = Date.now();
    setRobotState({ x: 0, y: 0 });
    setActiveLine(null);
    setIsRunning(false);
    setSimStatus('idle');
    setAnswers([null, null]);
  }, [step]);

  const getForward = (x, y, d) => {
    if (d === 0) return { x, y: y - 1 };
    if (d === 1) return { x: x + 1, y };
    if (d === 2) return { x, y: y + 1 };
    return { x: x - 1, y };
  };

  const isClear = (nx, ny, walls) => nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !walls.some(w => w.x === nx && w.y === ny);

  const runSimulation = async () => {
    if (isRunning) return;
    if (step === 3 && !answers[0]) return;
    if (step === 4 && (!answers[0] || !answers[1])) return;

    const simId = Date.now();
    activeSimId.current = simId;
    setIsRunning(true);
    setSimStatus('running');

    let cx = 0, cy = 0, dir = 1;
    let succeeded = false;
    setRobotState({ x: 0, y: 0 });
    setActiveLine(null);

    const wait = (ms) => new Promise(res => setTimeout(res, ms));
    await wait(300);

    let iterations = 0;
    const map = MAPS[step];

    while (iterations < 35) {
      if (activeSimId.current !== simId) return;
      iterations++;

      if (cx === map.pkg.x && cy === map.pkg.y) { succeeded = true; setSimStatus('success'); break; }

      setActiveLine(1);
      await wait(400);
      if (activeSimId.current !== simId) return;

      const fwd = getForward(cx, cy, dir);
      const fwdClear = isClear(fwd.x, fwd.y, map.walls);

      if (fwdClear) {
        setActiveLine(2);
        await wait(350);
        cx = fwd.x; cy = fwd.y;
        setRobotState({ x: cx, y: cy });
        await wait(350);
      } else {
        if (step === 1 || step === 2) { setSimStatus('error'); break; }

        if (step === 3) {
          setActiveLine(3); await wait(300);
          setActiveLine(4); await wait(350);
          const act = answers[0];
          if (act === 'turn right') { dir = (dir + 1) % 4; }
          else if (act === 'turn left') { dir = (dir + 3) % 4; }
          else { setSimStatus('error'); break; }
          await wait(200);
        } else if (step === 4) {
          setActiveLine(3); await wait(350);
          const rightDir = (dir + 1) % 4;
          const rFwd = getForward(cx, cy, rightDir);

          if (isClear(rFwd.x, rFwd.y, map.walls)) {
            setActiveLine(4); await wait(350);
            const act = answers[0];
            if (act === 'turn right') { dir = (dir + 1) % 4; }
            else if (act === 'turn left') { dir = (dir + 3) % 4; }
            else { setSimStatus('error'); break; }
          } else {
            setActiveLine(5); await wait(250);
            setActiveLine(6); await wait(350);
            const act = answers[1];
            if (act === 'turn left') { dir = (dir + 3) % 4; }
            else if (act === 'turn right') { dir = (dir + 1) % 4; }
            else { setSimStatus('error'); break; }
          }
          await wait(200);
        }
      }
    }

    if (activeSimId.current === simId) {
      if (!succeeded) {
        setSimStatus('error');
        setTimeout(() => {
          if (activeSimId.current === simId) {
            setSimStatus('idle');
            setRobotState({ x: 0, y: 0 });
          }
        }, 2000);
      }
      setIsRunning(false);
      setActiveLine(null);
    }
  };

  const handleAnswerPlace = (actionStr) => {
    if (isRunning) return;
    if (step === 3) setAnswers([actionStr, null]);
    else if (step === 4) {
      if (!answers[0]) setAnswers([actionStr, answers[1]]);
      else if (!answers[1]) setAnswers([answers[0], actionStr]);
      else setAnswers([answers[0], actionStr]);
    }
  };

  const removeAnswer = (idx) => {
    if (isRunning) return;
    const newAnswers = [...answers];
    newAnswers[idx] = null;
    setAnswers(newAnswers);
  };

  const handleDragStart = (e, actionStr) => { e.dataTransfer.setData('action', actionStr); };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (isRunning) return;
    const actionStr = e.dataTransfer.getData('action');
    if (actionStr) {
      const newAnswers = [...answers];
      newAnswers[idx] = actionStr;
      setAnswers(newAnswers);
    }
  };

  const map = MAPS[step];
  const scene = SCENES[step];
  const runBtnDisabled = isRunning || (step === 3 && !answers[0]) || (step === 4 && (!answers[0] || !answers[1]));

  const gridCells = Array.from({ length: ROWS * COLS }, (_, i) => {
    const x = i % COLS;
    const y = Math.floor(i / COLS);
    const isWall = map.walls.some(w => w.x === x && w.y === y);
    const isPkg = map.pkg.x === x && map.pkg.y === y;
    const isPath = step === 1 && y === 0 && x <= 4;

    return (
      <div key={i} className={`w-[56px] h-[56px] border border-black/5 absolute flex items-center justify-center ${isWall ? 'bg-[#1a1a2e]' : isPath ? 'bg-rust/10' : 'bg-white'}`} style={{ left: x * CELL_SIZE, top: y * CELL_SIZE }}>
        {isWall && <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,#fff_8px,#fff_16px)]" />}
        {isPkg && (
          <div className="relative z-10 animate-bounce" style={{ animationDuration: '2s' }}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${simStatus === 'success' ? 'bg-[#2a9d8f] scale-110 transition-transform' : 'bg-white border-2 border-[#2a9d8f]'}`}>
              {simStatus === 'success' ? <CheckIcon /> : <PackageIcon />}
            </div>
          </div>
        )}
      </div>
    );
  });

  const CodeLine = ({ n, active, children }) => (
    <div className={`flex items-center px-4 py-1.5 transition-colors duration-200 ${active ? 'bg-rust/30' : 'bg-transparent'}`}>
      <span className="w-5 shrink-0 text-white/30 text-right mr-4 text-xs select-none">{n}</span>
      <div className="flex-1 whitespace-nowrap">{children}</div>
    </div>
  );

  const DropZone = ({ idx }) => {
    const val = answers[idx];
    return (
      <div onClick={() => removeAnswer(idx)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, idx)}
        className={`inline-flex items-center justify-center min-w-[140px] h-8 px-3 rounded-lg text-xs font-mono transition-all ${val ? 'bg-rust/20 border-2 border-rust text-white cursor-pointer hover:border-[#dc2626] hover:opacity-80' : 'border-2 border-dashed border-white/20 text-white/40 cursor-pointer hover:border-white/50 bg-white/5'}`}>
        {val || "drop action here"}
      </div>
    );
  };

  return (
    <div className="font-sans text-base text-ink w-full max-w-[680px] mx-auto bg-card rounded-xl border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="font-bold text-lg mb-1">{scene.title}</h3>
        <p className="text-ink/60 text-sm leading-relaxed">{scene.text}</p>
      </div>

      <div className="px-6 pb-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-center">
        {step < 5 ? (
          <>
            <div className="relative shrink-0 w-[280px] h-[224px] bg-white rounded-xl border-[1.5px] border-ink/12 overflow-hidden shadow-inner">
              {gridCells}
              <div className={`absolute w-10 h-10 flex items-center justify-center bg-rust rounded-xl shadow-md z-20 ${isRunning ? 'transition-all duration-300 ease-in-out' : 'transition-all duration-500 ease-out'} ${simStatus === 'error' ? 'animate-[shake_0.4s_ease-in-out] border-2 border-[#dc2626]' : 'border-2 border-transparent'}`}
                style={{ left: robotState.x * CELL_SIZE + 8, top: robotState.y * CELL_SIZE + 8 }}>
                <RobotIcon />
                {simStatus === 'success' && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#2a9d8f] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm"><CheckIcon /></div>
                )}
              </div>
            </div>

            {scene.type === 'do' && (
              <div className="flex-1 w-full max-w-[320px] flex flex-col gap-4">
                <div className="bg-[#1a1a2e] text-white py-4 rounded-xl font-mono text-sm relative overflow-hidden shadow-md">
                  <CodeLine n={1} active={activeLine === 1}>
                    <span className="text-[#2a9d8f] font-bold mr-2">if</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-md text-white/90">path ahead is clear</span>
                  </CodeLine>
                  <CodeLine n={2} active={activeLine === 2}>
                    <span className="ml-6 text-white/70">move forward</span>
                  </CodeLine>
                  {step >= 3 && (
                    <CodeLine n={3} active={activeLine === 3}>
                      <span className="text-[#2a9d8f] font-bold">{step === 4 ? 'else if' : 'else'}</span>
                      {step === 4 && <span className="bg-white/10 px-2 py-0.5 rounded-md text-white/90 ml-2">path right is clear</span>}
                    </CodeLine>
                  )}
                  {step >= 3 && (
                    <CodeLine n={4} active={activeLine === 4}>
                      <span className="ml-6"><DropZone idx={0} /></span>
                    </CodeLine>
                  )}
                  {step === 4 && (
                    <>
                      <CodeLine n={5} active={activeLine === 5}><span className="text-[#2a9d8f] font-bold">else</span></CodeLine>
                      <CodeLine n={6} active={activeLine === 6}><span className="ml-6"><DropZone idx={1} /></span></CodeLine>
                    </>
                  )}
                </div>

                {(step === 3 || step === 4) && (
                  <div className="flex flex-wrap gap-2">
                    {['turn right', 'turn left', 'move backward'].map((act) => (
                      <button key={act} draggable onDragStart={(e) => handleDragStart(e, act)} onClick={() => handleAnswerPlace(act)} disabled={isRunning}
                        className="px-3 py-1.5 bg-white border-[1.5px] border-ink/12 rounded-lg font-mono text-xs shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        {act}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-2">
                  <button onClick={runSimulation} disabled={runBtnDisabled}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${simStatus === 'success' ? 'bg-[#2a9d8f] text-white shadow-md' : runBtnDisabled ? 'bg-paper text-pencil cursor-not-allowed' : 'bg-rust text-white shadow-md hover:bg-rust/90 active:scale-95'} ${!isRunning && !runBtnDisabled && simStatus === 'idle' && step < 3 ? 'animate-pulse' : ''}`}>
                    {simStatus === 'success' ? <><CheckIcon /> Done</> : isRunning ? <span className="flex items-center gap-2 opacity-80"><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running</span> : <><PlayIcon /> Run</>}
                  </button>
                  <div className="text-xs font-semibold px-2">
                    {simStatus === 'success' && <span className="text-[#2a9d8f] animate-fade-in">Perfect!</span>}
                    {simStatus === 'error' && <span className="text-[#dc2626] animate-fade-in">Got stuck. Trying again...</span>}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-[#2a9d8f]/10 rounded-2xl flex items-center justify-center mb-6">
              <div className="text-[#2a9d8f] scale-150"><CheckIcon /></div>
            </div>
            <div className="max-w-sm w-full bg-white border-[1.5px] border-ink/12 rounded-xl p-5 text-left mb-8 shadow-sm">
              <ul className="space-y-4">
                {[['if', 'checks a condition'], ['else', 'runs when false'], ['else if', 'checks another option']].map(([kw, desc]) => (
                  <li key={kw} className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#2a9d8f]"><CheckIcon /></div>
                    <div><span className="font-mono font-bold text-[#2a9d8f] text-sm mr-2">{kw}</span><span className="text-sm text-ink/60">{desc}</span></div>
                  </li>
                ))}
              </ul>
            </div>
            <a href="/onboarding" className="bg-rust text-white rounded-xl px-8 py-3.5 font-bold text-sm shadow-md hover:bg-rust/90 transition-colors active:scale-95 mb-3 inline-block">Start your path →</a>
            <p className="text-xs text-pencil font-medium">This is 1 of 48 interactive lessons in the Cybersecurity track</p>
          </div>
        )}
      </div>

      <div className="border-t-[1.5px] border-ink/5 p-4 bg-paper/50 flex items-center justify-between">
        <button onClick={() => setStep(Math.max(0, step - 1))} className={`text-sm font-semibold px-2 py-1 transition-opacity ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-pencil hover:text-ink'}`}>← Back</button>
        <div className="flex gap-2">
          {SCENES.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === step ? 'bg-rust' : i < step ? 'bg-[#2a9d8f]' : 'bg-ink/10'}`} />)}
        </div>
        {(() => {
          const isTeach = scene.type === 'teach';
          const canNext = step < 5 && (isTeach || simStatus === 'success');
          return (
            <button onClick={() => setStep(Math.min(SCENES.length - 1, step + 1))} disabled={!canNext}
              className={`text-sm font-semibold px-2 py-1 transition-opacity ${step >= 5 ? 'opacity-0 pointer-events-none' : ''} ${canNext ? 'text-rust hover:text-rust/80' : 'text-ink/20 cursor-not-allowed'}`}>Next →</button>
          );
        })()}
      </div>
    </div>
  );
}
