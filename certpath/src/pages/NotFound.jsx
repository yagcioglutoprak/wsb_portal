import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="font-sans text-6xl font-bold text-faint">
        404
      </span>
      <h1 className="mt-4 font-sans text-2xl font-bold text-ink">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-graphite">
        The page you are looking for does not exist or may have been moved.
        Head back to the home page and pick a field to explore.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 bg-rust text-white rounded-xl px-8 py-3.5 font-sans text-sm font-semibold hover:bg-rust/90 hover:-translate-y-px transition-all duration-200"
      >
        <span aria-hidden="true">&larr;</span>
        Back to fields
      </Link>
    </section>
  );
}
