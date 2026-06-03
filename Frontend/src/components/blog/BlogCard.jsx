import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  Clock,
} from "lucide-react";

import ScrollReveal from "../ui/ScrollReveal";

const categoryColors = {
  "SIP Investing": {
    bg: "bg-primary/10",
    text: "text-primary",
  },

  "Market Analysis": {
    bg: "bg-secondary/10",
    text: "text-secondary",
  },

  "Tax Planning": {
    bg: "bg-success/10",
    text: "text-success",
  },

  Insurance: {
    bg: "bg-accent/10",
    text: "text-accent",
  },

  "Financial Planning": {
    bg: "bg-warning/10",
    text: "text-warning",
  },
};

export default function BlogCard({
  post,
  index = 0,
}) {
  const colors =
    categoryColors[post.category] || {
      bg: "bg-accent/10",
      text: "text-accent",
    };

  return (
    <ScrollReveal delay={index * 0.08}>
      <Link to={`/blog/${post.slug}`}>
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="
            group
            bg-white
            rounded-card
            border
            border-[#E2EBF5]
            shadow-sm
            hover:shadow-xl
            hover:border-primary/20
            overflow-hidden
            h-full
            flex
            flex-col
            transition-all
            duration-300
          "
        >
          <div className="relative">
            <img
              src={post.coverImage}
              alt={post.title}
              className="
                h-52
                w-full
                object-cover
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span
                className={`
                  text-[11px]
                  font-semibold
                  px-2.5
                  py-1
                  rounded-full
                  uppercase
                  tracking-wider
                  ${colors.bg}
                  ${colors.text}
                `}
              >
                {post.category}
              </span>

              <span className="flex items-center gap-1 text-xs text-textmuted">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>

            <h3
              className="
                text-textprimary
                font-semibold
                text-lg
                leading-snug
                mb-3
                group-hover:text-primary
                transition-colors
              "
            >
              {post.title}
            </h3>

            <p
              className="
                text-textmuted
                text-sm
                leading-relaxed
                mb-5
                flex-1
              "
            >
              {post.excerpt}
            </p>

            <div
              className="
                flex
                items-center
                justify-between
                pt-4
                border-t
                border-[#F0F4F8]
              "
            >
              <span className="flex items-center gap-1 text-xs text-textmuted">
                <Calendar size={12} />
                {post.date}
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1
                  text-primary
                  text-sm
                  font-semibold
                  group-hover:gap-2
                  transition-all
                "
              >
                Read More
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </ScrollReveal>
  );
}