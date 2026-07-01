import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { MultiSelectField } from "../../common/MultiSelectField";
import { MultiSelectPopover } from "../../common/MultiSelectPopover";
import { SearchableSelectField } from "../../common/SearchableSelectField";
import { CoverImageField } from "../../admin.ui/book/CoverImageField";

import { uploadFile, FILE_UPLOAD_TYPE } from "../../../reducers/file";
import { fetchAuthors } from "../../../reducers/author";
import { fetchTags } from "../../../reducers/tag";
import { fetchPublishers } from "../../../reducers/publisher";
import { fetchAllCategories } from "../../../reducers/category";
import { addBook, updateBookDetails } from "../../../reducers/book";

const BOOK_STATUS_OPTIONS = [
  { id: "ACTIVE", name: "Available" },
  { id: "INACTIVE", name: "Unavailable" },
  { id: "DELETED", name: "Discontinued" },
];

function makeKey() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptySection() {
  return {
    key: makeKey(),
    collapsed: false,
    bookId: null,
    title: "",
    description: "",
    price: "",
    language: "",
    publishedDate: "",
    status: "",
    authorIds: [],
    categoryIds: [],
    tagIds: [],
    publisherId: "",
    cover: { file: null, preview: "", existingUrl: "" },
    uploadingCover: false,
  };
}

function sectionFromBook(book) {
  return {
    key: "edit-" + (book.bookId ?? "book"),
    collapsed: false,
    bookId: book.bookId ?? null,
    title: book.title ?? "",
    description: book.description ?? "",
    price: book.price != null ? String(book.price) : "",
    language: book.language ?? "",
    publishedDate: book.publishedDate ?? "",
    status: book.status ?? "",
    authorIds: book.authors?.map((a) => a.authorId) ?? [],
    categoryIds: book.categories?.map((c) => c.categoryId) ?? [],
    tagIds: book.tags?.map((t) => t.tagId) ?? [],
    publisherId: book.publisher?.publisherId ?? "",
    cover: { file: null, preview: "", existingUrl: book.coverImageUrl ?? "" },
    uploadingCover: false,
  };
}

function inputClass() {
  return "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60";
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

function BookSectionForm({
  section,
  mode,
  index,
  showCollapse,
  showRemove,
  authors,
  categories,
  tags,
  publishers,
  onUpdate,
  onToggleCollapse,
  onRemove,
}) {
  const isEdit = mode === "edit";

  const patch = (fields) => onUpdate(section.key, fields);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <button
          type="button"
          onClick={() => showCollapse && onToggleCollapse(section.key)}
          className={`flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-semibold text-foreground ${
            showCollapse ? "cursor-pointer" : "cursor-default"
          }`}
        >
          {showCollapse ? (
            section.collapsed ? (
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <ChevronUp
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            )
          ) : null}
          <span className="truncate">
            {isEdit ? "Book details" : `Book ${index + 1}`}
            {section.title ? ` \u2013 ${section.title}` : ""}
          </span>
        </button>
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(section.key)}
            aria-label={`Remove book ${index + 1}`}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {!section.collapsed && (
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {isEdit && (
            <Field label="Book ID">
              <input
                type="text"
                value={section.bookId ?? ""}
                disabled
                className={inputClass()}
              />
            </Field>
          )}

          <Field label="Title" required>
            <input
              type="text"
              value={section.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Book title"
              className={inputClass()}
            />
          </Field>

          <Field label="Price (USD)" required>
            <input
              type="number"
              min="0"
              step="0.01"
              value={section.price}
              onChange={(e) => patch({ price: e.target.value })}
              placeholder="0.00"
              className={inputClass()}
            />
          </Field>

          <Field label="Published date">
            <input
              type="date"
              value={section.publishedDate}
              onChange={(e) => patch({ publishedDate: e.target.value })}
              className={inputClass()}
            />
          </Field>

          <Field label="Language">
            <input
              type="text"
              value={section.language}
              onChange={(e) => patch({ language: e.target.value })}
              placeholder="e.g. English"
              className={inputClass()}
            />
          </Field>

          {isEdit && (
            <Field label="Status">
              <select
                value={section.status}
                onChange={(e) => patch({ status: e.target.value })}
                className={inputClass()}
              >
                <option value="">Select status</option>
                {BOOK_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <SearchableSelectField
            label="Publisher"
            options={publishers.map((p) => ({
              id: p.publisherId,
              name: p.publisherName,
            }))}
            value={section.publisherId}
            onChange={(id) => patch({ publisherId: id })}
            placeholder="Search publisher..."
            emptyOptionsMessage="No publishers yet."
          />

          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                value={section.description}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder="Short description of the book"
                rows={3}
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <CoverImageField
              file={section.cover.file}
              previewUrl={section.cover.preview || section.cover.existingUrl}
              disabled={section.uploadingCover}
              onSelectFile={(file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  patch({
                    cover: {
                      file,
                      preview: reader.result,
                      existingUrl: section.cover.existingUrl,
                    },
                  });
                };
                reader.readAsDataURL(file);
              }}
              onRemove={() =>
                patch({ cover: { file: null, preview: "", existingUrl: "" } })
              }
            />
          </div>

          <MultiSelectPopover
            label="Authors"
            options={authors.map((a) => ({
              id: a.authorId,
              name: a.authorName,
            }))}
            selectedIds={section.authorIds}
            onChange={(ids) => patch({ authorIds: ids })}
            emptyOptionsMessage="No authors yet."
          />

          <MultiSelectPopover
            label="Categories"
            options={categories.map((c) => ({
              id: c.categoryId,
              name: c.categoryName,
            }))}
            selectedIds={section.categoryIds}
            onChange={(ids) => patch({ categoryIds: ids })}
            emptyOptionsMessage="No categories yet."
          />

          <MultiSelectPopover
            label="Tags"
            options={tags.map((t) => ({ id: t.tagId, name: t.tagName }))}
            selectedIds={section.tagIds}
            onChange={(ids) => patch({ tagIds: ids })}
            emptyOptionsMessage="No tags yet."
          />
        </div>
      )}
    </div>
  );
}

export default function BookFormModal({
  isOpen,
  mode = "create",
  book = null,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();

  const authors = useSelector((state) => state.author?.authors);
  const categories = useSelector((state) => state.category?.categories);
  const publishers = useSelector((state) => state.publisher?.publishers);
  const tags = useSelector((state) => state.tag?.tags);

  const [sections, setSections] = useState(() =>
    mode === "edit" && book ? [sectionFromBook(book)] : [emptySection()],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    dispatch(fetchAuthors());
    dispatch(fetchAllCategories());
    dispatch(fetchPublishers());
    dispatch(fetchTags());
  }, [isOpen, mode, dispatch]);

  useEffect(() => {
    if (!isOpen) return;
    setSections(
      mode === "edit" && book ? [sectionFromBook(book)] : [emptySection()],
    );
    setIsSubmitting(false);
  }, [isOpen, mode, book]);

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
      emptySection(),
    ]);
  };

  const removeSection = (key) => {
    setSections((prev) =>
      prev.length > 1 ? prev.filter((s) => s.key !== key) : prev,
    );
  };

  const validate = () => {
    for (const s of sections) {
      if (!s.title.trim()) {
        toast.error("Every book needs a title.");
        return false;
      }
      if (s.price === "" || Number(s.price) < 0) {
        toast.error(`"${s.title}" needs a valid price.`);
        return false;
      }
    }
    return true;
  };

  const uploadCoverIfNeeded = async (section) => {
    if (!section.cover.file) return section.cover.existingUrl || "";
    updateSection(section.key, { uploadingCover: true });
    try {
      const result = await dispatch(
        uploadFile({ 
          file: section.cover.file,
          type: FILE_UPLOAD_TYPE.BOOK
        }),
      ).unwrap();
      return result.filePath;
    } finally {
      updateSection(section.key, { uploadingCover: false });
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (mode === "edit") {
        const section = sections[0];
        const coverImageUrl = await uploadCoverIfNeeded(section);
        console.log("Section: ", section);
        await dispatch(
          updateBookDetails({
            bookId: section.bookId,
            updatedData: {
              title: section.title.trim(),
              description: section.description,
              price: Number(section.price),
              coverImageUrl,
              language: section.language,
              publishedDate: section.publishedDate || null,
              status: section.status || BOOK_STATUS_OPTIONS[0].id,
              authorIds: section.authorIds,
              categoryIds: section.categoryIds,
              tagIds: section.tagIds,
              publisherId: section.publisherId || null,
            },
          }),
        ).unwrap();
        toast.success(`"${section.title}" was updated.`);
      } else {
        const requests = [];
        for (const section of sections) {
          const coverImageUrl = await uploadCoverIfNeeded(section);
          requests.push({
            title: section.title.trim(),
            description: section.description,
            price: Number(section.price),
            coverImageUrl,
            language: section.language,
            publishedDate: section.publishedDate || null,
            authorIds: section.authorIds,
            categoryIds: section.categoryIds,
            tagIds: section.tagIds,
            publisherId: section.publisherId || null,
          });
        }
        await dispatch(addBook(requests)).unwrap();
        toast.success(
          requests.length > 1
            ? `${requests.length} books were created.`
            : "Book was created.",
        );
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error || "Failed to save book.");
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
              {mode === "edit" ? "Edit book" : "Add new book"}
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
              <BookSectionForm
                key={section.key}
                section={section}
                mode={mode}
                index={index}
                showCollapse={mode === "create" && sections.length > 1}
                showRemove={mode === "create" && sections.length > 1}
                authors={authors}
                categories={categories}
                tags={tags}
                publishers={publishers}
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
                Add another book
              </button>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
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
                  ? `Create ${sections.length} books`
                  : "Create book"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
