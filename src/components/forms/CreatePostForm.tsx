"use client";

import { FormEvent, useMemo, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { validateBody, validateTitle } from "../../lib/validators";
import { Button } from "../ui/Button";
import { InputField } from "../ui/Input";

export type PostFormValues = {
  title: string;
  content: string;
  tags?: string[];
};

type CreatePostFormProps = {
  initialValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
};

export function CreatePostForm({ initialValues, onSubmit, onCancel, submitLabel = "Publish" }: CreatePostFormProps) {
  const { addToast } = useToast();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [tags, setTags] = useState((initialValues?.tags || []).join(", "));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const tagList = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const titleErr = validateTitle(title);
    const bodyErr = validateBody(content);
    if (titleErr) nextErrors.title = titleErr;
    if (bodyErr) nextErrors.content = bodyErr;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), content, tags: tagList });
      addToast({ type: "success", message: "Saved." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save post.";
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cc-formgrid">
      <InputField
        label="Title"
        name="title"
        placeholder="What are you shipping today?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        error={errors.title}
      />
      <InputField
        label="Body"
        name="content"
        placeholder="Share a post, tutorial, or project update..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        error={errors.content}
        multiline
        rows={4}
      />
      <InputField
        label="Tags (comma separated)"
        name="tags"
        placeholder="Spring Boot, Realtime, Next.js"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        error={errors.tags}
      />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Button type="submit" variant="primary" loading={submitting}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <p className="cc-formhint">Tags are optional; they help others filter content.</p>
      </div>
    </form>
  );
}
