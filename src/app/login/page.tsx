import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Log In | CodeConnect",
  description: "Access your CodeConnect account to share, learn, and connect.",
};

export default function LoginPage() {
  return (
    <main className="cc-bg cc-auth">
      <div className="cc-blob cc-blob--tl" />
      <div className="cc-blob cc-blob--br" />

      <div className="cc-container cc-auth__container">
        <Header />

        <section className="cc-auth__grid">
          <div className="cc-auth__card">
            <h1 className="cc-auth__title">Welcome back</h1>
            <p className="cc-auth__lead">
              Log in to pick up where you left off, collaborate with peers, and keep shipping.
            </p>

            <form>
              <div className="cc-field">
                <label htmlFor="email">Email</label>
                <input
                  className="cc-input"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="cc-field">
                <label htmlFor="password">Password</label>
                <input
                  className="cc-input"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="cc-auth__actions">
                <label>
                  <input type="checkbox" name="remember" /> Remember me
                </label>
                <Link className="cc-auth__link" href="#reset">
                  Forgot password?
                </Link>
              </div>

              <button className="cc-btn cc-btn--solid cc-auth__submit" type="submit">
                Log In
              </button>
            </form>

            <p className="cc-auth__hint">
              New to CodeConnect?{" "}
              <Link className="cc-auth__link" href="/signup">
                Create an account
              </Link>
            </p>
          </div>

          <div className="cc-auth__card">
            <h2 className="cc-auth__title">Why log in?</h2>
            <p className="cc-auth__lead">
              Save your tutorials, publish projects, and get tailored recommendations from the community.
            </p>
            <ul className="cc-footer__list">
              <li>• Ask questions and get quick answers.</li>
              <li>• Share code with built-in sandboxes.</li>
              <li>• Follow creators who inspire you.</li>
              <li>• Earn credibility through contributions.</li>
            </ul>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
