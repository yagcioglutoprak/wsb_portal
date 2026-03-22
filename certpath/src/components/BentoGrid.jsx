import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    <Card revealed={revealed} className="md:col-span-2 lg:col-span-2 flex flex-col md:flex-row overflow-hidden min-h-[360px] md:min-h-[460px]">
      {/* Left Panel - Visuals */}
      <div className="w-full md:w-5/12 lg:w-1/2 bg-[#f8f6f2] relative border-b md:border-b-0 md:border-r border-ink/6 flex items-center justify-center p-4 sm:p-8 min-h-[240px] md:min-h-[320px]">
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
              return (
                <div key={stage.id} className="relative h-12 w-full flex items-center justify-center z-10">
                  {isPlaced && (
                    <div className="absolute inset-0 bg-[#fdfcfa] border-[1.5px] border-ink/12 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] rounded-xl flex items-center gap-3 px-4 animate-[bounceInRight_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
                      <span className={stage.color}>{stage.icon}</span>
                      <span className="text-sm font-bold text-ink">{stage.name}</span>
                    </div>
                  )}
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
                 <div className="w-2 h-2 bg-[#fdfcfa] rounded-full opacity-50"></div>
               )}
            </div>
          </div>
        </div>

        {/* Banner Overlay */}
        {banner === 'success' && (
          <div className="absolute inset-0 bg-[#2a9d8f]/10 backdrop-blur-[1px] flex items-center justify-center z-30 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-[#2a9d8f] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2.5 animate-[bounceInUp_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
              <IconParty /> {t("bento.deploySuccessful")}
            </div>
          </div>
        )}
        {banner === 'error' && (
          <div className="absolute inset-0 bg-[#dc2626]/10 backdrop-blur-[1px] flex items-center justify-center z-30 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-[#dc2626] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2.5 animate-[shake_0.4s_ease-in-out]">
              <IconBug className="w-5 h-5" /> {t("bento.bugReachedProd")}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Block Editor */}
      <div className="w-full md:w-7/12 lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center bg-[#fdfcfa] relative">
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
               <div className="bg-[#fdfcfa] border-[1.5px] border-ink/20 shadow-lg p-2 rounded-xl flex items-center gap-2">
                 <div className="w-6 h-6 rounded-md bg-ink/5 text-ink flex items-center justify-center shrink-0">
                   {blocksMap[draggedItem].icon}
                 </div>
                 <div className="font-mono text-xs font-bold text-ink">{blocksMap[draggedItem].title}</div>
               </div>
            </div>
          )}
        </div>

        <div>
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-rust bg-rust/10 px-2.5 py-1 rounded-md">{t("bento.interactiveLessons")}</span>
          <h3 className="font-sans text-xl font-bold text-ink tracking-tight mt-4 mb-2">{t("bento.learnByDoing")}</h3>
          <p className="text-sm text-pencil leading-relaxed">
            {t("bento.lessonDesc")}
          </p>
        </div>

        <div className="mt-6 bg-[#f8f6f2] border-[1.5px] border-ink/10 rounded-xl p-3 shadow-inner overflow-hidden relative h-[250px] flex flex-col gap-2.5">
          {placed.length === 0 && (
             <div className="absolute inset-0 m-3 border-2 border-dashed border-ink/15 rounded-xl flex items-center justify-center bg-white/50">
                <span className="text-ink/30 font-mono text-xs font-bold uppercase tracking-widest">{t("bento.dropBlocksHere")}</span>
             </div>
          )}

          {/* Always render all 4 slots to prevent layout shifts */}
          {[
            { id: 'build', label: 'Build Phase', sub: 'run: npm run build', icon: <IconBuild />, borderColor: 'border-orange/30', bgColor: 'bg-orange/10', textColor: 'text-orange', commitIdx: 0, showWhen: placed.includes('build') },
            { id: 'test', label: 'Test Suite', sub: 'run: npm run test', icon: <IconTest />, borderColor: 'border-[#2a9d8f]/30', bgColor: 'bg-[#2a9d8f]/10', textColor: 'text-[#2a9d8f]', commitIdx: 1, showWhen: placed.includes('test') && !isBroken },
            { id: 'lint', label: 'Code Linter', sub: 'run: eslint src/', icon: <IconLint />, borderColor: 'border-violet/30', bgColor: 'bg-violet/10', textColor: 'text-violet', commitIdx: 2, showWhen: placed.includes('lint') },
            { id: 'deploy', label: 'Production Deploy', sub: 'target: production', icon: <IconDeploy />, borderColor: 'border-rust/30', bgColor: 'bg-rust/10', textColor: 'text-rust', commitIdx: 3, showWhen: placed.includes('deploy') },
          ].map(slot => (
            <div key={slot.id} className={`transition-opacity duration-300 ${slot.showWhen ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 -my-1.5'}`}>
              {slot.showWhen && (
                <div className={`bg-[#fdfcfa] border-[1.5px] ${slot.borderColor} shadow-[0_2px_0_0_rgba(0,0,0,0.04)] p-2.5 rounded-xl flex items-center gap-3 animate-[dropInBlock_0.4s_ease-out] relative`}>
                  {commitPos === slot.commitIdx && <div className="absolute inset-0 border-2 border-rust rounded-xl opacity-50"></div>}
                  <div className={`w-9 h-9 rounded-lg ${slot.bgColor} ${slot.textColor} flex items-center justify-center shrink-0`}>{slot.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-bold text-ink">{slot.label}</div>
                    <div className="font-mono text-xs text-pencil truncate mt-0.5">{slot.sub}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
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
  const { t } = useTranslation();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!revealed) return;
    const timers = [];
    for (let i = 0; i < 4; i++) {
      timers.push(setTimeout(() => setActiveStage(i + 1), 400 + i * 700));
    }
    return () => timers.forEach(clearTimeout);
  }, [revealed]);

  const stages = [
    { name: "Foundation", provider: "CompTIA", cert: "Security+", icon: "S+", field: "cybersecurity", id: "security-plus" },
    { name: "Associate", provider: "AWS", cert: "Cloud Pract.", icon: "CP", field: "cloud-engineering", id: "aws-cloud-practitioner" },
    { name: "Professional", provider: "Cisco", cert: "CCNA", icon: "CC", field: "networking", id: "cisco-ccna" },
    { name: "Expert", provider: "ISC2", cert: "CISSP", icon: "CS", field: "cybersecurity", id: "cissp" },
  ];

  return (
    <Card revealed={revealed} className="flex flex-col">
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet/10 text-violet flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l8.38-4.36a1 1 0 0 0 0-1.78L12 4.5 3.62 8.86a1 1 0 0 0 0 1.78L12 15z"></path><path d="m3.62 12.14 8.38 4.36 8.38-4.36"></path><path d="m3.62 16.14 8.38 4.36 8.38-4.36"></path></svg>
          </div>
          <div>
             <h3 className="font-sans text-xl font-bold text-ink tracking-tight leading-none">{t("bento.certRoadmap")}</h3>
             <p className="text-xs text-pencil mt-1">{t("bento.industryStages")}</p>
          </div>
        </div>

        <div className="relative pl-4">
          {/* Track line — clipped to first/last node centers */}
          <div className="absolute left-[27px] top-[11px] bottom-[11px] w-[2px] bg-ink/5" />
          <div
            className="absolute left-[27px] top-[11px] bottom-[11px] w-[2px] bg-violet rounded-full origin-top"
            style={{
              transform: `scaleY(${activeStage / 4})`,
              transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />

          <div className="flex flex-col gap-4">
          {stages.map((stage, i) => {
            const isCompleted = activeStage > i;
            const isCurrent = activeStage === i + 1 && activeStage < 4;
            const isLast = i === 3 && activeStage >= 4;
            const isActive = isCompleted || isLast;

            return (
              <div
                key={stage.name}
                className="relative flex items-center gap-4 group"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateX(0)" : "translateX(-8px)",
                  transition: `all 500ms cubic-bezier(0.16,1,0.3,1) ${200 + i * 150}ms`,
                }}
              >
                {/* Timeline Node */}
                <div
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 bg-[#fdfcfa]"
                  style={{
                    border: `2px solid ${isActive ? '#8b5cf6' : 'rgba(20,20,43,0.1)'}`,
                    boxShadow: isCurrent ? "0 0 0 4px rgba(139,92,246,0.15)" : "none",
                  }}
                >
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${isActive ? 'bg-violet' : 'bg-transparent'}`} />
                </div>

                {/* Content Card (Clickable Link) */}
                <Link
                  to={`/fields/${stage.field}/certs/${stage.id}`}
                  className={`flex-1 bg-[#fdfcfa] border-[1.5px] rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 ${isActive ? 'border-violet/30 shadow-[0_2px_8px_rgba(139,92,246,0.08)] hover:border-violet/60 hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)]' : 'border-ink/5 hover:border-ink/15 hover:shadow-sm'}`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-colors duration-500 shrink-0 ${isActive ? 'bg-violet/10 text-violet' : 'bg-ink/5 text-pencil'}`}>
                    {stage.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-pencil truncate">{stage.name}</p>
                    <p className={`text-sm font-bold transition-colors duration-500 truncate ${isActive ? 'text-ink group-hover:text-violet' : 'text-graphite group-hover:text-ink'}`}>{stage.cert}</p>
                  </div>
                </Link>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 3 — Job Opportunities
// ═══════════════════════════════════════════════════════════════════
function JobsCard({ revealed }) {
  const { t } = useTranslation();
  const typeStyle = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
  };

  const jobData = [
    { title: "SOC Analyst", company: "CyberDefend", location: "Warsaw", type: "Working Student", salary: "6-9k", color: "sky" },
    { title: "Cloud Intern", company: "Comarch", location: "Krakow", type: "Internship", salary: "4-6k", color: "emerald" },
    { title: "Data Analyst", company: "Allegro", location: "Poznan", type: "Internship", salary: "7-10k", color: "emerald" },
  ];

  return (
    <Card revealed={revealed} className="flex flex-col">
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rust/10 text-rust flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <div>
               <h3 className="font-sans text-xl font-bold text-ink tracking-tight leading-none">{t("bento.realOpportunities")}</h3>
               <p className="text-xs text-pencil mt-1">{t("bento.studentJobs")}</p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-rust/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rust border border-rust/20 shrink-0">{t("bento.live")}</span>
        </div>

        <div className="flex flex-col gap-3 flex-1 justify-center">
          {jobData.map((job, i) => (
            <div
              key={job.title}
              className="group relative bg-[#fdfcfa] border-[1.5px] border-ink/8 hover:border-rust/40 rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:-translate-y-0.5"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateX(0)" : "translateX(-12px)",
                transition: `all 500ms cubic-bezier(0.16,1,0.3,1) ${300 + i * 120}ms`,
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-ink group-hover:text-rust transition-colors leading-tight">{job.title}</h4>
                  <p className="text-xs font-medium text-pencil mt-1">{job.company} &middot; {job.location}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-rust/5 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rust"><path d="M6 3L11 8L6 13"/></svg>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeStyle[job.color]}`}>
                  {job.type}
                </span>
                <span className="font-mono text-xs font-bold text-ink">
                  {job.salary} <span className="text-[10px] text-pencil font-sans uppercase tracking-wider">PLN</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 4 — Personalized Path
// ═══════════════════════════════════════════════════════════════════
function PersonalizedPathCard({ revealed }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!revealed) return;
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [revealed]);

  return (
    <Card revealed={revealed} className="flex flex-col">
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          </div>
          <div>
             <h3 className="font-sans text-xl font-bold text-ink tracking-tight leading-none">{t("bento.yourPath")}</h3>
             <p className="text-xs text-pencil mt-1">{t("bento.takes30s")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 justify-center">
          {/* Form Rows */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between bg-ink/[0.02] border-[1.5px] border-ink/5 rounded-xl px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-pencil w-16">Year</span>
              {step >= 1 ? (
                 <span className="text-sm font-bold text-ink animate-[fadeIn_0.3s_ease-out]">2nd Year</span>
              ) : (
                 <span className="w-1.5 h-3.5 bg-rust animate-pulse"></span>
              )}
            </div>
            
            <div className="flex items-center justify-between bg-ink/[0.02] border-[1.5px] border-ink/5 rounded-xl px-4 py-3" style={{ opacity: step >= 1 ? 1 : 0.4, transition: "opacity 0.3s" }}>
              <span className="text-xs font-bold uppercase tracking-wider text-pencil w-16">Major</span>
              {step >= 2 ? (
                 <span className="text-sm font-bold text-ink animate-[fadeIn_0.3s_ease-out]">Computer Science</span>
              ) : step >= 1 ? (
                 <span className="w-1.5 h-3.5 bg-rust animate-pulse"></span>
              ) : null}
            </div>

            <div className="flex items-center justify-between bg-ink/[0.02] border-[1.5px] border-ink/5 rounded-xl px-4 py-3" style={{ opacity: step >= 2 ? 1 : 0.4, transition: "opacity 0.3s" }}>
              <span className="text-xs font-bold uppercase tracking-wider text-pencil w-16">Goal</span>
              {step >= 3 ? (
                 <span className="text-sm font-bold text-ink animate-[fadeIn_0.3s_ease-out]">Cybersecurity</span>
              ) : step >= 2 ? (
                 <span className="w-1.5 h-3.5 bg-rust animate-pulse"></span>
              ) : null}
            </div>
          </div>

          {/* Generated Result */}
          <div
            className="mt-1 bg-[#2856a6] text-white rounded-xl p-4 shadow-[0_8px_16px_rgba(40,86,166,0.15)] relative overflow-hidden"
            style={{
              opacity: step >= 3 ? 1 : 0,
              transform: step >= 3 ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
              transition: "all 600ms cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 animate-[shimmer_2.5s_infinite]" />
            <div className="flex justify-between items-center relative z-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">{t("bento.pathGenerated")}</p>
                <p className="text-base font-bold">{t("bento.cybersecurityAnalyst")}</p>
                <p className="text-xs text-white/80 mt-1">{t("bento.pathStats")}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3L11 8L5 13"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CARD 5 — Track Progress
// ═══════════════════════════════════════════════════════════════════
function ProgressCard({ revealed }) {
  const { t } = useTranslation();
  return (
    <Card revealed={revealed} className="flex flex-col">
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber/10 text-amber flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div>
             <h3 className="font-sans text-xl font-bold text-ink tracking-tight leading-none">{t("bento.trackProgress")}</h3>
             <p className="text-xs text-pencil mt-1">{t("bento.stayConsistent")}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6">
          {/* XP & Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-5xl font-bold text-arcade drop-shadow-[0_2px_8px_rgba(255,176,32,0.3)]">350</span>
              <span className="font-sans text-sm font-bold uppercase tracking-wider text-arcade">XP</span>
            </div>
            <div className="bg-[#fdfcfa] border-[1.5px] border-ink/10 shadow-sm rounded-xl px-4 py-2 flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-pencil">{t("bento.current")}</span>
              <span className="text-base font-bold text-ink">Level 4</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-pencil mb-2.5">
              <span>Level 4</span>
              <span>Level 5</span>
            </div>
            <div className="h-3 rounded-full bg-ink/5 overflow-hidden relative shadow-inner">
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
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    animation: revealed ? "shimmer 2.5s linear infinite 2s" : "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-[#fdfcfa] border-[1.5px] border-ink/8 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-10 shrink-0 relative flex items-center justify-center">
                 <svg viewBox="0 0 32 40" className="w-full h-full absolute inset-0">
                    <ellipse cx="16" cy="30" rx="9" ry="14" fill="#F0562E" opacity="0.45" style={{ transformOrigin: "16px 34px", animation: "flameSway 3s ease-in-out infinite" }} />
                    <ellipse cx="16" cy="31" rx="6" ry="11" fill="#f97316" opacity="0.75" style={{ transformOrigin: "16px 34px", animation: "flameSway 2.2s ease-in-out infinite .3s" }} />
                    <ellipse cx="16" cy="32" rx="3.5" ry="8" fill="#FFB020" opacity="1" style={{ transformOrigin: "16px 34px", animation: "flameSway 1.6s ease-in-out infinite .1s" }} />
                 </svg>
                 <span className="relative z-10 text-white font-mono text-xs font-bold pt-2 drop-shadow-md">3</span>
              </div>
              <div>
                <p className="text-sm font-bold text-ink leading-tight">{t("bento.dayStreak")}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-pencil mt-0.5">{t("bento.keepBurning")}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {['M','T','W'].map((day, i) => (
                <div key={day} className="w-7 h-7 rounded-md bg-amber text-white flex items-center justify-center text-xs font-bold shadow-[0_2px_0_0_rgba(245,158,11,0.4)]" style={{ opacity: revealed ? 1 : 0, transform: revealed ? "scale(1)" : "scale(0.8)", transition: `all 300ms cubic-bezier(0.34,1.56,0.64,1) ${800 + i*100}ms` }}>{day}</div>
              ))}
              <div className="w-7 h-7 rounded-md bg-ink/5 border border-ink/10 text-pencil flex items-center justify-center text-xs font-bold" style={{ opacity: revealed ? 1 : 0, transition: `opacity 300ms 1100ms` }}>T</div>
            </div>
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
        @keyframes flameSway { 0%,100%{transform:translateX(0) scaleY(1)} 33%{transform:translateX(-1px) scaleY(1.04)} 66%{transform:translateX(1px) scaleY(.97)} }
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
