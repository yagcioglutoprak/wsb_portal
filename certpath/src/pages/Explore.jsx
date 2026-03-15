import { Link } from "react-router-dom";
import { fields } from "../data/mock";
import FieldCard from "../components/FieldCard";

export default function Explore() {
  return (
    <section className="py-4">
      {/* Breadcrumb */}
      <nav
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <ol className="flex items-center gap-2 font-mono text-xs tracking-wider text-pencil">
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
        <span className="font-mono text-xs uppercase tracking-widest text-pencil">
          Browse all paths
        </span>
        <h1 className="mt-4 font-serif text-4xl italic leading-tight text-ink sm:text-5xl">
          Explore all fields
        </h1>
        <p className="mt-4 text-base leading-relaxed text-graphite sm:text-lg">
          Pick a field. See the certifications that matter, in the order that
          makes sense, matched to real jobs in Poland.
        </p>
      </div>

      {/* Field grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field, i) => (
          <div
            key={field.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(i + 2) * 80}ms` }}
          >
            <FieldCard field={field} index={i} />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        className="mt-12 text-center font-mono text-xs tracking-wider text-pencil animate-fade-in-up"
        style={{ animationDelay: `${(fields.length + 3) * 80}ms` }}
      >
        No sign-up needed. Start exploring now.
      </p>
    </section>
  );
}
