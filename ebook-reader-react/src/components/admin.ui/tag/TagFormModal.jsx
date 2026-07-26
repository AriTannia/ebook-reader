import { useEffect, useState } from "react";
import { Plus, Loader2, X, Tag } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { addTag, updateTag } from "../../../reducers/tag";
import TagSectionForm from "./TagSectionForm";

function makeKey() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyTagSection() {
  return {
    key: makeKey(),
    collapsed: false,
    tagId: null,
    tagName: "",
  };
}

function sectionFromTag(tag) {
  return {
    key: "edit-" + (tag.tagId ?? tag),
    collapsed: false,
    tagId: tag.tagId ?? null,
    tagName: tag.tagName ?? "",
  };
}

export default function TagFormModal({
  isOpen,
  mode = "create",
  tag = null,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();

  const [sections, setSections] = useState(() => {
    if (mode === "edit" && tag) {
      return [sectionFromTag(tag)];
    }
    return [emptyTagSection()];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if(!isOpen) return;
    setSections(mode === "edit" && tag ? [sectionFromTag(tag)] : [emptyTagSection()]);
  }, [isOpen, mode, tag]);

  if(!isOpen) return null;

  const updateSection = (key, fields) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, ...fields } : s)),
    );
  };

  const toggleCollapse = (key) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, collapsed: !s.collapsed } : s)),
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev.map((s) => ({ ...s, collapsed: true })),
      emptyTagSection(),
    ]);
  };

  const removeSection = (key) => {
    setSections((prev) =>
      prev.length > 1 ? prev.filter((s) => s.key !== key) : prev,
    );
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (mode === "edit") {
        const section = sections[0];
        const logoUrl = await uploadPublisherImageIfNeeded(section);
        await dispatch(
          updateTag({
            tagId: section.tagId,
            tagData: {
              tagName: section.tagName
            },
          }),
        ).unwrap();
      } else {
        const emptyIndex = sections.findIndex((s) => !s.tagName.trim());
        if (emptyIndex !== -1) {
          toast.error(`Tag ${emptyIndex + 1}: name is required.`);
          setIsSubmitting(false);
          return;
        }
        const payload = sections.map((section) => ({
          tagName: section.tagName,
        }));
        const result = await dispatch(addTag(payload)).unwrap();

        toast.success(
          result.length > 1
            ? `${result.length} tags added successfully.`
            : "Tag added successfully.",
        );
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.message || "An error occurred while submitting the form.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        <div
          className="animate-modal-backdrop-in fixed inset-0 z-40 bg-black/40"
          onClick={handleClose}
        />
  
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="animate-modal-content-in flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-xl font-bold text-foreground">
                {mode === "edit" ? "Edit tag" : "Add new tag"}
              </h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
              {sections.map((section, index) => (
                <TagSectionForm
                  key={section.key}
                  section={section}
                  mode={mode}
                  index={index}
                  showCollapse={mode === "create" && sections.length > 1}
                  showRemove={mode === "create" && sections.length > 1}
                  onUpdate={updateSection}
                  onToggleCollapse={toggleCollapse}
                  onRemove={removeSection}
                />
              ))}
  
              {mode === "create" && (
                <button
                  type="button"
                  onClick={addSection}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add another tag
                </button>
              )}
            </div>
  
            <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {mode === "edit"
                  ? "Save changes"
                  : sections.length > 1
                    ? `Create ${sections.length} tags`
                    : "Create tag"}
              </button>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
}