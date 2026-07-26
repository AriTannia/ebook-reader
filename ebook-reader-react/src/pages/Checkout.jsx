import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  ArrowLeft,
  Wallet,
} from "lucide-react";
import { getMyOrderById } from "../reducers/order";
import { getPaymentsByOrderId, createPaymentIntent } from "../reducers/payment";

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
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

const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    badgeClass: "bg-muted text-muted-foreground",
  },
  PAID: {
    label: "Paid",
    icon: CheckCircle2,
    badgeClass: "bg-accent text-primary",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    badgeClass: "bg-destructive/10 text-destructive",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    badgeClass: "bg-muted text-muted-foreground",
  },
  REFUNDED: {
    label: "Refunded",
    icon: RotateCcw,
    badgeClass: "bg-accent text-primary",
  },
};

const PAYMENT_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    badgeClass: "bg-muted text-muted-foreground",
  },
  SUCCESS: {
    label: "Success",
    icon: CheckCircle2,
    badgeClass: "bg-accent text-primary",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    badgeClass: "bg-destructive/10 text-destructive",
  },
};

const PAYMENT_PROVIDER_LABEL = {
  VNPAY: "VNPay",
  MOMO: "MoMo",
  COD: "Cash on Delivery",
};

const PAYMENT_METHODS = [
  {
    provider: "VNPAY",
    label: "VNPay",
    description: "Pay via VNPay gateway",
    icon: (
      <span className="text-[11px] font-bold tracking-tight text-blue-600">
        VN<span className="text-red-500">PAY</span>
      </span>
    ),
  },
  {
    provider: "MOMO",
    label: "MoMo",
    description: "Pay via MoMo e-wallet",
    icon: (
      <span className="text-[11px] font-bold text-pink-600 tracking-tight">
        MoMo
      </span>
    ),
  },
  {
    provider: "COD",
    label: "Cash on Delivery",
    description: "Pay when you receive",
    icon: <Wallet className="size-4 text-emerald-600" />,
  },
];

function StatusBadge({ config }) {
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.badgeClass}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);
 
  const {
    order,
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.order);
  const {
    payments,
    loading: paymentLoading,
    error: paymentError,
  } = useSelector((state) => state.payment);
 
  useEffect(() => {
    if (orderId) {
      dispatch(getMyOrderById(orderId));
      dispatch(getPaymentsByOrderId(orderId));
    }
  }, [dispatch, orderId]);
 
  const loading = orderLoading || paymentLoading;
  const error = orderError || paymentError;
 
  const latestPayment =
    payments && payments.length > 0
      ? [...payments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )[0]
      : null;
 
  // Pre-select the provider from the last payment attempt so user can retry or switch
  useEffect(() => {
    if (latestPayment?.provider && !selectedProvider) {
      setSelectedProvider(latestPayment.provider);
    }
  }, [latestPayment]);
 
  const handleCompletePayment = async () => {
    if (!selectedProvider) return;
    setPaying(true);
    setPayError(null);
    try {
      const result = await dispatch(
        createPaymentIntent({ orderId: order.orderId, provider: selectedProvider }),
      ).unwrap();
 
      // If the provider returns a redirect URL (e.g. VNPay, MoMo), navigate there
      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        // COD or instant success — refresh order data
        dispatch(getMyOrderById(orderId));
        dispatch(getPaymentsByOrderId(orderId));
      }
    } catch (err) {
      setPayError(
        typeof err === "string" ? err : "Payment failed. Please try again.",
      );
    } finally {
      setPaying(false);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-fade-in-up">
          Loading your order...
        </p>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center px-4">
        <p className="text-sm text-destructive bg-destructive/10 border border-border rounded-lg px-4 py-3 animate-alert-in">
          {error}
        </p>
      </div>
    );
  }
 
  if (!order) return null;
 
  const items = order.items || [];
  const orderStatusConfig =
    ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
  const paymentStatusConfig = latestPayment
    ? PAYMENT_STATUS_CONFIG[latestPayment.status] ||
      PAYMENT_STATUS_CONFIG.PENDING
    : null;
  const canRetryPayment =
    order.status === "PENDING" || order.status === "FAILED";
 
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        {/* Back link */}
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to orders
        </Link>
 
        {/* Order meta */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-2 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Order Details
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything about this order, in one place.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Order #{order.orderId}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
 
        {/* Order summary */}
        <div className="rounded-2xl border border-border bg-muted/30 overflow-hidden mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Order Summary
            </span>
            <StatusBadge config={orderStatusConfig} />
          </div>
 
          <ul role="list" className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.orderItemId}
                className="flex items-start justify-between gap-4 px-5 py-3.5"
              >
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {item.bookTitleSnapshot}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Qty {item.quantity} · {formatPrice(item.priceSnapshot)} each
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-foreground tabular-nums">
                  {formatPrice(item.priceSnapshot * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
 
          <div className="flex items-center justify-between border-t border-border bg-muted/50 px-5 py-4">
            <span className="text-sm font-medium text-muted-foreground">
              Total
            </span>
            <span className="text-lg font-bold text-primary tabular-nums">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
 
        {/* Payment info */}
        {latestPayment && (
          <div className="rounded-2xl border border-border bg-card p-5 mb-4 animate-fade-in-up">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-foreground">
                Payment information
              </p>
            </div>
 
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Method</span>
                <span className="text-sm font-medium text-foreground">
                  {PAYMENT_PROVIDER_LABEL[latestPayment.provider] ||
                    latestPayment.provider}
                </span>
              </div>
 
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge config={paymentStatusConfig} />
              </div>
 
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {formatPrice(latestPayment.amount)}
                </span>
              </div>
 
              {latestPayment.providerTransactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Transaction ID
                  </span>
                  <span className="text-sm font-mono text-foreground">
                    {latestPayment.providerTransactionId}
                  </span>
                </div>
              )}
 
              {latestPayment.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                  <span className="text-sm text-foreground">
                    {formatDate(latestPayment.completedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
 
        {/* Payment method selection + action */}
        {canRetryPayment && (
          <div className="rounded-2xl border border-border bg-card p-5 animate-fade-in-up">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-foreground">
                Complete your payment
              </p>
            </div>
 
            <p className="mb-3 text-xs text-muted-foreground">
              Choose a payment method to finish this order.
            </p>
 
            {/* Method picker */}
            <div className="space-y-2 mb-4">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedProvider === method.provider;
                return (
                  <button
                    key={method.provider}
                    type="button"
                    onClick={() => {
                      setSelectedProvider(method.provider);
                      setPayError(null);
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60"
                    }`}
                  >
                    {/* Icon slot */}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                      {method.icon}
                    </span>
 
                    {/* Labels */}
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {method.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {method.description}
                      </span>
                    </span>
 
                    {/* Radio indicator */}
                    <span
                      className={`size-4 shrink-0 rounded-full border-2 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/40"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <span className="block size-full rounded-full scale-[0.4] bg-primary-foreground" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
 
            {/* Error */}
            {payError && (
              <p className="mb-3 rounded-lg bg-destructive/10 border border-border px-3 py-2 text-xs text-destructive">
                {payError}
              </p>
            )}
 
            {/* Submit */}
            <button
              type="button"
              disabled={!selectedProvider || paying}
              onClick={handleCompletePayment}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {paying ? (
                <>
                  <svg
                    className="size-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Processing…
                </>
              ) : (
                "Complete payment"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
