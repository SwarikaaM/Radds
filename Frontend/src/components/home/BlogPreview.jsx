import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import BlogCard from "../blog/BlogCard";
import { blogPosts } from "../../data/blog";

export default function BlogPreview() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_BY = 380;

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? SCROLL_BY : -SCROLL_BY, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeader
            eyebrow="Insights"
            title="Financial Insights & Market Updates"
            subtitle="Expert takes on markets, tax, and money management."
            align="left"
            className="mb-0 max-w-lg"
          />
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Scroll arrows */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => scroll("left")}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft
                    ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary"
                    : "border-[#E2EBF5] text-[#C5D3E0] cursor-not-allowed"
                }`}
                whileTap={canScrollLeft ? { scale: 0.9 } : {}}
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </motion.button>
              <motion.button
                onClick={() => scroll("right")}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  canScrollRight
                    ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary"
                    : "border-[#E2EBF5] text-[#C5D3E0] cursor-not-allowed"
                }`}
                whileTap={canScrollRight ? { scale: 0.9 } : {}}
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Scrollable track — bleeds to edge */}
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="flex gap-5 overflow-x-auto ml-12 scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {blogPosts.map((post, i) => (
          <div
            key={post.id}
            className="flex-shrink-0 w-[320px] sm:w-[360px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <BlogCard post={post} index={i} />
          </div>
        ))}
        {/* Right padding sentinel */}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" />
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
          View All Articles <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}