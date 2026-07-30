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
import CategoryFormModal from "../../components/admin.ui/category/CategoryFormModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
} from "../../components/admin.ui/table/DataTable";

import {
  fetchAllCategoriesForAdmin,
  fetchCategoryById,
  deleteCategory,
} from "../../reducers/category";

const COLS = 4;

function firstSentence(text) {
  if (!text) return "—";
  const [first, ...rest] = text.split(/(?<=[.!?])\s/);
  const hasMore = rest.length > 0;
  return hasMore ? `${first} ...` : first;
}

export function CategoryView() {
  const dispatch = useDispatch();

  const q = useTableQuery({
    fetchAction: fetchAllCategoriesForAdmin,
    selectPage: (state) => state.category.page,
    selectIsFetching: (state) => state.category.isFetching,
    initialSortField: "categoryName",
  });

  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({
    isOpen: false,
    mode: "create",
    category: null,
  });

  const [loadingEditId, setLoadingEditId] = useState(null);

  const openCreateModal = () => {
    setFormState({ isOpen: true, mode: "create", category: null });
  };

  const refreshTable = () => {
    dispatch(
      fetchAllCategoriesForAdmin({
        keyword: q.searchInput,
        sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
        page: q.page?.number ?? 0,
        size: 10,
      }),
    );
  };

  const openEditModal = async (category) => {
    setLoadingEditId(category.categoryId);
    try {
      const response = await dispatch(
        fetchCategoryById(category.categoryId),
      ).unwrap();
      setFormState({ isOpen: true, mode: "edit", category: response.data });
    } catch (error) {
      toast.error(error || "Failed to fetch category details.");
    } finally {
      setLoadingEditId(null);
    }
  };

  const closeModal = () => setFormState((prev) => ({ ...prev, isOpen: false }));

  const handleConfirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCategory(target.categoryId)).unwrap();
      toast.success(`"${target.categoryName}" was deleted.`);
      setTarget(null);
      dispatch(
        fetchAllCategoriesForAdmin({
          keyword: q.searchInput,
          sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
          page: q.page?.number ?? 0,
          size: 10,
        }),
      );
      refreshTable();
    } catch (error) {
      toast.error(error || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Category" />
      <TableShell>
        <TableToolbar
          filters={
            <SearchInput
              value={q.searchInput}
              onChange={q.setSearchInput}
              placeholder="Search by category name..."
            />
          }
          actions={
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card md:w-auto"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add new category
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <SortableHeader
                  label="Category Name"
                  field="categoryName"
                  sort={q.sort}
                  onSort={q.toggleSort}
                />
                <th scope="col" className="px-4 py-2.5 font-medium normal-case">
                  Description
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium normal-case">
                  Slug
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
                <EmptyRow
                  cols={COLS}
                  message="No categories match your search."
                />
              ) : (
                q.rows.map((category) => {
                  return (
                    <tr
                      key={category.categoryId}
                      className="border-t border-border transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {category.categoryName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="line-clamp-1">
                          {firstSentence(category.description)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {category.slug}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(category);
                            }}
                            aria-label={`Edit ${category.categoryName}`}
                            disabled={loadingEditId === category.categoryId}
                            className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                          >
                            {loadingEditId === category.categoryId ? (
                              <Loader2
                                className="size-4 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Pencil className="size-4" aria-hidden="true" />
                            )}
                          </button>
                          <button
                            onClick={() => setTarget(category)}
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
        title="Delete category"
        description={
          <>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">
              {target?.categoryName}
            </span>{" "}
            and all associated data. This action cannot be undone.
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete category"}
        destructive
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />
      <CategoryFormModal
        isOpen={formState.isOpen}
        mode={formState.mode}
        category={formState.category}
        onClose={closeModal}
        onSuccess={refreshTable}
      />
    </>
  );
}
