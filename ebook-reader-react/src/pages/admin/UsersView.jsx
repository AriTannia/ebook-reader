import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { useTableQuery } from "../../components/admin.ui/UseTableQuery";
import { PageHeader, TableShell } from "../../components/admin.ui/PageHeader";
import {
  Avatar,
  ConfirmDialog,
  EmptyRow,
  Pagination,
  RolePill,
  SkeletonRows,
  SortableHeader,
} from "../../components/admin.ui/CommonUI";
import { fetchAllUsers, deleteUser } from "../../reducers/user";

const COLS = 5;

export function UsersView() {
  const dispatch = useDispatch();

  const q = useTableQuery({
    fetchAction: fetchAllUsers,
    selectPage: (state) => state.user.page,
    selectIsFetching: (state) => state.user.isFetching,
    initialSortField: "fullName",
  });

  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteUser(target.userId)).unwrap();
      toast.success(`"${target.fullName}" was deleted.`);
      setTarget(null);
      // Re-fetch trang hiện tại để bảng khớp đúng dữ liệu thật từ server
      dispatch(
        fetchAllUsers({
          keyword: q.searchInput,
          sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
          page: q.page?.number ?? 0,
          size: 10,
        }),
      );
    } catch (error) {
      toast.error(error || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Users"
        searchPlaceholder="Search by name or email"
        searchValue={q.searchInput}
        onSearchChange={q.setSearchInput}
        isFetching={q.isFetching}
      />

      <TableShell>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  <span className="sr-only">Avatar</span>
                </th>
                <SortableHeader label="Full Name" field="fullName" sort={q.sort} onSort={q.toggleSort} />
                <SortableHeader label="Email" field="email" sort={q.sort} onSort={q.toggleSort} />
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Roles
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
                <EmptyRow cols={COLS} message="No users match your search." />
              ) : (
                q.rows.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <Avatar src={user.avatarUrl} name={user.fullName} />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{user.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <RolePill key={role} role={role} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setTarget(user)}
                        aria-label={`Delete ${user.fullName}`}
                        className="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
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
        title="Delete user account"
        description={
          <>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">{target?.fullName}</span> and
            all associated data. This action cannot be undone.
          </>
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete user"}
        destructive
        onCancel={() => setTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}