import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

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
          Python 101 • Logic
        </div>
        <button
          onClick={onNext}
          disabled={!nextEnabled}
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            nextEnabled
              ? 'bg-stone-900 text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95 shadow-md'
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
// SCENE 1: The fork in the road
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const [age, setAge] = useState(16);
  const isGranted = age >= 18;
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted && isGranted) {
      const timer = setTimeout(() => onComplete(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, isGranted, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-8 animate-fade-in relative z-10 p-4">
      <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg text-lg mb-4">
        Every time you see 'if your password is correct, log in — otherwise, show an error,' that's a conditional.
      </p>

      {/* Visual Fork */}
      <div className="relative w-full max-w-md h-64 bg-stone-50/50 dark:bg-stone-900/40 border border-stone-200 dark:border-white/10 rounded-2xl p-8 flex flex-col justify-between items-center">
        
        {/* Endpoints */}
        <div className="flex w-full justify-between px-4 z-10 transition-all">
          <div className={`px-4 py-2 font-mono text-xs rounded-lg transition-all shadow-sm ${isGranted ? 'bg-green-100 text-green-800 border border-green-300 scale-110 shadow-green-500/20' : 'bg-stone-100 text-stone-400 border border-stone-200 bg-opacity-50'}`}>
            Access granted
          </div>
          <div className={`px-4 py-2 font-mono text-xs rounded-lg transition-all shadow-sm ${!isGranted ? 'bg-red-100 text-red-800 border border-red-300 scale-110 shadow-red-500/20' : 'bg-stone-100 text-stone-400 border border-stone-200 bg-opacity-50'}`}>
            Access denied
          </div>
        </div>

        {/* Condition Node in Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-amber-100 border-2 border-amber-300 text-amber-800 font-mono px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap text-sm font-bold flex items-center gap-2">
            if age &gt;= 18:
          </div>
        </div>

        {/* Path SVG */}
        <svg className="absolute inset-0 w-full h-full z-0" pointerEvents="none">
          {/* Main trunk */}
          <path d="M 224 220 L 224 160" stroke="currentColor" strokeWidth="4" className="text-stone-300 dark:text-stone-700 stroke-dasharray-[6,6]" fill="none" />
          {/* Left fork */}
          <path d="M 224 128 Q 224 64 64 64" stroke="currentColor" strokeWidth="4" className={`transition-all duration-300 ${isGranted ? 'text-green-400' : 'text-stone-200 dark:text-stone-800'}`} fill="none" />
          {/* Right fork */}
          <path d="M 224 128 Q 224 64 384 64" stroke="currentColor" strokeWidth="4" className={`transition-all duration-300 ${!isGranted ? 'text-red-400' : 'text-stone-200 dark:text-stone-800'}`} fill="none" />
        </svg>

        {/* Moving Dot */}
        <div 
          className="absolute w-6 h-6 rounded-full bg-stone-800 dark:bg-stone-200 shadow-xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 flex items-center justify-center border-2 border-white dark:border-black"
          style={{
            transform: `translate(${isGranted ? '-160px' : '160px'}, -130px)`
          }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
        </div>

        {/* Start Point */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">Age: {age}</div>
        </div>
      </div>

      {/* Slider Input */}
      <input 
        type="range" 
        min="1" 
        max="30" 
        value={age} 
        onChange={(e) => {
          setAge(parseInt(e.target.value));
          setHasInteracted(true);
        }}
        className="w-full max-w-sm accent-amber-500 hover:accent-amber-400 cursor-pointer h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none transition-all"
      />

      {/* Code Display */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 font-mono text-sm leading-8 text-stone-300 shadow-2xl relative w-full max-w-md">
        <div className="relative">
          <span className="text-amber-400">if</span> <span className="text-blue-300">age</span> {'>='} 18:
        </div>
        <div className={`relative px-4 transition-all duration-300 ${isGranted ? 'bg-green-500/20 border-l-2 border-green-500 text-green-100' : 'opacity-50 text-stone-500'}`}>
          {'    '}<span className="text-blue-300">print</span>(<span className="text-green-300">"Access granted"</span>)
        </div>
        <div className="relative">
          <span className="text-amber-400">else</span>:
        </div>
        <div className={`relative px-4 transition-all duration-300 ${!isGranted ? 'bg-red-500/20 border-l-2 border-red-500 text-red-100' : 'opacity-50 text-stone-500'}`}>
          {'    '}<span className="text-blue-300">print</span>(<span className="text-red-300">"Access denied"</span>)
        </div>
      </div>

    </div>
  );
};

// ============================================================================
// SCENE 2: True or False?
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const expressions = [
    { id: 1, expr: '5 > 3', answer: true, confirm: "Correct" },
    { id: 2, expr: '10 == 11', answer: false, confirm: "Nice" },
    { id: 3, expr: '"hello" == "hello"', answer: true, confirm: "Spot on" },
    { id: 4, expr: '7 < 2', answer: false, confirm: "Exactly" },
    { id: 5, expr: 'True and False', answer: false, confirm: "Got it" },
    { id: 6, expr: 'True or False', answer: true, confirm: "Perfect" },
    { id: 7, expr: 'not True', answer: false, confirm: "Right" },
    { id: 8, expr: '3 != 3', answer: false, confirm: "Excellent" },
  ];

  const [cardStates, setCardStates] = useState(
    expressions.reduce((acc, curr) => ({ ...acc, [curr.id]: { status: 'idle' } }), {})
  );

  const correctCount = Object.values(cardStates).filter(c => c.status === 'correct').length;

  useEffect(() => {
    if (correctCount === expressions.length) {
      setTimeout(() => onComplete(true), 1500);
    }
  }, [correctCount, expressions.length, onComplete]);

  const handleAnswer = (id, answer) => {
    const card = expressions.find(e => e.id === id);
    if (!card || cardStates[id].status === 'correct') return;

    if (card.answer === answer) {
      setCardStates(prev => ({ ...prev, [id]: { status: 'correct' } }));
    } else {
      setCardStates(prev => ({ ...prev, [id]: { status: 'wrong' } }));
      setTimeout(() => {
        setCardStates(prev => {
          if (prev[id].status === 'wrong') {
            return { ...prev, [id]: { status: 'idle' } };
          }
          return prev;
        });
      }, 600);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="flex justify-between items-center w-full max-w-2xl px-4">
        <p className="text-stone-500 dark:text-stone-400 text-lg">
          Conditions boil down to one thing: is this True or False?
        </p>
        <div className="font-mono text-sm font-bold bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-full text-stone-700 dark:text-stone-300 shadow-inner">
          {correctCount} / {expressions.length} correct
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {expressions.map((item) => {
          const state = cardStates[item.id].status;
          return (
            <div 
              key={item.id} 
              className={`relative flex flex-col items-center justify-center p-6 h-40 rounded-2xl border-2 transition-all duration-300 perspective-[1000px] ${
                state === 'correct' 
                  ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20 text-green-800 dark:text-green-300 shadow-lg shadow-green-500/10' 
                  : state === 'wrong'
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20 animate-[shake_0.4s_ease-in-out]'
                  : 'border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div className={`transition-all duration-500 flex flex-col items-center w-full ${state === 'correct' ? 'scale-110' : ''}`}>
                <div className="font-mono text-lg mb-4 text-center">{item.expr}</div>
                
                {state === 'correct' ? (
                  <div className="flex items-center gap-2 font-bold animate-fade-in">
                    <CheckIcon className="w-5 h-5" /> {item.confirm}
                  </div>
                ) : (
                  <div className="flex gap-2 w-full mt-2">
                    <button 
                      onClick={() => handleAnswer(item.id, true)}
                      className="flex-1 py-2 font-mono text-sm bg-stone-100 dark:bg-stone-800 hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900/40 rounded border border-stone-200 dark:border-stone-700 transition-colors"
                    >
                      True
                    </button>
                    <button 
                      onClick={() => handleAnswer(item.id, false)}
                      className="flex-1 py-2 font-mono text-sm bg-stone-100 dark:bg-stone-800 hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900/40 rounded border border-stone-200 dark:border-stone-700 transition-colors"
                    >
                      False
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3: Building blocks of logic
// ============================================================================

const Scene3 = ({ onComplete }) => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [operator, setOperator] = useState('and'); // 'and', 'or', 'not A'

  const [discovered, setDiscovered] = useState({
    and: new Set(),
    or: new Set(),
    notA: new Set()
  });

  const evaluate = (op, valA, valB) => {
    if (op === 'and') return valA && valB;
    if (op === 'or') return valA || valB;
    if (op === 'not A') return !valA;
    return false;
  };

  const output = evaluate(operator, a, b);

  useEffect(() => {
    setDiscovered(prev => {
      const next = { ...prev };
      if (operator === 'and') next.and.add(`${a}-${b}`);
      if (operator === 'or') next.or.add(`${a}-${b}`);
      if (operator === 'not A') next.notA.add(`${a}`);
      return next;
    });
  }, [a, b, operator]);

  const progress = discovered.and.size + discovered.or.size + discovered.notA.size;
  const totalStates = 4 + 4 + 2; // 10 states

  useEffect(() => {
    if (progress === totalStates) {
      setTimeout(() => onComplete(true), 1500);
    }
  }, [progress, totalStates, onComplete]);

  return (
    <div className="w-full max-w-4xl flex flex-col gap-12 items-center">
      <div className="flex flex-col items-center">
        <p className="text-stone-500 dark:text-stone-400 text-lg mb-2">
          You can combine conditions using <strong className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">and</strong>, <strong className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">or</strong>, and <strong className="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">not</strong>.
        </p>
        <p className="text-sm text-amber-600 dark:text-amber-500 font-mono tracking-widest uppercase mb-6">
          Discover all {totalStates} combinations: {progress}/{totalStates}
        </p>

        {/* Visual Logic Circuit */}
        <div className="w-full flex items-center justify-center gap-4 relative">
          
          {/* Inputs */}
          <div className="flex flex-col gap-8 z-10">
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-stone-400 w-4 text-right">A</span>
              <button 
                onClick={() => setA(!a)}
                className={`w-16 h-8 rounded-full transition-all duration-300 relative shadow-inner ${a ? 'bg-green-500' : 'bg-stone-300 dark:bg-stone-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${a ? 'left-9' : 'left-1'}`}></div>
              </button>
              <span className={`font-mono text-sm w-10 ${a ? 'text-green-600 dark:text-green-400' : 'text-stone-400'}`}>{a ? 'True' : 'False'}</span>
            </div>

            <div className={`flex items-center gap-4 transition-all duration-300 ${operator === 'not A' ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
              <span className="font-mono font-bold text-stone-400 w-4 text-right">B</span>
              <button 
                onClick={() => setB(!b)}
                className={`w-16 h-8 rounded-full transition-all duration-300 relative shadow-inner ${b ? 'bg-green-500' : 'bg-stone-300 dark:bg-stone-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${b ? 'left-9' : 'left-1'}`}></div>
              </button>
              <span className={`font-mono text-sm w-10 ${b ? 'text-green-600 dark:text-green-400' : 'text-stone-400'}`}>{b ? 'True' : 'False'}</span>
            </div>
          </div>

          {/* Lines to operator */}
          <div className="h-24 w-16 relative">
            <div className={`absolute top-[10%] left-0 w-full h-[2px] transition-colors ${a ? 'bg-green-400' : 'bg-stone-300 dark:bg-stone-700'}`}></div>
            <div className={`absolute bottom-[10%] left-0 w-full h-[2px] transition-all duration-300 ${operator === 'not A' ? 'opacity-0' : b ? 'bg-green-400' : 'bg-stone-300 dark:bg-stone-700'}`}></div>
          </div>

          {/* Operator Node */}
          <div className="z-10 bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 p-2 rounded-xl flex flex-col gap-2 relative shadow-lg">
            {['and', 'or', 'not A'].map(op => (
              <button
                key={op}
                onClick={() => setOperator(op)}
                className={`px-4 py-2 font-mono text-sm rounded transition-all ${operator === op ? 'bg-amber-400 text-amber-900 font-bold shadow-sm' : 'hover:bg-amber-200 dark:hover:bg-amber-800/50 text-amber-800 dark:text-amber-300'}`}
              >
                {op}
              </button>
            ))}
          </div>

          {/* Line to Output */}
          <div className="h-24 w-16 relative flex items-center">
            <div className={`w-full h-[2px] transition-colors ${output ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-stone-300 dark:bg-stone-700'}`}></div>
          </div>

          {/* Output Node */}
          <div className={`z-10 w-24 h-24 rounded-2xl flex items-center justify-center font-mono font-bold text-lg transition-all duration-500 ${
            output 
              ? 'bg-green-100 border-2 border-green-400 text-green-700 shadow-[0_0_30px_rgba(74,222,128,0.5)] scale-110' 
              : 'bg-stone-100 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-400'
          }`}>
            {output ? 'True' : 'False'}
          </div>

        </div>
      </div>

      {/* Truth Table */}
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-4 bg-stone-100 dark:bg-stone-800 font-mono text-xs text-stone-500 font-bold uppercase tracking-wider py-2">
          <div className="text-center">A</div>
          <div className="text-center">B</div>
          <div className="text-center">Op</div>
          <div className="text-center">Out</div>
        </div>
        <div className="flex flex-col max-h-48 overflow-y-auto">
          {/* Combine all discovered sets into ordered list for table */}
          {[
            ...Array.from(discovered.and).map(v => ({ a: v.split('-')[0]==='true', b: v.split('-')[1]==='true', op: 'and', out: evaluate('and', v.split('-')[0]==='true', v.split('-')[1]==='true') })),
            ...Array.from(discovered.or).map(v => ({ a: v.split('-')[0]==='true', b: v.split('-')[1]==='true', op: 'or', out: evaluate('or', v.split('-')[0]==='true', v.split('-')[1]==='true') })),
            ...Array.from(discovered.notA).map(v => ({ a: v==='true', b: null, op: 'not', out: evaluate('not A', v==='true', false) }))
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-4 items-center py-2 border-t border-stone-100 dark:border-white/5 font-mono text-sm animate-fade-in bg-stone-50/50 dark:bg-transparent">
              <div className={`text-center ${row.a ? 'text-green-600 dark:text-green-400' : 'text-stone-400'}`}>{row.a ? 'T' : 'F'}</div>
              <div className={`text-center ${row.b === null ? 'text-stone-300' : row.b ? 'text-green-600 dark:text-green-400' : 'text-stone-400'}`}>{row.b === null ? '-' : row.b ? 'T' : 'F'}</div>
              <div className="text-center text-amber-600 dark:text-amber-500 text-xs">{row.op}</div>
              <div className={`text-center font-bold ${row.out ? 'text-green-600 dark:text-green-400' : 'text-stone-500 dark:text-stone-600'}`}>{row.out ? 'T' : 'F'}</div>
            </div>
          ))}
          {progress === 0 && (
            <div className="text-center py-8 text-stone-400 text-sm italic">Toggle inputs to discover combinations</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: Nested decisions
// ============================================================================

const Scene4 = ({ onComplete }) => {
  const [isStudent, setIsStudent] = useState(true);
  const [age, setAge] = useState(20);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isUnder26 = age < 26;
  const price = isStudent ? (isUnder26 ? 0 : 10) : 20;

  useEffect(() => {
    if (hasInteracted) {
      // Complete after they've seen at least a change
      const timer = setTimeout(() => onComplete(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg text-lg">
        Sometimes one decision leads to another. That's nesting — an if inside an if.
      </p>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Visual Tree */}
        <div className="flex flex-col items-center gap-6 relative w-full h-[400px] bg-stone-50/50 dark:bg-stone-900/40 p-6 rounded-2xl border border-stone-200 dark:border-white/10">
          
          {/* Controls */}
          <div className="absolute top-6 right-6 flex flex-col gap-4 bg-white dark:bg-stone-800 p-4 rounded-xl shadow-lg border border-stone-100 dark:border-stone-700 z-20">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-stone-600 dark:text-stone-300">Student?</span>
              <button 
                onClick={() => { setIsStudent(!isStudent); setHasInteracted(true); }}
                className={`w-12 h-6 rounded-full transition-all relative ${isStudent ? 'bg-green-500' : 'bg-stone-300 dark:bg-stone-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isStudent ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-stone-600 dark:text-stone-300">Age: {age}</span>
              <input 
                type="range" min="15" max="40" value={age} 
                onChange={e => { setAge(parseInt(e.target.value)); setHasInteracted(true); }}
                className="w-24 accent-amber-500"
              />
            </div>
          </div>

          <div className="text-sm font-bold text-stone-400 uppercase tracking-widest absolute top-6 left-6">Ticket Price</div>

          {/* SVG Tree Paths */}
          <svg className="absolute inset-0 w-full h-full z-0" pointerEvents="none">
            {/* Root to is_student */}
            <path d="M 200 40 L 200 80" stroke="currentColor" strokeWidth="3" className="text-amber-500" fill="none" />
            
            {/* is_student YES -> age check */}
            <path d="M 200 120 L 120 160 L 120 200" stroke="currentColor" strokeWidth="3" className={`transition-all duration-300 ${isStudent ? 'text-amber-500' : 'text-stone-200 dark:text-stone-700 stroke-dasharray-[4,4]'}`} fill="none" />
            
            {/* is_student NO -> 20 PLN */}
            <path d="M 200 120 L 280 160 L 280 280" stroke="currentColor" strokeWidth="3" className={`transition-all duration-300 ${!isStudent ? 'text-amber-500' : 'text-stone-200 dark:text-stone-700 stroke-dasharray-[4,4]'}`} fill="none" />
            
            {/* age < 26 YES -> 0 PLN */}
            <path d="M 120 240 L 60 280 L 60 320" stroke="currentColor" strokeWidth="3" className={`transition-all duration-300 ${isStudent && isUnder26 ? 'text-amber-500' : 'text-stone-200 dark:text-stone-700 stroke-dasharray-[4,4]'}`} fill="none" />
            
            {/* age < 26 NO -> 10 PLN */}
            <path d="M 120 240 L 180 280 L 180 320" stroke="currentColor" strokeWidth="3" className={`transition-all duration-300 ${isStudent && !isUnder26 ? 'text-amber-500' : 'text-stone-200 dark:text-stone-700 stroke-dasharray-[4,4]'}`} fill="none" />
          </svg>

          {/* Nodes */}
          <div className="absolute top-[80px] left-[50%] transform -translate-x-[50%] z-10 bg-white dark:bg-stone-800 border-2 border-amber-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-300 scale-105">
            is_student?
          </div>

          <div className={`absolute top-[200px] left-[120px] transform -translate-x-[50%] z-10 bg-white dark:bg-stone-800 border-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all duration-300 ${isStudent ? 'border-amber-300 scale-105' : 'border-stone-200 dark:border-stone-700 text-stone-400 opacity-60'}`}>
            age &lt; 26?
          </div>

          <div className={`absolute top-[320px] left-[60px] transform -translate-x-[50%] z-10 font-bold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg ${isStudent && isUnder26 ? 'bg-green-500 text-white scale-110' : 'bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-400 opacity-60'}`}>
            0 PLN
          </div>

          <div className={`absolute top-[320px] left-[180px] transform -translate-x-[50%] z-10 font-bold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg ${isStudent && !isUnder26 ? 'bg-green-500 text-white scale-110' : 'bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-400 opacity-60'}`}>
            10 PLN
          </div>

          <div className={`absolute top-[280px] left-[280px] transform -translate-x-[50%] z-10 font-bold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg ${!isStudent ? 'bg-green-500 text-white scale-110' : 'bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-400 opacity-60'}`}>
            20 PLN
          </div>

        </div>

        {/* Code Setup */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 font-mono text-sm leading-8 text-stone-300 shadow-2xl relative w-full h-[400px]">
          <div className={`relative px-4 py-1 transition-all rounded ${isStudent ? 'bg-amber-500/20 shadow-[inset_2px_0_0_#f59e0b]' : 'opacity-50 text-stone-500'}`}>
            <span className="text-amber-400">if</span> <span className="text-blue-300">is_student</span>:
          </div>
          
          <div className={`relative px-4 py-1 ml-4 transition-all rounded ${isStudent && isUnder26 ? 'bg-amber-500/20 shadow-[inset_2px_0_0_#f59e0b]' : 'opacity-50 text-stone-500'}`}>
            <span className="text-amber-400">if</span> <span className="text-blue-300">age</span> &lt; 26:
          </div>
          <div className={`relative px-4 py-1 ml-8 transition-all rounded ${isStudent && isUnder26 ? 'bg-green-500/20 text-green-200 shadow-[inset_2px_0_0_#22c55e]' : 'opacity-50 text-stone-500'}`}>
            price = 0
          </div>
          
          <div className={`relative px-4 py-1 ml-4 transition-all rounded ${isStudent && !isUnder26 ? 'bg-amber-500/20 shadow-[inset_2px_0_0_#f59e0b]' : 'opacity-50 text-stone-500'}`}>
            <span className="text-amber-400">else</span>:
          </div>
          <div className={`relative px-4 py-1 ml-8 transition-all rounded ${isStudent && !isUnder26 ? 'bg-green-500/20 text-green-200 shadow-[inset_2px_0_0_#22c55e]' : 'opacity-50 text-stone-500'}`}>
            price = 10
          </div>
          
          <div className={`relative px-4 py-1 transition-all rounded mt-2 ${!isStudent ? 'bg-amber-500/20 shadow-[inset_2px_0_0_#f59e0b]' : 'opacity-50 text-stone-500'}`}>
            <span className="text-amber-400">else</span>:
          </div>
          <div className={`relative px-4 py-1 ml-4 transition-all rounded ${!isStudent ? 'bg-green-500/20 text-green-200 shadow-[inset_2px_0_0_#22c55e]' : 'opacity-50 text-stone-500'}`}>
            price = 20
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Grade calculator
// ============================================================================

const Scene5 = ({ onComplete }) => {
  const [score, setScore] = useState(85);
  const [fields, setFields] = useState({
    A: null, B: null, C: null, D: null
  });
  
  const [availableValues, setAvailableValues] = useState([
    { id: 'v1', val: 90 }, { id: 'v2', val: 80 }, { id: 'v3', val: 70 }, { id: 'v4', val: 60 }
  ]);

  const handleDrop = (grade, valId) => {
    const item = availableValues.find(v => v.id === valId);
    if (!item) return;
    
    // Auto-complete validation (only exact threshold matches allowed for a linear simple flow)
    const expected = { A: 90, B: 80, C: 70, D: 60 };
    if (item.val === expected[grade]) {
      setFields(prev => ({ ...prev, [grade]: item.val }));
      setAvailableValues(prev => prev.filter(v => v.id !== valId));
    }
  };

  const isComplete = Object.values(fields).every(v => v !== null);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 2000);
    }
  }, [isComplete, onComplete]);

  // Determine active grade branch
  let activeBranch = 'F';
  if (isComplete) {
    if (score >= fields.A) activeBranch = 'A';
    else if (score >= fields.B) activeBranch = 'B';
    else if (score >= fields.C) activeBranch = 'C';
    else if (score >= fields.D) activeBranch = 'D';
  }

  const renderActiveCode = (grade, nextGrade) => {
    const isActive = isComplete && activeBranch === grade;
    return (
      <div className={`transition-all duration-300 ${isActive ? 'bg-amber-500/20 text-stone-200' : 'text-stone-500'}`}>
        <div className="flex items-center gap-2 h-8 px-4">
          <span className="text-amber-400 w-10">{grade === 'A' ? 'if' : 'elif'}</span> 
          <span>score &gt;=</span>
          <div 
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(grade, e.dataTransfer.getData('valId'))}
            className={`flex items-center justify-center w-12 h-6 text-xs rounded transition-all ${fields[grade] ? 'bg-stone-800 text-stone-200 border border-stone-600' : 'bg-stone-800 border border-stone-600 border-dashed text-stone-500'}`}
          >
            {fields[grade] ? fields[grade] : '___'}
          </div>
          <span>:</span>
        </div>
        <div className={`px-4 ml-8 h-6 flex items-center ${isActive ? 'text-green-300 font-bold bg-green-900/40' : ''}`}>
          grade = "{grade}"
        </div>
      </div>
    );
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="flex flex-col gap-6">
        <p className="text-stone-500 dark:text-stone-400 text-sm">
          The university needs a program that converts numeric grades (0-100) to letter grades. Fill in the logical thresholds.
        </p>
        
        {/* Code Block */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl py-4 font-mono text-sm leading-8 shadow-xl">
          <div className="px-4 mb-4 pb-4 border-b border-stone-800">
            <span className="text-stone-400">score =</span> <span className="text-blue-400">{score}</span>
          </div>

          <div className="flex flex-col">
            {renderActiveCode('A')}
            {renderActiveCode('B')}
            {renderActiveCode('C')}
            {renderActiveCode('D')}
            
            <div className={`transition-all duration-300 mt-1 ${isComplete && activeBranch === 'F' ? 'bg-amber-500/20 text-stone-200' : 'text-stone-500'}`}>
              <div className="px-4 h-8 flex items-center">
                <span className="text-amber-400">else</span>:
              </div>
              <div className={`px-4 ml-8 h-6 flex items-center ${isComplete && activeBranch === 'F' ? 'text-green-300 font-bold bg-green-900/40' : ''}`}>
                grade = "F"
              </div>
            </div>
          </div>
        </div>

        {/* Draggable values */}
        <div className="flex flex-wrap gap-3">
          {availableValues.map(v => (
            <div
              key={v.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('valId', v.id)}
              className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-sm cursor-grab active:cursor-grabbing font-mono text-sm hover:-translate-y-1 transition-transform font-bold text-stone-700 dark:text-stone-300"
            >
              {v.val}
            </div>
          ))}
          {availableValues.length === 0 && (
            <div className="text-xs text-stone-400 flex items-center gap-2 animate-fade-in mx-auto">
              <CheckIcon className="w-4 h-4 text-green-500" /> Perfect mapping! Now adjust the score.
            </div>
          )}
        </div>
        
        {/* Score Slider */}
        <div className={`transition-opacity duration-500 ${isComplete ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <div className="flex justify-between text-xs font-mono text-stone-500 mb-2 uppercase font-bold tracking-widest">
            <span>Score Input</span>
            <span className="text-stone-700 dark:text-stone-300">{score}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={score} 
            onChange={e => setScore(parseInt(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* Visual Report Card */}
      <div className="flex justify-center flex-col items-center gap-4 perspective-[1000px]">
        <div className={`w-72 bg-[#fdfbf7] dark:bg-[#1a1918] border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl flex flex-col items-center relative overflow-hidden transition-all duration-700 ${isComplete ? 'rotate-y-[-5deg] scale-105' : 'opacity-80 scale-95'}`}>
          
          <div className="w-full text-center py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-[#151413]">
            <div className="uppercase tracking-widest text-[10px] font-bold text-stone-400">Official Transcript</div>
          </div>

          <div className="p-8 flex flex-col items-center gap-2">
            <div className="text-xs uppercase tracking-widest text-stone-400">Final Grade</div>
            
            <div className={`text-8xl font-serif mt-2 transition-all duration-500 ${isComplete ? (activeBranch === 'F' ? 'text-red-500' : 'text-stone-800 dark:text-stone-100') : 'text-stone-200 dark:text-stone-800 blur-sm'}`}>
              {isComplete ? activeBranch : '?'}
            </div>

            <div className={`mt-6 font-mono text-2xl transition-all duration-500 ${isComplete ? 'text-stone-400 dark:text-stone-500' : 'text-stone-200 dark:text-stone-800'}`}>
              {score}%
            </div>
          </div>

          <div className="w-full p-4 flex justify-between items-center text-[10px] uppercase tracking-wider text-stone-400 border-t border-stone-100 dark:border-stone-800">
            <span>Intro to Python</span>
            <span>Credits: 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Fix the login system
// ============================================================================

const Scene6 = ({ onComplete }) => {
  const [phase, setPhase] = useState(1); // 1: fix syntax, 2: run & realize loop needed, 3: fix loop, 4: success
  const [showOptions1, setShowOptions1] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);

  const handleFix1 = (correct) => {
    if (correct) {
      setShowOptions1(false);
      setPhase(2);
    }
  };

  const handleFix2 = (correct) => {
    if (correct) {
      setShowOptions2(false);
      setPhase(4);
      setTimeout(() => onComplete(true), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-8 items-center">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-8 font-mono text-sm leading-8 shadow-2xl relative">
        <div className="text-stone-300 flex flex-col">
          <div className="text-stone-500 mb-4 opacity-70">
            # User database<br/>
            username = "admin"<br/>
            password = "secure123"<br/>
            attempts = 3<br/>
            <br/>
            # Login attempt<br/>
            entered_user = "admin"<br/>
            entered_pass = "wrong"
          </div>

          {phase >= 3 ? (
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg text-green-300 animate-fade-in mb-4">
              <span className="text-amber-400">while</span> attempts &gt; 0:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;entered_pass = input("Password: ")
            </div>
          ) : (
            phase === 2 && (
              <div className="relative mb-4 animate-fade-in">
                <button 
                  onClick={() => setShowOptions2(!showOptions2)}
                  className={`w-full text-left p-4 rounded-lg flex items-center justify-between transition-colors border-2 border-dashed ${showOptions2 ? 'border-amber-500 bg-amber-500/10 text-amber-200' : 'border-red-400/50 bg-red-500/5 hover:bg-red-500/10 text-red-300'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                    SECURITY FLAW: No lockout built! Click to add a loop.
                  </span>
                </button>
                
                {showOptions2 && (
                  <div className="absolute top-16 left-0 right-0 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-xl shadow-2xl z-20 flex flex-col gap-3 animate-fade-in">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mb-1">Select the correct loop logic to use the &#x60;attempts&#x60; variable (which starts at 3):</div>
                    
                    <button onClick={() => handleFix2(false)} className="text-left px-4 py-3 bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-mono text-sm leading-tight border border-transparent transition-colors">
                      <span className="text-amber-600 dark:text-amber-500">for</span> i <span className="text-amber-600 dark:text-amber-500">in</span> range(100):
                    </button>
                    
                    <button onClick={() => handleFix2(true)} className="text-left px-4 py-3 bg-stone-50 hover:bg-green-50 dark:bg-stone-900 dark:hover:bg-green-900/30 rounded-lg text-stone-700 dark:text-stone-300 font-mono text-sm leading-tight border border-transparent transition-colors">
                      <span className="text-amber-600 dark:text-amber-500">while</span> attempts &gt; 0:
                    </button>
                    
                    <button onClick={() => handleFix2(false)} className="text-left px-4 py-3 bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-mono text-sm leading-tight border border-transparent transition-colors">
                      <span className="text-amber-600 dark:text-amber-500">if</span> attempts == 3:
                    </button>
                  </div>
                )}
              </div>
            )
          )}

          <div className="relative">
            <span className="text-amber-400">if</span> entered_user 
            
            {phase >= 2 ? (
              <span className="text-green-400 bg-green-900/40 px-1 rounded mx-1 font-bold">==</span>
            ) : (
              <span className="relative inline-block mx-1">
                <button 
                  onClick={() => setShowOptions1(!showOptions1)}
                  className={`text-red-400 bg-red-900/20 px-1 rounded hover:bg-red-900/40 transition-colors ${showOptions1 ? 'ring-2 ring-red-400' : ''}`}
                >
                  <span className="underline decoration-wavy decoration-red-500 underline-offset-4">=</span>
                </button>
                {showOptions1 && (
                  <div className="absolute top-8 -left-10 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2 rounded-lg shadow-xl z-20 flex flex-col gap-1 min-w-[150px] animate-fade-in">
                    <button onClick={() => handleFix1(true)} className="text-center px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-stone-700 dark:text-stone-200 rounded font-bold">==</button>
                    <button onClick={() => handleFix1(false)} className="text-center px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded font-bold">!=</button>
                  </div>
                )}
              </span>
            )}
            
            username:
          </div>

          <div className={`pl-8 ${phase >= 3 ? 'border-l-2 border-stone-700 ml-3 pl-5 mt-1' : ''}`}>
             <div className="text-amber-400">if <span className="text-stone-300">entered_pass == password:</span></div>
             <div className="pl-8 text-blue-300">print<span className="text-stone-300">(</span><span className="text-green-300">"Welcome!"</span><span className="text-stone-300">)</span></div>
             
             {phase >= 3 && (
               <div className="pl-8 text-stone-300 mt-1 pb-1 animate-fade-in text-red-300">
                 <span className="text-stone-500"># Deduct attempt on success just to exit or break</span><br/>
                 <span className="text-amber-400">break</span>
               </div>
             )}

             <div className="text-amber-400">else:</div>
             <div className="pl-8 text-blue-300">print<span className="text-stone-300">(</span><span className="text-red-300">"Wrong password"</span><span className="text-stone-300">)</span></div>
             
             {phase >= 3 && (
               <div className="pl-8 text-stone-300 mt-1 animate-fade-in">
                 attempts -= 1
               </div>
             )}
          </div>
          
          <div className="text-amber-400 mt-2">else:</div>
          <div className="pl-8 text-blue-300">print<span className="text-stone-300">(</span><span className="text-red-300">"User not found"</span><span className="text-stone-300">)</span></div>
        </div>
      </div>

      <div className="h-24 w-full flex justify-center items-center">
        {phase === 1 && (
           <div className="text-stone-400 dark:text-stone-500 italic text-sm animate-pulse">SyntaxError: invalid syntax. Hint: assignment vs comparison...</div>
        )}
        {phase === 2 && (
           <div className="text-red-400 italic text-sm font-bold bg-red-50 dark:bg-red-900/10 px-6 py-3 rounded-full border border-red-200 dark:border-red-900/50 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Code runs, but it's insecure. Find the flaw!
           </div>
        )}
        {phase === 4 && (
          <div className="animate-fade-in w-full max-w-md bg-green-950 border border-green-800 p-6 rounded-xl font-mono text-sm text-green-400 shadow-xl flex items-center justify-between">
            <div>
              <div className="opacity-50 text-xs mb-1">Terminal Output</div>
              <div>{'>'} Password: wrong</div>
              <div>{'>'} Wrong password</div>
              <div>{'>'} Password: secure123</div>
              <div>{'>'} Welcome!</div>
            </div>
            <div className="flex items-center gap-2 bg-green-900/50 px-4 py-2 rounded-lg text-green-300 font-sans">
              <CheckIcon className="w-5 h-5" /> Module Complete!
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================

export default function ConditionalsLogicLesson({ currentPhase, currentStep, onComplete }) {
  // Fallback internal state if not wrapped in standard viewer
  const [internalScene, setInternalScene] = useState(1);
  const [sceneComplete, setSceneComplete] = useState(false);

  // Derive active scene from props
  let activeScene = internalScene;
  if (currentPhase === 'learn') activeScene = currentStep || 1;
  else if (currentPhase === 'apply') activeScene = 5;
  else if (currentPhase === 'challenge') activeScene = 6;

  const nextScene = () => {
    if (activeScene < 6) {
      setInternalScene(prev => prev + 1);
      setSceneComplete(false);
    }
  };

  const notifyComplete = (status) => {
    setSceneComplete(status);
    if (onComplete) onComplete();
  };

  const getSceneTitle = () => {
    switch (activeScene) {
      case 1: return "1. The fork in the road";
      case 2: return "2. True or False?";
      case 3: return "3. Building blocks of logic";
      case 4: return "4. Nested decisions";
      case 5: return "5. Real World: Grade calculator";
      case 6: return "6. Challenge: Fix the login system";
      default: return "";
    }
  };

  const renderScene = () => {
    switch (activeScene) {
      case 1: return <Scene1 onComplete={notifyComplete} />;
      case 2: return <Scene2 onComplete={notifyComplete} />;
      case 3: return <Scene3 onComplete={notifyComplete} />;
      case 4: return <Scene4 onComplete={notifyComplete} />;
      case 5: return <Scene5 onComplete={notifyComplete} />;
      case 6: return <Scene6 onComplete={notifyComplete} />;
      default: return <div className="text-stone-400">Loading scene...</div>;
    }
  };

  // hide default nav if wrapped by parent that provides props (it provides its own nav)
  const isWrapped = currentPhase !== undefined;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center font-sans">
      {!isWrapped && (
        <div className="w-full flex items-center justify-between mb-8 opacity-70">
          <div className="flex gap-2">
            {[1,2,3,4,5,6].map(i => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeScene ? 'w-8 bg-amber-500' : i < activeScene ? 'w-4 bg-stone-300 dark:bg-stone-600' : 'w-4 bg-stone-200 dark:bg-stone-800'
                }`} 
              />
            ))}
          </div>
          <div className="text-sm font-mono text-stone-500">Conditionals & Logic</div>
        </div>
      )}
      
      <SceneContainer 
        title={getSceneTitle()} 
        nextEnabled={sceneComplete || process.env.NODE_ENV === 'development'} 
        onNext={nextScene}
        isLast={activeScene === 6}
        hideNav={isWrapped}
      >
        <div className="w-full h-full animate-fade-in duration-500 flex flex-col justify-center items-center">
          {renderScene()}
        </div>
      </SceneContainer>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
