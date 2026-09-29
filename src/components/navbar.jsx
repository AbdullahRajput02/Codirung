import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  {
    name: "Home",
    href: "#home",
  },
  
  {
    name: "Services",
    href: "#services",
    dropdown: true,
  },
  
  {
    name: "Work",
    href: "#work",
  },

  {
    name: "About",
    href: "#about",
  },
  {
    name: "Process",
    href: "#process",
  },
];

const serviceLinks = [
  {
    name: "Web Development",
    href: "#web-development",
  },
  {
    name: "Web Applications",
    href: "#web-applications",
  },
  {
    name: "UI / UX Design",
    href: "#ui-ux",
  },
  {
    name: "SEO & Growth",
    href: "#seo",
  },
];

const contactEmailUrl =
  "https://mail.google.com/mail/?view=cm&fs=1&to=hello%40codirung.com&su=Project%20Inquiry";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let animationFrame = 0;
    let previousScrolled = null;
    let previousSection = "";

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 40;

        const sections = ["home", "work", "services", "about", "process"];

        let currentSection = "home";

        sections.forEach((section) => {
          const element = document.getElementById(section);

          if (element && element.getBoundingClientRect().top <= 180) {
            currentSection = section;
          }
        });

        if (nextScrolled !== previousScrolled) {
          previousScrolled = nextScrolled;
          setIsScrolled(nextScrolled);
        }

        if (currentSection !== previousSection) {
          previousSection = currentSection;
          setActiveSection(currentSection);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleNavClick = (href) => {
    setIsMobileOpen(false);
    setIsServicesOpen(false);

    if (href === "#contact") {
      window.open(contactEmailUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.replaceState(null, "", href);
    }
  };

  return (
    <>
      {/* Desktop / Main Navbar */}
      <header
        className={`
          fixed
          top-4
          left-1/2
          -translate-x-1/2
          z-50
          w-[calc(100%-2rem)]
          max-w-6xl
          transition-all
          duration-500
          ease-out
          ${
            isScrolled
              ? "top-3 scale-[0.98]"
              : "top-4 scale-100"
          }
        `}
      >
        <nav
          className={`
            relative
            flex
            items-center
            justify-between
            rounded-2xl
            border
            px-4
            py-3
            transition-all
            duration-500
            ${
              isScrolled
                ? "border-white/15 bg-black/75 shadow-2xl shadow-black/30 backdrop-blur-2xl"
                : "border-white/10 bg-black/50 backdrop-blur-xl"
            }
          `}
        >
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home")}
            className="group relative flex items-center gap-2"
          >
            {/* Logo Symbol */}
            <div
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-white
                text-black
                transition-all
                duration-300
                group-hover:rotate-6
                group-hover:scale-105
              "
            >
              <span className="text-sm font-black tracking-tighter">
                C
              </span>

              <div
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-black/20
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />
            </div>

            {/* Logo Text */}
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-[0.18em] text-white">
                CODIRUNG
              </span>

              <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.28em] text-white/40">
                Digital Studio
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const sectionName = link.href.replace("#", "");

              const isActive = activeSection === sectionName;

              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <button
                      onClick={() =>
                        handleNavClick(link.href)
                      }
                      className={`
                        group
                        relative
                        flex
                        items-center
                        gap-1.5
                        rounded-xl
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "text-white"
                            : "text-white/55 hover:text-white"
                        }
                      `}
                    >
                      {link.name}

                      <ChevronDown
                        size={14}
                        className={`
                          transition-transform
                          duration-300
                          ${
                            isServicesOpen
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      />

                      {isActive && (
                        <span
                          className="
                            absolute
                            bottom-1
                            left-1/2
                            h-1
                            w-1
                            -translate-x-1/2
                            rounded-full
                            bg-white
                          "
                        />
                      )}
                    </button>

                    {/* Services Dropdown */}
                    <div
                      className={`
                        absolute
                        left-1/2
                        top-full
                        mt-3
                        w-64
                        -translate-x-1/2
                        origin-top
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/90
                        p-2
                        shadow-2xl
                        backdrop-blur-2xl
                        transition-all
                        duration-300
                        ${
                          isServicesOpen
                            ? "visible translate-y-0 scale-100 opacity-100"
                            : "invisible -translate-y-2 scale-95 opacity-0"
                        }
                      `}
                    >
                      <div className="mb-2 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                          What we build
                        </p>
                      </div>

                      {serviceLinks.map((service) => (
                        <button
                          key={service.name}
                          onClick={() =>
                            handleNavClick(service.href)
                          }
                          className="
                            group
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            transition-all
                            duration-200
                            hover:bg-white/10
                          "
                        >
                          <span className="text-sm text-white/65 transition-colors group-hover:text-white">
                            {service.name}
                          </span>

                          <ArrowUpRight
                            size={15}
                            className="
                              text-white/20
                              transition-all
                              duration-200
                              group-hover:translate-x-0.5
                              group-hover:-translate-y-0.5
                              group-hover:text-white
                            "
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={link.name}
                  onClick={() =>
                    handleNavClick(link.href)
                  }
                  className={`
                    relative
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "text-white"
                        : "text-white/55 hover:text-white"
                    }
                  `}
                >
                  {link.name}

                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-1
                        left-1/2
                        h-1
                        w-1
                        -translate-x-1/2
                        rounded-full
                        bg-white
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <button
            onClick={() =>
              handleNavClick("#contact")
            }
            className="
              group
              hidden
              items-center
              gap-2
              rounded-xl
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-black
              transition-all
              duration-300
              hover:scale-[1.03]
              hover:bg-white/90
              active:scale-95
              md:flex
            "
          >
            <span>Let's Talk</span>

            <ArrowUpRight
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setIsMobileOpen(!isMobileOpen)
            }
            aria-label={
              isMobileOpen
                ? "Close menu"
                : "Open menu"
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              text-white
              transition-all
              duration-300
              hover:bg-white/10
              md:hidden
            "
          >
            <div className="relative h-5 w-5">
              <Menu
                size={21}
                className={`
                  absolute
                  left-0
                  top-0
                  transition-all
                  duration-300
                  ${
                    isMobileOpen
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }
                `}
              />

              <X
                size={21}
                className={`
                  absolute
                  left-0
                  top-0
                  transition-all
                  duration-300
                  ${
                    isMobileOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  }
                `}
              />
            </div>
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`
            mt-2
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-black/90
            shadow-2xl
            backdrop-blur-2xl
            transition-all
            duration-500
            md:hidden
            ${
              isMobileOpen
                ? "max-h-[600px] translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
            }
          `}
        >
          <div className="p-3">
            {navLinks.map((link, index) => {
              const sectionName =
                link.href.replace("#", "");

              const isActive =
                activeSection === sectionName;

              return (
                <div key={link.name}>
                  <button
                    onClick={() =>
                      handleNavClick(link.href)
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      py-3.5
                      text-left
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }
                    `}
                    style={{
                      transitionDelay: isMobileOpen
                        ? `${index * 40}ms`
                        : "0ms",
                    }}
                  >
                    <span className="text-sm font-medium">
                      {link.name}
                    </span>

                    {link.dropdown && (
                      <ChevronDown
                        size={15}
                        className="text-white/30"
                      />
                    )}
                  </button>

                  {/* Mobile Services */}
                  {link.dropdown && (
                    <div className="ml-4 border-l border-white/10 pl-3">
                      {serviceLinks.map(
                        (service) => (
                          <button
                            key={service.name}
                            onClick={() =>
                              handleNavClick(
                                service.href
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              rounded-lg
                              px-3
                              py-2.5
                              text-left
                              text-xs
                              text-white/40
                              transition-colors
                              hover:text-white
                            "
                          >
                            {service.name}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile CTA */}
            <button
              onClick={() =>
                handleNavClick("#contact")
              }
              className="
                group
                mt-3
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-4
                py-3.5
                text-sm
                font-semibold
                text-black
                transition-all
                duration-300
                hover:bg-white/90
                active:scale-[0.98]
              "
            >
              <span>Let's Talk</span>

              <ArrowUpRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
