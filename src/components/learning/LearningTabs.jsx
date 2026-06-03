export default function LearningTabs({
  activeCategory,
  setActiveCategory,
}) {
  const categories = [
    "All",
    "Mutual Funds",
    "Insurance",
    "Tax Planning",
    "Stock Market",
    "Retirement",
    "Budgeting",
  ];

  return (
    <section className="bg-white border-b border-[#E2EBF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(category)
              }
              className={`
                px-5
                py-2
                rounded-full
                text-sm
                font-medium
                whitespace-nowrap
                transition-all
                ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-lightbg text-textmuted hover:bg-primary/10 hover:text-primary"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}