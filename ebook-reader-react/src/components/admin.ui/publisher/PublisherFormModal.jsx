import { useEffect, useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { addPublisher, updatePublisher } from "../../../reducers/publisher";
import { uploadFile, FILE_UPLOAD_TYPE } from "../../../reducers/file";
import PublisherSectionForm from "./PublisherSectionForm";

function makeKey() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyPublisherSection() {
  return {
    key: makeKey(),
    collapsed: false,
    publisherId: null,
    publisherName: "",
    publisherImage: {
      file: null,
      preview: "",
      existingUrl: "",
    },
    uploadingPublisherImage: false,
  };
}

function sectionFromPublisher(publisher) {
  return {
    key: "edit-" + (publisher.publisherId ?? publisher),
    collapsed: false,
    publisherId: publisher.publisherId ?? null,
    publisherName: publisher.publisherName ?? "",
    publisherImage: {
      file: null,
      preview: "",
      existingUrl: publisher.publisherImageUrl ?? "",
    },
    uploadingPublisherImage: false,
  };
}

export default function PublisherFormModal({
  isOpen,
  mode = "create",
  publisher = null,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();

  const [sections, setSections] = useState(() => {
    if (mode === "edit" && publisher) {
      return [sectionFromPublisher(publisher)];
    }
    return [emptyPublisherSection()];
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSections(
      mode === "edit" && publisher
        ? [sectionFromPublisher(publisher)]
        : [emptyPublisherSection()],
    );
    setIsSubmitting(false);
  }, [isOpen, mode, publisher]);

  if (!isOpen) return null;

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
      emptyPublisherSection(),
    ]);
  };

  const removeSection = (key) => {
    setSections((prev) =>
      prev.length > 1 ? prev.filter((s) => s.key !== key) : prev,
    );
  };

  const uploadPublisherImageIfNeeded = async (section) => {
    if (!section.publisherImage.file)
      return section.publisherImage.existingUrl || "";
    updateSection(section.key, { uploadingPublisherImage: true });
    try {
      const result = await dispatch(
        uploadFile({
          file: section.publisherImage.file,
          type: FILE_UPLOAD_TYPE.AVATAR,
        }),
      ).unwrap();
      return result.filePath;
    } finally {
      updateSection(section.key, { uploadingPublisherImage: false });
    }
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
          updatePublisher({
            publisherId: section.publisherId,
            publisherData: {
              publisherName: section.publisherName,
              logoUrl,
            },
          }),
        ).unwrap();
      } else {
        // Validate every section has a non-empty name
        const emptyIndex = sections.findIndex((s) => !s.publisherName.trim());
        if (emptyIndex !== -1) {
          toast.error(`Publisher ${emptyIndex + 1}: name is required.`);
          setIsSubmitting(false);
          return;
        }

        const payload = [];
        for (const section of sections) {
          const logoUrl = await uploadPublisherImageIfNeeded(section);
          payload.push({ publisherName: section.publisherName, logoUrl });
        }
        const result = await dispatch(addPublisher(payload)).unwrap();

        toast.success(
          result.length > 1
            ? `${result.length} publishers added successfully.`
            : "Publisher added successfully.",
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
              {mode === "edit" ? "Edit publisher" : "Add new publisher"}
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
              <PublisherSectionForm
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
                Add another publisher
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
                  ? `Create ${sections.length} publishers`
                  : "Create publisher"}
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
