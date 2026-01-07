"use client";

import type { ReactNode } from "react";

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
