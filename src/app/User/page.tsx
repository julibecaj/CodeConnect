"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "../../../components/AppShell";
import { Avatar, Card, EmptyState, Section, Tabs } from "../../../components/ui";

type UserProfile = {
  name: string;
  headline: string;
  bio: string;
  tags: string[];
  followers: number;
  posts: number;
  projects: number;
  links: { label: string; href: string }[];
  status: string;
  avatarUrl?: string;
};

type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  reads: string;
  likes: number;
  saves: number;
  tags: string[];
  cover?: string;
  isLiked?: boolean;
  isSaved?: boolean;
};

type Project = {
  id: string;
  title: string;
  stack: string;
  status: "Draft" | "Published" | "In review";
  likes: number;
  saves: number;
  tags: string[];
  cover?: string;
  isLiked?: boolean;
  isSaved?: boolean;
};

type FeedItem =
  | ({ kind: "post" } & Post)
  | ({ kind: "project" } & Project);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

const fallbackProfile: UserProfile = {
  name: "Alex Developer",
  headline: "Full-stack engineer | loves DX, docs, and community",
  bio: "Building CodeConnect to make sharing and learning as fast as shipping code. Ping me for collabs around developer tools, docs, or real-time systems.",
  tags: ["Open to collabs", "Web", "AI", "Systems"],
  followers: 248,
  posts: 12,
  projects: 6,
  status: "Available for collabs",
  links: [
    { label: "Portfolio", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  avatarUrl: "/assets/cc_logo2.svg",
};

const fallbackPosts: Post[] = [
  {
    id: "post-1",
    title: "Building a realtime presence API",
    excerpt: "A Spring Boot + WebSocket walkthrough to broadcast online status in milliseconds.",
    date: "Dec 20",
    reads: "1.2k reads",
    likes: 118,
    saves: 34,
    tags: ["Spring Boot", "WebSocket", "Realtime"],
    cover: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "post-2",
    title: "How I structure monorepos for speed",
    excerpt: "PNPM workspaces, Vite previews, and CI caches you can copy.",
    date: "Dec 14",
    reads: "980 reads",
    likes: 94,
    saves: 22,
    tags: ["Monorepo", "CI/CD", "DX"],
    cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
  },
];

const fallbackProjects: Project[] = [
  {
    id: "proj-1",
    title: "CodeConnect UI Kit",
    stack: "Next.js + TypeScript",
    status: "Published",
    likes: 76,
    saves: 19,
    tags: ["UI", "Design System"],
    cover: "https://images.unsplash.com/photo-1551033541-2075d8363c2d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "proj-2",
    title: "Docs automation",
    stack: "MDX + CI",
    status: "In review",
    likes: 32,
    saves: 12,
    tags: ["Automation", "Docs"],
    cover: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function User() {
  const [profile, setProfile] = useState<UserProfile>(fallbackProfile);
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [draftImage, setDraftImage] = useState<File | null>(null);
  const [draftAttachments, setDraftAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [userRes, postsRes, projectsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/me`),
          fetch(`${API_BASE}/posts?author=me`),
          fetch(`${API_BASE}/projects?owner=me`),
        ]);

        if (userRes.status === "fulfilled" && userRes.value.ok) {
          const data = await userRes.value.json();
          if (isMounted) setProfile((prev) => ({ ...prev, ...data }));
        }
        if (postsRes.status === "fulfilled" && postsRes.value.ok) {
          const data = await postsRes.value.json();
          if (isMounted) setPosts(data);
        }
        if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
          const data = await projectsRes.value.json();
          if (isMounted) setProjects(data);
        }
      } catch (err) {
        if (isMounted) setError("Could not refresh your data. Showing the latest available view.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "Followers / friends", value: profile.followers, desc: "People connected to you" },
      { label: "Posts", value: profile.posts ?? posts.length, desc: "Tutorials & updates" },
      { label: "Projects", value: profile.projects ?? projects.length, desc: "Shipped builds" },
    ],
    [profile.followers, profile.posts, profile.projects, posts.length, projects.length],
  );

  const savedPosts = useMemo(
    () => posts.filter((post) => post.isSaved || post.isLiked),
    [posts],
  );

  const feedItems: FeedItem[] = useMemo(() => {
    const postItems: FeedItem[] = posts.map((post) => ({ ...post, kind: "post" }));
    const projectItems: FeedItem[] = projects.map((proj) => ({ ...proj, kind: "project" }));
    return [...postItems, ...projectItems];
  }, [posts, projects]);

  const resetDraft = () => {
    setDraftTitle("");
    setDraftBody("");
    setDraftTags("");
    setDraftImage(null);
    setDraftAttachments([]);
  };

  const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftBody.trim() && !draftTitle.trim()) return;

    setSubmitting(true);
    const newPost: Post = {
      id: `temp-${Date.now()}`,
      title: draftTitle || "Untitled update",
      excerpt: draftBody,
      date: "Just now",
      reads: "Preview",
      likes: 0,
      saves: 0,
      tags: draftTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    setPosts((prev) => [newPost, ...prev]);
    resetDraft();

    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("body", draftBody);
      formData.append("tags", newPost.tags.join(","));
      if (draftImage) formData.append("image", draftImage);
      draftAttachments.forEach((file) => formData.append("attachments", file));

      await fetch(`${API_BASE}/posts`, { method: "POST", body: formData });
    } catch (err) {
      setError("Unable to publish right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = (id: string, type: "post" | "project") => {
    if (type === "post") {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.likes + (post.isLiked ? -1 : 1),
              }
            : post,
        ),
      );
    } else {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id
            ? {
                ...proj,
                isLiked: !proj.isLiked,
                likes: proj.likes + (proj.isLiked ? -1 : 1),
              }
            : proj,
        ),
      );
    }
    // TODO: call Spring Boot endpoints /posts/{id}/like or /projects/{id}/like
  };

  const toggleSave = (id: string, type: "post" | "project") => {
    if (type === "post") {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                isSaved: !post.isSaved,
                saves: post.saves + (post.isSaved ? -1 : 1),
              }
            : post,
        ),
      );
    } else {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id
            ? {
                ...proj,
                isSaved: !proj.isSaved,
                saves: proj.saves + (proj.isSaved ? -1 : 1),
              }
            : proj,
        ),
      );
    }
    // TODO: call Spring Boot endpoints /posts/{id}/save or /projects/{id}/save
  };

  const handleShare = async (title: string, url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShareMessage("Link copied. Ready to share on or off the platform.");
      setTimeout(() => setShareMessage(null), 3000);
    } catch (err) {
      setShareMessage("Unable to share right now. Try copying manually.");
    }
  };

  const renderPosts = () => {
    if (!posts.length) {
      return (
        <EmptyState
          title="No posts yet"
          description="Publish tutorials, updates, or code snippets. They will appear here."
          action={<button className="cc-pillbtn cc-pillbtn--primary" type="button">Start a post</button>}
        />
      );
    }

    return (
      <ul className="cc-list">
        {posts.map((post) => (
          <li key={post.id} className="cc-list__item cc-list__item--stack">
            <div className="cc-list__meta">
              <span className="cc-list__title">{post.title}</span>
              <span className="cc-list__sub">{post.date} · {post.reads}</span>
              <p className="cc-section__desc">{post.excerpt}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="cc-tag">
                    <span className="cc-dot" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="cc-pillbtn cc-pillbtn--ghost"
                type="button"
                onClick={() => toggleLike(post.id, "post")}
              >
                {post.isLiked ? "Liked" : "Like"} · {post.likes}
              </button>
              <button
                className="cc-pillbtn cc-pillbtn--ghost"
                type="button"
                onClick={() => toggleSave(post.id, "post")}
              >
                {post.isSaved ? "Saved" : "Save"} · {post.saves}
              </button>
              <button
                className="cc-pillbtn"
                type="button"
                onClick={() => handleShare(post.title, `/posts/${post.id}`)}
              >
                Share
              </button>
              <Link className="cc-auth__link" href={`/posts/${post.id}`}>View</Link>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderProjects = () => {
    if (!projects.length) {
      return (
        <EmptyState
          title="No projects yet"
          description="Showcase shipped builds or in-progress ideas with repos and screenshots."
          action={<Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">Start a project</Link>}
        />
      );
    }

    return (
      <ul className="cc-list">
        {projects.map((proj) => (
          <li key={proj.id} className="cc-list__item cc-list__item--stack">
            <div className="cc-list__meta">
              <span className="cc-list__title">{proj.title}</span>
              <span className="cc-list__sub">{proj.stack}</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="cc-tag">
                  <span className="cc-dot" />
                  {proj.status}
                </span>
                {proj.tags.map((tag) => (
                  <span key={tag} className="cc-tag">
                    <span className="cc-dot" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="cc-pillbtn cc-pillbtn--ghost"
                type="button"
                onClick={() => toggleLike(proj.id, "project")}
              >
                {proj.isLiked ? "Liked" : "Like"} · {proj.likes}
              </button>
              <button
                className="cc-pillbtn cc-pillbtn--ghost"
                type="button"
                onClick={() => toggleSave(proj.id, "project")}
              >
                {proj.isSaved ? "Saved" : "Save"} · {proj.saves}
              </button>
              <button
                className="cc-pillbtn"
                type="button"
                onClick={() => handleShare(proj.title, `/projects/${proj.id}`)}
              >
                Share
              </button>
              <Link className="cc-auth__link" href={`/projects/${proj.id}`}>Open</Link>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderSaved = () => {
    if (!savedPosts.length) {
      return (
        <EmptyState
          title="Nothing saved yet"
          description="Save or like posts to collect them here."
          action={<button className="cc-pillbtn cc-pillbtn--primary" type="button">Browse posts</button>}
        />
      );
    }

    return (
      <ul className="cc-list">
        {savedPosts.map((post) => (
          <li key={post.id} className="cc-list__item cc-list__item--stack">
            <div className="cc-list__meta">
              <span className="cc-list__title">{post.title}</span>
              <span className="cc-list__sub">{post.date} · {post.reads}</span>
              <p className="cc-section__desc">{post.excerpt}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="cc-pillbtn cc-pillbtn--ghost"
                type="button"
                onClick={() => toggleSave(post.id, "post")}
              >
                {post.isSaved ? "Saved" : "Save"} · {post.saves}
              </button>
              <Link className="cc-auth__link" href={`/posts/${post.id}`}>Open</Link>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderFeed = () => {
    if (!feedItems.length) {
      return (
        <EmptyState
          title="Your feed is quiet"
          description="Publish a post or project to start the conversation."
          action={<button className="cc-pillbtn cc-pillbtn--primary" type="button">Create a post</button>}
        />
      );
    }

    return (
      <div className="cc-grid cc-grid--two">
        {feedItems.map((item) => (
          <Card
            key={`${item.kind}-${item.id}`}
            title={item.title}
            action={
              item.kind === "project" ? (
                <span className="cc-tag">
                  <span className="cc-dot" />
                  {item.status}
                </span>
              ) : null
            }
          >
            {item.cover && (
              <div className="cc-cover">
                <img src={item.cover} alt={item.title} style={{ width: "100%", borderRadius: 12 }} />
              </div>
            )}
            <p className="cc-section__desc">
              {item.kind === "post" ? item.excerpt : item.stack}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {item.tags.map((tag) => (
                <span key={tag} className="cc-tag">
                  <span className="cc-dot" />
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="cc-pillbtn cc-pillbtn--ghost"
                type="button"
                onClick={() => toggleLike(item.id, item.kind)}
              >
                {item.isLiked ? "Liked" : "Like"} · {item.likes}
              </button>
              <button
                className="cc-pillbtn cc-pillbtn--ghost"
                type="button"
                onClick={() => toggleSave(item.id, item.kind)}
              >
                {item.isSaved ? "Saved" : "Save"} · {item.saves}
              </button>
              <button
                className="cc-pillbtn"
                type="button"
                onClick={() => handleShare(item.title, `/${item.kind === "post" ? "posts" : "projects"}/${item.id}`)}
              >
                Share
              </button>
              <Link className="cc-auth__link" href={`/${item.kind === "post" ? "posts" : "projects"}/${item.id}`}>
                Open
              </Link>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppShell
      title="Your profile"
      subtitle="Show what you build, share what you learn, and invite collaborators."
      action={
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="cc-pillbtn" href="/Settings">Settings</Link>
          <Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">New project</Link>
        </div>
      }
    >
      <Card>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar name={profile.name} size={72} src={profile.avatarUrl} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2 className="cc-section__title" style={{ fontSize: 22 }}>
              {profile.name}
            </h2>
            <p className="cc-section__desc">{profile.headline}</p>
            <p className="cc-section__desc" style={{ maxWidth: 640 }}>{profile.bio}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {profile.tags.map((tag) => (
                <span key={tag} className="cc-tag">
                  <span className="cc-dot" />
                  {tag}
                </span>
              ))}
            </div>
            <span className="cc-tag cc-tag--muted">
              <span className="cc-dot" />
              {profile.status}
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="cc-pillbtn" href="/Settings">Edit profile</Link>
              <Link className="cc-pillbtn" href="/Projects">Add project</Link>
            </div>
          </div>
        </div>
      </Card>

      <Section title="Profile overview">
        <div className="cc-grid cc-grid--three">
          {stats.map((stat) => (
            <Card key={stat.label} title={stat.label} tone="muted">
              <strong>{stat.value}</strong> {stat.desc}
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Share something new">
        <Card>
          <form className="cc-formgrid" onSubmit={handlePublish}>
            <div className="cc-field">
              <label htmlFor="title">Title</label>
              <input
                className="cc-input"
                id="title"
                name="title"
                placeholder="What are you shipping today?"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
              />
            </div>
            <div className="cc-field">
              <label htmlFor="body">Update</label>
              <textarea
                className="cc-input"
                id="body"
                name="body"
                placeholder="Share a post, tutorial, or project update..."
                rows={4}
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
              />
            </div>
            <div className="cc-field">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                className="cc-input"
                id="tags"
                name="tags"
                placeholder="Spring Boot, Realtime, Next.js"
                value={draftTags}
                onChange={(e) => setDraftTags(e.target.value)}
              />
            </div>
            <div className="cc-field">
              <label htmlFor="image">Add an image</label>
              <input
                className="cc-input"
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => setDraftImage(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="cc-field">
              <label htmlFor="attachments">Attach files</label>
              <input
                className="cc-input"
                id="attachments"
                name="attachments"
                type="file"
                multiple
                accept="image/*,.pdf,.zip,.doc,.docx,.txt"
                onChange={(e) => setDraftAttachments(Array.from(e.target.files ?? []))}
              />
              {draftAttachments.length > 0 && (
                <p className="cc-section__desc">
                  {draftAttachments.length} file(s) selected:{" "}
                  {draftAttachments.map((file) => file.name).join(", ")}
                </p>
              )}
              <p className="cc-section__desc">Images and files are sent to your backend for storage and sharing.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button className="cc-pillbtn cc-pillbtn--primary" type="submit" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish"}
              </button>
              <button className="cc-pillbtn" type="button" onClick={resetDraft}>Save draft</button>
              {shareMessage && <span className="cc-section__desc">{shareMessage}</span>}
              {error && <span className="cc-section__desc" style={{ color: "var(--cc-text-strong)" }}>{error}</span>}
            </div>
          </form>
        </Card>
      </Section>

      <Section title="Feed">
        {renderFeed()}
      </Section>

      <Section title="Content">
        <Tabs
          tabs={[
            {
              id: "posts",
              label: "Posts",
              content: <Card>{renderPosts()}</Card>,
            },
            {
              id: "projects",
              label: "Projects",
              content: <Card>{renderProjects()}</Card>,
            },
            {
              id: "saved",
              label: "Saved",
              content: <Card>{renderSaved()}</Card>,
            },
            {
              id: "about",
              label: "About",
              content: (
                <Card>
                  <p className="cc-section__desc">{profile.bio}</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {profile.links.map((link) => (
                      <Link key={link.label} className="cc-pillbtn" href={link.href}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Activity">
        <Card>
          {loading ? (
            <p className="cc-section__desc">Loading your recent activity...</p>
          ) : (
            <EmptyState
              title="No recent activity"
              description="When you publish posts or projects, they will show up here."
              action={<Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">Start a project</Link>}
            />
          )}
        </Card>
      </Section>
    </AppShell>
  );
}
