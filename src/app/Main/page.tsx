"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import { Button, Card, EmptyState, Section, Spinner } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import type { Post } from "@/lib/types";

export default function MainPage() {
  const { addToast } = useToast();
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPosts();
        const items = Array.isArray(data) ? data : data.items || [];
        if (active) setFeed(items);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load feed.";
        setError(message);
        addToast({ type: "error", message });
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [addToast]);

  const filteredFeed = useMemo(() => feed, [feed]);

  const toggleLike = async (id: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.likes + (item.isLiked ? -1 : 1),
            }
          : item,
      ),
    );
    try {
      await api.likePost(id);
    } catch {
      setFeed((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isLiked: !item.isLiked,
                likes: item.likes + (item.isLiked ? -1 : 1),
              }
            : item,
        ),
      );
      addToast({ type: "error", message: "Could not update like. Try again." });
    }
  };

  const toggleSave = async (id: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isSaved: !item.isSaved,
              saves: item.saves + (item.isSaved ? -1 : 1),
            }
          : item,
      ),
    );
    try {
      await api.savePost(id);
    } catch {
      setFeed((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isSaved: !item.isSaved,
                saves: item.saves + (item.isSaved ? -1 : 1),
              }
            : item,
        ),
      );
      addToast({ type: "error", message: "Could not update save. Try again." });
    }
  };

  const renderFeed = () => {
    if (loading) {
      return (
        <div style={{ display: "grid", placeItems: "center", minHeight: 180 }}>
          <Spinner size={28} />
          <p className="cc-formhint">Loading the latest posts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <EmptyState
          title="Feed unavailable"
          description={error}
          action={
            <Button onClick={() => window.location.reload()}>Retry</Button>
          }
        />
      );
    }

    if (!filteredFeed.length) {
      return (
        <EmptyState
          title="No posts yet"
          description="When content is published, it will appear here."
          action={
            <Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">
              Share a project
            </Link>
          }
        />
      );
    }

    return (
      <div className="cc-feed">
        {filteredFeed.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            action={
              <span className="cc-tag">
                <span className="cc-dot" />
                {item.createdAt ?? "Just now"}
              </span>
            }
          >
            <div className="cc-feed__meta">
              <span className="cc-feed__author">
                {item.author?.name ?? "Unknown"}
              </span>
              <span className="cc-tag">Post</span>
            </div>
            <p className="cc-section__desc">{item.excerpt || item.content}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {item.tags.map((tag) => (
                <span key={tag} className="cc-tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="cc-feed__actions">
              <Link className="cc-pillbtn" href={`/posts/${item.id}`}>
                Open
              </Link>
              <div
                className="cc-feed__stats"
                style={{ display: "flex", gap: 8 }}
              >
                <Button variant="ghost" onClick={() => toggleLike(item.id)}>
                  {item.isLiked ? "Liked" : "Like"} • {item.likes}
                </Button>
                <Button variant="ghost" onClick={() => toggleSave(item.id)}>
                  {item.isSaved ? "Saved" : "Save"} • {item.saves}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AuthGuard>
      <AppShell
        title="Discover"
        subtitle="Explore what the community is shipping—projects and posts."
        action={
          <div className="cc-shell__actions">
            <Link className="cc-pillbtn" href="/User">
              Your profile
            </Link>
            <Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">
              Share a project
            </Link>
          </div>
        }
      >
        <AdvancedSearch />

        <Section
          title="Community feed"
          description="A mix of posts and projects from people you follow."
        >
          {renderFeed()}
        </Section>
      </AppShell>
    </AuthGuard>
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
        <button
          className="cc-pillbtn cc-pillbtn--primary"
          type="button"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide filters" : "Show filters"}
        </button>
      }
    >
      <div className={`cc-advsearch ${open ? "is-open" : ""}`}>
        <div className="cc-advsearch__row">
          <label>Type</label>
          <div className="cc-advsearch__chips">
            {filters.type.map((label) => (
              <button key={label} className="cc-pillbtn" type="button">
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="cc-advsearch__row">
          <label>Tags</label>
          <div className="cc-advsearch__chips">
            {filters.tags.map((label) => (
              <button key={label} className="cc-pillbtn" type="button">
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="cc-advsearch__row">
          <label>Sort</label>
          <div className="cc-advsearch__chips">
            {filters.sort.map((label) => (
              <button key={label} className="cc-pillbtn" type="button">
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="cc-advsearch__row">
          <label>Keywords</label>
          <input
            className="cc-input"
            placeholder="Search posts, projects, people"
          />
        </div>
      </div>
    </Section>
  );
}
