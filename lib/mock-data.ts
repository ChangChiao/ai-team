import type { Listing, Seller, Transaction } from "@/lib/types";

export const sellers: Seller[] = [
  {
    slug: "aki-models",
    displayName: "Aki Models",
    bio: "1:64 and Mini GT seller focused on clean boxes, clear photos, and fast status updates.",
    location: "Taipei",
    joinedAt: "2026-03-18",
    confirmedTransactions: 18,
    activeListings: 12,
    facebookUrl: "https://facebook.com"
  },
  {
    slug: "garage-164",
    displayName: "Garage 1:64",
    bio: "Weekly diecast listings, mostly Tomica Limited Vintage and Hot Wheels Premium.",
    location: "Taichung",
    joinedAt: "2026-04-02",
    confirmedTransactions: 9,
    activeListings: 7
  },
  {
    slug: "resin-desk",
    displayName: "Resin Desk",
    bio: "Premium resin and low-run model car trades. Photos before every deal.",
    location: "Kaohsiung",
    joinedAt: "2026-04-20",
    confirmedTransactions: 6,
    activeListings: 4
  }
];

export const listings: Listing[] = [
  {
    id: "mini-gt-skyline-r34",
    sellerSlug: "aki-models",
    title: "Mini GT Nissan Skyline GT-R R34 Bayside Blue",
    brand: "Mini GT",
    modelName: "Nissan Skyline GT-R R34",
    scale: "1:64",
    series: "Japan Collector Series",
    carCondition: "Excellent",
    boxCondition: "Good, light corner wear",
    defects: "No missing parts. Factory paint looks clean under daylight.",
    price: 1200,
    currency: "TWD",
    listingMode: "sale_or_trade",
    location: "Taipei",
    deliveryPreference: "7-Eleven store-to-store or meetup",
    contactMethod: "LINE: aki-models",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
    createdAt: "2026-05-10"
  },
  {
    id: "tomica-lv-civic",
    sellerSlug: "garage-164",
    title: "Tomica Limited Vintage Neo Honda Civic EF",
    brand: "Tomica Limited Vintage",
    modelName: "Honda Civic EF",
    scale: "1:64",
    series: "Neo",
    carCondition: "Near mint",
    boxCondition: "Excellent",
    defects: "Opened once for photos.",
    price: 980,
    currency: "TWD",
    listingMode: "sale",
    location: "Taichung",
    deliveryPreference: "Post office or store-to-store",
    contactMethod: "Facebook Messenger",
    status: "reserved",
    imageUrl: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=900&q=80",
    createdAt: "2026-05-09"
  },
  {
    id: "hot-wheels-rwb",
    sellerSlug: "garage-164",
    title: "Hot Wheels Premium RWB Porsche 930",
    brand: "Hot Wheels",
    modelName: "RWB Porsche 930",
    scale: "1:64",
    series: "Premium",
    carCondition: "Sealed",
    boxCondition: "Card has soft edge",
    defects: "Blister intact.",
    price: 620,
    currency: "TWD",
    listingMode: "sale",
    location: "Taichung",
    deliveryPreference: "Store-to-store",
    contactMethod: "LINE: garage164",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80",
    createdAt: "2026-05-08"
  },
  {
    id: "resin-ferrari-f40",
    sellerSlug: "resin-desk",
    title: "Resin Ferrari F40 LM low-run display model",
    brand: "Resin Desk",
    modelName: "Ferrari F40 LM",
    scale: "1:43",
    series: "Limited resin",
    carCondition: "Excellent",
    boxCondition: "Display case included",
    defects: "Small mark on outer acrylic case.",
    price: 4800,
    currency: "TWD",
    listingMode: "trade",
    location: "Kaohsiung",
    deliveryPreference: "Meetup preferred",
    contactMethod: "Email: resin@example.com",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",
    createdAt: "2026-05-07"
  }
];

export const transactions: Transaction[] = [
  {
    id: "tx-001",
    listingId: "mini-gt-skyline-r34",
    sellerSlug: "aki-models",
    listingTitle: "Mini GT Toyota Supra Renaissance Red",
    transactionType: "sale",
    status: "confirmed",
    confirmedAt: "2026-05-01"
  },
  {
    id: "tx-002",
    listingId: "tomica-lv-civic",
    sellerSlug: "garage-164",
    listingTitle: "Tomica Limited Vintage Mazda RX-7",
    transactionType: "exchange",
    status: "confirmed",
    confirmedAt: "2026-04-23"
  }
];

export function getSeller(slug: string) {
  return sellers.find((seller) => seller.slug === slug);
}

export function getListing(id: string) {
  return listings.find((listing) => listing.id === id);
}

export function getSellerListings(slug: string) {
  return listings.filter((listing) => listing.sellerSlug === slug);
}

export function getSellerTransactions(slug: string) {
  return transactions.filter((transaction) => transaction.sellerSlug === slug);
}
