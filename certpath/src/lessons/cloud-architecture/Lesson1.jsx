import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckIcon } from '../../components/Icons';
import { sounds } from '../../hooks/useSound';

// ============================================================================
// SCENE 1: Your own server room (learn-0)
// ============================================================================
const Scene1 = ({ onComplete }) => {
  const [clicked, setClicked] = useState({
    rack: false,
    ac: false,
    power: false,
    staff: false,
  });

  const items = {
    rack: { label: 'Server Rack', cost: 50000, desc: 'Each rack holds multiple servers. You need to buy, install, and maintain them.', icon: '🖥️' },
    ac: { label: 'Air Conditioning', cost: 10000, desc: 'Servers generate heat. Without cooling, they overheat and crash.', icon: '❄️' },
    power: { label: 'Power Supply', cost: 15000, desc: 'You need redundant power. One outage = your website goes down.', icon: '⚡' },
    staff: { label: 'IT Person', cost: 80000, desc: 'You need staff 24/7 to monitor and fix problems.', icon: '👩‍💻' },
  };

  const totalCost = Object.entries(clicked).reduce((acc, [key, isClicked]) => {
    return acc + (isClicked ? items[key].cost : 0);
  }, 0);

  const isComplete = Object.values(clicked).every(Boolean);

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
        Before the cloud, if you wanted to run a website, you needed your own physical servers — in a room, with cooling, power, and someone to fix them when they break.
        <br/><span className="text-sm text-pencil mt-2 block">Click on each element to see the hidden costs.</span>
      </p>

      <div className="relative w-full max-w-3xl h-[400px] bg-paper border-2 border-ink/10 rounded-2xl overflow-x-hidden overflow-y-visible shadow-inner p-8 flex gap-8 justify-center items-end">
        
        {/* Cost Counter */}
        <div className="absolute top-6 right-6 bg-[#fdfcfa] border-2 border-ink/10 px-6 py-4 rounded-xl shadow-md flex flex-col items-end">
          <div className="text-sm font-bold text-pencil uppercase tracking-wider mb-1">Annual Cost</div>
          <div className={`font-mono text-3xl font-bold transition-colors duration-500 ${isComplete ? 'text-error' : 'text-ink'}`}>
            ${totalCost.toLocaleString()}
          </div>
          {isComplete && (
            <div className="text-error/80 text-xs mt-2 font-medium animate-fade-in">
              ~$155K/yr for a basic setup!
            </div>
          )}
        </div>

        {/* Elements */}
        {Object.entries(items).map(([key, item]) => (
          <div key={key} className="flex flex-col items-center gap-4 relative group">
            <button
              onClick={() => { sounds.pop(); setClicked(prev => ({ ...prev, [key]: true })); }}
              className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center text-4xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 ${
                clicked[key] ? 'bg-rust/5 border-rust/40 scale-105' : 'bg-[#fdfcfa] border-ink/10'
              }`}
            >
              <div className={clicked[key] ? 'animate-bounce' : ''}>{item.icon}</div>
              <div className="text-sm font-bold font-sans mt-2 text-ink">{item.label}</div>
            </button>
            
            {/* Tooltip */}
            <div className={`absolute bottom-full mb-4 w-48 bg-ink text-white text-xs p-3 rounded-lg shadow-xl transition-all duration-300 pointer-events-none ${
              clicked[key] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <div className="font-bold mb-1 text-rust-light">${item.cost.toLocaleString()}/yr</div>
              {item.desc}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 2: What if someone else handled it? (learn-1)
// ============================================================================
const Scene2 = ({ onComplete }) => {
  const [placedItems, setPlacedItems] = useState({});
  const [shakeId, setShakeId] = useState(null);
  const shakeTimerRef = useRef(null);

  const advantages = [
    { id: 'a1', text: 'Full control of hardware', target: 'own' },
    { id: 'a2', text: 'Data stays on-premises', target: 'own' },
    { id: 'a3', text: '2-minute setup', target: 'cloud' },
    { id: 'a4', text: '$0 upfront cost', target: 'cloud' },
    { id: 'a5', text: 'Pay per use', target: 'cloud' },
    { id: 'a6', text: 'Click a button to scale', target: 'cloud' },
  ];

  useEffect(() => {
    return () => clearTimeout(shakeTimerRef.current);
  }, []);

  const handleDrop = (targetColumn, e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const item = advantages.find(a => a.id === itemId);
    if (!item) return;

    if (item.target === targetColumn) {
      sounds.snap();
      setPlacedItems(prev => ({ ...prev, [itemId]: targetColumn }));
    } else {
      sounds.wrong();
      setShakeId(itemId);
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setShakeId(null), 500);
    }
  };

  const isComplete = Object.keys(placedItems).length === advantages.length;

  useEffect(() => {
    if (isComplete) {
      sounds.correct();
      const timer = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        Cloud computing means renting someone else's computers. They handle the hardware, power, cooling, and maintenance. You just use it.
        <br/><span className="text-sm text-pencil mt-2 block">Drag each characteristic to the correct model.</span>
      </p>

      {/* Unplaced Items */}
      <div className="flex flex-wrap gap-3 justify-center max-w-3xl min-h-[60px]">
        {advantages.filter(a => !placedItems[a.id]).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('itemId', item.id)}
            className={`px-4 py-2 font-medium text-sm rounded-xl shadow-[0_2px_0_0_rgba(0,0,0,0.06)] border-[1.5px] border-ink/12 bg-[#fdfcfa] cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-transform ${
              shakeId === item.id ? 'animate-[shake_0.5s_ease-in-out] bg-error/10 text-error border-error/30' : 'text-ink'
            }`}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Own Servers Column */}
        <div 
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop('own', e)}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 min-h-[300px] flex flex-col gap-4 ${
            Object.values(placedItems).filter(v => v === 'own').length === 2 
              ? 'border-ink/20 bg-[#fdfcfa] shadow-xl' 
              : 'border-dashed border-ink/15 bg-paper'
          }`}
        >
          <div className="text-center pb-4 border-b border-ink/10">
            <h3 className="text-xl font-bold text-ink">Own Servers</h3>
            <p className="text-xs text-pencil mt-1">Traditional On-Premises</p>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {advantages.filter(a => placedItems[a.id] === 'own').map(item => (
              <div key={item.id} className="p-3 bg-[#fdfcfa] border border-ink/10 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ink/30" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Cloud Column */}
        <div 
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop('cloud', e)}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 min-h-[300px] flex flex-col gap-4 ${
            Object.values(placedItems).filter(v => v === 'cloud').length === 4
              ? 'border-rust/40 bg-rust/5 shadow-xl shadow-rust/10 scale-105' 
              : 'border-dashed border-ink/15 bg-paper hover:bg-ink/[0.02]'
          }`}
        >
          <div className="text-center pb-4 border-b border-ink/10">
            <h3 className="text-xl font-bold text-rust">Cloud</h3>
            <p className="text-xs text-pencil mt-1">AWS, Azure, Google Cloud</p>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {advantages.filter(a => placedItems[a.id] === 'cloud').map(item => (
              <div key={item.id} className="p-3 bg-[#fdfcfa] border border-rust/20 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 text-rust-dark">
                <CheckIcon className="w-4 h-4 text-success" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3: The three layers: IaaS, PaaS, SaaS (learn-2)
// ============================================================================
const Scene3 = ({ onComplete }) => {
  const [placed, setPlaced] = useState({});
  const [shakeId, setShakeId] = useState(null);
  const shakeTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(shakeTimerRef.current);
  }, []);

  const examples = [
    { id: 'e1', label: 'AWS EC2 / Azure VMs', type: 'IaaS' },
    { id: 'e2', label: 'Heroku / App Engine', type: 'PaaS' },
    { id: 'e3', label: 'Gmail / Slack', type: 'SaaS' }
  ];

  const models = [
    { 
      id: 'IaaS', 
      name: 'IaaS', 
      desc: 'Infrastructure', 
      pizza: 'Buy ingredients, make at home',
      layers: [
        { name: 'Application', managed: false },
        { name: 'Data', managed: false },
        { name: 'Runtime', managed: false },
        { name: 'OS', managed: false },
        { name: 'Networking', managed: true },
        { name: 'Hardware', managed: true },
      ]
    },
    { 
      id: 'PaaS', 
      name: 'PaaS', 
      desc: 'Platform', 
      pizza: 'Take-and-bake pizza',
      layers: [
        { name: 'Application', managed: false },
        { name: 'Data', managed: false },
        { name: 'Runtime', managed: true },
        { name: 'OS', managed: true },
        { name: 'Networking', managed: true },
        { name: 'Hardware', managed: true },
      ]
    },
    { 
      id: 'SaaS', 
      name: 'SaaS', 
      desc: 'Software', 
      pizza: 'Delivery pizza',
      layers: [
        { name: 'Application', managed: true },
        { name: 'Data', managed: true },
        { name: 'Runtime', managed: true },
        { name: 'OS', managed: true },
        { name: 'Networking', managed: true },
        { name: 'Hardware', managed: true },
      ]
    }
  ];

  const handleDrop = (targetId, e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const item = examples.find(ex => ex.id === itemId);
    if (!item) return;

    if (item.type === targetId) {
      sounds.snap();
      setPlaced(prev => ({ ...prev, [itemId]: targetId }));
    } else {
      sounds.wrong();
      setShakeId(itemId);
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setShakeId(null), 500);
    }
  };

  const isComplete = Object.keys(placed).length === examples.length;

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
        Cloud services come in three flavors, depending on how much you want to manage yourself.
        <br/><span className="text-sm text-pencil mt-2 block">Drag the real-world examples to the correct model.</span>
      </p>

      {/* Draggable Examples */}
      <div className="flex gap-4 min-h-[50px]">
        {examples.filter(e => !placed[e.id]).map(ex => (
          <div
            key={ex.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('itemId', ex.id)}
            className={`px-5 py-3 rounded-xl bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] cursor-grab active:cursor-grabbing font-bold text-sm transition-all hover:-translate-y-1 ${
              shakeId === ex.id ? 'animate-[shake_0.5s_ease-in-out] bg-error/10 text-error border-error/30' : 'text-ink'
            }`}
          >
            {ex.label}
          </div>
        ))}
      </div>

      {/* 3 Columns */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
        {models.map(model => (
          <div 
            key={model.id}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(model.id, e)}
            className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${
              Object.values(placed).includes(model.id)
                ? 'border-rust/40 bg-rust/5 shadow-xl'
                : 'border-dashed border-ink/15 bg-paper'
            }`}
          >
            <h3 className="text-2xl font-bold text-ink">{model.name}</h3>
            <p className="text-sm font-medium text-pencil mb-2">{model.desc} as a Service</p>
            <p className="text-xs italic text-ink/60 text-center mb-6 h-8">"{model.pizza}"</p>

            {/* Stack */}
            <div className="flex flex-col w-full gap-1 mb-6">
              {model.layers.map((layer, i) => (
                <div 
                  key={i}
                  className={`py-2 px-3 text-center text-xs font-bold rounded ${
                    layer.managed 
                      ? 'bg-rust text-white shadow-sm' 
                      : 'bg-ink/10 text-ink/50'
                  }`}
                >
                  {layer.name} {layer.managed ? '(Provider)' : '(You)'}
                </div>
              ))}
            </div>

            {/* Drop Zone */}
            <div className="w-full flex-1 min-h-[60px] flex flex-col justify-end">
              {examples.filter(e => placed[e.id] === model.id).map(ex => (
                <div key={ex.id} className="w-full text-center py-3 bg-[#fdfcfa] rounded-xl border-[1.5px] border-success text-success font-bold shadow-md animate-fade-in flex items-center justify-center gap-2">
                  <CheckIcon className="w-4 h-4" /> {ex.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: Pay only for what you use (learn-3)
// ============================================================================
const Scene4 = ({ onComplete }) => {
  const [mode, setMode] = useState('fixed'); // 'fixed' | 'cloud'
  const [toggledBoth, setToggledBoth] = useState({ fixed: false, cloud: false });

  // Simulate a daily traffic curve (24 points)
  const trafficData = [
    10, 8, 5, 5, 10, 20, 40, 70, 90, 100, 95, 80, 
    85, 90, 85, 75, 60, 50, 60, 80, 70, 50, 30, 15
  ];

  const peakCapacity = 100;

  useEffect(() => {
    setToggledBoth(prev => ({ ...prev, [mode]: true }));
  }, [mode]);

  const isComplete = toggledBoth.fixed && toggledBoth.cloud;

  useEffect(() => {
    if (isComplete) {
      sounds.correct();
      const t = setTimeout(onComplete, 2000);
      return () => clearTimeout(t);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <p className="text-ink/80 text-center max-w-2xl text-xl leading-relaxed font-medium">
        The cloud's superpower is elastic pricing. Use more, pay more. Use less, pay less. Like electricity.
        <br/><span className="text-sm text-pencil mt-2 block">Toggle the pricing modes to see the difference in wasted cost.</span>
      </p>

      {/* Toggle */}
      <div className="flex bg-ink/5 p-1 rounded-xl">
        <button 
          onClick={() => { sounds.pop(); setMode('fixed'); }}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'fixed' ? 'bg-[#fdfcfa] shadow-sm text-ink' : 'text-ink/50 hover:text-ink/80'
          }`}
        >
          Fixed (Own Servers)
        </button>
        <button 
          onClick={() => { sounds.pop(); setMode('cloud'); }}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'cloud' ? 'bg-rust text-white shadow-sm' : 'text-ink/50 hover:text-ink/80'
          }`}
        >
          Cloud (Pay-per-use)
        </button>
      </div>

      {/* Chart */}
      <div className="w-full max-w-3xl bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-ink">Daily Website Traffic & Cost</h3>
          <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-ink/80 rounded" /> Usage Curve</div>
            {mode === 'fixed' && <div className="flex items-center gap-1"><div className="w-3 h-3 bg-error/30 rounded" /> Money Wasted</div>}
          </div>
        </div>

        <div className="flex items-end h-[300px] gap-1 relative border-l-2 border-b-2 border-ink/10 pl-2 pb-2">
          {/* Y Axis Label */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-pencil uppercase tracking-wider whitespace-nowrap">
            Capacity / Cost
          </div>

          {/* Fixed Cost Line */}
          {mode === 'fixed' && (
            <div className="absolute top-0 left-2 right-0 h-0 border-t-2 border-dashed border-error w-full z-10" style={{ top: `calc(100% - ${peakCapacity}%)` }}>
              <span className="absolute -top-6 right-0 text-xs font-bold text-error bg-error/10 px-2 py-1 rounded">Fixed Monthly Cost</span>
            </div>
          )}

          {/* Bars */}
          {trafficData.map((usage, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end items-center h-full relative group">
              {/* Wasted Cost Area (Fixed Mode) */}
              {mode === 'fixed' && (
                <div 
                  className="w-full bg-error/20 absolute bottom-0 transition-all duration-500"
                  style={{ height: `${peakCapacity}%` }}
                />
              )}

              {/* Usage Bar */}
              <div 
                className={`w-full transition-all duration-500 relative z-10 ${mode === 'cloud' ? 'bg-rust' : 'bg-ink/80'}`}
                style={{ height: `${usage}%` }}
              />

              {/* Time Label (every 6 hours) */}
              {i % 6 === 0 && (
                <div className="absolute -bottom-8 text-xs font-mono text-pencil">{i}:00</div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Choose the right cloud services (apply-0)
// ============================================================================
const Scene5 = ({ onComplete }) => {
  const [matched, setMatched] = useState({});
  const [shakeId, setShakeId] = useState(null);
  const shakeTimerRef = useRef(null);

  const requirements = [
    { id: 'r1', text: 'We need a server to run our API code', expectedType: 'compute' },
    { id: 'r2', text: 'We need to store user profile photos', expectedType: 'storage' },
    { id: 'r3', text: 'We need a database for user accounts', expectedType: 'database' },
  ];

  const services = [
    { id: 's1', name: 'Virtual Machine (EC2)', type: 'compute', icon: '💻' },
    { id: 's2', name: 'Object Storage (S3)', type: 'storage', icon: '🪣' },
    { id: 's3', name: 'Managed Database (RDS)', type: 'database', icon: '🗄️' },
    { id: 's4', name: 'Machine Learning API', type: 'distractor1', icon: '🧠' },
    { id: 's5', name: 'Blockchain Service', type: 'distractor2', icon: '⛓️' },
  ];

  useEffect(() => {
    return () => clearTimeout(shakeTimerRef.current);
  }, []);

  const handleDrop = (reqId, expectedType, e) => {
    e.preventDefault();
    const serviceId = e.dataTransfer.getData('serviceId');
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    if (service.type === expectedType) {
      sounds.snap();
      setMatched(prev => ({ ...prev, [reqId]: service }));
    } else {
      sounds.wrong();
      setShakeId(reqId);
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setShakeId(null), 500);
    }
  };

  const isComplete = Object.keys(matched).length === requirements.length;

  useEffect(() => {
    if (isComplete) {
      sounds.correct();
      const timer = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col gap-10">
      <p className="text-ink/80 text-center max-w-2xl mx-auto text-xl leading-relaxed font-medium">
        Your startup is building a mobile app. You need to choose which cloud services to use.
        <br/><span className="text-sm text-pencil mt-2 block">Match the requirement to the correct cloud service.</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto w-full">
        {/* Requirements (Drop Zones) */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-ink uppercase tracking-wider text-sm mb-2">Requirements</h3>
          {requirements.map(req => (
            <div 
              key={req.id}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(req.id, req.expectedType, e)}
              className={`p-5 rounded-xl border-2 flex flex-col gap-3 transition-all ${
                matched[req.id] 
                  ? 'border-success bg-success/5 shadow-sm' 
                  : shakeId === req.id 
                    ? 'border-error bg-error/10 animate-[shake_0.5s_ease-in-out]'
                    : 'border-dashed border-ink/20 bg-paper'
              }`}
            >
              <div className="font-medium text-ink">{req.text}</div>
              {matched[req.id] ? (
                <div className="flex items-center gap-2 text-success font-bold bg-[#fdfcfa] p-3 rounded-lg shadow-sm border border-success/20 animate-fade-in">
                  <CheckIcon className="w-5 h-5" />
                  <span className="text-xl">{matched[req.id].icon}</span>
                  {matched[req.id].name}
                </div>
              ) : (
                <div className="h-12 border-2 border-dashed border-ink/10 rounded-lg bg-white/50 flex items-center justify-center text-xs text-pencil font-bold uppercase tracking-widest">
                  Drop Service Here
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Services (Draggables) */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-ink uppercase tracking-wider text-sm mb-2">Cloud Services Catalog</h3>
          <div className="grid grid-cols-2 gap-3">
            {services.map(service => {
              const isUsed = Object.values(matched).some(m => m.id === service.id);
              if (isUsed) return null;
              
              return (
                <div
                  key={service.id}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('serviceId', service.id)}
                  className="bg-[#fdfcfa] border-[1.5px] border-ink/12 p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-md transition-all flex flex-col items-center gap-2 text-center"
                >
                  <span className="text-3xl">{service.icon}</span>
                  <span className="font-bold text-sm text-ink">{service.name}</span>
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
// SCENE 6: Challenge: Cloud or not? (challenge-0)
// ============================================================================
const Scene6 = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);

  const scenarios = [
    {
      text: "A bank's core transaction system processing millions per second.",
      options: ['Cloud', 'On-Premises', 'Hybrid'],
      correct: 'On-Premises',
      explanation: "Banks often keep core ledgers on-premises due to strict regulations, extreme latency requirements, and legacy mainframe systems. (Though hybrid is becoming more common!)"
    },
    {
      text: "A university's student portal used by 10,000 students, mostly during exams.",
      options: ['Cloud', 'On-Premises', 'Hybrid'],
      correct: 'Cloud',
      explanation: "Cloud is perfect here. Traffic is highly variable (huge spikes during exams, empty in summer). Cloud allows scaling up exactly when needed without buying idle servers."
    },
    {
      text: "A startup's MVP being tested with 100 beta users.",
      options: ['Cloud', 'On-Premises', 'Hybrid'],
      correct: 'Cloud',
      explanation: "Startups need speed and low upfront cost. Cloud lets them launch instantly with $0 capital expense and scale if the app goes viral."
    }
  ];

  const handleAnswer = (option) => {
    if (showExplanation) return;
    if (option === scenarios[currentScenario].correct) {
      sounds.correct();
    } else {
      sounds.wrong();
    }
    setAnswers(prev => ({ ...prev, [currentScenario]: option }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setShowExplanation(false);
    } else {
      onComplete();
    }
  };

  const isComplete = currentScenario === scenarios.length - 1 && showExplanation;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-ink">Final Challenge</h2>
        <div className="text-sm font-bold text-pencil uppercase tracking-wider">
          Scenario {currentScenario + 1} of {scenarios.length}
        </div>
      </div>

      <div className="w-full bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-2xl shadow-lg p-8 relative overflow-hidden min-h-[400px] flex flex-col">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-ink/5">
          <div 
            className="h-full bg-rust transition-all duration-500" 
            style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
          />
        </div>

        <div className="text-2xl font-medium text-ink leading-relaxed mb-10 mt-4">
          "{scenarios[currentScenario].text}"
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 flex-1">
          {scenarios[currentScenario].options.map(opt => {
            const isSelected = answers[currentScenario] === opt;
            const isCorrect = scenarios[currentScenario].correct === opt;
            const isWrong = isSelected && !isCorrect;
            
            let buttonClass = "border-ink/12 hover:border-rust hover:bg-rust/5 text-ink"; // Default
            if (showExplanation) {
              if (isCorrect) buttonClass = "border-success bg-success/10 text-success-dark ring-2 ring-success/50";
              else if (isWrong) buttonClass = "border-error bg-error/10 text-error opacity-50";
              else buttonClass = "border-ink/10 text-ink/40 opacity-50"; // Unselected
            }

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={showExplanation}
                className={`p-6 rounded-xl border-[1.5px] text-lg font-bold transition-all shadow-sm ${buttonClass}`}
              >
                {opt}
                {showExplanation && isCorrect && <CheckIcon className="w-6 h-6 mx-auto mt-2" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="animate-fade-in bg-paper p-6 rounded-xl border border-ink/10 flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="text-sm text-ink/80 leading-relaxed">
              <span className="font-bold text-ink block mb-1">
                {answers[currentScenario] === scenarios[currentScenario].correct ? '✅ Correct!' : '❌ Not quite.'}
              </span>
              {scenarios[currentScenario].explanation}
            </div>
            <button
              onClick={handleNext}
              className="bg-rust text-white px-8 py-3 rounded-xl font-bold whitespace-nowrap hover:bg-rust/90 transition-colors shadow-md"
            >
              {isComplete ? 'Finish Lesson' : 'Next Scenario'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function CloudBasicsLesson({ currentPhase, currentStep, onComplete }) {
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