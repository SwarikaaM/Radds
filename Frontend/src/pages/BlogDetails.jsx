import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { blogPosts } from "../data/blog";

import BlogPostHero from "../components/blog-post/BlogPostHero";
import TableOfContents from "../components/blog-post/TableOfContents";
import ArticleBody from "../components/blog-post/ArticleBody";
import ShareButtons from "../components/blog-post/ShareButtons";
import RelatedPosts from "../components/blog-post/RelatedPosts";
import StickyConsultationCTA from "../components/blog-post/StickyConsultationCTA";

export default function BlogDetails() {
  const { slug } = useParams();

  const post = blogPosts.find(
    (item) => item.slug === slug
  );

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="
            inline-flex
            items-center
            gap-2
            text-primary
            font-medium
            mb-8
            hover:text-secondary
            transition-colors
          "
        >
          <ArrowLeft size={16} />
          Back to Insights
        </Link>

        <BlogPostHero post={post} />

        <div className="grid xl:grid-cols-[260px_minmax(0,1fr)_320px] gap-8">
          {/* TOC */}

          <TableOfContents
            sections={post.content}
          />

          {/* Article */}

          <div className="min-w-0">
            <ArticleBody post={post} />

            <div className="mt-10">
              <h3 className="font-semibold text-textprimary mb-4">
                Share this article
              </h3>

              <ShareButtons post={post} />
            </div>

            <div className="mt-16">
              <RelatedPosts
                currentPostId={post.id}
                category={post.category}
                posts={blogPosts}
              />
            </div>
          </div>

          {/* CTA */}

          <StickyConsultationCTA />
        </div>
      </div>
    </main>
  );
}