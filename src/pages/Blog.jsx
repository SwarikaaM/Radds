import { useMemo, useState } from "react";
import BlogHero from "../components/blog/BlogHero";
import BlogCategoryTabs from "../components/blog/BlogCategoryTabs";
import BlogGrid from "../components/blog/BlogGrid";
import BlogSidebar from "../components/blog/BlogSidebar";
import BlogCTA from "../components/blog/BlogCTA";
import { blogPosts } from "../data/blog";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    return ["All", ...new Set(blogPosts.map((p) => p.category))];
  }, []);

  return (
    <main >
      <BlogHero />

      <BlogCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_320px] gap-10">
          <BlogGrid
            activeCategory={activeCategory}
            search={search}
          />

          <BlogSidebar
            search={search}
            setSearch={setSearch}
          />
        </div>
      </section>

      <BlogCTA />
    </main>
  );
}