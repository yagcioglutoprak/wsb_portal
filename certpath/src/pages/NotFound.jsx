import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="font-mono text-7xl font-light tracking-wider text-faint">
        404
      </span>
      <h1 className="mt-4 font-serif text-3xl italic text-ink">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-graphite">
        The page you are looking for does not exist or may have been moved.
        Head back to the home page and pick a field to explore.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-rust px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
      >
        <span aria-hidden="true">&larr;</span>
        Back to fields
      </Link>
    </section>
  );
}
