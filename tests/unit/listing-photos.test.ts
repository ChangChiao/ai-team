import { describe, expect, it } from "vitest";
import {
  buildListingPhotoPath,
  getListingPhotoExtension,
  validateListingPhotos
} from "@/lib/storage/listing-photos";

describe("listing photo helpers", () => {
  it("accepts supported photo types under the size limit", () => {
    const errors = validateListingPhotos([
      {
        name: "skyline.jpg",
        size: 1024,
        type: "image/jpeg"
      }
    ]);

    expect(errors).toEqual([]);
  });

  it("rejects missing, unsupported, oversized, and excessive photos", () => {
    expect(validateListingPhotos([])).toEqual(["Upload at least one photo before publishing."]);

    expect(
      validateListingPhotos([
        {
          name: "notes.pdf",
          size: 1024,
          type: "application/pdf"
        }
      ])
    ).toEqual(["notes.pdf must be JPEG, PNG, or WebP."]);

    expect(
      validateListingPhotos([
        {
          name: "huge.jpg",
          size: 7 * 1024 * 1024,
          type: "image/jpeg"
        }
      ])
    ).toEqual(["huge.jpg must be 6 MB or smaller."]);

    expect(
      validateListingPhotos(
        Array.from({ length: 9 }, (_, index) => ({
          name: `${index}.jpg`,
          size: 1024,
          type: "image/jpeg"
        }))
      )
    ).toEqual(["Upload 8 photos or fewer."]);
  });

  it("builds storage paths scoped by seller and listing", () => {
    expect(getListingPhotoExtension("image/webp")).toBe("webp");
    expect(
      buildListingPhotoPath({
        extension: "webp",
        listingId: "listing-1",
        photoId: "photo-1",
        sellerId: "seller-1"
      })
    ).toBe("seller-1/listing-1/photo-1.webp");
  });
});
