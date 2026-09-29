import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Code2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import { push, ref, set } from "firebase/database";
import { db } from "../firebase/firebase";

/* =========================================================
   SERVICES
========================================================= */

const services = [
  "Web Development",
  "Mobile App Development",
  "UI / UX Design",
  "Graphic Design",
  "SEO",
  "Digital Marketing",
  "Custom Software",
  "E-Commerce",
];

/* =========================================================
   FOOTER LINKS
========================================================= */

const footerLinks = {
  company: [
    {
      name: "Home",
      href: "#home",
    },
    {
      name: "Services",
      href: "#services",
    },
    {
      name: "Work",
      href: "#work",
    },
    {
      name: "Process",
      href: "#process",
    },
    {
      name: "Technology",
      href: "#technology",
    },
  ],
};

/* =========================================================
   SOCIAL LINKS
========================================================= */

const socialLinks = [
  {
    name: "Instagram",
    label: "IG",
    href: "https://instagram.com/",
  },
  {
    name: "LinkedIn",
    label: "in",
    href: "https://linkedin.com/",
  },
  {
    name: "Facebook",
    label: "f",
    href: "https://facebook.com/",
  },
  {
    name: "GitHub",
    label: "GH",
    href: "https://github.com/",
  },
];

/* =========================================================
   REVEAL HOOK
========================================================= */

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ContactFooter() {
  const [contactRef, contactVisible] = useReveal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    if (status) {
      setStatus("");
    }
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please tell us about your project.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        "Please provide a little more information.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     SUBMIT FORM
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSubmitting(true);

      const messageRef = push(ref(db, "contactMessages"));

      await set(messageRef, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        service: formData.service,
        budget: formData.budget,
        message: formData.message.trim(),
        status: "new",
        createdAt: Date.now(),
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        service: "",
        budget: "",
        message: "",
      });

      setErrors({});

      setStatus("success");
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =====================================================
          CONTACT SECTION
      ===================================================== */}

      <section
        id="contact"
        className="relative overflow-hidden bg-[#050505] text-white"
      >
        {/* ===================================================
            BACKGROUND
        =================================================== */}

        <div className="pointer-events-none absolute inset-0">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />

          {/* Main glow */}
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[150px]" />

          {/* Side glows */}
          <div className="absolute -left-48 bottom-0 h-[400px] w-[400px] rounded-full bg-white/[0.015] blur-[120px]" />

          <div className="absolute -right-48 top-1/3 h-[400px] w-[400px] rounded-full bg-white/[0.015] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
          {/* =================================================
              CONTACT HEADER
          ================================================= */}

          <div
            ref={contactRef}
            className={`mx-auto max-w-4xl text-center transition-all duration-1000 ${
              contactVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.5)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                Start a conversation
              </span>
            </div>

            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-7xl">
              Have an idea?
              <br />

              <span className="text-white/35">
                Let's build it.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
              Tell us what you're building, what you're trying to solve,
              or where you want to go. We'll figure out the next step
              together.
            </p>
          </div>

          {/* =================================================
              CONTACT CONTENT
          ================================================= */}

          <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
            {/* ===============================================
                LEFT CONTACT INFO
            =============================================== */}

            <div className="flex flex-col">
              {/* Availability card */}
              <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                    <span className="absolute h-2 w-2 animate-ping rounded-full bg-white/40" />

                    <span className="relative h-2 w-2 rounded-full bg-white/80" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Available for new projects
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Let's discuss your next idea.
                    </p>
                  </div>
                </div>

                <div className="my-7 h-px bg-white/[0.06]" />

                {/* Email */}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=hello%40codirung.com&su=Project%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.07]">
                    <Mail
                      size={16}
                      className="text-white/50 transition-colors group-hover:text-white"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm text-white/65 transition-colors group-hover:text-white">
                  hello@codirung.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+923000000000"
                  className="group mt-5 flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.07]">
                    <Phone
                      size={16}
                      className="text-white/50 transition-colors group-hover:text-white"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-white/65 transition-colors group-hover:text-white">
                      +92 300 0000000
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                    <MapPin
                      size={16}
                      className="text-white/50"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-white/65">
                      Pakistan · Working Worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mt-5 rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-7 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  What we can help with
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-white/45"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="mt-5 rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-7 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Follow Codirung
                </p>

                <div className="mt-5 flex gap-2">
{socialLinks.map((social) => (
  <a
    key={social.name}
    href={social.href}
    target="_blank"
    rel="noreferrer"
    aria-label={social.name}
    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/40 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
  >
    <span className="text-xs font-bold transition-transform duration-300 group-hover:scale-110">
      {social.label}
    </span>
  </a>
))}
                </div>
              </div>
            </div>

            {/* ===============================================
                CONTACT FORM
            =============================================== */}

            <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8 lg:p-10">
              {/* Form glow */}
              <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-white/[0.035] blur-[100px]" />

              <div className="relative">
                <div className="mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                      <MessageCircle
                        size={19}
                        strokeWidth={1.5}
                        className="text-white/60"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Tell us about your project
                      </h3>

                      <p className="mt-1 text-xs text-white/30">
                        We usually respond within 1–2 business days.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                >
                  {/* =========================================
                      NAME + EMAIL
                  ========================================= */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block text-xs font-medium text-white/55"
                      >
                        Your name
                        <span className="ml-1 text-white/30">*</span>
                      </label>

                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        autoComplete="name"
                        className={`contact-input ${
                          errors.name ? "contact-input-error" : ""
                        }`}
                      />

                      {errors.name && (
                        <p className="mt-2 text-[11px] text-white/50">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-xs font-medium text-white/55"
                      >
                        Email address
                        <span className="ml-1 text-white/30">*</span>
                      </label>

                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        autoComplete="email"
                        className={`contact-input ${
                          errors.email ? "contact-input-error" : ""
                        }`}
                      />

                      {errors.email && (
                        <p className="mt-2 text-[11px] text-white/50">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =========================================
                      COMPANY
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="contact-company"
                      className="mb-2 block text-xs font-medium text-white/55"
                    >
                      Company / Brand
                      <span className="ml-1 text-white/25">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      autoComplete="organization"
                      className="contact-input"
                    />
                  </div>

                  {/* =========================================
                      SERVICE + BUDGET
                  ========================================= */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Service */}
                    <div>
                      <label
                        htmlFor="contact-service"
                        className="mb-2 block text-xs font-medium text-white/55"
                      >
                        What do you need?
                        <span className="ml-1 text-white/30">*</span>
                      </label>

                      <div className="relative">
                        <select
                          id="contact-service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className={`contact-input appearance-none pr-10 ${
                            !formData.service
                              ? "text-white/25"
                              : "text-white/70"
                          } ${
                            errors.service
                              ? "contact-input-error"
                              : ""
                          }`}
                        >
                          <option value="" disabled>
                            Select a service
                          </option>

                          {services.map((service) => (
                            <option
                              key={service}
                              value={service}
                              className="bg-[#111111] text-white"
                            >
                              {service}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                        />
                      </div>

                      {errors.service && (
                        <p className="mt-2 text-[11px] text-white/50">
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div>
                      <label
                        htmlFor="contact-budget"
                        className="mb-2 block text-xs font-medium text-white/55"
                      >
                        Estimated budget
                      </label>

                      <div className="relative">
                        <select
                          id="contact-budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className={`contact-input appearance-none pr-10 ${
                            !formData.budget
                              ? "text-white/25"
                              : "text-white/70"
                          }`}
                        >
                          <option value="" disabled>
                            Select budget
                          </option>

                          <option
                            value="Under $500"
                            className="bg-[#111111] text-white"
                          >
                            Under $500
                          </option>

                          <option
                            value="$500 - $1,000"
                            className="bg-[#111111] text-white"
                          >
                            $500 - $1,000
                          </option>

                          <option
                            value="$1,000 - $3,000"
                            className="bg-[#111111] text-white"
                          >
                            $1,000 - $3,000
                          </option>

                          <option
                            value="$3,000 - $5,000"
                            className="bg-[#111111] text-white"
                          >
                            $3,000 - $5,000
                          </option>

                          <option
                            value="$5,000+"
                            className="bg-[#111111] text-white"
                          >
                            $5,000+
                          </option>

                          <option
                            value="Not sure yet"
                            className="bg-[#111111] text-white"
                          >
                            Not sure yet
                          </option>
                        </select>

                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* =========================================
                      MESSAGE
                  ========================================= */}

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-xs font-medium text-white/55"
                    >
                      Tell us about your project
                      <span className="ml-1 text-white/30">*</span>
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your idea, goals, features, timeline or anything else we should know..."
                      rows={6}
                      className={`contact-input resize-none ${
                        errors.message
                          ? "contact-input-error"
                          : ""
                      }`}
                    />

                    {errors.message && (
                      <p className="mt-2 text-[11px] text-white/50">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* =========================================
                      STATUS
                  ========================================= */}

                  {status === "success" && (
                    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-4">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-white/70"
                      />

                      <div>
                        <p className="text-sm font-medium text-white">
                          Message sent successfully.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/40">
                          Thanks for reaching out. We'll get back to
                          you soon.
                        </p>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="rounded-2xl border border-white/[0.1] bg-white/[0.035] p-4">
                      <p className="text-sm font-medium text-white">
                        Something went wrong.
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/40">
                        Your message could not be submitted. Please try
                        again.
                      </p>
                    </div>
                  )}

                  {/* =========================================
                      SUBMIT
                  ========================================= */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_15px_45px_rgba(255,255,255,0.1)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />

                        Sending...
                      </>
                    ) : (
                      <>
                        Send project inquiry

                        <Send
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                        />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] leading-5 text-white/25">
                    By submitting this form, you agree to be contacted
                    regarding your project inquiry.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* =================================================
              QUICK CONTACT STRIP
          ================================================= */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hello%40codirung.com&su=Project%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.045]"
            >
              <div className="flex items-center gap-3">
                <Mail
                  size={17}
                  className="text-white/40 group-hover:text-white/70"
                />

                <span className="text-sm text-white/50 group-hover:text-white/80">
                  Email us
                </span>
              </div>

              <ArrowUpRight
                size={15}
                className="text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <a
              href="#services"
              className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.045]"
            >
              <div className="flex items-center gap-3">
                <Code2
                  size={17}
                  className="text-white/40 group-hover:text-white/70"
                />

                <span className="text-sm text-white/50 group-hover:text-white/80">
                  Explore services
                </span>
              </div>

              <ArrowUpRight
                size={15}
                className="text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#030303] text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* ================================================
              MAIN FOOTER
          ================================================ */}

          <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.5fr_0.7fr_1fr] lg:gap-20">
            {/* Brand */}
            <div>
              <a
                href="#home"
                className="group inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08]">
                  <span className="text-sm font-bold tracking-[-0.08em]">
                    C
                  </span>
                </div>

                <span className="text-xl font-semibold tracking-[-0.04em]">
                  Codirung
                </span>
              </a>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/35">
                We design and build modern digital experiences that help
                businesses turn ideas into meaningful products.
              </p>

              <div className="mt-7 flex items-center gap-2 text-xs text-white/25">
                <Globe size={14} />

                <span>Building for clients worldwide</span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Explore
              </p>

              <nav className="mt-6 space-y-3">
                {footerLinks.company.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block w-fit text-sm text-white/40 transition-colors duration-300 hover:text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Services
              </p>

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                {services.slice(0, 6).map((service) => (
                  <a
                    key={service}
                    href="#services"
                    className="text-sm text-white/40 transition-colors duration-300 hover:text-white"
                  >
                    {service}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ================================================
              BIG FOOTER TEXT
          ================================================ */}

          <div className="overflow-hidden border-t border-white/[0.06] pt-12 sm:pt-16">
            <div className="select-none text-center">
              <h2 className="text-[17vw] font-bold leading-[0.75] tracking-[-0.09em] text-white/[0.035] sm:text-[15vw] lg:text-[13vw]">
                CODIRUNG
              </h2>
            </div>
          </div>

          {/* ================================================
              BOTTOM FOOTER
          ================================================ */}

          <div className="flex flex-col gap-5 border-t border-white/[0.06] py-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} Codirung. All rights reserved.
            </p>

            <div className="flex items-center gap-5">
              <a
                href="#"
                className="text-xs text-white/25 transition-colors hover:text-white/60"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="text-xs text-white/25 transition-colors hover:text-white/60"
              >
                Terms
              </a>

              <a
                href="#home"
                className="group flex items-center gap-2 text-xs text-white/35 transition-colors hover:text-white"
              >
                Back to top

                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] transition-all group-hover:-translate-y-1 group-hover:border-white/20">
                  ↑
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================
          INPUT STYLES
      ===================================================== */}

      <style>{`
        .contact-input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.025);
          padding: 14px 15px;
          color: rgba(255, 255, 255, 0.75);
          outline: none;
          font-size: 13px;
          line-height: 1.5;
          transition:
            border-color 250ms ease,
            background 250ms ease,
            box-shadow 250ms ease;
        }

        .contact-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .contact-input:hover {
          border-color: rgba(255, 255, 255, 0.12);
        }

        .contact-input:focus {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.045);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.025);
        }

        .contact-input-error {
          border-color: rgba(255, 255, 255, 0.22);
        }

        .contact-input option {
          background: #111111;
          color: white;
        }
      `}</style>
    </>
  );
}
