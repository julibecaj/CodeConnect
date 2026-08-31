"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Badge, Button, Card, EmptyState, InputField, Modal, Section, Spinner } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

type ProjectDraft = {
  title: string;
  stack?: string;
  status?: string;
  tags?: string;
};

export default function ProjectsPage() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectDraft>({ title: "", status: "Draft" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getProjects({ owner: "me" });
        const items = Array.isArray(data) ? data : data.items || [];
        if (active) setProjects(items);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load projects.";
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

  const resetDraft = () => setDraft({ title: "", status: "Draft", stack: "", tags: "" });

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      addToast({ type: "error", message: "Title is required" });
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.createProject({
        title: draft.title.trim(),
        stack: draft.stack,
        status: draft.status,
        tags: draft.tags?.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setProjects((prev) => [created, ...prev]);
      addToast({ type: "success", message: "Project created." });
      resetDraft();
      setCreateOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create project.";
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!editProject) return;
    setSubmitting(true);
    try {
      const updated = await api.updateProject(editProject.id, {
        title: draft.title.trim() || editProject.title,
        stack: draft.stack,
        status: draft.status,
        tags: draft.tags?.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setProjects((prev) => prev.map((proj) => (proj.id === updated.id ? updated : proj)));
      addToast({ type: "success", message: "Project updated." });
      setEditProject(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update project.";
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await api.deleteProject(deleteId);
      setProjects((prev) => prev.filter((proj) => proj.id !== deleteId));
      addToast({ type: "success", message: "Project deleted." });
      setDeleteId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete project.";
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (id: string) => {
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

  const toggleSave = async (id: string) => {
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

  const list = useMemo(() => projects, [projects]);

  const renderProjects = () => {
    if (loading) {
      return (
        <div style={{ display: "grid", placeItems: "center", minHeight: 200 }}>
          <Spinner size={28} />
          <p className="cc-formhint">Loading your projects...</p>
        </div>
      );
    }

    if (error) {
      return <EmptyState title="Projects unavailable" description={error} action={<Button onClick={() => window.location.reload()}>Retry</Button>} />;
    }

    if (!list.length) {
      return (
        <Card>
          <EmptyState
            title="No projects yet"
            description="Create a new project card and share it with the community."
            action={<Button variant="primary" onClick={() => setCreateOpen(true)}>Create project</Button>}
          />
        </Card>
      );
    }

    return (
      <div className="cc-grid cc-grid--two">
        {list.map((proj) => (
          <Card
            key={proj.id}
            title={proj.title}
            action={<Badge>{proj.status}</Badge>}
          >
            <p className="cc-section__desc">{proj.stack || proj.excerpt}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(proj.tags || []).map((tag) => (
                <Badge key={tag} tone="muted">{tag}</Badge>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="cc-pillbtn" href={`/projects/${proj.id}`}>View</Link>
              <Button variant="ghost" onClick={() => { setEditProject(proj); setDraft({ title: proj.title, stack: proj.stack, status: proj.status, tags: proj.tags.join(", ") }); }}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setDeleteId(proj.id)}>
                Delete
              </Button>
              <Button variant="ghost" onClick={() => toggleLike(proj.id)}>
                {proj.isLiked ? "Liked" : "Like"} • {proj.likes}
              </Button>
              <Button variant="ghost" onClick={() => toggleSave(proj.id)}>
                {proj.isSaved ? "Saved" : "Save"} • {proj.saves}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <AppShell
        title="Projects"
        subtitle="Ship small, share fast. Create a new project or update drafts."
        action={<Button variant="primary" onClick={() => setCreateOpen(true)}>New project</Button>}
      >
        <Section title="Filters" description="Narrow by status or stack.">
          <div className="cc-grid cc-grid--three">
            <Card tone="muted">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="cc-pillbtn cc-pillbtn--primary" type="button">All</button>
                <button className="cc-pillbtn" type="button">Published</button>
                <button className="cc-pillbtn" type="button">Drafts</button>
                <button className="cc-pillbtn" type="button">In review</button>
              </div>
            </Card>
            <Card tone="muted">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="cc-pillbtn" type="button">Web</button>
                <button className="cc-pillbtn" type="button">AI</button>
                <button className="cc-pillbtn" type="button">Systems</button>
                <button className="cc-pillbtn" type="button">DX</button>
              </div>
            </Card>
            <Card tone="muted">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="cc-pillbtn" type="button">Sort: Latest</button>
                <button className="cc-pillbtn" type="button">Sort: Popular</button>
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Your projects">
          {renderProjects()}
        </Section>
      </AppShell>

      <Modal
        title={editProject ? "Edit project" : "New project"}
        open={createOpen || !!editProject}
        onClose={() => { setCreateOpen(false); setEditProject(null); resetDraft(); }}
        footer={(
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" type="button" onClick={() => { setCreateOpen(false); setEditProject(null); resetDraft(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="project-form" loading={submitting}>
              {editProject ? "Save changes" : "Create project"}
            </Button>
          </div>
        )}
      >
        <form id="project-form" className="cc-formgrid" onSubmit={editProject ? handleUpdate : handleCreate}>
          <InputField
            label="Title"
            name="title"
            value={draft.title}
            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <InputField
            label="Stack"
            name="stack"
            value={draft.stack || ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, stack: e.target.value }))}
            placeholder="Next.js, PostgreSQL"
          />
          <InputField
            label="Status"
            name="status"
            value={draft.status || ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value }))}
            placeholder="Draft, Published, In review"
          />
          <InputField
            label="Tags (comma separated)"
            name="tags"
            value={draft.tags || ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="AI, Web, DX"
          />
        </form>
      </Modal>

      <Modal
        title="Delete project"
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        footer={(
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" type="button" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="primary" type="button" onClick={handleDelete} loading={submitting}>
              Delete
            </Button>
          </div>
        )}
      >
        <p className="cc-section__desc">Are you sure you want to delete this project? This cannot be undone.</p>
      </Modal>
    </>
  );
}
