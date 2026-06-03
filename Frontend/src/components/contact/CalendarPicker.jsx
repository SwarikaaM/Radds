import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPicker({
  selectedDate,
  onSelectDate,
}) {
  const [month, setMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledDays = [
    { before: today },
    { dayOfWeek: [0, 6] }, // Sunday & Saturday
  ];

  const handleSelect = (date) => {
    if (!date) return;

    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(  date.getDate()).padStart(2, "0")}`;

    onSelectDate(formatted);
  };

  const selected =
    selectedDate
      ? new Date(selectedDate)
      : undefined;

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-[#0D1B2E]">
          Select Consultation Date
        </h3>

        <p className="text-sm text-[#6B7E99] mt-1">
          Available Monday–Friday,
          10:00 AM – 4:00 PM
        </p>
      </div>

      <DayPicker
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={(date) => {
          if (!date) return;

          const formatted = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")}`;

          onSelectDate(formatted);
        }}
        disabled={disabledDays}
        showOutsideDays={false}
        className="w-full"
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            ),
        }}
      />
    </div>
  );
}