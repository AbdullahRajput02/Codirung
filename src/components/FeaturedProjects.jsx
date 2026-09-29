import { useEffect, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";

import {
  ArrowUpRight,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

import { db } from "../firebase/firebase";

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const [visible, setVisible] = useState(false);

  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMouseMove = (event) => {
    const element = cardRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    setMouse({
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setMouse({
      x: 50,
      y: 50,
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        group
        relative
        transition-all
        duration-1000
        ease-[cubic-bezier(0.16,1,0.3,1)]
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-24 opacity-0"
        }
      `}
      style={{
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Project Visual */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.08]
          bg-[#0b0b0b]
          shadow-2xl
          transition-all
          duration-700
          group-hover:border-white/[0.16]
          group-hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)]
        "
      >
        {/* Mouse Glow */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
          style={{
            background: `
              radial-gradient(
                350px circle at ${mouse.x}% ${mouse.y}%,
                rgba(255,255,255,0.10),
                transparent 70%
              )
            `,
          }}
        />

        {/* Browser Bar */}
        <div
          className="
            relative
            z-30
            flex
            items-center
            justify-between
            border-b
            border-white/[0.08]
            bg-[#0c0c0c]
            px-5
            py-3
          "
        >
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
          </div>

          <div className="max-w-[180px] truncate rounded-md border border-white/5 bg-white/[0.025] px-3 py-1 text-[9px] text-white/20">
            {project.projectUrl
              ? project.projectUrl.replace(
                  /^https?:\/\//,
                  ""
                )
              : "project-preview"}
          </div>

          <div className="h-5 w-5" />
        </div>

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.imageUrl ? (
            <img
              ref={imageRef}
              src={project.imageUrl}
              alt={project.title}
              loading="lazy"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-[1200ms]
                ease-[cubic-bezier(0.16,1,0.3,1)]
                group-hover:scale-[1.06]
              "
              style={{
                transform: `
                  translate(
                    ${(mouse.x - 50) * -0.025}%,
                    ${(mouse.y - 50) * -0.025}%
                  )
                  scale(1.03)
                `,
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-white/[0.03]">
              <FolderOpen
                size={45}
                className="text-white/10"
              />
            </div>
          )}

          {/* Image Overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/50
              via-transparent
              to-transparent
            "
          />

          {/* Project Number */}
          <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white/60 backdrop-blur-xl">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* View Button */}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                absolute
                bottom-5
                right-5
                flex
                h-11
                w-11
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
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Project Information */}
      <div className="mt-6 px-1">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/30">
              {project.category ||
                "Digital Product"}
            </p>

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
              {project.title}
            </h3>
          </div>

          <a
            href={
              project.projectUrl || "#"
            }
            target={
              project.projectUrl
                ? "_blank"
                : undefined
            }
            rel={
              project.projectUrl
                ? "noopener noreferrer"
                : undefined
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              text-white/40
              transition-all
              duration-300
              hover:border-white/30
              hover:bg-white
              hover:text-black
            "
          >
            <ExternalLink size={15} />
          </a>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map(
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
        )}
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

 useEffect(() => {
  const projectsRef = ref(db, "projects");

  const unsubscribe = onValue(
    projectsRef,
    (snapshot) => {
      const data = snapshot.val();

      const projectData = data
        ? Object.entries(data).map(([id, project]) => ({
            id,
            ...project,
          }))
        : [];

      // Sirf featured projects display honge.
      const featuredProjects = projectData
        .filter((project) => project.featured === true)
        .sort((a, b) => {
          const orderA = Number(a.order) || 0;
          const orderB = Number(b.order) || 0;

          return orderA - orderB;
        });

      setProjects(featuredProjects);
      setLoading(false);
      setError("");
    },
    (firebaseError) => {
      console.error("Projects error:", firebaseError);

      setError("Unable to load projects right now.");
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, []);

  return (
    <section
      id="work"
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
        <div className="projects-grid absolute inset-0 opacity-[0.1]" />

        <div
          className="
            absolute
            left-1/2
            top-0
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.025]
            blur-[140px]
          "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-white/40" />

              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
                Selected work
              </span>
            </div>

            <p className="text-sm text-white/25">
              01 — Portfolio
            </p>
          </div>

          <div>
            <h2
              className="
                text-4xl
                font-semibold
                leading-[1]
                tracking-[-0.045em]
                sm:text-5xl
                md:text-6xl
              "
            >
              Work that turns
              <br />

              <span className="text-white/30">
                ideas into products.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-sm leading-6 text-white/35 sm:text-base">
              Explore selected digital products,
              websites and applications we've built
              for businesses and ambitious teams.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-24 xl:grid-cols-3">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="aspect-[16/10] rounded-[28px] bg-white/[0.04]" />

                <div className="mt-6 h-5 w-40 rounded bg-white/[0.04]" />

                <div className="mt-3 h-4 w-72 rounded bg-white/[0.03]" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-16 rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-8 text-center">
            <p className="text-sm text-white/40">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="mt-16 rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-16 text-center">
              <FolderOpen
                size={40}
                className="mx-auto text-white/15"
              />

              <p className="mt-5 text-sm text-white/35">
                Featured projects will appear
                here.
              </p>
            </div>
          )}

        {/* Projects */}
        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-24 xl:grid-cols-3">
              {projects.map(
                (project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                )
              )}
            </div>
          )}
      </div>
    </section>
  );
}
