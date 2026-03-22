import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from "react-i18next";

const MAZE = [
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0]
];

function getNeighbors(r, c) {
  // Right, Down, Left, Up
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]; 
  const valid = [];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < 7 && nc >= 0 && nc < 7 && MAZE[nr][nc] === 0) {
      valid.push([nr, nc]);
    }
  }
  return valid;
}

function solveMaze(isBFS) {
  const start = [0, 0];
  const goal = [6, 6];
  const frontier = [{ pos: start, path: [start] }];
  const visited = new Set();
  visited.add('0,0');
  
  const order = [];
  let finalPath = [];
  
  while (frontier.length > 0) {
    const current = isBFS ? frontier.shift() : frontier.pop();
    const { pos, path } = current;
    order.push(pos);
    
    if (pos[0] === goal[0] && pos[1] === goal[1]) {
      finalPath = path;
      break;
    }
    
    const neighbors = getNeighbors(pos[0], pos[1]);
    for (const [nr, nc] of neighbors) {
      const key = `${nr},${nc}`;
      if (!visited.has(key)) {
        visited.add(key);
        frontier.push({ pos: [nr, nc], path: [...path, [nr, nc]] });
      }
    }
  }
  
  return { order, path: finalPath };
}

const bfsData = solveMaze(true);
const dfsData = solveMaze(false);

const ITEM_COLORS = {
  1: 'bg-[#f4a261] shadow-[0_4px_12px_rgba(244,162,97,0.3)]',
  2: 'bg-[#e76f51] shadow-[0_4px_12px_rgba(231,111,81,0.3)]',
  3: 'bg-[#2a9d8f] shadow-[0_4px_12px_rgba(42,157,143,0.3)]',
  4: 'bg-[#8338ec] shadow-[0_4px_12px_rgba(131,56,236,0.3)]'
};

function Scene1({ onComplete }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [exitingItem, setExitingItem] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setItems([1]), 200);
    const t2 = setTimeout(() => setItems([2, 1]), 500);
    const t3 = setTimeout(() => setItems([3, 2, 1]), 800);
    const t4 = setTimeout(() => setItems([4, 3, 2, 1]), 1100);
    
    // Queue: first in (1) is first out
    const t5 = setTimeout(() => setExitingItem(1), 1800);
    
    const t6 = setTimeout(() => onComplete(), 3000);

    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, [onComplete]);

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-8 items-stretch bg-[#fdf8f5] min-h-[320px] sm:min-h-[420px] w-full relative">
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center gap-4 bg-[#fdfcfa] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#e8ded1] p-6">
         <div className="relative h-48 w-24 flex flex-col justify-end gap-2 overflow-hidden items-center border-x-2 border-[#e8ded1] p-2 bg-[#fdf8f5]">
             {items.map(id => (
                 <div key={id} className={`w-16 min-h-[32px] ${ITEM_COLORS[id]} text-white font-bold flex items-center justify-center rounded-lg ${exitingItem === id ? 'translate-y-16 opacity-0 transition-all duration-300 ease-in' : 'animate-pop'}`}>
                     {id}
                 </div>
             ))}
         </div>
         <div className="text-xs font-bold text-pencil uppercase tracking-wide">{t("homepageLesson.fifo")}</div>
      </div>
      <div className="w-full lg:w-7/12 flex flex-col justify-center">
         <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md tracking-wider w-max mb-3">{t("homepageLesson.concept")}</span>
         <h3 className="font-sans text-2xl font-bold text-ink tracking-tight mb-4">{t("homepageLesson.meetQueue")}</h3>
         <p className="text-base text-ink/70 leading-relaxed">
           A <strong className="text-[#f4a261] underline underline-offset-4 decoration-2">queue</strong> is first in, first out — just like a line at a coffee shop. The person who arrived first gets served first. BFS uses a queue to explore a maze layer by layer.
         </p>
      </div>
    </div>
  );
}

function Scene2({ onComplete }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [exitingItem, setExitingItem] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setItems([1]), 200);
    const t2 = setTimeout(() => setItems([2, 1]), 500);
    const t3 = setTimeout(() => setItems([3, 2, 1]), 800);
    const t4 = setTimeout(() => setItems([4, 3, 2, 1]), 1100);
    
    // Stack: last in (4) is first out
    const t5 = setTimeout(() => setExitingItem(4), 1800);
    
    const t6 = setTimeout(() => onComplete(), 3000);

    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, [onComplete]);

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-8 items-stretch bg-[#fdf8f5] min-h-[320px] sm:min-h-[420px] w-full relative">
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center gap-4 bg-[#fdfcfa] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#e8ded1] p-6">
         <div className="relative h-48 w-24 flex flex-col justify-end gap-2 overflow-hidden items-center border-x-2 border-b-2 border-[#e8ded1] rounded-b-xl p-2 bg-[#fdf8f5]">
             {items.map(id => (
                 <div key={id} className={`w-16 min-h-[32px] ${ITEM_COLORS[id]} text-white font-bold flex items-center justify-center rounded-lg ${exitingItem === id ? '-translate-y-16 opacity-0 transition-all duration-300 ease-in' : 'animate-pop'}`}>
                     {id}
                 </div>
             ))}
         </div>
         <div className="text-xs font-bold text-pencil uppercase tracking-wide">{t("homepageLesson.lifo")}</div>
      </div>
      <div className="w-full lg:w-7/12 flex flex-col justify-center">
         <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md tracking-wider w-max mb-3">{t("homepageLesson.concept")}</span>
         <h3 className="font-sans text-2xl font-bold text-ink tracking-tight mb-4">{t("homepageLesson.nowTheStack")}</h3>
         <p className="text-base text-ink/70 leading-relaxed">
           A <strong className="text-[#8338ec] underline underline-offset-4 decoration-2">stack</strong> is last in, first out — like a pile of plates. The most recent item added is the first one removed. DFS uses a stack to dive deep into one path before backtracking.
         </p>
      </div>
    </div>
  );
}

function Scene3({ runMode, onComplete }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState("idle");
  const [visitedIndex, setVisitedIndex] = useState(-1);
  const [pathIndex, setPathIndex] = useState(-1);
  const [activeLine, setActiveLine] = useState(null);
  
  const dropZone1Ref = useRef(null);
  const dropZone2Ref = useRef(null);
  const dropZone3Ref = useRef(null);

  const pillSetRef = useRef(null);
  const pillPopBfsRef = useRef(null);
  const pillPopDfsRef = useRef(null);
  const pillVisitedRef = useRef(null);
  const movingPillContainerRef = useRef(null);
  
  const [pill1Style, setPill1Style] = useState({ opacity: 0 });
  const [pill2Style, setPill2Style] = useState({ opacity: 0 });
  const [pill3Style, setPill3Style] = useState({ opacity: 0 });

  const data = runMode === 'bfs' ? bfsData : dfsData;

  const animatePill = (sourceNode, targetNode, setStyle) => {
    const containerNode = movingPillContainerRef.current;
    if (sourceNode && targetNode && containerNode) {
      const srcRect = sourceNode.getBoundingClientRect();
      const tgtRect = targetNode.getBoundingClientRect();
      const containerRect = containerNode.getBoundingClientRect();
      
      setStyle({
        opacity: 1,
        transform: `translate(${srcRect.left - containerRect.left}px, ${srcRect.top - containerRect.top}px)`,
        transition: 'none'
      });
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setStyle({
            opacity: 1,
            transform: `translate(${tgtRect.left - containerRect.left + 2}px, ${tgtRect.top - containerRect.top + 1}px)`,
            transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          });
        });
      });
    }
  };

  useEffect(() => {
    let timer;
    if (phase === "idle") {
      timer = setTimeout(() => setPhase("anim_pill_1"), 1000);
    } else if (phase === "anim_pill_1") {
      animatePill(pillSetRef.current, dropZone1Ref.current, setPill1Style);
      timer = setTimeout(() => setPhase("anim_pill_2"), 900);
    } else if (phase === "anim_pill_2") {
      const srcNode = runMode === 'bfs' ? pillPopBfsRef.current : pillPopDfsRef.current;
      animatePill(srcNode, dropZone2Ref.current, setPill2Style);
      timer = setTimeout(() => setPhase("anim_pill_3"), 900);
    } else if (phase === "anim_pill_3") {
      animatePill(pillVisitedRef.current, dropZone3Ref.current, setPill3Style);
      timer = setTimeout(() => setPhase("running"), 900);
    } else if (phase === "done") {
      timer = setTimeout(() => setPhase("reset"), 2500);
    } else if (phase === "reset") {
      setVisitedIndex(-1);
      setPathIndex(-1);
      setActiveLine(null);
      setPill1Style({ opacity: 0 });
      setPill2Style({ opacity: 0 });
      setPill3Style({ opacity: 0 });
      timer = setTimeout(() => {
        onComplete();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [phase, runMode, onComplete]);

  useEffect(() => {
    let cellTimer;
    let lineTimer;
    
    if (phase === "running") {
      const order = data.order;
      
      let curVisIdx = -1;
      cellTimer = setInterval(() => {
        curVisIdx++;
        if (curVisIdx < order.length) {
          setVisitedIndex(curVisIdx);
        } else {
          clearInterval(cellTimer);
          clearInterval(lineTimer);
          setActiveLine(7);
          setPhase("path");
        }
      }, 120);

      const loopLines = [4, 5, 6, 8, 9, 10];
      let lineIdx = 0;
      setActiveLine(loopLines[0]);
      lineTimer = setInterval(() => {
        lineIdx = (lineIdx + 1) % loopLines.length;
        setActiveLine(loopLines[lineIdx]);
      }, 300);
      
    } else if (phase === "path") {
      const path = data.path;
      
      let curPathIdx = -1;
      cellTimer = setInterval(() => {
        curPathIdx++;
        if (curPathIdx < path.length) {
          setPathIndex(curPathIdx);
        } else {
          clearInterval(cellTimer);
          setPhase("done");
        }
      }, 80);
    }
    
    return () => {
      clearInterval(cellTimer);
      clearInterval(lineTimer);
    };
  }, [phase, data]);

  const visitedSet = useMemo(() => {
    const set = new Set();
    const order = data.order;
    for (let i = 0; i <= visitedIndex && i < order.length; i++) {
      set.add(`${order[i][0]},${order[i][1]}`);
    }
    return set;
  }, [data, visitedIndex]);

  const pathSet = useMemo(() => {
    const set = new Set();
    const path = data.path;
    for (let i = 0; i <= pathIndex && i < path.length; i++) {
      set.add(`${path[i][0]},${path[i][1]}`);
    }
    return set;
  }, [data, pathIndex]);

  const renderCodeLine = (lineNum) => {
    const isAct = activeLine === lineNum;
    const baseClass = "px-2 py-0.5 transition-colors duration-150 flex items-center min-h-[28px]";
    const actClass = isAct ? "bg-[rgba(40,86,166,0.3)] border-l-2 border-[#2856a6]" : "border-l-2 border-transparent";
    
    const wrapper = (children) => (
      <div className={`${baseClass} ${actClass}`}>
        <span className="text-white/30 w-6 shrink-0 select-none">{lineNum}</span>
        <div className="flex items-center whitespace-pre">{children}</div>
      </div>
    );

    switch (lineNum) {
      case 1: return wrapper(<><span className="text-[#2a9d8f] font-bold">def</span> search(maze, start, goal):</>);
      case 2: return wrapper(<>  frontier = [start]</>);
      case 3: return wrapper(
        <>
          {"  visited = "}
          <span 
            ref={dropZone1Ref}
            className={`inline-flex items-center justify-center w-[40px] h-[22px] border-2 border-dashed mx-0.5 align-middle rounded-md ${
              ["idle", "anim_pill_1", "reset"].includes(phase) ? "border-white/30" : "border-transparent"
            }`} 
          >
            {!["idle", "anim_pill_1", "reset"].includes(phase) && (
              <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-1.5 py-[1px] font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] scale-in-center leading-none">
                set
              </div>
            )}
          </span>
          ()
        </>
      );
      case 4: return wrapper(<>  <span className="text-[#2a9d8f] font-bold">while</span> frontier:</>);
      case 5: return wrapper(
        <>
          {"    current = frontier"}
          <span 
            ref={dropZone2Ref}
            className={`inline-flex items-center justify-center w-[64px] h-[22px] border-2 border-dashed ml-0.5 align-middle rounded-md ${
              ["idle", "anim_pill_1", "anim_pill_2", "reset"].includes(phase) ? "border-white/30" : "border-transparent"
            }`} 
          >
            {!["idle", "anim_pill_1", "anim_pill_2", "reset"].includes(phase) && (
              <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-1.5 py-[1px] font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] scale-in-center leading-none">
                {runMode === 'bfs' ? '.pop(0)' : '.pop()'}
              </div>
            )}
          </span>
        </>
      );
      case 6: return wrapper(<>    <span className="text-[#2a9d8f] font-bold mr-1">if</span><span className="bg-[rgba(255,255,255,0.08)] rounded px-1.5 py-0.5">current == goal</span>:</>);
      case 7: return wrapper(<>      <span className="text-[#2a9d8f] font-bold">return</span> trace_path()</>);
      case 8: return wrapper(<>    <span className="text-[#2a9d8f] font-bold mr-1">for</span>n <span className="text-[#2a9d8f] font-bold mx-1">in</span>adjacent(current):</>);
      case 9: return wrapper(
        <>
          {"      "}<span className="text-[#2a9d8f] font-bold mr-1">if</span>
          <span className="bg-[rgba(255,255,255,0.08)] rounded px-1.5 py-[2px] inline-flex items-center">
            n not in
            <span 
              ref={dropZone3Ref}
              className={`inline-flex items-center justify-center w-[64px] h-[20px] border-2 border-dashed ml-1.5 align-middle rounded-md ${
                ["idle", "anim_pill_1", "anim_pill_2", "anim_pill_3", "reset"].includes(phase) ? "border-white/30" : "border-transparent"
              }`} 
            >
              {!["idle", "anim_pill_1", "anim_pill_2", "anim_pill_3", "reset"].includes(phase) && (
                <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-1.5 py-[1px] font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] scale-in-center leading-none">
                  visited
                </div>
              )}
            </span>
          </span>:
        </>
      );
      case 10: return wrapper(<>        frontier.append(n)</>);
      default: return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-8 items-stretch bg-[#fdf8f5] min-h-[320px] sm:min-h-[420px] w-full relative">
      {/* Moving Pill Overlay */}
      <div ref={movingPillContainerRef} className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <div 
          className={`absolute top-0 left-0 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-1.5 py-[1px] font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] flex items-center justify-center min-w-[32px] ${phase === 'anim_pill_1' ? 'opacity-100' : 'opacity-0'}`}
          style={pill1Style}
        >
          set
        </div>
        <div 
          className={`absolute top-0 left-0 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-1.5 py-[1px] font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] flex items-center justify-center min-w-[48px] ${phase === 'anim_pill_2' ? 'opacity-100' : 'opacity-0'}`}
          style={pill2Style}
        >
          {runMode === 'bfs' ? '.pop(0)' : '.pop()'}
        </div>
        <div 
          className={`absolute top-0 left-0 bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-1.5 py-[1px] font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] flex items-center justify-center min-w-[48px] ${phase === 'anim_pill_3' ? 'opacity-100' : 'opacity-0'}`}
          style={pill3Style}
        >
          visited
        </div>
      </div>

      {/* Left: Maze */}
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-between gap-6">
        <div className="grid grid-cols-7 gap-1 w-full max-w-[240px] p-2 bg-[#fdfcfa] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#e8ded1]">
          {MAZE.map((row, r) => row.map((cell, c) => {
            const isWall = cell === 1;
            const isStart = r === 0 && c === 0;
            const isGoal = r === 6 && c === 6;
            const isPath = pathSet.has(`${r},${c}`);
            const isVisited = visitedSet.has(`${r},${c}`);
            
            return (
              <div key={`${r}-${c}`} className={`aspect-square rounded relative flex items-center justify-center overflow-hidden ${isWall ? 'bg-[#2b2d42] shadow-inner' : 'bg-[#fdfcfa] border border-[#edf2f4]'}`}>
                {!isWall && isVisited && !isPath && (
                  <div className={`absolute inset-0 ${runMode === 'bfs' ? 'bg-[#f4a261]/40' : 'bg-[#4ea8de]/40'} animate-pop`} style={{ boxShadow: runMode === 'bfs' ? '0 0 12px rgba(244,162,97,0.5)' : '0 0 12px rgba(78,168,222,0.5)' }} />
                )}
                {!isWall && isPath && (
                  <div className="absolute inset-0 bg-[#2a9d8f] animate-pop z-10" style={{ boxShadow: '0 0 15px rgba(42,157,143,0.6), inset 0 0 0 1px rgba(255,255,255,0.2)' }} />
                )}
                {isStart && !isPath && (
                  <div className="absolute inset-0 bg-[#e9c46a] animate-pop flex items-center justify-center z-10 shadow-[0_0_10px_rgba(233,196,106,0.6)]">
                    <span className="font-bold text-xs text-[#855a00]">S</span>
                  </div>
                )}
                {isGoal && !isPath && (
                  <div className="absolute inset-0 bg-[#e76f51] animate-pop flex items-center justify-center z-10 shadow-[0_0_10px_rgba(231,111,81,0.6)]">
                    <span className="font-bold text-xs text-white">G</span>
                  </div>
                )}
                {isPath && (isStart || isGoal) && (
                  <span className="relative z-20 font-bold text-xs text-white">{isStart ? 'S' : 'G'}</span>
                )}
              </div>
            );
          }))}
        </div>
        
        {/* Status Line */}
        <div className="h-8 flex items-center justify-center w-full bg-[#fdfcfa] rounded-lg border border-[#e8ded1] shadow-sm">
          {["idle", "anim_pill_1", "anim_pill_2", "anim_pill_3", "reset"].includes(phase) ? (
            <span className="text-xs text-pencil font-medium animate-pulse">{t("homepageLesson.waitingForAlgorithm")}</span>
          ) : phase === "done" || phase === "path" ? (
            <span className="text-xs text-[#2a9d8f] font-bold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              {t("homepageLesson.pathFound", { steps: data.path.length })}
            </span>
          ) : (
            <span className={`text-xs font-medium ${runMode === 'bfs' ? 'text-[#e76f51]' : 'text-[#4ea8de]'}`}>
              {runMode === 'bfs' ? t("homepageLesson.bfsExploring") : t("homepageLesson.dfsExploring")}
            </span>
          )}
        </div>
      </div>

      {/* Right: Code & Controls */}
      <div className="w-full lg:w-7/12 flex flex-col justify-between gap-5">
        {/* Code Block */}
        <div className="bg-[#1a1a2e] rounded-xl p-4 font-mono text-[13px] text-white/80 shadow-inner overflow-x-auto w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={i}>
              {renderCodeLine(i + 1)}
            </React.Fragment>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex flex-wrap gap-2">
            <div 
              ref={pillSetRef} 
              className={`bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-2 py-0.5 font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] transition-opacity duration-200 ${["idle", "reset"].includes(phase) ? "opacity-100" : "opacity-0"}`}
            >
              set
            </div>
            
            <div 
              ref={pillPopBfsRef} 
              className={`bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-2 py-0.5 font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] transition-opacity duration-200 ${runMode === 'bfs' && !["idle", "anim_pill_1", "reset"].includes(phase) ? "opacity-0" : "opacity-100"}`}
            >
              .pop(0)
            </div>

            <div 
              ref={pillPopDfsRef} 
              className={`bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-2 py-0.5 font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] transition-opacity duration-200 ${runMode === 'dfs' && !["idle", "anim_pill_1", "reset"].includes(phase) ? "opacity-0" : "opacity-100"}`}
            >
              .pop()
            </div>

            <div 
              ref={pillVisitedRef} 
              className={`bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-2 py-0.5 font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)] transition-opacity duration-200 ${["idle", "anim_pill_1", "anim_pill_2", "reset"].includes(phase) ? "opacity-100" : "opacity-0"}`}
            >
              visited
            </div>

            <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-2 py-0.5 font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">list</div>
            <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-2 py-0.5 font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">frontier</div>
            <div className="bg-[#fdfcfa] border-[1.5px] border-ink/12 rounded-md px-2 py-0.5 font-mono text-xs text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.06)]">current</div>
          </div>
          
          <div className="flex justify-end">
            <button className={`bg-rust text-white rounded-xl px-5 py-2 font-sans text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${phase === 'running' && visitedIndex < 2 ? 'scale-95 bg-rust/90' : 'scale-100'} ${phase === 'idle' ? 'animate-pulse' : ''}`}>
              <span className="text-xs">▶</span> {t("homepageLesson.run")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene4({ onComplete }) {
  const { t } = useTranslation();
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAnswered(true), 1500);
    const t2 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className="flex flex-col p-6 gap-8 items-center justify-center bg-[#fdf8f5] min-h-[320px] sm:min-h-[420px] w-full relative">
        <div className="w-full max-w-lg">
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md tracking-wider mb-4 block w-max mx-auto">{t("homepageLesson.quickCheck")}</span>
            <h3 className="font-sans text-xl font-bold text-ink tracking-tight mb-8 text-center">{t("homepageLesson.quizQuestion")}</h3>
            
            <div className="flex flex-col gap-3">
                {/* Option A */}
                <div className={`border-[1.5px] rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${answered ? 'border-[#e8ded1] bg-[#fdfcfa] opacity-40' : 'border-[#e8ded1] bg-[#fdfcfa] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-ink/20'}`}>
                    <span className="font-medium text-ink">{t("homepageLesson.optionA")}</span>
                    <div className="w-5 h-5 rounded-full border border-ink/20" />
                </div>
                
                {/* Option B */}
                <div className={`border-[1.5px] rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${answered ? 'border-[#10b981] bg-[#10b981]/10 shadow-[0_4px_20px_rgba(16,185,129,0.15)] scale-[1.02]' : 'border-[#e8ded1] bg-[#fdfcfa] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-ink/20'}`}>
                    <span className={`font-medium transition-colors duration-300 ${answered ? 'text-[#10b981] font-bold' : 'text-ink'}`}>{t("homepageLesson.optionB")}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${answered ? 'bg-[#10b981] border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'border border-ink/20'}`}>
                        {answered && <svg className="w-3 h-3 text-white scale-in-center" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                    </div>
                </div>
            </div>

            <div className={`text-center mt-6 transition-all duration-300 ${answered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <span className="text-[#10b981] font-bold text-sm flex items-center justify-center gap-1.5">
                    {t("homepageLesson.correctAnswer")}
                </span>
            </div>
        </div>
    </div>
  );
}

function DemoCursor({ scene }) {
  const [pos, setPos] = useState({ x: 50, y: 80 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const timers = [];
    const t = (delay, fn) => timers.push(setTimeout(fn, delay));

    setClicking(false);

    if (scene === 3) {
      // pill1@1000ms, pill2@1900ms, pill3@2800ms, running@3700ms
      // measured: set(48,82) .pop(0)(56.9,82) visited(77.7,82) Run(90.1,93.4)
      setPos({ x: 48, y: 82 });
      // click "set"
      t(1000, () => setClicking(true));
      t(1200, () => setClicking(false));
      // move to ".pop(0)"
      t(1400, () => setPos({ x: 56.9, y: 82 }));
      // click ".pop(0)"
      t(1900, () => setClicking(true));
      t(2100, () => setClicking(false));
      // move to "visited"
      t(2300, () => setPos({ x: 77.7, y: 82 }));
      // click "visited"
      t(2800, () => setClicking(true));
      t(3000, () => setClicking(false));
      // move to Run
      t(3200, () => setPos({ x: 90.1, y: 93.4 }));
      // click Run
      t(3700, () => setClicking(true));
      t(3900, () => setClicking(false));
    } else if (scene === 4) {
      // measured: option A(50,62.6) option B(50,75.3)
      setPos({ x: 50, y: 62.6 });
      t(700, () => setPos({ x: 50, y: 75.3 }));
      t(1450, () => setClicking(true));
      t(1650, () => setClicking(false));
    }

    return () => timers.forEach(clearTimeout);
  }, [scene]);

  if (scene !== 3 && scene !== 4) return null;

  return (
    <div
      className="absolute z-[100] pointer-events-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transition: 'left 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), top 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
        <path d="M1 1l6.5 19 2.5-7 7-2.5L1 1z" fill="#1a1a2e" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      {clicking && (
        <div
          className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full"
          style={{
            background: 'rgba(40, 86, 166, 0.25)',
            animation: 'cursorClick 300ms ease-out forwards',
          }}
        />
      )}
    </div>
  );
}

export default function HomepageLesson() {
  const { t } = useTranslation();
  const [scene, setScene] = useState(1);
  const [animState, setAnimState] = useState('entered');
  const [loopCount, setLoopCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);
  const pendingAdvance = useRef(false);

  // Pause scene cycling when scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // If we became visible again and there's a pending advance, fire it
  useEffect(() => {
    if (isVisible && pendingAdvance.current) {
      pendingAdvance.current = false;
      advanceScene();
    }
  }, [isVisible]);

  const advanceScene = () => {
    if (!isVisible) {
      pendingAdvance.current = true;
      return;
    }
    setAnimState('exiting');
    setTimeout(() => {
      setScene(prev => {
        if (prev === 4) {
          setLoopCount(c => c + 1);
          return 1;
        }
        return prev + 1;
      });
      setAnimState('entering');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setAnimState('entered');
        });
      });
    }, 300);
  };

  const getTransitionClass = () => {
    if (animState === 'exiting') return 'opacity-0 -translate-x-8 transition-all duration-300 ease-in-out';
    if (animState === 'entering') return 'opacity-0 translate-x-8 transition-none';
    if (animState === 'entered') return 'opacity-100 translate-x-0 transition-all duration-300 ease-out';
    return '';
  };

  return (
    <div ref={containerRef} className="bg-[#fdfcfa] rounded-2xl border-[1.5px] border-ink/12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col w-full relative">
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: popIn 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .scale-in-center {
          animation: scaleIn 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes cursorClick {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <DemoCursor scene={scene} />

      {/* Header */}
      <div className="p-6 border-b border-[#e8ded1] relative bg-[#fdf8f5] z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex gap-2">
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md tracking-wider">{t("homepageLesson.algorithms")}</span>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md tracking-wider">{t("homepageLesson.lvl1")}</span>
          </div>
          <div className="w-[1px] h-3 bg-amber-900/10" />
          <div className="flex gap-1.5 items-center">
              {[1, 2, 3, 4].map(step => (
                  <div key={step} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${step === scene ? 'bg-amber-500' : 'bg-amber-900/15'}`} />
              ))}
          </div>
        </div>
        <h3 className="font-sans text-xl font-bold text-ink tracking-tight mb-2">{t("homepageLesson.mazePathfinder")}</h3>
        <p className="text-sm text-ink/60 leading-relaxed max-w-lg">
          {t("homepageLesson.mazeDesc")}
        </p>
      </div>

      {/* Scene Container — fixed height to prevent layout shifts between scenes */}
      <div className={`w-full overflow-hidden flex items-stretch bg-[#fdf8f5] h-[320px] sm:h-[420px]`}>
        <div className={`w-full flex-shrink-0 ${getTransitionClass()}`}>
            {scene === 1 && <Scene1 onComplete={advanceScene} />}
            {scene === 2 && <Scene2 onComplete={advanceScene} />}
            {scene === 3 && <Scene3 runMode={loopCount % 2 === 0 ? 'bfs' : 'dfs'} onComplete={advanceScene} />}
            {scene === 4 && <Scene4 onComplete={advanceScene} />}
        </div>
      </div>
    </div>
  );
}
