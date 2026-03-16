export default function InsightBox({ title = "Key insight", children }) {
  return (
    <div className="rounded-r-lg border-l-3 border-amber-400 bg-amber-50/60 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
        {title}
      </p>
      <div className="mt-1 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}
