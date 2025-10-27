"use client";
import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="cc-header">
      <div className="cc-header__brand">
        <div className="cc-logo">∞</div>
        <span className="cc-brand">CodeConnect</span>
      </div>
      <nav className="cc-header__nav">
        <Link className="cc-btn cc-btn--ghost" href="/login">Log In</Link>
        <Link className="cc-btn cc-btn--solid" href="/signup">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header;
