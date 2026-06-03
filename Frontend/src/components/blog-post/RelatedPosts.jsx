import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import Card from "../ui/Card";

export default function RelatedPosts({
  currentPostId,
  category,
  posts,
}) {
  const relatedPosts = posts
    .filter(
      (post) =>
        post.id !== currentPostId &&
        post.category === category
    )
    .slice(0, 3);

  if (!relatedPosts.length) return null;

  return (
    <section>
      <h3 className="font-playfair text-3xl font-bold text-textprimary mb-8">
        Related Articles
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card
            key={post.id}
            hover
            glow
            className="h-full"
          >
            <Link
              to={`/blog/${post.slug}`}
              className="flex flex-col h-full"
            >
              <span className="text-primary text-xs font-semibold uppercase tracking-wide mb-3">
                {post.category}
              </span>

              <h4 className="font-semibold text-textprimary mb-3 leading-snug">
                {post.title}
              </h4>

              <p className="text-sm text-textmuted flex-1 leading-relaxed">
                {post.excerpt}
              </p>

              <span className="inline-flex items-center gap-1 mt-4 text-primary text-sm font-medium">
                Read More
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}