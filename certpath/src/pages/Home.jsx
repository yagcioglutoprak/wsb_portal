import { fields } from "../data/mock";
import FieldCard from "../components/FieldCard";

export default function Home() {
  return (
    <section className="py-8 sm:py-16">
      {/* Heading block */}
      <div
        className="mx-auto max-w-2xl text-center animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-pencil">
          Choose your path
        </span>
        <h1 className="mt-4 font-serif text-4xl italic leading-tight text-ink sm:text-5xl">
          What do you want to work in?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-graphite sm:text-lg">
          Pick a field. See the certifications that matter, in the order that
          makes sense, matched to real jobs in Poland.
        </p>
      </div>

      {/* Field grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field, i) => (
          <div key={field.id} className="animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
            <FieldCard field={field} index={i} />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        className="mt-12 text-center font-mono text-xs tracking-wider text-pencil animate-fade-in-up"
        style={{ animationDelay: `${(fields.length + 2) * 80}ms` }}
      >
        No sign-up needed. Start exploring now.
      </p>
    </section>
  );
}
