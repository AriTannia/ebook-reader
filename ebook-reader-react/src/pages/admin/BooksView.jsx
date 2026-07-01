import { Fragment, useState } from "react";
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

import { useTableQuery } from "../../components/admin.ui/UseTableQuery";
import { PageHeader, TableShell } from "../../components/admin.ui/PageHeader";
import {
  BookCover,
  ConfirmDialog,
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
  StatusBadge,
  bookStatusVariant,
} from "../../components/admin.ui/CommonUI";
import {
  fetchBooksForAdmin,
  deleteBook,
  fetchBookDetails,
} from "../../reducers/book";
import {
  fetchAllBookFormats,
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

  const q = useTableQuery({
    fetchAction: fetchBooksForAdmin,
    selectPage: (state) => state.book.page,
    selectIsFetching: (state) => state.book.loading,
    initialSortField: "title",
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

  const refreshList = () => {
    dispatch(
      fetchBooksForAdmin({
        keyword: q.searchInput,
        sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
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

  const handleConfirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBook(target.bookId)).unwrap();
      toast.success(`"${target.title}" was deleted.`);
      setTarget(null);
      refreshList();
    } catch (error) {
      toast.error(error || "Failed to delete book.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleExpand = (bookId) => {
    setExpandedBookId((current) => {
      const next = current === bookId ? null : bookId;
      if (next !== null) dispatch(fetchAllBookFormats(next));
      return next;
    });
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

  return (
    <>
      <PageHeader
        title="Books"
        searchPlaceholder="Search by title"
        searchValue={q.searchInput}
        onSearchChange={q.setSearchInput}
        isFetching={q.isFetching}
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add new book
          </button>
        }
      />

      <TableShell>
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
                <th scope="col" className="px-4 py-2.5 font-medium">
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
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
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
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTarget(book);
                              }}
                              aria-label={`Delete ${book.title}`}
                              className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
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
                                  {formats.map((fmt) => (
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
        open={target !== null}
        title="Delete book"
        description={
          <>
            <p className="font-medium text-foreground">
              Delete "{target?.title}" from the catalog?
            </p>
            <p className="text-muted-foreground">
              Existing orders keep their snapshot, but this book will no longer
              be available for purchase.
            </p>
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete book"}
        destructive
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />

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
