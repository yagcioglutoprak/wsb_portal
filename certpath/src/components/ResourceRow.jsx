export default function ResourceRow({ resource }) {
  const isFree = resource.pricePln === 0 || resource.pricePln === null;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-4 rounded-md border border-faint bg-white px-4 py-3 transition-all duration-200 hover:translate-x-1 hover:border-pencil/30"
    >
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-rust">
          {resource.title}
        </h4>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] tracking-wider text-pencil">
            {resource.platform}
          </span>
          <span className="text-faint">|</span>
          <span className="font-mono text-[11px] tracking-wider text-pencil">
            {resource.type}
          </span>
          <span className="text-faint">|</span>
          <span className="font-mono text-[11px] tracking-wider text-pencil">
            {resource.estimatedHours}h
          </span>
        </div>
      </div>

      {/* Price badge */}
      <span
        className={[
          "shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-medium tracking-wider",
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
