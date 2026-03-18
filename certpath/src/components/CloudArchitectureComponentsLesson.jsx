import React, { useState, useEffect } from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

// ============================================================================
// ICONS FOR ARCHITECTURE COMPONENTS
// ============================================================================
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CdnIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LbIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const ServerIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const CacheIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DbIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

// ============================================================================
// UI COMPONENTS
// ============================================================================

const SceneContainer = ({ title, children, nextEnabled, onNext, isLast, hideNav }) => (
  <div className="flex flex-col w-full h-full min-h-[600px] border border-stone-200/50 dark:border-white/10 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-xl shadow-2xl transition-all duration-500">
    <div className="p-8 flex-1 flex flex-col relative w-full h-full">
      <h2 className="text-2xl font-light text-ink dark:text-paper tracking-tight mb-8">
        {title}
      </h2>
      <div className="flex-1 w-full flex flex-col justify-center items-center max-w-5xl mx-auto h-full min-h-[400px]">
        {children}
      </div>
    </div>
    {!hideNav && (
      <div className="border-t border-stone-100/50 dark:border-white/5 p-4 flex justify-between items-center bg-stone-50/50 dark:bg-white/5 shrink-0 pl-8 pr-8">
        <div className="text-sm text-pencil font-mono tracking-widest uppercase">
          Cloud • Architecture
        </div>
        <button
          onClick={onNext}
          disabled={!nextEnabled}
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            nextEnabled
              ? 'bg-ink text-paper dark:bg-paper dark:text-ink hover:scale-105 active:scale-95 shadow-md border border-transparent'
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

const ComponentNode = ({ type, label, icon: Icon, active, dragging, placed, isTarget }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all duration-300 shadow-lg ${
      placed ? 'bg-ink border-ink text-paper dark:bg-paper dark:border-paper dark:text-ink' :
      active ? 'bg-rust/10 border-rust text-rust shadow-rust/20' :
      dragging ? 'bg-stone-100 border-stone-300 text-stone-500 dark:bg-stone-800 dark:border-stone-600 opacity-50' :
      isTarget ? 'bg-stone-50/50 border-dashed border-stone-300 dark:bg-stone-900/30 dark:border-stone-700 text-pencil' :
      'bg-white border-stone-200 text-ink dark:bg-stone-900 dark:border-stone-700 dark:text-paper hover:-translate-y-1 hover:border-rust cursor-grab active:cursor-grabbing'
    }`}>
      {Icon && <Icon className={`w-8 h-8 mb-1 ${placed ? 'text-paper dark:text-ink' : ''}`} />}
      <span className="text-[10px] uppercase font-bold text-center tracking-widest px-1">
        {label}
      </span>
      {placed && <div className="absolute top-1 right-1"><CheckIcon className="w-3 h-3 text-success" /></div>}
    </div>
  );
};

// ============================================================================
// SCENE 1: The building blocks
// ============================================================================

const Scene1 = ({ onComplete }) => {
  const [placed, setPlaced] = useState({});
  const [animating, setAnimating] = useState(false);

  const slots = [
    { id: 'cdn', label: 'CDN' },
    { id: 'lb', label: 'Load Balancer' },
    { id: 'server', label: 'Web Server' },
    { id: 'cache', label: 'Cache' },
    { id: 'db', label: 'Database' }
  ];

  const components = [
    { id: 'lb', label: 'Load Balancer', icon: LbIcon },
    { id: 'db', label: 'Database', icon: DbIcon },
    { id: 'cdn', label: 'CDN', icon: CdnIcon },
    { id: 'server', label: 'Web Server', icon: ServerIcon },
    { id: 'cache', label: 'Cache', icon: CacheIcon }
  ];

  const handleDrop = (slotId, compId) => {
    if (slotId === compId) {
      setPlaced(prev => ({ ...prev, [slotId]: true }));
    }
  };

  const isComplete = Object.keys(placed).length === slots.length;

  useEffect(() => {
    if (isComplete) {
      setAnimating(true);
      setTimeout(() => onComplete(true), 3000);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex justify-center flex-col items-center gap-12 animate-fade-in relative px-4">
      <div className="text-center mb-4">
        <p className="text-pencil text-sm max-w-2xl mx-auto uppercase tracking-widest font-bold">
          A modern web app isn't just one server. It's a team of specialized components.
        </p>
      </div>

      <div className="relative w-full max-w-4xl h-48 border bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-between px-8">
        <div className="flex flex-col items-center gap-2 z-10 shrink-0">
          <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-500">
            <UserIcon className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-pencil">User</span>
        </div>

        {/* The Pipeline */}
        <div className="absolute top-[45%] left-24 right-24 h-1 bg-stone-200 dark:bg-stone-800 z-0 rounded-full"></div>
        {animating && (
          <div className="absolute top-[45%] left-24 right-24 h-1 z-0 rounded-full bg-success overflow-hidden shadow-[0_0_10px_rgba(34,197,94,0.5)]">
            <div className="w-full h-full bg-white opacity-50 animate-pulse"></div>
          </div>
        )}

        <div className="flex flex-1 justify-center gap-4 z-10 mx-6">
          {slots.map((slot) => {
            const isPlaced = placed[slot.id];
            const comp = components.find(c => c.id === slot.id);
            return (
              <div 
                key={slot.id} 
                className="relative"
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(slot.id, e.dataTransfer.getData('compId'))}
              >
                {isPlaced ? (
                  <div className="animate-bubble-in">
                    <ComponentNode type={comp.id} label={comp.label} icon={comp.icon} placed />
                  </div>
                ) : (
                  <ComponentNode label="Drop Here" isTarget />
                )}
                {animating && isPlaced && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-ping"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 z-10 shrink-0">
          <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-pencil">Internet</span>
        </div>
      </div>

      <div className="flex gap-6 justify-center min-h-[100px]">
        {components.map(comp => (
          !placed[comp.id] && (
            <div
              key={comp.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('compId', comp.id)}
            >
              <ComponentNode type={comp.id} label={comp.label} icon={comp.icon} />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 2: What each one does
// ============================================================================

const Scene2 = ({ onComplete }) => {
  const [activeNode, setActiveNode] = useState(null);
  const [viewed, setViewed] = useState(new Set());

  const explanations = {
    cdn: {
      title: 'Content Delivery Network (CDN)',
      desc: 'Shows a map with cache servers. A user in Warsaw gets content from the Warsaw cache (fast), not the US origin (slow).',
      detailAnim: () => (
        <div className="w-full h-40 bg-blue-50 dark:bg-blue-900/10 rounded-xl relative overflow-hidden border border-blue-200 dark:border-blue-800/30">
          <div className="absolute left-8 top-12 w-4 h-4 rounded-full bg-blue-500"></div>
          <div className="absolute right-12 top-16 w-4 h-4 rounded-full bg-stone-300 dark:bg-stone-700"></div>
          <div className="absolute left-[36px] top-[52px] w-[200px] h-[2px] bg-blue-400 transform -rotate-6 origin-left"></div>
          <div className="absolute left-8 top-20 text-xs font-bold text-blue-600 dark:text-blue-400">Warsaw Edge<br/>Latency: 5ms</div>
          <div className="absolute right-4 top-24 text-xs font-bold text-stone-500">US Origin<br/>Latency: 150ms</div>
          <div className="absolute left-10 top-[50px] w-3 h-3 bg-white rounded-full animate-ping"></div>
        </div>
      )
    },
    lb: {
      title: 'Load Balancer',
      desc: 'Routes traffic to healthy web servers. If one crashes, it instantly reroutes traffic so users never notice.',
      detailAnim: () => (
        <div className="w-full h-40 flex items-center justify-center gap-8 bg-stone-50 dark:bg-stone-900/30 rounded-xl border border-stone-200 dark:border-stone-800">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center animate-bounce">↓</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4"><div className="w-16 h-[2px] bg-blue-400"></div><div className="w-10 h-10 bg-success rounded shadow-sm flex items-center justify-center"><ServerIcon className="w-6 h-6 text-white"/></div></div>
            <div className="flex items-center gap-4"><div className="w-16 h-[2px] bg-error border-dashed border-error relative"><div className="absolute top-[-10px] left-4 text-xs font-bold text-error">REROUTING</div></div><div className="w-10 h-10 bg-error rounded shadow-sm opacity-50 flex items-center justify-center"><ServerIcon className="w-6 h-6 text-white"/></div></div>
            <div className="flex items-center gap-4"><div className="w-16 h-[2px] bg-blue-400"></div><div className="w-10 h-10 bg-success rounded shadow-sm flex items-center justify-center"><ServerIcon className="w-6 h-6 text-white"/></div></div>
          </div>
        </div>
      )
    },
    server: {
      title: 'Web Server',
      desc: 'The brains of the operation. Receives requests, executes backend application logic, and returns a response.',
      detailAnim: () => (
        <div className="w-full h-40 bg-ink rounded-xl border border-stone-800 p-4 font-mono text-xs text-green-400 shadow-inner flex flex-col justify-center gap-2 overflow-hidden">
          <div><span className="text-blue-400">app</span>.get(<span className="text-yellow-300">"/profile"</span>, (req, res) =&gt; {'{'}</div>
          <div className="pl-4 opacity-50">const user = db.query(req.id);</div>
          <div className="pl-4 text-white animate-pulse">res.send(user.data); <span className="text-stone-500">// Processing logic...</span></div>
          <div>{'}'});</div>
        </div>
      )
    },
    cache: {
      title: 'Cache (Redis / Memcached)',
      desc: 'Stores expensive database queries in fast memory. Instant returns on cache hit, reducing database load.',
      detailAnim: () => (
        <div className="w-full h-40 flex items-center justify-center gap-8 bg-stone-50 dark:bg-stone-900/30 rounded-xl border border-stone-200 dark:border-stone-800 relative">
          <div className="flex flex-col gap-8 w-full px-8">
            <div className="flex justify-between items-center relative z-10">
               <span className="px-3 py-1 bg-stone-800 text-white rounded text-xs font-bold">Request</span>
               <div className="w-24 h-1 bg-success relative rounded">
                 <div className="absolute top-[-20px] left-2 text-[10px] text-success font-bold uppercase">HIT (1ms)</div>
                 <div className="absolute inset-0 bg-white opacity-50 w-full animate-ping"></div>
               </div>
               <span className="px-3 py-1 bg-rust text-white rounded text-xs font-bold shadow-lg shadow-rust/20 flex gap-2"><CacheIcon className="w-4 h-4"/> Cache Memory</span>
            </div>
            <div className="flex justify-between items-center opacity-40">
               <span className="px-3 py-1 bg-stone-800 text-white rounded text-xs font-bold">Request</span>
               <div className="w-24 h-1 bg-error relative rounded border-t-2 border-dashed border-error bg-transparent">
                 <div className="absolute top-[-20px] left-2 text-[10px] text-error font-bold uppercase">MISS (50ms)</div>
               </div>
               <span className="px-3 py-1 bg-stone-600 text-white rounded text-xs font-bold flex gap-2"><DbIcon className="w-4 h-4"/> Database Disk</span>
            </div>
          </div>
        </div>
      )
    },
    db: {
      title: 'Database',
      desc: 'Persistent storage for user data, orders, and structured information. Must be carefully protected and scaled.',
      detailAnim: () => (
        <div className="w-full h-40 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 p-4 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <div className="text-xs font-mono font-bold text-stone-500 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2">users_table</div>
          <table className="w-full text-left text-xs text-stone-600 dark:text-stone-400">
            <thead><tr><th className="pb-2">id</th><th className="pb-2">name</th><th className="pb-2">role</th></tr></thead>
            <tbody>
              <tr className="bg-success/10"><td className="py-1">42</td><td>Alex</td><td className="font-bold text-success animate-pulse">ADMIN</td></tr>
              <tr><td className="py-1">43</td><td>Sam</td><td>USER</td></tr>
              <tr><td className="py-1">44</td><td>Jordan</td><td>USER</td></tr>
            </tbody>
          </table>
        </div>
      )
    }
  };

  const comps = [
    { id: 'cdn', label: 'CDN', icon: CdnIcon },
    { id: 'lb', label: 'Load Balancer', icon: LbIcon },
    { id: 'server', label: 'Web Server', icon: ServerIcon },
    { id: 'cache', label: 'Cache', icon: CacheIcon },
    { id: 'db', label: 'Database', icon: DbIcon }
  ];

  const handleClick = (id) => {
    setActiveNode(id);
    setViewed(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const isComplete = viewed.size === comps.length;

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 2000);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex justify-center flex-col items-center gap-12 animate-fade-in relative px-4">
      <div className="text-center">
        <p className="text-pencil text-sm max-w-2xl mx-auto uppercase tracking-widest font-bold mb-2">
          Let's zoom into each component and see what happens inside. Click all 5 to proceed.
        </p>
        <div className="text-xs font-mono text-rust">{viewed.size} / 5 Viewed</div>
      </div>

      <div className="w-full flex justify-center gap-6 z-10">
        {comps.map((comp) => {
          const isActive = activeNode === comp.id;
          const isViewed = viewed.has(comp.id);
          
          return (
            <div key={comp.id} className="relative cursor-pointer" onClick={() => handleClick(comp.id)}>
              <div className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 transition-all duration-300 shadow-md ${
                isActive ? 'bg-ink border-ink text-paper dark:bg-paper dark:border-paper dark:text-ink scale-110 shadow-xl z-20' : 
                isViewed ? 'bg-stone-100 border-stone-300 text-stone-600 dark:bg-stone-800 dark:border-stone-600 dark:text-stone-400 opacity-60' : 
                'bg-white border-stone-200 text-ink dark:bg-stone-900 dark:border-stone-700 dark:text-paper hover:-translate-y-1 hover:border-rust'
              }`}>
                <comp.icon className="w-6 h-6 mb-1" />
                <span className="text-[9px] uppercase font-bold text-center tracking-widest px-1 leading-tight">{comp.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-3xl min-h-[300px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl p-8 transition-all duration-500 overflow-hidden flex flex-col justify-center relative">
        {activeNode ? (
          <div className="flex flex-col md:flex-row gap-8 items-center animate-fade-in">
             <div className="flex-1 w-full max-w-md">
                {explanations[activeNode].detailAnim()}
             </div>
             <div className="flex-1 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-ink dark:text-paper">{explanations[activeNode].title}</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                  {explanations[activeNode].desc}
                </p>
             </div>
          </div>
        ) : (
          <div className="text-center text-pencil font-mono text-sm h-full flex items-center justify-center italic">
            Select a component above to inspect its internals.
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 3: The request journey
// ============================================================================

const Scene3 = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  
  const journey = [
    { id: 'start', label: 'User', msg: 'Load my profile page', time: 0, pos: '0%' },
    { id: 'cdn', label: 'CDN', msg: 'Static assets (images, CSS) served from cache — fast!', time: 10, pos: '20%' },
    { id: 'lb', label: 'Load Balancer', msg: 'Request routed to Server 2 (least busy)', time: 15, pos: '40%' },
    { id: 'server', label: 'Web Server', msg: 'Processes the request, needs user data', time: 20, pos: '60%' },
    { id: 'cache', label: 'Cache', msg: 'Checking... cache miss! Going to database', time: 25, pos: '80%' },
    { id: 'db', label: 'Database', msg: 'Query: SELECT * FROM users WHERE id = 42 — found it!', time: 100, pos: '100%' },
    { id: 'cache_store', label: 'Cache', msg: 'Storing result for next time', time: 105, pos: '80%', reverse: true },
    { id: 'server_resp', label: 'Web Server', msg: 'Building HTML response...', time: 110, pos: '60%', reverse: true },
    { id: 'user_end', label: 'User', msg: 'Profile loaded visually.', time: 120, pos: '0%', reverse: true }
  ];

  useEffect(() => {
    let timer;
    if (playing && step < journey.length - 1) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 2000);
    } else if (playing && step === journey.length - 1) {
      setPlaying(false);
      onComplete(true);
    } else if (!playing && step === journey.length - 1) {
      onComplete(true);
    }
    return () => clearTimeout(timer);
  }, [playing, step, onComplete, journey.length]);

  const currentStop = journey[step];

  return (
    <div className="w-full flex flex-col items-center gap-12 animate-fade-in relative px-4">
      <div className="text-center">
         <p className="text-pencil text-sm max-w-2xl mx-auto uppercase tracking-widest font-bold">
           Follow a single request from start to finish.
         </p>
      </div>

      <div className="w-full max-w-4xl bg-stone-50 dark:bg-stone-900/40 p-12 rounded-2xl border border-stone-200 dark:border-stone-800 relative shadow-inner">
        
        {/* Total Time Counter */}
        <div className="absolute top-6 right-6 font-mono font-bold text-xl text-rust bg-white dark:bg-stone-800 px-4 py-2 rounded-xl shadow border border-rust/30">
          {currentStop.time}ms
        </div>

        {/* The Pipeline visualization */}
        <div className="w-full h-8 relative mb-16 mt-8">
           <div className="absolute top-1/2 left-0 right-0 h-2 bg-stone-300 dark:bg-stone-700 transform -translate-y-1/2 rounded-full z-0"></div>
           
           {/* Moving Packet */}
           <div 
             className="absolute top-1/2 w-6 h-6 bg-success rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] z-20 flex items-center justify-center transition-all duration-1000 ease-in-out border-2 border-white"
             style={{ 
               left: currentStop.pos, 
               transform: `translate(-50%, -50%) ${currentStop.reverse ? 'rotate(180deg)' : ''}` 
             }}
           ></div>

           {/* Component Markings */}
           {['0%', '20%', '40%', '60%', '80%', '100%'].map((pos, i) => {
             const labels = ['User', 'CDN', 'LB', 'Server', 'Cache', 'DB'];
             const isActive = currentStop.pos === pos;
             return (
               <div key={i} className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" style={{ left: pos }}>
                 <div className={`w-4 h-4 rounded-full border-2 bg-white dark:bg-stone-900 z-10 transition-colors ${isActive ? 'border-rust scale-150 relative z-30' : 'border-stone-400 dark:border-stone-600'}`}></div>
                 <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-center w-24 transition-colors ${isActive ? 'text-rust' : 'text-stone-500'}`}>
                   {labels[i]}
                 </div>
               </div>
             )
           })}
        </div>

        {/* Speech Bubble */}
        <div className="flex justify-center mt-12 min-h-[100px]">
          <div key={step} className="bg-ink text-paper dark:bg-paper dark:text-ink px-8 py-4 rounded-2xl shadow-2xl font-medium text-lg text-center animate-bubble-in max-w-xl relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-ink dark:border-b-paper"></div>
            {currentStop.msg}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => { setStep(0); setPlaying(true); }}
          className="px-6 py-3 bg-rust text-white rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
        >
          {step > 0 ? 'Restart Journey' : 'Send Request'}
        </button>
        {step > 0 && step < journey.length - 1 && (
          <button 
            onClick={() => setPlaying(!playing)}
            className="px-6 py-3 bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
          >
            {playing ? 'Pause' : 'Auto-Play'}
          </button>
        )}
        {!playing && step < journey.length - 1 && step > 0 && (
          <button 
            onClick={() => setStep(s => s + 1)}
            className="px-6 py-3 bg-ink text-paper dark:bg-paper dark:text-ink rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2"
          >
            Step <ArrowRightIcon className="w-4 h-4"/>
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 4: When things go wrong
// ============================================================================

const Scene4 = ({ onComplete }) => {
  const [activeFail, setActiveFail] = useState(null);
  const [viewed, setViewed] = useState(new Set());
  const [questionAnswered, setQA] = useState(null); // 'correct' or 'wrong'

  const failures = [
    { id: 'db', title: 'Database Crashes', text: 'Cache serves stale data. Slower, but site stays up temporarily.', failNode: 'DB', fixNode: 'Cache' },
    { id: 'server', title: 'Web Server Dies', text: 'Load balancer spots health check fail, reroutes to healthy severs.', failNode: 'Server 1', fixNode: 'LB' },
    { id: 'cdn', title: 'CDN Outage', text: 'DNS routes directly to origin load balancer. High latency, but works.', failNode: 'CDN', fixNode: 'Origin' },
    { id: 'traffic', title: '10x Traffic Spike', text: 'Auto-scaler detects CPU at 95%, provisions 5 new web servers.', failNode: 'Traffic', fixNode: 'Auto-scale' },
  ];

  const handleClick = (id) => {
    setActiveFail(id);
    setViewed(prev => new Set(prev).add(id));
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in relative px-4">
      <div className="text-center w-full">
         <p className="text-pencil text-sm max-w-2xl mx-auto uppercase tracking-widest font-bold">
           Good architecture handles failures gracefully.
         </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {failures.map(fail => {
          const isActive = activeFail === fail.id;
          const isViewed = viewed.has(fail.id);
          return (
            <button
              key={fail.id}
              onClick={() => handleClick(fail.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isActive ? 'bg-error/10 border-error shadow-lg shadow-error/20 transform -translate-y-2' :
                isViewed ? 'bg-stone-50 border-stone-200 dark:bg-stone-900/50 dark:border-stone-800 opacity-70' :
                'bg-white border-stone-200 dark:bg-stone-800 dark:border-stone-700 hover:border-error hover:-translate-y-1'
              }`}
            >
              <div className={`text-sm font-bold mb-2 ${isActive ? 'text-error' : 'text-ink dark:text-paper'}`}>{fail.title}</div>
              <div className="text-xs text-stone-500 leading-tight">{isActive ? fail.text : 'Click to simulate constraint'}</div>
            </button>
          )
        })}
      </div>

      <div className="w-full max-w-4xl h-64 bg-stone-900 rounded-2xl border-4 border-stone-800 shadow-2xl relative overflow-hidden flex items-center justify-center p-8">
        {!activeFail ? (
          <div className="text-stone-500 font-mono text-sm text-center">
            Select a failure scenario above to simulate the architecture's response.
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center gap-6 animate-fade-in">
             <div className="text-error font-bold text-xl uppercase tracking-widest animate-pulse border-2 border-error px-4 py-2 rounded-lg bg-error/20">
               CRITICAL EVENT: {failures.find(f => f.id === activeFail).failNode}
             </div>
             <div className="flex bg-stone-800 text-stone-300 px-6 py-3 rounded-xl font-mono text-sm">
                &gt;_ SYSTEM ACTING: {failures.find(f => f.id === activeFail).fixNode} engaged. Route recovered.
             </div>
             <div className="w-32 h-2 bg-success rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>
        )}
      </div>

      {viewed.size === failures.length && (
        <div className="w-full max-w-2xl bg-paper dark:bg-stone-900 border border-stone-200 dark:border-stone-700 p-6 rounded-2xl shadow-xl animate-fade-in mt-4">
          <p className="font-bold text-ink dark:text-paper mb-4 text-center">What's the most critical single point of failure?</p>
          <div className="grid grid-cols-2 gap-4">
            {['Load Balancer', 'Web Server', 'Cache', 'Database'].map(opt => (
              <button 
                key={opt}
                onClick={() => {
                  if (opt === 'Database') {
                    setQA('correct');
                    setTimeout(() => onComplete(true), 2000);
                  } else {
                    setQA('wrong');
                  }
                }}
                className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                  questionAnswered === 'correct' && opt === 'Database' ? 'bg-success text-white border-success' :
                  questionAnswered === 'wrong' && opt !== 'Database' ? 'opacity-50 line-through bg-stone-100 dark:bg-stone-800 border-stone-200' :
                  'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-rust text-stone-700 dark:text-stone-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {questionAnswered === 'correct' && (
            <div className="mt-4 text-center text-sm text-success font-bold animate-fade-in flex items-center justify-center gap-2">
              <CheckIcon className="w-4 h-4"/> Correct! If the DB crashes AND cache empties, the app is totally halted.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SCENE 5: Real World: Design an architecture
// ============================================================================

const Scene5 = ({ onComplete }) => {
  const reqs = [
    { id: '1', text: "Users browse restaurant images globally", tag: "CDN" },
    { id: '2', text: "Lunch rush handles 10,000 orders/hr", tag: "Load Balancer & Auto-scale" },
    { id: '3', text: "Real-time live order tracking required", tag: "Cache" },
    { id: '4', text: "Persist transaction and user data safely", tag: "Database" },
    { id: '5', text: "99.9% database uptime guaranteed", tag: "DB Replica" }
  ];

  const [step, setStep] = useState(0);

  const isComplete = step === reqs.length;

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(true), 4000);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 animate-fade-in relative px-4 max-w-6xl mx-auto h-full">
      
      {/* Requirements List side */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-xl font-bold text-ink dark:text-paper mb-2">Food Delivery Startup Requirements</h3>
        <div className="flex flex-col gap-3">
          {reqs.map((req, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div 
                key={req.id}
                className={`p-4 rounded-xl border transition-all duration-500 ${
                  isDone ? 'bg-success/10 border-success text-success opacity-80' : 
                  isActive ? 'bg-rust/5 border-rust shadow-md scale-105 transform z-10' : 
                  'bg-stone-50 border-stone-200 dark:bg-stone-900/40 dark:border-stone-800 text-stone-400 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5 ${isDone ? 'bg-success border-success text-white' : isActive ? 'border-rust text-rust font-bold' : 'border-stone-300'}`}>
                    {isDone ? <CheckIcon className="w-3 h-3"/> : i + 1}
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <span className={isActive ? 'font-bold text-ink dark:text-paper' : ''}>{req.text}</span>
                    {isActive && (
                      <button 
                        onClick={() => setStep(s => s + 1)}
                        className="self-start mt-2 px-4 py-2 bg-rust text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        Deploy {req.tag}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Canvas side */}
      <div className="flex-[1.5] bg-stone-900 border-4 border-stone-800 rounded-3xl relative overflow-hidden flex items-center justify-center p-8 min-h-[400px]">
         <div className="absolute inset-x-0 inset-y-0 opacity-20 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         
         <div className="flex items-center gap-12 relative z-10 w-full justify-center">
            
            <div className="flex flex-col items-center">
              <ComponentNode type="user" label="Users" icon={UserIcon} placed={true} />
            </div>

            {/* Step 1: CDN */}
            {step > 0 && <div className="h-0.5 w-12 bg-stone-700 animate-[fade-in_0.5s]"></div>}
            {step > 0 && (
              <div className="flex flex-col items-center animate-bounce-in">
                <ComponentNode type="cdn" label="CDN Edge" icon={CdnIcon} placed={true} />
              </div>
            )}

            {/* Step 2: LB & Server */}
            {step > 1 && <div className="h-0.5 w-12 bg-stone-700 animate-[fade-in_0.5s]"></div>}
            {step > 1 && (
              <div className="flex items-center gap-6 animate-bounce-in">
                <ComponentNode type="lb" label="LB" icon={LbIcon} placed={true} />
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-1 bg-green-500 text-[8px] font-bold text-white rounded uppercase tracking-widest self-center animate-pulse">Auto-scale Group</div>
                  <ComponentNode type="server" label="Web 1" icon={ServerIcon} placed={true} />
                  <ComponentNode type="server" label="Web 2" icon={ServerIcon} placed={true} />
                </div>
              </div>
            )}

            {/* Step 3: Cache (Above lines) */}
            {step > 2 && (
               <div className="absolute top-8 left-[60%] flex items-center gap-4 animate-bounce-in bg-stone-800/80 p-2 rounded-xl border border-stone-700 backdrop-blur">
                 <ComponentNode type="cache" label="Redis Cache" icon={CacheIcon} placed={true} />
               </div>
            )}

            {/* Step 4: DB */}
            {step > 3 && <div className="h-0.5 w-12 bg-stone-700 animate-[fade-in_0.5s]"></div>}
            {step > 3 && (
              <div className="flex flex-col items-center gap-4 animate-bounce-in">
                <ComponentNode type="db" label="Primary DB" icon={DbIcon} placed={true} />
                {/* Step 5: Replica */}
                {step > 4 && (
                  <div className="relative animate-bounce-in">
                     <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-stone-700 transform -translate-x-1/2"></div>
                     <ComponentNode type="db" label="Replica DB" icon={DbIcon} active={true} />
                  </div>
                )}
              </div>
            )}
         </div>

         {isComplete && (
           <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="text-success font-mono font-bold text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] mb-2">SYSTEM DEPLOYED</div>
              <div className="text-white text-sm">Handling 10,000 orders/hr flawlessly.</div>
           </div>
         )}
      </div>
    </div>
  );
};

// ============================================================================
// SCENE 6: Challenge: Find the bottleneck
// ============================================================================

const Scene6 = ({ onComplete }) => {
  const [fixed, setFixed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFix = (correct, isCache) => {
    if (correct) {
      setFixed(true);
      setErrorMsg('');
      setTimeout(() => onComplete(true), 3000);
    } else {
      setErrorMsg("That won't solve the DB CPU overload. The bottleneck is the single database handling too many reads/writes directly.");
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 items-center h-full px-4">
      <div className="flex justify-between items-center w-full mb-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <h3 className="text-xl font-bold text-ink dark:text-paper uppercase tracking-widest text-sm">Final Challenge</h3>
        <div className={`font-mono font-bold px-3 py-1 rounded text-sm ${fixed ? 'bg-success/20 text-success' : 'bg-error/20 text-error animate-pulse'}`}>
          Status: {fixed ? 'OPTIMIZED' : 'CRITICAL ALERT'}
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8">
        {/* Graph Area */}
        <div className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
           <h4 className="text-xs uppercase tracking-widest text-pencil font-bold mb-4">Metric: Average Response Time</h4>
           
           <div className="flex-1 relative border-l border-b border-stone-300 dark:border-stone-700 mt-2 mb-6">
              <div className="absolute -left-10 bottom-0 text-[10px] text-stone-500 font-mono">0ms</div>
              <div className="absolute -left-12 top-0 text-[10px] text-stone-500 font-mono">5000ms</div>
              
              {/* Grid lines */}
              <div className="absolute inset-x-0 top-1/2 w-full border-t border-dashed border-stone-300 dark:border-stone-700"></div>
              
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {fixed ? (
                  // Optimized Curve
                  <path d="M0 90 Q 25 88, 50 85 T 100 85" fill="none" stroke="currentColor" className="text-success" strokeWidth="4" />
                ) : (
                  // Bottleneck Curve
                  <path d="M0 90 Q 25 90, 50 50 T 100 10" fill="none" stroke="currentColor" className="text-error" strokeWidth="4" />
                )}
              </svg>

              {!fixed && <div className="absolute top-2 right-4 text-error font-bold text-xl drop-shadow">5000ms</div>}
              {fixed && <div className="absolute bottom-10 right-4 text-success font-bold text-xl drop-shadow animate-bounce-in">80ms</div>}
           </div>

           <div className={`mt-auto p-4 rounded-xl border flex items-center justify-between transition-colors ${fixed ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
              <span className="font-mono text-xs font-bold text-stone-600 dark:text-stone-400">Database CPU:</span>
              <span className={`font-mono text-xl font-bold ${fixed ? 'text-success' : 'text-error'}`}>{fixed ? '24%' : '99.9%'}</span>
           </div>
        </div>

        {/* Options Area */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
           {!fixed ? (
             <>
               <p className="text-ink dark:text-paper font-medium text-lg leading-relaxed">
                 Traffic is peaking. Response times are 5 seconds. The servers are fine, but the Database CPU is pinned to 99%. <br/><br/>
                 <span className="font-bold text-rust">Identify the bottleneck and deploy a fix to the architecture:</span>
               </p>
               
               <div className="flex flex-col gap-3 mt-4">
                 <button onClick={() => handleFix(false)} className="text-left px-6 py-4 rounded-xl border-2 border-stone-200 bg-white hover:border-rust dark:bg-stone-800 dark:border-stone-700 dark:text-paper shadow-sm transition-all hover:-translate-y-1">
                   1. Add 4 more web servers
                 </button>
                 <button onClick={() => handleFix(true, true)} className="text-left px-6 py-4 rounded-xl border-2 border-stone-200 bg-white hover:border-success dark:bg-stone-800 dark:border-stone-700 dark:text-paper shadow-sm transition-all hover:-translate-y-1">
                   2. Add a Cache Layer (Redis)
                 </button>
                 <button onClick={() => handleFix(true, false)} className="text-left px-6 py-4 rounded-xl border-2 border-stone-200 bg-white hover:border-success dark:bg-stone-800 dark:border-stone-700 dark:text-paper shadow-sm transition-all hover:-translate-y-1">
                   3. Add Database Read Replicas
                 </button>
                 <button onClick={() => handleFix(false)} className="text-left px-6 py-4 rounded-xl border-2 border-stone-200 bg-white hover:border-rust dark:bg-stone-800 dark:border-stone-700 dark:text-paper shadow-sm transition-all hover:-translate-y-1">
                   4. Upgrade the CDN plan
                 </button>
               </div>

               {errorMsg && (
                 <div className="p-4 rounded-lg bg-error/10 border border-error/50 text-error text-sm font-medium animate-[shake_0.4s_ease-in-out]">
                   {errorMsg}
                 </div>
               )}
             </>
           ) : (
             <div className="flex flex-col items-center justify-center p-8 bg-success/10 border-2 border-success rounded-3xl animate-fade-in text-center h-full">
               <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(34,197,94,0.6)] mb-6">
                 <CheckIcon className="w-10 h-10" />
               </div>
               <h3 className="text-3xl font-bold text-success mb-4">Architecture Fixed!</h3>
               <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed max-w-sm">
                 Adding a cache or read replica offloads the heavy read traffic from the primary database, bringing the CPU down instantly and dropping response times to 80ms.
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN LESSON COMPONENT
// ============================================================================

export default function CloudArchitectureComponentsLesson({ currentPhase, currentStep, onComplete }) {
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
    return <div className="p-8 text-center text-stone-500 font-mono">Scene not found for ({currentPhase}, {currentStep})</div>;
  };

  const getTitle = () => {
    if (currentPhase === 'learn') {
      if (currentStep === 1) return 'The building blocks';
      if (currentStep === 2) return 'What each one does';
      if (currentStep === 3) return 'The request journey';
      if (currentStep === 4) return 'When things go wrong';
    } else if (currentPhase === 'apply') {
      return 'Real World: Architecture Design';
    } else if (currentPhase === 'challenge') {
      return 'Final Challenge: Find the bottleneck';
    }
    return '';
  };

  const isLast = currentPhase === 'challenge' && currentStep === 1;

  // Additional style tag for keyframes that might not be in the project's Tailwind config
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 h-full min-h-screen font-sans">
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes bubble-in {
          0% { transform: translateY(10px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-bubble-in {
          animation: bubble-in 0.4s ease-out forwards;
        }
      `}</style>
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
