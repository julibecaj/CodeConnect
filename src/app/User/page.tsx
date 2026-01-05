"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "../../../components/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Avatar, Card, EmptyState, Section, Tabs } from "../../../components/ui";
import { CreatePostForm, PostFormValues } from "../../components/forms/CreatePostForm";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { api } from "../../lib/api";
import type { Post, Project, User } from "../../lib/types";

type ProjectDraft = {
  title: string;
  stack?: string;
  status?: string;
  tags?: string;
};

export default function UserPage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<User | null>(user ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>({ title: "", status: "Draft" });
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleRefreshProfile = async () => {
    const updated = await refreshUser();
    if (updated) setProfile(updated);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [me, postRes, projectRes] = await Promise.all([
          api.me(),
          api.getPosts({ author: "me" }),
          api.getProjects({ owner: "me" }),
        ]);
        const postsData = Array.isArray(postRes) ? postRes : postRes.items || [];
        const projectData = Array.isArray(projectRes) ? projectRes : projectRes.items || [];
        if (active) {
          setProfile(me);
          setPosts(postsData);
          setProjects(projectData);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not refresh your data.";
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

  const stats = useMemo(
    () => [
      { label: "Followers / friends", value: profile?.followers ?? 0, desc: "People connected to you" },
      { label: "Posts", value: posts.length, desc: "Tutorials & updates" },
      { label: "Projects", value: projects.length, desc: "Shipped builds" },
    ],
    [profile?.followers, posts.length, projects.length],
  );

  const savedPosts = useMemo(() => posts.filter((post) => post.isSaved || post.isLiked), [posts]);
  const feedItems = useMemo(() => {
    const postItems = posts.map((post) => ({ kind: "post" as const, ...post }));
    const projectItems = projects.map((proj) => ({ kind: "project" as const, ...proj }));
    return [...postItems, ...projectItems];
  }, [posts, projects]);

  const handleCreatePost = async (values: PostFormValues) => {
    setSubmitting(true);
    try {
      const created = await api.createPost({
        title: values.title,
        content: values.content,
        tags: values.tags,
      });
      setPosts((prev) => [created, ...prev]);
      addToast({ type: "success", message: "Post published." });
      setPostModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to publish.";
      addToast({ type: "error", message });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePost = async (values: PostFormValues) => {
    if (!editingPost) return;
    setSubmitting(true);
    try {
      const updated = await api.updatePost(editingPost.id, { title: values.title, content: values.content, tags: values.tags });
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      addToast({ type: "success", message: "Post updated." });
      setEditingPost(null);
      setPostModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update.";
      addToast({ type: "error", message });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    setSubmitting(true);
    try {
      await api.deletePost(deletePostId);
      setPosts((prev) => prev.filter((p) => p.id !== deletePostId));
      addToast({ type: "success", message: "Post deleted." });
      setDeletePostId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete post.";
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectSave = async () => {
    if (!projectDraft.title.trim()) {
      addToast({ type: "error", message: "Title is required" });
      return;
    }
    setSubmitting(true);
    const payload = {
      title: projectDraft.title.trim(),
      stack: projectDraft.stack,
      status: projectDraft.status,
      tags: projectDraft.tags?.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingProject) {
        const updated = await api.updateProject(editingProject.id, payload);
        setProjects((prev) => prev.map((proj) => (proj.id === updated.id ? updated : proj)));
        addToast({ type: "success", message: "Project updated." });
      } else {
        const created = await api.createProject(payload);
        setProjects((prev) => [created, ...prev]);
        addToast({ type: "success", message: "Project created." });
      }
      setProjectModalOpen(false);
      setEditingProject(null);
      setProjectDraft({ title: "", status: "Draft" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save project.";
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    setSubmitting(true);
    try {
      await api.deleteProject(deleteProjectId);
      setProjects((prev) => prev.filter((proj) => proj.id !== deleteProjectId));
      addToast({ type: "success", message: "Project deleted." });
      setDeleteProjectId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete project.";
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePostLike = async (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) } : post,
      ),
    );
    try {
      await api.likePost(id);
    } catch {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) } : post,
        ),
      );
      addToast({ type: "error", message: "Could not update like." });
    }
  };

  const togglePostSave = async (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isSaved: !post.isSaved, saves: post.saves + (post.isSaved ? -1 : 1) } : post,
      ),
    );
    try {
      await api.savePost(id);
    } catch {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, isSaved: !post.isSaved, saves: post.saves + (post.isSaved ? -1 : 1) } : post,
        ),
      );
      addToast({ type: "error", message: "Could not update save." });
    }
  };

  const toggleProjectLike = async (id: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, isLiked: !proj.isLiked, likes: proj.likes + (proj.isLiked ? -1 : 1) } : proj,
      ),
    );
    try {
      await api.likeProject(id);
    } catch {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id ? { ...proj, isLiked: !proj.isLiked, likes: proj.likes + (proj.isLiked ? -1 : 1) } : proj,
        ),
      );
      addToast({ type: "error", message: "Could not update like." });
    }
  };

  const toggleProjectSave = async (id: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, isSaved: !proj.isSaved, saves: proj.saves + (proj.isSaved ? -1 : 1) } : proj,
      ),
    );
    try {
      await api.saveProject(id);
    } catch {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id ? { ...proj, isSaved: !proj.isSaved, saves: proj.saves + (proj.isSaved ? -1 : 1) } : proj,
        ),
      );
      addToast({ type: "error", message: "Could not update save." });
    }
  };

  const profileLinks = profile?.links || [];

  const renderPosts = () => {
    if (!posts.length) {
      return (
        <EmptyState
          title="No posts yet"
          description="Publish tutorials, updates, or code snippets. They will appear here."
          action={<Button variant="primary" onClick={() => { setPostModalOpen(true); setEditingPost(null); }}>Start a post</Button>}
        />
      );
    }

    return (
      <ul className="cc-list">
        {posts.map((post) => (
          <li key={post.id} className="cc-list__item cc-list__item--stack">
            <div className="cc-list__meta">
              <span className="cc-list__title">{post.title}</span>
              <span className="cc-list__sub">{post.createdAt || ""}</span>
              <p className="cc-section__desc">{post.excerpt || post.content}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button variant="ghost" onClick={() => togglePostLike(post.id)}>
                {post.isLiked ? "Liked" : "Like"} • {post.likes}
              </Button>
              <Button variant="ghost" onClick={() => togglePostSave(post.id)}>
                {post.isSaved ? "Saved" : "Save"} • {post.saves}
              </Button>
              <Button variant="ghost" onClick={() => { setEditingPost(post); setPostModalOpen(true); }}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setDeletePostId(post.id)}>
                Delete
              </Button>
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
          action={<Button variant="primary" onClick={() => { setProjectModalOpen(true); setEditingProject(null); }}>Start a project</Button>}
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
                <Badge>{proj.status}</Badge>
                {(proj.tags || []).map((tag) => (
                  <Badge key={tag} tone="muted">{tag}</Badge>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button variant="ghost" onClick={() => toggleProjectLike(proj.id)}>
                {proj.isLiked ? "Liked" : "Like"} • {proj.likes}
              </Button>
              <Button variant="ghost" onClick={() => toggleProjectSave(proj.id)}>
                {proj.isSaved ? "Saved" : "Save"} • {proj.saves}
              </Button>
              <Button variant="ghost" onClick={() => { setEditingProject(proj); setProjectDraft({ title: proj.title, stack: proj.stack, status: proj.status, tags: (proj.tags || []).join(", ") }); setProjectModalOpen(true); }}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setDeleteProjectId(proj.id)}>
                Delete
              </Button>
              <Link className="cc-auth__link" href={`/projects/${proj.id}`}>Open</Link>
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
          action={<Button variant="primary" onClick={() => setPostModalOpen(true)}>Create a post</Button>}
        />
      );
    }

    return (
      <div className="cc-grid cc-grid--two">
        {feedItems.map((item) => (
          <Card
            key={`${item.kind}-${item.id}`}
            title={item.title}
            action={<Badge>{item.kind === "project" ? item.status : "Post"}</Badge>}
          >
            <p className="cc-section__desc">{item.kind === "post" ? item.excerpt || item.content : item.stack}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {(item.tags || []).map((tag: string) => (
                <Badge key={tag} tone="muted">{tag}</Badge>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {item.kind === "post" ? (
                <>
                  <Button variant="ghost" onClick={() => togglePostLike(item.id)}>
                    {item.isLiked ? "Liked" : "Like"} • {item.likes}
                  </Button>
                  <Button variant="ghost" onClick={() => togglePostSave(item.id)}>
                    {item.isSaved ? "Saved" : "Save"} • {item.saves}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => toggleProjectLike(item.id)}>
                    {item.isLiked ? "Liked" : "Like"} • {item.likes}
                  </Button>
                  <Button variant="ghost" onClick={() => toggleProjectSave(item.id)}>
                    {item.isSaved ? "Saved" : "Save"} • {item.saves}
                  </Button>
                </>
              )}
              <Link className="cc-auth__link" href={`/${item.kind === "post" ? "posts" : "projects"}/${item.id}`}>
                Open
              </Link>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppShell title="Your profile" subtitle="Loading your data...">
          <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
            <Spinner size={36} />
          </div>
        </AppShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppShell
        title="Your profile"
        subtitle="Show what you build, share what you learn, and invite collaborators."
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="cc-pillbtn" href="/Settings">Settings</Link>
            <Button variant="primary" onClick={() => { setPostModalOpen(true); setEditingPost(null); }}>New post</Button>
          </div>
        }
      >
        {error && <Card tone="muted"><p className="cc-formhint" style={{ color: "#fca5a5" }}>{error}</p></Card>}

        <Card>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Avatar name={profile?.name || "User"} size={72} src={profile?.avatarUrl} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h2 className="cc-section__title" style={{ fontSize: 22 }}>
                {profile?.name || "Profile"}
              </h2>
              <p className="cc-section__desc">{profile?.headline}</p>
              <p className="cc-section__desc" style={{ maxWidth: 640 }}>{profile?.bio}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(profile?.tags || []).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              {profile?.status && (
                <span className="cc-tag cc-tag--muted">
                  <span className="cc-dot" />
                  {profile.status}
                </span>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button variant="ghost" onClick={handleRefreshProfile}>Refresh</Button>
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
            <Button variant="primary" onClick={() => { setPostModalOpen(true); setEditingPost(null); }}>
              Create a post
            </Button>
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
                content: (
                  <Card>
                    {!savedPosts.length ? (
                      <EmptyState
                        title="Nothing saved yet"
                        description="Save or like posts to collect them here."
                        action={<Button variant="primary" onClick={() => setPostModalOpen(true)}>Browse posts</Button>}
                      />
                    ) : (
                      <ul className="cc-list">
                        {savedPosts.map((post) => (
                          <li key={post.id} className="cc-list__item cc-list__item--stack">
                            <div className="cc-list__meta">
                              <span className="cc-list__title">{post.title}</span>
                              <p className="cc-section__desc">{post.excerpt || post.content}</p>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <Button variant="ghost" onClick={() => togglePostSave(post.id)}>
                                {post.isSaved ? "Saved" : "Save"} • {post.saves}
                              </Button>
                              <Link className="cc-auth__link" href={`/posts/${post.id}`}>Open</Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ),
              },
              {
                id: "about",
                label: "About",
                content: (
                  <Card>
                    <p className="cc-section__desc">{profile?.bio}</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {profileLinks.map((link) => (
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
                action={<Button variant="primary" onClick={() => setPostModalOpen(true)}>Start a post</Button>}
              />
            )}
          </Card>
        </Section>
      </AppShell>

      <Modal
        title={editingPost ? "Edit post" : "Create post"}
        open={postModalOpen}
        onClose={() => { setPostModalOpen(false); setEditingPost(null); }}
        footer={(
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" type="button" onClick={() => { setPostModalOpen(false); setEditingPost(null); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="post-form" loading={submitting}>
              {editingPost ? "Save changes" : "Publish"}
            </Button>
          </div>
        )}
      >
        <CreatePostForm
          onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
          onCancel={() => { setPostModalOpen(false); setEditingPost(null); }}
          initialValues={editingPost ? { title: editingPost.title, content: editingPost.content || editingPost.excerpt || "", tags: editingPost.tags } : undefined}
          submitLabel={editingPost ? "Save changes" : "Publish"}
        />
      </Modal>

      <Modal
        title={editingProject ? "Edit project" : "New project"}
        open={projectModalOpen}
        onClose={() => { setProjectModalOpen(false); setEditingProject(null); setProjectDraft({ title: "", status: "Draft" }); }}
        footer={(
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" type="button" onClick={() => { setProjectModalOpen(false); setEditingProject(null); }}>
              Cancel
            </Button>
            <Button variant="primary" type="button" onClick={handleProjectSave} loading={submitting}>
              {editingProject ? "Save changes" : "Create project"}
            </Button>
          </div>
        )}
      >
        <form className="cc-formgrid" onSubmit={(e) => { e.preventDefault(); handleProjectSave(); }}>
          <InputField
            label="Title"
            name="proj-title"
            value={projectDraft.title}
            onChange={(e) => setProjectDraft((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <InputField
            label="Stack"
            name="proj-stack"
            value={projectDraft.stack || ""}
            onChange={(e) => setProjectDraft((prev) => ({ ...prev, stack: e.target.value }))}
            placeholder="Next.js, PostgreSQL"
          />
          <InputField
            label="Status"
            name="proj-status"
            value={projectDraft.status || ""}
            onChange={(e) => setProjectDraft((prev) => ({ ...prev, status: e.target.value }))}
            placeholder="Draft, Published, In review"
          />
          <InputField
            label="Tags (comma separated)"
            name="proj-tags"
            value={projectDraft.tags || ""}
            onChange={(e) => setProjectDraft((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="AI, Web, DX"
          />
        </form>
      </Modal>

      <Modal
        title="Delete post"
        open={!!deletePostId}
        onClose={() => setDeletePostId(null)}
        footer={(
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" type="button" onClick={() => setDeletePostId(null)}>Cancel</Button>
            <Button variant="primary" type="button" onClick={handleDeletePost} loading={submitting}>
              Delete
            </Button>
          </div>
        )}
      >
        <p className="cc-section__desc">Are you sure you want to delete this post? This cannot be undone.</p>
      </Modal>

      <Modal
        title="Delete project"
        open={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        footer={(
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" type="button" onClick={() => setDeleteProjectId(null)}>Cancel</Button>
            <Button variant="primary" type="button" onClick={handleDeleteProject} loading={submitting}>
              Delete
            </Button>
          </div>
        )}
      >
        <p className="cc-section__desc">Are you sure you want to delete this project? This cannot be undone.</p>
      </Modal>
    </AuthGuard>
  );
}
