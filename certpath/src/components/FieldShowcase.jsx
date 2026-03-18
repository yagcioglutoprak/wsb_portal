import { useState } from "react";
import { fields, certifications, jobs } from "../data/mock";
import { getFieldColor } from "../data/fieldColors";
import {
  CybersecurityIcon,
  CloudIcon,
  DevOpsIcon,
  DataScienceIcon,
  BackendIcon,
  NetworkingIcon,
} from "./Icons";

const fieldIcons = {
  cybersecurity: CybersecurityIcon,
  "cloud-engineering": CloudIcon,
  devops: DevOpsIcon,
  "data-science": DataScienceIcon,
  "backend-development": BackendIcon,
  networking: NetworkingIcon,
};

const displayFields = fields.slice(0, 6);

export default function FieldShowcase() {
  const [activeSlug, setActiveSlug] = useState(displayFields[0].slug);

  const activeField = displayFields.find((f) => f.slug === activeSlug);
  const activeCerts = certifications[activeSlug] || [];
  const activeJobs = jobs.filter((j) => j.fieldId === activeSlug);
  const colors = getFieldColor(activeSlug);
  const Icon = fieldIcons[activeSlug];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-20 lg:py-32 px-6 md:px-12 lg:px-24"
    >
      {/* Colored radial glow that shifts per active field */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${colors.accent}15, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="font-sans text-4xl font-bold text-white lg:text-5xl">
            Explore career paths
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base text-white/50 lg:text-lg">
            Each field comes with certifications, interactive lessons, and real
            job listings
          </p>
        </div>

        {/* Tab pills */}
        <div className="mb-14 flex justify-center">
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 scrollbar-hide md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
            {displayFields.map((field) => {
              const isActive = activeSlug === field.slug;
              return (
                <button
                  key={field.slug}
                  onClick={() => setActiveSlug(field.slug)}
                  className={`shrink-0 rounded-full px-5 py-2.5 font-sans text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[#0f172a] shadow-lg shadow-white/10"
                      : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white/90"
                  }`}
                >
                  {field.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div
          key={activeSlug}
          className="animate-fade-in-up grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16"
        >
          {/* Left column — field info on dark bg */}
          <div className="flex flex-col justify-center py-4">
            <h3 className="font-sans text-3xl font-bold text-white lg:text-4xl">
              {activeField.name}
            </h3>
            <p className="mt-4 font-sans text-base leading-relaxed text-white/60 lg:text-lg">
              {activeField.description}
            </p>

            {/* Certification list */}
            <ul className="mt-8 flex flex-col gap-3">
              {activeCerts.slice(0, 4).map((cert) => (
                <li
                  key={cert.id}
                  className="flex items-center gap-3 font-sans text-sm font-medium text-white/80"
                >
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                  />
                  {cert.name}
                </li>
              ))}
            </ul>

            {/* View roadmap link */}
            <a
              href={`/fields/${activeSlug}`}
              className="group mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold transition-colors duration-200 hover:brightness-125"
              style={{ color: colors.accent }}
            >
              View roadmap
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right column — white card */}
          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-10">
            {/* Icon */}
            <div
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${colors.accent}15` }}
            >
              {Icon && (
                <Icon
                  className="h-6 w-6"
                  style={{ color: colors.accent }}
                />
              )}
            </div>

            {/* Field name */}
            <h4 className="font-sans text-2xl font-bold text-[#142244]">
              {activeField.name}
            </h4>

            {/* Stats subtitle */}
            <p className="mt-2 font-sans text-sm text-[#142244]/50">
              {activeCerts.length} certification{activeCerts.length !== 1 ? "s" : ""}{" "}
              &middot; {activeJobs.length} job{activeJobs.length !== 1 ? "s" : ""}
            </p>

            {/* Cert preview chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {activeCerts.slice(0, 3).map((cert) => (
                <span
                  key={cert.id}
                  className="rounded-lg px-3 py-1.5 font-sans text-xs font-medium"
                  style={{
                    backgroundColor: `${colors.accent}12`,
                    color: colors.accent,
                  }}
                >
                  {cert.name}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <button
              className="mt-8 w-full rounded-xl px-8 py-3.5 font-sans text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
              style={{ backgroundColor: colors.accent }}
              onClick={() => {
                window.location.href = `/fields/${activeSlug}`;
              }}
            >
              Explore {activeField.name}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
