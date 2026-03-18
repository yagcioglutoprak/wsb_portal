import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckIcon } from '../../components/Icons';
import { sounds } from '../../hooks/useSound';

// ============================================================================
// SCENE 1: The building blocks (learn-0)
// ============================================================================
const Scene1 = ({ onComplete }) => {
  const [placed, setPlaced] = useState({
    cdn: false,
    lb: false,
    web: false,
    cache: false,
    db: false,
  });
  const [shakeId, setShakeId] = useState(null);

  const components = [
    { id: 'cdn', name: 'CDN', icon: '🌐' },
    { id: 'lb', name: 'Load Balancer', icon: '⚖️' },
    { id: 'web', name: 'Web Server', icon: '🖥️' },
    { id: 'cache', name: 'Cache', icon: '⚡' },
    { id: 'db', name: 'Database', icon: '🗄️' },
  ];

  const slots = ['cdn', 'lb', 'web', 'cache', 'db'];

  const handleDrop = (targetSlot, e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('compId');

    if (draggedId === targetSlot) {
      sounds.snap();
      setPlaced(prev => ({ ...prev, [targetSlot]: true }));
    } else {
      sounds.wrong();
      setShakeId(targetSlot);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  const isComplete = Object.values(placed).every(Boolean);

  useEffect(() => {
    if (isComplete) {
      sounds.correct();
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        A modern web app isn't just one server. It's a team of specialized components, each doing one job really well.
        <br/><span className="text-sm text-pencil mt-2 block">Drag the components into their correct position in the architecture flow.</span>
      </p>

      {/* Architecture Canvas */}
      <div className="w-full max-w-5xl bg-paper border-[1.5px] border-ink/12 rounded-2xl p-8 shadow-inner relative flex items-center justify-between min-h-[250px]">
        {/* User */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 bg-[#fdfcfa] rounded-full border-2 border-ink/20 flex items-center justify-center text-3xl shadow-sm z-10">
            👤
          </div>
          <span className="text-xs font-bold text-pencil uppercase">User</span>
        </div>

        {/* Connection Line Background */}
        <div className="absolute left-20 right-10 top-1/2 -translate-y-1/2 h-1 bg-ink/10 -z-0"></div>

        {/* Drop Slots */}
        <div className="flex-1 flex justify-around px-8 z-10">
          {slots.map((slot, index) => {
            const comp = components.find(c => c.id === slot);
            const isPlaced = placed[slot];

            return (
              <div
                key={slot}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(slot, e)}
                className="flex flex-col items-center gap-2 relative"
              >
                <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-3xl transition-all duration-300 ${
                  isPlaced
                    ? 'bg-[#fdfcfa] border-2 border-success shadow-lg scale-110 z-20'
                    : shakeId === slot
                      ? 'border-2 border-error bg-error/10 animate-[shake_0.5s_ease-in-out]'
                      : 'border-2 border-dashed border-ink/20 bg-white/50'
                }`}>
                  {isPlaced ? comp.icon : '?'}
                </div>
                <div className={`text-xs font-bold uppercase transition-opacity ${isPlaced ? 'text-ink opacity-100' : 'text-pencil opacity-0'}`}>
                  {comp.name}
                </div>

                {/* Animated Data Line (shows when placed) */}
                {isPlaced && index < slots.length - 1 && placed[slots[index + 1]] && (
                  <div className="absolute top-1/2 left-[calc(100%+8px)] w-[calc(100%-16px)] h-1 bg-success/30 -translate-y-1/2 -z-10 overflow-hidden">
                    <div className="w-full h-full bg-success animate-[flow_1s_linear_infinite]" style={{ transformOrigin: 'left' }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Draggable Components */}
      <div className="flex flex-wrap gap-4 justify-center">
        {components.filter(c => !placed[c.id]).map(comp => (
          <div
            key={comp.id}
            draggable
            onDragStart={e => e.dataTransfer.setData('compId', comp.id)}
            className="flex items-center gap-3 px-6 py-3 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all"
          >
            <span className="text-2xl">{comp.icon}</span>
            <span className="font-bold text-sm text-ink">{comp.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 2: What each one does (learn-1)
// ============================================================================
const Scene2 = ({ onComplete }) => {
  const [activeComp, setActiveComp] = useState(null);
  const [viewed, setViewed] = useState(new Set());

  const components = [
    {
      id: 'cdn', name: 'CDN', icon: '🌐',
      desc: "Content Delivery Network. Stores static files (images, videos, CSS) in data centers around the world.",
      action: "When a user in Warsaw requests an image, they get it from a nearby server, not one in the US. This makes loading lightning fast."
    },
    {
      id: 'lb', name: 'Load Balancer', icon: '⚖️',
      desc: "The traffic cop. Distributes incoming requests across multiple web servers.",
      action: "If one server crashes or gets too busy, the load balancer instantly routes traffic to healthy servers so users don't see an error."
    },
    {
      id: 'web', name: 'Web Server', icon: '🖥️',
      desc: "The brain. Runs your application code (Python, Node.js, Java).",
      action: "It receives requests, processes business logic, talks to databases, and generates the final HTML or JSON response."
    },
    {
      id: 'cache', name: 'Cache', icon: '⚡',
      desc: "The short-term memory. Stores frequently accessed data in RAM.",
      action: "Database queries are slow. A cache saves the result of a query. Next time someone asks, the cache replies instantly without bothering the database."
    },
    {
      id: 'db', name: 'Database', icon: '🗄️',
      desc: "The long-term memory. Safely stores user accounts, orders, and structured data.",
      action: "Optimized for complex queries and durability. Even if the server loses power, data written to the database is safe."
    }
  ];

  const handleZoom = (id) => {
    sounds.pop();
    setActiveComp(id);
    setViewed(prev => new Set(prev).add(id));
  };

  const isComplete = viewed.size === components.length;

  useEffect(() => {
    if (isComplete) {
      sounds.correct();
      const timer = setTimeout(() => onComplete(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Let's zoom into each component and see what happens inside.
        <br/><span className="text-sm text-pencil mt-2 block">Click on all 5 components to learn more.</span>
      </p>

      {/* Mini Architecture */}
      <div className="flex items-center gap-4 bg-paper px-8 py-6 rounded-2xl border-[1.5px] border-ink/12 shadow-sm">
        {components.map((comp, index) => (
          <React.Fragment key={comp.id}>
            <button
              onClick={() => handleZoom(comp.id)}
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all shadow-sm relative ${
                activeComp === comp.id
                  ? 'bg-rust text-white scale-110 ring-4 ring-rust/20 z-10'
                  : viewed.has(comp.id)
                    ? 'bg-[#fdfcfa] border-2 border-ink/20 text-ink/80 hover:border-rust/50'
                    : 'bg-[#fdfcfa] border-2 border-rust hover:scale-105 animate-pulse text-ink'
              }`}
            >
              {comp.icon}
              {viewed.has(comp.id) && <div className="absolute -top-2 -right-2 w-5 h-5 bg-success rounded-full flex items-center justify-center text-white text-xs"><CheckIcon className="w-3 h-3"/></div>}
            </button>
            {index < components.length - 1 && <div className="w-8 h-[2px] bg-ink/20"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Detail Panel */}
      <div className="w-full max-w-2xl min-h-[250px] bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative overflow-hidden">
        {activeComp ? (
          <div className="animate-fade-in h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-ink/10">
              <span className="text-4xl bg-paper w-16 h-16 rounded-xl flex items-center justify-center border border-ink/10 shadow-sm">
                {components.find(c => c.id === activeComp).icon}
              </span>
              <div>
                <h3 className="text-2xl font-bold text-ink">{components.find(c => c.id === activeComp).name}</h3>
                <div className="text-sm font-bold text-rust uppercase tracking-wider">Component Profile</div>
              </div>
            </div>
            <p className="text-ink/80 font-medium text-lg mb-4">
              {components.find(c => c.id === activeComp).desc}
            </p>
            <div className="bg-rust/5 p-4 rounded-xl border border-rust/10 text-rust-dark font-medium mt-auto">
              <span className="font-bold mr-2">Why we need it:</span>
              {components.find(c => c.id === activeComp).action}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-pencil font-medium italic">
            Select a component above to inspect it.
          </div>
        )}
      </div>

      {isComplete && (
        <div className="text-success font-bold animate-fade-in flex items-center gap-2">
          <CheckIcon className="w-5 h-5" /> All components inspected
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCENE 3: The request journey (learn-2)
// ============================================================================
const Scene3 = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const journey = [
    { id: 0, target: 'user', desc: "User sends request: 'Load my profile page'", time: 0 },
    { id: 1, target: 'cdn', desc: "CDN serves static images (avatar, logo) instantly.", time: 15 },
    { id: 2, target: 'lb', desc: "Load Balancer routes API request to Server #2 (least busy).", time: 20 },
    { id: 3, target: 'web', desc: "Web Server starts processing request, needs user data.", time: 25 },
    { id: 4, target: 'cache', desc: "Cache check: Cache miss! Data isn't in memory.", time: 30 },
    { id: 5, target: 'db', desc: "Database query: SELECT * FROM users WHERE id=42", time: 100 },
    { id: 6, target: 'cache', desc: "Cache stores the DB result for the next time.", time: 105 },
    { id: 7, target: 'user', desc: "Response travels back to user. Profile loaded!", time: 120 },
  ];

  useEffect(() => {
    let timer, completeTimer;
    if (isPlaying && step < journey.length - 1) {
      timer = setTimeout(() => setStep(prev => prev + 1), 1500);
    } else if (step === journey.length - 1) {
      setIsPlaying(false);
      completeTimer = setTimeout(() => onComplete(), 2000);
    }
    return () => { clearTimeout(timer); clearTimeout(completeTimer); };
  }, [isPlaying, step, journey.length, onComplete]);

  const components = [
    { id: 'user', icon: '👤', label: 'User' },
    { id: 'cdn', icon: '🌐', label: 'CDN' },
    { id: 'lb', icon: '⚖️', label: 'Load Balancer' },
    { id: 'web', icon: '🖥️', label: 'Web Server' },
    { id: 'cache', icon: '⚡', label: 'Cache' },
    { id: 'db', icon: '🗄️', label: 'Database' },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Let's follow a single request from start to finish.
      </p>

      {/* Architecture Display */}
      <div className="w-full max-w-5xl bg-paper border-[1.5px] border-ink/12 rounded-2xl p-8 shadow-inner relative flex items-center justify-between min-h-[300px]">
        {/* Connection Line */}
        <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-[2px] bg-ink/10 -z-0"></div>

        {components.map((comp) => {
          const isActive = journey[step].target === comp.id;
          return (
            <div key={comp.id} className="flex flex-col items-center gap-3 relative z-10">
              <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-3xl transition-all duration-300 ${
                isActive
                  ? 'bg-rust text-white scale-125 shadow-xl ring-4 ring-rust/20'
                  : 'bg-[#fdfcfa] border-2 border-ink/20 shadow-sm'
              }`}>
                {comp.icon}
              </div>
              <div className={`text-xs font-bold uppercase ${isActive ? 'text-rust' : 'text-pencil'}`}>
                {comp.label}
              </div>

              {/* Active Bubble */}
              {isActive && (
                <div className="absolute bottom-[calc(100%+16px)] w-48 bg-ink text-white p-3 rounded-xl text-sm shadow-xl animate-fade-in z-50 text-center pointer-events-none">
                  {journey[step].desc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-ink"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 w-full max-w-3xl bg-[#fdfcfa] p-4 rounded-xl border border-ink/10 shadow-sm">
        <div className="flex gap-4">
          <button
            onClick={() => { setStep(0); setIsPlaying(true); }}
            className="bg-rust hover:bg-rust/90 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            {step === 0 ? 'Start Request' : 'Restart'}
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={step === journey.length - 1}
            className="bg-paper border border-ink/20 px-6 py-2 rounded-lg font-bold text-sm text-ink hover:bg-ink/5 hover:border-ink/30 disabled:opacity-50 transition-colors"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>

        {/* Timeline Progress */}
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-pencil mb-1">
            <span>Step {step + 1}/8</span>
            <span className="text-rust">{journey[step].time}ms elapsed</span>
          </div>
          <div className="w-full h-2 bg-paper rounded-full overflow-hidden border border-ink/10">
            <div
              className="h-full bg-rust transition-all duration-300"
              style={{ width: `${(step / (journey.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: When things go wrong (learn-3)
// ============================================================================
const Scene4 = ({ onComplete }) => {
  const [activeFailure, setActiveFailure] = useState(null);
  const [viewedFailures, setViewedFailures] = useState(new Set());
  const [showQuestion, setShowQuestion] = useState(false);
  const [answerState, setAnswerState] = useState(null); // { id: 'web'|'cdn'|'lb'|'db', result: 'wrong'|'correct' }

  const failures = [
    {
      id: 'db_down',
      title: 'Database goes down',
      desc: 'The database crashes and cannot answer queries.',
      recovery: 'The Cache still serves recent data. Users see slightly stale but functional content. (Without a cache, this is a complete outage!)',
      highlights: { db: 'error', cache: 'warning' }
    },
    {
      id: 'web_crash',
      title: 'Web server crashes',
      desc: 'One of the web servers runs out of memory and dies.',
      recovery: 'The Load Balancer detects the failure and instantly routes all new traffic to the remaining healthy servers. Users do not notice.',
      highlights: { web: 'error', lb: 'success' }
    },
    {
      id: 'cdn_down',
      title: 'CDN provider outage',
      desc: 'A global CDN network goes offline.',
      recovery: 'Requests fall back to the main origin servers. Images load slower, but the site still fundamentally works.',
      highlights: { cdn: 'error', web: 'warning' }
    },
    {
      id: 'spike',
      title: 'Traffic spike (10x)',
      desc: 'Your app goes viral and traffic increases 10x instantly.',
      recovery: 'Auto-scaling adds more Web Servers automatically. The Load Balancer distributes the huge load across the new larger fleet.',
      highlights: { web: 'success', lb: 'success' }
    }
  ];

  const handleFailClick = (id) => {
    sounds.pop();
    setActiveFailure(id);
    setViewedFailures(prev => new Set(prev).add(id));
  };

  // Show question after all failures viewed (Bug #2: moved timeout into useEffect)
  useEffect(() => {
    if (viewedFailures.size === failures.length && !showQuestion) {
      const t = setTimeout(() => setShowQuestion(true), 2000);
      return () => clearTimeout(t);
    }
  }, [viewedFailures.size, failures.length, showQuestion]);

  // Cleanup for onComplete timeout (Bug #3 answer handling + Bug #7 cleanup)
  useEffect(() => {
    if (answerState?.result === 'correct') {
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
    if (answerState?.result === 'wrong') {
      const timer = setTimeout(() => setAnswerState(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [answerState, onComplete]);

  const handleAnswer = (optId, isCorrect) => {
    if (isCorrect) {
      sounds.correct();
      setAnswerState({ id: optId, result: 'correct' });
    } else {
      sounds.wrong();
      setAnswerState({ id: optId, result: 'wrong' });
    }
  };

  const components = [
    { id: 'cdn', icon: '🌐', label: 'CDN' },
    { id: 'lb', icon: '⚖️', label: 'Load Balancer' },
    { id: 'web', icon: '🖥️', label: 'Web Servers' },
    { id: 'cache', icon: '⚡', label: 'Cache' },
    { id: 'db', icon: '🗄️', label: 'Database' },
  ];

  const activeData = failures.find(f => f.id === activeFailure);

  const quizOptions = [
    { id: 'web', text: 'The Web Servers', correct: false },
    { id: 'db', text: 'The Database', correct: true },
    { id: 'lb', text: 'The Load Balancer', correct: false },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Good architecture handles failures gracefully. Every component can fail — the question is what happens next.
        <br/><span className="text-sm text-pencil mt-2 block">Click each scenario to see how the system reacts.</span>
      </p>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">

        {/* Scenarios List */}
        <div className="flex flex-col gap-3">
          {failures.map(f => (
            <button
              key={f.id}
              onClick={() => handleFailClick(f.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                activeFailure === f.id
                  ? 'border-rust bg-rust/5 shadow-md scale-[1.02]'
                  : viewedFailures.has(f.id)
                    ? 'border-ink/20 bg-[#fdfcfa] hover:border-rust/40'
                    : 'border-ink/10 bg-[#fdfcfa] shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-ink">{f.title}</span>
                {viewedFailures.has(f.id) && <CheckIcon className="w-4 h-4 text-success" />}
              </div>
              <p className="text-xs text-ink/70 leading-relaxed">{f.desc}</p>
            </button>
          ))}
        </div>

        {/* Architecture Visual */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-paper border-[1.5px] border-ink/12 rounded-2xl p-8 flex items-center justify-between min-h-[250px] relative">
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-ink/10 -z-0"></div>

            {components.map(comp => {
              const status = activeData?.highlights[comp.id];
              let styleClass = "bg-[#fdfcfa] border-ink/20 text-ink"; // Normal
              let pulse = false;

              if (status === 'error') {
                styleClass = "bg-error/10 border-error text-error scale-110";
                pulse = true;
              } else if (status === 'warning') {
                styleClass = "bg-amber-100 border-amber-500 text-amber-700 scale-105";
              } else if (status === 'success') {
                styleClass = "bg-success/10 border-success text-success scale-105";
                pulse = true;
              }

              return (
                <div key={comp.id} className="flex flex-col items-center gap-2 z-10 relative">
                  <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl transition-all duration-500 shadow-sm ${styleClass} ${pulse ? 'animate-pulse' : ''}`}>
                    {status === 'error' ? '❌' : comp.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase ${status ? 'text-ink' : 'text-pencil'}`}>{comp.label}</span>

                  {status === 'error' && <div className="absolute -top-3 -right-3 text-2xl animate-bounce">🔥</div>}
                  {status === 'success' && comp.id === 'web' && activeFailure === 'spike' && (
                    <div className="absolute -bottom-8 flex gap-1 animate-fade-in">
                      <div className="w-6 h-6 bg-success/20 rounded border border-success flex items-center justify-center text-xs">🖥️</div>
                      <div className="w-6 h-6 bg-success/20 rounded border border-success flex items-center justify-center text-xs">🖥️</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Panel */}
          <div className="min-h-[120px] bg-[#fdfcfa] border border-ink/10 rounded-xl p-6 shadow-sm flex items-center">
            {activeData ? (
              <div className="animate-fade-in">
                <span className="font-bold text-rust uppercase text-sm tracking-wider block mb-2">System Reaction</span>
                <p className="text-ink text-lg">{activeData.recovery}</p>
              </div>
            ) : (
              <div className="text-pencil italic text-center w-full">Select a scenario to view system reaction.</div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuestion && (
        <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#fdfcfa] rounded-2xl max-w-xl w-full p-8 shadow-2xl relative">
            {/* Close button (Bug #5) */}
            <button
              onClick={() => setShowQuestion(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-ink/50 hover:text-ink hover:bg-ink/5 transition-colors text-xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-ink mb-6">Final Question</h2>
            <p className="text-lg text-ink/80 mb-8">Based on these scenarios, what is the most critical single point of failure in this standard architecture?</p>

            <div className="flex flex-col gap-3">
              {quizOptions.map(opt => {
                const isThisWrong = answerState?.id === opt.id && answerState?.result === 'wrong';
                const isThisCorrect = answerState?.id === opt.id && answerState?.result === 'correct';

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id, opt.correct)}
                    className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                      isThisCorrect
                        ? 'bg-success/10 border-success text-success scale-105'
                        : isThisWrong
                          ? 'bg-error/10 border-error text-error animate-[shake_0.3s_ease-in-out]'
                          : 'border-ink/10 hover:border-rust hover:bg-rust/5 text-ink'
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {answerState?.result === 'correct' && (
              <div className="mt-6 p-4 bg-success/10 rounded-xl text-success-dark font-medium animate-fade-in flex items-center gap-3">
                <CheckIcon className="w-6 h-6 shrink-0" />
                Correct! If the database is down AND the cache doesn't have the data, the entire app is broken. Databases are the hardest component to scale and protect.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Design an architecture (apply-0)
// ============================================================================
const Scene5 = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [architecture, setArchitecture] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const requirements = [
    {
      id: 0,
      text: "Users browse restaurants and heavy food images.",
      need: ['cdn', 'db'],
      hint: "Need something to serve images fast, and a place to store restaurant data."
    },
    {
      id: 1,
      text: "Lunch rush! Traffic spikes to 10,000 orders/hour.",
      need: ['lb', 'web_cluster'],
      hint: "A single server will crash. Need a way to distribute traffic across many servers."
    },
    {
      id: 2,
      text: "Users constantly refresh 'Track Order' page.",
      need: ['cache'],
      hint: "Querying the database for every refresh will kill it. Need fast, short-term memory."
    }
  ];

  const toolbox = [
    { id: 'cdn', name: 'CDN', icon: '🌐' },
    { id: 'lb', name: 'Load Balancer', icon: '⚖️' },
    { id: 'web_cluster', name: 'Auto-scaling Servers', icon: '🖥️ x3' },
    { id: 'cache', name: 'Cache (Redis)', icon: '⚡' },
    { id: 'db', name: 'Database (SQL)', icon: '🗄️' },
  ];

  const handleSelect = (compId) => {
    if (simulating || step >= requirements.length) return;

    const currentReq = requirements[step];

    // Check if component is valid for current step
    if (currentReq.need.includes(compId)) {
      if (!architecture.includes(compId)) {
        sounds.snap();
        const newArch = [...architecture, compId];
        setArchitecture(newArch);
        setErrorMsg(null);

        // Check if all needs for current step are met
        const stepNeedsMet = currentReq.need.every(n => newArch.includes(n));
        if (stepNeedsMet) {
          if (step < requirements.length - 1) {
            setTimeout(() => setStep(prev => prev + 1), 1000);
          } else {
            setTimeout(() => runSimulation(), 1000);
          }
        }
      }
    } else {
      sounds.wrong();
      setErrorMsg("Not quite. Read the requirement again.");
      setTimeout(() => setErrorMsg(null), 2000);
    }
  };

  const runSimulation = () => {
    setSimulating(true);
  };

  // Cleanup for simulation onComplete timeout (Bug #7)
  useEffect(() => {
    if (simulating) {
      sounds.correct();
      const timer = setTimeout(() => onComplete(), 4000);
      return () => clearTimeout(timer);
    }
  }, [simulating, onComplete]);

  // Bug #4: Memoize random values for traffic dots
  const dotStyles = useMemo(() => [...Array(20)].map(() => ({
    delay: `${Math.random() * 2}s`,
    offset: `${(Math.random() - 0.5) * 40}px`
  })), []);

  // Helper to render architecture cleanly
  const renderCanvas = () => {
    const orderedFlow = ['cdn', 'lb', 'web_cluster', 'cache', 'db'];

    return (
      <div className="w-full h-48 bg-paper border-[1.5px] border-ink/12 rounded-2xl p-6 relative flex items-center justify-around shadow-inner overflow-hidden">
        {/* Animated traffic dots during simulation */}
        {simulating && (
           <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
             {dotStyles.map((style, i) => (
               <div
                 key={i}
                 className="absolute top-1/2 w-2 h-2 bg-rust rounded-full"
                 style={{
                   left: '0',
                   animation: `flow 2s linear infinite`,
                   animationDelay: style.delay,
                   transform: `translateY(${style.offset})`
                 }}
               />
             ))}
           </div>
        )}

        {orderedFlow.map((slot) => {
          const isPlaced = architecture.includes(slot);
          const comp = toolbox.find(c => c.id === slot);

          if (!isPlaced) return <div key={slot} className="w-16 h-16 opacity-0"></div>;

          return (
            <div key={slot} className="flex flex-col items-center z-10 animate-fade-in relative group">
              <div className={`w-16 h-16 bg-[#fdfcfa] border-2 border-rust rounded-xl flex items-center justify-center text-2xl shadow-md ${simulating ? 'animate-pulse bg-rust/5' : ''}`}>
                {comp.icon}
              </div>
              <span className="text-xs font-bold uppercase mt-2">{comp.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-bold text-ink mb-2">Build a Food Delivery App</h2>
        <p className="text-ink/80">Add the correct components to support the growing requirements.</p>
      </div>

      {step < requirements.length && !simulating && (
        <div className="w-full max-w-2xl bg-[#fdfcfa] border border-ink/20 p-6 rounded-xl shadow-lg border-l-4 border-l-rust relative">
          <span className="text-xs font-bold text-rust uppercase tracking-wider mb-1 block">Phase {step + 1} of 3</span>
          <p className="text-xl text-ink font-medium">{requirements[step].text}</p>

          {errorMsg ? (
            <div className="mt-3 text-error text-sm font-bold animate-fade-in">{errorMsg}</div>
          ) : (
            <div className="mt-3 text-pencil text-sm italic">Hint: {requirements[step].hint}</div>
          )}
        </div>
      )}

      {simulating && (
        <div className="w-full max-w-2xl bg-success/10 border border-success p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-bold text-success-dark mb-2">Lunch Rush Simulation Active!</h3>
          <p className="text-success-dark/80">Architecture is handling 10,000 orders/hour smoothly.</p>
        </div>
      )}

      {renderCanvas()}

      <div className="w-full max-w-3xl">
        <h3 className="text-sm font-bold text-pencil uppercase tracking-wider mb-3">Component Toolbox</h3>
        <div className="flex flex-wrap gap-3">
          {toolbox.map(comp => (
            <button
              key={comp.id}
              onClick={() => handleSelect(comp.id)}
              disabled={architecture.includes(comp.id) || simulating}
              className={`px-5 py-3 rounded-xl border-[1.5px] font-bold text-sm transition-all flex items-center gap-2 ${
                architecture.includes(comp.id)
                  ? 'bg-ink/5 border-ink/10 text-ink/30 opacity-50 cursor-not-allowed'
                  : 'bg-[#fdfcfa] border-ink/20 text-ink hover:border-rust hover:shadow-md hover:-translate-y-1'
              }`}
            >
              <span className="text-lg">{comp.icon}</span> {comp.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Find the bottleneck (challenge-0)
// ============================================================================
const Scene6 = ({ onComplete }) => {
  const [fixed, setFixed] = useState(false);
  const [selectedFix, setSelectedFix] = useState(null);

  const options = [
    { id: 'web', text: 'Add more Web Servers', correct: false, explain: 'Wrong. The CPU load is on the database, not the web servers.' },
    { id: 'cdn', text: 'Upgrade the CDN', correct: false, explain: 'Wrong. CDN handles static files, but the bottleneck is dynamic database queries.' },
    { id: 'cache', text: 'Add a Cache layer (Redis)', correct: true, explain: 'Correct! Caching frequent queries reduces database load by up to 80%.' },
  ];

  const handleFix = (opt) => {
    if (opt.correct) {
      sounds.correct();
    } else {
      sounds.wrong();
    }
    setSelectedFix(opt);
    if (opt.correct) {
      setTimeout(() => setFixed(true), 1500);
    }
  };

  // Cleanup for onComplete timeout (Bug #7)
  useEffect(() => {
    if (fixed) {
      const timer = setTimeout(() => onComplete(), 3500);
      return () => clearTimeout(timer);
    }
  }, [fixed, onComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-ink">Final Challenge: Fix the Bottleneck</h2>
      </div>

      {/* Dashboard Visual */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Architecture Map */}
        <div className="bg-paper border-[1.5px] border-ink/12 rounded-xl p-6 relative">
          <h3 className="font-bold text-ink mb-4 text-sm uppercase tracking-wider">Current Architecture</h3>
          <div className="flex justify-between items-center h-24 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-ink/10 -z-0"></div>

            <div className="bg-[#fdfcfa] border-2 border-ink/20 w-12 h-12 rounded-lg flex items-center justify-center text-xl z-10 shadow-sm">🌐</div>
            <div className="bg-[#fdfcfa] border-2 border-ink/20 w-12 h-12 rounded-lg flex items-center justify-center text-xl z-10 shadow-sm">⚖️</div>
            <div className="bg-[#fdfcfa] border-2 border-ink/20 w-12 h-12 rounded-lg flex items-center justify-center text-xl z-10 shadow-sm">🖥️</div>

            {/* The problem area */}
            <div className="relative z-10">
              <div className={`bg-[#fdfcfa] border-2 w-14 h-14 rounded-lg flex flex-col items-center justify-center text-2xl transition-colors duration-1000 ${fixed ? 'border-success' : 'border-error bg-error/5 animate-pulse'}`}>
                🗄️
              </div>
              {!fixed && <div className="absolute -top-3 -right-3 w-6 h-6 bg-error rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce">!</div>}
            </div>
          </div>

          {/* Solution overlay */}
          {fixed && (
            <div className="absolute bottom-4 right-16 flex items-center gap-2 animate-fade-in">
              <div className="text-success font-bold text-sm">+ Cache Layer</div>
              <div className="bg-success/10 border-2 border-success w-10 h-10 rounded-lg flex items-center justify-center text-lg text-success">⚡</div>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="bg-[#1e1e1e] rounded-xl p-6 text-gray-300 font-mono shadow-xl flex flex-col justify-center">
          <div className="mb-4">
            <div className="text-xs text-pencil uppercase tracking-widest mb-1">Database CPU Load</div>
            <div className="flex items-center gap-3">
              <div className="w-full bg-[#333] h-4 rounded overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${fixed ? 'w-[15%] bg-green-500' : 'w-[99%] bg-red-500'}`}></div>
              </div>
              <span className={`font-bold ${fixed ? 'text-green-500' : 'text-red-500'}`}>{fixed ? '15%' : '99%'}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-pencil uppercase tracking-widest mb-1">Avg Response Time</div>
            <div className={`text-3xl font-bold transition-colors duration-1000 ${fixed ? 'text-green-400' : 'text-red-400'}`}>
              {fixed ? '85ms' : '5,240ms'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full mt-4">
        {!selectedFix ? (
          <div className="flex flex-col gap-4">
            <p className="text-ink font-medium">The database is melting down under load. What's the best way to fix this architecture?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleFix(opt)}
                  className="p-4 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-xl font-bold text-ink hover:border-rust hover:shadow-md transition-all text-sm"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-xl border-2 flex items-start gap-4 animate-fade-in ${selectedFix.correct ? 'bg-success/10 border-success' : 'bg-error/10 border-error'}`}>
            <div className={`text-2xl ${selectedFix.correct ? 'text-success' : 'text-error'}`}>
              {selectedFix.correct ? '✅' : '❌'}
            </div>
            <div>
              <h4 className={`font-bold text-lg mb-1 ${selectedFix.correct ? 'text-success-dark' : 'text-error'}`}>
                {selectedFix.text}
              </h4>
              <p className="text-ink/80">{selectedFix.explain}</p>

              {!selectedFix.correct && (
                <button
                  onClick={() => setSelectedFix(null)}
                  className="mt-4 px-4 py-2 bg-[#fdfcfa] border border-ink/20 rounded-lg text-sm font-bold hover:bg-ink/5"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ArchitectureComponentsLesson({ currentPhase, currentStep, onComplete }) {
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

  return scenes[sceneKey] || <div className="text-pencil text-center py-12">Scene not found.</div>;
}
