import { Fragment, useEffect, useState, useMemo } from "react";
import {
  ChevronRight,
  Pencil,
  Plus,
  Star,
  Trash2,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { useTableQuery } from "../../hooks/useTableQuery";
import {
  PageHeader,
  TableShell,
  TableToolbar,
  SearchInput,
} from "../../components/admin.ui/PageHeader";
import { BookCover } from "../../components/admin.ui/book/BookCover";
import {
  StatusBadge,
  bookStatusVariant,
  BOOK_STATUS_OPTIONS,
} from "../../components/admin.ui/book/Badges";
import { FilterBar } from "../../components/search/FilterBar";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
} from "../../components/admin.ui/table/DataTable";
import {
  makeListGroup,
  makeDateRangeGroup,
} from "../../components/search/FilterGroupHelper";
import { useUrlSyncedParams } from "../../hooks/useUrlSyncedParams";

import { fetchBooksForAdmin, fetchBookDetails } from "../../reducers/book";
import { fetchAuthors } from "../../reducers/author";
import { fetchAllCategories } from "../../reducers/category";
import { fetchTags } from "../../reducers/tag";
import { fetchPublishers } from "../../reducers/publisher";
import {
  fetchAllBookFormats,
  setPrimaryBookFormat,
  deleteBookFormat,
} from "../../reducers/book.format";
import BookFormModal from "../../components/admin.ui/book/BookFormModal";
import BookFormatFormModal from "../../components/admin.ui/book.format/BookFormatFormModal";

const COLS = 7;

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BooksView() {
  const dispatch = useDispatch();

  const { authors } = useSelector((state) => state.author);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const { publishers } = useSelector((state) => state.publisher);

  const {
    getAllParams,
    getParam,
    addToMultiParam,
    removeFromMultiParam,
    setParam,
  } = useUrlSyncedParams();

  const authorIds = getAllParams("authorIds");
  const categoryIds = getAllParams("categoryIds");
  const tagIds = getAllParams("tagIds");
  const publisherId = getParam("publisherId");

  const extraParams = useMemo(
    () => ({
      authorIds: authorIds.length > 0 ? authorIds : undefined,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
      publisherId: publisherId || undefined,
    }),
    [authorIds.join("|"), categoryIds.join("|"), tagIds.join("|"), publisherId],
  );

  const q = useTableQuery({
    fetchAction: fetchBooksForAdmin,
    selectPage: (state) => state.book.page,
    selectIsFetching: (state) => state.book.loading,
    initialSortField: "title",
    extraParams,
  });

  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [loadingEditId, setLoadingEditId] = useState(null);

  // { isOpen: boolean, mode: "create" | "edit", book: object | null }
  const [formState, setFormState] = useState({
    isOpen: false,
    mode: "create",
    book: null,
  });

  // Expandable rows, showing that book's formats (one book expanded at a time)
  const [expandedBookId, setExpandedBookId] = useState(null);
  const formats = useSelector((state) => state.bookFormat?.formats);
  const isFormatsLoading = useSelector((state) => state.bookFormat?.loading);

  const [formatModalBookId, setFormatModalBookId] = useState(null);

  const [pendingFormatDelete, setPendingFormatDelete] = useState(null);
  const [isDeletingFormat, setIsDeletingFormat] = useState(false);

  const [pendingPrimarySet, setPendingPrimarySet] = useState(null);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);

  const sortedFormats = useMemo(() => {
    if (!formats) return formats;
    return [...formats].sort((a, b) => {
      if (a.isPrimary === b.isPrimary) return 0;
      return a.isPrimary ? -1 : 1;
    });
  }, [formats]);

  useEffect(() => {
    dispatch(fetchAuthors());
    dispatch(fetchAllCategories());
    dispatch(fetchTags());
    dispatch(fetchPublishers());
  }, [dispatch]);

  const refreshList = () => {
    dispatch(
      fetchBooksForAdmin({
        keyword: q.searchInput,
        sort:
          q.sort.length > 0
            ? q.sort.map((s) => `${s.field},${s.dir}`)
            : undefined,
        statuses: q.statuses.length > 0 ? q.statuses : undefined,
        createdFrom: q.createdFrom || undefined,
        createdTo: q.createdTo || undefined,
        authorIds: authorIds.length > 0 ? authorIds : undefined,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        publisherId: publisherId || undefined,
        page: q.page?.number ?? 0,
        size: 10,
      }),
    );
  };

  const openCreateModal = () =>
    setFormState({ isOpen: true, mode: "create", book: null });

  const openEditModal = async (book) => {
    setLoadingEditId(book.bookId);
    try {
      const response = await dispatch(fetchBookDetails(book.bookId)).unwrap();
      setFormState({ isOpen: true, mode: "edit", book: response.data });
    } catch (error) {
      toast.error(error || "Failed to fetch book details.");
    } finally {
      setLoadingEditId(null);
    }
  };

  const closeModal = () => setFormState((prev) => ({ ...prev, isOpen: false }));

  const toggleExpand = (bookId) => {
    const next = expandedBookId === bookId ? null : bookId;
    setExpandedBookId(next);
    if (next !== null) dispatch(fetchAllBookFormats(next));
  };

  const handleConfirmDeleteFormat = async () => {
    if (!pendingFormatDelete) return;
    setIsDeletingFormat(true);
    try {
      await dispatch(
        deleteBookFormat({
          bookId: pendingFormatDelete.bookId,
          formatId: pendingFormatDelete.format.bookFormatId,
        }),
      ).unwrap();
      toast.success(`${pendingFormatDelete.format.formatType} format deleted.`);
      setPendingFormatDelete(null);
    } catch (error) {
      toast.error(error || "Failed to delete book format.");
    } finally {
      setIsDeletingFormat(false);
    }
  };

  const handleConfirmSetPrimary = async () => {
    if (!pendingPrimarySet) return;
    setIsSettingPrimary(true);
    try {
      await dispatch(
        setPrimaryBookFormat({
          bookId: pendingPrimarySet.bookId,
          formatId: pendingPrimarySet.format.bookFormatId,
          isPrimary: true,
        }),
      ).unwrap();
      toast.success(
        `${pendingPrimarySet.format.formatType} is now the primary format.`,
      );
      setPendingPrimarySet(null);

      dispatch(fetchAllBookFormats(pendingPrimarySet.bookId));
    } catch (error) {
      toast.error(error || "Failed to set primary format.");
    } finally {
      setIsSettingPrimary(false);
    }
  };

  const authorOptions = useMemo(
    () =>
      (authors || []).map((a) => ({
        id: String(a.authorId),
        name: a.authorName,
      })),
    [authors],
  );
  const categoryOptions = useMemo(
    () =>
      (categories || []).map((c) => ({
        id: String(c.categoryId),
        name: c.categoryName,
      })),
    [categories],
  );
  const tagOptions = useMemo(
    () => (tags || []).map((t) => ({ id: t.tagId, name: t.tagName })),
    [tags],
  );
  const publisherOptions = useMemo(
    () =>
      (publishers || []).map((p) => ({
        id: p.publisherId,
        name: p.publisherName,
      })),
    [publishers],
  );

  const filterGroups = [
    makeListGroup({
      key: "status",
      label: "Status",
      options: BOOK_STATUS_OPTIONS,
      selected: q.statuses,
      onAdd: (id) => q.setStatusFilter([...q.statuses, id]),
      onRemove: (id) => q.setStatusFilter(q.statuses.filter((s) => s !== id)),
      onClear: () => q.setStatusFilter([]),
    }),
    makeListGroup({
      key: "authorIds",
      label: "Author",
      options: authorOptions,
      selected: authorIds,
      onAdd: (id) => addToMultiParam("authorIds", id),
      onRemove: (id) => removeFromMultiParam("authorIds", id),
    }),
    makeListGroup({
      key: "categoryIds",
      label: "Category",
      options: categoryOptions,
      selected: categoryIds,
      onAdd: (id) => addToMultiParam("categoryIds", id),
      onRemove: (id) => removeFromMultiParam("categoryIds", id),
    }),
    makeListGroup({
      key: "tagIds",
      label: "Tag",
      options: tagOptions,
      selected: tagIds,
      onAdd: (id) => addToMultiParam("tagIds", id),
      onRemove: (id) => removeFromMultiParam("tagIds", id),
    }),
    makeListGroup({
      key: "publisherId",
      label: "Publisher",
      options: publisherOptions,
      selected: publisherId ? [publisherId] : [],
      onAdd: (id) => setParam("publisherId", id),
      onRemove: () => setParam("publisherId", ""),
    }),
    makeDateRangeGroup({
      key: "createdRange",
      label: "Created date",
      value: { from: q.createdFrom, to: q.createdTo },
      onChange: ({ from, to }) =>
        q.setDateRange({ createdFrom: from, createdTo: to }),
      onClear: () => q.setDateRange({ createdFrom: "", createdTo: "" }),
    }),
  ];

  return (
    <>
      <PageHeader title="Books" />

      <TableShell>
        <TableToolbar
          filters={
            <>
              <SearchInput
                value={q.searchInput}
                onChange={q.setSearchInput}
                placeholder="Search by title or author"
              />
              <FilterBar groups={filterGroups} />
            </>
          }
          actions={
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:w-auto"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add book
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  <span className="sr-only">Cover</span>
                </th>
                <SortableHeader
                  label="Title"
                  field="title"
                  sort={q.sort}
                  onSort={q.toggleSort}
                />
                <th scope="col" className="px-4 py-2.5 font-medium normal-case">
                  Authors
                </th>
                <SortableHeader
                  label="Price"
                  field="price"
                  sort={q.sort}
                  onSort={q.toggleSort}
                  align="right"
                />
                <SortableHeader
                  label="Sold"
                  field="soldCopies"
                  sort={q.sort}
                  onSort={q.toggleSort}
                  align="right"
                />
                <SortableHeader
                  label="Status"
                  field="status"
                  sort={q.sort}
                  onSort={q.toggleSort}
                  align="right"
                />
                <th
                  scope="col"
                  className="px-4 py-2.5 text-right font-medium normal-case"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <SkeletonRows rows={5} cols={COLS} />
              ) : q.rows.length === 0 ? (
                <EmptyRow cols={COLS} message="No books match your search." />
              ) : (
                q.rows.map((book) => {
                  const expanded = expandedBookId === book.bookId;

                  return (
                    <Fragment key={book.bookId}>
                      <tr
                        role="button"
                        tabIndex={0}
                        aria-expanded={expanded}
                        onClick={() => toggleExpand(book.bookId)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleExpand(book.bookId);
                          }
                        }}
                        className={`cursor-pointer border-t border-border transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                          expanded ? "bg-muted/40" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <ChevronRight
                              className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                                expanded ? "rotate-90" : ""
                              }`}
                              aria-hidden="true"
                            />
                            <BookCover
                              src={book.coverImageUrl}
                              title={book.title}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {book.title}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {book.authorNames}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">
                          {formatPrice(book.price)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {book.soldCopies.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            label={book.status}
                            variant={bookStatusVariant(book.status)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(book);
                              }}
                              aria-label={`Edit ${book.title}`}
                              disabled={loadingEditId === book.bookId}
                              className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                            >
                              {loadingEditId === book.bookId ? (
                                <Loader2
                                  className="size-4 animate-spin"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Pencil className="size-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expanded && (
                        <tr className="border-t border-border bg-muted/20">
                          <td colSpan={COLS} className="px-4 py-3">
                            <div className="rounded-md border border-border bg-card">
                              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Book formats
                                </p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormatModalBookId(book.bookId)
                                  }
                                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                  <Plus
                                    className="size-3.5"
                                    aria-hidden="true"
                                  />
                                  Add format
                                </button>
                              </div>

                              {isFormatsLoading ? (
                                <p className="px-3 py-3 text-sm text-muted-foreground">
                                  Loading formats...
                                </p>
                              ) : formats.length === 0 ? (
                                <p className="px-3 py-3 text-sm text-muted-foreground">
                                  No formats uploaded yet for this book.
                                </p>
                              ) : (
                                <ul className="divide-y divide-border">
                                  {sortedFormats.map((fmt) => (
                                    <li
                                      key={fmt.bookFormatId}
                                      className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                                    >
                                      <span className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                                          {fmt.formatType}
                                        </span>
                                        {fmt.isPrimary && (
                                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                                            <Star
                                              className="size-3 fill-current"
                                              aria-hidden="true"
                                            />
                                            Primary
                                          </span>
                                        )}
                                        <a
                                          href={fmt.storageUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-primary hover:underline"
                                        >
                                          {fmt.storageUrl?.split("/").pop()}
                                        </a>
                                      </span>
                                      <span className="flex items-center gap-4 tabular-nums text-muted-foreground">
                                        <span className="text-xs">
                                          {formatBytes(fmt.fileSize)}
                                        </span>
                                        {!fmt.isPrimary && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setPendingPrimarySet({
                                                bookId: book.bookId,
                                                format: fmt,
                                              })
                                            }
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-600"
                                          >
                                            <Star
                                              className="size-3.5"
                                              aria-hidden="true"
                                            />
                                            Set primary
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setPendingFormatDelete({
                                              bookId: book.bookId,
                                              format: fmt,
                                            })
                                          }
                                          aria-label={`Delete ${fmt.formatType} format`}
                                          className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                        >
                                          <Trash2
                                            className="size-4"
                                            aria-hidden="true"
                                          />
                                        </button>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={q.page} onPrev={q.prevPage} onNext={q.nextPage} />
      </TableShell>

      <ConfirmDialog
        open={pendingFormatDelete !== null}
        title="Delete book format"
        description={
          <>
            Remove the{" "}
            <span className="font-medium text-foreground">
              {pendingFormatDelete?.format.formatType}
            </span>{" "}
            file from this book? Readers who already own this format will lose
            access to it.
          </>
        }
        confirmLabel={isDeletingFormat ? "Deleting..." : "Delete format"}
        destructive
        onCancel={() => setPendingFormatDelete(null)}
        onConfirm={handleConfirmDeleteFormat}
      />

      <ConfirmDialog
        open={pendingPrimarySet !== null}
        title="Set as primary format"
        description={
          <>
            Make{" "}
            <span className="font-medium text-foreground">
              {pendingPrimarySet?.format.formatType}
            </span>{" "}
            the primary format for this book? Readers will be served this format
            by default.
          </>
        }
        confirmLabel={isSettingPrimary ? "Setting..." : "Set primary"}
        onCancel={() => setPendingPrimarySet(null)}
        onConfirm={handleConfirmSetPrimary}
      />

      <BookFormModal
        isOpen={formState.isOpen}
        mode={formState.mode}
        book={formState.book}
        onClose={closeModal}
        onSuccess={refreshList}
      />

      <BookFormatFormModal
        isOpen={formatModalBookId !== null}
        bookId={formatModalBookId}
        onClose={() => setFormatModalBookId(null)}
        onSuccess={() => dispatch(fetchAllBookFormats(formatModalBookId))}
      />
    </>
  );
}
