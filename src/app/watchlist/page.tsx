import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShowCard } from "@/components/ShowCard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Watchlist" };

export default async function WatchlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/watchlist");

  const { data: items } = await supabase
    .from("watchlist")
    .select("added_at, shows(slug, title, season, year, cover_image_url, brands(name), looks(image_url))")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false })
    .order("look_number", { referencedTable: "shows.looks", ascending: true })
    .limit(1, { referencedTable: "shows.looks" });

  const shows = (items ?? []).flatMap((i) => (i.shows ? [i.shows] : []));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Your watchlist</h1>
      {shows.length === 0 ? (
        <p className="text-neutral-500">Nothing here yet. Add shows from their pages.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {shows.map((show) => (
            <ShowCard key={show.slug} show={show} />
          ))}
        </div>
      )}
    </div>
  );
}
