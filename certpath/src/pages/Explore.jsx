import { Link } from "react-router-dom";
import { fields } from "../data/mock";
import FieldCard from "../components/FieldCard";
import useScrollReveal from "../hooks/useScrollReveal";

function RevealOnScroll({ children, delay = 0 }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Explore() {
  return (
    <section className="py-4">
      {/* Breadcrumb */}
      <nav
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <ol className="flex items-center gap-2 font-sans text-sm text-pencil">
          <li>
            <Link to="/" className="transition-colors hover:text-rust">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-ink">Explore</li>
        </ol>
      </nav>

      {/* Heading block */}
      <div
        className="mx-auto max-w-2xl text-center animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-pencil">
          Explore paths
        </span>
        <h1 className="mt-4 font-sans text-4xl font-bold text-ink sm:text-5xl">
          Pick a field you're interested in
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-graphite sm:text-xl">
          Each field comes with a certification roadmap, learning resources,
          and real job listings in Poland. Pick one and see where it can take you.
        </p>
      </div>

      {/* Field grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field, i) => (
          <RevealOnScroll key={field.id} delay={i * 80}>
            <FieldCard field={field} index={i} />
          </RevealOnScroll>
        ))}
      </div>

      {/* Footer note */}
      <p
        className="mt-12 text-center font-sans text-sm text-pencil animate-fade-in-up"
        style={{ animationDelay: `${(fields.length + 3) * 80}ms` }}
      >
        No account needed — start exploring right away.
      </p>
    </section>
  );
}
