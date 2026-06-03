export default function ChildrenSummary({
  children,
}) {
  const total =
    children.reduce(
      (sum, child) =>
        sum +
        (child.education || 0) +
        (child.allowance || 0) +
        (child.holiday || 0) +
        (child.medical || 0),
      0
    );

  return (
    <section className="bg-white rounded-xl border p-6 mt-8">
      <h2 className="font-semibold text-xl mb-4">
        Children Summary
      </h2>

      <p className="text-[#6B7E99]">
        Total Monthly Child Expenses
      </p>

      <p className="text-3xl font-bold mt-2">
        ₹{total.toLocaleString()}
      </p>
    </section>
  );
}