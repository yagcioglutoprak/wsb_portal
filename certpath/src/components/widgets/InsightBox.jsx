import { useEffect, useRef, useState } from "react";

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
      className="relative overflow-hidden rounded-xl shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-50/60 to-orange-50/30" />

      {/* Left accent bar — gradient */}
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{
          background: "linear-gradient(to bottom, #f59e0b, #f97316, #ef4444)",
          borderRadius: "0 2px 2px 0",
        }}
      />

      {/* Content */}
      <div className="relative px-5 py-4 pl-6">
        <div className="flex items-center gap-2 mb-1.5">
          {/* Sparkle icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-amber-500"
          >
            <path
              d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700/90">
            {title}
          </p>
        </div>
        <div className="text-sm leading-[1.75] text-ink/90">{children}</div>
      </div>
    </div>
  );
}
