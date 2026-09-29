import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  Globe,
  Palette,
  Search,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Fast, responsive and scalable websites engineered around your business goals.",
    icon: Code2,
    technologies: [
      "React",
      "JavaScript",
      "PHP",
    ],
  },
  {
    number: "02",
    title: "Web Applications",
    description:
      "Powerful custom web applications, dashboards and platforms built for real-world workflows.",
    icon: Globe,
    technologies: [
      "Node.js",
      "MongoDB",
      "MySQL",
    ],
  },
  {
    number: "03",
    title: "UI / UX Design",
    description:
      "Clean and intuitive interfaces that turn complicated products into simple experiences.",
    icon: Palette,
    technologies: [
      "Figma",
      "Prototyping",
      "Design Systems",
    ],
  },
  {
    number: "04",
    title: "SEO & Growth",
    description:
      "Technical SEO and digital optimization designed to help your product reach the right audience.",
    icon: Search,
    technologies: [
      "SEO",
      "Analytics",
      "Optimization",
    ],
  },
];

function ServiceCard({ service, index }) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  const Icon = service.icon;

  const handleMouseMove = (event) => {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) / rect.height) *
      100;

    setPosition({
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setPosition({
      x: 50,
      y: 50,
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="
        service-card
        group
        relative
        min-h-[390px]
        overflow-hidden
        rounded-3xl
        border
        border-white/[0.08]
        bg-[#0a0a0a]
        p-7
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-white/15
        hover:bg-[#0d0d0d]
        sm:p-8
      "
      style={{
        "--mouse-x": `${position.x}%`,
        "--mouse-y": `${position.y}%`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Mouse glow */}
      <div
        className="
          pointer-events-none
          absolute
          -inset-px
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
        style={{
          background: `
            radial-gradient(
              250px circle at var(--mouse-x) var(--mouse-y),
              rgba(255,255,255,0.08),
              transparent 70%
            )
          `,
        }}
      />

      {/* Number */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.2em] text-white/25">
          {service.number}
        </span>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            transition-all
            duration-500
            group-hover:rotate-6
            group-hover:bg-white
            group-hover:text-black
          "
        >
          <Icon size={18} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mt-20">
        <h3
          className="
            text-2xl
            font-semibold
            tracking-tight
            text-white
            transition-transform
            duration-500
            group-hover:translate-x-1
            sm:text-3xl
          "
        >
          {service.title}
        </h3>

        <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
          {service.description}
        </p>
      </div>

      {/* Technologies */}
      <div className="absolute bottom-7 left-7 right-7 z-10 sm:bottom-8 sm:left-8 sm:right-8">
        <div className="mb-5 h-px w-full bg-white/[0.07]" />

        <div className="flex flex-wrap gap-2">
          {service.technologies.map(
            (technology) => (
              <span
                key={technology}
                className="
                  rounded-full
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  text-white/35
                  transition-all
                  duration-300
                  group-hover:border-white/15
                  group-hover:text-white/60
                "
              >
                {technology}
              </span>
            )
          )}
        </div>
      </div>

      {/* Arrow */}
      <div
        className="
          absolute
          bottom-8
          right-8
          flex
          h-10
          w-10
          translate-y-3
          items-center
          justify-center
          rounded-full
          bg-white
          text-black
          opacity-0
          transition-all
          duration-500
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        <ArrowUpRight size={17} />
      </div>

      {/* Decorative gradient */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -right-20
          h-40
          w-40
          rounded-full
          bg-white/[0.025]
          blur-3xl
          transition-all
          duration-700
          group-hover:scale-150
          group-hover:bg-white/[0.05]
        "
      />
    </article>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="
        relative
        overflow-hidden
        bg-[#050505]
        px-6
        py-28
        text-white
        sm:py-36
        lg:px-8
        lg:py-44
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="services-grid absolute inset-0 opacity-[0.12]" />

        <div
          className="
            absolute
            left-1/2
            top-20
            h-[400px]
            w-[400px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.025]
            blur-[120px]
          "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <div className="services-label flex items-center gap-3">
              <span className="h-px w-8 bg-white/40" />

              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
                What we do
              </span>
            </div>
          </div>

          <div>
            <h2
              className="
                services-heading
                max-w-4xl
                text-4xl
                font-semibold
                leading-[1]
                tracking-[-0.04em]
                sm:text-5xl
                md:text-6xl
              "
            >
              Digital products
              <br />

              <span className="text-white/30">
                built around your vision.
              </span>
            </h2>

            <p className="services-description mt-7 max-w-xl text-sm leading-6 text-white/35 sm:text-base">
              From the first idea to the final
              deployment, we combine design,
              technology and strategy to create
              digital experiences that work.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-24">
          {services.map((service, index) => (
            <ServiceCard
              key={service.number}
              service={service}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
