import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckIcon } from '../../components/Icons';
import { sounds } from '../../hooks/useSound';

// ============================================================================
// SCENE 1: The fork in the road (learn step 0)
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const [age, setAge] = useState(15);
  const isGranted = age >= 18;
  const grantedRef = useRef(false);
  const deniedRef = useRef(false);

  useEffect(() => {
    // If user has explored both paths, complete scene
    if (age >= 18 && !grantedRef.current) grantedRef.current = true;
    if (age < 18 && !deniedRef.current) deniedRef.current = true;

    if (grantedRef.current && deniedRef.current) {
      sounds.correct();
      const t = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(t);
    }
  }, [age, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Programs make decisions constantly. Every time you see "if your password is correct, log in — otherwise, show an error," that's a conditional. Try changing the age to see what happens.
      </p>

      <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl justify-center items-stretch">
        {/* Visual Fork */}
        <div className="relative flex-1 bg-paper border-[1.5px] border-ink/12 rounded-2xl p-8 flex flex-col items-center justify-between min-h-[350px] shadow-sm overflow-hidden">
          <div className="text-center font-mono font-bold text-xl bg-[#fdfcfa] px-4 py-2 border-2 border-ink/20 rounded-xl shadow-sm z-10 mb-8">
            age &gt;= 18
          </div>

          <div className="relative w-full flex-1 flex flex-col items-center mt-4">
            {/* SVG Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 50 100 Q 50 50 20 0"
                stroke={isGranted ? "#2a9d8f" : "#e5e5e5"}
                strokeWidth="12"
                fill="none"
                className="transition-colors duration-500"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 50 100 Q 50 50 80 0"
                stroke={!isGranted ? "#dc2626" : "#e5e5e5"}
                strokeWidth="12"
                fill="none"
                className="transition-colors duration-500"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            
            {/* Character */}
            <div 
              className="absolute w-8 h-8 bg-rust rounded-full shadow-lg border-2 border-white transition-all duration-700 ease-in-out"
              style={{
                bottom: '10px',
                left: '50%',
                transform: `translate(-50%, 0) translateY(${isGranted ? '-200px' : '-100px'}) translateX(${isGranted ? '-100px' : '100px'})`,
              }}
            >
               <div className="absolute inset-2 bg-white/30 rounded-full blur-sm"></div>
            </div>

            {/* Path Labels */}
            <div className="absolute top-0 w-full flex justify-between px-10">
              <div className={`transition-all duration-500 text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border-2 ${isGranted ? 'bg-success/10 text-success border-success/30 scale-110 shadow-lg shadow-success/20' : 'bg-[#fdfcfa] text-pencil border-ink/10 scale-95'}`}>
                Access Granted
              </div>
              <div className={`transition-all duration-500 text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border-2 ${!isGranted ? 'bg-error/10 text-error border-error/30 scale-110 shadow-lg shadow-error/20' : 'bg-[#fdfcfa] text-pencil border-ink/10 scale-95'}`}>
                Access Denied
              </div>
            </div>
          </div>
          
          <div className="mt-10 w-full max-w-xs bg-[#fdfcfa] p-4 rounded-xl border border-ink/10 shadow-sm z-10 flex flex-col gap-2">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-pencil">age</span>
              <span className="font-bold text-ink">{age}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={age} 
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full accent-rust"
            />
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-[#1a1a2e] rounded-2xl p-6 shadow-xl text-gray-300 font-mono text-sm flex flex-col justify-center gap-2 relative overflow-hidden">
          <div className="flex gap-2 mb-4 absolute top-4 left-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          
          <div className="mt-8">
            <div className="opacity-60 mb-4"># Try changing the age to run the program</div>
            <div className="flex items-center gap-2">
              <span className="text-[#2a9d8f] font-bold">if</span> 
              <span>age &gt;= <span className="text-blue-300">18</span>:</span>
            </div>
            <div className={`pl-8 py-2 rounded-lg transition-colors duration-300 ${isGranted ? 'bg-[rgba(40,86,166,0.3)] border-l-2 border-rust' : 'border-l-2 border-transparent'}`}>
              <span className="text-amber-300">print</span>(<span className="text-orange-300">"Access granted"</span>)
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#2a9d8f] font-bold">else</span>:
            </div>
            <div className={`pl-8 py-2 rounded-lg transition-colors duration-300 ${!isGranted ? 'bg-[rgba(40,86,166,0.3)] border-l-2 border-rust' : 'border-l-2 border-transparent'}`}>
              <span className="text-amber-300">print</span>(<span className="text-orange-300">"Access denied"</span>)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 2: True or False? (learn step 1)
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const [expressions, setExpressions] = useState([
    { id: 1, expr: '5 > 3', correct: true, state: 'idle' },
    { id: 2, expr: '10 == 11', correct: false, state: 'idle' },
    { id: 3, expr: '"hello" == "hello"', correct: true, state: 'idle' },
    { id: 4, expr: '7 < 2', correct: false, state: 'idle' },
    { id: 5, expr: 'True and False', correct: false, state: 'idle' },
    { id: 6, expr: 'True or False', correct: true, state: 'idle' },
    { id: 7, expr: 'not True', correct: false, state: 'idle' },
    { id: 8, expr: '3 != 3', correct: false, state: 'idle' }
  ]);

  const correctCount = expressions.filter(e => e.state === 'correct').length;
  const wrongResetTimerRef = useRef(null);

  useEffect(() => {
    if (correctCount === expressions.length) {
      sounds.correct();
      const t = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(t);
    }
  }, [correctCount, expressions.length, onComplete]);

  useEffect(() => {
    return () => {
      if (wrongResetTimerRef.current) clearTimeout(wrongResetTimerRef.current);
    };
  }, []);

  const handleAnswer = (id, answer) => {
    setExpressions(prev => prev.map(exp => {
      if (exp.id !== id) return exp;
      if (exp.state === 'correct') return exp;

      if (exp.correct === answer) {
        sounds.pop();
        return { ...exp, state: 'correct' };
      } else {
        sounds.wrong();
        return { ...exp, state: 'wrong' };
      }
    }));

    // Reset wrong state after animation
    if (wrongResetTimerRef.current) clearTimeout(wrongResetTimerRef.current);
    wrongResetTimerRef.current = setTimeout(() => {
      setExpressions(prev => prev.map(exp => {
        if (exp.id === id && exp.state === 'wrong') {
          return { ...exp, state: 'idle' };
        }
        return exp;
      }));
    }, 800);
  };

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-[#fdfcfa] px-6 py-2 rounded-full border-[1.5px] border-ink/12 shadow-sm font-bold text-rust flex items-center gap-2">
          <span>{correctCount} / {expressions.length}</span>
          <span className="text-ink/60 font-normal text-sm">correct</span>
        </div>
        <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
          Conditions boil down to one thing: is this <span className="font-mono bg-ink/5 px-2 py-0.5 rounded">True</span> or <span className="font-mono bg-ink/5 px-2 py-0.5 rounded">False</span>? Python evaluates every condition into a boolean.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {expressions.map((exp) => (
          <div 
            key={exp.id} 
            className={`relative w-full h-40 flex flex-col items-center justify-center p-4 rounded-2xl border-[1.5px] transition-all duration-300 transform perspective-1000 ${
              exp.state === 'correct' ? 'bg-success/10 border-success/30 shadow-[0_4px_20px_rgba(42,157,143,0.15)] scale-105' :
              exp.state === 'wrong' ? 'bg-error/5 border-error/30 animate-[shake_0.4s_ease-in-out]' : 
              'bg-[#fdfcfa] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:-translate-y-1'
            }`}
          >
            {exp.state === 'correct' ? (
               <div className="flex flex-col items-center gap-2 animate-[pop_0.4s_ease-out]">
                 <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white shadow-lg">
                   <CheckIcon className="w-6 h-6" />
                 </div>
                 <span className="font-bold text-success tracking-wide uppercase text-sm">Correct</span>
               </div>
            ) : (
              <>
                <div className="font-mono text-lg font-bold text-ink mb-6 text-center h-10 flex items-center justify-center bg-[rgba(255,255,255,0.5)] w-full rounded-lg">
                  {exp.expr}
                </div>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => handleAnswer(exp.id, true)}
                    className="flex-1 bg-[#fdfcfa] border border-ink/10 hover:border-success/50 hover:bg-success/5 text-ink font-bold py-2 rounded-xl transition-colors text-sm shadow-sm active:scale-95"
                  >
                    True
                  </button>
                  <button 
                    onClick={() => handleAnswer(exp.id, false)}
                    className="flex-1 bg-[#fdfcfa] border border-ink/10 hover:border-error/50 hover:bg-error/5 text-ink font-bold py-2 rounded-xl transition-colors text-sm shadow-sm active:scale-95"
                  >
                    False
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

// ============================================================================
// SCENE 3: Building blocks of logic (learn step 2)
// ============================================================================

const Scene3 = ({ onComplete }) => {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [operator, setOperator] = useState('and'); // 'and', 'or', 'not A'

  // Traced interactions for completion (we need user to test enough combos to grasp it)
  const [discovered, setDiscovered] = useState(new Set());

  let output = false;
  if (operator === 'and') output = inputA && inputB;
  if (operator === 'or') output = inputA || inputB;
  if (operator === 'not A') output = !inputA;

  useEffect(() => {
    const key = `${operator}-${inputA}-${inputB}`;
    setDiscovered(prev => new Set(prev).add(key));
  }, [operator, inputA, inputB]);

  useEffect(() => {
    // Need at least 6 different interactions to complete
    if (discovered.size >= 6) {
      sounds.correct();
      const t = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(t);
    }
  }, [discovered, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        You can combine conditions using <span className="font-mono bg-ink/5 px-1.5 rounded text-rust">and</span>, <span className="font-mono bg-ink/5 px-1.5 rounded text-rust">or</span>, and <span className="font-mono bg-ink/5 px-1.5 rounded text-rust">not</span> — just like building with logical LEGO blocks. Try all operators.
      </p>

      <div className="w-full max-w-3xl bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-2xl p-10 shadow-sm flex flex-col gap-10">
        
        {/* Logic Gate Visualizer */}
        <div className="flex items-center justify-between gap-4 relative">
          
          {/* Inputs */}
          <div className="flex flex-col gap-12 z-10">
            <div className="flex items-center gap-4">
               <div className="text-pencil font-bold font-mono">A</div>
               <button
                 onClick={() => { sounds.pop(); setInputA(!inputA); }}
                 className={`w-16 h-10 rounded-full transition-colors relative shadow-inner flex items-center ${inputA ? 'bg-success/20' : 'bg-ink/10'}`}
               >
                 <div className={`w-8 h-8 rounded-full shadow-sm absolute transition-all duration-300 flex items-center justify-center font-mono text-xs font-bold ${inputA ? 'left-[30px] bg-success text-white' : 'left-[4px] bg-[#fdfcfa] text-ink/40'}`}>
                   {inputA ? 'T' : 'F'}
                 </div>
               </button>
            </div>
            
            <div className={`flex items-center gap-4 transition-opacity duration-300 ${operator === 'not A' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
               <div className="text-pencil font-bold font-mono">B</div>
               <button
                 onClick={() => { sounds.pop(); setInputB(!inputB); }}
                 className={`w-16 h-10 rounded-full transition-colors relative shadow-inner flex items-center ${inputB ? 'bg-success/20' : 'bg-ink/10'}`}
               >
                 <div className={`w-8 h-8 rounded-full shadow-sm absolute transition-all duration-300 flex items-center justify-center font-mono text-xs font-bold ${inputB ? 'left-[30px] bg-success text-white' : 'left-[4px] bg-[#fdfcfa] text-ink/40'}`}>
                   {inputB ? 'T' : 'F'}
                 </div>
               </button>
            </div>
          </div>

          {/* Connection Lines (Left to Center) */}
          <svg className="absolute left-[80px] right-[240px] top-0 bottom-0 w-[calc(100%-320px)] h-full pointer-events-none z-0">
            <path d="M 0 25 L 50 25 L 50 60 L 100 60" fill="none" stroke={inputA ? "#2a9d8f" : "#e5e5e5"} strokeWidth="4" className="transition-colors duration-300" />
            {operator !== 'not A' && (
              <path d="M 0 115 L 50 115 L 50 80 L 100 80" fill="none" stroke={inputB ? "#2a9d8f" : "#e5e5e5"} strokeWidth="4" className="transition-colors duration-300" />
            )}
          </svg>

          {/* Operator Box */}
          <div className="flex flex-col gap-2 z-10 mx-auto bg-[#fdfcfa] p-2 rounded-xl shadow-lg border-2 border-rust/20 w-40">
             {['and', 'or', 'not A'].map(op => (
               <button
                 key={op}
                 onClick={() => { sounds.pop(); setOperator(op); }}
                 className={`font-mono font-bold py-2 rounded-lg transition-all ${operator === op ? 'bg-rust text-white shadow-md scale-105' : 'bg-transparent text-ink/50 hover:bg-ink/5'}`}
               >
                 {op}
               </button>
             ))}
          </div>

          {/* Connection Lines (Center to Right) */}
          <svg className="absolute right-[80px] w-20 h-full pointer-events-none z-0">
            <path d="M 0 70 L 60 70" fill="none" stroke={output ? "#2a9d8f" : "#e5e5e5"} strokeWidth="6" className="transition-colors duration-300" />
          </svg>

          {/* Output */}
          <div className="flex flex-col items-center gap-3 z-10">
             <div className="text-pencil font-bold font-mono">Output</div>
             <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner border-4 transition-all duration-500 ${output ? 'bg-success/20 border-success shadow-[0_0_30px_rgba(42,157,143,0.4)]' : 'bg-ink/5 border-ink/10'}`}>
                <div className={`font-mono text-2xl font-bold transition-colors duration-500 ${output ? 'text-success' : 'text-pencil'}`}>
                  {output ? 'True' : 'False'}
                </div>
             </div>
          </div>
        </div>

        {/* Truth Table */}
        <div className="mt-8 border-t border-ink/10 pt-8">
          <div className="text-center font-bold text-ink/60 mb-4 font-mono text-sm uppercase tracking-wider">Truth Table Explorer</div>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b-2 border-ink/10 text-pencil font-mono text-sm">
                <th className="pb-3 w-1/4">A</th>
                {operator !== 'not A' && <th className="pb-3 w-1/4">B</th>}
                <th className="pb-3 w-1/4">Operator</th>
                <th className="pb-3 w-1/4">Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pt-4 pb-2 font-mono">
                  <span className={`px-2 py-1 rounded ${inputA ? 'bg-success/10 text-success' : 'bg-ink/5 text-ink/50'}`}>{inputA ? 'True' : 'False'}</span>
                </td>
                {operator !== 'not A' && (
                  <td className="pt-4 pb-2 font-mono">
                    <span className={`px-2 py-1 rounded ${inputB ? 'bg-success/10 text-success' : 'bg-ink/5 text-ink/50'}`}>{inputB ? 'True' : 'False'}</span>
                  </td>
                )}
                <td className="pt-4 pb-2 font-mono font-bold text-rust">{operator}</td>
                <td className="pt-4 pb-2 font-mono font-bold">
                  <span className={`px-3 py-1.5 rounded-lg border-2 ${output ? 'border-success text-success bg-success/5' : 'border-ink/10 text-ink/40 bg-ink/5'}`}>{output ? 'True' : 'False'}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="w-full mt-6 bg-ink/5 h-2 rounded-full overflow-hidden">
            <div 
               className="h-full bg-rust transition-all duration-500 ease-out"
               style={{ width: `${Math.min(100, (discovered.size / 6) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: Nested decisions (learn step 3)
// ============================================================================

const Scene4 = ({ onComplete }) => {
  const [isStudent, setIsStudent] = useState(true);
  const [age, setAge] = useState(20);

  const isUnder26 = age < 26;
  
  // 0: Student < 26 (0 PLN), 1: Student >= 26 (10 PLN), 2: Non-student (20 PLN)
  const activePath = !isStudent ? 2 : (isUnder26 ? 0 : 1);

  const [pathsExplored, setPathsExplored] = useState(new Set());

  useEffect(() => {
    setPathsExplored(prev => new Set(prev).add(activePath));
  }, [activePath]);

  useEffect(() => {
    if (pathsExplored.size === 3) {
      sounds.correct();
      const t = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(t);
    }
  }, [pathsExplored, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Sometimes one decision leads to another. That's nesting — an <span className="font-mono bg-ink/5 px-1.5 rounded text-rust">if</span> inside an <span className="font-mono bg-ink/5 px-1.5 rounded text-rust">if</span>. Explore the paths to see how price changes.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch">
        
        {/* Controls & Tree */}
        <div className="flex-[1.2] flex flex-col gap-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 bg-[#fdfcfa] p-6 rounded-2xl border-[1.5px] border-ink/12 shadow-sm">
             <div className="flex-1 flex flex-col gap-2">
               <label className="text-sm font-bold text-ink font-mono">is_student</label>
               <div className="flex bg-ink/5 p-1 rounded-lg">
                 <button onClick={() => { sounds.pop(); setIsStudent(true); }} className={`flex-1 py-1.5 rounded-md font-mono text-sm transition-all ${isStudent ? 'bg-[#fdfcfa] shadow-sm font-bold text-success' : 'text-ink/60 hover:text-ink hover:bg-ink/5'}`}>True</button>
                 <button onClick={() => { sounds.pop(); setIsStudent(false); }} className={`flex-1 py-1.5 rounded-md font-mono text-sm transition-all ${!isStudent ? 'bg-[#fdfcfa] shadow-sm font-bold text-error' : 'text-ink/60 hover:text-ink hover:bg-ink/5'}`}>False</button>
               </div>
             </div>
             <div className={`flex-1 flex flex-col gap-2 transition-opacity duration-300 ${!isStudent ? 'opacity-40' : 'opacity-100'}`}>
               <div className="flex justify-between">
                 <label className="text-sm font-bold text-ink font-mono">age</label>
                 <span className="font-mono text-rust font-bold">{age}</span>
               </div>
               <input type="range" min="15" max="40" value={age} onChange={(e) => setAge(parseInt(e.target.value))} className="w-full accent-rust" />
             </div>
          </div>

          {/* Decision Tree */}
          <div className="flex-1 bg-paper border-[1.5px] border-ink/12 rounded-2xl p-8 relative flex flex-col items-center justify-start min-h-[300px] overflow-hidden">
            {/* Start Node */}
            <div className={`w-32 py-2 rounded-xl text-center font-bold text-white shadow-md z-10 transition-colors ${isStudent ? 'bg-rust' : 'bg-ink/80'}`}>
              is_student?
            </div>

            {/* Path 1: Not Student */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
               {/* Not student line */}
               <path d="M 50% 60px L 80% 60px L 80% 200px" fill="none" stroke={activePath === 2 ? "#d97706" : "#e5e5e5"} strokeWidth={activePath === 2 ? "6" : "3"} className="transition-all duration-300" />
               {/* Student line */}
               <path d="M 50% 60px L 50% 120px" fill="none" stroke={isStudent ? "#2a9d8f" : "#e5e5e5"} strokeWidth={isStudent ? "6" : "3"} className="transition-all duration-300" />
               {/* Student Age lines */}
               {isStudent && (
                 <>
                   <path d="M 50% 160px L 20% 160px L 20% 200px" fill="none" stroke={activePath === 0 ? "#2a9d8f" : "#e5e5e5"} strokeWidth={activePath === 0 ? "6" : "3"} className="transition-all duration-300" />
                   <path d="M 50% 160px L 50% 200px" fill="none" stroke={activePath === 1 ? "#2856a6" : "#e5e5e5"} strokeWidth={activePath === 1 ? "6" : "3"} className="transition-all duration-300" />
                 </>
               )}
            </svg>

            {/* Middle Node */}
            <div className={`mt-10 w-32 py-2 rounded-xl text-center font-bold text-white shadow-md z-10 transition-all duration-500 ${isStudent ? 'opacity-100 bg-rust translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              age &lt; 26?
            </div>

            {/* Terminals */}
            <div className="absolute bottom-8 w-full flex justify-between px-6 z-10">
               <div className={`w-28 text-center flex flex-col transition-all duration-300 ${activePath === 0 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'} ${!isStudent ? 'opacity-0' : ''}`}>
                 <div className="bg-success text-white font-bold py-2 rounded-xl shadow-lg">0 PLN</div>
                 <span className="text-xs text-pencil mt-2 font-mono">Yes</span>
               </div>
               <div className={`w-28 text-center flex flex-col transition-all duration-300 ${activePath === 1 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'} ${!isStudent ? 'opacity-0' : ''}`}>
                 <div className="bg-rust text-white font-bold py-2 rounded-xl shadow-lg">10 PLN</div>
                 <span className="text-xs text-pencil mt-2 font-mono">No</span>
               </div>
               <div className={`w-28 text-center flex flex-col transition-all duration-300 ${activePath === 2 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
                 <div className="bg-amber-600 text-white font-bold py-2 rounded-xl shadow-lg">20 PLN</div>
                 <span className="text-xs text-pencil mt-2 font-mono">False</span>
               </div>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-[#1a1a2e] rounded-2xl p-6 shadow-xl text-gray-300 font-mono text-sm leading-8 flex flex-col justify-center gap-1 relative min-h-[300px]">
           <div className="absolute top-4 left-4 flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
           </div>

           <div className="mt-6">
             <div className={`px-2 rounded transition-colors duration-300 ${isStudent ? 'bg-rust/20 border-l-2 border-rust' : 'border-l-2 border-transparent'}`}>
               <span className="text-[#2a9d8f] font-bold">if</span> is_student:
             </div>
             
             <div className="pl-6 flex flex-col">
               <div className={`px-2 rounded transition-colors duration-300 ${isStudent && isUnder26 ? 'bg-rust/20 border-l-2 border-rust' : 'border-l-2 border-transparent opacity-60'}`}>
                 <span className="text-[#2a9d8f] font-bold">if</span> age &lt; <span className="text-blue-300">26</span>:
               </div>
               <div className={`pl-6 px-2 rounded transition-colors duration-300 ${activePath === 0 ? 'bg-[rgba(40,86,166,0.4)] text-white font-bold' : 'opacity-60'}`}>
                 price = <span className="text-blue-300">0</span>
               </div>
               
               <div className={`px-2 rounded transition-colors duration-300 ${isStudent && !isUnder26 ? 'bg-rust/20 border-l-2 border-rust' : 'border-l-2 border-transparent opacity-60'}`}>
                 <span className="text-[#2a9d8f] font-bold">else</span>:
               </div>
               <div className={`pl-6 px-2 rounded transition-colors duration-300 ${activePath === 1 ? 'bg-[rgba(40,86,166,0.4)] text-white font-bold' : 'opacity-60'}`}>
                 price = <span className="text-blue-300">10</span>
               </div>
             </div>

             <div className={`px-2 mt-1 rounded transition-colors duration-300 ${!isStudent ? 'bg-amber-600/20 border-l-2 border-amber-500' : 'border-l-2 border-transparent opacity-60'}`}>
               <span className="text-[#2a9d8f] font-bold">else</span>:
             </div>
             <div className={`pl-6 px-2 rounded transition-colors duration-300 ${activePath === 2 ? 'bg-[rgba(217,119,6,0.4)] text-white font-bold' : 'opacity-60'}`}>
               price = <span className="text-blue-300">20</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Grade calculator (apply step 0)
// ============================================================================

const Scene5 = ({ onComplete }) => {
  const [score, setScore] = useState(85);
  
  // Draggable thresholds logic
  const [blanks, setBlanks] = useState({
    A: null, B: null, C: null, D: null
  });
  
  const [availableValues, setAvailableValues] = useState([
    { id: 't90', val: '90' },
    { id: 't80', val: '80' },
    { id: 't70', val: '70' },
    { id: 't60', val: '60' },
  ]);

  const blanksRef = useRef(blanks);
  blanksRef.current = blanks;

  const isComplete = Object.values(blanks).every(v => v !== null);

  useEffect(() => {
    // Only complete if they are placed correctly (descending order)
    if (isComplete) {
      if (blanks.A === '90' && blanks.B === '80' && blanks.C === '70' && blanks.D === '60') {
        sounds.correct();
        const t = setTimeout(() => onComplete(), 2000);
        return () => clearTimeout(t);
      }
    }
  }, [isComplete, blanks, onComplete]);

  const handleDrop = (gradeLevel, valId) => {
    const item = availableValues.find(v => v.id === valId);
    if (!item) return;

    const currentBlanks = blanksRef.current;

    // Check if slot is taken
    if (currentBlanks[gradeLevel]) {
      // Put existing back to available
      setAvailableValues(prev => [...prev, { id: `t${currentBlanks[gradeLevel]}`, val: currentBlanks[gradeLevel] }]);
    }

    sounds.snap();
    setBlanks(prev => ({ ...prev, [gradeLevel]: item.val }));
    setAvailableValues(prev => prev.filter(v => v.id !== valId));
  };

  // Determine active branch based on current blanks + score
  let calculatedGrade = 'F';
  let activeBranch = 'F';
  if (blanks.A && score >= parseInt(blanks.A)) { calculatedGrade = 'A'; activeBranch = 'A'; }
  else if (blanks.B && score >= parseInt(blanks.B)) { calculatedGrade = 'B'; activeBranch = 'B'; }
  else if (blanks.C && score >= parseInt(blanks.C)) { calculatedGrade = 'C'; activeBranch = 'C'; }
  else if (blanks.D && score >= parseInt(blanks.D)) { calculatedGrade = 'D'; activeBranch = 'D'; }

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        The university needs a program that converts numeric grades to letter grades. Drag the threshold values into the correct blanks to fix the logic.
      </p>

      <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
        {/* Editor Side */}
        <div className="flex-1 flex flex-col gap-6 w-full">
           
           <div className="bg-[#1a1a2e] rounded-2xl p-6 shadow-xl text-gray-300 font-mono text-sm leading-loose border border-[#222]">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                 <span className="text-pencil">score =</span>
                 <input 
                   type="range" min="0" max="100" value={score} 
                   onChange={(e) => setScore(parseInt(e.target.value))}
                   className="flex-1 accent-rust"
                 />
                 <span className="text-blue-300 font-bold bg-blue-500/10 px-2 py-0.5 rounded">{score}</span>
              </div>

              {['A', 'B', 'C', 'D'].map((grade) => (
                <div key={grade} className="flex flex-col">
                  <div className={`flex items-center gap-2 px-2 py-0.5 rounded transition-colors ${activeBranch === grade ? 'bg-rust/20 border-l-2 border-rust' : 'border-l-2 border-transparent'}`}>
                    <span className="text-[#2a9d8f] font-bold">{grade === 'A' ? 'if' : 'elif'}</span>
                    <span>score &gt;=</span>
                    <div 
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDrop(grade, e.dataTransfer.getData('valId'))}
                      className={`inline-flex items-center justify-center min-w-[3rem] h-6 rounded px-2 transition-all ${blanks[grade] ? 'bg-[#fdfcfa] text-ink font-bold shadow' : 'bg-[#2d2d2d] border border-[#444] border-dashed text-ink'}`}
                    >
                      {blanks[grade] || '___'}
                    </div>
                    <span>:</span>
                  </div>
                  <div className={`pl-8 px-2 py-0.5 rounded transition-colors ${activeBranch === grade ? 'text-white' : 'opacity-60'}`}>
                    grade = <span className="text-amber-300">"{grade}"</span>
                  </div>
                </div>
              ))}
              
              <div className="flex flex-col mt-1">
                <div className={`px-2 py-0.5 rounded transition-colors ${activeBranch === 'F' ? 'bg-rust/20 border-l-2 border-rust' : 'border-l-2 border-transparent'}`}>
                  <span className="text-[#2a9d8f] font-bold">else</span>:
                </div>
                <div className={`pl-8 px-2 py-0.5 rounded transition-colors ${activeBranch === 'F' ? 'text-white' : 'opacity-60'}`}>
                  grade = <span className="text-amber-300">"F"</span>
                </div>
              </div>
           </div>

           <div className="flex justify-center gap-4 min-h-[50px]">
             {availableValues.map(v => (
                <div 
                  key={v.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('valId', v.id)}
                  className="w-14 h-10 flex items-center justify-center bg-[#fdfcfa] border-2 border-rust/30 rounded-lg shadow-sm cursor-grab active:cursor-grabbing font-mono font-bold text-rust hover:-translate-y-1 transition-transform"
                >
                  {v.val}
                </div>
             ))}
           </div>
           
           {isComplete && blanks.A !== '90' && (
             <div className="bg-amber-100 border border-amber-300 text-amber-800 p-3 rounded-xl text-sm font-medium animate-pulse text-center">
               The logic works top-to-bottom. If you check &gt;= 60 first, a score of 95 will trigger the "D" branch and stop! Thresholds must be descending.
             </div>
           )}
        </div>

        {/* Visual Grade Card Side */}
        <div className="flex-[0.8] flex justify-center w-full">
           <div className={`w-full max-w-sm bg-paper border-[1.5px] border-ink/12 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform ${isComplete && blanks.A === '90' ? 'scale-105 shadow-xl ring-4 ring-success/20' : ''}`}>
             <div className="bg-ink text-white p-5 flex justify-between items-center">
               <div className="font-bold tracking-widest uppercase text-xs">Official Record</div>
               <div className="font-mono text-xs opacity-50"># 2026-FALL</div>
             </div>
             
             <div className="p-8 flex flex-col items-center gap-8">
                <div className="w-32 h-32 rounded-full border-8 border-white shadow-inner bg-[#fdfcfa] flex items-center justify-center relative">
                   <div className="absolute inset-0 rounded-full border-4 border-rust/10"></div>
                   <span className={`text-6xl font-bold font-serif transition-colors duration-500 ${
                     calculatedGrade === 'A' ? 'text-success' : 
                     calculatedGrade === 'F' ? 'text-error' : 'text-rust'
                   }`}>
                     {calculatedGrade}
                   </span>
                </div>

                <div className="w-full flex justify-between items-end border-b-2 border-ink/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-pencil font-bold">Final Score</span>
                    <span className="font-mono text-3xl font-bold text-ink">{score}<span className="text-lg text-ink/40">/100</span></span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                     calculatedGrade === 'A' ? 'bg-success/10 text-success' : 
                     calculatedGrade === 'F' ? 'bg-error/10 text-error' : 'bg-rust/10 text-rust'
                  }`}>
                    {calculatedGrade === 'F' ? 'Failed' : 'Passed'}
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Fix the login system (challenge step 0)
// ============================================================================

const Scene6 = ({ onComplete }) => {
  const [bug1Fixed, setBug1Fixed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [phase, setPhase] = useState(1); // 1: fix =, 2: add loop
  const [loopAdded, setLoopAdded] = useState(false);

  const phaseTimerRef = useRef(null);

  useEffect(() => {
    if (loopAdded) {
      sounds.correct();
      const t = setTimeout(() => onComplete(), 2500);
      return () => clearTimeout(t);
    }
  }, [loopAdded, onComplete]);

  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, []);

  const codePhase1 = (
    <div className="flex flex-col">
       <div className="opacity-50">username = <span className="text-amber-300">"admin"</span></div>
       <div className="opacity-50 mb-4">password = <span className="text-amber-300">"secure123"</span></div>
       
       <div className="opacity-50">entered_user = <span className="text-amber-300">"admin"</span></div>
       <div className="opacity-50 mb-4">entered_pass = <span className="text-amber-300">"wrong"</span></div>

       <div className="flex items-center relative">
         <span className="text-[#2a9d8f] font-bold mr-2">if</span> 
         
         {!bug1Fixed ? (
           <button 
             onClick={() => { sounds.pop(); setShowOptions(!showOptions); }}
             className={`px-1 rounded border-b-2 border-red-500/50 hover:bg-red-500/10 transition-colors relative ${showOptions ? 'bg-red-500/20' : ''}`}
           >
             entered_user <span className="text-red-400 font-bold">=</span> username:
           </button>
         ) : (
           <span className="text-green-300 bg-green-900/30 px-1 rounded">
             entered_user == username:
           </span>
         )}

         {showOptions && !bug1Fixed && (
            <div className="absolute top-8 left-10 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-xl p-3 shadow-xl z-20 w-64 text-ink flex flex-col gap-2">
               <div className="text-xs font-sans text-pencil mb-1">Pick the correct comparison:</div>
               <button onClick={() => { sounds.correct(); setBug1Fixed(true); setShowOptions(false); if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current); phaseTimerRef.current = setTimeout(() => setPhase(2), 1500); }} className="text-left px-3 py-2 hover:bg-success/10 rounded font-mono text-sm">
                 entered_user <span className="text-success font-bold">==</span> username:
               </button>
               <button onClick={() => { sounds.wrong(); setShowOptions(false); }} className="text-left px-3 py-2 hover:bg-ink/5 rounded font-mono text-sm">
                 entered_user <span className="font-bold">:=</span> username:
               </button>
            </div>
         )}
         
         {bug1Fixed && <CheckIcon className="w-5 h-5 text-success ml-3 animate-[pop_0.3s_ease-out]" />}
       </div>

       <div className="pl-6"><span className="text-[#2a9d8f] font-bold">if</span> entered_pass == password:</div>
       <div className="pl-12">print(<span className="text-amber-300">"Welcome!"</span>)</div>
       <div className="pl-6"><span className="text-[#2a9d8f] font-bold">else</span>:</div>
       <div className="pl-12">print(<span className="text-amber-300">"Wrong password"</span>)</div>
       
       <div className="mt-1"><span className="text-[#2a9d8f] font-bold">else</span>:</div>
       <div className="pl-6">print(<span className="text-amber-300">"User not found"</span>)</div>
    </div>
  );

  const codePhase2 = (
    <div className="flex flex-col relative">
       <div className="opacity-70">attempts = <span className="text-blue-300">3</span></div>
       <div className="opacity-70 mb-4">...</div>

       {!loopAdded ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              if (e.dataTransfer.getData('type') === 'correct') { sounds.snap(); setLoopAdded(true); }
              else { sounds.wrong(); }
            }}
            className="border-2 border-dashed border-rust/30 rounded-lg p-4 bg-rust/5 relative my-2 min-h-[60px] flex items-center justify-center"
          >
             <span className="text-rust font-sans font-bold text-sm">Drag loop code here</span>
          </div>
       ) : (
          <div className="text-green-300 mb-2 bg-green-900/30 px-2 py-1 rounded w-fit animate-[pop_0.3s_ease-out] border border-green-500/30">
            <span className="text-[#2a9d8f] font-bold">while</span> attempts &gt; <span className="text-blue-300">0</span>:
          </div>
       )}

       <div className={`transition-all duration-500 ${loopAdded ? 'pl-6 border-l-2 border-white/10' : ''}`}>
         <div className="opacity-70"><span className="text-[#2a9d8f] font-bold mr-2">if</span> entered_user == username:</div>
         <div className="opacity-70 pl-6"><span className="text-[#2a9d8f] font-bold">if</span> entered_pass == password:</div>
         <div className="opacity-70 pl-12">print(<span className="text-amber-300">"Welcome!"</span>)</div>
         <div className="opacity-70 pl-6"><span className="text-[#2a9d8f] font-bold">else</span>:</div>
         <div className="opacity-70 pl-12">print(<span className="text-amber-300">"Wrong"</span>)</div>
         {loopAdded && (
           <div className="text-green-300 pl-12 mt-1 animate-[pop_0.3s_ease-out] delay-100">
             attempts = attempts - <span className="text-blue-300">1</span>
           </div>
         )}
       </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 items-center">
      <div className="bg-amber-100 text-amber-900 border-[1.5px] border-amber-300 px-6 py-4 rounded-xl flex items-center gap-4 shadow-sm w-full">
         <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center shrink-0 text-xl">🐛</div>
         <div>
           <h3 className="font-bold">System Vulnerability Detected</h3>
           <p className="text-sm opacity-80 mt-1">
             {phase === 1 
               ? "Line 7 uses assignment (=) instead of comparison (==). This is a critical logic bug!"
               : "Good fix! But wait... what happens if someone tries 10,000 wrong passwords? We need to limit attempts."}
           </p>
         </div>
      </div>

      <div className="w-full bg-[#1a1a2e] border border-[#222] rounded-2xl p-8 font-mono text-sm leading-loose shadow-2xl min-h-[400px]">
         {phase === 1 ? codePhase1 : codePhase2}
      </div>

      {phase === 2 && !loopAdded && (
         <div className="w-full animate-[fade-in_0.5s_ease-out] flex flex-col items-center gap-4 mt-2">
            <div className="text-pencil text-sm">Drag the correct logic block into the code:</div>
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              
              <div 
                draggable 
                onDragStart={(e) => e.dataTransfer.setData('type', 'wrong1')}
                className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-xl p-4 shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform flex-1 max-w-[250px]"
              >
                <div className="font-mono text-sm text-ink"><span className="text-rust font-bold">if</span> attempts &lt; 3:</div>
              </div>
              
              <div 
                draggable 
                onDragStart={(e) => e.dataTransfer.setData('type', 'correct')}
                className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-xl p-4 shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform flex-1 max-w-[250px]"
              >
                <div className="font-mono text-sm text-ink"><span className="text-rust font-bold">while</span> attempts &gt; 0:</div>
              </div>
              
            </div>
            
         </div>
      )}

      {loopAdded && (
        <div className="w-full bg-success/10 border-[1.5px] border-success/30 p-6 rounded-xl font-sans flex items-center justify-between shadow-sm animate-[fade-in_0.5s_ease-out]">
          <div>
            <h3 className="font-bold text-success text-lg">System Secured!</h3>
            <p className="text-success/80 text-sm mt-1">Both logical bugs have been patched.</p>
          </div>
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white shadow-lg">
            <CheckIcon className="w-6 h-6" />
          </div>
        </div>
      )}

    </div>
  );
};

// ============================================================================
// MAIN COMPONENT — accepts LessonViewer props
// ============================================================================

export default function ConditionalsLogicLesson({ currentPhase, currentStep, onComplete }) {
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

  return scenes[sceneKey] || <div className="text-pencil text-center py-12">Scene not found: {sceneKey}</div>;
}