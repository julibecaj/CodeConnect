import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Sign Up | CodeConnect",
  description: "Create your CodeConnect account to share projects, tutorials, and questions.",
};

export default function SignUpPage() {
  return (
    <main className="cc-bg cc-auth">
      <div className="cc-blob cc-blob--tl" />
      <div className="cc-blob cc-blob--br" />

      <div className="cc-container cc-auth__container">
        <Header />

        <section className="cc-auth__grid">
          <div className="cc-auth__card">
            <h1 className="cc-auth__title">Create your account</h1>
            <p className="cc-auth__lead">
              Join the community of builders. Publish tutorials, ask questions, bookmark the best resources, and find collaborators.
            </p>

            <form>
              <div className="cc-field">
                <label htmlFor="name">Full name</label>
                <input
                  className="cc-input"
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                />
              </div>

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
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="cc-field">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  className="cc-input"
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="cc-auth__actions">
                <label>
                  <input type="checkbox" name="terms" required /> I agree to the Terms and Privacy.
                </label>
                <Link className="cc-auth__link" href="#community">
                  Community guidelines
                </Link>
              </div>

              <button className="cc-btn cc-btn--solid cc-auth__submit" type="submit">
                Sign Up
              </button>
            </form>

            <p className="cc-auth__hint">
              Already have an account?{" "}
              <Link className="cc-auth__link" href="/login">
                Log in instead
              </Link>
            </p>
          </div>

          <div className="cc-auth__card">
            <h2 className="cc-auth__title">Build faster with CodeConnect</h2>
            <p className="cc-auth__lead">
              A focused space for developers to connect, learn, and launch.
            </p>
            <ul className="cc-footer__list">
              <li>• Curated resources from trusted sources.</li>
              <li>• Multi-language sandboxes for sharing runnable code.</li>
              <li>• Project-based learning with community feedback.</li>
              <li>• Follow topics you care about and stay inspired.</li>
            </ul>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
