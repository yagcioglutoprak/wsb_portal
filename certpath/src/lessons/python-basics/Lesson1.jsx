import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRightIcon, CheckIcon } from '../../components/Icons';
import { sounds } from '../../hooks/useSound';

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

const DraggablePill = ({ id, label, type, onDragStart, dragging }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('id', id);
      e.dataTransfer.setData('type', type);
      e.dataTransfer.setData('label', label);
      onDragStart?.();
    }}
    className={`px-5 py-3 rounded-xl cursor-grab active:cursor-grabbing border-2 text-base shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
      dragging ? 'opacity-50 scale-95' : 'opacity-100'
    } ${
      type === 'name'
        ? 'bg-rust/5 border-rust/20 text-rust font-bold font-sans'
        : 'bg-[#fdfcfa] border-ink/10 text-ink font-mono'
    }`}
  >
    {label}
  </div>
);

// ============================================================================
// SCENE 1: Everything is a box (learn step 0)
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const PAIRS = { age: '22', name: '"Kasia"', city: '"Warsaw"' };

  const [boxes, setBoxes] = useState([
    { id: 1, name: null, value: null },
    { id: 2, name: null, value: null },
    { id: 3, name: null, value: null },
  ]);

  const [shakeBox, setShakeBox] = useState(null);
  const shakeTimerRef = useRef(null);
  const allNames = ['city', 'age', 'name'];
  const allValues = ['"Kasia"', '22', '"Warsaw"'];

  const usedNames = boxes.map(b => b.name).filter(Boolean);
  const usedValues = boxes.map(b => b.value).filter(Boolean);

  useEffect(() => () => clearTimeout(shakeTimerRef.current), []);

  useEffect(() => {
    const allFilled = boxes.every(b => b.name && b.value && PAIRS[b.name] === b.value);
    if (allFilled) { sounds.correct(); onComplete(); }
  }, [boxes, onComplete]);

  const triggerShake = (id) => {
    setShakeBox(id);
    shakeTimerRef.current = setTimeout(() => setShakeBox(null), 500);
  };

  const handleDrop = (boxId, e) => {
    e.preventDefault();
    const itemType = e.dataTransfer.getData('type');
    const itemContent = e.dataTransfer.getData('label');

    setBoxes(prev => {
      const currentUsedNames = prev.map(b => b.name).filter(Boolean);

      return prev.map(box => {
        if (box.id !== boxId) return box;

        if (itemType === 'name' && !box.name) {
          if (currentUsedNames.includes(itemContent)) return box;
          sounds.snap();
          return { ...box, name: itemContent };
        }

        if (itemType === 'value' && !box.value) {
          if (!box.name) { triggerShake(boxId); sounds.wrong(); return box; }
          if (PAIRS[box.name] !== itemContent) { triggerShake(boxId); sounds.wrong(); return box; }
          sounds.snap();
          return { ...box, value: itemContent };
        }

        return box;
      });
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-14">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        In Python, a variable is just a name you stick on a box to remember what's inside. Drag the names and values to make pairs.
      </p>

      <div className="flex gap-5 mb-2 flex-wrap justify-center">
        {allNames.filter(n => !usedNames.includes(n)).map(name => (
          <DraggablePill key={name} id={name} label={name} type="name" />
        ))}
        {allValues.filter(v => !usedValues.includes(v)).map(value => (
          <DraggablePill key={value} id={value} label={value} type="value" />
        ))}
      </div>

      <div className="flex gap-10 w-full justify-center flex-wrap">
        {boxes.map((box) => {
          const isComplete = box.name && box.value;
          return (
            <div
              key={box.id}
              className={`flex flex-col items-center gap-5 transition-all duration-500 ease-out transform ${shakeBox === box.id ? 'animate-[shake_0.5s_ease-in-out]' : ''} ${isComplete ? 'scale-105' : ''}`}
            >
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(box.id, e)}
                className={`relative w-52 h-52 rounded-[2rem] border-2 flex flex-col items-center justify-center gap-4 transition-all duration-500 cursor-default ${isComplete ? 'border-success bg-success/5 shadow-xl shadow-success/10' : 'border-dashed border-ink/20 bg-[#fdfcfa] hover:border-ink/30 hover:bg-ink/[0.02]'}`}
              >
                {/* Name display */}
                <div className={`w-4/5 h-12 rounded-xl flex items-center justify-center text-base font-mono transition-all ${box.name ? 'bg-rust/10 text-rust border-2 border-rust/20 font-bold' : 'bg-ink/[0.03] border-2 border-dashed border-ink/15 text-ink/30 font-medium'}`}>
                  {box.name || 'name'}
                </div>

                <div className="text-ink/40 font-mono text-2xl font-bold">=</div>

                {/* Value display */}
                <div className={`w-4/5 h-12 rounded-xl flex items-center justify-center text-base font-mono transition-all ${box.value ? 'bg-[#fdfcfa] border-2 border-ink/10 text-ink font-semibold shadow-sm' : 'bg-ink/[0.03] border-2 border-dashed border-ink/15 text-ink/30 font-medium'}`}>
                  {box.value || 'value'}
                </div>
              </div>

              <div className={`font-mono text-base font-bold transition-opacity duration-300 ${isComplete ? 'opacity-100 text-success' : 'opacity-0'}`}>
                {box.name} = {box.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 2: Types have shapes (learn step 1)
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const [placedItems, setPlacedItems] = useState([]);
  const [shakeItemId, setShakeItemId] = useState(null);
  const shakeTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(shakeTimerRef.current), []);

  const items = [
    { id: 'i1', value: '42', type: 'int' },
    { id: 's1', value: '"hello"', type: 'str' },
    { id: 'f1', value: '3.14', type: 'float' },
    { id: 'b1', value: 'True', type: 'bool' },
    { id: 's2', value: '"Clairy"', type: 'str' },
    { id: 'i2', value: '0', type: 'int' },
    { id: 'b2', value: 'False', type: 'bool' },
    { id: 'f2', value: '99.9', type: 'float' }
  ];

  const types = [
    { id: 'int', label: 'int', desc: 'Whole numbers', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'str', label: 'str', desc: 'Text in quotes', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'float', label: 'float', desc: 'Decimal numbers', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'bool', label: 'bool', desc: 'True or False', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
  ];

  const handleDrop = (targetType, itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (item.type === targetType) {
      if (!placedItems.includes(itemId)) {
        sounds.snap();
        setPlacedItems(prev => [...prev, itemId]);
      }
    } else {
      sounds.wrong();
      setShakeItemId(itemId);
      shakeTimerRef.current = setTimeout(() => setShakeItemId(null), 500);
    }
  };

  useEffect(() => {
    if (placedItems.length === items.length) {
      sounds.correct();
      onComplete();
    }
  }, [placedItems, items.length, onComplete]);

  return (
    <div className="w-full flex justify-center items-center flex-col gap-12">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Not all values are the same. Python sees a difference between a number, a word, and a true/false answer. Drag each value into the correct type.
      </p>

      <div className="flex flex-wrap gap-4 justify-center max-w-2xl min-h-[60px]">
        {items.filter(i => !placedItems.includes(i.id)).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('itemId', item.id);
            }}
            className={`px-5 py-3 font-mono text-lg rounded-xl shadow-sm border-2 border-ink/10 bg-[#fdfcfa] cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform ${shakeItemId === item.id ? 'animate-[shake_0.5s_ease-in-out] bg-red-50 text-red-600 border-red-200' : ''}`}
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
                isFull ? 'border-ink/20 bg-[#fdfcfa] shadow-xl scale-105' : 'border-dashed border-ink/15 bg-paper'
              }`}
            >
              <div className={`text-xl font-bold font-mono px-3 py-1 rounded ${t.color}`}>
                {t.label}
              </div>
              <div className="text-xs text-pencil uppercase tracking-widest">{t.desc}</div>

              <div className="flex-1 w-full flex flex-col gap-2 mt-4 items-center justify-center">
                {slotItems.map(item => (
                  <div key={item.id} className="font-mono text-sm bg-white/80 px-3 py-1.5 rounded w-full text-center shadow-sm border border-ink/8">
                    {item.value}
                  </div>
                ))}
              </div>
              {isFull && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                  <CheckIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3: Watch the code run (learn step 2)
// ============================================================================

const Scene3 = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const lines = [
    { id: 1, text: 'name = "Alex"', varName: 'name', varValue: '"Alex"', type: 'str', typeColor: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 2, text: 'age = 21', varName: 'age', varValue: '21', type: 'int', typeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 3, text: 'gpa = 3.75', varName: 'gpa', varValue: '3.75', type: 'float', typeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 4, text: 'is_student = True', varName: 'is_student', varValue: 'True', type: 'bool', typeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  ];

  const handleStep = () => {
    if (step < lines.length) {
      sounds.pop();
      setStep(s => s + 1);
    }
  };

  useEffect(() => {
    if (step === lines.length) {
      sounds.correct();
      const t = setTimeout(() => onComplete(), 1000);
      return () => clearTimeout(t);
    }
  }, [step, lines.length, onComplete]);

  return (
    <div className="w-full flex flex-col gap-10">
      <p className="text-ink/80 text-center max-w-2xl mx-auto text-xl leading-relaxed font-medium">
        Watch what happens in the computer's memory when we create variables. Step through the code.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative">
        {/* Code Editor Side */}
        <div className="flex flex-col gap-4 relative">
          <div className="flex items-center justify-between px-4 py-2 bg-ink/5 rounded-t-xl border border-b-0 border-ink/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs font-mono text-pencil">main.py</div>
          </div>
          <div className="bg-[#1e1e1e] border border-[#333] rounded-b-xl p-6 font-mono text-sm leading-8 text-gray-300 shadow-2xl overflow-hidden relative">
            {lines.map((line, i) => (
              <div key={line.id} className={`relative flex items-center px-4 -mx-4 transition-colors duration-300 ${step === i + 1 ? 'bg-blue-500/15 text-blue-100' : 'text-pencil'}`}>
                <span className="w-6 text-ink select-none">{i + 1}</span>
                <span>{line.text}</span>

                {step === i + 1 && (
                  <div className="absolute right-0 w-4 h-4 text-blue-400 animate-pulse">
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
                ? 'hidden'
                : 'bg-rust hover:bg-rust/90 text-white hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {step === 0 ? 'Run Code' : 'Step Next'}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>
          </button>
        </div>

        {/* Memory Area Side */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-mono text-pencil tracking-widest uppercase mb-2">Computer Memory</div>
          <div className="grid grid-cols-1 gap-4">
            {lines.map((line, i) => {
              const isVisible = step > i;
              const isJustAdded = step === i + 1;

              return (
                <div
                  key={line.id}
                  className={`relative flex items-center justify-between p-4 rounded-xl border-[1.5px] transition-all duration-700 transform ${
                    isVisible
                      ? 'opacity-100 translate-x-0 border-ink/12 bg-[#fdfcfa] shadow-[0_2px_0_0_rgba(0,0,0,0.06)]'
                      : 'opacity-0 translate-x-10 border-transparent bg-transparent'
                  } ${isJustAdded ? 'ring-4 ring-rust/30' : ''}`}
                >
                  {isVisible && (
                    <>
                      <div className="flex flex-col">
                        <span className="text-xs text-pencil font-mono mb-1">Variable Name</span>
                        <span className="font-mono text-ink">{line.varName}</span>
                      </div>
                      <div className="text-pencil font-mono">=</div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${line.typeColor}`}>
                          {line.type}
                        </span>
                        <span className="font-mono bg-paper px-3 py-1 rounded text-ink border border-ink/10">
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
    </div>
  );
};

// ============================================================================
// SCENE 4: What breaks? (learn step 3)
// ============================================================================

const Scene4 = ({ onComplete }) => {
  const [runState, setRunState] = useState('idle');
  const [selectedFix, setSelectedFix] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleRun = () => {
    if (selectedFix === 'str(age)') {
      sounds.correct();
      setRunState('success');
      timerRef.current = setTimeout(() => onComplete(), 1500);
    } else if (selectedFix !== null) {
      sounds.wrong();
      setShakeKey(k => k + 1);
    } else {
      setRunState('error');
    }
  };

  const codeDisplay = () => {
    if (runState === 'success') {
      return (
        <span className="text-gray-300">
          message = <span className="text-amber-300">"I am "</span> + <span className="text-amber-500 bg-amber-500/20 px-1 rounded">str(age)</span> + <span className="text-amber-300">" years old"</span>
        </span>
      );
    }

    if (selectedFix) {
      return (
        <span className="text-gray-300">
          message = <span className="text-amber-300">"I am "</span> + <span className="text-blue-300 bg-blue-500/20 px-1 rounded">{selectedFix}</span> + <span className="text-amber-300">" years old"</span>
        </span>
      );
    }

    return (
      <span className="text-gray-300">
        message = <span className="text-amber-300">"I am "</span> <span className={`transition-all duration-300 inline-block ${runState === 'error' ? 'text-red-400 font-bold scale-150 mx-1' : 'text-pencil'}`}>+</span> <span className="text-blue-300">age</span> <span className={`transition-all duration-300 inline-block ${runState === 'error' ? 'text-red-400 font-bold scale-150 mx-1' : 'text-pencil'}`}>+</span> <span className="text-amber-300">" years old"</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 items-center">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Python cares about types. You can't just mash them together and hope for the best.
      </p>

      <div className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl p-6 font-mono text-sm leading-8 shadow-2xl relative pt-10">
        <div className="absolute top-0 left-0 right-0 px-4 py-2 bg-[#2d2d2d] rounded-t-xl flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400 opacity-50"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400 opacity-50"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 opacity-50"></div>
        </div>

        <div className="text-gray-300 flex flex-col">
          <span>
            age = <span className="text-blue-300">25</span>
          </span>
          <div className="mt-2 relative">
            {codeDisplay()}

            {runState === 'error' && (
               <div className="absolute top-10 transform scale-0 animate-[pop_0.3s_forwards] left-0 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg shadow-xl text-xs flex items-center gap-3 z-10 max-w-[90vw] w-96">
                 <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                 TypeError: can only concatenate str (not "int") to str
                 <div className="absolute -top-2 left-12 w-4 h-4 bg-red-100 border-l border-t border-red-300 rotate-45"></div>
               </div>
            )}
          </div>
        </div>
      </div>

      {(runState === 'idle' || runState === 'error') && !selectedFix && (
        <button
          onClick={handleRun}
          className="bg-rust hover:bg-rust/90 text-white font-medium px-8 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
        >
          Run Code
        </button>
      )}

      {runState === 'error' && (
        <div className="w-full animate-fade-in flex flex-col items-center gap-6 mt-4 p-6 bg-paper rounded-2xl border-[1.5px] border-ink/12">
          <div className="text-pencil text-sm">
            Python doesn't know how to glue a word (<span className="font-mono bg-ink/5 px-1 rounded">str</span>) to a number (<span className="font-mono bg-ink/5 px-1 rounded">int</span>). Pick the best fix:
          </div>
          <div className="flex gap-4">
            {['str(age)', 'int(age)', 'float(age)'].map((opt) => (
              <button
                key={opt}
                onClick={() => { sounds.pop(); setSelectedFix(opt); }}
                className={`px-6 py-2 rounded-lg font-mono text-sm border-2 transition-all ${
                  selectedFix === opt
                    ? 'border-rust bg-rust/10 text-rust'
                    : 'border-ink/12 hover:border-rust/40 bg-[#fdfcfa] text-ink'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {selectedFix && (
            <div key={shakeKey} className={shakeKey > 0 ? 'animate-[shake_0.5s_ease-in-out]' : ''}>
              <button
                onClick={handleRun}
                className="bg-rust hover:bg-rust/90 text-white font-medium px-8 py-2 rounded-full shadow-md transition-all animate-fade-in"
              >
                Test Fix
              </button>
            </div>
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

    </div>
  );
};

// ============================================================================
// SCENE 5: Student ID Card Generator (apply step 0)
// ============================================================================

const Scene5 = ({ onComplete }) => {
  const [fields, setFields] = useState({
    student_name: null,
    student_id: null,
    department: null,
    gpa: null,
    is_active: null
  });

  const [overlayVisible, setOverlayVisible] = useState(false);

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
      sounds.snap();
      setFields(prev => ({ ...prev, [prop]: item }));
      setAvailableValues(prev => prev.filter(v => v.id !== valId));
    }
  };

  const isComplete = Object.values(fields).every(v => v !== null);

  useEffect(() => {
    if (isComplete) {
      sounds.correct();
      const t = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(t);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col gap-6">
      <p className="text-ink/80 text-center max-w-2xl mx-auto text-xl leading-relaxed font-medium">
        You're building a student ID card system for a university. Drag the values into the correct variable slots to generate the card.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Code Side */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-6 font-mono text-sm leading-10 shadow-xl">
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-blue-300 w-32">{key}</span>
                <span className="text-pencil">=</span>
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(key, e.dataTransfer.getData('valId'))}
                  className={`h-8 px-3 flex items-center rounded transition-all ${
                    value
                      ? 'bg-rust/20 text-orange-200 border border-rust/50'
                      : 'bg-[#2d2d2d] border border-[#444] border-dashed text-ink min-w-[100px]'
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
                className="px-4 py-2 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-lg shadow-[0_2px_0_0_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing font-mono text-sm hover:-translate-y-1 transition-transform"
              >
                {v.val}
              </div>
            ))}
          </div>
        </div>

        {/* Visual ID Card Side */}
        <div className="flex justify-center">
          <div className={`w-80 h-[420px] bg-[#fdfcfa] rounded-2xl shadow-2xl overflow-hidden relative border-[1.5px] border-ink/12 transition-all duration-1000 transform ${isComplete ? 'scale-105 shadow-[0_20px_60px_rgba(0,0,0,0.12)]' : 'shadow-md'}`}>
            {/* Card Header */}
            <div className="h-24 bg-gradient-to-br from-rust to-red-600 p-6 flex items-end">
              <h3 className="text-white font-bold tracking-widest uppercase text-sm">WSB Merito University</h3>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-paper flex items-center justify-center border-2 border-ink/10 shrink-0 overflow-hidden">
                  {fields.student_name ? (
                     <svg className="w-10 h-10 text-ink/20 mt-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-ink/20 text-ink/20 flex items-center justify-center font-bold">?</div>
                  )}
                </div>
                <div className="flex flex-col justify-center w-full">
                  <div className={`font-bold text-lg transition-all ${fields.student_name ? 'text-ink' : 'text-ink/15 bg-ink/5 h-6 w-3/4 animate-pulse rounded'}`}>
                    {fields.student_name ? fields.student_name.val.replace(/"/g, '') : ''}
                  </div>
                  <div className={`text-xs uppercase tracking-wider transition-all mt-1 ${fields.department ? 'text-rust' : 'text-ink/15 bg-ink/5 h-4 w-1/2 animate-pulse rounded'}`}>
                    {fields.department ? fields.department.val.replace(/"/g, '') : ''}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 w-full mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-pencil uppercase tracking-wider">ID Number</span>
                  <span className={`font-mono text-sm transition-all ${fields.student_id ? 'text-ink' : 'text-ink/15'}`}>{fields.student_id ? fields.student_id.val : '........'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-pencil uppercase tracking-wider">GPA</span>
                  <span className={`font-mono text-sm transition-all ${fields.gpa ? 'text-ink' : 'text-ink/15'}`}>{fields.gpa ? fields.gpa.val : '...'}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-pencil uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full transition-all ${fields.is_active ? 'bg-success' : 'bg-ink/10'}`}></div>
                    <span className={`text-xs uppercase font-bold transition-all ${fields.is_active ? 'text-success' : 'text-ink/20'}`}>
                      {fields.is_active ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {isComplete && (
                 <div
                   onClick={() => setOverlayVisible(v => !v)}
                   className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity flex flex-col items-center justify-center gap-2 text-white p-6 font-mono text-xs z-10 cursor-pointer ${overlayVisible ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
                 >
                   <div className="bg-rust/80 px-2 py-1 rounded">student_name : str</div>
                   <div className="bg-blue-500/80 px-2 py-1 rounded">student_id : int</div>
                   <div className="bg-rust/80 px-2 py-1 rounded">department : str</div>
                   <div className="bg-emerald-500/80 px-2 py-1 rounded">gpa : float</div>
                   <div className="bg-indigo-500/80 px-2 py-1 rounded">is_active : bool</div>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Debug the registration form (challenge step 0)
// ============================================================================

const Scene6 = ({ onComplete }) => {
  const [bugs, setBugs] = useState({
    b1: { fixed: false, active: false },
    b2: { fixed: false, active: false },
    b3: { fixed: false, active: false }
  });

  const [runState, setRunState] = useState('idle');
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const allFixed = Object.values(bugs).every(b => b.fixed);

  const handleFix = (bugId, correct) => {
    if (correct) {
      sounds.correct();
      setBugs(prev => ({ ...prev, [bugId]: { fixed: true, active: false } }));
    } else {
      sounds.wrong();
      setBugs(prev => ({ ...prev, [bugId]: { ...prev[bugId], active: false } }));
    }
  };

  const handleRun = () => {
    if (allFixed) {
      sounds.correct();
      setRunState('success');
      timerRef.current = setTimeout(() => onComplete(), 2000);
    }
  };

  const toggleBug = (bugId) => {
    if (bugs[bugId].fixed) return;
    sounds.pop();
    setBugs(prev => ({
      ...prev,
      b1: { ...prev.b1, active: bugId === 'b1' },
      b2: { ...prev.b2, active: bugId === 'b2' },
      b3: { ...prev.b3, active: bugId === 'b3' }
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 items-center">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Final challenge: this registration form has 3 bugs. Click on the highlighted parts to fix them.
      </p>

      <div className="w-full bg-[#1e1e1e] border border-[#333] rounded-xl p-8 font-mono text-sm leading-10 shadow-2xl relative">
        <div className="text-gray-300 flex flex-col relative">

          <div className="flex items-center">
            <span className="w-32 text-blue-300">first_name</span> <span className="text-pencil mx-2">=</span>
            {bugs.b1.fixed ? (
              <span className="text-green-400 bg-green-900/30 px-2 rounded">"Tomek"</span>
            ) : (
              <div className="relative">
                <button onClick={() => toggleBug('b1')} className={`text-red-400 underline decoration-red-500/50 decoration-wavy underline-offset-4 hover:bg-red-500/10 px-1 rounded transition-colors ${bugs.b1.active ? 'bg-red-500/20 ring-2 ring-red-500/50' : ''}`}>
                  Tomek
                </button>
                {bugs.b1.active && (
                  <div className="absolute top-10 left-0 bg-[#fdfcfa] border border-ink/12 p-3 rounded-lg shadow-xl z-20 flex flex-col gap-2 min-w-[200px] animate-fade-in">
                    <div className="text-xs text-pencil font-sans mb-1">Pick the fix:</div>
                    <button onClick={() => handleFix('b1', true)} className="text-left px-3 py-1.5 hover:bg-success/10 text-ink rounded">"Tomek"</button>
                    <button onClick={() => handleFix('b1', false)} className="text-left px-3 py-1.5 hover:bg-ink/5 text-ink rounded">str(Tomek)</button>
                  </div>
                )}
              </div>
            )}
            {bugs.b1.fixed && <CheckIcon className="w-4 h-4 text-success ml-2 animate-fade-in" />}
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">last_name</span> <span className="text-pencil mx-2">=</span>
            <span className="text-amber-300">"Kowalski"</span>
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">semester</span> <span className="text-pencil mx-2">=</span>
            {bugs.b2.fixed ? (
              <span className="text-green-400 bg-green-900/30 px-2 rounded">4</span>
            ) : (
              <div className="relative">
                <button onClick={() => toggleBug('b2')} className={`text-red-400 underline decoration-red-500/50 decoration-wavy underline-offset-4 hover:bg-red-500/10 px-1 rounded transition-colors ${bugs.b2.active ? 'bg-red-500/20 ring-2 ring-red-500/50' : ''}`}>
                  "4"
                </button>
                {bugs.b2.active && (
                  <div className="absolute top-10 left-0 bg-[#fdfcfa] border border-ink/12 p-3 rounded-lg shadow-xl z-20 flex flex-col gap-2 min-w-[200px] animate-fade-in">
                    <div className="text-xs text-pencil font-sans mb-1">Semester should be a number:</div>
                    <button onClick={() => handleFix('b2', true)} className="text-left px-3 py-1.5 hover:bg-success/10 text-ink rounded">4</button>
                    <button onClick={() => handleFix('b2', false)} className="text-left px-3 py-1.5 hover:bg-ink/5 text-ink rounded">int("4")</button>
                  </div>
                )}
              </div>
            )}
            {bugs.b2.fixed && <CheckIcon className="w-4 h-4 text-success ml-2 animate-fade-in" />}
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">tuition_paid</span> <span className="text-pencil mx-2">=</span>
            {bugs.b3.fixed ? (
              <span className="text-green-400 bg-green-900/30 px-2 rounded">True</span>
            ) : (
              <div className="relative">
                <button onClick={() => toggleBug('b3')} className={`text-red-400 underline decoration-red-500/50 decoration-wavy underline-offset-4 hover:bg-red-500/10 px-1 rounded transition-colors ${bugs.b3.active ? 'bg-red-500/20 ring-2 ring-red-500/50' : ''}`}>
                  yes
                </button>
                {bugs.b3.active && (
                  <div className="absolute top-10 left-0 bg-[#fdfcfa] border border-ink/12 p-3 rounded-lg shadow-xl z-20 flex flex-col gap-2 min-w-[200px] animate-fade-in">
                    <div className="text-xs text-pencil font-sans mb-1">Booleans in Python:</div>
                    <button onClick={() => handleFix('b3', false)} className="text-left px-3 py-1.5 hover:bg-ink/5 text-ink rounded">true</button>
                    <button onClick={() => handleFix('b3', true)} className="text-left px-3 py-1.5 hover:bg-success/10 text-ink rounded">True</button>
                  </div>
                )}
              </div>
            )}
            {bugs.b3.fixed && <CheckIcon className="w-4 h-4 text-success ml-2 animate-fade-in" />}
          </div>

          <div className="flex items-center">
            <span className="w-32 text-blue-300">email</span> <span className="text-pencil mx-2">=</span>
            <span className="text-gray-300">first_name <span className="text-pencil">+</span> <span className="text-amber-300">"@merito.pl"</span></span>
          </div>

        </div>
      </div>

      <div className="h-24 w-full flex justify-center items-center">
        {allFixed && runState === 'idle' ? (
          <button
            onClick={handleRun}
            className="animate-fade-in bg-rust hover:bg-rust/90 text-white font-medium px-10 py-4 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 text-lg"
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
          <div className="text-pencil italic text-sm animate-pulse">Find and click the 3 bugs to fix them...</div>
        )}
      </div>

    </div>
  );
};

// ============================================================================
// MAIN COMPONENT — accepts LessonViewer props
// ============================================================================

// Phase/step mapping:
// learn step 0 → Scene 1 (Everything is a box)
// learn step 1 → Scene 2 (Types have shapes)
// learn step 2 → Scene 3 (Watch the code run)
// learn step 3 → Scene 4 (What breaks?)
// apply step 0 → Scene 5 (Student ID Card Generator)
// challenge step 0 → Scene 6 (Debug the registration form)

export default function VariablesDataTypesLesson({ currentPhase, currentStep, onComplete }) {
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
