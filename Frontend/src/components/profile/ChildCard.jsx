import { motion } from "framer-motion";

const styledInputClass =
  "w-full bg-transparent outline-none p-3 pl-2 text-sm font-mono-num font-semibold text-[#0D1B2E]";

const inputWrapClass =
  "border border-[#D1DDE8] rounded-lg bg-white transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] hover:border-[#A8BCCF]";

export default function ChildCard({ child, index, profile, setProfile }) {
  const updateChild = (field, value) => {
    const updated = [...profile.children];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, children: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="border border-[#E2EBF5] rounded-xl p-5 bg-[#FAFCFF]"
    >
      <h3 className="font-semibold text-[#0D1B2E] mb-4">
        Child {index + 1}
        {child.name && <span className="text-primary font-normal ml-2 text-sm">— {child.name}</span>}
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Name</label>
          <div className={inputWrapClass}>
            <input
              type="text"
              value={child.name}
              onChange={(e) => updateChild("name", e.target.value)}
              placeholder="Child's name"
              className={styledInputClass}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Age</label>
          <div className={inputWrapClass}>
            <input
              type="number"
              min="0"
              max="30"
              value={child.age}
              onChange={(e) => updateChild("age", e.target.value)}
              className={styledInputClass}
            />
          </div>
        </div>

        {[
          { field: "education", label: "Education" },
          { field: "allowance", label: "Allowance" },
          { field: "holiday", label: "Holiday Budget" },
          { field: "medical", label: "Medical" },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">{label}</label>
            <div className="relative flex items-center border border-[#D1DDE8] rounded-lg bg-white transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] hover:border-[#A8BCCF]">
              <span className="pl-3 text-[#6B7E99] text-sm font-mono-num select-none">₹</span>
              <input
                type="number"
                min="0"
                value={child[field]}
                onChange={(e) => updateChild(field, Number(e.target.value) || 0)}
                className="w-full bg-transparent outline-none p-3 pl-1.5 text-sm font-mono-num font-semibold text-[#0D1B2E]"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}