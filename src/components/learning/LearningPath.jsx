import {
  BookOpen,
  ChevronRight,
} from "lucide-react";

import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const pathSteps = [
  "What is a Mutual Fund?",
  "Understanding SIP Investing",
  "Creating a Personal Budget",
  "How Health Insurance Works",
  "Retirement Planning Basics",
];

export default function LearningPath() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Start Here if You're New"
          subtitle="Follow this beginner roadmap to build a strong financial foundation."
        />

        <ScrollReveal>
          <Card className="p-8">
            <div className="space-y-6">
              {pathSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>

                    {index !==
                      pathSteps.length - 1 && (
                      <div className="w-[2px] h-12 bg-primary/20 mt-2" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <BookOpen
                        size={18}
                        className="text-primary"
                      />

                      <h3 className="font-semibold text-textprimary">
                        {step}
                      </h3>
                    </div>

                    <p className="text-sm text-textmuted mt-2">
                      Beginner-friendly lesson
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-textmuted"
                  />
                </div>
              ))}
            </div>

            {/* <div className="mt-8">
              <div className="h-2 rounded-full bg-[#E2EBF5] overflow-hidden">
                <div className="h-full w-0 bg-primary" />
              </div>

              <p className="text-sm text-textmuted mt-3">
                No account required. Learn at your
                own pace.
              </p>
            </div> */}
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}