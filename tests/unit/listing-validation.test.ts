import { describe, expect, it } from "vitest";
import { listingSchema } from "@/lib/validation/listing";

describe("listingSchema", () => {
  it("accepts a complete model car listing", () => {
    const result = listingSchema.safeParse({
      title: "Mini GT Nissan Skyline GT-R R34 Bayside Blue",
      brand: "Mini GT",
      modelName: "Nissan Skyline GT-R R34",
      scale: "1:64",
      carCondition: "Excellent",
      boxCondition: "Good",
      defects: "",
      price: "1200",
      listingMode: "sale_or_trade",
      location: "Taipei",
      contactMethod: "LINE: aki-models"
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing trust-critical listing details", () => {
    const result = listingSchema.safeParse({
      title: "R34",
      brand: "",
      modelName: "",
      scale: "",
      carCondition: "",
      price: "1200",
      listingMode: "sale",
      location: "",
      contactMethod: ""
    });

    expect(result.success).toBe(false);
  });
});
