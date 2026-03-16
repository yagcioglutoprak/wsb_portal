import { useState, useEffect } from "react";

export default function DragDrop({
  items,
  zones,
  onDrop,
  renderItem,
  renderZone,
  onComplete,
  checkCorrect,
}) {
  const [placements, setPlacements] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [wrongZones, setWrongZones] = useState([]);
  const [correctZones, setCorrectZones] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const availableItems = items.filter(
    (item) => !Object.values(placements).includes(item.id)
  );

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (!draggedItem) return;
    const next = { ...placements, [zoneId]: draggedItem.id };
    setPlacements(next);
    setDraggedItem(null);
    setIsDragging(false);
    onDrop?.(next);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleRemove = (zoneId) => {
    const next = { ...placements };
    delete next[zoneId];
    setPlacements(next);
    setFeedback(null);
    setWrongZones([]);
    setCorrectZones([]);
  };

  const handleCheck = () => {
    const isCorrect = checkCorrect(placements);
    setFeedback(isCorrect);

    if (isCorrect) {
      // Staggered green reveals
      zones.forEach((z, i) => {
        setTimeout(() => {
          setCorrectZones((prev) => [...prev, z.id]);
        }, i * 200);
      });
      setTimeout(() => onComplete?.(), zones.length * 200 + 300);
    } else {
      // Find which zones are wrong for shaking
      const wrongIds = zones
        .filter((z) => {
          const correctPlacements = {};
          // We don't know exact correctness per zone, so shake all on wrong
          return placements[z.id] !== undefined;
        })
        .map((z) => z.id);
      setWrongZones(wrongIds);
      setTimeout(() => setWrongZones([]), 500);
    }
  };

  const handleReset = () => {
    setPlacements({});
    setFeedback(null);
    setWrongZones([]);
    setCorrectZones([]);
  };

  const allPlaced = zones.every((z) => placements[z.id]);

  return (
    <div className="space-y-6">
      {/* Drop zones */}
      <div className="flex flex-wrap gap-4">
        {zones.map((zone) => {
          const placedItem = items.find((i) => i.id === placements[zone.id]);
          const isWrong = wrongZones.includes(zone.id);
          const isCorrectZone = correctZones.includes(zone.id);

          return (
            <div
              key={zone.id}
              onDrop={(e) => handleDrop(e, zone.id)}
              onDragOver={handleDragOver}
              className={[
                "relative min-h-[72px] min-w-[140px] rounded-xl border-2 border-dashed p-4 transition-all duration-300",
                isCorrectZone
                  ? "border-emerald-400 bg-emerald-50/70 shadow-sm shadow-emerald-100"
                  : placedItem
                    ? "border-rust/30 bg-rust/5"
                    : isDragging
                      ? "border-rust/50 bg-rust/5"
                      : "border-stone-300 bg-stone-50/60",
                isWrong ? "animate-shake" : "",
                isDragging && !placedItem ? "animate-glow-pulse" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Correct checkmark overlay */}
              {isCorrectZone && (
                <div className="animate-lesson-enter absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {renderZone ? (
                renderZone(zone, placedItem, () => handleRemove(zone.id))
              ) : (
                <>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-graphite/70">
                    {zone.label}
                  </p>
                  {placedItem ? (
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-sm font-semibold text-ink"
                        style={{
                          animation: "counter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                        }}
                      >
                        {placedItem.label}
                      </span>
                      {!feedback && (
                        <button
                          onClick={() => handleRemove(zone.id)}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200/80 text-xs text-graphite transition-colors hover:bg-red-100 hover:text-red-500"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs italic text-pencil/60">Drop here</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Available items */}
      {availableItems.length > 0 && (
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-pencil/60">
            Available pieces
          </p>
          <div className="flex flex-wrap gap-3">
            {availableItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className={[
                  "cursor-grab select-none rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm transition-all duration-200",
                  "hover:scale-105 hover:shadow-lg hover:border-rust/30",
                  "active:cursor-grabbing active:scale-100",
                  draggedItem?.id === item.id
                    ? "scale-105 border-rust/50 shadow-lg opacity-60"
                    : "border-stone-200",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {renderItem ? renderItem(item) : item.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check button */}
      {allPlaced && feedback === null && (
        <button
          onClick={handleCheck}
          className="animate-lesson-enter rounded-xl bg-gradient-to-r from-rust to-blue-700 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-rust/20 transition-all duration-200 hover:shadow-lg hover:shadow-rust/30 hover:brightness-110 active:scale-[0.98]"
        >
          Check Answer
        </button>
      )}

      {/* Feedback */}
      {feedback !== null && (
        <div
          className={[
            "animate-lesson-enter rounded-2xl border p-5",
            feedback
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/40"
              : "border-red-200 bg-gradient-to-br from-red-50 to-orange-50/30",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <span
              className={[
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white",
                feedback ? "bg-emerald-500" : "bg-red-400",
              ].join(" ")}
            >
              {feedback ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            <div>
              <p
                className={[
                  "text-sm font-bold",
                  feedback ? "text-emerald-800" : "text-red-800",
                ].join(" ")}
              >
                {feedback
                  ? "Perfect placement!"
                  : "Not quite -- try rearranging."}
              </p>
              {!feedback && (
                <button
                  onClick={handleReset}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-rust/10 px-4 py-2 text-sm font-semibold text-rust transition-colors hover:bg-rust/20"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 4v6h6" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Reset and try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
