"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

type AppShellProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

const navItems = [
  { href: "/Main", label: "Dashboard", match: "/Main" },
  { href: "/Projects", label: "Projects", match: "/Projects" },
  { href: "/User", label: "Profile", match: "/User" },
];

export default function AppShell({ title, subtitle, action, children }: AppShellProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const filters = useMemo(
    () => ({
      tags: ["Web", "AI", "DX", "Systems", "Frontend"],
      sort: ["Latest", "Trending", "Most discussed"],
      type: ["Posts", "Projects", "All"],
    }),
    [],
  );

  return (
    <div className="cc-shell">
      <header className="cc-shell__topbar" style={{ position: "sticky", top: 0, zIndex: 30 }}>
        <div className="cc-shell__brand" role="banner">
          <div className="cc-shell__logo cc-shell__logo--badge">
            <Image src="/assets/cc_logo2.svg" width={32} height={32} alt="CC monogram" />
          </div>
          <div className="cc-shell__brand-text">
            <Image src="/assets/codeconnect_logo.svg" width={142} height={32} alt="CodeConnect" priority />
            <small>Creator Console</small>
          </div>
        </div>

        <nav className="cc-shell__nav cc-shell__nav--top">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.match !== "/" && pathname?.startsWith(item.match));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`cc-shell__link cc-shell__link--top ${isActive ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="cc-shell__top-actions">
          <button
            className="cc-pillbtn cc-pillbtn--ghost"
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
          >
            Advanced Search
          </button>
          <button
            className="cc-pillbtn"
            type="button"
            onClick={async () => {
              try {
                await logout();
              } catch (err) {
                addToast({ type: "error", message: "Logout failed. Please try again." });
              }
            }}
          >
            Logout
          </button>
          <div className="cc-shell__footer cc-shell__footer--top">
            <span className="cc-shell__badge">Beta</span>
            <p>Ship tutorials, projects, and resources with the community.</p>
          </div>
        </div>

        <div className={`cc-advnav ${searchOpen ? "is-open" : ""}`}>
          <div className="cc-advnav__row">
            <input
              className="cc-input cc-advnav__input"
              placeholder="Search posts, projects, people"
              aria-label="Advanced search"
            />
            <button className="cc-pillbtn cc-pillbtn--primary" type="button">Search</button>
          </div>
          <div className="cc-advnav__filters">
            <div className="cc-advnav__group">
              <span>Type</span>
              <div className="cc-advnav__chips">
                {filters.type.map((label) => (
                  <button key={label} className="cc-pillbtn" type="button">{label}</button>
                ))}
              </div>
            </div>
            <div className="cc-advnav__group">
              <span>Tags</span>
              <div className="cc-advnav__chips">
                {filters.tags.map((label) => (
                  <button key={label} className="cc-pillbtn" type="button">{label}</button>
                ))}
              </div>
            </div>
            <div className="cc-advnav__group">
              <span>Sort</span>
              <div className="cc-advnav__chips">
                {filters.sort.map((label) => (
                  <button key={label} className="cc-pillbtn" type="button">{label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="cc-shell__main">
        <header className="cc-shell__header">
          <div>
            <p className="cc-shell__eyebrow">Signed in</p>
            <h1 className="cc-shell__title">{title}</h1>
            {subtitle && <p className="cc-shell__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="cc-shell__actions">{action}</div>}
        </header>

        <div className="cc-shell__content">{children}</div>
      </div>
    </div>
  );
}
