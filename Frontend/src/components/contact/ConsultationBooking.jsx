import { useState } from 'react';
import Button from '../ui/Button';
import CalendarPicker from './CalendarPicker';
import TimeSlotGrid from './TimeSlotGrid';
import BookingSummary from './BookingSummary';

const API = import.meta.env.VITE_API_URL;

export default function ConsultationBooking() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=pick date/time, 2=enter details, 3=confirmed
  const [form, setForm] = useState({ name: '', email: '', phone: '', purpose: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  async function handleDateSelect(date) {
    setSelectedDate(date);
    setSelectedSlot('');
    setStep(1);
    setSlotsLoading(true);
    try {
      const res = await fetch(`${API}/api/booking/available-slots?date=${date}`);
      const data = await res.json();
      // Convert ISO slots to display strings
      const formatted = data.map(slot => ({
        start: slot.start,
        end: slot.end,
        display: new Date(slot.start).toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true
        }),
      }));
      setSlots(formatted);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }

  async function handleConfirmBooking() {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    const slot = slots.find(s => s.display === selectedSlot);
    if (!slot) { setError('Invalid slot selected.'); setSubmitting(false); return; }

    try {
      const res = await fetch(`${API}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          purpose: form.purpose,
          scheduled_start_at: slot.start,
          scheduled_end_at: slot.end,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setBooking(data);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="book" className="py-24 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-playfair text-5xl font-bold mb-6">Book a Consultation</h2>
        <p className="text-[#6B7E99] mb-12">Choose a date and time slot to speak with our team.</p>

        {step === 3 ? (
          // Confirmation screen
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-green-200 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Consultation Booked!</h3>
            <p className="text-gray-600 mb-1"><strong>Date:</strong> {selectedDate}</p>
            <p className="text-gray-600 mb-1"><strong>Time:</strong> {selectedSlot}</p>
            <p className="text-gray-600 mb-4"><strong>Name:</strong> {form.name}</p>
            <p className="text-sm text-gray-500">
              A confirmation has been sent to <strong>{form.email}</strong>.
              Our team will connect with you at the scheduled time.
            </p>
            <button
              onClick={() => { setStep(1); setSelectedDate(''); setSelectedSlot(''); setForm({ name: '', email: '', phone: '', purpose: '' }); }}
              className="mt-6 text-sm text-[#22568F] hover:underline"
            >
              Book another slot
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[380px_minmax(0,1fr)] gap-8 items-start">
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />

            <div className="space-y-6">
              {/* Step 1: Pick time slot */}
              {slotsLoading ? (
                <div className="text-center py-8 text-[#6B7E99]">Loading available slots...</div>
              ) : (
                <TimeSlotGrid
                  slots={slots.map(s => s.display)}
                  selectedSlot={selectedSlot}
                  onSelect={(slot) => { setSelectedSlot(slot); setStep(selectedDate && slot ? 2 : 1); }}
                />
              )}

              {/* Step 2: Enter details */}
              {step >= 2 && selectedDate && selectedSlot && (
                <div className="bg-white rounded-xl border border-[#D7E7F7] p-6 space-y-4">
                  <h4 className="font-semibold text-textprimary">Your Details</h4>
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22568F]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22568F]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" required value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22568F]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Message (optional)</label>
                    <textarea value={form.purpose}
                      onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                      rows={3} placeholder="What would you like to discuss?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22568F]" />
                  </div>

                  <BookingSummary date={selectedDate} slot={selectedSlot} />

                  <Button onClick={handleConfirmBooking} disabled={submitting} className="w-full">
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
