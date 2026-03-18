import React, { useState, useEffect } from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

// ============================================================================
// UI COMPONENTS
// ============================================================================

const SceneContainer = ({ title, children, nextEnabled, onNext, isLast, hideNav }) => (
  <div className="flex flex-col w-full h-full min-h-[600px] border border-stone-200/50 dark:border-white/10 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-xl shadow-2xl transition-all duration-500">
    <div className="p-8 flex-1 flex flex-col relative w-full h-full">
      <h2 className="text-2xl font-light text-ink dark:text-paper tracking-tight mb-8">
        {title}
      </h2>
      <div className="flex-1 w-full flex flex-col justify-center items-center max-w-4xl mx-auto h-full min-h-[400px]">
        {children}
      </div>
    </div>
    {!hideNav && (
      <div className="border-t border-stone-100/50 dark:border-white/5 p-4 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
        <div className="text-sm text-pencil font-mono tracking-widest uppercase">
          Cloud • Basics
        </div>
        <button
          onClick={onNext}
          disabled={!nextEnabled}
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            nextEnabled
              ? 'bg-ink text-paper dark:bg-paper dark:text-ink hover:scale-105 active:scale-95 shadow-md'
              : 'bg-stone-200 text-pencil dark:bg-white/5 dark:text-white/20 cursor-not-allowed hidden'
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
// SCENE 1: Your own server room
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const [clickedElements, setClickedElements] = useState(new Set());
  
  const elements = [
    { id: 'server', label: 'Server rack', cost: 50000, desc: 'Each rack holds multiple servers. You need to buy, install, and maintain them.', pos: 'top-[30%] left-[20%]' },
    { id: 'cooling', label: 'Air conditioning', cost: 10000, desc: 'Servers generate heat. Without cooling, they overheat and crash.', pos: 'top-[20%] right-[30%]' },
    { id: 'power', label: 'Power supply', cost: 15000, desc: 'You need redundant power. One outage = your website goes down.', pos: 'bottom-[30%] left-[30%]' },
    { id: 'staff', label: 'IT person', cost: 80000, desc: 'You need staff 24/7 to monitor and fix problems.', pos: 'bottom-[20%] right-[20%]' }
  ];

  const handleElementClick = (id) => {
    setClickedElements(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const isComplete = clickedElements.size === elements.length;
  const currentCost = Array.from(clickedElements).reduce((acc, id) => {
    return acc + elements.find(e => e.id === id).cost;
  }, 0);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 2500);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center gap-8 animate-fade-in relative z-10 p-4">
      <p className="text-pencil text-center max-w-2xl text-lg mb-4">
        Before the cloud, if you wanted to run a website, you needed your own physical servers — in a room, with cooling, power, and someone to fix them when they break.
      </p>

      <div className="relative w-full max-w-3xl h-[400px] bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-8">
        {/* Cost Counter */}
        <div className={`absolute top-6 left-6 bg-paper dark:bg-ink p-4 rounded-xl shadow-lg border-2 transition-all duration-500 z-30 ${isComplete ? 'border-rust scale-110' : 'border-stone-200 dark:border-stone-700'}`}>
          <div className="text-xs uppercase tracking-widest text-pencil mb-1 font-bold">Total Annual Cost</div>
          <div className={`text-3xl font-mono font-bold transition-all duration-700 ${isComplete ? 'text-rust' : 'text-ink dark:text-paper'}`}>
            ${currentCost.toLocaleString()}
          </div>
          {isComplete && <div className="text-xs text-rust mt-2 animate-fade-in">Running your own servers is expensive!</div>}
        </div>

        {/* Server Room Environment */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-400 via-stone-200 to-transparent dark:from-stone-600 dark:via-stone-900 pointer-events-none"></div>

        {elements.map((el) => {
          const isClicked = clickedElements.has(el.id);
          return (
            <button
              key={el.id}
              onClick={() => handleElementClick(el.id)}
              className={`absolute ${el.pos} group flex flex-col items-center gap-3 z-20 transition-transform duration-300 hover:scale-110 focus:outline-none`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 border-2 ${isClicked ? 'bg-rust border-rust shadow-rust/30' : 'bg-paper dark:bg-ink border-stone-300 dark:border-stone-600 animate-pulse'}`}>
                {isClicked ? <CheckIcon className="w-8 h-8 text-white" /> : <div className="w-4 h-4 rounded-full bg-rust animate-ping"></div>}
              </div>
              
              <div className={`absolute top-full mt-4 w-48 bg-paper dark:bg-ink p-3 rounded-xl text-sm border border-stone-200 dark:border-stone-700 shadow-xl transition-all duration-300 ${isClicked ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="font-bold text-ink dark:text-paper">{el.label}</div>
                <div className="text-pencil text-xs mt-1 leading-relaxed">{el.desc}</div>
                <div className="text-rust font-mono text-xs mt-2 font-bold">+${el.cost.toLocaleString()}/yr</div>
              </div>
            </button>
          );
        })}

        {isComplete && (
          <div className="absolute bottom-6 right-6 bg-success text-white px-4 py-2 rounded-lg font-bold shadow-lg animate-fade-in">
            Basic setup: ~$155K per year
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 2: What if someone else handled it?
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const [placedItems, setPlacedItems] = useState({});
  const items = [
    { id: 'setup', label: '2-6 weeks setup', type: 'own' },
    { id: 'setupCloud', label: '2 minutes setup', type: 'cloud' },
    { id: 'costUp', label: '$50,000+ upfront', type: 'own' },
    { id: 'costZero', label: '$0 upfront', type: 'cloud' },
    { id: 'costMonth', label: '~$13K fixed/mo', type: 'own' },
    { id: 'payUse', label: 'Pay per use', type: 'cloud' },
    { id: 'scaleOwn', label: 'Buy more hardware', type: 'own' },
    { id: 'scaleCloud', label: 'Click a button to scale', type: 'cloud' }
  ];

  const handleDrop = (columnId, itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.type === columnId) {
      setPlacedItems(prev => ({ ...prev, [itemId]: columnId }));
    }
  };

  const isComplete = Object.keys(placedItems).length === items.length;

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 2000);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex justify-center flex-col items-center gap-8 animate-fade-in">
      <p className="text-pencil text-center max-w-2xl text-lg mb-2">
        Cloud computing means renting someone else's computers. They handle the hardware, power, cooling, and maintenance. You just use it.
      </p>

      <div className="flex gap-4 mb-4 flex-wrap justify-center min-h-[60px]">
        {items.filter(i => !placedItems[i.id]).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('itemId', item.id)}
            className="px-4 py-2 bg-paper dark:bg-ink border-2 border-stone-200 dark:border-stone-700 rounded-lg shadow-sm cursor-grab active:cursor-grabbing text-sm font-semibold transition-transform hover:-translate-y-1 text-ink dark:text-paper"
          >
            {item.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        {['own', 'cloud'].map(col => (
          <div 
            key={col}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(col, e.dataTransfer.getData('itemId'))}
            className={`flex flex-col border-2 rounded-2xl p-6 min-h-[300px] transition-colors duration-300 ${col === 'own' ? 'bg-stone-50 border-stone-200 dark:bg-stone-900/40 dark:border-stone-800' : 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50'}`}
          >
            <h3 className="text-xl font-bold mb-6 text-center text-ink dark:text-paper uppercase tracking-wider">
              {col === 'own' ? 'Own Servers' : 'The Cloud'}
            </h3>
            <div className="flex flex-col gap-3 flex-1">
              {items.filter(i => placedItems[i.id] === col).map(item => (
                <div key={item.id} className={`px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-sm ${col === 'own' ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'}`}>
                  <CheckIcon className="w-4 h-4" /> {item.label}
                </div>
              ))}
              {!isComplete && Object.keys(placedItems).length < items.length && (
                <div className="flex-1 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg flex items-center justify-center text-pencil text-sm">
                  Drag attributes here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3: The three layers: IaaS, PaaS, SaaS
// ============================================================================

const Scene3 = ({ onComplete }) => {
  const [placed, setPlaced] = useState({ iaas: null, paas: null, saas: null });
  const tasks = [
    { id: 'aws', label: 'AWS EC2 / Azure VMs', type: 'iaas' },
    { id: 'heroku', label: 'Heroku / App Engine', type: 'paas' },
    { id: 'gmail', label: 'Gmail / Slack', type: 'saas' }
  ];

  const handleDrop = (col, itemId) => {
    const item = tasks.find(t => t.id === itemId);
    if (item && item.type === col) {
      setPlaced(prev => ({ ...prev, [col]: item }));
    }
  };

  const isComplete = placed.iaas && placed.paas && placed.saas;

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 2500);
    }
  }, [isComplete, onComplete]);

  const layers = ['Data', 'Application', 'Runtime', 'OS', 'Networking', 'Hardware'];

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
      <p className="text-pencil text-center max-w-2xl text-lg mb-2">
        Cloud services come in three flavors, depending on how much you want to manage yourself.
      </p>

      <div className="flex gap-4 justify-center min-h-[50px] mb-4">
        {tasks.filter(t => Object.values(placed).every(p => p?.id !== t.id)).map(task => (
           <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('itemId', task.id)}
            className="px-6 py-3 bg-ink text-paper dark:bg-paper dark:text-ink font-bold rounded-lg shadow-xl cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
          >
            {task.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { id: 'iaas', title: 'IaaS', subtitle: 'Infrastructure', managed: 2 },
          { id: 'paas', title: 'PaaS', subtitle: 'Platform', managed: 4 },
          { id: 'saas', title: 'SaaS', subtitle: 'Software', managed: 6 }
        ].map(col => (
          <div 
            key={col.id} 
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(col.id, e.dataTransfer.getData('itemId'))}
            className="flex flex-col h-full bg-stone-50 dark:bg-stone-900/30 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden relative"
          >
            <div className="p-4 text-center border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80">
              <div className="text-2xl font-bold text-ink dark:text-paper">{col.title}</div>
              <div className="text-xs uppercase tracking-widest text-pencil mt-1">{col.subtitle}</div>
            </div>
            
            <div className="p-6 flex flex-col gap-2 flex-grow">
              {layers.map((layer, idx) => {
                const isManaged = layers.length - idx <= col.managed;
                return (
                  <div key={layer} className={`py-2 px-4 rounded font-mono text-sm text-center transition-colors ${isManaged ? 'bg-rust/20 text-rust dark:bg-rust/30 border border-rust/30' : 'bg-stone-200 dark:bg-stone-800 text-stone-500 border border-transparent'}`}>
                    {layer} {isManaged ? '(Provider)' : '(You)'}
                  </div>
                )
              })}
            </div>

            <div className={`p-4 border-t-2 border-dashed ${placed[col.id] ? 'bg-success/10 border-success/30' : 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50'} min-h-[80px] flex items-center justify-center transition-colors`}>
              {placed[col.id] ? (
                <div className="font-bold text-success flex items-center gap-2 animate-fade-in"><CheckIcon className="w-5 h-5" /> {placed[col.id].label}</div>
              ) : (
                <span className="text-pencil text-sm flex items-center justify-center text-center">Drag matching<br/>example here</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: Pay only for what you use
// ============================================================================

const Scene4 = ({ onComplete }) => {
  const [mode, setMode] = useState('cloud'); // 'fixed' or 'cloud'
  const [time, setTime] = useState(12);
  const [hasToggled, setHasToggled] = useState(false);

  // Example usage curve over 24 hours
  const getUsage = (h) => {
    return Math.max(10, 80 * Math.exp(-0.5 * Math.pow((h - 14) / 3, 2)) + 30 * Math.exp(-0.5 * Math.pow((h - 8) / 2, 2)));
  };

  const peakUsage = 85; 

  const currentUsage = getUsage(time);

  useEffect(() => {
    if (hasToggled) {
      const t = setTimeout(() => onComplete(true), 3000);
      return () => clearTimeout(t);
    }
  }, [hasToggled, onComplete]);

  return (
    <div className="w-full flex flex-col items-center gap-12 animate-fade-in">
      <p className="text-pencil text-center max-w-2xl text-lg mb-2">
        The cloud's superpower is elastic pricing. Use more, pay more. Use less, pay less. Like electricity.
      </p>

      <div className="w-full max-w-3xl flex flex-col bg-paper dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-2xl shadow-xl relative">
        
        <div className="flex justify-center mb-8">
          <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex gap-1 border border-stone-200 dark:border-stone-700">
            <button 
              onClick={() => { setMode('fixed'); setHasToggled(true); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'fixed' ? 'bg-white dark:bg-stone-700 text-error shadow border border-stone-200 dark:border-stone-600' : 'text-pencil hover:text-ink dark:hover:text-paper'}`}
            >
              Fixed Setup (Own Servers)
            </button>
            <button 
              onClick={() => { setMode('cloud'); setHasToggled(true); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'cloud' ? 'bg-white dark:bg-stone-700 text-rust shadow border border-stone-200 dark:border-stone-600' : 'text-pencil hover:text-ink dark:hover:text-paper'}`}
            >
              Cloud (Pay per use)
            </button>
          </div>
        </div>

        <div className="relative w-full h-64 border-l-2 border-b-2 border-stone-300 dark:border-stone-700 mx-auto px-4 mt-4">
          <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-pencil font-mono">
            <span>Peak</span>
            <span>Med</span>
            <span>Low</span>
          </div>

          {/* Usage Curve Area */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 24 100">
            {/* Wasted Area for Fixed */}
            {mode === 'fixed' && (
              <path 
                d={`M 0 ${100 - peakUsage} L 24 ${100 - peakUsage} L 24 100 L 0 100 Z`}
                fill="currentColor"
                className="text-error/10 animate-fade-in"
              />
            )}
            
            {/* Base Usage Area */}
            <path 
              d={`M 0 100 ` + Array.from({length: 25}).map((_, i) => `L ${i} ${100 - getUsage(i)}`).join(' ') + ` L 24 100 Z`}
              fill="currentColor"
              className="text-blue-500/20"
            />
            {/* Usage Line */}
            <path 
              d={Array.from({length: 25}).map((_, i) => `${i === 0 ? 'M' : 'L'} ${i} ${100 - getUsage(i)}`).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-blue-500"
            />

            {/* Cost Line */}
            {mode === 'fixed' ? (
              <line x1="0" y1={100 - peakUsage} x2="24" y2={100 - peakUsage} stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" className="text-error animate-fade-in" />
            ) : (
              <path 
                d={Array.from({length: 25}).map((_, i) => `${i === 0 ? 'M' : 'L'} ${i} ${100 - getUsage(i)}`).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="4 4"
                className="text-rust animate-fade-in"
              />
            )}

            {/* Current Time Indicator */}
            <line x1={time} y1="0" x2={time} y2="100" stroke="currentColor" strokeWidth="2" className="text-pencil" />
            <circle cx={time} cy={100 - currentUsage} r="4" className="fill-blue-500" />
            {mode === 'fixed' && <circle cx={time} cy={100 - peakUsage} r="4" className="fill-error" />}
          </svg>
        </div>

        <div className="flex flex-col mt-8">
          <input 
            type="range" min="0" max="24" value={time} 
            onChange={e => setTime(parseInt(e.target.value))}
            className="w-full accent-rust h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between w-full text-xs text-pencil font-mono mt-2 uppercase tracking-widest">
            <span>Midnight</span>
            <span>Noon ({time}:00)</span>
            <span>Midnight</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          {mode === 'fixed' ? (
            <div className="text-center animate-fade-in">
              <span className="text-error font-bold text-xl block mb-2">Money Wasted</span>
              <span className="text-sm text-pencil">You pay for peak capacity even when traffic is low.</span>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <span className="text-rust font-bold text-xl block mb-2">Zero Waste</span>
              <span className="text-sm text-pencil">The cost curve follows usage exactly. Pay only for what you use.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Choose the right cloud services
// ============================================================================

const Scene5 = ({ onComplete }) => {
  const [matched, setMatched] = useState({});
  const reqs = [
    { id: 'r1', text: "We need a server to run our API", target: 'compute', tip: "EC2 or VM instances provide raw compute." },
    { id: 'r2', text: "We need to store user profile photos", target: 'storage', tip: "S3 or Blob Storage is perfect for files." },
    { id: 'r3', text: "We need a database for user data", target: 'database', tip: "RDS or Cloud SQL manages the DB for you." },
    { id: 'r4', text: "We need to send push notifications", target: 'notify', tip: "SNS or Firebase handles messaging." },
    { id: 'r5', text: "We need a domain name with HTTPS", target: 'dns', tip: "Route 53 + CloudFront routes and delivers content." }
  ];

  const services = [
    { id: 'compute', label: 'Compute (EC2/VM)' },
    { id: 'storage', label: 'Object Storage (S3)' },
    { id: 'database', label: 'Managed DB (RDS)' },
    { id: 'notify', label: 'Notification Service' },
    { id: 'dns', label: 'DNS + CDN' },
    { id: 'ml', label: 'Machine Learning API', distractor: true },
    { id: 'iot', label: 'IoT Hub', distractor: true },
    { id: 'blockchain', label: 'Blockchain Service', distractor: true }
  ];

  const handleDrop = (reqId, serviceId) => {
    const req = reqs.find(r => r.id === reqId);
    if (req && req.target === serviceId) {
      setMatched(prev => ({ ...prev, [reqId]: serviceId }));
    }
  };

  const isComplete = Object.keys(matched).length === reqs.length;

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 2500);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in relative max-w-6xl mx-auto px-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-ink dark:text-paper mb-2">Startup Architecture</h3>
        <p className="text-pencil text-sm max-w-2xl mx-auto">
          Your startup is building a mobile app for university students. Match each requirement on the left with the correct cloud service on the right.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {services.filter(s => !Object.values(matched).includes(s.id)).map(service => (
          <div
            key={service.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('serviceId', service.id)}
            className="px-4 py-2 bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl shadow-sm cursor-grab active:cursor-grabbing text-sm font-bold text-ink dark:text-paper hover:border-rust transition-colors hover:-translate-y-1 transform"
          >
            {service.label}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {reqs.map(req => {
          const isMatched = !!matched[req.id];
          const service = isMatched ? services.find(s => s.id === matched[req.id]) : null;
          
          return (
            <div 
              key={req.id}
              className={`flex items-center gap-6 p-4 rounded-xl border-2 transition-all duration-300 ${isMatched ? 'border-success bg-success/10' : 'border-stone-200 dark:border-stone-800 bg-paper dark:bg-stone-900'}`}
            >
              <div className="flex-1 text-ink dark:text-paper font-medium">
                {req.text}
              </div>
              <div 
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(req.id, e.dataTransfer.getData('serviceId'))}
                className={`w-64 h-12 rounded-lg flex items-center justify-center border-2 border-dashed transition-all ${isMatched ? 'border-success bg-success/20 py-2 text-success font-bold shrink-0 shadow-inner' : 'border-stone-300 dark:border-stone-600'}`}
              >
                {isMatched ? (
                  <span className="flex items-center gap-2"><CheckIcon className="w-5 h-5" /> {service.label}</span>
                ) : (
                  <span className="text-xs text-pencil uppercase tracking-widest font-bold">Drop Here</span>
                )}
              </div>
              {isMatched && (
                <div className="flex-1 text-sm text-pencil animate-fade-in pl-4 border-l border-success/30">
                  {req.tip}
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
// SCENE 6: Challenge: Cloud or not?
// ============================================================================

const Scene6 = ({ onComplete }) => {
  const questions = [
    { q: "A bank's core transaction system processing millions per second", answer: "hybrid", tip: "On-premises or Hybrid due to strict regulation and ultra-low latency requirements." },
    { q: "A university's student portal used by 10,000 students", answer: "cloud", tip: "Cloud. Variable traffic (high during exams) makes elastic scaling cost-effective." },
    { q: "A government's highly classified document storage", answer: "onprem", tip: "On-premises. Security requirements mandate total physical control." },
    { q: "A startup's MVP being tested with 100 beta users", answer: "cloud", tip: "Cloud. Need speed and very low upfront cost." },
    { q: "A hospital's patient records system", answer: "hybrid", tip: "Hybrid. Data regulations demand private storage, but modern tools benefit from cloud services." },
    { q: "A seasonal e-commerce site with Black Friday spikes", answer: "cloud", tip: "Cloud. Perfect for dramatic elastic scaling." }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  const currentQ = questions[currentIndex];
  
  const handleAnswer = (ans) => {
    if (answered) return;
    setSelected(ans);
    setAnswered(true);
    if (ans === currentQ.answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setAnswered(false);
      setSelected(null);
    } else {
      onComplete(true);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-8 items-center">
      <div className="flex justify-between items-center w-full mb-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <h3 className="text-xl font-bold text-ink dark:text-paper uppercase tracking-widest text-sm">Challenge {currentIndex + 1} of {questions.length}</h3>
        <div className="text-rust font-mono text-xl font-bold">{score} / {questions.length} Points</div>
      </div>

      <div className="w-full bg-paper dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 shadow-2xl relative min-h-[350px] flex flex-col">
        <div className="text-2xl font-medium text-ink dark:text-paper mb-12 text-center flex-1 flex items-center justify-center">
          "{currentQ.q}"
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { id: 'cloud', label: 'Cloud' },
            { id: 'onprem', label: 'On-premises' },
            { id: 'hybrid', label: 'Hybrid' }
          ].map(opt => (
             <button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              disabled={answered}
              className={`p-4 rounded-xl font-bold text-lg transition-all border-2 ${
                !answered 
                  ? 'bg-stone-50 border-stone-200 text-stone-700 hover:border-rust dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 dark:hover:border-rust hover:-translate-y-1' 
                  : selected === opt.id 
                    ? (opt.id === currentQ.answer ? 'bg-success text-white border-success' : 'bg-error text-white border-error')
                    : (opt.id === currentQ.answer ? 'bg-success/20 text-success border-success' : 'bg-stone-100 text-stone-400 border-stone-100 dark:bg-stone-800/50 dark:border-stone-800 opacity-50')
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {answered && (
          <div className={`p-6 rounded-xl animate-fade-in text-center ${selected === currentQ.answer ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
            <div className="font-bold mb-2 flex justify-center items-center gap-2">
              {selected === currentQ.answer ? <><CheckIcon className="w-6 h-6"/> Correct!</> : 'Not quite.'}
            </div>
            <p className="text-ink dark:text-paper">{currentQ.tip}</p>
            <button 
              onClick={nextQuestion}
              className="mt-6 px-8 py-3 bg-ink text-paper dark:bg-paper dark:text-ink rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
            >
              {currentIndex < questions.length - 1 ? 'Next Scenario' : 'Finish Challenge'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN LESSON COMPONENT
// ============================================================================

export default function CloudBasicsLesson({ currentPhase, currentStep, onComplete }) {
  const [sceneComplete, setSceneComplete] = useState(false);

  useEffect(() => {
    setSceneComplete(false);
  }, [currentPhase, currentStep]);

  const handleNext = () => {
    if (sceneComplete) {
      onComplete();
    }
  };

  const renderScene = () => {
    if (currentPhase === 'learn') {
      if (currentStep === 1) return <Scene1 onComplete={setSceneComplete} />;
      if (currentStep === 2) return <Scene2 onComplete={setSceneComplete} />;
      if (currentStep === 3) return <Scene3 onComplete={setSceneComplete} />;
      if (currentStep === 4) return <Scene4 onComplete={setSceneComplete} />;
    } else if (currentPhase === 'apply' && currentStep === 1) {
      return <Scene5 onComplete={setSceneComplete} />;
    } else if (currentPhase === 'challenge' && currentStep === 1) {
      return <Scene6 onComplete={setSceneComplete} />;
    }
    return <div>Scene not found</div>;
  };

  const getTitle = () => {
    if (currentPhase === 'learn') {
      if (currentStep === 1) return 'Your own server room';
      if (currentStep === 2) return 'What if someone else handled it?';
      if (currentStep === 3) return 'The three layers: IaaS, PaaS, SaaS';
      if (currentStep === 4) return 'Pay only for what you use';
    } else if (currentPhase === 'apply') {
      return 'Real World: Architecture';
    } else if (currentPhase === 'challenge') {
      return 'Final Challenge';
    }
    return '';
  };

  const isLast = currentPhase === 'challenge' && currentStep === 1;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 h-full min-h-screen font-sans">
      <SceneContainer 
        title={getTitle()} 
        nextEnabled={sceneComplete} 
        onNext={handleNext}
        isLast={isLast}
      >
        {renderScene()}
      </SceneContainer>
    </div>
  );
}
