//  components/layout/recipes/RecipeForm.tsx

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

type IngredientRow = {
  ingredient_name: string;
  quantity: string | number | null;
  unit: string;
};

type InstructionRow = {
  step_title: string;
  step_description: string;
  duration_minutes: string | number | null;
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
  origin?: string;
  preparation_time?: number | string;
  cooking_time?: number | string;
  servings?: number | string;
  difficulty?: string;
  thumbnail_url?: string;
  youtube_url?: string;
  content: string;

  tags?: Tag[];
  ingredients?: IngredientRow[];
  instructions?: Array<{
    step_title?: string | null;
    step_description?: string | null;
    duration_minutes?: string | number | null;
  }>;
}

const emptyIngredient = (): IngredientRow => ({
  ingredient_name: "",
  quantity: "",
  unit: "",
});

const emptyInstruction = (): InstructionRow => ({
  step_title: "",
  step_description: "",
  duration_minutes: "",
});

function mapInstructions(
  items?: RecipeFormData["instructions"],
): InstructionRow[] {
  if (!items?.length) return [emptyInstruction()];
  return items.map((item) => ({
    step_title: item.step_title || "",
    step_description: item.step_description || "",
    duration_minutes:
      item.duration_minutes === null || item.duration_minutes === undefined
        ? ""
        : String(item.duration_minutes),
  }));
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
  const [ingredients, setIngredients] = useState<IngredientRow[]>(() => {
    if (initialData?.ingredients?.length) {
      return initialData.ingredients.map((item) => ({
        ingredient_name: item.ingredient_name || "",
        quantity:
          item.quantity === null || item.quantity === undefined
            ? ""
            : String(item.quantity),
        unit: item.unit || "",
      }));
    }
    return [emptyIngredient()];
  });
  const [instructions, setInstructions] = useState<InstructionRow[]>(() =>
    mapInstructions(initialData?.instructions),
  );

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
    origin: initialData?.origin || "",
    preparation_time: initialData?.preparation_time ?? "",
    cooking_time: initialData?.cooking_time ?? "",
    servings: initialData?.servings ?? "",
    difficulty: initialData?.difficulty || "",
    thumbnail_url: initialData?.thumbnail_url || "",
    youtube_url: initialData?.youtube_url || "",
    youtube_consent: false,
    content: initialData?.content || "",
  });

  console.log("errors ====", errors);

  useEffect(() => {
    if (initialData?.tags) {
      setSelectedTags(initialData.tags.map((t) => String(t.id)));
    }

    if (initialData?.ingredients?.length) {
      setIngredients(
        initialData.ingredients.map((item) => ({
          ingredient_name: item.ingredient_name || "",
          quantity:
            item.quantity === null || item.quantity === undefined
              ? ""
              : String(item.quantity),
          unit: item.unit || "",
        })),
      );
    }

    if (initialData?.instructions) {
      setInstructions(mapInstructions(initialData.instructions));
    }
  }, [initialData]);

  const updateIngredient = (
    index: number,
    field: keyof IngredientRow,
    value: string,
  ) => {
    setIngredients((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, emptyIngredient()]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) =>
      prev.length <= 1 ? [emptyIngredient()] : prev.filter((_, i) => i !== index),
    );
  };

  const updateInstruction = (
    index: number,
    field: keyof InstructionRow,
    value: string,
  ) => {
    setInstructions((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addInstruction = () => {
    setInstructions((prev) => [...prev, emptyInstruction()]);
  };

  const removeInstruction = (index: number) => {
    setInstructions((prev) =>
      prev.length <= 1
        ? [emptyInstruction()]
        : prev.filter((_, i) => i !== index),
    );
  };

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
            ingredients: ingredients
              .filter((row) => row.ingredient_name.trim())
              .map((row) => ({
                ingredient_name: row.ingredient_name.trim(),
                quantity:
                  String(row.quantity ?? "").trim() === ""
                    ? null
                    : String(row.quantity).trim(),
                unit: row.unit.trim() || null,
              })),
            instructions: instructions
              .filter(
                (row) =>
                  row.step_title.trim() || row.step_description.trim(),
              )
              .map((row, index) => ({
                step_number: index + 1,
                step_title: row.step_title.trim() || null,
                step_description: row.step_description.trim() || null,
                duration_minutes:
                  String(row.duration_minutes ?? "").trim() === ""
                    ? null
                    : Number(row.duration_minutes),
              })),
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

        <FormField
          label="Origin (cuisine)"
          error={getErrorMessage(errors.origin)}
        >
          <Input
            {...register("origin")}
            placeholder="Indian, Chinese, Pakistani..."
            className="h-11"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Preparation time (minutes)"
            error={getErrorMessage(errors.preparation_time)}
          >
            <Input
              type="number"
              min={0}
              {...register("preparation_time")}
              placeholder="15"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Cooking time (minutes)"
            error={getErrorMessage(errors.cooking_time)}
          >
            <Input
              type="number"
              min={0}
              {...register("cooking_time")}
              placeholder="30"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Servings"
            error={getErrorMessage(errors.servings)}
          >
            <Input
              type="number"
              min={0}
              {...register("servings")}
              placeholder="4"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Difficulty"
            error={getErrorMessage(errors.difficulty)}
          >
            <select
              {...register("difficulty")}
              className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              {initialData?.difficulty &&
                !["easy", "medium", "hard"].includes(
                  String(initialData.difficulty).toLowerCase(),
                ) && (
                  <option value={initialData.difficulty}>
                    {initialData.difficulty}
                  </option>
                )}
            </select>
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

        {/* INGREDIENTS */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Ingredients
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Add each ingredient with quantity and unit.
              </p>
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
            >
              + Add ingredient
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:grid-cols-[1.6fr_0.7fr_0.7fr_auto] sm:items-end"
              >
                <FormField label={index === 0 ? "Ingredient name" : undefined}>
                  <Input
                    value={row.ingredient_name}
                    onChange={(e: any) =>
                      updateIngredient(
                        index,
                        "ingredient_name",
                        e.target.value,
                      )
                    }
                    placeholder="Chicken breast, cut into chunks"
                    className="h-11"
                  />
                </FormField>

                <FormField label={index === 0 ? "Quantity" : undefined}>
                  <Input
                    value={row.quantity ?? ""}
                    onChange={(e: any) =>
                      updateIngredient(index, "quantity", e.target.value)
                    }
                    placeholder="2"
                    className="h-11"
                  />
                </FormField>

                <FormField label={index === 0 ? "Unit" : undefined}>
                  <Input
                    value={row.unit}
                    onChange={(e: any) =>
                      updateIngredient(index, "unit", e.target.value)
                    }
                    placeholder="lbs, cup, tsp..."
                    className="h-11"
                  />
                </FormField>

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove ingredient"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Instructions
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Add each cooking step with an optional title and duration.
              </p>
            </div>
            <button
              type="button"
              onClick={addInstruction}
              className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 transition hover:bg-orange-100"
            >
              + Add step
            </button>
          </div>

          <div className="space-y-3">
            {instructions.map((row, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-orange-600">
                    Step {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.5fr_0.5fr]">
                  <FormField label="Step title">
                    <Input
                      value={row.step_title}
                      onChange={(e: any) =>
                        updateInstruction(index, "step_title", e.target.value)
                      }
                      placeholder="Marinate the chicken"
                      className="h-11"
                      maxLength={150}
                    />
                  </FormField>

                  <FormField label="Duration (minutes)">
                    <Input
                      type="number"
                      min={0}
                      value={row.duration_minutes ?? ""}
                      onChange={(e: any) =>
                        updateInstruction(
                          index,
                          "duration_minutes",
                          e.target.value,
                        )
                      }
                      placeholder="10"
                      className="h-11"
                    />
                  </FormField>
                </div>

                <FormField label="Step description">
                  <textarea
                    value={row.step_description}
                    onChange={(e) =>
                      updateInstruction(
                        index,
                        "step_description",
                        e.target.value,
                      )
                    }
                    rows={3}
                    placeholder="Mix yogurt, spices, and chicken. Rest for 30 minutes..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </FormField>
              </div>
            ))}
          </div>
        </div>

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
            />
            {youtube?.embedUrl && (
              <iframe
                className="mt-3 w-full aspect-video rounded-lg"
                src={youtube.embedUrl}
                allowFullScreen
              />
            )}
          </FormField>
        </div>

        {youtubeUrl?.trim() ? (
          <FormField error={getErrorMessage(errors.youtube_consent)}>
            <label className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("youtube_consent")}
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span>
                I confirm that I own this video (or have the rights to share it)
                and I allow Asian Spices to upload and use it on the official
                Asian Spices YouTube channel to prevent copyright strikes.
              </span>
            </label>
          </FormField>
        ) : null}

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
