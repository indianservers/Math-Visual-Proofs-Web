"use client";

import { useState, type ReactNode } from "react";

export type ProofDeskTab = {
  id: string;
  label: string;
  content: ReactNode;
};

/** Desktop: keep the canvas on screen and park extra explanation in tabs. */
export default function ProofDeskTabs({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  dock,
}: {
  tabs: ProofDeskTab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (id: string) => void;
  dock?: ReactNode;
}) {
  const first = tabs[0]?.id ?? "tab";
  const [internal, setInternal] = useState(defaultTab ?? first);
  const active = activeTab ?? internal;
  const current = tabs.some((tab) => tab.id === active) ? active : first;
  const select = (id: string) => {
    onTabChange?.(id);
    if (activeTab === undefined) setInternal(id);
  };

  return (
    <div className="proof-desk-tabs">
      <aside className="proof-desk-dock">
        {dock}
        <div className="proof-desk-tablist" role="tablist" aria-label="Proof views">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`proof-tab-${tab.id}`}
            aria-selected={current === tab.id}
            aria-controls={`proof-panel-${tab.id}`}
            className={current === tab.id ? "active" : undefined}
            onClick={() => select(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        </div>
      </aside>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`proof-panel-${tab.id}`}
          aria-labelledby={`proof-tab-${tab.id}`}
          hidden={current !== tab.id}
          className="proof-desk-panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
