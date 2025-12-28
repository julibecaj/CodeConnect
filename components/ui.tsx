"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: "default" | "muted";
};

export function Card({ title, action, children, tone = "default" }: CardProps) {
  return (
    <div className={`cc-cardv2 ${tone === "muted" ? "is-muted" : ""}`}>
      {(title || action) && (
        <div className="cc-cardv2__head">
          {title && <h3 className="cc-cardv2__title">{title}</h3>}
          {action && <div className="cc-cardv2__action">{action}</div>}
        </div>
      )}
      <div className="cc-cardv2__body">{children}</div>
    </div>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Section({ title, description, action, children }: SectionProps) {
  return (
    <section className="cc-section">
      <div className="cc-section__head">
        <div>
          <h2 className="cc-section__title">{title}</h2>
          {description && <p className="cc-section__desc">{description}</p>}
        </div>
        {action && <div className="cc-section__action">{action}</div>}
      </div>
      {children}
    </section>
  );
}

type Tab = { id: string; label: string; content: ReactNode };
type TabsProps = { tabs: Tab[]; initialId?: string };

export function Tabs({ tabs, initialId }: TabsProps) {
  const first = tabs[0]?.id;
  const initial = useMemo(() => initialId || first, [first, initialId]);
  const [active, setActive] = useState(initial);

  const current = tabs.find((tab) => tab.id === active) || tabs[0];
  if (!current) return null;

  return (
    <div className="cc-tabs">
      <div className="cc-tabs__list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`cc-tab ${tab.id === current.id ? "is-active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="cc-tabs__panel">{current.content}</div>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="cc-emptystate">
      <div>
        <h3 className="cc-emptystate__title">{title}</h3>
        {description && <p className="cc-emptystate__desc">{description}</p>}
      </div>
      {action && <div className="cc-emptystate__action">{action}</div>}
    </div>
  );
}

type AvatarProps = {
  name: string;
  size?: number;
};

export function Avatar({ name, size = 48 }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="cc-avatar" style={{ width: size, height: size, fontSize: size / 2.6 }}>
      {initials || "?"}
    </div>
  );
}
