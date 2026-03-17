export default function ResourceRow({ resource }) {
  const isFree = resource.pricePln === 0 || resource.pricePln === null;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-4 rounded-xl border-[1.5px] border-ink/12 bg-card px-5 py-4 shadow-[0_2px_0_0_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.06)] hover:border-ink/20"
    >
      <div className="min-w-0 flex-1">
        <h4 className="text-base font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-rust">
          {resource.title}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-sans text-xs tracking-wide text-pencil">
            {resource.platform}
          </span>
          <span className="text-faint">|</span>
          <span className="font-sans text-xs tracking-wide text-pencil">
            {resource.type}
          </span>
          <span className="text-faint">|</span>
          <span className="font-mono text-xs tracking-wide text-pencil">
            {resource.estimatedHours}h
          </span>
        </div>
        <span className="mt-2 inline-block font-sans text-xs font-semibold uppercase tracking-wide text-rust transition-colors duration-200 group-hover:underline">
          Start learning &rarr;
        </span>
      </div>

      {/* Price badge */}
      <span
        className={[
          "shrink-0 rounded-full px-3.5 py-1.5 font-sans text-xs font-medium tracking-wide",
          isFree
            ? "bg-success/10 text-success"
            : "bg-rust/10 text-rust",
        ].join(" ")}
      >
        {isFree ? "Free" : `~${resource.pricePln} PLN`}
      </span>
    </a>
  );
}
