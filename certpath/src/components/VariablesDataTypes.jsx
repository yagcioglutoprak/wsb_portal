import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

const SceneContainer = ({ title, children, nextEnabled, onNext, isLast }) => (
  <div className="flex flex-col w-full h-full min-h-[600px] border border-stone-200/50 dark:border-white/10 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-xl shadow-2xl transition-all duration-500">
    <div className="p-8 flex-1 flex flex-col relative">
      <h2 className="text-2xl font-light text-stone-800 dark:text-stone-100 tracking-tight mb-8">
        {title}
      </h2>
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl mx-auto">
        {children}
      </div>
    </div>
    <div className="border-t border-stone-100/50 dark:border-white/5 p-4 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
      <div className="text-sm text-stone-500 dark:text-stone-400 font-mono tracking-widest uppercase">
        Python 101
      </div>
      <button
        onClick={onNext}
        disabled={!nextEnabled}
        className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
          nextEnabled
            ? 'bg-stone-900 text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95 shadow-md'
            : 'bg-stone-200 text-stone-400 dark:bg-white/5 dark:text-white/20 cursor-not-allowed'
        }`}
      >
        {isLast ? 'Complete Lesson' : 'Next Scene'}
        <ArrowRightIcon className={`w-4 h-4 transition-transform ${nextEnabled ? 'group-hover:translate-x-1' : ''}`} />
      </button>
    </div>
  </div>
);

const DraggablePill = ({ id, label, type, onDragStart, dragging }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('id', id);
      e.dataTransfer.setData('type', type);
      e.dataTransfer.setData('label', label);
      onDragStart?.();
    }}
    className={`px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing border text-sm font-mono shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
      dragging ? 'opacity-50 scale-95' : 'opacity-100'
    } ${
      type === 'name' 
        ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300' 
        : 'bg-stone-50 border-stone-200 text-stone-700 dark:bg-white/5 dark:border-white/10 dark:text-stone-300'
    }`}
  >
    {label}
  </div>
);

const CodeSnippet = ({ children }) => (
  <pre className="font-mono text-sm tracking-tight text-stone-800 dark:text-stone-300 bg-stone-50/80 dark:bg-black/40 border border-stone-200/50 dark:border-white/10 p-6 rounded-xl shadow-inner w-full overflow-x-auto">
    <code>{children}</code>
  </pre>
);

// ============================================================================
// SCENE 1: Everything is a box
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const [boxes, setBoxes] = useState([
    { id: 1, expectedName: 'age', expectedValue: '22', name: null, value: null },
    { id: 2, expectedName: 'name', expectedValue: '"Kasia"', name: null, value: null },
    { id: 3, expectedName: 'city', expectedValue: '"Warsaw"', name: null, value: null },
  ]);

  const [names] = useState(['city', 'age', 'name']);
  const [values] = useState(['"Kasia"', '22', '"Warsaw"']);
  const [shakeBox, setShakeBox] = useState(null);

  useEffect(() => {
    if (boxes.every((b) => b.name === b.expectedName && b.value === b.expectedValue)) {
      onComplete(true);
    }
  }, [boxes, onComplete]);

  const handleDrop = (boxId, slotType, itemContent) => {
    setBoxes((prev) => {
      const newBoxes = [...prev];
      const boxIndex = newBoxes.findIndex(b => b.id === boxId);
      const targetBox = newBoxes[boxIndex];
      
      const isCorrectName = slotType === 'name' && itemContent === targetBox.expectedName;
      const isCorrectValue = slotType === 'value' && itemContent === targetBox.expectedValue;

      // Ensure that if setting a value, the name is already correct or vice versa to be "fully correct pair"
      if (slotType === 'name' && !targetBox.name) {
        if (isCorrectName || (!targetBox.expectedName)) {
           targetBox.name = itemContent;
        } else {
           triggerShake(boxId);
        }
      } else if (slotType === 'value' && !targetBox.value) {
        if (targetBox.name === 'age' && itemContent !== '22') triggerShake(boxId);
        else if (targetBox.name === 'name' && itemContent !== '"Kasia"') triggerShake(boxId);
        else if (targetBox.name === 'city' && itemContent !== '"Warsaw"') triggerShake(boxId);
        else targetBox.value = itemContent;
      }
      return newBoxes;
    });
  };

  const triggerShake = (id) => {
    setShakeBox(id);
    setTimeout(() => setShakeBox(null), 500);
  };

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <div className="flex gap-4 mb-4">
        {names.filter(n => !boxes.find(b => b.name === n)).map(name => (
          <DraggablePill key={name} id={name} label={name} type="name" />
        ))}
        {values.filter(v => !boxes.find(b => b.value === v)).map(value => (
          <DraggablePill key={value} id={value} label={value} type="value" />
        ))}
      </div>

      <div className="flex gap-8 w-full justify-center">
        {boxes.map((box) => {
          const isComplete = box.name && box.value;
          return (
            <div 
              key={box.id} 
              className={`flex flex-col items-center gap-4 transition-all duration-500 ease-out transform ${shakeBox === box.id ? 'animate-[shake_0.5s_ease-in-out]' : ''} ${isComplete ? 'scale-105' : ''}`}
            >
              <div className={`relative w-40 h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-500 ${isComplete ? 'border-amber-400 bg-amber-50/50 dark:border-amber-500/50 dark:bg-amber-900/20 shadow-lg shadow-amber-500/10' : 'border-dashed border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800/50'}`}>
                
                {/* Name Slot */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(box.id, 'name', e.dataTransfer.getData('label'))}
                  className={`w-3/4 h-10 rounded shadow-inner flex items-center justify-center text-sm font-mono transition-colors ${box.name ? 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100 border border-amber-300 dark:border-amber-600' : 'bg-stone-200/50 dark:bg-zinc-900/50 border border-stone-200 dark:border-zinc-700 text-stone-400 dark:text-zinc-500'}`}
                >
                  {box.name || 'name'}
                </div>

                <div className="text-stone-400 dark:text-zinc-500 font-mono text-xl">=</div>

                {/* Value Slot */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(box.id, 'value', e.dataTransfer.getData('label'))}
                  className={`w-3/4 h-10 rounded shadow-inner flex items-center justify-center text-sm font-mono transition-colors ${box.value ? 'bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-600 text-stone-700 dark:text-zinc-300' : 'bg-stone-200/50 dark:bg-zinc-900/50 border border-stone-200 dark:border-zinc-700 text-stone-400 dark:text-zinc-500'}`}
                >
                  {box.value || 'value'}
                </div>
              </div>
              
              <div className={`font-mono text-sm transition-opacity duration-300 ${isComplete ? 'opacity-100 text-amber-600 dark:text-amber-400' : 'opacity-0'}`}>
                {box.name} = {box.value}
              </div>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// SCENE 2: Types have shapes
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const [placedItems, setPlacedItems] = useState([]);
  const [shakeItemId, setShakeItemId] = useState(null);

  const items = [
    { id: 'i1', value: '42', type: 'int' },
    { id: 's1', value: '"hello"', type: 'str' },
    { id: 'f1', value: '3.14', type: 'float' },
    { id: 'b1', value: 'True', type: 'bool' },
    { id: 's2', value: '"CertPath"', type: 'str' },
    { id: 'i2', value: '0', type: 'int' },
    { id: 'b2', value: 'False', type: 'bool' },
    { id: 'f2', value: '99.9', type: 'float' }
  ];

  const types = [
    { id: 'int', label: 'int', desc: 'Whole numbers', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    { id: 'str', label: 'str', desc: 'Text in quotes', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    { id: 'float', label: 'float', desc: 'Decimal numbers', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { id: 'bool', label: 'bool', desc: 'True or False', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' }
  ];

  const handleDrop = (targetType, itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    if (item.type === targetType) {
      if (!placedItems.includes(itemId)) {
        setPlacedItems(prev => [...prev, itemId]);
      }
    } else {
      setShakeItemId(itemId);
      setTimeout(() => setShakeItemId(null), 500);
    }
  };

  useEffect(() => {
    if (placedItems.length === items.length) {
      onComplete(true);
    }
  }, [placedItems, items.length, onComplete]);

  const allDone = placedItems.length === items.length;

  return (
    <div className="w-full flex justify-center items-center flex-col gap-10">
      <div className="flex flex-wrap gap-4 justify-center max-w-2xl min-h-[50px]">
        {items.filter(i => !placedItems.includes(i.id)).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('itemId', item.id);
            }}
            className={`px-4 py-2 font-mono text-lg rounded-lg shadow-sm border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-800 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform ${shakeItemId === item.id ? 'animate-[shake_0.5s_ease-in-out] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200' : ''}`}
          >
            {item.value}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {types.map(t => {
          const slotItems = items.filter(i => i.type === t.id && placedItems.includes(i.id));
          const isFull = slotItems.length === items.filter(i => i.type === t.id).length;
          return (
            <div
              key={t.id}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(t.id, e.dataTransfer.getData('itemId'))}
              className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 min-h-[220px] ${
                isFull ? t.color.replace('bg-', 'border-').replace('border-', '') + ' bg-opacity-50 border-opacity-100 shadow-xl scale-105' : 'border-dashed border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900/40'
              }`}
            >
              <div className={`text-xl font-bold font-mono px-3 py-1 rounded ${t.color}`}>
                {t.label}
              </div>
              <div className="text-xs text-stone-500 uppercase tracking-widest">{t.desc}</div>
              
              <div className="flex-1 w-full flex flex-col gap-2 mt-4 items-center justify-center">
                {slotItems.map(item => (
                  <div key={item.id} className="font-mono text-sm bg-white/80 dark:bg-black/40 px-3 py-1.5 rounded w-full text-center shadow-sm">
                    {item.value}
                  </div>
                ))}
              </div>
              {isFull && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                  <CheckIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="fixed bottom-10 animate-fade-in bg-stone-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckIcon className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="font-bold">Types grouped perfectly!</div>
            <div className="text-sm opacity-80">You understand the basic building blocks.</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCENE 3: Watch the code run
// ============================================================================

const Scene3 = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const lines = [
    { id: 1, text: 'name = "Alex"', varName: 'name', varValue: '"Alex"', type: 'str', typeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 2, text: 'age = 21', varName: 'age', varValue: '21', type: 'int', typeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 3, text: 'gpa = 3.75', varName: 'gpa', varValue: '3.75', type: 'float', typeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 4, text: 'is_student = True', varName: 'is_student', varValue: 'True', type: 'bool', typeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  ];

  const handleStep = () => {
    if (step < lines.length) {
      setStep(s => s + 1);
    }
  };

  useEffect(() => {
    if (step === lines.length) {
      setTimeout(() => onComplete(true), 1000);
    }
  }, [step, lines.length, onComplete]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative">
      {/* Code Editor Side */}
      <div className="flex flex-col gap-4 relative">
        <div className="flex items-center justify-between px-4 py-2 bg-stone-100 dark:bg-stone-900 rounded-t-xl border border-b-0 border-stone-200 dark:border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="text-xs font-mono text-stone-500">main.py</div>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-b-xl p-6 font-mono text-sm leading-8 text-stone-300 shadow-2xl overflow-hidden relative">
          {lines.map((line, i) => (
            <div key={line.id} className={`relative flex items-center px-4 -mx-4 transition-colors duration-300 ${step === i + 1 ? 'bg-amber-500/20 text-amber-100' : 'text-stone-400'}`}>
              <span className="w-6 text-stone-600 select-none">{i + 1}</span>
              <span className={`transition-opacity duration-300`}>{line.text}</span>
              
              {step === i + 1 && (
                <div className="absolute right-0 w-4 h-4 text-amber-400 animate-pulse">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleStep}
          disabled={step === lines.length}
          className={`self-start mt-4 flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-300 ${
            step === lines.length 
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed hidden' 
              : 'bg-amber-500 hover:bg-amber-400 text-amber-950 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {step === 0 ? 'Run Code' : 'Step Next'} 
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>
        </button>
      </div>

      {/* Memory Area Side */}
      <div className="flex flex-col gap-4">
        <div className="text-sm font-mono text-stone-500 tracking-widest uppercase mb-2">Computer Memory</div>
        <div className="grid grid-cols-1 gap-4">
          {lines.map((line, i) => {
            const isVisible = step > i;
            const isJustAdded = step === i + 1;
            
            return (
              <div 
                key={line.id} 
                className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-700 transform ${
                  isVisible 
                    ? 'opacity-100 translate-x-0 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm' 
                    : 'opacity-0 translate-x-10 border-transparent bg-transparent'
                } ${isJustAdded ? 'ring-4 ring-amber-500/30' : ''}`}
              >
                {isVisible && (
                  <>
                    <div className="flex flex-col">
                      <span className="text-xs text-stone-400 font-mono mb-1">Variable Name</span>
                      <span className="font-mono text-stone-800 dark:text-stone-200">{line.varName}</span>
                    </div>
                    <div className="text-stone-300 dark:text-stone-600 font-mono">=</div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${line.typeColor}`}>
                        {line.type}
                      </span>
                      <span className="font-mono bg-stone-100 dark:bg-black/50 px-3 py-1 rounded text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-white/5">
                        {line.varValue}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: What breaks?
// ============================================================================

const Scene4 = ({ onComplete }) => {
  const [runState, setRunState] = useState('idle'); // idle, error, fixed, success
  const [selectedFix, setSelectedFix] = useState(null);

  const handleRun = () => {
    if (selectedFix === 'str(age)') {
      setRunState('success');
      setTimeout(() => onComplete(true), 1500);
    } else if (selectedFix !== null) {
      setRunState('error_again');
      setTimeout(() => setRunState('error'), 1000); // Reset to just error
    } else {
      setRunState('error');
    }
  };

  const codeDisplay = () => {
    if (runState === 'success') {
      return (
        <span className="text-stone-300">
          message = <span className="text-amber-300">"I am "</span> + <span className="text-amber-500 bg-amber-500/20 px-1 rounded">str(age)</span> + <span className="text-amber-300">" years old"</span>
        </span>
      );
    }
    
    if (selectedFix) {
      return (
        <span className="text-stone-300">
          message = <span className="text-amber-300">"I am "</span> + <span className="text-blue-300 bg-blue-500/20 px-1 rounded">{selectedFix}</span> + <span className="text-amber-300">" years old"</span>
        </span>
      );
    }

    return (
      <span className="text-stone-300">
        message = <span className="text-amber-300">"I am "</span> <span className={`transition-all duration-300 inline-block ${runState === 'error' ? 'text-red-400 font-bold scale-150 mx-1' : 'text-stone-400'}`}>+</span> <span className="text-blue-300">age</span> <span className={`transition-all duration-300 inline-block ${runState === 'error' ? 'text-red-400 font-bold scale-150 mx-1' : 'text-stone-400'}`}>+</span> <span className="text-amber-300">" years old"</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-6 font-mono text-sm leading-8 shadow-2xl relative pt-10">
        <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-stone-800 rounded-t-xl flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400 opacity-50"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400 opacity-50"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 opacity-50"></div>
        </div>

        <div className="text-stone-300 flex flex-col">
          <span>
            age = <span className="text-blue-300">25</span>
          </span>
          <div className="mt-2 relative">
            {codeDisplay()}
            
            {runState === 'error' && (
               <div className="absolute top-10 transform scale-0 animate-[pop_0.3s_forwards] left-10 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-3 z-10 w-96">
                 <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                 TypeError: can only concatenate str (not "int") to str
                 <div className="absolute -top-2 left-12 w-4 h-4 bg-red-100 border-l border-t border-red-300 rotate-45"></div>
               </div>
            )}
          </div>
        </div>
      </div>

      {(runState === 'idle' || runState === 'error') && (
        <button 
          onClick={handleRun}
          className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-medium px-8 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
        >
          Run Code
        </button>
      )}

      {runState === 'error' && (
        <div className="w-full animate-fade-in flex flex-col items-center gap-6 mt-4 p-6 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-200 dark:border-white/10">
          <div className="text-stone-600 dark:text-stone-300 text-sm">
            Python doesn't know how to glue a word (<span className="font-mono bg-stone-200 dark:bg-white/10 px-1 rounded">str</span>) to a number (<span className="font-mono bg-stone-200 dark:bg-white/10 px-1 rounded">int</span>). Pick the best fix:
          </div>
          <div className="flex gap-4">
            {['str(age)', 'int(age)', 'float(age)'].map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedFix(opt)}
                className={`px-6 py-2 rounded-lg font-mono text-sm border-2 transition-all ${
                  selectedFix === opt 
                    ? 'border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-900/30' 
                    : 'border-stone-200 hover:border-amber-300 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {selectedFix && (
            <button 
              onClick={handleRun}
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-medium px-8 py-2 rounded-full shadow-md transition-all animate-fade-in"
            >
              Test Fix
            </button>
          )}
        </div>
      )}

      {runState === 'success' && (
        <div className="w-full bg-green-950 border border-green-800 p-6 rounded-xl font-mono text-sm text-green-400 shadow-xl animate-fade-in flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="opacity-50 text-xs">Terminal Output</div>
          <div className="flex items-center gap-2">
            <span className="text-green-500 opacity-50">{'>'}</span> I am 25 years old
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-300 bg-green-900/50 w-fit px-4 py-2 rounded-lg">
            <CheckIcon className="w-4 h-4" /> Fixed!
          </div>
        </div>
      )}

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// SCENE 5: Student ID Card Generator
// ============================================================================

const Scene5 = ({ onComplete }) => {
  const [fields, setFields] = useState({
    student_name: null,
    student_id: null,
    department: null,
    gpa: null,
    is_active: null
  });

  const [availableValues, setAvailableValues] = useState([
    { id: 'v1', val: '"Kasia Nowak"', type: 'str', prop: 'student_name' },
    { id: 'v2', val: '20241589', type: 'int', prop: 'student_id' },
    { id: 'v3', val: '"Computer Science"', type: 'str', prop: 'department' },
    { id: 'v4', val: '3.82', type: 'float', prop: 'gpa' },
    { id: 'v5', val: 'True', type: 'bool', prop: 'is_active' }
  ]);

  const handleDrop = (prop, valId) => {
    const item = availableValues.find(v => v.id === valId);
    if (!item) return;

    if (item.prop === prop) {
      setFields(prev => ({ ...prev, [prop]: item }));
      setAvailableValues(prev => prev.filter(v => v.id !== valId));
    }
  };

  const isComplete = Object.values(fields).every(v => v !== null);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 1500);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      {/* Code Side */}
      <div className="flex flex-col gap-6">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 font-mono text-sm leading-10 shadow-xl">
          {Object.entries(fields).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-blue-300 w-32">{key}</span>
              <span className="text-stone-500">=</span>
              <div 
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(key, e.dataTransfer.getData('valId'))}
                className={`h-8 px-3 flex items-center rounded transition-all ${
                  value 
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50' 
                    : 'bg-stone-800 border border-stone-700 border-dashed text-stone-600 min-w-[100px]'
                }`}
              >
                {value ? value.val : '___'}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {availableValues.map(v => (
            <div
              key={v.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('valId', v.id)}
              className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-sm cursor-grab active:cursor-grabbing font-mono text-sm hover:-translate-y-1 transition-transform"
            >
              {v.val}
            </div>
          ))}
        </div>
      </div>

      {/* Visual ID Card Side */}
      <div className="flex justify-center perspective-[1000px]">
        <div className={`w-80 h-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-stone-200 transition-all duration-1000 transform ${isComplete ? 'scale-105 rotate-y-[-5deg] shadow-[30px_20px_40px_rgba(0,0,0,0.1)]' : 'shadow-md'}`}>
          {/* Card Header */}
          <div className="h-24 bg-gradient-to-br from-amber-500 to-red-500 p-6 flex items-end">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm">WSB Merito University</h3>
          </div>

          <div className="p-6 flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border-2 border-stone-200 shrink-0 overflow-hidden">
                {fields.student_name ? (
                   <svg className="w-10 h-10 text-stone-300 mt-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-stone-300 text-stone-300 flex items-center justify-center font-bold">?</div>
                )}
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className={`font-bold text-lg transition-all ${fields.student_name ? 'text-stone-800' : 'text-stone-300 bg-stone-100 h-6 w-3/4 animate-pulse'}`}>
                  {fields.student_name ? fields.student_name.val.replace(/"/g, '') : ''}
                </div>
                <div className={`text-xs uppercase tracking-wider transition-all mt-1 ${fields.department ? 'text-amber-600' : 'text-stone-300 bg-stone-100 h-4 w-1/2 animate-pulse'}`}>
                  {fields.department ? fields.department.val.replace(/"/g, '') : ''}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 w-full mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">ID Number</span>
                <span className={`font-mono text-sm transition-all ${fields.student_id ? 'text-stone-700' : 'text-stone-200'}`}>{fields.student_id ? fields.student_id.val : '........'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">GPA</span>
                <span className={`font-mono text-sm transition-all ${fields.gpa ? 'text-stone-700' : 'text-stone-200'}`}>{fields.gpa ? fields.gpa.val : '...'}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full transition-all ${fields.is_active ? 'bg-green-500' : 'bg-stone-200'}`}></div>
                  <span className={`text-xs uppercase font-bold transition-all ${fields.is_active ? 'text-green-600' : 'text-stone-300'}`}>
                    {fields.is_active ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Type badges overlay on hover */}
            {isComplete && (
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-6 font-mono text-xs z-10">
                 <div className="bg-amber-500/80 px-2 py-1 rounded">student_name : str</div>
                 <div className="bg-blue-500/80 px-2 py-1 rounded">student_id : int</div>
                 <div className="bg-amber-500/80 px-2 py-1 rounded">department : str</div>
                 <div className="bg-emerald-500/80 px-2 py-1 rounded">gpa : float</div>
                 <div className="bg-indigo-500/80 px-2 py-1 rounded">is_active : bool</div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Debug the registration form
// ============================================================================

const Scene6 = ({ onComplete }) => {
  const [bugs, setBugs] = useState({
    b1: { fixed: false, active: false },
    b2: { fixed: false, active: false },
    b3: { fixed: false, active: false }
  });

  const [runState, setRunState] = useState('idle');

  const allFixed = Object.values(bugs).every(b => b.fixed);

  const handleFix = (bugId, correct) => {
    if (correct) {
      setBugs(prev => ({ ...prev, [bugId]: { fixed: true, active: false } }));
    } else {
      // shake effect via class toggle could be added
      setBugs(prev => ({ ...prev, [bugId]: { ...prev[bugId], active: false } }));
    }
  };

  const handleRun = () => {
    if (allFixed) {
      setRunState('success');
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const toggleBug = (bugId) => {
    if (bugs[bugId].fixed) return;
    setBugs(prev => ({
      ...prev,
      b1: { ...prev.b1, active: bugId === 'b1' },
      b2: { ...prev.b2, active: bugId === 'b2' },
      b3: { ...prev.b3, active: bugId === 'b3' }
    }));
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-8 font-mono text-sm leading-10 shadow-2xl relative">
        <div className="text-stone-300 flex flex-col relative">
          
          <div className="flex items-center">
            <span className="w-32 text-blue-300">first_name</span> <span className="text-stone-500 mx-2">=</span>
            {bugs.b1.fixed ? (
              <span className="text-green-400 bg-green-900/30 px-2 rounded">"Tomek"</span>
            ) : (
              <div className="relative">
                <button onClick={() => toggleBug('b1')} className={`text-red-400 underline decoration-red-500/50 decoration-wavy underline-offset-4 hover:bg-red-500/10 px-1 rounded transition-colors ${bugs.b1.active ? 'bg-red-500/20 ring-2 ring-red-500/50' : ''}`}>
                  Tomek
                </button>
                {bugs.b1.active && (
                  <div className="absolute top-10 left-0 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-lg shadow-xl z-20 flex flex-col gap-2 min-w-[200px] animate-fade-in">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mb-1">Pick the fix:</div>
                    <button onClick={() => handleFix('b1', true)} className="text-left px-3 py-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 text-stone-700 dark:text-stone-200 rounded">"Tomek"</button>
                    <button onClick={() => handleFix('b1', false)} className="text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded">str(Tomek)</button>
                  </div>
                )}
              </div>
            )}
            {bugs.b1.fixed && <CheckIcon className="w-4 h-4 text-green-500 ml-2 animate-fade-in" />}
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">last_name</span> <span className="text-stone-500 mx-2">=</span>
            <span className="text-amber-300">"Kowalski"</span>
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">semester</span> <span className="text-stone-500 mx-2">=</span>
            {bugs.b2.fixed ? (
              <span className="text-green-400 bg-green-900/30 px-2 rounded">4</span>
            ) : (
              <div className="relative">
                <button onClick={() => toggleBug('b2')} className={`text-red-400 underline decoration-red-500/50 decoration-wavy underline-offset-4 hover:bg-red-500/10 px-1 rounded transition-colors ${bugs.b2.active ? 'bg-red-500/20 ring-2 ring-red-500/50' : ''}`}>
                  "4"
                </button>
                {bugs.b2.active && (
                  <div className="absolute top-10 left-0 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-lg shadow-xl z-20 flex flex-col gap-2 min-w-[200px] animate-fade-in">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mb-1">Semester should be a number:</div>
                    <button onClick={() => handleFix('b2', true)} className="text-left px-3 py-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 text-stone-700 dark:text-stone-200 rounded">4</button>
                    <button onClick={() => handleFix('b2', false)} className="text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded">int("4")</button>
                  </div>
                )}
              </div>
            )}
            {bugs.b2.fixed && <CheckIcon className="w-4 h-4 text-green-500 ml-2 animate-fade-in" />}
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">tuition_paid</span> <span className="text-stone-500 mx-2">=</span>
            {bugs.b3.fixed ? (
              <span className="text-green-400 bg-green-900/30 px-2 rounded">True</span>
            ) : (
              <div className="relative">
                <button onClick={() => toggleBug('b3')} className={`text-red-400 underline decoration-red-500/50 decoration-wavy underline-offset-4 hover:bg-red-500/10 px-1 rounded transition-colors ${bugs.b3.active ? 'bg-red-500/20 ring-2 ring-red-500/50' : ''}`}>
                  yes
                </button>
                {bugs.b3.active && (
                  <div className="absolute top-10 left-0 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-lg shadow-xl z-20 flex flex-col gap-2 min-w-[200px] animate-fade-in">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-sans mb-1">Booleans in Python:</div>
                    <button onClick={() => handleFix('b3', false)} className="text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded">true</button>
                    <button onClick={() => handleFix('b3', true)} className="text-left px-3 py-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 text-stone-700 dark:text-stone-200 rounded">True</button>
                  </div>
                )}
              </div>
            )}
            {bugs.b3.fixed && <CheckIcon className="w-4 h-4 text-green-500 ml-2 animate-fade-in" />}
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">email</span> <span className="text-stone-500 mx-2">=</span>
            <span className="text-stone-300">first_name <span className="text-stone-500">+</span> <span className="text-amber-300">"@merito.pl"</span></span>
          </div>

        </div>
      </div>

      <div className="h-24 w-full flex justify-center items-center">
        {allFixed && runState === 'idle' ? (
          <button 
            onClick={handleRun}
            className="animate-fade-in bg-amber-500 hover:bg-amber-400 text-amber-950 font-medium px-10 py-4 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 text-lg"
          >
            Run Form
          </button>
        ) : runState === 'success' ? (
          <div className="animate-fade-in w-full bg-green-950 border border-green-800 p-6 rounded-xl font-mono text-sm text-green-400 shadow-xl flex items-center justify-between">
            <div>
              <div className="opacity-50 text-xs mb-1">Terminal Output</div>
              <div>{'>'} Registered Tomek Kowalski</div>
              <div>{'>'} Email: Tomek@merito.pl</div>
            </div>
            <div className="flex items-center gap-2 bg-green-900/50 px-4 py-2 rounded-lg text-green-300 font-sans">
              <CheckIcon className="w-5 h-5" /> Module Complete!
            </div>
          </div>
        ) : (
          <div className="text-stone-400 dark:text-stone-500 italic text-sm animate-pulse">Find and click the 3 bugs to fix them...</div>
        )}
      </div>

    </div>
  );
};

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================

export default function VariablesDataTypesLesson() {
  const [activeScene, setActiveScene] = useState(1);
  const [sceneComplete, setSceneComplete] = useState(false);

  const nextScene = () => {
    if (activeScene < 6) {
      setActiveScene(prev => prev + 1);
      setSceneComplete(false);
    }
  };

  const getSceneTitle = () => {
    switch (activeScene) {
      case 1: return "1. Everything is a box";
      case 2: return "2. Types have shapes";
      case 3: return "3. Watch the code run";
      case 4: return "4. What breaks?";
      case 5: return "5. Real World: Student ID";
      case 6: return "6. Challenge: Debug the form";
      default: return "";
    }
  };

  const renderScene = () => {
    switch (activeScene) {
      case 1:
        return (
          <>
            <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg mb-12 text-lg">
              In Python, a variable is just a name you stick on a box to remember what's inside. Try making some pairs.
            </p>
            <Scene1 onComplete={setSceneComplete} />
          </>
        );
      case 2:
        return (
          <>
            <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg mb-12 text-lg">
              Not all values are the same. Python sees a difference between a number, a word, and a true/false answer. These are called data types.
            </p>
            <Scene2 onComplete={setSceneComplete} />
          </>
        );
      case 3:
        return (
          <>
            <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg mb-12 text-lg">
              Watch what happens in the computer's memory when we create variables. Step through the code.
            </p>
            <Scene3 onComplete={setSceneComplete} />
          </>
        );
      case 4:
        return (
          <>
            <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg mb-12 text-lg">
              Python cares about types. You can't just mash them together and hope for the best.
            </p>
            <Scene4 onComplete={setSceneComplete} />
          </>
        );
      case 5:
        return (
          <>
            <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg mb-12 text-lg">
              You're building a student ID card system for a university. Fill in the variables to generate the card.
            </p>
            <Scene5 onComplete={setSceneComplete} />
          </>
        );
      case 6:
        return (
          <>
            <p className="text-stone-500 dark:text-stone-400 text-center max-w-lg mb-12 text-lg">
              Final Challenge: Find and fix the 3 bugs in this registration form code.
            </p>
            <Scene6 onComplete={setSceneComplete} />
          </>
        );
      default:
        return <div className="text-stone-400">Loading scene...</div>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center font-sans">
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
        <div className="text-sm font-mono text-stone-500">Variables & Data Types</div>
      </div>
      
      <SceneContainer 
        title={getSceneTitle()} 
        nextEnabled={sceneComplete || process.env.NODE_ENV === 'development'} 
        onNext={nextScene}
        isLast={activeScene === 6}
      >
        <div className="w-full animate-fade-in duration-500 flex flex-col justify-center items-center">
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
