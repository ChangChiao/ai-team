import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().trim().min(8, "Title must describe the listing."),
  brand: z.string().trim().min(1, "Brand is required."),
  modelName: z.string().trim().min(1, "Model name is required."),
  scale: z.string().trim().min(1, "Scale is required."),
  carCondition: z.string().trim().min(1, "Car condition is required."),
  boxCondition: z.string().trim().optional(),
  defects: z.string().trim().optional(),
  price: z.coerce.number().nonnegative().nullable(),
  listingMode: z.enum(["sale", "trade", "sale_or_trade"]),
  location: z.string().trim().min(1, "Location is required."),
  contactMethod: z.string().trim().min(1, "Contact method is required.")
});

export type ListingInput = z.infer<typeof listingSchema>;
