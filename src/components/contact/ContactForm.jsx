import { useState } from "react";
import Button from "../ui/Button";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!/^[A-Za-z\s]{2,50}$/.test(form.name.trim())) {
      e.name = "Please enter a valid name";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      e.email = "Please enter a valid email address";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      e.phone = "Enter a valid 10-digit mobile number";
    }

    if (!form.subject) {
      e.subject = "Please select a subject";
    }

    if (form.message.trim().length < 20) {
      e.message =
        "Message must be at least 20 characters";
    }

    return e;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-playfair text-4xl font-bold mb-8">
          Send Us a Message
        </h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
            Thank you. Our team will contact you shortly.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          <div>
            <label className="block mb-2 font-medium">
              Full Name *
            </label>

            <input
              type="text"
              required
              minLength={2}
              maxLength={50}
              autoComplete="name"
              placeholder="Enter your name"
              className={`w-full border rounded-lg p-3 ${
                errors.name
                  ? "border-red-500"
                  : ""
              }`}
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email Address *
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              className={`w-full border rounded-lg p-3 ${
                errors.email
                  ? "border-red-500"
                  : ""
              }`}
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Mobile Number *
            </label>

            <input
              type="tel"
              required
              maxLength={10}
              inputMode="numeric"
              placeholder="9876543210"
              className={`w-full border rounded-lg p-3 ${
                errors.phone
                  ? "border-red-500"
                  : ""
              }`}
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10),
                })
              }
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Subject *
            </label>

            <select
              className={`w-full border rounded-lg p-3 ${
                errors.subject
                  ? "border-red-500"
                  : ""
              }`}
              value={form.subject}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject: e.target.value,
                })
              }
            >
              <option value="">
                Select Subject
              </option>

              <option>
                General Enquiry
              </option>

              <option>
                Investment Query
              </option>

              <option>
                Insurance
              </option>

              <option>
                Complaint
              </option>

              <option>
                Partnership
              </option>
            </select>

            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Message *
            </label>

            <textarea
              rows="5"
              required
              minLength={20}
              maxLength={1000}
              placeholder="Tell us how we can help..."
              className={`w-full border rounded-lg p-3 ${
                errors.message
                  ? "border-red-500"
                  : ""
              }`}
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
            />

            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <Button type="submit">
            {loading
              ? "Submitting..."
              : "Submit Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}