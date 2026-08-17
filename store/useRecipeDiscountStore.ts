import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppliedRecipeLikeDiscount = {
  id: string;
  recipeId: string;
  recipeTitle: string;
  discount_type: string;
  discount_value: number;
  label: string;
};

interface RecipeDiscountState {
  appliedDiscount: AppliedRecipeLikeDiscount | null;
  applyDiscount: (discount: AppliedRecipeLikeDiscount) => void;
  clearDiscount: () => void;
}

export const useRecipeDiscountStore = create<RecipeDiscountState>()(
  persist(
    (set) => ({
      appliedDiscount: null,
      applyDiscount: (discount) => set({ appliedDiscount: discount }),
      clearDiscount: () => set({ appliedDiscount: null }),
    }),
    {
      name: "recipe-like-discount",
      version: 1,
    },
  ),
);
