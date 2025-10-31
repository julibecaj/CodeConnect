"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    // Outer gradient pill
    <div className="cc-nav">
      {/* Inner black bar */}
      <header className="cc-track">
        <div className="cc-header__brand">
          <div className="cc-logo">
            <Image
              src="/assets/cc_logo2.svg"
              alt="CodeConnect logo"
              width={44}
              height={44}
              priority
            />
          </div>
          <span className="cc-brand">CodeConnect</span>
        </div>

        <nav className="cc-header__nav">
          <Link className="cc-btn cc-btn--ghost" href="/login">Log In</Link>
          <Link className="cc-btn cc-btn--solid" href="/signup">Sign Up</Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
