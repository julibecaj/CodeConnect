"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "../../../components/AppShell";
import { Card, EmptyState, Section } from "../../../components/ui";

const feed = [
  {
    id: "post-1",
    type: "post",
    title: "Scaling a real-time presence API on the edge",
    author: "Jules Verne",
    time: "2h ago",
    tags: ["Edge", "Realtime", "Next.js"],
    excerpt: "How we debounced broadcasts and cut tail latency by 40ms at the edge.",
    likes: 186,
    comments: 42,
  },
  {
    id: "post-2",
    type: "post",
    title: "Building a VS Code-like editor in the browser",
    author: "Ada Lovelace",
    time: "6h ago",
    tags: ["DX", "Monaco", "TypeScript"],
    excerpt: "Snippets, diagnostics, and multiplayer cursors without tanking FPS.",
    likes: 142,
    comments: 33,
  },
  {
    id: "post-3",
    type: "project",
    title: "Collaborative whiteboard",
    author: "Lea Kim",
    time: "9h ago",
    tags: ["WebRTC", "Canvas", "Sync"],
    excerpt: "Low-latency ink sync with CRDTs and serverless signaling.",
    likes: 221,
    comments: 64,
  },
  {
    id: "post-4",
    type: "post",
    title: "Prompt-chaining patterns for AI coding assistants",
    author: "Lin Zhao",
    time: "1d ago",
    tags: ["AI", "LLM", "Patterns"],
    excerpt: "10 composable prompt chains with evals and safety rails.",
    likes: 199,
    comments: 51,
  },
];

const latestProjects = [
  { title: "Open Design Tokens", owner: "Devon", stack: "TS · Figma API", status: "Featured" },
  { title: "Serverless Q&A", owner: "Priya", stack: "Next.js · RAG", status: "New" },
  { title: "Collaborative whiteboard", owner: "Lea", stack: "React · WebRTC", status: "Updated" },
  { title: "CI Insights", owner: "Mo", stack: "Node · GitHub Apps", status: "Trending" },
];

const topCreators = [
  { name: "Alex Developer", stats: "12 posts · 6 projects" },
  { name: "Samira Ali", stats: "9 posts · 4 projects" },
  { name: "Kenji Tan", stats: "7 posts · 5 projects" },
];

export default function MainPage() {
  return (
    <AppShell
      title="Discover"
      subtitle="Explore what the community is shipping—projects, posts, discussions."
      action={
        <div className="cc-shell__actions">
          <Link className="cc-pillbtn" href="/User">Your profile</Link>
          <Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">Share a project</Link>
        </div>
      }
    >
      <AdvancedSearch />

      <Section title="Community feed" description="A mix of posts and projects from people you follow.">
        <div className="cc-feed">
          {feed.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              action={<span className="cc-tag"><span className="cc-dot" />{item.time}</span>}
            >
              <div className="cc-feed__meta">
                <span className="cc-feed__author">{item.author}</span>
                <span className="cc-tag">{item.type === "project" ? "Project" : "Post"}</span>
              </div>
              <p className="cc-section__desc">{item.excerpt}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {item.tags.map((tag) => (
                  <span key={tag} className="cc-tag">{tag}</span>
                ))}
              </div>
              <div className="cc-feed__actions">
                <Link className="cc-pillbtn" href="#">Open</Link>
                <Link className="cc-pillbtn" href="#">Discuss</Link>
                <div className="cc-feed__stats">
                  <span>❤️ {item.likes}</span>
                  <span>💬 {item.comments}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Latest projects" description="See what others are shipping right now.">
        <div className="cc-grid cc-grid--three">
          {latestProjects.map((proj) => (
            <Card
              key={proj.title}
              title={proj.title}
              action={<span className="cc-tag"><span className="cc-dot" />{proj.status}</span>}
            >
              <p className="cc-section__desc">{proj.stack}</p>
              <p className="cc-list__sub">by {proj.owner}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link className="cc-pillbtn" href="#">View</Link>
                <Link className="cc-pillbtn" href="#">Save</Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Top creators" description="Follow creators to tune your feed.">
        <Card>
          <ul className="cc-list">
            {topCreators.map((creator) => (
              <li key={creator.name} className="cc-list__item">
                <div className="cc-list__meta">
                  <span className="cc-list__title">{creator.name}</span>
                  <span className="cc-list__sub">{creator.stats}</span>
                </div>
                <Link className="cc-pillbtn" href="#">Follow</Link>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title="Discussions">
        <Card>
          <EmptyState
            title="No new threads"
            description="Start a question or join a thread to get feedback."
            action={<Link className="cc-pillbtn cc-pillbtn--primary" href="#">Start a discussion</Link>}
          />
        </Card>
      </Section>
    </AppShell>
  );
}

function AdvancedSearch() {
  const [open, setOpen] = useState(false);

  const filters = useMemo(
    () => ({
      tags: ["Web", "AI", "DX", "Systems", "Frontend"],
      sort: ["Latest", "Trending", "Most discussed"],
      type: ["Posts", "Projects", "All"],
    }),
    [],
  );

  return (
    <Section
      title="Advanced Search"
      description="Find posts and projects by topic, popularity, and recency."
      action={
        <button className="cc-pillbtn cc-pillbtn--primary" type="button" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide filters" : "Show filters"}
        </button>
      }
    >
      <div className={`cc-advsearch ${open ? "is-open" : ""}`}>
        <div className="cc-advsearch__row">
          <label>Type</label>
          <div className="cc-advsearch__chips">
            {filters.type.map((label) => (
              <button key={label} className="cc-pillbtn" type="button">{label}</button>
            ))}
          </div>
        </div>

        <div className="cc-advsearch__row">
          <label>Tags</label>
          <div className="cc-advsearch__chips">
            {filters.tags.map((label) => (
              <button key={label} className="cc-pillbtn" type="button">{label}</button>
            ))}
          </div>
        </div>

        <div className="cc-advsearch__row">
          <label>Sort</label>
          <div className="cc-advsearch__chips">
            {filters.sort.map((label) => (
              <button key={label} className="cc-pillbtn" type="button">{label}</button>
            ))}
          </div>
        </div>

        <div className="cc-advsearch__row">
          <label>Keywords</label>
          <input className="cc-input" placeholder="Search posts, projects, people" />
        </div>
      </div>
    </Section>
  );
}
