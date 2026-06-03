import { useState } from "react";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import { Upload, X } from "lucide-react";

export default function CareerApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    linkedin: "",
    coverLetter: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.position.trim()) e.position = "Required";
    if (!resume) e.resume = "Resume required";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowed.includes(file.type)) {
      alert("Only PDF, DOC and DOCX files allowed.");
      return;
    }

    setResume(file);
  };

  return (
    <section id="career-form" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Apply"
          title="Submit Your Application"
          subtitle="We review every application carefully."
        />

        {success && (
          <div className="mb-6 rounded-lg bg-green-100 border border-green-200 p-4 text-green-700">
            Application received! We’ll be in touch within 5 business days.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6 mt-10"
        >
          <input
            placeholder="Name"
            className="border p-3 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="border p-3 rounded"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            className="border p-3 rounded"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="Position Applying For"
            className="border p-3 rounded"
            value={form.position}
            onChange={(e) =>
              setForm({ ...form, position: e.target.value })
            }
          />

          <input
            placeholder="Years of Experience"
            className="border p-3 rounded"
            value={form.experience}
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
          />

          <input
            placeholder="LinkedIn URL"
            className="border p-3 rounded"
            value={form.linkedin}
            onChange={(e) =>
              setForm({ ...form, linkedin: e.target.value })
            }
          />

          <textarea
            rows={5}
            placeholder="Cover Letter"
            className="border p-3 rounded md:col-span-2"
            value={form.coverLetter}
            onChange={(e) =>
              setForm({
                ...form,
                coverLetter: e.target.value
              })
            }
          />

          <div className="md:col-span-2 border-2 border-dashed rounded-card p-6">
            <label className="cursor-pointer flex items-center gap-3">
              <Upload size={20} />
              Upload Resume

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleFile}
              />
            </label>

            {resume && (
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p>{resume.name}</p>
                  <p className="text-sm text-textmuted">
                    {(resume.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setResume(null)}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-2 rounded-card border border-dashed p-4 text-sm text-textmuted">
            Human verification (Cloudflare Turnstile) will be enabled
            before production deployment.
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}