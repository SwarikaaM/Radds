import { useNavigate } from "react-router-dom";

export default function BackToCalculators() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate("/calculators")
      }
      className="
        inline-flex
        items-center
        gap-2
        text-[#22568F]
        font-medium
        hover:underline
        mb-8
      "
    >
      ← Back to Calculators
    </button>
  );
}