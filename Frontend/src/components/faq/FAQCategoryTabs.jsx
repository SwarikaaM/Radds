import { faqCategories } from "../../data/faq";

export default function FAQCategoryTabs({
  activeCategory,
  setActiveCategory,
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {faqCategories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-lg transition ${
            activeCategory === category
              ? "bg-primary text-white"
              : "bg-white border hover:border-primary"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}