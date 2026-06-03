import { Calendar, Clock } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

export default function BlogPostHero({ post }) {
  return (
    <section className="pb-10">
      <ScrollReveal>
        <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-4">
          {post.category}
        </span>

        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-textprimary leading-tight mb-6">
          {post.title}
        </h1>

        <p className="text-lg md:text-xl text-textmuted leading-relaxed max-w-3xl mb-8">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-sm text-textmuted">
          <span className="font-medium">
            {post.author}
          </span>

          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {post.date}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={14} />
            {post.readTime}
          </span>
        </div>
      </ScrollReveal>
    </section>
  );
}