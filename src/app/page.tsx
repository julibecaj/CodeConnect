import Image from "next/image";
import styles from "./page.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Home() {
  return (
     <main className="cc-bg">
      {/* soft blobs */}
      <div className="cc-blob cc-blob--tl" />
      <div className="cc-blob cc-blob--br" />

      <div className="cc-container">
        <Header />

        {/* Hero */}
        <section className="cc-hero">
          <div className="cc-hero__bubbles">
            <span className="cc-bubble">Share</span>
            <span className="cc-bubble">Explore</span>
            <span className="cc-bubble">Empower</span>
          </div>

          <div className="share-bubble">
            <span className="share-bubble__text">Share</span>
          </div>

          <div className="cc-hero__center">
            <h1 className="cc-hero__title">CodeConnect</h1>
            <p className="cc-hero__tag">Build by Coders, for Coders.</p>
          </div>

          <div className="cc-hero__bubbles cc-hero__bubbles--right">
            <span className="cc-bubble">Code</span>
            <span className="cc-bubble">Learn</span>
          </div>
        </section>

        {/* Offer */}
        <h3 className="cc-section-title">What we offer to you?</h3>

        <section className="cc-cards">
          <article className="cc-card">
            <h4 className="cc-card__title">A platform to connect</h4>
            <p className="cc-card__desc">
              Connect with other developers from every part of the world.
              Ask questions, share knowledge, and collaborate on projects.
            </p>
          </article>

          <article className="cc-card">
            <h4 className="cc-card__title">Share & learn by doing</h4>
            <p className="cc-card__desc">
              Post your projects and tutorials, learn from others, and try code
              in our built-in editor supporting multiple languages.
            </p>
          </article>

          <article className="cc-card">
            <h4 className="cc-card__title">Discover the best resources</h4>
            <p className="cc-card__desc">
              Our smart search surfaces community posts and trusted sources like
              w3schools, GeeksforGeeks, and Stack Overflow.
            </p>
          </article>
        </section>

        {/* Illustrations */}
        <section className="cc-illustrations">
          <div className="cc-ill">
            <img
              alt="Community mobile illustrations"
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop"
            />
          </div>
          <div className="cc-ill">
            <img
              alt="Code editor"
              src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
            />
          </div>
          <div className="cc-ill">
            <img
              alt="Learning and sharing"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
            />
          </div>
        </section>

        {/* Partners */}
        <section className="cc-partners">
          <div className="cc-partner">w3schools</div>
          <div className="cc-partner">GeeksforGeeks</div>
          <div className="cc-partner">Stack Overflow</div>
          <div className="cc-partner">GitHub</div>
        </section>

        {/* CTA */}
        <section className="cc-cta">
          <p className="cc-cta__lead">So, do you want to take part on the ride?</p>
          <a className="cc-btn cc-btn--cta" href="/signup">
            Sign Up Now
            <svg className="cc-icon" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p className="cc-cta__sub">Be part of the most incredible community!</p>
        </section>
      </div>

      <Footer />
    </main>
  );
}
