import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function ForgotPasswordPage() {
  return (
    <main className="cc-bg cc-auth">
      <div className="cc-blob cc-blob--tl" />
      <div className="cc-blob cc-blob--br" />

      <div className="cc-container cc-auth__container">
        <Header />

        <section className="cc-auth__grid">
          <div className="cc-auth__card">
            <h1 className="cc-auth__title">Reset your password</h1>
            <p className="cc-auth__lead">
              Enter the email you use for CodeConnect and we’ll send a reset link.
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

              <button className="cc-btn cc-btn--solid cc-auth__submit" type="submit">
                Send reset link
              </button>
            </form>

            <p className="cc-auth__hint">
              Remembered it?{" "}
              <Link className="cc-auth__link" href="/login">
                Back to login
              </Link>
            </p>
          </div>

          <div className="cc-auth__card">
            <h2 className="cc-auth__title">Stay secure</h2>
            <p className="cc-auth__lead">
              Use a strong password and turn on two-factor authentication from Settings once you’re in.
            </p>
            <ul className="cc-footer__list">
              <li>Use at least 12 characters.</li>
              <li>Mix letters, numbers, and symbols.</li>
              <li>Never reuse passwords across sites.</li>
            </ul>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
