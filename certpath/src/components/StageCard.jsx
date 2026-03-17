import CertCard from "./CertCard";

export default function StageCard({
  stageNum,
  stageName,
  certs,
  fieldSlug,
  isActive,
}) {
  const stageLabels = {
    1: "Foundation",
    2: "Associate",
    3: "Professional",
    4: "Expert",
  };

  const label = stageName || stageLabels[stageNum] || `Stage ${stageNum}`;

  // Estimate stage duration from certs
  const stageMonths = Math.round(
    certs.reduce((sum, c) => sum + c.durationWeeks, 0) / 4
  );

  return (
    <div className="flex-1 min-w-[260px]">
      {/* Stage header */}
      <div className="flex items-center gap-3 mb-4">
        {/* Numbered dot */}
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-sans text-base font-medium transition-colors duration-300",
            isActive
              ? "bg-rust text-white"
              : "border-2 border-pencil/30 text-pencil",
          ].join(" ")}
        >
          {stageNum}
        </div>

        <div>
          <span className="block font-sans text-xs uppercase tracking-wide text-pencil">
            Stage {String(stageNum).padStart(2, "0")}
          </span>
          <span className="block font-sans text-xl font-semibold text-ink">
            {label}
          </span>
          <span className="block font-mono text-xs tracking-wide text-pencil">
            ~{stageMonths} months
          </span>
        </div>
      </div>

      {/* Cert list */}
      <div className="flex flex-col gap-3 pl-4">
        {certs.map((cert) => (
          <CertCard
            key={cert.id}
            cert={cert}
            fieldSlug={fieldSlug}
            locked={false}
          />
        ))}
      </div>
    </div>
  );
}
