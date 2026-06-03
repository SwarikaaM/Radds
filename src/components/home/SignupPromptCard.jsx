import { motion } from "framer-motion";
import { FileDown, Sparkles, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";

export default function SignupPromptCard() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-card border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-5"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-accent" />
            <span className="text-accent text-xs font-semibold uppercase tracking-wider">Unlock More</span>
          </div>
          <h4 className="text-textprimary font-semibold text-sm mb-1">
            Want a detailed expense-wise plan and downloadable report?
          </h4>
          <div className="flex flex-wrap gap-3 mt-2">
            {["Goal-based breakdown", "Tax-saving advice", "PDF report"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-textmuted text-xs">
                <CheckCircle2 size={11} className="text-success" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <Button variant="primary" size="sm" className="flex-shrink-0">
          <FileDown size={14} />
          Create Free Account
        </Button>
      </div>
    </motion.div>
  );
}
