export const MAX_LISTING_PHOTOS = 8;
export const MAX_LISTING_PHOTO_BYTES = 6 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type PhotoLike = {
  name: string;
  size: number;
  type: string;
};

export function getListingPhotoExtension(contentType: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return undefined;
}

export function buildListingPhotoPath({
  extension,
  listingId,
  photoId,
  sellerId
}: {
  extension: string;
  listingId: string;
  photoId: string;
  sellerId: string;
}) {
  return `${sellerId}/${listingId}/${photoId}.${extension}`;
}

export function validateListingPhotos(files: PhotoLike[]) {
  if (files.length === 0) {
    return ["Upload at least one photo before publishing."];
  }

  if (files.length > MAX_LISTING_PHOTOS) {
    return [`Upload ${MAX_LISTING_PHOTOS} photos or fewer.`];
  }

  const errors: string[] = [];

  files.forEach((file, index) => {
    const label = file.name || `Photo ${index + 1}`;

    if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
      errors.push(`${label} must be JPEG, PNG, or WebP.`);
    }

    if (file.size > MAX_LISTING_PHOTO_BYTES) {
      errors.push(`${label} must be 6 MB or smaller.`);
    }
  });

  return errors;
}

export function extractUploadedPhotos(formData: FormData, fieldName = "photos") {
  return formData
    .getAll(fieldName)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}
