export type ListingStatus = "available" | "reserved" | "sold";

export type ListingVisibility = "draft" | "public" | "archived";

export type ListingMode = "sale" | "trade" | "sale_or_trade";

export type Listing = {
  id: string;
  sellerSlug: string;
  title: string;
  brand: string;
  modelName: string;
  scale: string;
  series: string;
  carCondition: string;
  boxCondition: string;
  defects: string;
  price: number | null;
  currency: "TWD";
  listingMode: ListingMode;
  location: string;
  deliveryPreference: string;
  contactMethod: string;
  status: ListingStatus;
  visibility: ListingVisibility;
  imageUrl: string;
  createdAt: string;
};

export type Seller = {
  slug: string;
  displayName: string;
  bio: string;
  location: string;
  joinedAt: string;
  confirmedTransactions: number;
  activeListings: number;
  facebookUrl?: string;
};

export type Transaction = {
  id: string;
  listingId: string;
  sellerSlug: string;
  listingTitle: string;
  transactionType: "sale" | "exchange";
  status: "pending_buyer_confirmation" | "confirmed" | "expired";
  confirmedAt?: string;
};
