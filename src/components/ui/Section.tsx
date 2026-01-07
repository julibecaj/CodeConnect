"use client";

import type { ReactNode } from "react";

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
