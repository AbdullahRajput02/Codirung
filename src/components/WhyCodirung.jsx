import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Code2,
  Layers3,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

/* =========================================================
   WHY CODIRUNG
========================================================= */

const reasons = [
  {
    number: "01",
    icon: Sparkles,
    title: "Ideas into Real Products",
    description:
      "We don't just write code. We turn your idea into a practical, scalable and polished digital product.",
    points: [
      "Business-focused solutions",
      "Modern UI & UX",
      "Scalable architecture",
    ],
  },
  {
    number: "02",
    icon: Code2,
    title: "Modern Technology",
    description:
      "We use modern development tools and technologies to build fast, reliable and maintainable digital experiences.",
    points: [
      "Modern frontend development",
      "Secure backend systems",
      "Performance-focused code",
    ],
  },
  {
    number: "03",
    icon: Target,
    title: "Built Around Your Goals",
    description:
      "Every project starts by understanding what you actually want to achieve, not simply what features you want.",
    points: [
      "Clear project planning",
      "Custom solutions",
      "Goal-oriented development",
    ],
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    description:
      "From responsive design to functionality and performance, every important part of the product gets attention.",
    points: [
      "Responsive across devices",
      "Clean development practices",
      "Testing & refinement",
    ],
  },
];

/* =========================================================
   PROCESS
========================================================= */

const processSteps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Discovery",
    label: "We understand",
    description:
      "We discuss your idea, business goals, target audience and project requirements before writing code.",
  },
  {
    number: "02",
    icon: Target,
    title: "Strategy",
    label: "We plan",
    description:
      "We define the project structure, features, user flow and technology stack needed to bring the idea to life.",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Design",
    label: "We visualize",
    description:
      "We create a modern and intuitive interface focused on usability, consistency and your brand identity.",
  },
  {
    number: "04",
    icon: Code2,
    title: "Development",
    label: "We build",
    description:
      "Our developers turn the approved concept into a functional, responsive and scalable digital product.",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Testing",
    label: "We refine",
    description:
      "We test functionality, responsiveness and important user flows to identify and fix issues before launch.",
  },
  {
    number: "06",
    icon: Rocket,
    title: "Launch",
    label: "We deliver",
    description:
      "After the final review, we prepare the product for launch and help ensure everything is ready to go live.",
  },
];

/* =========================================================
   REVEAL HOOK
========================================================= */

function useReveal() {
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
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

/* =========================================================
   REASON CARD
========================================================= */

function ReasonCard({ item, index }) {
  const [ref, visible] = useReveal();

  const Icon = item.icon;

  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-7 sm:p-8 transition-all duration-700 hover:-translate-y-2 hover:border-white/[0.15] hover:bg-white/[0.045] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/[0.04] blur-3xl transition-all duration-700 group-hover:bg-white/[0.09]" />

      {/* Number */}
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.2em] text-white/30">
          {item.number}
        </span>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] transition-all duration-500 group-hover:rotate-6 group-hover:border-white/[0.18] group-hover:bg-white/[0.08]">
          <Icon
            size={21}
            strokeWidth={1.6}
            className="text-white/65 transition-colors duration-500 group-hover:text-white"
          />
        </div>
      </div>

      <h3 className="relative z-10 text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {item.title}
      </h3>

      <p className="relative z-10 mt-4 text-sm leading-7 text-white/45 sm:text-[15px]">
        {item.description}
      </p>

      <div className="mt-7 space-y-3 border-t border-white/[0.06] pt-6">
        {item.points.map((point) => (
          <div
            key={point}
            className="flex items-center gap-3 text-sm text-white/55"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.07]">
              <Check size={11} strokeWidth={2.5} />
            </span>

            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-7 right-7 h-px origin-left scale-x-0 bg-white/30 transition-transform duration-700 group-hover:scale-x-100" />
    </article>
  );
}

/* =========================================================
   PROCESS STEP
========================================================= */

function ProcessStep({ item, index }) {
  const [ref, visible] = useReveal();

  const Icon = item.icon;

  return (
    <div
      ref={ref}
      className={`group relative transition-all duration-700 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Connector */}
      {index !== processSteps.length - 1 && (
        <div className="absolute left-[27px] top-[65px] hidden h-[calc(100%+15px)] w-px bg-gradient-to-b from-white/15 via-white/[0.06] to-transparent lg:block" />
      )}

      <div className="relative flex gap-5 sm:gap-7">
        {/* Number/Icon */}
        <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.09] bg-[#080808] shadow-[0_0_0_8px_#050505] transition-all duration-500 group-hover:border-white/25 group-hover:bg-white/[0.06]">
          <Icon
            size={20}
            strokeWidth={1.5}
            className="text-white/60 transition-all duration-500 group-hover:scale-110 group-hover:text-white"
          />

          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#050505] bg-white px-1 text-[9px] font-bold text-black">
            {item.number}
          </span>
        </div>

        {/* Content */}
        <div className="pb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
            {item.label}
          </span>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {item.title}
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-7 text-white/45 sm:text-[15px]">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WhyCodirung() {
  const [heroRef, heroVisible] = useReveal();

  return (
    <section
      id="about"
      className="scroll-mt-28 relative overflow-hidden bg-[#050505] text-white"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

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

        {/* Top glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[140px]" />

        {/* Side glow */}
        <div className="absolute -left-40 top-[35%] h-[400px] w-[400px] rounded-full bg-white/[0.018] blur-[120px]" />

        <div className="absolute -right-40 bottom-[10%] h-[400px] w-[400px] rounded-full bg-white/[0.018] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        {/* =====================================================
            WHY CODIRUNG HEADER
        ===================================================== */}

        <div
          ref={heroRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${
            heroVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          {/* Small label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.5)]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
              Why Codirung
            </span>
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            More than code.
            <br />

            <span className="text-white/35">
              We build what matters.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
            Your idea deserves more than a basic website. Codirung combines
            strategy, design and technology to create digital products built
            around real business goals.
          </p>
        </div>

        {/* =====================================================
            WHY CARDS
        ===================================================== */}

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {reasons.map((item, index) => (
            <ReasonCard
              key={item.number}
              item={item}
              index={index}
            />
          ))}
        </div>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div className="my-24 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent sm:my-32" />

        {/* =====================================================
            OUR PROCESS
        ===================================================== */}

        <div
          id="process"
          className="scroll-mt-28 grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24"
        >
          {/* Left side */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2">
              <Zap size={13} className="text-white/60" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
                Our Process
              </span>
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              From first idea
              <br />
              <span className="text-white/35">to final launch.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/45 sm:text-base">
              A clear process keeps your project moving. We break complex
              ideas into simple steps so you always know what we're working
              on and why.
            </p>

            {/* Mini stats */}
            <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-2xl font-semibold tracking-tight text-white">
                  06
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Core stages
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-2xl font-semibold tracking-tight text-white">
                  01
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Clear direction
                </p>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hello%40codirung.com&su=Project%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-3 text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white"
            >
              Start a project

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] transition-all duration-300 group-hover:translate-x-1 group-hover:border-white/20 group-hover:bg-white/[0.08]">
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </span>
            </a>
          </div>

          {/* Right process timeline */}
          <div className="relative">
            {processSteps.map((item, index) => (
              <ProcessStep
                key={item.number}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <div className="relative mt-16 overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-8 sm:mt-24 sm:p-12 lg:p-16">
          {/* CTA glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-white/[0.04] blur-[100px]" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                Have an idea?
              </p>

              <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Let's turn your idea into something people remember.
              </h3>
            </div>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hello%40codirung.com&su=Project%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_15px_40px_rgba(255,255,255,0.12)]"
            >
              Let's talk

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
