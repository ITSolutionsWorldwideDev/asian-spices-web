import { runQuery } from "@/core/db";

function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export async function getYoutubeVideoStats(videoId?: string | null) {
  if (!videoId) {
    return { duration: "", views: 0, likes: 0 };
  }

  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      return { duration: "", views: 0, likes: 0 };
    }

    const html = await res.text();

    let duration = "";
    const secondsMatch = html.match(/"lengthSeconds":"(\d+)"/);
    if (secondsMatch) {
      duration = formatClock(Number(secondsMatch[1]));
    } else {
      const msMatch = html.match(/"approxDurationMs":"(\d+)"/);
      if (msMatch) {
        duration = formatClock(Number(msMatch[1]) / 1000);
      }
    }

    const viewsMatch =
      html.match(/"viewCount":"(\d+)"/) ||
      html.match(/"views":\{"simpleText":"([\d,]+)/);
    const likesMatch =
      html.match(/"likeCount":"(\d+)"/) ||
      html.match(/"likes":\{"simpleText":"([\d,]+)/);

    const views = viewsMatch
      ? Number(String(viewsMatch[1]).replace(/,/g, "")) || 0
      : 0;
    const likes = likesMatch
      ? Number(String(likesMatch[1]).replace(/,/g, "")) || 0
      : 0;

    return { duration, views, likes };
  } catch {
    return { duration: "", views: 0, likes: 0 };
  }
}

export async function getYoutubeDurationLabel(videoId?: string | null) {
  const stats = await getYoutubeVideoStats(videoId);
  return stats.duration;
}

export async function getRecipeViewCount(recipeId: string) {
  const { rows } = await runQuery(
    `
    SELECT COUNT(*)::int AS total
    FROM recipe_views
    WHERE recipe_id = $1
    `,
    [recipeId],
  );

  return rows[0]?.total || 0;
}

export async function getRecipeFavoriteCount(recipeId: string) {
  const { rows } = await runQuery(
    `
    SELECT COUNT(*)::int AS total
    FROM recipe_favorites
    WHERE recipe_id = $1
    `,
    [recipeId],
  );

  return rows[0]?.total || 0;
}

export async function isRecipeFavorited(
  recipeId: string,
  userId: string,
) {
  const customerId = await resolveCustomerId(userId);

  if (!customerId) return false;

  const { rows } = await runQuery(
    `
    SELECT 1
    FROM recipe_favorites
    WHERE recipe_id = $1
      AND customer_id = $2
    LIMIT 1
    `,
    [recipeId, customerId],
  );

  return rows.length > 0;
}

async function resolveCustomerId(userId: string) {
  const { rows } = await runQuery(
    `
    SELECT id
    FROM store_customers
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId],
  );

  return (rows[0]?.id as string) || null;
}

async function resolveFavoriteTenantId(recipeId: string) {
  const recipeRes = await runQuery(
    `
    SELECT tenant_id
    FROM recipes
    WHERE id = $1
    LIMIT 1
    `,
    [recipeId],
  );

  if (recipeRes.rows[0]?.tenant_id) {
    return recipeRes.rows[0].tenant_id as string;
  }

  const tenantRes = await runQuery(
    `
    SELECT id
    FROM tenants
    ORDER BY created_at ASC NULLS LAST
    LIMIT 1
    `,
  );

  return (tenantRes.rows[0]?.id as string) || null;
}

export async function addRecipeFavorite(
  recipeId: string,
  userId: string,
) {
  const customerId = await resolveCustomerId(userId);

  if (!customerId) {
    throw new Error("Customer account not found");
  }

  const tenantId = await resolveFavoriteTenantId(recipeId);

  if (!tenantId) {
    throw new Error("Unable to resolve tenant for this favorite");
  }

  await runQuery(
    `
    INSERT INTO recipe_favorites (
      recipe_id,
      customer_id,
      tenant_id
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (recipe_id, customer_id) DO NOTHING
    `,
    [recipeId, customerId, tenantId],
  );

  return getRecipeFavoriteCount(recipeId);
}

export async function removeRecipeFavorite(
  recipeId: string,
  userId: string,
) {
  const customerId = await resolveCustomerId(userId);

  if (!customerId) {
    throw new Error("Customer account not found");
  }

  await runQuery(
    `
    DELETE FROM recipe_favorites
    WHERE recipe_id = $1
      AND customer_id = $2
    `,
    [recipeId, customerId],
  );

  return getRecipeFavoriteCount(recipeId);
}

export async function toggleRecipeFavorite(
  recipeId: string,
  userId: string,
) {
  const customerId = await resolveCustomerId(userId);

  if (!customerId) {
    throw new Error("Customer account not found");
  }

  const alreadySaved = await isRecipeFavorited(recipeId, userId);

  const count = alreadySaved
    ? await removeRecipeFavorite(recipeId, userId)
    : await addRecipeFavorite(recipeId, userId);

  return {
    saved: !alreadySaved,
    count,
  };
}
