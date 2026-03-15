import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fields, certifications } from "../data/mock";
import { programs } from "../data/programs";

const TOTAL_STEPS = 4;
const AUTO_ADVANCE_MS = 400;

const years = [
  { id: "1", label: "1st year" },
  { id: "2", label: "2nd year" },
  { id: "3", label: "3rd year" },
  { id: "4", label: "4th year" },
  { id: "5", label: "5th year" },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Progress dots                                                       */
/* ──────────────────────────────────────────────────────────────────── */

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            "h-2 w-2 rounded-full transition-all duration-300",
            i + 1 === current
              ? "bg-rust scale-125"
              : i + 1 < current
                ? "bg-rust/40"
                : "bg-pencil/20",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Selectable card                                                     */
/* ──────────────────────────────────────────────────────────────────── */

function SelectCard({ label, selected, onClick, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-lg border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-rust bg-rust/5 shadow-sm"
          : "border-faint bg-white hover:border-pencil/30",
      ].join(" ")}
    >
      <span className="block font-serif text-lg italic text-ink">{label}</span>
      {description && (
        <span className="mt-1 block text-sm leading-relaxed text-graphite">
          {description}
        </span>
      )}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Step wrapper with transition                                        */
/* ──────────────────────────────────────────────────────────────────── */

function StepWrapper({ visible, direction, children }) {
  return (
    <div
      className="transition-all duration-400 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : direction === "forward"
            ? "translateX(40px)"
            : "translateX(-40px)",
        transitionDuration: "400ms",
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Onboarding page                                                     */
/* ──────────────────────────────────────────────────────────────────── */

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [visible, setVisible] = useState(true);

  const [year, setYear] = useState(null);
  const [program, setProgram] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  /* Advance with animation */
  const goToStep = useCallback(
    (next) => {
      const dir = next > step ? "forward" : "back";
      setDirection(dir);
      setVisible(false);
      setTimeout(() => {
        setStep(next);
        setDirection(dir);
        setVisible(true);
      }, 300);
    },
    [step],
  );

  const goBack = useCallback(() => {
    if (step > 1) goToStep(step - 1);
  }, [step, goToStep]);

  /* Auto-advance after selection */
  const selectAndAdvance = useCallback(
    (setter, value) => {
      setter(value);
      if (step < TOTAL_STEPS) {
        setTimeout(() => goToStep(step + 1), AUTO_ADVANCE_MS);
      }
    },
    [step, goToStep],
  );

  /* Filtered fields for step 3 */
  const programData = programs.find((p) => p.id === program);
  const availableFields =
    programData && programData.fieldSlugs
      ? fields.filter((f) => programData.fieldSlugs.includes(f.slug))
      : fields;

  /* Data for result screen */
  const chosenField = fields.find((f) => f.slug === selectedField);
  const fieldCerts = selectedField ? certifications[selectedField] || [] : [];
  const stages = {};
  fieldCerts.forEach((cert) => {
    if (!stages[cert.stage]) stages[cert.stage] = [];
    stages[cert.stage].push(cert);
  });
  const stageNums = Object.keys(stages)
    .map(Number)
    .sort((a, b) => a - b);
  const previewStages = stageNums.slice(0, 2);

  const yearLabel = years.find((y) => y.id === year)?.label;
  const programLabel = programs.find((p) => p.id === program)?.name;

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center py-8 sm:py-16">
      {/* Progress + back */}
      <div className="mb-10 flex w-full max-w-2xl items-center justify-between px-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="font-mono text-xs uppercase tracking-wider text-graphite transition-colors duration-200 hover:text-rust"
          >
            &larr; Back
          </button>
        ) : (
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-wider text-graphite transition-colors duration-200 hover:text-rust"
          >
            &larr; Home
          </Link>
        )}
        <ProgressDots current={step} total={TOTAL_STEPS} />
      </div>

      {/* Step content */}
      <div className="w-full max-w-2xl px-4">
        <StepWrapper visible={visible} direction={direction}>
          {/* ── Step 1: Year ──────────────────────────────── */}
          {step === 1 && (
            <div>
              <span className="block font-mono text-xs tracking-widest text-pencil">
                01
              </span>
              <h1 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
                What year are you in?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-graphite">
                This helps us recommend the right starting point for your
                certification journey.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {years.map((y) => (
                  <SelectCard
                    key={y.id}
                    label={y.label}
                    selected={year === y.id}
                    onClick={() => selectAndAdvance(setYear, y.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Program ──────────────────────────── */}
          {step === 2 && (
            <div>
              <span className="block font-mono text-xs tracking-widest text-pencil">
                02
              </span>
              <h1 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
                What are you studying?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-graphite">
                Your program shapes which certifications are most valuable for
                your career.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {programs.map((p) => (
                  <SelectCard
                    key={p.id}
                    label={p.name}
                    selected={program === p.id}
                    onClick={() => selectAndAdvance(setProgram, p.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Field ────────────────────────────── */}
          {step === 3 && (
            <div>
              <span className="block font-mono text-xs tracking-widest text-pencil">
                03
              </span>
              <h1 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
                What excites you most?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-graphite">
                Pick the field that sparks your curiosity. You can always explore
                others later.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableFields.map((f) => (
                  <SelectCard
                    key={f.id}
                    label={f.name}
                    description={f.description}
                    selected={selectedField === f.slug}
                    onClick={() =>
                      selectAndAdvance(setSelectedField, f.slug)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Result ───────────────────────────── */}
          {step === 4 && (
            <div>
              <span className="block font-mono text-xs tracking-widest text-pencil">
                04
              </span>
              <h1 className="mt-3 font-serif text-3xl italic text-ink sm:text-4xl">
                Here is your path.
              </h1>
              {chosenField && (
                <p className="mt-3 text-base leading-relaxed text-graphite">
                  As a {yearLabel} {programLabel} student interested in{" "}
                  <span className="font-medium text-ink">
                    {chosenField.name}
                  </span>
                  , here is where we recommend you start.
                </p>
              )}

              {/* Mini roadmap preview */}
              {previewStages.length > 0 && (
                <div className="mt-10 space-y-6">
                  {previewStages.map((stageNum) => (
                    <div
                      key={stageNum}
                      className="rounded-lg border border-faint bg-white p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rust text-white font-mono text-xs font-medium">
                          {stageNum}
                        </div>
                        <div>
                          <span className="block font-mono text-[10px] uppercase tracking-widest text-pencil">
                            Stage {String(stageNum).padStart(2, "0")}
                          </span>
                          <span className="block font-serif text-lg italic text-ink">
                            {stages[stageNum][0]?.stageName ||
                              `Stage ${stageNum}`}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 pl-11">
                        {stages[stageNum].map((cert) => (
                          <div
                            key={cert.id}
                            className="flex items-baseline justify-between border-b border-faint pb-2 last:border-0 last:pb-0"
                          >
                            <div>
                              <span className="text-sm font-medium text-ink">
                                {cert.name}
                              </span>
                              <span className="ml-2 font-mono text-xs text-pencil">
                                {cert.provider}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-pencil">
                              ~{Math.round(cert.durationWeeks / 4)} mo
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {stageNums.length > 2 && (
                    <p className="text-center font-mono text-xs tracking-wider text-pencil">
                      + {stageNums.length - 2} more stage
                      {stageNums.length - 2 > 1 ? "s" : ""} in the full
                      roadmap
                    </p>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                {chosenField && (
                  <Link
                    to={`/fields/${chosenField.slug}`}
                    className="inline-block rounded bg-rust px-8 py-3.5 font-mono text-sm uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rust/20"
                  >
                    View full roadmap
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedField(null);
                    goToStep(3);
                  }}
                  className="font-mono text-xs uppercase tracking-wider text-graphite transition-colors duration-200 hover:text-rust"
                >
                  Choose a different path
                </button>
              </div>
            </div>
          )}
        </StepWrapper>
      </div>
    </section>
  );
}
