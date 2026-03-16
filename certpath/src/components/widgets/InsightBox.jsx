import { useEffect, useRef, useState } from "react";

/* Animated lightbulb SVG with pulsing glow */
function LightbulbIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-lightbulb-pulse shrink-0 text-amber-500"
    >
      {/* Bulb body */}
      <path
        d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(245, 158, 11, 0.15)"
      />
      {/* Rays */}
      <line x1="12" y1="0" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="4.22" y1="4.22" x2="4.93" y2="4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="0" y1="12" x2="1" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="23" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="19.07" y1="4.93" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export default function InsightBox({ title = "Key insight", children }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Glassmorphic background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(255, 251, 235, 0.8) 0%, rgba(254, 243, 199, 0.6) 50%, rgba(255, 237, 213, 0.5) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Decorative dot pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Subtle border ring + shadow for depth */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: "0 4px 16px rgba(245, 158, 11, 0.08), 0 1px 4px rgba(0,0,0,0.04)",
          border: "1px solid rgba(245, 158, 11, 0.15)",
        }}
      />

      {/* Content */}
      <div className="relative px-6 py-5">
        <div className="mb-2 flex items-center gap-2.5">
          <LightbulbIcon />
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700/90">
            {title}
          </p>
        </div>
        <div
          className="text-sm leading-[1.8] text-ink/90"
          style={{
            animation: visible ? "slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both" : "none",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
