import { useState } from "react";

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
  const [dragOverZone, setDragOverZone] = useState(null);
  const [removingZone, setRemovingZone] = useState(null);
  const [showRipple, setShowRipple] = useState(false);

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
    setDragOverZone(null);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (!draggedItem) return;
    const next = { ...placements, [zoneId]: draggedItem.id };
    setPlacements(next);
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverZone(null);
    onDrop?.(next);
  };

  const handleDragOver = (e, zoneId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverZone(zoneId);
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleRemove = (zoneId) => {
    setRemovingZone(zoneId);
    setTimeout(() => {
      const next = { ...placements };
      delete next[zoneId];
      setPlacements(next);
      setFeedback(null);
      setWrongZones([]);
      setCorrectZones([]);
      setRemovingZone(null);
    }, 250);
  };

  const handleCheck = () => {
    const isCorrect = checkCorrect(placements);
    setFeedback(isCorrect);

    if (isCorrect) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 800);
      zones.forEach((z, i) => {
        setTimeout(() => {
          setCorrectZones((prev) => [...prev, z.id]);
        }, i * 200);
      });
      setTimeout(() => onComplete?.(), zones.length * 200 + 300);
    } else {
      const wrongIds = zones
        .filter((z) => placements[z.id] !== undefined)
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
    <div
      className={[
        "relative space-y-6 rounded-2xl p-1 transition-all duration-300",
        showRipple ? "animate-ripple-green" : "",
        feedback === false ? "animate-red-flash" : "",
      ].filter(Boolean).join(" ")}
    >
      {/* Drop zones */}
      <div className="flex flex-wrap gap-4">
        {zones.map((zone) => {
          const placedItem = items.find((i) => i.id === placements[zone.id]);
          const isWrong = wrongZones.includes(zone.id);
          const isCorrectZone = correctZones.includes(zone.id);
          const isOver = dragOverZone === zone.id && isDragging;
          const isRemoving = removingZone === zone.id;

          return (
            <div
              key={zone.id}
              onDrop={(e) => handleDrop(e, zone.id)}
              onDragOver={(e) => handleDragOver(e, zone.id)}
              onDragLeave={handleDragLeave}
              className={[
                "relative min-h-[80px] min-w-[150px] rounded-xl p-4 transition-all duration-300",
                isCorrectZone
                  ? "border-2 border-emerald-400 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 shadow-md shadow-emerald-100"
                  : placedItem
                    ? "border-2 border-rust/30 bg-gradient-to-br from-rust/5 to-blue-50/30"
                    : "border-2 border-dashed",
                !placedItem && !isCorrectZone
                  ? isOver
                    ? "border-rust/60 bg-rust/8 shadow-lg shadow-rust/10"
                    : isDragging
                      ? "border-rust/30 bg-rust/3"
                      : "border-stone-300 bg-stone-50/60"
                  : "",
                isWrong ? "animate-shake" : "",
                isOver && !placedItem ? "scale-[1.02]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                !placedItem && !isCorrectZone && isDragging && !isOver
                  ? {
                      borderImage: "none",
                    }
                  : undefined
              }
            >
              {/* Glow effect when dragging over */}
              {isOver && !placedItem && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(40, 86, 166, 0.08) 0%, transparent 70%)",
                    animation: "glow-pulse 1.5s ease-in-out infinite",
                  }}
                />
              )}

              {/* Correct checkmark overlay */}
              {isCorrectZone && (
                <div className="animate-snap-in absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-md shadow-emerald-200">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 24,
                        strokeDashoffset: 0,
                        animation: "checkDraw 0.4s ease-out forwards",
                      }}
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
                    <div
                      className={[
                        "flex items-center justify-between gap-2",
                        isRemoving ? "animate-scale-out" : "animate-snap-in",
                      ].join(" ")}
                    >
                      <span className="text-sm font-semibold text-ink">
                        {placedItem.label}
                      </span>
                      {!feedback && (
                        <button
                          onClick={() => handleRemove(zone.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200/80 text-xs text-graphite transition-all duration-200 hover:bg-red-100 hover:text-red-500 hover:scale-110"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs italic text-pencil/50">
                      {isDragging ? "Drop here" : "Waiting for item..."}
                    </p>
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
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pencil/60">
            <span>Drag these</span>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-pencil/40">
              <path d="M0 6h12M9 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </p>
          <div className="flex flex-wrap gap-3">
            {availableItems.map((item) => {
              const isBeingDragged = draggedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  className={[
                    "cursor-grab select-none rounded-xl border px-5 py-3 text-sm font-semibold text-ink transition-all duration-200",
                    // Frosted glass look
                    "bg-white/80 backdrop-blur-sm shadow-sm",
                    // Hover
                    "hover:scale-105 hover:shadow-lg hover:shadow-rust/10 hover:border-rust/30",
                    // Active
                    "active:cursor-grabbing active:scale-100",
                    // Dragging state
                    isBeingDragged
                      ? "scale-105 border-rust/50 shadow-xl shadow-rust/20 opacity-60 rotate-1"
                      : "border-stone-200/80",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    !isBeingDragged
                      ? {
                          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(253,252,250,0.8) 100%)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.06)",
                        }
                      : undefined
                  }
                >
                  {renderItem ? renderItem(item) : item.label}
                </div>
              );
            })}
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
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50/60 to-teal-50/40"
              : "border-red-200 bg-gradient-to-br from-red-50 via-red-50/60 to-orange-50/30",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            <span
              className={[
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-white shadow-sm",
                feedback ? "bg-emerald-500 shadow-emerald-200" : "bg-red-400 shadow-red-200",
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
                  className="animate-pulse-try-again mt-3 inline-flex items-center gap-2 rounded-xl bg-rust/10 px-5 py-2.5 text-sm font-semibold text-rust transition-all duration-200 hover:bg-rust/20 hover:shadow-md hover:shadow-rust/10"
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
