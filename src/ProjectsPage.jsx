import { useEffect, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "./shared.jsx";

const projects = [
  {
    name: "Leftover",
    director: "Salim Ahamed",
    href: "/projects/leftover",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/6926f7946a3051997ee47300_Hero%20Thumb%20(1)%201.jpg",
  },
  {
    name: "Mayilaa",
    director: "Semmalar Annam",
    href: "/projects/mayilaa",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/699eb9f469412164047fcacd_Still%202024-10-13%20220053_1.2.13.avif",
  },
  {
    name: "Paradise",
    director: "Prasanna Vithanage",
    href: "/projects/paradise",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/66b5aac33808fd30141e2502_Web-banner-03-1.avif",
  },
  {
    name: "Family",
    director: "Don Palathara",
    href: "/projects/family",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/67519aad9146d42121cf5ba7_family_stills_02.avif",
  },
  {
    name: "Lalanna's Song",
    director: "Megha Ramaswamy",
    href: "/projects/lalannas",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/6750916042d6f16825802e21_Lalanna_s%20Song%20Still%201.avif",
  },
  {
    name: "Kiss",
    director: "Varun Grover",
    href: "/projects/kiss",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/6750a08149ccf8b9625082b3_Still%202.avif",
  },
];

export default function ProjectsPage() {
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [railVisible, setRailVisible] = useState(false);

  useEffect(() => {
    const cards = listRef.current?.querySelectorAll(".ncp-card");
    if (!cards?.length) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    // Marks whichever card crosses the middle band of the viewport as active.
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    const railObserver = new IntersectionObserver(
      ([entry]) => setRailVisible(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px", threshold: 0 }
    );

    cards.forEach((card) => {
      revealObserver.observe(card);
      spyObserver.observe(card);
    });
    railObserver.observe(listRef.current);

    return () => {
      revealObserver.disconnect();
      spyObserver.disconnect();
      railObserver.disconnect();
    };
  }, []);

  function jumpTo(index) {
    const el = document.getElementById(`ncp-project-${index}`);
    if (!el) return;
    setActiveIndex(index);
    const rect = el.getBoundingClientRect();
    const target = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;

    // rAF is paused in hidden/background pages, so animate only when visible.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.visibilityState === "hidden"
    ) {
      window.scrollTo({ top: target, behavior: "instant" });
      return;
    }

    const from = window.scrollY;
    const distance = target - from;
    const duration = Math.min(900, 350 + Math.abs(distance) * 0.15);
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, from + distance * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  return (
    <main className="nc-page">
      <SiteHeader />

      <section className="ncp-hero" aria-label="Projects introduction">
        <div className="nc-minihead">
          <span />
          <b>Our Work</b>
          <span />
        </div>
        <h1>Projects</h1>
        <p>
          Six films. Stories that challenge social norms and inspire positive change —
          from Cannes to Rotterdam.
        </p>
        <div className="nc-scroll ncp-scroll">
          <span>SCROLL</span>
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="6,9 12,15 18,9" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
      </section>

      <section className="ncp-list" aria-label="All projects" ref={listRef}>
        {projects.map((film, index) => (
          <a
            href={film.href}
            className="ncp-card"
            id={`ncp-project-${index}`}
            data-index={index}
            aria-label={`${film.name}, directed by ${film.director}`}
            key={film.name}
          >
            <div className="ncp-media">
              <img src={film.image} alt="" loading={index === 0 ? "eager" : "lazy"} />
            </div>
            <span className="ncp-num">
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <div className="ncp-meta">
              <div>
                <em>{film.director}</em>
                <strong>{film.name}</strong>
              </div>
              <i aria-hidden="true">↗</i>
            </div>
          </a>
        ))}
      </section>

      <nav className={`ncp-rail${railVisible ? " is-shown" : ""}`} aria-label="Jump to project">
        {projects.map((film, index) => (
          <button
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`Go to ${film.name}`}
            aria-current={index === activeIndex ? "true" : undefined}
            title={film.name}
            onClick={() => jumpTo(index)}
            key={film.name}
          >
            <img src={film.image} alt="" loading="lazy" />
          </button>
        ))}
      </nav>

      <SiteFooter />
    </main>
  );
}
