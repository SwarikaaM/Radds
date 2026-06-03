export default function BookingSummary({
  date,
  slot,
}) {
  if (!date || !slot) return null;

  return (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="font-semibold mb-4">
        Consultation Summary
      </h3>

      <div className="space-y-2 text-[#6B7E99]">
        <p>
          <strong>Date:</strong>{" "}
          {new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <p>
          <strong>Time:</strong> {slot}
        </p>

        <p>
          <strong>Duration:</strong> 30 Minutes
        </p>

        <p>
          <strong>Advisor:</strong>
          {" "}
          Radds Capital Team
        </p>

        <p>
          <strong>Meeting:</strong>
          {" "}
          Online Consultation
        </p>

        <p>
          <strong>Timezone:</strong>
          {" "}
          Asia/Kolkata
        </p>
      </div>
    </div>
  );
}