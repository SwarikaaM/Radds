import { blogPosts } from "../../data/blog";
import BlogCard from "./BlogCard";

export default function BlogGrid({
  activeCategory,
  search,
}) {
  const filtered = blogPosts.filter((post) => {
    const categoryMatch =
      activeCategory === "All" ||
      post.category === activeCategory;

    const searchMatch =
      post.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      post.excerpt
        .toLowerCase()
        .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((post, i) => (
          <BlogCard
            key={post.id}
            post={post}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}