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
import TagFormModal from "../../components/admin.ui/tag/TagFormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
} from "../../components/admin.ui/table/DataTable";

import { fetchTagsForAdmin, fetchTagById, deleteTag } from "../../reducers/tag";

const COLS = 3;

export function TagView() {
  const dispatch = useDispatch();

  const q = useTableQuery({
    fetchAction: fetchTagsForAdmin,
    selectPage: (state) => state.tag.page,
    selectIsFetching: (state) => state.tag.isFetching,
    initialSortField: "tagName",
  });

  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({
    isOpen: false,
    mode: "create",
    tag: null,
  });

  const [loadingEditId, setLoadingEditId] = useState(null);

  const openCreateModal = () => {
    setFormState({ isOpen: true, mode: "create", tag: null });
  };

  const refreshTable = () => {
    dispatch(
      fetchTagsForAdmin({
        page: q.page,
        pageSize: q.pageSize,
        sortField: q.sort.field,
        sortOrder: q.sort.order,
      }),
    );
  };

  const openEditModal = async (tag) => {
    setLoadingEditId(tag.tagId);
    try {
      const response = await dispatch(fetchTagById(tag.tagId)).unwrap();
      console.log("Fetched tag details:", response);
      setFormState({ isOpen: true, mode: "edit", tag: response.data });
    } catch (error) {
      toast.error(error || "Failed to fetch tag details.");
    } finally {
      setLoadingEditId(null);
    }
  };

  const closeModal = () => setFormState((prev) => ({ ...prev, isOpen: false }));

  const handleConfirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteTag(target.tagId)).unwrap();
      toast.success(`"${target.tagName}" was deleted.`);
      setTarget(null);
      dispatch(
        fetchTagsForAdmin({
          keyword: q.searchInput,
          sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
          page: q.page?.number ?? 0,
          size: 10,
        }),
      );
      refreshTable();
    } catch (error) {
      toast.error(error || "Failed to delete tag.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Tag" />
      <TableShell>
        <TableToolbar
          filters={
            <SearchInput
              placeholder="Search by tag name..."
              value={q.searchInput}
              onChange={q.setSearchInput}
              onSubmit={q.isFetching}
            />
          }
          actions={
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:w-auto"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add new tag
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <SortableHeader
                  label="Tag Name"
                  field="tagName"
                  sort={q.sort}
                  onSort={q.toggleSort}
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
                <EmptyRow cols={COLS} message="No tags match your search." />
              ) : (
                q.rows.map((tag) => {
                  return (
                    <tr
                      key={tag.tagId}
                      className="border-t border-border transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {tag.tagName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(tag);
                            }}
                            aria-label={`Edit ${tag.tagName}`}
                            disabled={loadingEditId === tag.tagId}
                            className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                          >
                            {loadingEditId === tag.tagId ? (
                              <Loader2
                                className="size-4 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Pencil className="size-4" aria-hidden="true" />
                            )}
                          </button>
                          <button
                            onClick={() => setTarget(tag)}
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
        title="Delete tag"
        description={
          <>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">
              {target?.tagName}
            </span>{" "}
            and all associated data. This action cannot be undone.
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete tag"}
        destructive
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />
      <TagFormModal
        isOpen={formState.isOpen}
        mode={formState.mode}
        tag={formState.tag}
        onClose={closeModal}
        onSuccess={refreshTable}
      />
    </>
  );
}
