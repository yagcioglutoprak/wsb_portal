import { useEffect, useRef, useState } from "react";

/**
 * Single parent observer triggers sequential card reveals.
 * Cards appear one-by-one with 150ms gaps.
 * Internal animations only fire AFTER their card is revealed.
 */
function useSequentialReveal(count) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(() => Array(count).fill(false));
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          observer.unobserve(el);
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setRevealed(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 150);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  return { ref, revealed };
}

// ─── Card shell ─────────────────────────────────────────────────────
function Card({ revealed, className = "", children }) {
  return (
    <div
      className={`bg-card rounded-2xl border border-ink/6 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] ${className}`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(28px)",
        transitionProperty: "opacity, transform, box-shadow",
        transitionDuration: "800ms, 800ms, 400ms",
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 1 — CI/CD Pipeline Builder (spans 2 cols)
// ═══════════════════════════════════════════════════════════════════
const IconBuild = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconTest = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>;
const IconLint = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const IconDeploy = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 3.82-13.02C13 1 14 1 14 1c0 0 1.25.98 2.22 2.78A22 22 0 0 1 15 12z"/><path d="M9 12c1.47 1.47 4 3 6 4s1 2 1 2-1 1-3 .5-3-3-4-5-5-4-5-4 .5-1 2-1 4 2.5 5.5 4z"/></svg>;
const IconBug = ({ className = "w-4 h-4" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M17.47 9c1.93-.2 3.53-1.9 3.53-3.9"/><path d="M18 13h4"/><path d="M21 21c0-2.1-1.7-3.9-3.8-4"/></svg>;
const IconParty = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m5.8 11.3 2.9-2.9a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L1.6 7.1a2 2 0 0 0 0 2.8l1.4 1.4a2 2 0 0 0 2.8 0Z"/><path d="M4 20 5.4 8.6"/><path d="M15 9h.01"/><path d="M18 12h.01"/><path d="M22 16h.01"/><path d="M11 16h.01"/><path d="M18 6h.01"/><path d="M14 20h.01"/></svg>;
const IconNotify = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const IconRollback = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>;
const IconBenchmark = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M20 6 9 17l-5-5"/></svg>;

function LessonsCard({ revealed }) {
  const [isBroken, setIsBroken] = useState(false);
  const [placed, setPlaced] = useState([]);
  const [commitPos, setCommitPos] = useState(-1);
  const [commitStatus, setCommitStatus] = useState('idle');
  const [banner, setBanner] = useState(null);
  const [cursor, setCursor] = useState({ x: '80%', y: '90%', opacity: 0, clicked: false });
  const [draggedItem, setDraggedItem] = useState(null);

  const blocksMap = {
    'build': { title: 'Build Phase', icon: <IconBuild />, color: 'orange' },
    'test': { title: 'Test Suite', icon: <IconTest />, color: '#2a9d8f' },
    'lint': { title: 'Code Linter', icon: <IconLint />, color: 'violet' },
    'deploy': { title: 'Production Deploy', icon: <IconDeploy />, color: 'rust' }
  };

  const getPillPos = (id) => {
    switch(id) {
      case 'build': return { x: '15%', y: '88%' };
      case 'test': return { x: '30%', y: '88%' };
      case 'lint': return { x: '45%', y: '88%' };
      case 'deploy': return { x: '60%', y: '88%' };
      default: return { x: '50%', y: '90%' };
    }
  };

  const getDropPos = (id) => {
    switch(id) {
      case 'build': return { x: '50%', y: '35%' };
      case 'test': return { x: '50%', y: '48%' };
      case 'lint': return { x: '50%', y: '61%' };
      case 'deploy': return { x: '50%', y: '74%' };
      default: return { x: '50%', y: '50%' };
    }
  };

  useEffect(() => {
    if (!revealed) return;
    let active = true;
    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    const performDrag = async (id) => {
      const start = getPillPos(id);
      const end = getDropPos(id);
      
      setCursor(c => ({ ...c, x: start.x, y: start.y, opacity: 1, clicked: false }));
      await wait(600);
      if (!active) return false;
      
      setCursor(c => ({ ...c, clicked: true }));
      await wait(200);
      if (!active) return false;
      
      setDraggedItem(id);
      await wait(100);
      if (!active) return false;
      
      setCursor(c => ({ ...c, x: end.x, y: end.y }));
      await wait(600);
      if (!active) return false;
      
      setCursor(c => ({ ...c, clicked: false }));
      setDraggedItem(null);
      setPlaced(p => [...p, id]);
      await wait(300);
      if (!active) return false;
      return true;
    };

    const run = async () => {
      while (active) {
        // --- CORRECT LOOP ---
        setIsBroken(false);
        setPlaced([]);
        setCommitPos(-1);
        setCommitStatus('idle');
        setBanner(null);
        setCursor({ x: '80%', y: '90%', opacity: 0, clicked: false });

        await wait(800);
        if (!active) break;

        const correctStages = ['build', 'test', 'lint', 'deploy'];
        for (const stage of correctStages) {
          const ok = await performDrag(stage);
          if (!ok) break;
        }
        if (!active) break;

        setCursor(c => ({ ...c, opacity: 0 }));
        await wait(500);
        if (!active) break;

        // Commit moves
        for (let i = 0; i < 4; i++) {
          setCommitPos(i);
          setCommitStatus('spinning');
          await wait(500);
          if (!active) break;
          setCommitStatus('success');
          await wait(400);
          if (!active) break;
        }

        setBanner('success');
        await wait(2000);
        if (!active) break;

        // --- BROKEN LOOP ---
        setIsBroken(true);
        setPlaced([]);
        setCommitPos(-1);
        setCommitStatus('idle');
        setBanner(null);
        setCursor({ x: '80%', y: '90%', opacity: 0, clicked: false });

        await wait(800);
        if (!active) break;

        let ok = await performDrag('build');
        if (!ok) break;

        await wait(200); // Skip test
        if (!active) break;

        ok = await performDrag('lint');
        if (!ok) break;

        ok = await performDrag('deploy');
        if (!ok) break;

        setCursor(c => ({ ...c, opacity: 0 }));
        await wait(500);
        if (!active) break;

        // Commit moves
        setCommitPos(0); // build
        setCommitStatus('spinning');
        await wait(500);
        if (!active) break;
        setCommitStatus('success');
        await wait(400);
        if (!active) break;

        setCommitPos(1); // test (empty)
        setCommitStatus('idle');
        await wait(300);
        if (!active) break;

        setCommitPos(2); // lint
        setCommitStatus('spinning');
        await wait(500);
        if (!active) break;
        setCommitStatus('success');
        await wait(400);
        if (!active) break;

        setCommitPos(3); // deploy
        setCommitStatus('spinning');
        await wait(500);
        if (!active) break;
        setCommitStatus('error');
        setBanner('error');
        await wait(2500);
        if (!active) break;
      }
    };

    run();
    return () => { active = false; };
  }, [revealed]);

  return (
    <Card revealed={revealed} className="md:col-span-2 lg:col-span-2 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
      {/* Left Panel - Visuals */}
      <div className="w-full md:w-5/12 lg:w-1/2 bg-[#f8f6f2] relative border-b md:border-b-0 md:border-r border-ink/6 flex items-center justify-center p-8 min-h-[320px]">
        <div className="relative z-10 w-full max-w-[160px]">
          {/* Conveyor track */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[-20px] bottom-[-20px] w-1.5 bg-ink/5 rounded-full z-0"></div>

          <div className="flex flex-col gap-6 relative z-10">
            {[
              { id: 'build', name: 'Build', icon: <IconBuild />, color: 'text-orange' },
              { id: 'test', name: 'Test', icon: <IconTest />, color: 'text-[#2a9d8f]' },
              { id: 'lint', name: 'Lint', icon: <IconLint />, color: 'text-violet' },
              { id: 'deploy', name: 'Deploy', icon: <IconDeploy />, color: 'text-rust' }
            ].map((stage, i) => {
              const isPlaced = placed.includes(stage.id);
              if (!isPlaced) return null;
              return (
                <div key={stage.id} className="relative h-12 w-full flex items-center justify-center z-10">
                  <div className="absolute inset-0 bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] rounded-xl flex items-center gap-3 px-4 animate-[bounceInRight_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
                    <span className={stage.color}>{stage.icon}</span>
                    <span className="text-sm font-bold text-ink">{stage.name}</span>
                  </div>
                </div>
              );
            })}

            {/* Commit Box relative to the slots container */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-lg shadow-md flex items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: commitStatus === 'error' ? '#dc2626' : commitStatus === 'success' ? '#2a9d8f' : '#2856a6',
                top: commitPos === -1 ? '-40px' : `${commitPos * 72 + 8}px`,
                opacity: commitPos === -1 ? 0 : 1,
                transform: `translateX(-50%) ${commitStatus === 'error' ? 'scale(1.2) rotate(10deg)' : 'scale(1)'}`
              }}
            >
               {commitStatus === 'spinning' && (
                 <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               )}
               {commitStatus === 'success' && (
                 <IconCheck />
               )}
               {commitStatus === 'error' && (
                 <div className="text-white"><IconBug /></div>
               )}
               {commitStatus === 'idle' && (
                 <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
               )}
            </div>
          </div>
        </div>

        {/* Banner Overlay */}
        {banner === 'success' && (
          <div className="absolute inset-0 bg-[#2a9d8f]/10 backdrop-blur-[1px] flex items-center justify-center z-30 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-[#2a9d8f] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2.5 animate-[bounceInUp_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
              <IconParty /> Deploy successful!
            </div>
          </div>
        )}
        {banner === 'error' && (
          <div className="absolute inset-0 bg-[#dc2626]/10 backdrop-blur-[1px] flex items-center justify-center z-30 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-[#dc2626] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2.5 animate-[shake_0.4s_ease-in-out]">
              <IconBug className="w-5 h-5" /> Bug reached production!
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Block Editor */}
      <div className="w-full md:w-7/12 lg:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white relative">
        {/* Fake Cursor */}
        <div
          className="absolute z-50 pointer-events-none flex items-start justify-start"
          style={{
            left: cursor.x,
            top: cursor.y,
            opacity: cursor.opacity,
            transform: `translate(-20%, -20%) scale(${cursor.clicked ? 0.8 : 1})`,
            transitionProperty: 'left, top, opacity, transform',
            transitionDuration: cursor.clicked ? '200ms' : '600ms',
            transitionTimingFunction: 'ease-in-out'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.84c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 00-.85.35z" fill="white" stroke="#1a1a2e" strokeWidth="1.5"/>
          </svg>
          
          {draggedItem && (
            <div className="absolute top-4 left-4 w-40 opacity-90 rotate-3 transition-transform animate-[fadeIn_0.2s_ease-out]">
               <div className="bg-white border-[1.5px] border-ink/20 shadow-lg p-2 rounded-xl flex items-center gap-2">
                 <div className="w-6 h-6 rounded-md bg-ink/5 text-ink flex items-center justify-center shrink-0">
                   {blocksMap[draggedItem].icon}
                 </div>
                 <div className="font-mono text-xs font-bold text-ink">{blocksMap[draggedItem].title}</div>
               </div>
            </div>
          )}
        </div>

        <div>
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-rust bg-rust/10 px-2.5 py-1 rounded-md">Interactive Lessons</span>
          <h3 className="font-sans text-xl font-bold text-ink tracking-tight mt-4 mb-2">Learn by doing, not reading</h3>
          <p className="text-sm text-pencil leading-relaxed">
            Every lesson is hands-on. Drag, build, and experiment — then see the results play out in real time. No passive videos. No walls of text.
          </p>
        </div>

        <div className="mt-6 bg-[#f8f6f2] border-[1.5px] border-ink/10 rounded-xl p-3 shadow-inner overflow-hidden relative min-h-[250px] flex flex-col gap-2.5">
          {placed.length === 0 && (
             <div className="absolute inset-0 m-3 border-2 border-dashed border-ink/15 rounded-xl flex items-center justify-center bg-white/50">
                <span className="text-ink/30 font-mono text-xs font-bold uppercase tracking-widest">Drop Blocks Here</span>
             </div>
          )}

          {placed.includes('build') && (
             <div className="bg-white border-[1.5px] border-orange/30 shadow-[0_2px_0_0_rgba(0,0,0,0.04)] p-2.5 rounded-xl flex items-center gap-3 animate-[dropInBlock_0.4s_ease-out] relative">
                {commitPos === 0 && <div className="absolute inset-0 border-2 border-rust rounded-xl opacity-50"></div>}
                <div className="w-9 h-9 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0"><IconBuild /></div>
                <div className="flex-1 min-w-0">
                   <div className="font-mono text-xs font-bold text-ink">Build Phase</div>
                   <div className="font-mono text-xs text-pencil truncate mt-0.5">run: npm run build</div>
                </div>
             </div>
          )}


          {placed.includes('test') && !isBroken && (
             <div className="bg-white border-[1.5px] border-[#2a9d8f]/30 shadow-[0_2px_0_0_rgba(0,0,0,0.04)] p-2.5 rounded-xl flex items-center gap-3 animate-[dropInBlock_0.4s_ease-out] relative">
                {commitPos === 1 && <div className="absolute inset-0 border-2 border-rust rounded-xl opacity-50"></div>}
                <div className="w-9 h-9 rounded-lg bg-[#2a9d8f]/10 text-[#2a9d8f] flex items-center justify-center shrink-0"><IconTest /></div>
                <div className="flex-1 min-w-0">
                   <div className="font-mono text-xs font-bold text-ink">Test Suite</div>
                   <div className="font-mono text-xs text-pencil truncate mt-0.5">run: npm run test</div>
                </div>
             </div>
          )}

          {placed.includes('lint') && (
             <div className="bg-white border-[1.5px] border-violet/30 shadow-[0_2px_0_0_rgba(0,0,0,0.04)] p-2.5 rounded-xl flex items-center gap-3 animate-[dropInBlock_0.4s_ease-out] relative">
                {commitPos === 2 && <div className="absolute inset-0 border-2 border-rust rounded-xl opacity-50"></div>}
                <div className="w-9 h-9 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0"><IconLint /></div>
                <div className="flex-1 min-w-0">
                   <div className="font-mono text-xs font-bold text-ink">Code Linter</div>
                   <div className="font-mono text-xs text-pencil truncate mt-0.5">run: eslint src/</div>
                </div>
             </div>
          )}

          {placed.includes('deploy') && (
             <div className="bg-white border-[1.5px] border-rust/30 shadow-[0_2px_0_0_rgba(0,0,0,0.04)] p-2.5 rounded-xl flex items-center gap-3 animate-[dropInBlock_0.4s_ease-out] relative">
                {commitPos === 3 && <div className="absolute inset-0 border-2 border-rust rounded-xl opacity-50"></div>}
                <div className="w-9 h-9 rounded-lg bg-rust/10 text-rust flex items-center justify-center shrink-0"><IconDeploy /></div>
                <div className="flex-1 min-w-0">
                   <div className="font-mono text-xs font-bold text-ink">Production Deploy</div>
                   <div className="font-mono text-xs text-pencil truncate mt-0.5">target: production</div>
                </div>
             </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: 'deploy', name: 'Deploy', icon: <IconDeploy />, color: 'border-rust/30 text-rust', bg: 'bg-rust/5' },
            { id: 'lint', name: 'Lint', icon: <IconLint />, color: 'border-violet/30 text-violet', bg: 'bg-violet/5' },
            { id: 'build', name: 'Build', icon: <IconBuild />, color: 'border-orange/30 text-orange', bg: 'bg-orange/5' },
            { id: 'notify', name: 'Notify', icon: <IconNotify />, color: 'border-ink/10 text-ink/40', bg: 'bg-ink/5' },
            { id: 'test', name: 'Test', icon: <IconTest />, color: 'border-[#2a9d8f]/30 text-[#2a9d8f]', bg: 'bg-[#2a9d8f]/5' },
            { id: 'rollback', name: 'Rollback', icon: <IconRollback />, color: 'border-ink/10 text-ink/40', bg: 'bg-ink/5' },
            { id: 'benchmark', name: 'Benchmark', icon: <IconBenchmark />, color: 'border-ink/10 text-ink/40', bg: 'bg-ink/5' },
          ].map(pill => {
            const isPlaced = placed.includes(pill.id);
            const isDragged = draggedItem === pill.id;

            return (
              <div
                key={pill.id}
                className={`px-3 py-1.5 rounded-lg border-[1.5px] font-mono text-xs font-bold transition-all duration-300 relative flex items-center gap-1.5
                  ${(isPlaced || isDragged) ? 'opacity-30 scale-95 grayscale' : pill.color} ${pill.bg}
                `}
              >
                <span className={isPlaced ? 'opacity-50' : 'opacity-80'}>{pill.icon}</span>
                {pill.name}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 2 — Certification Roadmap with stage-completing animation
// ═══════════════════════════════════════════════════════════════════
function CertRoadmapCard({ revealed }) {
  // Stages unlock sequentially after card is revealed
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!revealed) return;
    // Stage 1 fills immediately, then each next stage fills 800ms later
    const timers = [];
    for (let i = 0; i < 4; i++) {
      timers.push(setTimeout(() => setActiveStage(i + 1), 400 + i * 700));
    }
    return () => timers.forEach(clearTimeout);
  }, [revealed]);

  const stages = [
    { name: "Foundation", certs: ["CompTIA A+", "Google IT Support"], duration: "~2 mo" },
    { name: "Associate", certs: ["CompTIA Security+", "AWS Cloud Practitioner"], duration: "~3 mo" },
    { name: "Professional", certs: ["Cisco CCNA", "CompTIA CySA+"], duration: "~4 mo" },
    { name: "Expert", certs: ["CISSP", "AWS Solutions Architect"], duration: "~6 mo" },
  ];

  return (
    <Card revealed={revealed}>
      <div className="p-7">
        <h3 className="font-sans text-lg font-bold text-ink tracking-tight">Certification roadmap</h3>
        <p className="mt-1.5 text-sm text-pencil leading-relaxed">Industry-recognized certifications mapped stage by stage</p>

        <div className="mt-5 relative">
          {/* Timeline line that draws down as stages complete */}
          <div className="absolute left-[13px] top-[14px] w-[2px] bg-ink/[0.04]" style={{ height: "calc(100% - 28px)" }} />
          <div
            className="absolute left-[13px] top-[14px] w-[2px] bg-violet/40 rounded-full origin-top"
            style={{
              height: "calc(100% - 28px)",
              transform: `scaleY(${activeStage / 4})`,
              transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />

          {stages.map((stage, i) => {
            const isCompleted = activeStage > i;
            const isCurrent = activeStage === i + 1 && activeStage < 4;
            const isLast = i === 3 && activeStage >= 4;

            return (
              <div
                key={stage.name}
                className="flex gap-3.5 mb-5 last:mb-0 relative"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 500ms ${200 + i * 150}ms, transform 500ms ${200 + i * 150}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {/* Circle */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sans flex-shrink-0 relative z-[5] transition-all duration-500"
                  style={{
                    backgroundColor: isCompleted || isLast ? "#8b5cf6" : "transparent",
                    color: isCompleted || isLast ? "white" : "rgba(139,92,246,0.4)",
                    border: isCompleted || isLast ? "none" : "1.5px solid rgba(139,92,246,0.2)",
                    transform: (isCurrent || isLast) ? "scale(1.1)" : "scale(1)",
                    boxShadow: isCurrent ? "0 0 0 4px rgba(139,92,246,0.1)" : "none",
                  }}
                >
                  {isCompleted || isLast ? (
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6l2.5 2.5L9.5 4" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>

                {/* Stage info */}
                <div className="flex-1 min-w-0 pb-0.5">
                  <p className="text-xs font-semibold text-ink font-sans">{stage.name}</p>
                  {stage.certs.map(cert => (
                    <p key={cert} className="text-xs text-pencil leading-snug">{cert}</p>
                  ))}
                  <p
                    className="text-xs font-sans font-medium mt-0.5 transition-colors duration-300"
                    style={{ color: isCompleted || isLast ? "#8b5cf6" : "rgba(139,92,246,0.4)" }}
                  >
                    {stage.duration}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-pencil">42 certifications across 11 fields</p>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 3 — Job Opportunities
// ═══════════════════════════════════════════════════════════════════
function JobsCard({ revealed }) {
  const jobData = [
    { title: "SOC Analyst", company: "CyberDefend · Warsaw", salary: "6-9k PLN", color: "bg-emerald-50 text-emerald-600" },
    { title: "Cloud Intern", company: "Comarch · Krakow", salary: "4-6k PLN", color: "bg-amber-50 text-amber-600" },
    { title: "Data Analyst", company: "Allegro · Poznan", salary: "7-10k PLN", color: "bg-violet-50 text-violet" },
  ];

  return (
    <Card revealed={revealed}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-sans text-lg font-bold text-ink tracking-tight">Real opportunities</h3>
          <span className="inline-flex items-center rounded-full bg-orange/10 px-2 py-0.5 text-xs font-bold text-orange font-sans">28+</span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {jobData.map((job, i) => (
            <div
              key={job.title}
              className="bg-paper/50 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 500ms ${300 + i * 120}ms, transform 500ms ${300 + i * 120}ms`,
                transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink truncate">{job.title}</p>
                <p className="text-xs text-pencil truncate">{job.company}</p>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold whitespace-nowrap ${job.color}`}>
                {job.salary}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-pencil">Student positions in Poland</p>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 4 — Personalized Path
// ═══════════════════════════════════════════════════════════════════
function PersonalizedPathCard({ revealed }) {
  const [resultVisible, setResultVisible] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setResultVisible(true), 600);
    return () => clearTimeout(t);
  }, [revealed]);

  return (
    <Card revealed={revealed}>
      <div className="p-6">
        <h3 className="font-sans text-lg font-bold text-ink tracking-tight">Your path, personalized</h3>
        <p className="mt-1.5 text-sm text-pencil leading-relaxed">Tailored to your major and semester</p>

        {/* 3 steps */}
        <div className="mt-5 flex items-center">
          {["Year", "Program", "Field"].map((label, i) => (
            <div key={label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-all duration-500"
                  style={{
                    backgroundColor: revealed && i <= 1 ? "#2856a6" : "transparent",
                    color: revealed && i <= 1 ? "white" : "rgba(40,86,166,0.3)",
                    border: revealed && i <= 1 ? "none" : "1.5px dashed rgba(40,86,166,0.2)",
                    transitionDelay: `${300 + i * 200}ms`,
                  }}
                >
                  {i === 1 && revealed ? (
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8l3.5 3.5L13 5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-xs font-sans font-medium text-pencil">{label}</span>
              </div>
              {i < 2 && (
                <div
                  className="flex-1 h-0 mx-2 border-t border-dashed transition-colors duration-500"
                  style={{
                    borderColor: revealed ? "rgba(40,86,166,0.15)" : "rgba(40,86,166,0.05)",
                    transitionDelay: `${400 + i * 200}ms`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Result card */}
        <div
          className="mt-5 bg-paper rounded-lg px-3 py-2.5 border border-ink/6"
          style={{
            opacity: resultVisible ? 1 : 0,
            transform: resultVisible ? "translateY(0) scale(1)" : "translateY(6px) scale(0.97)",
            transition: "all 600ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p className="text-xs font-bold text-ink">Cybersecurity</p>
          <p className="text-xs text-pencil mt-0.5">4 stages · 8 certs · 12 jobs</p>
          <div className="mt-2 h-1.5 rounded-full bg-ink/5 overflow-hidden">
            <div className="h-full w-0 rounded-full bg-rust/30" />
          </div>
        </div>

        <p className="mt-4 text-xs text-pencil">Takes about 30 seconds</p>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 5 — Track Progress
// ═══════════════════════════════════════════════════════════════════
function ProgressCard({ revealed }) {
  return (
    <Card revealed={revealed}>
      <div className="p-6">
        <h3 className="font-sans text-lg font-bold text-ink tracking-tight">Track your progress</h3>

        <div className="mt-4">
          {/* XP */}
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="font-sans text-2xl font-bold text-ink tracking-tight">350</span>
            <span className="font-sans text-sm font-bold text-amber">XP</span>
            <span className="ml-auto inline-flex items-center rounded-full bg-amber/10 px-2 py-0.5 text-xs font-bold text-amber font-sans">Level 4</span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 rounded-full bg-amber/10 overflow-hidden mb-4 relative">
            <div
              className="h-full rounded-full bg-amber relative overflow-hidden"
              style={{
                width: revealed ? "65%" : "0%",
                transition: "width 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: revealed ? "shimmer 2.5s linear infinite 2s" : "none",
                }}
              />
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {[
              { bg: "bg-teal/10", color: "text-teal", icon: "M2.5 6l2.5 2.5L9.5 4" },
              { bg: "bg-violet/10", color: "text-violet", icon: "M6 1.5l1.3 2.7 3 .4-2.2 2.1.5 3L6 8.4l-2.6 1.3.5-3-2.2-2.1 3-.4L6 1.5z" },
              { bg: "bg-orange/10", color: "text-orange", icon: "M7 1L3.5 7H7l-.5 4L10 5H7l.5-4z" },
            ].map((badge, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ${badge.bg} flex items-center justify-center`}
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "scale(1)" : "scale(0)",
                  transition: `all 400ms cubic-bezier(0.34,1.56,0.64,1) ${600 + i * 150}ms`,
                }}
              >
                <svg viewBox="0 0 12 12" fill="none" className={`w-3.5 h-3.5 ${badge.color}`} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d={badge.icon} />
                </svg>
              </div>
            ))}
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[true, true, true, false, false].map((filled, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${filled ? "bg-amber" : "bg-ink/5"}`}
                  style={{ transitionDelay: revealed ? `${800 + i * 80}ms` : "0ms" }}
                >
                  {filled && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6l2 2L9.5 4" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs font-sans font-medium text-pencil">3-day streak</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BentoGrid — Main Export
// ═══════════════════════════════════════════════════════════════════
export default function BentoGrid() {
  const { ref, revealed } = useSequentialReveal(5);

  return (
    <>
      <style>{`
        @keyframes cursorBlink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes codePulse { 0%,100% { background-color:rgba(13,148,136,0.04) } 50% { background-color:rgba(13,148,136,0.12) } }
        @keyframes shimmer { 0% { transform:translateX(-100%) } 100% { transform:translateX(200%) } }
        @keyframes bentoFadeIn { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:translateY(0) } }
        @keyframes bounceInRight { 0% { opacity:0; transform:translateX(20px) } 60% { opacity:1; transform:translateX(-4px) } 100% { opacity:1; transform:translateX(0) } }
        @keyframes bounceInUp { 0% { opacity:0; transform:translateY(12px) } 60% { opacity:1; transform:translateY(-2px) } 100% { opacity:1; transform:translateY(0) } }
        @keyframes shake { 0%,100% { transform:translateX(0) } 25% { transform:translateX(-4px) } 75% { transform:translateX(4px) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes dropInBlock { 0% { opacity:0; transform:translateY(20px) scale(0.95) } 100% { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <LessonsCard revealed={revealed[0]} />
        <CertRoadmapCard revealed={revealed[1]} />
        <JobsCard revealed={revealed[2]} />
        <PersonalizedPathCard revealed={revealed[3]} />
        <ProgressCard revealed={revealed[4]} />
      </div>
    </>
  );
}
