export default function ExpenseBreakdownSection({
  title,
  fields,
  values,
  onChange,
}) {
  return (
    <section className="bg-white rounded-xl border p-6 mt-8">
      <h2 className="font-semibold text-xl mb-5">{title}</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">
              {label}
            </label>
            <div className="relative flex items-center border border-[#D1DDE8] rounded-lg bg-white transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] hover:border-[#A8BCCF]">
              <span className="pl-3 text-[#6B7E99] text-sm font-mono-num select-none">₹</span>
              <input
                type="number"
                min="0"
                value={values[key] || 0}
                onChange={(e) => onChange(key, Number(e.target.value) || 0)}
                className="w-full bg-transparent outline-none p-3 pl-1.5 text-sm font-mono-num font-semibold text-[#0D1B2E]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}