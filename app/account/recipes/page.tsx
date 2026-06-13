// apps/web/app/account/recipes/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "react-feather";
import { useLoaderStore } from "@/store/useLoaderStore";

type Recipe = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "pending" | "published" | "rejected";
  thumbnail_url?: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  draft: "bg-gray-200 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");

  const { show, hide } = useLoaderStore();

  // ------------------------
  // LOAD RECIPES
  // ------------------------
  const loadRecipes = async (customPage = page) => {
    try {
      setLoading(true);
      show("Loading your recipes...");

      const params = new URLSearchParams();

      params.append("page", String(customPage));

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const res = await fetch(`/api/account/recipes?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error);

      setRecipes(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(data.pagination?.page || 1);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setLoading(false);
      hide();
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  // ------------------------
  // DELETE RECIPE
  // ------------------------
  const deleteRecipe = async (id: string) => {
    if (!confirm("Delete this recipe?")) return;

    // 1. instantly remove from UI
    const previous = recipes;
    setRecipes((prev) => prev.filter((r) => r.id !== id));

    try {
      show("Deleting recipe...");

      const res = await fetch(`/api/account/recipes/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error);
      }
    } catch (err) {
      console.error(err);

      // rollback if error
      setRecipes(previous);

      alert("Failed to delete recipe");
    } finally {
      hide();
    }
  };

  // ------------------------
  // UI
  // ------------------------
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">My Recipes</h1>
          <p className="text-sm text-gray-500">Manage your submitted recipes</p>
        </div>

        <Link
          href="/account/recipes/new"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
        >
          <Plus size={16} />
          Add Recipe
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />

        {/* STATUS FILTER */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
        </select>

        <button
          onClick={() => loadRecipes(1)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Filter
        </button>
      </div>

      {/* EMPTY STATE */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-20 border rounded-xl bg-gray-50 mt-4">
          <p className="text-gray-500 mb-4">No recipes yet</p>

          <Link
            href="/account/recipes/new"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Create your first recipe
          </Link>
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-xl p-4 flex items-center justify-between bg-white"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              {recipe.thumbnail_url ? (
                <img
                  src={recipe.thumbnail_url}
                  className="w-16 h-16 rounded-lg object-cover"
                  alt={recipe.title}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              )}

              <div>
                <h3 className="font-semibold">{recipe.title}</h3>

                <p className="text-xs text-gray-500">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    statusStyles[recipe.status]
                  }`}
                >
                  {recipe.status}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              {recipe.status === "published" && (
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className={`p-2 ${
                    recipe.status === "published"
                      ? "text-gray-600 hover:text-black"
                      : "text-gray-300 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <Eye size={16} />
                </Link>
              )}

              <Link
                href={`/account/recipes/${recipe.id}`}
                className="p-2 text-blue-600"
              >
                <Edit size={16} />
              </Link>

              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="p-2 text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => loadRecipes(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => loadRecipes(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "react-feather";
import { useLoaderStore } from "@/store/useLoaderStore";

type Recipe = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "pending" | "published" | "rejected";
  thumbnail_url?: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  draft: "bg-gray-200 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { show, hide } = useLoaderStore();

  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      show("Loading your recipes...");

      const res = await fetch("/api/account/recipes");
      const data = await res.json();

      setRecipes(data.recipes || []);
    } catch (err) {
      console.error(err);
      show("Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
      hide();
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const deleteRecipe = async (id: string) => {
    if (!confirm("Delete this recipe?")) return;

    await fetch(`/api/account/recipes/${id}`, {
      method: "DELETE",
    });

    loadRecipes();
  };

  return (
    <div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">My Recipes</h1>
          <p className="text-sm text-gray-500">Manage your submitted recipes</p>
        </div>

        <Link
          href="/account/recipes/new"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
        >
          <Plus size={16} />
          Add Recipe
        </Link>
      </div>


      {!loading && recipes.length === 0 && (
        <div className="text-center py-20 border rounded-xl bg-gray-50">
          <p className="text-gray-500 mb-4">No recipes yet</p>

          <Link
            href="/account/recipes/new"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Create your first recipe
          </Link>
        </div>
      )}


      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-xl p-4 flex items-center justify-between bg-white"
          >

            <div className="flex items-center gap-4">
              {recipe.thumbnail_url ? (
                <img
                  src={recipe.thumbnail_url}
                  className="w-16 h-16 rounded-lg object-cover"
                  alt={recipe.title}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              )}

              <div>
                <h3 className="font-semibold">{recipe.title}</h3>

                <p className="text-xs text-gray-500">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${statusStyles[recipe.status]}`}
                >
                  {recipe.status}
                </span>
              </div>
            </div>


            <div className="flex items-center gap-2">
              <Link
                href={`/recipes/${recipe.slug}`}
                className="p-2 text-gray-600 hover:text-black"
              >
                <Eye size={16} />
              </Link>

              <Link
                href={`/account/recipes/${recipe.id}/edit`}
                className="p-2 text-blue-600"
              >
                <Edit size={16} />
              </Link>

              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="p-2 text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 */
