import { useState } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { useTableQuery } from "../../hooks/useTableQuery";
import {
  PageHeader,
  SearchInput,
  TableShell,
  TableToolbar,
} from "../../components/admin.ui/PageHeader";
import PublisherFormModal from "../../components/admin.ui/publisher/PublisherFormModal";
import { Avatar } from "../../components/admin.ui/avatar/Avatar";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
} from "../../components/admin.ui/table/DataTable";

import {
  fetchPublishersForAdmin,
  fetchPublisherById,
  deletePublisher,
} from "../../reducers/publisher";

const COLS = 3;

export function PublisherView() {
  const dispatch = useDispatch();

  const q = useTableQuery({
    fetchAction: fetchPublishersForAdmin,
    selectPage: (state) => state.publisher.page,
    selectIsFetching: (state) => state.publisher.isFetching,
    initialSortField: "publisherName",
  });

  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({
    isOpen: false,
    mode: "create",
    publisher: null,
  });

  const [loadingEditId, setLoadingEditId] = useState(null);

  const openCreateModal = () => {
    setFormState({ isOpen: true, mode: "create", publisher: null });
  };

  const refreshTable = () => {
    dispatch(
      fetchPublishersForAdmin({
        keyword: q.searchInput,
        sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
        page: q.page?.number ?? 0,
        size: 10,
      }),
    );
  };

  const openEditModal = async (publisher) => {
    setLoadingEditId(publisher.publisherId);
    try {
      const response = await dispatch(
        fetchPublisherById(publisher.publisherId),
      ).unwrap();
      setFormState({ isOpen: true, mode: "edit", publisher: response.data });
    } catch (error) {
      toast.error(error || "Failed to fetch publisher details.");
    } finally {
      setLoadingEditId(null);
    }
  };

  const closeModal = () => setFormState((prev) => ({ ...prev, isOpen: false }));

  const handleConfirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await dispatch(deletePublisher(target.publisherId)).unwrap();
      toast.success(`"${target.publisherName}" was deleted.`);
      setTarget(null);
      dispatch(
        fetchPublishersForAdmin({
          keyword: q.searchInput,
          sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
          page: q.page?.number ?? 0,
          size: 10,
        }),
      );
      refreshTable();
    } catch (error) {
      toast.error(error || "Failed to delete publisher.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Publisher" />
      <TableShell>
        <TableToolbar
          filters={
            <SearchInput
              placeholder="Search by publisher name..."
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
              Add new publisher
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  <span className="sr-only">Avatar</span>
                </th>
                <SortableHeader
                  label="Publisher Name"
                  field="publisherName"
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
                <EmptyRow
                  cols={COLS}
                  message="No publishers match your search."
                />
              ) : (
                q.rows.map((publisher) => {
                  return (
                    <tr
                      key={publisher.publisherId}
                      className="border-t border-border transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        <Avatar
                          src={publisher.avatarUrl}
                          name={publisher.publisherName}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {publisher.publisherName}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(publisher);
                            }}
                            aria-label={`Edit ${publisher.publisherName}`}
                            disabled={loadingEditId === publisher.publisherId}
                            className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                          >
                            {loadingEditId === publisher.publisherId ? (
                              <Loader2
                                className="size-4 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Pencil className="size-4" aria-hidden="true" />
                            )}
                          </button>
                          <button
                            onClick={() => setTarget(publisher)}
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
        title="Delete publisher"
        description={
          <>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">
              {target?.publisherName}
            </span>{" "}
            and all associated data. This action cannot be undone.
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete publisher"}
        destructive
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />
      <PublisherFormModal
        isOpen={formState.isOpen}
        mode={formState.mode}
        publisher={formState.publisher}
        onClose={closeModal}
        onSuccess={refreshTable}
      />
    </>
  );
}
