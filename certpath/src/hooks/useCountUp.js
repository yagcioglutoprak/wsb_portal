import { useEffect, useState, useRef, useCallback } from "react";

export default function useCountUp(target, duration = 800, startOnMount = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(startOnMount);
  const frameRef = useRef(null);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (!started || typeof target !== "number") return;
    if (target === 0) { setCount(0); return; }
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, started]);

  return { count, start };
}
