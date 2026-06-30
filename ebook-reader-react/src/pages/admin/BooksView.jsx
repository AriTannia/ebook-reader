import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { fetchBooksForAdmin, deleteBook } from "../../reducers/book";

const COLS = 7;

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function BooksView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const q = useTableQuery({
    fetchAction: fetchBooksForAdmin,
    selectPage: (state) => state.book.page,
    selectIsFetching: (state) => state.book.loading,
    initialSortField: "title",
  });

  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBook(target.bookId)).unwrap();
      toast.success(`"${target.title}" was deleted.`);
      setTarget(null);

      dispatch(
        fetchBooksForAdmin({
          keyword: q.searchInput,
          sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
          page: q.page?.number ?? 0,
          size: 10,
        }),
      );
    } catch (error) {
      toast.error(error || "Failed to delete book.");
    } finally {
      setIsDeleting(false);
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
            onClick={() => navigate("/admin/books/new")}
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
                <SortableHeader label="Title" field="title" sort={q.sort} onSort={q.toggleSort} />
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Authors
                </th>
                <SortableHeader label="Price" field="price" sort={q.sort} onSort={q.toggleSort} align="right" />
                <SortableHeader label="Sold" field="soldCopies" sort={q.sort} onSort={q.toggleSort} align="right" />
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
                q.rows.map((book) => (
                  <tr
                    key={book.bookId}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <BookCover src={book.coverImageUrl} title={book.title} />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{book.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{book.authorNames}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {formatPrice(book.price)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {book.soldCopies.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={book.status} variant={bookStatusVariant(book.status)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/books/${book.bookId}/edit`)}
                          aria-label={`Edit ${book.title}`}
                          className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTarget(book)}
                          aria-label={`Delete ${book.title}`}
                          className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
            This removes{" "}
            <span className="font-medium text-foreground">{target?.title}</span> from the
            catalog. Existing orders keep their snapshot, but the book will no longer be
            available for purchase.
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete book"}
        destructive
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}