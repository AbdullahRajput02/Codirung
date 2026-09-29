import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Database,
  Globe,
  Smartphone,
  Palette,
  Search,
  Megaphone,
  Server,
  Cloud,
  ShieldCheck,
  Layers3,
  Bot,
  BarChart3,
  PenTool,
  ShoppingCart,
  Settings,
  Sparkles,
  Star,
  Quote,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   TECHNOLOGIES / SERVICES
========================================================= */

const technologies = [
  {
    name: "React",
    category: "Frontend",
    icon: Code2,
    position: "top-[7%] left-[18%]",
  },
  {
    name: "JavaScript",
    category: "Development",
    icon: Code2,
    position: "top-[20%] left-[5%]",
  },
  {
    name: "Node.js",
    category: "Backend",
    icon: Server,
    position: "top-[12%] right-[16%]",
  },
  {
    name: "PHP",
    category: "Backend",
    icon: Code2,
    position: "top-[30%] right-[3%]",
  },
  {
    name: "MongoDB",
    category: "Database",
    icon: Database,
    position: "bottom-[20%] right-[8%]",
  },
  {
    name: "MySQL",
    category: "Database",
    icon: Database,
    position: "bottom-[8%] right-[25%]",
  },
  {
    name: "UI / UX",
    category: "Design",
    icon: Palette,
    position: "bottom-[7%] left-[18%]",
  },
  {
    name: "SEO",
    category: "Marketing",
    icon: Search,
    position: "bottom-[22%] left-[4%]",
  },
  {
    name: "Graphic Design",
    category: "Creative",
    icon: PenTool,
    position: "top-[48%] left-[1%]",
  },
  {
    name: "Digital Marketing",
    category: "Marketing",
    icon: Megaphone,
    position: "top-[47%] right-[1%]",
  },
  {
    name: "Mobile Apps",
    category: "Development",
    icon: Smartphone,
    position: "top-[2%] left-[45%]",
  },
  {
    name: "Web Development",
    category: "Development",
    icon: Globe,
    position: "bottom-[1%] left-[43%]",
  },
];

/* =========================================================
   ADDITIONAL SERVICES
========================================================= */

const services = [
  {
    title: "Web Development",
    icon: Globe,
  },
  {
    title: "Mobile App Development",
    icon: Smartphone,
  },
  {
    title: "UI / UX Design",
    icon: Palette,
  },
  {
    title: "Graphic Design",
    icon: PenTool,
  },
  {
    title: "SEO",
    icon: Search,
  },
  {
    title: "Digital Marketing",
    icon: Megaphone,
  },
  {
    title: "E-Commerce",
    icon: ShoppingCart,
  },
  {
    title: "Cloud Solutions",
    icon: Cloud,
  },
  {
    title: "AI Solutions",
    icon: Bot,
  },
  {
    title: "Cyber Security",
    icon: ShieldCheck,
  },
  {
    title: "Business Analytics",
    icon: BarChart3,
  },
  {
    title: "Custom Software",
    icon: Settings,
  },
];

/* =========================================================
   TESTIMONIALS
========================================================= */

const testimonials = [
  {
    name: "Ahmed Khan",
    role: "Startup Founder",
    company: "Tech Startup",
    initials: "AK",
    text: "Codirung understood our idea quickly and transformed it into a clean, professional digital product. The communication throughout the project was excellent.",
  },
  {
    name: "Sarah Ahmed",
    role: "Business Owner",
    company: "E-Commerce Brand",
    initials: "SA",
    text: "We needed a modern website that actually represented our brand. The final result was responsive, fast and much more polished than what we had before.",
  },
  {
    name: "Usman Ali",
    role: "Product Manager",
    company: "Digital Company",
    initials: "UA",
    text: "What stood out was their attention to detail. From the interface to the development process, everything felt structured and professionally handled.",
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
   TECHNOLOGY ORBIT ITEM
========================================================= */

function OrbitItem({ item, index }) {
  const Icon = item.icon;

  return (
    <div
      className={`absolute ${item.position} z-20`}
      style={{
        animation: `technologyFloat ${
          4 + (index % 3) * 0.7
        }s ease-in-out infinite`,
        animationDelay: `${index * -0.35}s`,
      }}
    >
      <div className="group relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

        {/* Card */}
        <div className="relative flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#090909]/90 px-3 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:bg-white/[0.07]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
            <Icon
              size={15}
              strokeWidth={1.6}
              className="text-white/60 transition-colors duration-300 group-hover:text-white"
            />
          </div>

          <div className="hidden min-[420px]:block">
            <p className="whitespace-nowrap text-[11px] font-medium text-white/80">
              {item.name}
            </p>

            <p className="mt-0.5 whitespace-nowrap text-[8px] uppercase tracking-[0.12em] text-white/25">
              {item.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SERVICE PILL
========================================================= */

function ServicePill({ service, index }) {
  const Icon = service.icon;

  return (
    <div
      className="group flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.06]"
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      <Icon
        size={14}
        strokeWidth={1.5}
        className="text-white/40 transition-colors duration-300 group-hover:text-white/80"
      />

      <span className="whitespace-nowrap text-xs text-white/50 transition-colors duration-300 group-hover:text-white/80">
        {service.title}
      </span>
    </div>
  );
}

/* =========================================================
   TESTIMONIAL CARD
========================================================= */

function TestimonialCard({ testimonial, index }) {
  const [ref, visible] = useReveal(0.08);

  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-7 transition-all duration-700 hover:-translate-y-2 hover:border-white/[0.14] hover:bg-white/[0.045] sm:p-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Top glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-white/[0.04] blur-3xl transition-all duration-700 group-hover:bg-white/[0.08]" />

      {/* Quote icon */}
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
          <Quote
            size={18}
            strokeWidth={1.5}
            className="text-white/50"
          />
        </div>

        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              fill="currentColor"
              strokeWidth={0}
              className="text-white/50"
            />
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <p className="relative z-10 mt-7 min-h-[145px] text-sm leading-7 text-white/55 sm:text-[15px]">
        "{testimonial.text}"
      </p>

      {/* Divider */}
      <div className="my-7 h-px bg-white/[0.06]" />

      {/* Person */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.06] text-xs font-semibold text-white/70">
          {testimonial.initials}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            {testimonial.name}
          </h3>

          <p className="mt-1 text-xs text-white/30">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>

      {/* Bottom hover line */}
      <div className="absolute bottom-0 left-8 right-8 h-px origin-left scale-x-0 bg-white/30 transition-transform duration-700 group-hover:scale-x-100" />
    </article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TechnologyUniverse() {
  const [technologyRef, technologyVisible] = useReveal();
  const [testimonialRef, testimonialVisible] = useReveal();

  return (
    <section
      id="technology"
      className="relative overflow-hidden bg-[#050505] text-white"
    >
      {/* =====================================================
          GLOBAL BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        {/* =====================================================
            TECHNOLOGY HEADER
        ===================================================== */}

        <div
          ref={technologyRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${
            technologyVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2">
            <Sparkles
              size={13}
              className="text-white/60"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
              Technology Universe
            </span>
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            The technology behind
            <br />
            <span className="text-white/35">
              your next big idea.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
            From websites and mobile apps to design, SEO, marketing and
            custom software, we bring the right technologies together to
            create complete digital solutions.
          </p>
        </div>

        {/* =====================================================
            TECHNOLOGY UNIVERSE
        ===================================================== */}

        <div className="relative mx-auto mt-16 h-[520px] max-w-6xl overflow-hidden rounded-[36px] border border-white/[0.06] bg-[#060606] sm:mt-20 sm:h-[650px]">
          {/* Universe grid */}
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "55px 55px",
            }}
          />

          {/* Stars */}
          <div className="absolute inset-0">
            {Array.from({ length: 45 }).map((_, index) => (
              <span
                key={index}
                className="absolute h-[2px] w-[2px] rounded-full bg-white/30"
                style={{
                  left: `${(index * 37) % 100}%`,
                  top: `${(index * 61) % 100}%`,
                  opacity: 0.15 + ((index * 13) % 50) / 100,
                  animation: `starPulse ${
                    2 + (index % 4)
                  }s ease-in-out infinite`,
                  animationDelay: `${index * -0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Orbit 1 */}
          <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055] sm:h-[350px] sm:w-[350px]" />

          {/* Orbit 2 */}
          <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045] sm:h-[500px] sm:w-[500px]" />

          {/* Orbit 3 */}
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] sm:h-[650px] sm:w-[650px]" />

          {/* Center */}
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -inset-12 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/[0.12] bg-[#090909] shadow-[0_0_80px_rgba(255,255,255,0.06)] sm:h-40 sm:w-40">
              {/* Rotating ring */}
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-white/[0.12] [animation:spin_18s_linear_infinite]" />

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] sm:h-14 sm:w-14">
                  <Layers3
                    size={23}
                    strokeWidth={1.3}
                    className="text-white/75"
                  />
                </div>

                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Codirung
                </p>
              </div>
            </div>
          </div>

          {/* Orbit items */}
          {technologies.map((item, index) => (
            <OrbitItem
              key={item.name}
              item={item}
              index={index}
            />
          ))}

          {/* Mobile fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#060606] to-transparent" />

          {/* Bottom label */}
          <div className="absolute bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/[0.07] bg-[#080808]/80 px-4 py-2 backdrop-blur-md">
            <p className="whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-white/30">
              One team · Multiple capabilities
            </p>
          </div>
        </div>

        {/* =====================================================
            SERVICE MARQUEE
        ===================================================== */}

        <div className="mt-8 overflow-hidden">
          <div className="flex w-max gap-3 [animation:marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
            {[...services, ...services].map((service, index) => (
              <ServicePill
                key={`${service.title}-${index}`}
                service={service}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div className="my-24 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent sm:my-32" />

        {/* =====================================================
            TESTIMONIAL HEADER
        ===================================================== */}

        <div
          ref={testimonialRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${
            testimonialVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2">
            <Quote
              size={13}
              className="text-white/60"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 sm:text-[11px]">
              Client Stories
            </span>
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Don't take our word
            <br />
            <span className="text-white/35">
              for it.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
            Great digital products are built through collaboration. Here's
            what our clients have to say about working with Codirung.
          </p>
        </div>

        {/* =====================================================
            TESTIMONIAL CARDS
        ===================================================== */}

        <div className="mt-16 grid gap-5 md:grid-cols-3 lg:mt-20">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* =====================================================
            TESTIMONIAL CTA
        ===================================================== */}

        <div className="mt-12 flex justify-center">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=codirung%40gmail.com&su=Project%20Inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.025] px-5 py-3 text-sm text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            Become our next success story

            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes technologyFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -9px, 0);
          }
        }

        @keyframes starPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }

          50% {
            transform: scale(1.8);
            opacity: 0.7;
          }
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
