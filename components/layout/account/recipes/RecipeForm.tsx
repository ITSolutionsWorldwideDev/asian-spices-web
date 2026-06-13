// apps/web/components/layout/recipes/RecipeForm.tsx

"use client";

import { useEffect, useState } from "react";

import { useZodForm } from "@/hooks/useZodForm";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { getErrorMessage } from "@/lib/form/getErrorMessage";
import { useLoaderStore } from "@/store/useLoaderStore";
import { recipeSchema } from "@/lib/validation/recipes";

import { extractYoutubeData } from "@/core/utils";

type Tag = {
  id: string;
  name: string;
  color: string;
};

interface Props {
  initialData?: Partial<RecipeFormData>;
  recipeId?: string;
  onSuccess?: () => void;
}
interface RecipeFormData {
  title: string;
  slug: string;
  short_description: string;
  thumbnail_url?: string;
  youtube_url?: string;
  content: string;

  tags?: Tag[];
}

export default function RecipeForm({
  initialData,
  recipeId,
  onSuccess,
}: Props) {
  const isEdit = Boolean(recipeId);

  const { show, hide } = useLoaderStore();

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useZodForm(recipeSchema, {
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    short_description: initialData?.short_description || "",
    thumbnail_url: initialData?.thumbnail_url || "",
    youtube_url: initialData?.youtube_url || "",
    content: initialData?.content || "",
  });

  console.log("errors ====", errors);

  useEffect(() => {
    if (initialData?.tags) {
      setSelectedTags(initialData.tags.map((t) => String(t.id)));
    }
  }, [initialData]);

  const titleField = register("title");

  //   const youtube = extractYoutubeData(initialData.youtube_url);
  const youtubeUrl = watch("youtube_url");

  const youtube = extractYoutubeData(youtubeUrl || "");

  // ---------------------------
  // TAG TOGGLE
  // ---------------------------
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  // ---------------------------
  // LOAD TAGS
  // ---------------------------
  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await fetch("/api/recipe-tags");

        if (!res.ok) {
          throw new Error("Failed to load tags");
        }

        const data = await res.json();

        setTags(data.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadTags();
  }, []);

  // ---------------------------
  // SLUG
  // ---------------------------
  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (data: any) => {
    try {
      setApiError(null);
      setApiSuccess(null);

      show(isEdit ? "Updating Recipe..." : "Creating Recipe...");

      const res = await fetch(
        isEdit ? `/api/account/recipes/${recipeId}` : `/api/account/recipes`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            tag_ids: selectedTags,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        setApiError(result?.error || "Something went wrong");
        return;
      }

      setApiSuccess(
        isEdit ? "Recipe updated successfully" : "Recipe created successfully",
      );

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setApiError("Failed to save recipe");
    } finally {
      hide();
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEdit ? "Edit Recipe" : "Create Recipe"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Fill in the recipe details below.
        </p>
      </div>

      {/* ALERTS */}
      {apiError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {apiSuccess && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {apiSuccess}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("VALIDATION ERRORS:", errors);
        })}
        className="space-y-6"
      >
        {/* TITLE + SLUG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Recipe Title" error={getErrorMessage(errors.title)}>
            <Input
              {...titleField}
              placeholder="Chicken Biryani"
              className="h-11"
              onChange={(e: any) => {
                titleField.onChange(e);

                setValue("slug", generateSlug(e.target.value));
              }}
            />
          </FormField>

          <FormField label="Slug" error={getErrorMessage(errors.slug)}>
            <Input
              {...register("slug")}
              placeholder="chicken-biryani"
              className="h-11"
            />
          </FormField>
        </div>

        {/* SHORT DESCRIPTION */}
        <FormField
          label="Short Description"
          error={getErrorMessage(errors.short_description)}
        >
          <textarea
            {...register("short_description")}
            rows={4}
            placeholder="Write a short recipe summary..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </FormField>

        {/* THUMBNAIL + YOUTUBE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Thumbnail URL"
            error={getErrorMessage(errors.thumbnail_url)}
          >
            <Input
              {...register("thumbnail_url")}
              placeholder="https://..."
              className="h-11"
            />
          </FormField>

          <FormField
            label="YouTube URL"
            error={getErrorMessage(errors.youtube_url)}
          >
            <Input
              {...register("youtube_url")}
              placeholder="https://youtube.com/watch?v=..."
              className="h-11"
              // onChange={(e: any) => handleChange("youtube_url", e.target.value)}
            />
            {youtube?.embedUrl && (
              <iframe
                className="w-full aspect-video rounded-lg"
                src={youtube.embedUrl}
                allowFullScreen
              />
            )}
          </FormField>
        </div>

        {/* CONTENT */}
        <FormField
          label="Recipe Content"
          error={getErrorMessage(errors.content)}
        >
          <textarea
            {...register("content")}
            rows={12}
            placeholder="Write recipe instructions..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </FormField>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Recipe Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  selectedTags.includes(tag.id)
                    ? "text-white"
                    : "bg-white text-gray-700"
                }`}
                style={{
                  backgroundColor: selectedTags.includes(tag.id)
                    ? tag.color
                    : "white",
                  borderColor: tag.color,
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-4 border-t flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="px-6 py-3">
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Recipe"
                : "Create Recipe"}
          </Button>
        </div>
      </form>
    </div>
  );
}
