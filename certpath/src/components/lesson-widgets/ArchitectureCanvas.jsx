import { useState } from "react";

export default function ArchitectureCanvas({ data, onComplete }) {
  const { slots, components, correctPlacement } = data;
  const [placements, setPlacements] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const available = components.filter(
    (c) => !Object.values(placements).includes(c.id)
  );

  const handleDragStart = (id) => setDraggedId(id);

  const handleDrop = (e, slotId) => {
    e.preventDefault();
    if (!draggedId) return;
    setPlacements((prev) => {
      const next = { ...prev };
      // Remove from previous slot if any
      Object.keys(next).forEach((k) => {
        if (next[k] === draggedId) delete next[k];
      });
      next[slotId] = draggedId;
      return next;
    });
    setDraggedId(null);
    setChecked(false);
  };

  const handleRemove = (slotId) => {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    setChecked(false);
  };

  const handleDropBack = () => {
    if (!draggedId) return;
    setPlacements((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === draggedId) delete next[k];
      });
      return next;
    });
    setDraggedId(null);
  };

  const handleCheck = () => {
    const correct =
      Object.keys(correctPlacement).every(
        (slotId) => placements[slotId] === correctPlacement[slotId]
      );
    setChecked(true);
    setIsCorrect(correct);
    if (correct) onComplete?.();
  };

  const allPlaced = slots.every((s) => placements[s.id]);

  // Group slots by tier
  const tiers = [...new Set(slots.map((s) => s.tier))];

  return (
    <div className="space-y-5">
      {/* Architecture grid */}
      <div className="rounded-xl border border-stone-200 bg-card p-6 shadow-sm">
        <div className="space-y-4">
          {tiers.map((tier) => {
            const tierSlots = slots.filter((s) => s.tier === tier);
            return (
              <div key={tier}>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-pencil">
                  {tier}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {tierSlots.map((slot) => {
                    const compId = placements[slot.id];
                    const comp = components.find((c) => c.id === compId);
                    const slotCorrect = checked && compId === correctPlacement[slot.id];
                    const slotWrong = checked && compId && compId !== correctPlacement[slot.id];
                    return (
                      <div
                        key={slot.id}
                        onDrop={(e) => handleDrop(e, slot.id)}
                        onDragOver={(e) => e.preventDefault()}
                        className={`relative flex h-24 w-36 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
                          comp
                            ? slotCorrect
                              ? "border-green-400 bg-green-50 shadow-md"
                              : slotWrong
                                ? "border-red-400 bg-red-50 shadow-md"
                                : "border-rust/30 bg-rust/5 shadow-sm"
                            : "border-stone-300 bg-stone-50 hover:border-rust/40 hover:bg-rust/5"
                        }`}
                      >
                        {comp ? (
                          <>
                            <span className="text-2xl">{comp.emoji}</span>
                            <span className="mt-1 text-xs font-semibold text-ink">
                              {comp.label}
                            </span>
                            <button
                              onClick={() => handleRemove(slot.id)}
                              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-[10px] text-stone-600 hover:bg-red-200 hover:text-red-600 transition-colors"
                            >
                              {"\u2715"}
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-medium text-pencil">{slot.label}</span>
                            <span className="mt-0.5 text-[10px] text-stone-400">drop here</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection arrows between tiers */}
        {tiers.length > 1 && (
          <div className="flex justify-center">
            <div className="my-1 flex flex-col items-center">
              {tiers.slice(0, -1).map((_, i) => (
                <div key={i} className="text-stone-300 text-lg">{"\u2193"}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Available components */}
      <div
        className="flex flex-wrap gap-3 justify-center"
        onDrop={(e) => { e.preventDefault(); handleDropBack(); }}
        onDragOver={(e) => e.preventDefault()}
      >
        {available.map((comp) => (
          <div
            key={comp.id}
            draggable
            onDragStart={() => handleDragStart(comp.id)}
            className="flex cursor-grab items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:cursor-grabbing"
          >
            <span className="text-xl">{comp.emoji}</span>
            <span className="text-sm font-semibold text-ink">{comp.label}</span>
          </div>
        ))}
      </div>

      {/* Check button */}
      {allPlaced && !checked && (
        <div className="flex justify-center">
          <button
            onClick={handleCheck}
            className="rounded-lg bg-rust px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Check Architecture
          </button>
        </div>
      )}

      {/* Feedback */}
      {checked && (
        <div className={`rounded-lg border-l-3 p-4 animate-fade-in-up ${
          isCorrect ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"
        }`}>
          <p className="text-sm font-semibold text-ink">
            {isCorrect
              ? "Architecture looks great! All components correctly placed."
              : "Some components are misplaced. Think about the flow: requests enter, get processed, then stored."}
          </p>
          {!isCorrect && (
            <button
              onClick={() => { setPlacements({}); setChecked(false); }}
              className="mt-2 text-sm font-semibold text-rust hover:underline"
            >
              Reset and try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
