import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Card from "../ui/Card";
import { blogPosts } from "../../data/blog";

export default function BlogSidebar({
  search,
  setSearch,
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <Card>
          <h3 className="font-semibold mb-4">
            Search Articles
          </h3>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-textmuted"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search insights..."
              className="w-full pl-10 pr-4 py-3 border border-[#E2EBF5] rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">
            Popular Posts
          </h3>

          <div className="space-y-4">
            {blogPosts.slice(0, 4).map((post) => (
              <div key={post.id}>
                <Link
                    to={`/blog/${post.slug}`}
                    className="block hover:text-primary transition-colors"
                >
                    {post.title}
                </Link>

                <span className="text-xs text-textmuted">
                  {post.readTime}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  );
}