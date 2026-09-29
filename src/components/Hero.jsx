import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Database,
  Globe,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  const heroRef = useRef(null);
  const visualRef = useRef(null);

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const reducePointerEffects = window.matchMedia(
      "(max-width: 767px), (prefers-reduced-motion: reduce)"
    );

    if (reducePointerEffects.matches) return;

    let animationFrame;

    const handleMouseMove = (event) => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        setMouse({
          x,
          y,
        });
      });
    };

    hero.addEventListener("mousemove", handleMouseMove);

    return () => {
      hero.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const rotateX = mouse.y * -8;
  const rotateY = mouse.x * 10;

  const moveX = mouse.x * 25;
  const moveY = mouse.y * 25;

  return (
    <section
      ref={heroRef}
      id="home"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050505]
        text-white
      "
    >
      {/* ================= BACKGROUND ================= */}

      {/* Animated gradient */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.035]
          blur-[140px]
        "
      />

      <div
        className="
          hero-orb
          pointer-events-none
          absolute
          left-[10%]
          top-[20%]
          h-40
          w-40
          rounded-full
          bg-purple-500/10
          blur-[80px]
        "
      />

      <div
        className="
          hero-orb-delay
          pointer-events-none
          absolute
          bottom-[10%]
          right-[10%]
          h-52
          w-52
          rounded-full
          bg-blue-500/10
          blur-[90px]
        "
      />

      {/* Grid */}
      <div
        className="
          hero-grid
          pointer-events-none
          absolute
          inset-0
          opacity-[0.18]
        "
      />

      {/* Noise */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
        "
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ================= CONTENT ================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-7xl
          items-start
          px-6
          pb-16
          pt-32
          sm:items-center
          sm:px-6
          lg:px-8
        "
      >
        <div className="grid w-full items-center gap-10 sm:gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
          {/* ================= LEFT CONTENT ================= */}

          <div className="hero-content w-full max-w-3xl min-w-0">
            {/* Badge */}
            <div className="hero-badge mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>

              <span className="text-xs font-medium tracking-wide text-white/60">
                Available for new projects
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="
                hero-title
                max-w-4xl
                text-5xl
                font-bold
                leading-[0.95]
                tracking-[-0.045em]
                sm:text-6xl
                md:text-7xl
                lg:text-[5.5rem]
                xl:text-[6.2rem]
              "
            >
              <span className="hero-line block">
                We build
              </span>

              <span className="hero-line block">
                <span className="text-white">
                  digital
                </span>{" "}
                <span className="hero-gradient-text">
                  experiences.
                </span>
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                hero-description
                mt-8
                max-w-xl
                text-base
                leading-7
                text-white/45
                sm:text-lg
              "
            >
              We design and develop high-performance
              websites, web applications and digital
              products that help businesses grow.
            </p>

            {/* CTA */}
            <div className="hero-buttons mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=hello%40codirung.com&su=Project%20Inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-black
                  transition-all
                  duration-300
                  hover:scale-[1.03]
                  hover:bg-white/90
                  active:scale-95
                "
              >
                Start a Project

                <ArrowUpRight
                  size={17}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                />
              </a>

              <a
                href="#services"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-6
                  py-3.5
                  text-sm
                  font-medium
                  text-white/70
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-white/20
                  hover:bg-white/[0.07]
                  hover:text-white
                "
              >
                Explore Services

                <ArrowDown
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-y-1
                  "
                />
              </a>
            </div>

            {/* Mini stats */}
            <div className="hero-stats mt-12 flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <p className="text-2xl font-semibold">
                  20+
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Projects
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-2xl font-semibold">
                  10+
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Technologies
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-2xl font-semibold">
                  24/7
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Support
                </p>
              </div>
            </div>
          </div>

          {/* ================= HERO VISUAL ================= */}

          <div className="relative flex min-h-[300px] w-full items-center justify-center sm:min-h-[480px] lg:min-h-[600px]">
            {/* Main 3D container */}
            <div
              ref={visualRef}
              className="
                relative
                h-[270px]
                w-[270px]
                sm:h-[450px]
                sm:w-[450px]
                lg:h-[520px]
                lg:w-[520px]
              "
              style={{
                transform: `
                  perspective(1200px)
                  rotateX(${rotateX}deg)
                  rotateY(${rotateY}deg)
                  translate3d(${moveX}px, ${moveY}px, 0)
                `,
                transition:
                  "transform 0.15s ease-out",
              }}
            >
              {/* Outer glow */}
              <div
                className="
                  absolute
                  inset-[10%]
                  rounded-full
                  border
                  border-white/[0.04]
                  bg-white/[0.015]
                  shadow-[0_0_120px_rgba(255,255,255,0.05)]
                "
              />

              {/* Orbit 1 */}
              <div
                className="
                  absolute
                  inset-[5%]
                  rounded-full
                  border
                  border-dashed
                  border-white/[0.08]
                "
                style={{
                  animation:
                    "spinSlow 30s linear infinite",
                }}
              />

              {/* Orbit 2 */}
              <div
                className="
                  absolute
                  inset-[17%]
                  rounded-full
                  border
                  border-white/[0.05]
                "
                style={{
                  animation:
                    "spinReverse 22s linear infinite",
                }}
              />

              {/* Center dashboard */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  w-[250px]
                  -translate-x-1/2
                  -translate-y-1/2
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0b0b0c]/90
                  shadow-2xl
                  backdrop-blur-2xl
                  sm:w-[340px]
                  lg:w-[390px]
                "
                style={{
                  transform:
                    "translate(-50%, -50%) translateZ(40px)",
                }}
              >
                {/* Browser header */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/15" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                  </div>

                  <div className="flex items-center gap-2 text-[9px] text-white/25">
                    <Globe size={10} />
                    codirung.dev
                  </div>
                </div>

                {/* Dashboard */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                        Overview
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        Dashboard
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                      <Sparkles
                        size={14}
                        className="text-white/60"
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
                      <p className="text-[9px] text-white/30">
                        Revenue
                      </p>

                      <p className="mt-1 text-base font-semibold">
                        $24.8K
                      </p>

                      <p className="mt-1 text-[8px] text-green-400/70">
                        +32.8%
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
                      <p className="text-[9px] text-white/30">
                        Users
                      </p>

                      <p className="mt-1 text-base font-semibold">
                        18.4K
                      </p>

                      <p className="mt-1 text-[8px] text-blue-400/70">
                        +18.2%
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] text-white/30">
                        Performance
                      </p>

                      <span className="text-[8px] text-white/25">
                        Last 30 days
                      </span>
                    </div>

                    <div className="relative mt-5 h-24">
                      <div className="absolute inset-x-0 top-0 border-t border-white/5" />
                      <div className="absolute inset-x-0 top-1/2 border-t border-white/5" />
                      <div className="absolute inset-x-0 bottom-0 border-t border-white/5" />

                      <svg
                        viewBox="0 0 400 100"
                        className="absolute inset-0 h-full w-full"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="white"
                              stopOpacity="0.18"
                            />

                            <stop
                              offset="100%"
                              stopColor="white"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="M0 80 C40 65 50 72 80 58 C110 44 125 55 155 45 C185 35 190 42 220 32 C250 22 265 38 290 25 C320 10 340 20 365 8 C380 2 390 5 400 0 V100 H0 Z"
                          fill="url(#chartGradient)"
                        />

                        <path
                          d="M0 80 C40 65 50 72 80 58 C110 44 125 55 155 45 C185 35 190 42 220 32 C250 22 265 38 290 25 C320 10 340 20 365 8 C380 2 390 5 400 0"
                          fill="none"
                          stroke="rgba(255,255,255,0.65)"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/5 bg-white/[0.025] p-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                        <Code2 size={12} />
                      </div>

                      <div>
                        <p className="text-[8px] text-white/25">
                          Development
                        </p>

                        <p className="text-[9px] font-medium">
                          Active
                        </p>
                      </div>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/[0.025]">
                      <Database
                        size={15}
                        className="text-white/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card - top */}
              <div
                className="
                  hero-floating-card hidden sm:block
                  absolute hidden sm:block
                  -right-2
                  top-[5%]
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#101010]/90
                  p-3
                  shadow-2xl
                  backdrop-blur-xl
                  sm:right-0
                  lg:right-[-20px]
                "
                style={{
                  transform: `
                    translate3d(
                      ${mouse.x * -18}px,
                      ${mouse.y * -18}px,
                      80px
                    )
                  `,
                  transition:
                    "transform 0.2s ease-out",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                    <Sparkles size={15} />
                  </div>

                  <div>
                    <p className="text-[9px] text-white/30">
                      AI System
                    </p>

                    <p className="text-xs font-medium">
                      Processing...
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card - left */}
              <div
                className="
                  absolute hidden sm:block
                  bottom-[16%]
                  left-[-10px]
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#101010]/90
                  p-3
                  shadow-2xl
                  backdrop-blur-xl
                  sm:left-0
                  lg:left-[-25px]
                "
                style={{
                  transform: `
                    translate3d(
                      ${mouse.x * -28}px,
                      ${mouse.y * -28}px,
                      100px
                    )
                  `,
                  transition:
                    "transform 0.2s ease-out",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-400/10">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                  </div>

                  <div>
                    <p className="text-[9px] text-white/30">
                      Server
                    </p>

                    <p className="text-xs font-medium">
                      Operational
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating card - bottom */}
              <div
                className="
                  absolute
                  bottom-[3%]
                  right-[2%]
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#101010]/90
                  p-3
                  shadow-2xl
                  backdrop-blur-xl
                  sm:right-[5%]
                  lg:right-[0]
                "
                style={{
                  transform: `
                    translate3d(
                      ${mouse.x * 35}px,
                      ${mouse.y * 35}px,
                      120px
                    )
                  `,
                  transition:
                    "transform 0.2s ease-out",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                    <Code2 size={15} />
                  </div>

                  <div>
                    <p className="text-[9px] text-white/30">
                      Build
                    </p>

                    <p className="text-xs font-medium">
                      v2.4.0 deployed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SCROLL INDICATOR ================= */}

      <div
        className="
          absolute
          bottom-7
          left-1/2
          z-10
          hidden
          -translate-x-1/2
          items-center
          gap-3
          text-white/25
          sm:flex
        "
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">
          Scroll to explore
        </span>

        <div className="h-8 w-px overflow-hidden bg-white/10">
          <div className="scroll-line h-3 w-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
