"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  initialId?: string;
};

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
