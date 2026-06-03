import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";
import { blogPosts } from "../../data/blog";
import BlogCard from "../blog/BlogCard";

const categoryColors = {
  "SIP Investing": { bg: "bg-primary/8", text: "text-primary" },
  "Market Analysis": { bg: "bg-secondary/8", text: "text-secondary" },
  "Tax Planning": { bg: "bg-success/8", text: "text-success" },
};

// function BlogCard({ post, index }) {
//   const colors = categoryColors[post.category] || { bg: "bg-accent/8", text: "text-accent" };

//   return (
//     <ScrollReveal delay={index * 0.1}>
//       <Link to={`/blog/${post.slug}`}>
//         <motion.article
//           className="group bg-white rounded-card border border-[#E2EBF5] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
//           whileHover={{ y: -4 }}
//           transition={{ duration: 0.2 }}
//         >
//           {/* Card header accent bar */}
//           <div className="h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//           <div className="p-6 flex flex-col flex-1">
//             <div className="flex items-center gap-3 mb-4">
//               <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${colors.bg} ${colors.text}`}>
//                 {post.category}
//               </span>
//               <span className="flex items-center gap-1 text-textmuted text-xs">
//                 <Clock size={11} />
//                 {post.readTime}
//               </span>
//             </div>

//             <h3 className="text-textprimary font-semibold text-[15px] leading-snug mb-3 group-hover:text-primary transition-colors duration-200 flex-1">
//               {post.title}
//             </h3>

//             <p className="text-textmuted text-sm leading-relaxed mb-5 line-clamp-3">
//               {post.excerpt}
//             </p>

//             <div className="flex items-center justify-between pt-4 border-t border-[#F0F4F8] mt-auto">
//               <span className="flex items-center gap-1.5 text-textmuted text-xs">
//                 <Calendar size={12} />
//                 {post.date}
//               </span>
//               <span className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all duration-200">
//                 Read More <ArrowUpRight size={13} />
//               </span>
//             </div>
//           </div>
//         </motion.article>
//       </Link>
//     </ScrollReveal>
//   );
// }

export default function BlogPreview() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            eyebrow="Insights"
            title="Financial Insights & Market Updates"
            subtitle="Stay sharp with expert takes on markets, tax, and money management."
            align="left"
            className="mb-0 max-w-lg"
          />
          <Link
            to="/blog"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors"
          >
            View All Articles <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
