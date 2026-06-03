export default function ExpenseBreakdownSection({
  title,
  fields,
  values,
  onChange,
}) {
  return (
    <section className="bg-white rounded-xl border p-6 mt-8">
      <h2 className="font-semibold text-xl mb-5">
        {title}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="block mb-2 font-medium">
              {label}
            </label>

            <input
              type="number"
              min="0"
              value={values[key] || 0}
              onChange={(e) =>
                onChange(
                  key,
                  Number(e.target.value) || 0
                )
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
        ))}
      </div>
    </section>
  );
}