import { useState } from "react";
import { SiteHeader, SiteFooter } from "./shared.jsx";
import { articles } from "./newsData.js";

const PAGE_SIZE = 10;

export default function NewsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a !== featured);
  const shown = rest.slice(0, visibleCount);

  return (
    <main className="nc-page">
      <SiteHeader />

      <section className="ncp-hero ncn-hero" aria-label="News introduction">
        <div className="nc-minihead">
          <span />
          <b>In the Press</b>
          <span />
        </div>
        <h1>News</h1>
        <p>
          {articles.length}+ stories about our films — festival premieres, awards, reviews and
          interviews from Deadline to The Hindu.
        </p>
      </section>

      <section className="ncn-list" aria-label="News articles">
        {featured && (
          <a href={featured.href} target="_blank" rel="noopener" className="ncn-featured">
            <div className="ncn-featured-media">
              <img src={featured.image} alt="" loading="eager" />
            </div>
            <div className="ncn-featured-body">
              <span className="ncn-flag">Latest</span>
              <div className="ncn-meta">
                <b>{featured.source}</b>
                <i aria-hidden="true">•</i>
                <time>{featured.date}</time>
              </div>
              <h2>{featured.headline}</h2>
              <span className="ncn-read">
                Read the story <em aria-hidden="true">↗</em>
              </span>
            </div>
          </a>
        )}

        <div className="ncn-rows">
          {shown.map((article) => (
            <a
              href={article.href}
              target="_blank"
              rel="noopener"
              className="ncn-row"
              key={article.href}
            >
              <div className="ncn-row-body">
                <div className="ncn-meta">
                  <b>{article.source}</b>
                  <i aria-hidden="true">•</i>
                  <time>{article.date}</time>
                </div>
                <h3>{article.headline}</h3>
              </div>
              <div className="ncn-thumb">
                <img src={article.image} alt="" loading="lazy" />
              </div>
              <i className="ncn-arrow" aria-hidden="true">
                ↗
              </i>
            </a>
          ))}
        </div>

        {rest.length > visibleCount && (
          <button
            type="button"
            className="ncn-more"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load more stories ({rest.length - visibleCount} remaining)
          </button>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
