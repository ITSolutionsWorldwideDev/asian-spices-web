// lib/validation/recipes.ts

import { z } from "zod";

export const recipeSchema = z
  .object({
    title: z.string().min(3, "Title is required"),

    slug: z.string().min(3, "Slug is required"),

    short_description: z.string().optional(),

    origin: z.string().optional(),

    preparation_time: z
      .union([z.literal(""), z.coerce.number().int().min(0)])
      .optional(),

    cooking_time: z
      .union([z.literal(""), z.coerce.number().int().min(0)])
      .optional(),

    servings: z
      .union([z.literal(""), z.coerce.number().int().min(0)])
      .optional(),

    difficulty: z.string().optional(),

    thumbnail_url: z.union([
      z.string().url("Invalid thumbnail URL"),
      z.literal(""),
    ]),

    youtube_url: z.union([
      z.string().url("Invalid YouTube URL"),
      z.literal(""),
    ]),

    youtube_consent: z.boolean().optional().default(false),

    content: z.string().min(20, "Content is too short"),
  })
  .superRefine((data, ctx) => {
    const hasYoutubeUrl = Boolean(String(data.youtube_url || "").trim());

    if (hasYoutubeUrl && !data.youtube_consent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["youtube_consent"],
        message:
          "Please accept the YouTube video usage terms to add a video URL",
      });
    }
  });
