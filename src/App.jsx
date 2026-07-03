import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "./shared.jsx";

const LOGOS = {
  mubi: "https://cdn.prod.website-files.com/6656dece0ea89264ba78749f/6814631a17ec2af83c7caa2d_mubi.png",
  prime:
    "https://cdn.prod.website-files.com/6656dece0ea89264ba78749f/678105ef1bc9874bb1339733_prime_video.avif",
  simply:
    "https://cdn.prod.website-files.com/6656dece0ea89264ba78749f/677f7a0329f19dc556ef1148_image%20112.avif",
  manorama:
    "https://cdn.prod.website-files.com/6656dece0ea89264ba78749f/677f7a035a25be0067af95df_image%20111.avif",
  bms: "https://cdn.prod.website-files.com/6656dece0ea89264ba78749f/67ce891ceb234ee501ca22e0_book%20my%20show.png",
};

const projects = [
  {
    name: "Leftover",
    href: "/projects/leftover",
    aria: "Leftover project",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/6926f7946a3051997ee47300_Hero%20Thumb%20(1)%201.jpg",
  },
  {
    name: "Mayilaa",
    href: "/projects/mayilaa",
    aria: "Mayilaa project",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/699eb9f469412164047fcacd_Still%202024-10-13%20220053_1.2.13.avif",
  },
  {
    name: "Paradise",
    href: "/projects/paradise",
    aria: "Paradise project",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/66b5aac33808fd30141e2502_Web-banner-03-1.avif",
  },
  {
    name: "Family",
    href: "/projects/family",
    aria: "Family project",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/67519aad9146d42121cf5ba7_family_stills_02.avif",
  },
  {
    name: "Lalanna's Song",
    href: "/projects/lalannas",
    aria: "Lalanna's Song project",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/6750916042d6f16825802e21_Lalanna_s%20Song%20Still%201.avif",
  },
  {
    name: "Kiss",
    href: "/projects/kiss",
    aria: "Kiss project",
    image:
      "https://cdn.prod.website-files.com/6662e6f7da01588b3e991acc/6750a08149ccf8b9625082b3_Still%202.avif",
  },
];

const films = [
  {
    title: "Kiss",
    href: "https://mubi.com/en/in/films/kiss-2022",
    platforms: [{ name: "MUBI", logo: LOGOS.mubi, href: "https://mubi.com/en/in/films/kiss-2022" }],
  },
  {
    title: "Lalanna's Song",
    href: "https://mubi.com/en/in/films/lalanna-s-song",
    platforms: [
      { name: "MUBI", logo: LOGOS.mubi, href: "https://mubi.com/en/in/films/lalanna-s-song" },
    ],
  },
  {
    title: "Paradise",
    href: "https://mubi.com/en/in/films/paradise-2023-prasanna-vithanage",
    platforms: [
      {
        name: "Prime Video",
        logo: LOGOS.prime,
        href: "https://www.primevideo.com/detail/Paradise/0PEBRP55AHPH7T4827AGP1DC2T",
      },
      {
        name: "ManoramaMax",
        logo: LOGOS.manorama,
        href: "https://www.manoramamax.com/movies/detail/165991/paradise",
      },
      {
        name: "SimplySouth",
        logo: LOGOS.simply,
        href: "https://www.simplysouth.tv/en/paradise",
      },
      {
        name: "BookMyShow",
        logo: LOGOS.bms,
        href: "https://in.bookmyshow.com/mumbai/movies/paradise/ET00401459",
      },
      {
        name: "MUBI",
        logo: LOGOS.mubi,
        href: "https://mubi.com/en/in/films/paradise-2023-prasanna-vithanage",
      },
    ],
  },
  {
    title: "Family",
    href: "https://mubi.com/en/in/films/family-2023",
    platforms: [
      {
        name: "ManoramaMax",
        logo: LOGOS.manorama,
        href: "https://www.manoramamax.com/movies/detail/169758/family",
      },
      { name: "MUBI", logo: LOGOS.mubi, href: "https://mubi.com/en/in/films/family-2023" },
      { name: "SimplySouth", logo: LOGOS.simply, href: "https://simplysouth.tv/family" },
    ],
  },
];

const news = [
  {
    source: "Deadline",
    text: "Newton Cinema unveils prestige South Asian slate headed by 'Leftover' & 'The Gambler'",
    href: "https://deadline.com/2026/05/newton-cinema-salim-ahamed-leftover-prasanna-vithanage-1236887698/",
  },
  {
    source: "Times of India",
    text: "'Leftover' at Cannes - Salim Ahamed on telling a story that stays emotionally honest",
    href: "https://timesofindia.indiatimes.com/entertainment/malayalam/movies/news/leftover-at-cannes-salim-ahamed-says-i-wanted-to-tell-this-story-in-a-way-that-remains-emotionally-honest/articleshow/131106399.cms",
  },
  {
    source: "The Indian Express",
    text: "Paradise wins Best Story & Special Jury at the 55th Kerala State Film Awards",
    href: "https://indianexpress.com/article/entertainment/malayalam/kerala-state-film-awards-2025-winners-full-list-of-55th-kerala-film-awards-malayalam-best-actor-actress-director-film-10343320/",
  },
  {
    source: "Hollywood Reporter India",
    text: "Pa Ranjith-backed 'Mayilaa' to premiere at International Film Festival Rotterdam 2026",
    href: "https://www.hollywoodreporterindia.com/features/insight/pa-ranjith-backed-mayilaa-to-premiere-at-international-film-festival-of-rotterdam-2026",
  },
  {
    source: "MUBI",
    text: "'Family' by Don Palathara is now streaming on MUBI",
    href: "https://mubi.com/en/in/films/family-2023",
  },
];

export default function App() {
  const [streamIndex, setStreamIndex] = useState(0);
  const videoRef = useRef(null);
  const projectsRef = useRef(null);
  const current = films[streamIndex % films.length];
  const newsLoop = useMemo(() => [...news, ...news], []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStreamIndex((index) => (index + 1) % films.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  function scrollProjects(amount) {
    projectsRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  function toggleMute() {
    if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
  }

  return (
    <main className="nc-page">
      <SiteHeader />

      <section className="nc-hero" aria-label="Featured reel">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="nc-hero-video"
          poster="https://cdn.prod.website-files.com/6656dece0ea89264ba78749f/690a3d9e77758866ffdfd301_StateAward_web_banner.jpg"
        >
          <source src="https://r2.vidzflow.com/v/kSuK3cZ0nk_576p_1738925138.mp4" type="video/mp4" />
          <source src="https://r2.vidzflow.com/v/CNAClxjocb_576p_1738925586.mp4" type="video/mp4" />
        </video>
        <div className="nc-hero-top-shade" />
        <div className="nc-hero-fade" />
        <button className="nc-mute" aria-label="Toggle sound" onClick={toggleMute}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="3,9 3,15 8,15 13,20 13,4 8,9" fill="currentColor" />
            <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="2" />
            <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <div className="nc-scroll">
          <span>SCROLL</span>
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="6,9 12,15 18,9" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
      </section>

      <section className="nc-projects" id="projects" aria-label="Projects">
        <div className="nc-projects-head">
          <h2>Projects</h2>
          <div>
            <button aria-label="Previous projects" onClick={() => scrollProjects(-260)}>
              ←
            </button>
            <button aria-label="Next projects" onClick={() => scrollProjects(260)}>
              →
            </button>
          </div>
        </div>
        <div className="nc-projrow" ref={projectsRef}>
          {projects.map((film) => (
            <a href={film.href} className="nc-card" aria-label={film.aria} key={film.name}>
              <div className="nc-thumb">
                <img src={film.image} alt="" />
                <span>{film.name}</span>
                <i aria-hidden="true">↗</i>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="nc-streaming" aria-label="Now streaming">
        <div className="nc-stream-inner">
          <div className="nc-stream-top" key={current.title}>
            <a href={current.href} target="_blank" rel="noopener" className="nc-current">
              <span>Now Streaming</span>
              <strong>
                {current.title} <em>↗</em>
              </strong>
            </a>
            <div className="nc-platforms-wrap">
              <span>Streaming now in</span>
              <div className="nc-platforms">
                {current.platforms.map((platform) => (
                  <a
                    href={platform.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Watch on ${platform.name}`}
                    title={platform.name}
                    key={`${current.title}-${platform.name}`}
                  >
                    <img src={platform.logo} alt={platform.name} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="nc-stream-controls">
            <div className="nc-stream-dots">
              {films.map((film, index) => (
                <button
                  key={film.title}
                  type="button"
                  aria-label={`Show ${film.title}`}
                  className={index === streamIndex ? "active" : ""}
                  onClick={() => setStreamIndex(index)}
                />
              ))}
            </div>
            <div>
              <button
                aria-label="Previous film"
                onClick={() => setStreamIndex((index) => (index - 1 + films.length) % films.length)}
              >
                ←
              </button>
              <button
                aria-label="Next film"
                onClick={() => setStreamIndex((index) => (index + 1) % films.length)}
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div className="nc-progress">
          <span />
        </div>
      </section>

      <section className="nc-news" id="news" aria-label="In the press">
        <span className="nc-news-label">In the Press</span>
        <div className="nc-news-window">
          <div className="nc-track">
            {newsLoop.map((item, index) => (
              <a href={item.href} target="_blank" rel="noopener" key={`${item.source}-${index}`}>
                <span>{item.source}</span>
                <b>{item.text}</b>
                <i aria-hidden="true">●</i>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="nc-mission" id="mission" aria-label="About Newton Cinema">
        <div className="nc-glow" />
        <div className="nc-quote" aria-hidden="true">
          &ldquo;
        </div>
        <div className="nc-mission-inner">
          <div className="nc-minihead">
            <span />
            <b>Our Mission</b>
            <span />
          </div>
          <p>
            Newton Cinema tells <strong>extraordinary stories</strong> that challenge social norms
            and inspire positive change. By amplifying the voices of the marginalized, Newton Cinema
            fosters <strong>inclusivity</strong>, upholds humanity, and strives for{" "}
            <strong>a more peaceful world</strong>. Committed to sustainability, Newton Cinema
            promotes social, environmental, and economic transformations.
          </p>
          <a href="/contact">Get in touch <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
