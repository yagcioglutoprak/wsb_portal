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

  const availableItems = items.filter(
    (item) => !Object.values(placements).includes(item.id)
  );

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (!draggedItem) return;
    const next = { ...placements, [zoneId]: draggedItem.id };
    setPlacements(next);
    setDraggedItem(null);
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
  };

  const handleCheck = () => {
    const isCorrect = checkCorrect(placements);
    setFeedback(isCorrect);
    if (isCorrect) onComplete?.();
  };

  const allPlaced = zones.every((z) => placements[z.id]);

  return (
    <div className="space-y-4">
      {/* Drop zones */}
      <div className="flex flex-wrap gap-3">
        {zones.map((zone) => {
          const placedItem = items.find((i) => i.id === placements[zone.id]);
          return (
            <div
              key={zone.id}
              onDrop={(e) => handleDrop(e, zone.id)}
              onDragOver={handleDragOver}
              className={`min-h-[60px] min-w-[120px] rounded-lg border-2 border-dashed p-3 transition-colors ${
                placedItem
                  ? "border-rust/30 bg-rust/5"
                  : "border-stone-300 bg-stone-50"
              }`}
            >
              {renderZone ? (
                renderZone(zone, placedItem, () => handleRemove(zone.id))
              ) : (
                <>
                  <p className="mb-1 text-xs font-semibold text-graphite">
                    {zone.label}
                  </p>
                  {placedItem ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">
                        {placedItem.label}
                      </span>
                      <button
                        onClick={() => handleRemove(zone.id)}
                        className="text-xs text-pencil hover:text-red-500"
                      >
                        \u2715
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-pencil">Drop here</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Available items */}
      <div className="flex flex-wrap gap-2">
        {availableItems.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="cursor-grab rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:cursor-grabbing"
          >
            {renderItem ? renderItem(item) : item.label}
          </div>
        ))}
      </div>

      {/* Check button */}
      {allPlaced && feedback === null && (
        <button
          onClick={handleCheck}
          className="rounded-lg bg-rust px-5 py-2 text-sm font-semibold text-white"
        >
          Check Answer
        </button>
      )}

      {/* Feedback */}
      {feedback !== null && (
        <div
          className={`rounded-lg border-l-3 p-3 ${
            feedback ? "border-green-500 bg-green-50" : "border-red-400 bg-red-50"
          }`}
        >
          <p className="text-sm font-semibold">
            {feedback ? "Correct!" : "Not quite \u2014 try rearranging."}
          </p>
          {!feedback && (
            <button
              onClick={() => {
                setPlacements({});
                setFeedback(null);
              }}
              className="mt-1 text-sm font-semibold text-rust hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
