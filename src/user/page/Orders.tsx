import React, { useEffect, useState } from "react";
import { allOrdersAPI } from "../../services/allAPI";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Star,
  MapPin,
  Phone,
  CreditCard,
} from "lucide-react";


interface APIProductId {
  _id: string;
  id: number;
  title: string;
  thumbnail: string;
  images: string[];
  brand: string;
  category: string;
  price: number;
  rating?: number;
  [key: string]: unknown;
}

interface APIOrderItem {
  _id: string;
  productId: APIProductId | string; 
  name: string;
  price: number;
  quantity: number;
}

interface APIShippingAddress {
  fullName: string;
  phoneNum: string;
  address: string;
  city: string;
  pinCode: string;
}

interface APIOrder {
  _id: string;
  createdAt: string;
  updatedAt: string;
  items: APIOrderItem[];
  orderStatus: string; 
  paymentStatus: string; 
  paymentIntentId: string;
  shippingAddress: APIShippingAddress;
  totalAmount: number;
  userId: string;
  __v: number;
}

function getProductObj(productId: APIProductId | string): APIProductId | null {
  return typeof productId === "object" && productId !== null ? productId : null;
}

function getItemImage(item: APIOrderItem): string {
  const p = getProductObj(item.productId);
  return p?.thumbnail ?? p?.images?.[0] ?? FALLBACK_IMAGE;
}

function getItemTitle(item: APIOrderItem): string {
  const p = getProductObj(item.productId);
  return p?.title ?? item.name;
}

function getItemProductId(item: APIOrderItem): string {
  const p = getProductObj(item.productId);
  return p?._id ?? (typeof item.productId === "string" ? item.productId : "");
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120&h=120&fit=crop";

function inr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

interface NormalisedOrder {
  id: string;
  placedOn: string;
  deliveredOn?: string;
  status: OrderStatus;
  items: APIOrderItem[];
  totalAmount: number;
  shippingAddress: APIShippingAddress;
  paymentStatus: string;
  paymentIntentId: string;
}

function mapStatus(orderStatus: string): OrderStatus {
  switch (orderStatus?.toLowerCase()) {
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "returned":
      return "Returned";
    case "created":
    case "processing":
    default:
      return "Processing";
  }
}

function normaliseOrder(o: APIOrder): NormalisedOrder {
  return {
    id: o._id,
    placedOn: o.createdAt,
    status: mapStatus(o.orderStatus),
    items: o.items,
    totalAmount: o.totalAmount,
    shippingAddress: o.shippingAddress,
    paymentStatus: o.paymentStatus,
    paymentIntentId: o.paymentIntentId,
  };
}


const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; Icon: React.ElementType }> = {
  Processing: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", Icon: Clock },
  Shipped: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", Icon: Truck },
  Delivered: { color: "text-green-600", bg: "bg-green-50 border-green-200", Icon: CheckCircle2 },
  Cancelled: { color: "text-red-500", bg: "bg-red-50 border-red-200", Icon: XCircle },
  Returned: { color: "text-gray-500", bg: "bg-gray-50 border-gray-200", Icon: RotateCcw },
};


const PAYMENT_BADGE: Record<string, { label: string; cls: string }> = {
  paid: { label: "Paid", cls: "bg-green-100 text-green-700" },
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
  failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
};


function generateInvoiceHTML(order: NormalisedOrder): string {
  const { shippingAddress: addr } = order;
  const fullAddr = `${addr.fullName}, ${addr.address}, ${addr.city} - ${addr.pinCode} | Ph: ${addr.phoneNum}`;

  const itemRows = order.items
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 8px;font-size:13px">${getItemTitle(item)}<br>
          <span style="color:#888;font-size:11px">Product ID: ${getItemProductId(item)}</span>
        </td>
        <td style="padding:10px 8px;text-align:center;font-size:13px">${item.quantity}</td>
        <td style="padding:10px 8px;text-align:right;font-size:13px">₹${item.price.toFixed(2)}</td>
        <td style="padding:10px 8px;text-align:right;font-size:13px">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const itemsTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const subtotal = itemsTotal;  // prices already include taxes

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${order.id}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; color: #222; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #000; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
    .invoice-title { font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .meta-box { background: #f8f8f8; border-radius: 8px; padding: 16px; }
    .meta-box h4 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
    .meta-box p { margin: 3px 0; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #000; color: #fff; }
    thead th { padding: 10px 8px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    thead th:nth-child(2) { text-align: center; }
    thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
    .totals { margin-left: auto; width: 280px; }
    .totals tr td { padding: 6px 8px; font-size: 13px; }
    .totals tr td:last-child { text-align: right; font-weight: 600; }
    .total-row td { font-size: 15px !important; font-weight: 800 !important; border-top: 2px solid #000; padding-top: 10px !important; }
    .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 11px; border-top: 1px solid #eee; padding-top: 16px; }
    .badge { display: inline-block; background: #000; color: #fff; font-size: 11px; padding: 3px 10px; border-radius: 20px; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">XORIVA</div>
      <div class="invoice-title">Tax Invoice</div>
    </div>
    <div style="text-align:right">
      <div style="font-weight:700;font-size:18px">Invoice</div>
      <div style="color:#555;font-size:13px;margin-top:4px">#${order.id}</div>
      <div class="badge">${order.status}</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-box">
      <h4>Order Details</h4>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Placed On:</strong> ${new Date(order.placedOn).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
      <p><strong>Payment Ref:</strong> ${order.paymentIntentId}</p>
    </div>
    <div class="meta-box">
      <h4>Delivery Address</h4>
      <p>${fullAddr}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <table class="totals">
    <tr><td>Item Total</td><td>₹${subtotal.toFixed(2)}</td></tr>
    <tr><td>Delivery</td><td style="color:green">FREE</td></tr>
    <tr class="total-row"><td>Grand Total</td><td>₹${order.totalAmount.toFixed(2)}</td></tr>
  </table>

  <div class="footer">
    <p>Thank you for shopping with Thrift! This is a system-generated invoice.</p>
    <p>For support: support@thrift.in | 1800-XXX-XXXX</p>
  </div>
</body>
</html>`;
}

function downloadInvoice(order: NormalisedOrder) {
  const html = generateInvoiceHTML(order);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice_${order.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function OrderCard({ order }: { order: NormalisedOrder }) {
  const [expanded, setExpanded] = useState(false);
  const { color, bg, Icon } = STATUS_CONFIG[order.status];
  const { shippingAddress: addr } = order;

  const previewItem = order.items[0];

  const payBadge = PAYMENT_BADGE[order.paymentStatus?.toLowerCase()] ?? {
    label: order.paymentStatus,
    cls: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* ── Order Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-gray-50 gap-3">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Order ID</p>
            <p className="font-mono font-semibold text-gray-800 text-xs">{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Placed On</p>
            <p className="text-gray-700">
              {new Date(order.placedOn).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Total</p>
            <p className="font-bold text-gray-900">{inr(order.totalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Payment</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${payBadge.cls}`}>
              {payBadge.label}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold w-fit ${bg} ${color}`}
        >
          <Icon className="w-3.5 h-3.5" />
          {order.status}
        </div>
      </div>

      {/* ── Preview Row (click to expand) ── */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/60 transition"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Stacked thumbnails from real product images */}
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item) => (
            <img
              key={item._id}
              src={getItemImage(item)}
              alt={getItemTitle(item)}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{getItemTitle(previewItem)}</p>
          <p className="text-sm text-gray-500">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </p>
          {order.items.length > 1 && (
            <p className="text-xs text-gray-400 mt-0.5">
              +{order.items.length - 1} more item{order.items.length - 1 > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <button className="text-gray-400 hover:text-gray-600 transition ml-auto flex-shrink-0">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-50">
          {/* Items */}
          <div className="px-5 py-3 space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4">
                <img
                  src={getItemImage(item)}
                  alt={getItemTitle(item)}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{getItemTitle(item)}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{getItemProductId(item)}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {inr(item.price)} each
                    </span>
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-sm flex-shrink-0">
                  {inr(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Order total breakdown */}
          <div className="mx-5 mb-4 bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm space-y-1.5">
            <div className="flex justify-between text-gray-500">
              <span>Item Total</span>
              <span>{inr(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
              <span>Grand Total</span>
              <span>{inr(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Delivery Address</p>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{addr.fullName}</p>
                <p className="text-gray-500">
                  {addr.address}, {addr.city} — {addr.pinCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Phone className="w-4 h-4 text-gray-400" />
              {addr.phoneNum}
            </div>
          </div>

          {/* Payment info */}
          <div className="px-5 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CreditCard className="w-4 h-4" />
              <span className="font-mono">{order.paymentIntentId}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-3">
            {/* Invoice available for any paid order */}
            {order.paymentStatus === "paid" && (
              <button
                onClick={() => downloadInvoice(order)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
            )}
            {order.status === "Delivered" && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
                  <Star className="w-4 h-4 text-amber-500" />
                  Rate & Review
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
                  <RotateCcw className="w-4 h-4" />
                  Return / Exchange
                </button>
              </>
            )}
            {order.status === "Shipped" && (
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition">
                <Truck className="w-4 h-4" />
                Track Order
              </button>
            )}
            {order.status === "Processing" && (
              <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition">
                <XCircle className="w-4 h-4" />
                Cancel Order
              </button>
            )}
            {(order.status === "Cancelled" || order.status === "Returned") && (
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
                Buy Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"] as const;
type FilterType = (typeof FILTERS)[number];

export default function Orders() {
  const [orders, setOrders] = useState<NormalisedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await allOrdersAPI();
        console.log(res);
        const raw: APIOrder[] = Array.isArray(res) ? res : res?.data ?? [];
        setOrders(raw.map(normaliseOrder));
      } catch (err) {
        console.error(err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchesFilter = activeFilter === "All" || o.status === activeFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) =>
        (getItemTitle(i) + i.name).toLowerCase().includes(search.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const countByStatus = (s: string) => orders.filter((o) => o.status === s).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Page Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-black" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
            {!loading && (
              <span className="ml-auto text-sm text-gray-400">
                {orders.length} order{orders.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-4 focus-within:border-gray-400 transition">
            <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or product name…"
              className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 ml-2 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  activeFilter === f
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {f}
                {f !== "All" && countByStatus(f) > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-70">({countByStatus(f)})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Loading skeleton */}
        {loading && (
          <>
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="h-4 bg-gray-100 rounded w-40" />
                  <div className="h-4 bg-gray-100 rounded w-24 ml-auto" />
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-100 rounded w-48" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-20">
            <XCircle className="w-14 h-14 text-red-200 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              {orders.length === 0
                ? "You haven't placed any orders yet"
                : "No orders match your search"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {orders.length === 0
                ? "Start shopping to see your orders here"
                : "Try a different filter or keyword"}
            </p>
          </div>
        )}

      
        {!loading &&
          !error &&
          filtered.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}