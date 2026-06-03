export default function CalculatorExportBar() {
  return (
    <div className="rounded-xl border border-[#D7E7F7] bg-white p-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">

        <div>
          <h3 className="font-semibold">
            Export Calculator Report
          </h3>

          <p className="text-sm text-[#6B7E99]">
            Export profile, inputs, graph and results.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            disabled
            className="
              px-4
              py-2
              rounded-lg
              border
              border-[#D7E7F7]
              bg-gray-100
              text-gray-500
              cursor-not-allowed
            "
          >
            Export PDF
          </button>

          <button
            disabled
            className="
              px-4
              py-2
              rounded-lg
              border
              border-[#D7E7F7]
              bg-gray-100
              text-gray-500
              cursor-not-allowed
            "
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}