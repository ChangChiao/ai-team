import type { ListingMode, ListingStatus } from "@/lib/types";

export function formatPrice(price: number | null, currency = "TWD") {
  if (price === null) return "Ask seller";

  return new Intl.NumberFormat("zh-TW", {
    currency,
    maximumFractionDigits: 0,
    style: "currency"
  }).format(price);
}

export function formatListingMode(mode: ListingMode) {
  if (mode === "sale") return "Sale";
  if (mode === "trade") return "Trade";
  return "Sale or trade";
}

export function formatStatus(status: ListingStatus) {
  if (status === "available") return "Available";
  if (status === "reserved") return "Reserved";
  return "Sold";
}

export function statusClass(status: ListingStatus) {
  return `status-badge ${status}`;
}
