// ============================================================================
// CertPath — SVG Icon Library
// ============================================================================
// Minimal, stroke-based icons. 24x24 viewBox, strokeWidth 1.5, currentColor.
// Every component accepts a `className` prop for sizing and color overrides.
// ============================================================================

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// ---------------------------------------------------------------------------
// Field icons
// ---------------------------------------------------------------------------

export function CybersecurityIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Shield outline */}
      <path d="M12 2.5L3.5 6v5c0 5.25 3.63 10.15 8.5 11.5 4.87-1.35 8.5-6.25 8.5-11.5V6L12 2.5z" />
      {/* Keyhole — circle + slot */}
      <circle cx="12" cy="10.5" r="1.5" />
      <path d="M12 12v2.5" />
    </svg>
  );
}

export function CloudIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Cloud body */}
      <path d="M6.5 18.5h11a4 4 0 001.12-7.84A5.5 5.5 0 007.28 12 3.5 3.5 0 006.5 18.5z" />
      {/* Upload arrow */}
      <path d="M12 13v5" />
      <path d="M9.5 15.5L12 13l2.5 2.5" />
    </svg>
  );
}

export function DevOpsIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Infinity loop */}
      <path d="M7 12c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z" />
      <path d="M17 12c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z" />
      {/* Small arrows for cycle motion */}
      <path d="M4.5 12a5.5 5.5 0 015.5-5.5" />
      <path d="M19.5 12a5.5 5.5 0 01-5.5 5.5" />
      <path d="M8 7.5l2-1-1 2" />
      <path d="M16 16.5l-2 1 1-2" />
    </svg>
  );
}

export function DataScienceIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Bar chart */}
      <path d="M4 20v-6" />
      <path d="M8 20v-10" />
      <path d="M12 20v-8" />
      <path d="M16 20v-12" />
      <path d="M20 20v-14" />
      {/* Trend line */}
      <path d="M3 17l5-4 4 2 5-6 4-3" />
      {/* Trend dot */}
      <circle cx="21" cy="6" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BackendIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Code brackets </> */}
      <path d="M8 7l-5 5 5 5" />
      <path d="M16 7l5 5-5 5" />
      <path d="M13 5l-2 14" />
    </svg>
  );
}

export function NetworkingIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Three nodes connected */}
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      {/* Connecting lines */}
      <path d="M10.5 6.7L6.5 16.3" />
      <path d="M13.5 6.7L17.5 16.3" />
      <path d="M7 18h10" />
    </svg>
  );
}

export function ITSMIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Gear — simplified 6-tooth */}
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      {/* Checkmark inside */}
      <path d="M10 12l1.5 1.5L14 11" />
    </svg>
  );
}

export function FrontendIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Browser window */}
      <rect x="2" y="3" width="20" height="18" rx="2" />
      {/* Title bar dots */}
      <circle cx="5.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      {/* Divider line under title bar */}
      <path d="M2 9h20" />
      {/* Layout blocks */}
      <path d="M2 9h8v12H2z" />
      <path d="M10 14h12" />
    </svg>
  );
}

export function FinanceIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Ascending stair-step growth */}
      <path d="M3 20h18" />
      <path d="M3 20v-4h4v4" />
      <path d="M7 16v-3h4v7" />
      <path d="M11 13v-4h4v11" />
      <path d="M15 9V5h4v15" />
      {/* Upward trend accent */}
      <path d="M17 4l2.5 0" />
      <path d="M19.5 4v2.5" />
    </svg>
  );
}

export function ManagementIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Kanban board — 3 columns */}
      <rect x="2" y="3" width="20" height="18" rx="1.5" />
      {/* Column dividers */}
      <path d="M8.67 3v18" />
      <path d="M15.33 3v18" />
      {/* Cards in columns */}
      <rect x="3.5" y="5.5" width="3.67" height="2.5" rx="0.5" />
      <rect x="3.5" y="9.5" width="3.67" height="2.5" rx="0.5" />
      <rect x="10.17" y="5.5" width="3.67" height="2.5" rx="0.5" />
      <rect x="16.83" y="5.5" width="3.67" height="2.5" rx="0.5" />
      <rect x="16.83" y="9.5" width="3.67" height="2.5" rx="0.5" />
      <rect x="16.83" y="13.5" width="3.67" height="2.5" rx="0.5" />
    </svg>
  );
}

export function LogisticsIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Route path with waypoints */}
      <path d="M3 18c2-6 5-2 7-8s5-2 7-8" />
      {/* Waypoint dots */}
      <circle cx="5" cy="15" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7" r="1.25" fill="currentColor" stroke="none" />
      {/* Destination marker */}
      <circle cx="19" cy="4" r="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// UI icons
// ---------------------------------------------------------------------------

export function ArrowRightIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M5 12h14" />
      <path d="M14 7l5 5-5 5" />
    </svg>
  );
}

export function CheckIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}

export function ClockIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function CurrencyIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Coin outline */}
      <circle cx="12" cy="12" r="9" />
      {/* PLN-inspired symbol — stylised z-stroke L */}
      <path d="M9 8h3a2.5 2.5 0 010 5H9v3h6" />
      <path d="M8 13.5h5" />
    </svg>
  );
}

export function BookIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Open book */}
      <path d="M2 4.5C2 4.5 5 3 8.5 3s5 1.5 5 1.5" />
      <path d="M22 4.5C22 4.5 19 3 15.5 3s-5 1.5-5 1.5" />
      <path d="M2 4.5v14.5s3-1.5 6.5-1.5 5 1.5 5 1.5" />
      <path d="M22 4.5v14.5s-3-1.5-6.5-1.5-5 1.5-5 1.5" />
      {/* Spine */}
      <path d="M10.5 4.5v14.5" />
    </svg>
  );
}

export function BriefcaseIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      {/* Middle clasp line */}
      <path d="M2 13h20" />
      <path d="M10 13v2h4v-2" />
    </svg>
  );
}

export function MapPinIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function TrendUpIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3 17l6-6 4 4L21 7" />
      <path d="M16 7h5v5" />
    </svg>
  );
}

export function StageIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      {/* Stepping stones / numbered path */}
      <circle cx="5" cy="19" r="1.5" />
      <circle cx="10" cy="14" r="1.5" />
      <circle cx="15" cy="9" r="1.5" />
      <circle cx="20" cy="4" r="1.5" />
      {/* Connecting dashed path */}
      <path d="M6.2 17.8l2.6-2.6" strokeDasharray="2 2" />
      <path d="M11.2 12.8l2.6-2.6" strokeDasharray="2 2" />
      <path d="M16.2 7.8l2.6-2.6" strokeDasharray="2 2" />
    </svg>
  );
}

export function UserIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0112 0v1" />
    </svg>
  );
}
