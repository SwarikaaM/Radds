import { FaLinkedin } from "react-icons/fa";

const team = [
  {
    name: "Rajesh Sharma",
    designation: "Founder & Managing Director",
    bio: "Over 15 years of experience in wealth management and advisory.",
  },
  {
    name: "Priya Mehta",
    designation: "Senior Financial Advisor",
    bio: "Specializes in goal-based planning and retirement strategies.",
  },
  {
    name: "Amit Verma",
    designation: "Investment Specialist",
    bio: "Focused on portfolio construction and mutual fund research.",
  },
];

export default function LeadershipTeam() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-playfair text-5xl text-center font-bold mb-16">
          Leadership Team
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="group rounded-xl border border-[#E2EBF5] overflow-hidden bg-white"
            >
              <div className="h-72 bg-[#F4F8FC] flex items-center justify-center">
                Photo Placeholder
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {member.name}
                    </h3>

                    <p className="text-[#6B7E99]">
                      {member.designation}
                    </p>
                  </div>

                  <FaLinkedin className="text-primary" size={18} />
                </div>

                <p className="text-sm text-[#6B7E99] opacity-0 group-hover:opacity-100 transition">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}