import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { SignupForm } from "../../components/forms/SignupForm";

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

            <SignupForm />
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
