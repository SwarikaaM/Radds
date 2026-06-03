export default function TimeSlotGrid({
  slots,
  selectedSlot,
  onSelect,
}) {
  if (!slots.length) {
    return (
      <div className="bg-white rounded-xl border p-5 text-[#6B7E99]">
        Select a working day to view
        available consultation slots.
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">
        Available Time Slots
      </h3>

      <div className="grid sm:grid-cols-3 gap-3">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`
              p-3 rounded-lg border transition
              ${
                selectedSlot === slot
                  ? "bg-primary text-white border-primary"
                  : "bg-white hover:border-primary"
              }
            `}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}