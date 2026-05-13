import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters.").max(80),
  slug: z
    .string()
    .trim()
    .min(3, "Seller URL must be at least 3 characters.")
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens."),
  location: z.string().trim().optional(),
  facebookUrl: z.string().trim().url("Enter a valid URL.").optional().or(z.literal("")),
  lineId: z.string().trim().optional(),
  bio: z.string().trim().max(500, "Bio must stay under 500 characters.").optional()
});

export type ProfileInput = z.infer<typeof profileSchema>;
