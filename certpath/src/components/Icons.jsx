// ============================================================================
// CertPath — SVG Icon Library (Avant-Garde Redux)
// ============================================================================
// Ultra-minimal, abstract, geometric icons. 24x24 viewBox, strokeWidth 1.
// Designed for high-fidelity technical aesthetics.
// ============================================================================

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
};

export function CybersecurityIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="4" y="4" width="16" height="16" strokeOpacity="0.2" />
      <path d="M12 2v20" strokeOpacity="0.2" strokeDasharray="1 3" />
      <path d="M2 12h20" strokeOpacity="0.2" strokeDasharray="1 3" />
      <path d="M8 12l4-4 4 4-4 4z" strokeOpacity="0.8" fill="currentColor" fillOpacity="0.05" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CloudIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 12h20" strokeOpacity="0.2" strokeDasharray="1 3" />
      <rect x="5" y="8" width="14" height="8" strokeOpacity="0.4" fill="currentColor" fillOpacity="0.05" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 4v8" strokeOpacity="0.4" />
      <path d="M10 6l2-2 2 2" strokeOpacity="0.8" />
    </svg>
  );
}

export function DevOpsIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="8" cy="12" r="5" strokeOpacity="0.3" fill="currentColor" fillOpacity="0.05" />
      <circle cx="16" cy="12" r="5" strokeOpacity="0.3" fill="currentColor" fillOpacity="0.05" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <path d="M2 12h20" strokeOpacity="0.2" strokeDasharray="1 3" />
      <path d="M12 2v20" strokeOpacity="0.2" strokeDasharray="1 3" />
    </svg>
  );
}

export function DataScienceIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 20h20" strokeOpacity="0.4" />
      <rect x="4" y="12" width="3" height="8" strokeOpacity="0.4" />
      <rect x="10.5" y="6" width="3" height="14" strokeOpacity="0.8" fill="currentColor" fillOpacity="0.1" />
      <rect x="17" y="10" width="3" height="10" strokeOpacity="0.4" />
      <circle cx="12" cy="6" r="1" fill="currentColor" />
      <path d="M2 16l8-6 6 4 6-8" strokeOpacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}

export function BackendIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="3" y="4" width="18" height="16" strokeOpacity="0.2" fill="currentColor" fillOpacity="0.02" />
      <path d="M3 8h18" strokeOpacity="0.2" />
      <path d="M8 12h8" strokeOpacity="0.6" />
      <path d="M8 16h4" strokeOpacity="0.6" />
      <circle cx="5.5" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

export function NetworkingIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="12" cy="12" r="8" strokeOpacity="0.15" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="18" cy="16" r="1.5" fill="currentColor" />
      <circle cx="6" cy="16" r="1.5" fill="currentColor" />
      <path d="M12 6.5v8" strokeOpacity="0.4" strokeDasharray="1 3" />
      <path d="M7 15l4-2" strokeOpacity="0.4" strokeDasharray="1 3" />
      <path d="M17 15l-4-2" strokeOpacity="0.4" strokeDasharray="1 3" />
    </svg>
  );
}

export function ITSMIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" strokeOpacity="0.3" fill="currentColor" fillOpacity="0.05" />
      <rect x="8" y="8" width="8" height="8" strokeOpacity="0.8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeOpacity="0.2" />
    </svg>
  );
}

export function FrontendIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="2" y="4" width="20" height="16" strokeOpacity="0.3" />
      <path d="M2 9h20" strokeOpacity="0.3" />
      <path d="M8 9v11" strokeOpacity="0.2" />
      <rect x="11" y="12" width="8" height="5" strokeOpacity="0.6" fill="currentColor" fillOpacity="0.05" />
      <circle cx="5" cy="6.5" r="1" fill="currentColor" />
      <circle cx="8" cy="6.5" r="1" strokeOpacity="0.5" />
    </svg>
  );
}

export function FinanceIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 20h20" strokeOpacity="0.3" />
      <rect x="4" y="12" width="4" height="8" strokeOpacity="0.4" />
      <rect x="10" y="8" width="4" height="12" strokeOpacity="0.8" fill="currentColor" fillOpacity="0.1" />
      <rect x="16" y="4" width="4" height="16" strokeOpacity="0.4" />
      <path d="M2 18l6-6 6-4 6-4" strokeOpacity="0.3" strokeDasharray="1 2" />
    </svg>
  );
}

export function ManagementIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="3" y="4" width="18" height="16" strokeOpacity="0.2" />
      <path d="M9 4v16" strokeOpacity="0.2" />
      <path d="M15 4v16" strokeOpacity="0.2" />
      <rect x="4.5" y="6" width="3" height="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="10.5" y="6" width="3" height="6" strokeOpacity="0.8" />
      <rect x="16.5" y="10" width="3" height="4" strokeOpacity="0.5" />
    </svg>
  );
}

export function LogisticsIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3 12h18" strokeOpacity="0.15" strokeDasharray="2 2" />
      <path d="M6 18l6-12 6 12" strokeOpacity="0.4" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
      <circle cx="18" cy="18" r="1.5" strokeOpacity="0.8" fill="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// UI icons
// ---------------------------------------------------------------------------

export function ArrowRightIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M2 12h20" />
      <path d="M16 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3 12l6 6 12-12" />
    </svg>
  );
}

export function ClockIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
      <path d="M12 6v6l4 2" strokeOpacity="0.8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function CurrencyIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
      <path d="M9 8h3v5h-3z" strokeOpacity="0.6" fill="currentColor" fillOpacity="0.1" />
      <path d="M12 13v3h4" strokeOpacity="0.8" />
    </svg>
  );
}

export function BookIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="4" y="4" width="16" height="16" strokeOpacity="0.3" />
      <path d="M12 4v16" strokeOpacity="0.3" />
      <path d="M6 8h4" strokeOpacity="0.5" />
      <path d="M6 12h2" strokeOpacity="0.5" />
      <path d="M14 8h4" strokeOpacity="0.5" />
    </svg>
  );
}

export function BriefcaseIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <rect x="3" y="8" width="18" height="12" strokeOpacity="0.3" />
      <path d="M8 8V5h8v3" strokeOpacity="0.5" />
      <path d="M3 14h18" strokeOpacity="0.2" />
      <rect x="10" y="13" width="4" height="2" fill="currentColor" fillOpacity="0.2" strokeOpacity="0.8" />
    </svg>
  );
}

export function MapPinIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M12 21l-7-7c-2-2-2-5-2-7a9 9 0 0118 0c0 2 0 5-2 7l-7 7z" strokeOpacity="0.4" />
      <circle cx="12" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}

export function TrendUpIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <path d="M3 17l6-6 4 4 8-8" strokeOpacity="0.7" />
      <path d="M16 7h5v5" strokeOpacity="0.7" />
      <circle cx="21" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

export function StageIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" fillOpacity="0.2" strokeOpacity="0.8" />
      <circle cx="18" cy="6" r="1.5" strokeOpacity="0.4" />
      <path d="M7.5 16.5l3-3" strokeOpacity="0.3" strokeDasharray="1 2" />
      <path d="M13.5 10.5l3-3" strokeOpacity="0.3" strokeDasharray="1 2" />
    </svg>
  );
}

export function UserIcon({ className }) {
  return (
    <svg className={className} {...svgProps}>
      <circle cx="12" cy="8" r="3" strokeOpacity="0.6" />
      <path d="M5 20v-2a4 4 0 014-4h6a4 4 0 014 4v2" strokeOpacity="0.4" />
    </svg>
  );
}
