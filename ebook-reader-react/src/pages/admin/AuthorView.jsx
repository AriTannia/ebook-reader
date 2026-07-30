import { useState } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { useTableQuery } from "../../hooks/useTableQuery";
import {
  PageHeader,
  TableShell,
  TableToolbar,
  SearchInput,
} from "../../components/admin.ui/PageHeader";
import AuthorFormModal from "../../components/admin.ui/author/AuthorFormModal";
import { Avatar } from "../../components/admin.ui/avatar/Avatar";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
} from "../../components/admin.ui/table/DataTable";

import {
  fetchAuthorsForAdmin,
  fetchAuthorById,
  deleteAuthor,
} from "../../reducers/author";

const COLS = 4;

function firstSentence(text) {
  if (!text) return "—";
  const [first, ...rest] = text.split(/(?<=[.!?])\s/);
  const hasMore = rest.length > 0;
  return hasMore ? `${first} ...` : first;
}

export function AuthorView() {
  const dispatch = useDispatch();

  const q = useTableQuery({
    fetchAction: fetchAuthorsForAdmin,
    selectPage: (state) => state.author.page,
    selectIsFetching: (state) => state.author.isFetching,
    initialSortField: "authorName",
  });

  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({
    isOpen: false,
    mode: "create",
    author: null,
  });

  const [loadingEditId, setLoadingEditId] = useState(null);

  const openCreateModal = () => {
    setFormState({ isOpen: true, mode: "create", author: null });
  };

  const refreshTable = () => {
    dispatch(
      fetchAuthorsForAdmin({
        keyword: q.searchInput,
        sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
        page: q.page?.number ?? 0,
        size: 10,
      }),
    );
  };

  const openEditModal = async (author) => {
    setLoadingEditId(author.authorId);
    try {
      const response = await dispatch(
        fetchAuthorById(author.authorId),
      ).unwrap();
      setFormState({ isOpen: true, mode: "edit", author: response.data });
    } catch (error) {
      toast.error(error || "Failed to fetch author details.");
    } finally {
      setLoadingEditId(null);
    }
  };

  const closeModal = () => setFormState((prev) => ({ ...prev, isOpen: false }));

  const handleConfirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteAuthor(target.authorId)).unwrap();
      toast.success(`"${target.authorName}" was deleted.`);
      setTarget(null);
      dispatch(
        fetchAuthorsForAdmin({
          keyword: q.searchInput,
          sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
          page: q.page?.number ?? 0,
          size: 10,
        }),
      );
      refreshTable();
    } catch (error) {
      toast.error(error || "Failed to delete author.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Authors" />
      <TableShell>
        <TableToolbar
          filters={
            <SearchInput
              value={q.searchInput}
              onChange={q.setSearchInput}
              placeholder="Search by name or biography..."
              isFetching={q.isFetching}
            />
          }
          actions={
            <>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add author
              </button>
            </>
          }
        ></TableToolbar>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  <span className="sr-only">Avatar</span>
                </th>
                <SortableHeader
                  label="Author Name"
                  field="authorName"
                  sort={q.sort}
                  onSort={q.toggleSort}
                />
                <th scope="col" className="px-4 py-2.5 font-medium normal-case">
                  Biography
                </th>
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
                <EmptyRow cols={COLS} message="No authors match your search." />
              ) : (
                q.rows.map((author) => {
                  return (
                    <tr
                      key={author.authorId}
                      className="border-t border-border transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        <Avatar
                          src={author.avatarUrl}
                          name={author.authorName}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {author.authorName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="line-clamp-1">
                          {firstSentence(author.biography)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(author);
                            }}
                            aria-label={`Edit ${author.authorName}`}
                            disabled={loadingEditId === author.authorId}
                            className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                          >
                            {loadingEditId === author.authorId ? (
                              <Loader2
                                className="size-4 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Pencil className="size-4" aria-hidden="true" />
                            )}
                          </button>
                          <button
                            onClick={() => setTarget(author)}
                            disabled={isDeleting}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
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
        title="Delete author"
        description={
          <>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">
              {target?.authorName}
            </span>{" "}
            and all associated data. This action cannot be undone.
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete author"}
        destructive
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />
      <AuthorFormModal
        isOpen={formState.isOpen}
        mode={formState.mode}
        author={formState.author}
        onClose={closeModal}
        onSuccess={refreshTable}
      />
    </>
  );
}
