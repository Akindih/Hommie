"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/shows/${slug}`);
  return { supabase, user };
}

export type LogState = { error?: string; saved?: boolean } | undefined;

/** Create or update the signed-in user's rating/review/like for a show. */
export async function saveLog(
  showId: string,
  slug: string,
  _prev: LogState,
  formData: FormData,
): Promise<LogState> {
  const { supabase, user } = await requireUser(slug);

  const ratingRaw = Number(formData.get("rating"));
  const rating = Number.isInteger(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 10 ? ratingRaw : null;
  const review = String(formData.get("review") ?? "").trim() || null;
  const liked = formData.get("liked") === "on";

  if (!rating && !review && !liked) {
    return { error: "Add a rating, a review or a like." };
  }

  const { error } = await supabase
    .from("logs")
    .upsert(
      { user_id: user.id, show_id: showId, rating, review_text: review, liked },
      { onConflict: "user_id,show_id" },
    );
  if (error) return { error: error.message };

  // Logging a show removes it from the watchlist, like Letterboxd.
  await supabase.from("watchlist").delete().match({ user_id: user.id, show_id: showId });

  revalidatePath(`/shows/${slug}`);
  return { saved: true };
}

export async function deleteLog(showId: string, slug: string) {
  const { supabase, user } = await requireUser(slug);
  await supabase.from("logs").delete().match({ user_id: user.id, show_id: showId });
  revalidatePath(`/shows/${slug}`);
}

export async function toggleWatchlist(showId: string, slug: string, onList: boolean) {
  const { supabase, user } = await requireUser(slug);
  if (onList) {
    await supabase.from("watchlist").delete().match({ user_id: user.id, show_id: showId });
  } else {
    await supabase.from("watchlist").insert({ user_id: user.id, show_id: showId });
  }
  revalidatePath(`/shows/${slug}`);
  revalidatePath("/watchlist");
}
