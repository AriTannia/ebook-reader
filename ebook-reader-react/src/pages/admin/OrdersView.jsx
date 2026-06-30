import { Fragment, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { useTableQuery } from "../../components/admin.ui/UseTableQuery";
import { PageHeader, TableShell } from "../../components/admin.ui/PageHeader";
import {
  ConfirmDialog,
  EmptyRow,
  Pagination,
  SkeletonRows,
  SortableHeader,
  StatusBadge,
  orderStatusVariant,
} from "../../components/admin.ui/CommonUI";
import { fetchAllOrdersForAdmin, cancelOrderByAdmin, refundOrder } from "../../reducers/order";

const COLS = 6;

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrdersView() {
  const dispatch = useDispatch();

  const q = useTableQuery({
    fetchAction: fetchAllOrdersForAdmin,
    selectPage: (state) => state.order.orders,
    selectIsFetching: (state) => state.order.loading,
    initialSortField: "createdAt",
    initialSortDir: "desc",
  });

  const [expandedId, setExpandedId] = useState(null);
  const [pending, setPending] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const refetchCurrentPage = () => {
    dispatch(
      fetchAllOrdersForAdmin({
        keyword: q.searchInput,
        sort: q.sort ? `${q.sort.field},${q.sort.dir}` : undefined,
        page: q.page?.number ?? 0,
        size: 10,
      }),
    );
  };

  const handleConfirm = async () => {
    if (!pending) return;
    setIsProcessing(true);
    try {
      if (pending.action === "cancel") {
        await dispatch(cancelOrderByAdmin(pending.order.orderId)).unwrap();
        toast.success(`Order #${pending.order.orderId} cancelled.`);
      } else {
        await dispatch(refundOrder(pending.order.orderId)).unwrap();
        toast.success(`Order #${pending.order.orderId} refunded.`);
      }
      setPending(null);
      refetchCurrentPage();
    } catch (error) {
      toast.error(error || "Action failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Orders"
        searchPlaceholder="Search by buyer name or email"
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
                  Order ID
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Buyer
                </th>
                <SortableHeader label="Date" field="createdAt" sort={q.sort} onSort={q.toggleSort} />
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Status
                </th>
                <SortableHeader label="Total" field="totalAmount" sort={q.sort} onSort={q.toggleSort} align="right" />
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
                q.rows.map((order) => {
                  const expanded = expandedId === order.orderId;
                  const toggle = () =>
                    setExpandedId((id) => (id === order.orderId ? null : order.orderId));

                  return (
                    <Fragment key={order.orderId}>
                      <tr
                        role="button"
                        tabIndex={0}
                        aria-expanded={expanded}
                        onClick={toggle}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle();
                          }
                        }}
                        className={`cursor-pointer border-t border-border transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                          expanded ? "bg-muted/40" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                            <ChevronRight
                              className={`size-3.5 text-muted-foreground transition-transform ${
                                expanded ? "rotate-90" : ""
                              }`}
                              aria-hidden="true"
                            />
                            #{order.orderId}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col leading-tight">
                            <span className="font-medium text-foreground">
                              {order.user?.fullName ?? "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.user?.email ?? "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge label={order.status} variant={orderStatusVariant(order.status)} />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {order.status === "PENDING" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPending({ order, action: "cancel" });
                              }}
                              className="inline-flex cursor-pointer items-center rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                            >
                              Cancel
                            </button>
                          ) : order.status === "PAID" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPending({ order, action: "refund" });
                              }}
                              className="inline-flex cursor-pointer items-center rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                            >
                              Refund
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-t border-border bg-muted/20">
                          <td colSpan={COLS} className="px-4 py-3">
                            <div className="rounded-md border border-border bg-card">
                              <p className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Order items
                              </p>
                              <ul className="divide-y divide-border">
                                {order.items.map((item) => (
                                  <li
                                    key={item.orderItemId}
                                    className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                                  >
                                    <span className="font-medium text-foreground">
                                      {item.bookTitleSnapshot}
                                    </span>
                                    <span className="flex items-center gap-4 tabular-nums text-muted-foreground">
                                      <span>{formatPrice(item.priceSnapshot)}</span>
                                      <span className="text-xs">× {item.quantity}</span>
                                      <span className="w-24 text-right font-medium text-foreground">
                                        {formatPrice(item.priceSnapshot * item.quantity)}
                                      </span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
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
        open={pending !== null}
        title={pending?.action === "cancel" ? "Cancel order" : "Refund order"}
        description={
          pending?.action === "cancel" ? (
            <>
              Cancel order{" "}
              <span className="font-medium text-foreground">#{pending?.order.orderId}</span>?
              The buyer will be notified and the pending charge will be voided.
            </>
          ) : (
            <>
              Refund{" "}
              <span className="font-medium text-foreground">
                {pending ? formatPrice(pending.order.totalAmount) : ""}
              </span>{" "}
              for order{" "}
              <span className="font-medium text-foreground">#{pending?.order.orderId}</span>?
              This marks the order as refunded in the system.
            </>
          )
        }
        confirmLabel={
          isProcessing
            ? "Processing..."
            : pending?.action === "cancel"
            ? "Cancel order"
            : "Issue refund"
        }
        destructive={pending?.action === "refund"}
        onCancel={() => setPending(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
}