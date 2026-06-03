import { useState } from "react";

import Button from "../ui/Button";

import CalendarPicker from "./CalendarPicker";
import TimeSlotGrid from "./TimeSlotGrid";
import BookingSummary from "./BookingSummary";

// const availability = await api.getAvailableSlots(); // when backend is ready

// Demo slot generation
const generateSlots = () => {
  const slots = [];

  for (let hour = 10; hour < 16; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const displayHour =  hour > 12 ? hour - 12 : hour;
      const period =      hour >= 12 ? "PM" : "AM";

      slots.push(
        `${displayHour}:${minute
          .toString()
          .padStart(2, "0")} ${period}`
      );
    }
  }
  slots.push("4:00 PM");
  return slots;
};

export default function ConsultationBooking() {
  const [selectedDate, setSelectedDate] =
  useState("");

  const [selectedSlot, setSelectedSlot] =
  useState("");

  const [success, setSuccess] =
  useState(false);

  const slots = selectedDate
  ? generateSlots()
  : [];

  // const slots = await api.getAvailableSlots(selectedDate);
  // when backend connected to Google Calendar / Outlook

  return ( 
    <section id="book" className="py-24 bg-[#F4F8FC]"> 
      <div className="max-w-7xl mx-auto px-6"> 
        <h2 className="font-playfair text-5xl font-bold mb-6">Book a Free Consultation </h2>

        <p className="text-[#6B7E99] mb-12">
          Choose a date and available
          time slot.
        </p>

        <div className="grid lg:grid-cols-[380px_minmax(0,1fr)] gap-8 items-start">
          <CalendarPicker
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedSlot("");
              setSuccess(false);
            }}
          />

          <div className="space-y-6">
            <TimeSlotGrid
              slots={slots}
              selectedSlot={selectedSlot}
              onSelect={(slot) => {
                setSelectedSlot(slot);
                setSuccess(false);
              }}
            />

            <BookingSummary
              date={selectedDate}
              slot={selectedSlot}
            />

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h4 className="font-semibold text-green-700 mb-2">
                  Consultation Reserved
                </h4>

                <p className="text-green-700 text-sm">
                  Date: {selectedDate}
                </p>

                <p className="text-green-700 text-sm">
                  Time: {selectedSlot}
                </p>

                <p className="text-green-700 text-sm mt-3">
                  Calendar integration will be
                  connected during the backend
                  phase.
                </p>
              </div>
            ) : (
              selectedDate &&
              selectedSlot && (
                <Button
                  onClick={() =>
                    setSuccess(true)
                  }
                >
                  Book Consultation
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
