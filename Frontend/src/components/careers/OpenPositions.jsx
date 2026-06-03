import { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Briefcase
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

const jobs = [
  {
    title: "Financial Advisor",
    department: "Finance",
    location: "Mumbai",
    type: "Full Time"
  },
  {
    title: "Mutual Fund Operations Executive",
    department: "Operations",
    location: "Mumbai",
    type: "Full Time"
  },
  {
    title: "Client Relationship Manager",
    department: "Sales",
    location: "Mumbai",
    type: "Full Time"
  },
  {
    title: "Frontend Developer Intern",
    department: "Tech",
    location: "Remote",
    type: "Internship"
  },
  {
    title: "Insurance Support Executive",
    department: "Operations",
    location: "Mumbai",
    type: "Full Time"
  },
  {
    title: "Sales Associate",
    department: "Sales",
    location: "Mumbai",
    type: "Full Time"
  }
];

const filters = ["All", "Finance", "Tech", "Operations", "Sales"];

export default function OpenPositions() {
  const [active, setActive] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered =
    active === "All"
      ? jobs
      : jobs.filter((job) => job.department === active);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Open Roles"
          title="Join Radds Capital"
          subtitle="Explore opportunities across advisory, operations, technology and growth."
        />

        <div className="flex gap-3 overflow-x-auto mt-10 mb-10 justify-center">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`px-5 py-2 rounded-full border whitespace-nowrap ${
                active === item
                  ? "bg-primary text-white border-primary"
                  : "bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-24">
          {filtered.map((job, index) => (
            <Card key={job.title}>
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-textmuted">
                    <span>{job.department}</span>

                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                    <Button
                        onClick={() =>
                        document
                            .getElementById("career-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="w-full"
                    >
                        Apply Now
                    </Button>
                    </div>
              </div>

              <button
                className="flex items-center gap-2 mt-6 text-primary font-medium"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                Details
                <ChevronDown size={18} />
              </button>

              {openIndex === index && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-textmuted mb-3">
                    We are looking for motivated professionals who are
                    passionate about delivering exceptional client outcomes.
                  </p>

                  <ul className="list-disc pl-5 space-y-2 text-textmuted">
                    <li>Collaborate with internal teams.</li>
                    <li>Maintain high service standards.</li>
                    <li>Support business growth initiatives.</li>
                    <li>Ensure compliance and accuracy.</li>
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}