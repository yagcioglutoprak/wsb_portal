import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";
import { programs } from "../data/programs";
import {
  CybersecurityIcon,
  CloudIcon,
  DevOpsIcon,
  DataScienceIcon,
  BackendIcon,
  NetworkingIcon,
  ITSMIcon,
  FrontendIcon,
  FinanceIcon,
  ManagementIcon,
  LogisticsIcon,
} from "../components/Icons";

const TOTAL_STEPS = 4;
const AUTO_ADVANCE_MS = 400;

const years = [
  { id: "1", label: "1st year" },
  { id: "2", label: "2nd year" },
  { id: "3", label: "3rd year" },
  { id: "4", label: "4th year" },
  { id: "5", label: "5th year" },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Field icon mapping (reused from FieldCard pattern)                  */
/* ──────────────────────────────────────────────────────────────────── */

const fieldIcons = {
  cybersecurity: CybersecurityIcon,
  "cloud-engineering": CloudIcon,
  devops: DevOpsIcon,
  "data-science": DataScienceIcon,
  "backend-development": BackendIcon,
  networking: NetworkingIcon,
  itsm: ITSMIcon,
  "frontend-development": FrontendIcon,
  "finance-accounting": FinanceIcon,
  management: ManagementIcon,
  "logistics-supply-chain": LogisticsIcon,
};

/* ──────────────────────────────────────────────────────────────────── */
/*  SVG shared props                                                    */
/* ──────────────────────────────────────────────────────────────────── */

const svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/* ──────────────────────────────────────────────────────────────────── */
/*  Step 1: Year illustrations — growth metaphor                        */
/* ──────────────────────────────────────────────────────────────────── */

function SeedlingIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Ground line */}
      <path d="M8 38h32" />
      {/* Soil texture */}
      <path d="M14 38c0 2 1 3 2 3.5" />
      <path d="M32 38c0 2-1 3-2 3.5" />
      {/* Stem */}
      <path d="M24 38v-12" />
      {/* Left leaf */}
      <path d="M24 30c-4-1-7-4-7-7 3 0 6 2 7 5" />
      {/* Right leaf */}
      <path d="M24 27c4-1 6-4 6-6-3 0-5 2-6 4" />
      {/* Top sprout leaf */}
      <path d="M24 26c-2-3-1-6 1-8 2 2 2 5 0 7" />
    </svg>
  );
}

function SaplingIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Ground line */}
      <path d="M8 38h32" />
      {/* Main stem */}
      <path d="M24 38v-18" />
      {/* Left branch low */}
      <path d="M24 34c-5-1-8-4-8-7 3 0 6 2 8 5" />
      {/* Right branch low */}
      <path d="M24 31c5-1 7-4 7-6-3 0-5 2-7 4" />
      {/* Left branch mid */}
      <path d="M24 27c-4-2-6-5-5-8 3 1 5 4 5 6" />
      {/* Right branch mid */}
      <path d="M24 24c4-1 6-4 5-7-3 1-5 3-5 5" />
      {/* Top leaf pair */}
      <path d="M24 22c-2-3-1-6 1-8 2 2 2 5 0 7" />
      <path d="M24 21c2-2 4-3 5-2-1 2-3 3-5 3" />
    </svg>
  );
}

function YoungTreeIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Ground line */}
      <path d="M6 40h36" />
      {/* Trunk */}
      <path d="M24 40v-20" />
      <path d="M22 40v-16" />
      <path d="M26 40v-16" />
      {/* Canopy outline */}
      <path d="M12 24c0-7 5-14 12-16 7 2 12 9 12 16 0 4-3 7-6 8H18c-3-1-6-4-6-8z" />
      {/* Branch details inside canopy */}
      <path d="M24 20l-5 6" />
      <path d="M24 18l5 5" />
      <path d="M24 14l-3 4" />
      <path d="M24 14l3 3" />
      {/* Small bird */}
      <path d="M33 15c1-1 2-1 3 0" />
      <path d="M34 15c1 1 2 0 2-1" />
    </svg>
  );
}

function FullTreeIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Ground line */}
      <path d="M4 42h40" />
      {/* Thick trunk */}
      <path d="M21 42v-14" />
      <path d="M27 42v-14" />
      {/* Roots peeking out */}
      <path d="M21 42c-2 0-4 1-5 2" />
      <path d="M27 42c2 0 4 1 5 2" />
      {/* Broad canopy — layered cloud shapes */}
      <path d="M10 26c-2-4 0-8 4-10" />
      <path d="M14 16c2-4 6-7 10-7" />
      <path d="M24 9c4 0 8 3 10 7" />
      <path d="M34 16c4 2 6 6 4 10" />
      <path d="M38 26c1 3-1 6-4 7" />
      <path d="M34 33H14" />
      <path d="M14 33c-3-1-5-4-4-7" />
      {/* Inner branch structure */}
      <path d="M24 28l-7-5" />
      <path d="M24 28l7-5" />
      <path d="M24 22l-4-5" />
      <path d="M24 22l4-5" />
      <path d="M24 16l-2-4" />
      <path d="M24 16l2-4" />
    </svg>
  );
}

function FruitTreeIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Ground line */}
      <path d="M4 42h40" />
      {/* Thick trunk */}
      <path d="M21 42v-14" />
      <path d="M27 42v-14" />
      {/* Roots */}
      <path d="M21 42c-2 0-5 1-6 2" />
      <path d="M27 42c2 0 5 1 6 2" />
      {/* Broad canopy */}
      <path d="M10 26c-2-4 0-8 4-10" />
      <path d="M14 16c2-4 6-7 10-7" />
      <path d="M24 9c4 0 8 3 10 7" />
      <path d="M34 16c4 2 6 6 4 10" />
      <path d="M38 26c1 3-1 6-4 7" />
      <path d="M34 33H14" />
      <path d="M14 33c-3-1-5-4-4-7" />
      {/* Branches */}
      <path d="M24 28l-7-5" />
      <path d="M24 28l7-5" />
      <path d="M24 22l-4-5" />
      <path d="M24 22l4-5" />
      {/* Fruits (small circles) */}
      <circle cx="15" cy="22" r="2" />
      <circle cx="33" cy="22" r="2" />
      <circle cx="20" cy="15" r="2" />
      <circle cx="29" cy="17" r="2" />
      {/* Stars near top */}
      <path d="M24 7l0.7 1.5 1.6 0.2-1.2 1.1 0.3 1.6L24 11l-1.4 0.8 0.3-1.6-1.2-1.1 1.6-0.2z" />
      <path d="M36 12l0.5 1 1.1 0.2-0.8 0.8 0.2 1.1-1-0.5-1 0.5 0.2-1.1-0.8-0.8 1.1-0.2z" />
      <path d="M12 14l0.5 1 1.1 0.2-0.8 0.8 0.2 1.1-1-0.5-1 0.5 0.2-1.1-0.8-0.8 1.1-0.2z" />
    </svg>
  );
}

const yearIllustrations = {
  "1": SeedlingIllustration,
  "2": SaplingIllustration,
  "3": YoungTreeIllustration,
  "4": FullTreeIllustration,
  "5": FruitTreeIllustration,
};

/* ──────────────────────────────────────────────────────────────────── */
/*  Step 2: Program illustrations                                       */
/* ──────────────────────────────────────────────────────────────────── */

function CSIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Terminal window frame */}
      <rect x="4" y="6" width="40" height="30" rx="3" />
      {/* Title bar */}
      <path d="M4 12h40" />
      {/* Title bar dots */}
      <circle cx="8.5" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="9" r="1" fill="currentColor" stroke="none" />
      {/* Prompt cursor >_ */}
      <path d="M10 19l4 3-4 3" />
      <path d="M17 25h6" />
      {/* Code brackets */}
      <path d="M28 17l-3 5 3 5" />
      <path d="M33 17l3 5-3 5" />
      <path d="M32 17l-2 10" />
      {/* Small gear bottom right */}
      <circle cx="38" cy="40" r="3" />
      <path d="M38 36v1.5M38 42.5v1.5M34.5 40h1.5M40.5 40h1.5M35.2 37.2l1 1M40.8 42.8l1 1M35.2 42.8l1-1M40.8 37.2l1-1" />
    </svg>
  );
}

function FinanceProgramIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Coin stack — bottom */}
      <ellipse cx="16" cy="36" rx="8" ry="3" />
      <path d="M8 36v-3" />
      <path d="M24 36v-3" />
      <ellipse cx="16" cy="33" rx="8" ry="3" />
      {/* Coin stack — middle */}
      <path d="M8 33v-3" />
      <path d="M24 33v-3" />
      <ellipse cx="16" cy="30" rx="8" ry="3" />
      {/* Coin stack — top */}
      <path d="M8 30v-3" />
      <path d="M24 30v-3" />
      <ellipse cx="16" cy="27" rx="8" ry="3" />
      {/* Upward trend line */}
      <path d="M26 34l5-6 4-2 5-8" />
      <path d="M37 18h3v3" />
      {/* Calculator outline */}
      <rect x="30" y="28" width="10" height="14" rx="1.5" />
      <path d="M32 31h6" />
      <path d="M32 34h2" />
      <path d="M36 34h2" />
      <path d="M32 37h2" />
      <path d="M36 37h2" />
    </svg>
  );
}

function ManagementProgramIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Top box — leader */}
      <rect x="17" y="4" width="14" height="8" rx="2" />
      {/* Connecting lines down */}
      <path d="M24 12v5" />
      <path d="M24 17h-14" />
      <path d="M24 17h14" />
      <path d="M10 17v5" />
      <path d="M24 17v5" />
      <path d="M38 17v5" />
      {/* Left box */}
      <rect x="3" y="22" width="14" height="8" rx="2" />
      {/* Center box */}
      <rect x="17" y="22" width="14" height="8" rx="2" />
      {/* Right box */}
      <rect x="31" y="22" width="14" height="8" rx="2" />
      {/* Lower tier connections */}
      <path d="M10 30v4" />
      <path d="M10 34h-4" />
      <path d="M10 34h4" />
      <path d="M6 34v3" />
      <path d="M14 34v3" />
      {/* Lower boxes */}
      <rect x="1" y="37" width="10" height="6" rx="1.5" />
      <rect x="9" y="37" width="10" height="6" rx="1.5" />
      {/* Small upward arrow */}
      <path d="M40 36l2-3 2 3" />
      <path d="M42 33v7" />
    </svg>
  );
}

function LogisticsProgramIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Truck body */}
      <rect x="2" y="20" width="20" height="14" rx="2" />
      {/* Truck cab */}
      <path d="M22 26h8l4 4v4H22v-8z" />
      {/* Cab window */}
      <path d="M24 28h5l2.5 2.5V32H24v-4z" />
      {/* Wheels */}
      <circle cx="10" cy="36" r="3" />
      <circle cx="30" cy="36" r="3" />
      {/* Ground */}
      <path d="M0 39h7" />
      <path d="M13 39h14" />
      <path d="M33 39h15" />
      {/* Curved route above */}
      <path d="M8 8c6-4 16-4 32 0" strokeDasharray="3 2" />
      {/* Waypoint dots */}
      <circle cx="14" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="28" cy="5.5" r="1.5" fill="currentColor" stroke="none" />
      {/* Box on truck */}
      <rect x="6" y="23" width="6" height="6" rx="1" />
      <path d="M6 26h6" />
      <path d="M9 23v6" />
    </svg>
  );
}

function DataAnalyticsProgramIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Pie chart */}
      <circle cx="18" cy="22" r="12" />
      {/* Slice dividers */}
      <path d="M18 10v12" />
      <path d="M18 22l10.4 6" />
      <path d="M18 22l-8.5 8.5" />
      {/* Pulled-out slice accent */}
      <path d="M20 9c5 0 10 3 12 8" strokeDasharray="2 2" />
      {/* Magnifying glass */}
      <circle cx="37" cy="14" r="6" />
      <path d="M41.2 18.2l4.3 4.3" />
      {/* Chart lines inside magnifier */}
      <path d="M33 16l2-3 2 1 2-2" />
      {/* Data dots */}
      <circle cx="35" cy="34" r="1" fill="currentColor" stroke="none" />
      <circle cx="39" cy="32" r="1" fill="currentColor" stroke="none" />
      <circle cx="43" cy="35" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MarketingProgramIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Megaphone body */}
      <path d="M6 18v10l2 1v-12l-2 1z" />
      <path d="M8 17l18-7v28l-18-7v-14z" />
      {/* Megaphone bell */}
      <path d="M26 10c6-2 10 0 12 4" />
      <path d="M26 38c6 2 10 0 12-4" />
      <path d="M38 14v20" />
      {/* Sound waves */}
      <path d="M40 18c2 1 3 3 3 6s-1 5-3 6" />
      <path d="M42 15c3 2 5 5 5 9s-2 7-5 9" />
      {/* Small handle */}
      <path d="M6 28l-2 6h4l-2-6" />
      {/* Chart accent */}
      <path d="M12 40h3v-2h3v-4h3v-1" />
    </svg>
  );
}

function OtherProgramIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...svgProps}>
      {/* Compass outer ring */}
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="15" />
      {/* Cardinal markers */}
      <path d="M24 6v3" />
      <path d="M24 39v3" />
      <path d="M6 24h3" />
      <path d="M39 24h3" />
      {/* N/S/E/W labels (as small strokes forming letters) */}
      {/* N */}
      <path d="M22.5 3.5v2.5l3-2.5v2.5" />
      {/* S */}
      <path d="M25.5 42c-0.5-0.5-2-0.5-2.5 0.3 0 0.5 0.5 1 1.3 1 0.7 0.2 1.2 0.5 1.2 1-0.5 0.8-2 0.8-2.5 0.2" />
      {/* Compass needle — north half */}
      <path d="M24 12l-3 12 3-2 3 2-3-12z" />
      {/* Compass needle — south half */}
      <path d="M24 36l-3-12 3 2 3-2-3 12z" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
      {/* Diagonal tick marks */}
      <path d="M36.7 11.3l-1.5 1.5" />
      <path d="M11.3 36.7l-1.5 1.5" />
      <path d="M36.7 36.7l-1.5-1.5" />
      <path d="M11.3 11.3l-1.5-1.5" />
    </svg>
  );
}

const programIllustrations = {
  cs: CSIllustration,
  finance: FinanceProgramIllustration,
  management: ManagementProgramIllustration,
  logistics: LogisticsProgramIllustration,
  "data-analytics": DataAnalyticsProgramIllustration,
  marketing: MarketingProgramIllustration,
  other: OtherProgramIllustration,
};

/* ──────────────────────────────────────────────────────────────────── */
/*  Step 4: Path illustration                                           */
/* ──────────────────────────────────────────────────────────────────── */

function PathIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 128 96" {...svgProps}>
      {/* Winding path — wider at bottom, narrowing toward top */}
      <path d="M10 88c8-10 16-8 24-20s12-14 24-24 16-10 24-18 14-10 20-16" strokeWidth="3" />
      <path d="M14 90c8-10 16-8 24-20s12-14 24-24 16-10 24-18 14-10 20-16" strokeWidth="1" opacity="0.3" />
      {/* Milestone markers along the path */}
      <circle cx="16" cy="86" r="4" />
      <circle cx="36" cy="66" r="3.5" />
      <circle cx="58" cy="44" r="3" />
      <circle cx="82" cy="28" r="2.5" />
      <circle cx="102" cy="14" r="2" />
      {/* Flag at the top */}
      <path d="M112 8V2" strokeWidth="2" />
      <path d="M112 2h10l-3 3 3 3h-10" />
      {/* Stars / sparkles near flag */}
      <path d="M120 0l0.6 1.2 1.3 0.2-0.9 0.9 0.2 1.3-1.2-0.6-1.2 0.6 0.2-1.3-0.9-0.9 1.3-0.2z" />
      <path d="M106 4l0.4 0.9 1 0.1-0.7 0.7 0.2 1-0.9-0.5-0.9 0.5 0.2-1-0.7-0.7 1-0.1z" />
      <path d="M124 10l0.4 0.9 1 0.1-0.7 0.7 0.2 1-0.9-0.5-0.9 0.5 0.2-1-0.7-0.7 1-0.1z" />
      {/* Perspective lines — faint path edges */}
      <path d="M6 92c8-10 16-8 24-20" opacity="0.15" strokeWidth="2" />
      <path d="M18 92c8-10 16-8 24-20" opacity="0.15" strokeWidth="2" />
      {/* Small decorative dots for texture */}
      <circle cx="26" cy="76" r="1" fill="currentColor" stroke="none" opacity="0.2" />
      <circle cx="48" cy="54" r="1" fill="currentColor" stroke="none" opacity="0.2" />
      <circle cx="72" cy="36" r="1" fill="currentColor" stroke="none" opacity="0.2" />
      <circle cx="94" cy="20" r="1" fill="currentColor" stroke="none" opacity="0.2" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Checkmark for selected state                                        */
/* ──────────────────────────────────────────────────────────────────── */

function SelectCheckmark() {
  return (
    <svg
      className="h-4 w-4 text-rust"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 12.5l5 5L19.5 7" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Progress dots                                                       */
/* ──────────────────────────────────────────────────────────────────── */

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            "h-2 w-2 rounded-full transition-all duration-300",
            i + 1 === current
              ? "bg-rust scale-125"
              : i + 1 < current
                ? "bg-merito"
                : "bg-pencil/20",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Illustrated card — year & program steps (SVG on right)              */
/* ──────────────────────────────────────────────────────────────────── */

function IllustratedCard({ label, selected, onClick, description, Illustration }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group/card relative w-full rounded-lg border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-rust bg-rust/5 shadow-lg"
          : "border-faint bg-card hover:border-pencil/30",
      ].join(" ")}
    >
      {/* Checkmark — top left on select */}
      <div
        className={[
          "absolute left-2.5 top-2.5 transition-all duration-200",
          selected ? "scale-100 opacity-100" : "scale-75 opacity-0",
        ].join(" ")}
      >
        <SelectCheckmark />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="block font-serif text-lg italic text-ink">{label}</span>
          {description && (
            <span className="mt-1 block text-sm leading-relaxed text-graphite">
              {description}
            </span>
          )}
        </div>
        {Illustration && (
          <div className="flex-shrink-0">
            <Illustration
              className={[
                "h-12 w-12 transition-colors duration-200",
                selected
                  ? "text-rust"
                  : "text-pencil/30 group-hover/card:text-rust",
              ].join(" ")}
            />
          </div>
        )}
      </div>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Field card — step 3 (icon in top-right corner)                      */
/* ──────────────────────────────────────────────────────────────────── */

function FieldSelectCard({ label, selected, onClick, description, slug }) {
  const Icon = fieldIcons[slug];
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group/card relative w-full rounded-lg border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-rust bg-rust/5 shadow-lg"
          : "border-faint bg-card hover:border-pencil/30",
      ].join(" ")}
    >
      {/* Checkmark — top left on select */}
      <div
        className={[
          "absolute left-2.5 top-2.5 transition-all duration-200",
          selected ? "scale-100 opacity-100" : "scale-75 opacity-0",
        ].join(" ")}
      >
        <SelectCheckmark />
      </div>

      {/* Field icon — top right */}
      {Icon && (
        <Icon
          className={[
            "absolute right-4 top-4 h-8 w-8 transition-colors duration-200",
            selected
              ? "text-rust"
              : "text-pencil/30 group-hover/card:text-rust",
          ].join(" ")}
        />
      )}

      <span className="block pr-10 font-serif text-lg italic text-ink">{label}</span>
      {description && (
        <span className="mt-1 block pr-10 text-sm leading-relaxed text-graphite">
          {description}
        </span>
      )}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Step wrapper with transition                                        */
/* ──────────────────────────────────────────────────────────────────── */

function StepWrapper({ visible, direction, children }) {
  return (
    <div
      className="transition-all duration-400 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : direction === "forward"
            ? "translateX(40px)"
            : "translateX(-40px)",
        transitionDuration: "400ms",
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Onboarding page                                                     */
/* ──────────────────────────────────────────────────────────────────── */

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [visible, setVisible] = useState(true);

  const [year, setYear] = useState(null);
  const [program, setProgram] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  /* Advance with animation */
  const goToStep = useCallback(
    (next) => {
      const dir = next > step ? "forward" : "back";
      setDirection(dir);
      setVisible(false);
      setTimeout(() => {
        setStep(next);
        setDirection(dir);
        setVisible(true);
      }, 300);
    },
    [step],
  );

  const goBack = useCallback(() => {
    if (step > 1) goToStep(step - 1);
  }, [step, goToStep]);

  /* Auto-advance after selection */
  const selectAndAdvance = useCallback(
    (setter, value) => {
      setter(value);
      if (step < TOTAL_STEPS) {
        setTimeout(() => goToStep(step + 1), AUTO_ADVANCE_MS);
      }
    },
    [step, goToStep],
  );

  /* Filtered fields for step 3 */
  const programData = programs.find((p) => p.id === program);
  const availableFields =
    programData && programData.fieldSlugs
      ? fields.filter((f) => programData.fieldSlugs.includes(f.slug))
      : fields;

  /* Data for result screen */
  const chosenField = fields.find((f) => f.slug === selectedField);
  const fieldCerts = selectedField ? certifications[selectedField] || [] : [];
  const stages = {};
  fieldCerts.forEach((cert) => {
    if (!stages[cert.stage]) stages[cert.stage] = [];
    stages[cert.stage].push(cert);
  });
  const stageNums = Object.keys(stages)
    .map(Number)
    .sort((a, b) => a - b);
  const previewStages = stageNums.slice(0, 2);

  const yearLabel = years.find((y) => y.id === year)?.label;
  const programLabel = programs.find((p) => p.id === program)?.name;

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center py-8 sm:py-16">
      {/* Progress + back */}
      <div className="mb-10 flex w-full max-w-2xl items-center justify-between px-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="font-mono text-xs uppercase tracking-wider text-graphite transition-colors duration-200 hover:text-rust"
          >
            &larr; Back
          </button>
        ) : (
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-wider text-graphite transition-colors duration-200 hover:text-rust"
          >
            &larr; Home
          </Link>
        )}
        <ProgressDots current={step} total={TOTAL_STEPS} />
      </div>

      {/* Step content */}
      <div className="w-full max-w-2xl px-4">
        <StepWrapper visible={visible} direction={direction}>
          {/* ── Step 1: Year ──────────────────────────────── */}
          {step === 1 && (
            <div>
              <span className="block font-mono text-xs tracking-widest text-pencil">
                01
              </span>
              <h1 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
                What year are you in?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-graphite">
                This helps us recommend the right starting point for your
                certification journey.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {years.map((y) => (
                  <IllustratedCard
                    key={y.id}
                    label={y.label}
                    selected={year === y.id}
                    onClick={() => selectAndAdvance(setYear, y.id)}
                    Illustration={yearIllustrations[y.id]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Program ──────────────────────────── */}
          {step === 2 && (
            <div>
              <span className="block font-mono text-xs tracking-widest text-pencil">
                02
              </span>
              <h1 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
                What are you studying?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-graphite">
                Your program shapes which certifications are most valuable for
                your career.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {programs.map((p) => (
                  <IllustratedCard
                    key={p.id}
                    label={p.name}
                    selected={program === p.id}
                    onClick={() => selectAndAdvance(setProgram, p.id)}
                    Illustration={programIllustrations[p.id]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Field ────────────────────────────── */}
          {step === 3 && (
            <div>
              <span className="block font-mono text-xs tracking-widest text-pencil">
                03
              </span>
              <h1 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
                What excites you most?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-graphite">
                Pick the field that sparks your curiosity. You can always explore
                others later.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableFields.map((f) => (
                  <FieldSelectCard
                    key={f.id}
                    label={f.name}
                    description={f.description}
                    slug={f.slug}
                    selected={selectedField === f.slug}
                    onClick={() =>
                      selectAndAdvance(setSelectedField, f.slug)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Result ───────────────────────────── */}
          {step === 4 && (() => {
            const FieldIcon = selectedField ? fieldIcons[selectedField] : null;
            const fieldJobs = chosenField ? jobs.filter(j => j.fieldId === chosenField.id) : [];
            const salaryMin = fieldJobs.length ? Math.min(...fieldJobs.map(j => j.salaryMin)) : 0;
            const salaryMax = fieldJobs.length ? Math.max(...fieldJobs.map(j => j.salaryMax)) : 0;
            const totalWeeks = fieldCerts.reduce((s, c) => s + c.durationWeeks, 0);
            const totalCost = fieldCerts.reduce((s, c) => s + c.costPln, 0);
            const firstCert = fieldCerts.length ? fieldCerts.sort((a,b) => a.stage - b.stage)[0] : null;

            return (
            <div>
              {/* Header with icon */}
              <div className="flex items-start gap-5 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
                {FieldIcon && (
                  <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-merito/10 animate-scale-in" style={{ animationDelay: "200ms" }}>
                    <FieldIcon className="h-7 w-7 text-merito" />
                  </div>
                )}
                <div>
                  <span className="block font-mono text-xs tracking-widest text-pencil">
                    Your personalized path
                  </span>
                  <h1 className="mt-1 font-serif text-3xl italic text-ink sm:text-4xl">
                    {chosenField?.name || "Your path"}
                  </h1>
                  {chosenField && (
                    <p className="mt-2 text-base leading-relaxed text-graphite">
                      Tailored for a <span className="font-medium text-ink">{yearLabel}</span>{" "}
                      {programLabel !== "Other" ? <><span className="font-medium text-ink">{programLabel}</span> </> : ""}student.
                      Here is where we recommend you start.
                    </p>
                  )}
                </div>
              </div>

              {/* Animated progress bar */}
              <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <div className="h-1.5 rounded-full bg-warm overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-merito to-rust transition-all duration-1000 ease-out"
                    style={{ width: "100%", animation: "drawLine 1.2s ease-out 0.5s both" }}
                  />
                </div>
              </div>

              {/* Key stats row */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: stageNums.length, label: "stages", color: "text-ink", delay: 300 },
                  { value: fieldCerts.length, label: "certifications", color: "text-ink", delay: 400 },
                  { value: fieldJobs.length, label: "jobs in Poland", color: "text-rust", delay: 500 },
                  { value: `~${Math.round(totalWeeks / 4)}`, label: "months total", color: "text-ink", delay: 600 },
                ].map(({ value, label, color, delay }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-faint bg-card p-4 text-center animate-scale-in"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    <span className={`block font-serif text-2xl italic ${color}`}>{value}</span>
                    <span className="block font-mono text-xs tracking-wider text-pencil mt-1">{label}</span>
                  </div>
                ))}
              </div>

              {/* Salary + cost summary */}
              {fieldJobs.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-success/20 bg-success/5 p-4 animate-slide-in-right" style={{ animationDelay: "700ms" }}>
                    <span className="block font-mono text-xs tracking-widest text-success">Salary range in Poland</span>
                    <span className="mt-1 block font-serif text-xl italic text-ink">
                      {salaryMin.toLocaleString("pl-PL")} - {salaryMax.toLocaleString("pl-PL")} PLN/month
                    </span>
                  </div>
                  <div className="rounded-lg border border-faint bg-card p-4 animate-slide-in-right" style={{ animationDelay: "800ms" }}>
                    <span className="block font-mono text-xs tracking-widest text-pencil">Total certification cost</span>
                    <span className="mt-1 block font-serif text-xl italic text-ink">
                      ~{totalCost.toLocaleString("pl-PL")} PLN
                    </span>
                    <span className="block text-xs text-graphite mt-0.5">Many free alternatives available</span>
                  </div>
                </div>
              )}

              {/* Start here highlight */}
              {firstCert && (
                <div className="mt-8 rounded-xl border-2 border-rust/20 bg-rust/5 p-6 animate-fade-in-up animate-pulse-soft" style={{ animationDelay: "900ms" }}>
                  <span className="block font-mono text-xs tracking-widest text-rust">Start here</span>
                  <span className="mt-2 block font-serif text-xl italic text-ink">{firstCert.name}</span>
                  <p className="mt-1 text-sm leading-relaxed text-graphite">{firstCert.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <span className="rounded-full border border-faint bg-card px-3 py-1 font-mono text-xs text-graphite">
                      {firstCert.provider}
                    </span>
                    <span className="rounded-full border border-faint bg-card px-3 py-1 font-mono text-xs text-graphite">
                      {firstCert.costPln > 0 ? `~${firstCert.costPln.toLocaleString("pl-PL")} PLN` : "Free"}
                    </span>
                    <span className="rounded-full border border-faint bg-card px-3 py-1 font-mono text-xs text-graphite">
                      ~{Math.round(firstCert.durationWeeks / 4)} months
                    </span>
                    {firstCert.examCode && (
                      <span className="rounded-full border border-faint bg-card px-3 py-1 font-mono text-xs text-graphite">
                        {firstCert.examCode}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Full stage overview */}
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "1000ms" }}>
                <span className="block font-mono text-xs tracking-widest text-pencil mb-4">Full roadmap overview</span>
                <div className="space-y-3">
                  {stageNums.map((stageNum, idx) => (
                    <div
                      key={stageNum}
                      className="rounded-lg border border-faint bg-card p-5 animate-fade-in-up"
                      style={{ animationDelay: `${(idx + 3) * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${
                          idx === 0 ? "bg-rust text-white" : "border-2 border-pencil/20 text-pencil"
                        }`}>
                          {stageNum}
                        </div>
                        <div className="flex-1">
                          <span className="block font-serif text-lg italic text-ink">
                            {stages[stageNum][0]?.stageName || `Stage ${stageNum}`}
                          </span>
                          <span className="block font-mono text-xs text-pencil">
                            ~{Math.round(stages[stageNum].reduce((s, c) => s + c.durationWeeks, 0) / 4)} months
                          </span>
                        </div>
                        <span className="font-mono text-xs text-pencil">
                          {stages[stageNum].length} cert{stages[stageNum].length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-2 pl-12">
                        {stages[stageNum].map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between py-1.5 border-b border-faint last:border-0">
                            <div>
                              <span className="text-sm font-medium text-ink">{cert.name}</span>
                              <span className="ml-2 font-mono text-xs text-pencil">{cert.provider}</span>
                            </div>
                            <div className="flex items-center gap-3 text-right">
                              <span className="font-mono text-xs text-pencil">
                                {cert.costPln > 0 ? `${cert.costPln.toLocaleString("pl-PL")} PLN` : "Free"}
                              </span>
                              <span className="font-mono text-xs text-pencil">
                                ~{Math.round(cert.durationWeeks / 4)} mo
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: "1200ms" }}>
                {chosenField && (
                  <Link
                    to={`/fields/${chosenField.slug}`}
                    className="inline-block rounded-lg bg-rust px-10 py-4 font-mono text-sm uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rust/20"
                  >
                    View full roadmap with resources
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedField(null);
                    goToStep(3);
                  }}
                  className="font-mono text-xs uppercase tracking-wider text-graphite transition-colors duration-200 hover:text-rust"
                >
                  Choose a different path
                </button>
              </div>
            </div>
            );
          })()}
        </StepWrapper>
      </div>
    </section>
  );
}
