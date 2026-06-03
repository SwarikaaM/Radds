import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const rows = [
  ["Mutual Funds", "Long-term investors", "5–15 Years", "Moderate"],
  ["Equity & Shares", "Growth seekers", "7+ Years", "High"],
  ["SIP Planning", "Goal-based investing", "3–20 Years", "Moderate"],
  ["Insurance", "Family protection", "10+ Years", "Low"],
  ["NPS", "Retirement planning", "15–30 Years", "Moderate"],
  ["FDs & Bonds", "Capital preservation", "1–7 Years", "Low"],
];

export default function ServiceComparison() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Comparison"
          title="Find the Right Service for Your Needs"
          subtitle="A quick overview of where each solution fits best."
        />

        <ScrollReveal>
          <div className="overflow-x-auto mt-14 border border-[#E2EBF5] rounded-xl">
            <table className="w-full">
              <thead className="bg-[#F4F8FC]">
                <tr>
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">Best For</th>
                  <th className="text-left p-4">Planning Horizon</th>
                  <th className="text-left p-4">Risk Level</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t border-[#E2EBF5]"
                  >
                    {row.map((cell) => (
                      <td
                        key={cell}
                        className="p-4 text-textmuted"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}