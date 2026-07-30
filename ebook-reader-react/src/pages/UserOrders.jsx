import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MoreVertical } from "lucide-react";

import { useTableQuery } from "../hooks/useTableQuery";
import {
  PageHeader,
  TableShell,
  TableToolbar,
} from "../components/admin.ui/PageHeader";
import {
  makeListGroup,
  makeDateRangeGroup,
} from "../components/search/FilterGroupHelper";
import { FilterBar } from "../components/search/FilterBar";
import {
  StatusBadge,
  orderStatusVariant,
  ORDER_STATUS_OPTIONS,
} from "../components/admin.ui/book/Badges";

import {
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
} from "../components/admin.ui/table/DataTable";

import { getMyOrders } from "../reducers/order";

const COLS = 5;

function ActionsMenu({ orderId, isOpen, onToggle, onClose, onViewDetails }) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 160, // 160 = width menu (w-40)
      });
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        type="button"
        onClick={() => onToggle(orderId)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </button>

      {isOpen &&
        pos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div
              style={{ position: "absolute", top: pos.top, left: pos.left }}
              className="z-50 w-40 rounded-lg border border-border bg-card py-1 shadow-lg animate-fade-in-up"
            >
              <button
                type="button"
                onClick={() => {
                  onViewDetails(orderId);
                  onClose();
                }}
                className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted/60"
              >
                View details
              </button>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function OrdersView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const q = useTableQuery({
    fetchAction: getMyOrders,
    selectPage: (state) => state.order.orders,
    selectIsFetching: (state) => state.order.loading,
    initialSortField: "createdAt",
    initialSortDir: "desc",
  });

  const [openMenuId, setOpenMenuId] = useState(null);

  const refetchCurrentPage = () => {
    dispatch(
      getMyOrders({
        keyword: q.searchInput,
        sort:
          q.sort.length > 0
            ? q.sort.map((s) => `${s.field},${s.dir}`)
            : undefined,
        statuses: q.statuses.length > 0 ? q.statuses : undefined,
        createdFrom: q.createdFrom || undefined,
        createdTo: q.createdTo || undefined,
        page: q.page?.number ?? 0,
        size: 10,
      }),
    );
  };

  const filterGroups = [
    makeListGroup({
      key: "status",
      label: "Status",
      options: ORDER_STATUS_OPTIONS,
      selected: q.statuses,
      onAdd: (id) => q.setStatusFilter([...q.statuses, id]),
      onRemove: (id) => q.setStatusFilter(q.statuses.filter((s) => s !== id)),
      onClear: () => q.setStatusFilter([]),
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
      <PageHeader title="My Orders" />

      <TableShell>
        <TableToolbar
          filters={
            <FilterBar groups={filterGroups} />
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Order ID
                </th>
                <SortableHeader
                  label="Date"
                  field="createdAt"
                  sort={q.sort}
                  onSort={q.toggleSort}
                />
                <SortableHeader
                  label="Status"
                  field="status"
                  sort={q.sort}
                  onSort={q.toggleSort}
                />
                <SortableHeader
                  label="Total"
                  field="totalAmount"
                  sort={q.sort}
                  onSort={q.toggleSort}
                  align="right"
                />
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <SkeletonRows rows={5} cols={COLS} />
              ) : q.rows.length === 0 ? (
                <EmptyRow cols={COLS} message="No orders match your search." />
              ) : (
                q.rows.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      #{order.orderId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={order.status}
                        variant={orderStatusVariant(order.status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionsMenu
                        orderId={order.orderId}
                        isOpen={openMenuId === order.orderId}
                        onToggle={(id) =>
                          setOpenMenuId((prev) => (prev === id ? null : id))
                        }
                        onClose={() => setOpenMenuId(null)}
                        onViewDetails={(id) => navigate(`/checkout/${id}`)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={q.page} onPrev={q.prevPage} onNext={q.nextPage} />
      </TableShell>
    </>
  );
}
