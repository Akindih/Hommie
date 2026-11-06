import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogForm } from "@/components/LogForm";
import { starString, toEmbedUrl } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { toggleWatchlist } from "./actions";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("shows").select("title, brands(name)").eq("slug", slug).maybeSingle();
  return { title: data ? `${data.brands?.name} — ${data.title}` : "Show not found" };
}

export default async function ShowPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: show } = await supabase
    .from("shows")
    .select("*, brands(name, slug, type, institution), looks(*)")
    .eq("slug", slug)
    .order("look_number", { referencedTable: "looks", ascending: true })
    .maybeSingle();
  if (!show) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: stats }, { data: reviews }, { data: myLog }, { data: onWatchlist }] = await Promise.all([
    supabase.from("show_stats").select("*").eq("show_id", show.id).maybeSingle(),
    supabase
      .from("logs")
      .select("id, rating, review_text, liked, logged_at, profiles(username, display_name)")
      .eq("show_id", show.id)
      .not("review_text", "is", null)
      .order("logged_at", { ascending: false })
      .limit(50),
    user
      ? supabase.from("logs").select("rating, review_text, liked").match({ user_id: user.id, show_id: show.id }).maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from("watchlist").select("show_id").match({ user_id: user.id, show_id: show.id }).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  // Only show media we're licensed for (see licence_status in the schema).
  const embedUrl = show.licence_status !== "none" ? toEmbedUrl(show.video_url) : null;
  const showLooks = show.licence_status === "licensed";

  return (
    <article className="space-y-10">
      {embedUrl && (
        <div className="aspect-video w-full overflow-hidden rounded bg-black">
          <iframe
            src={embedUrl}
            title={`${show.title} video`}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-neutral-500">
            {show.brands?.name}
            {show.brands?.institution && ` · ${show.brands.institution}`}
          </p>
          <h1 className="text-3xl font-semibold">{show.title}</h1>
          <p className="text-sm text-neutral-500">
            {[show.season, show.event, show.show_date].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="text-right text-sm">
          {stats?.avg_rating != null && (
            <p className="text-2xl">
              {(Number(stats.avg_rating) / 2).toFixed(1)} <span className="text-amber-500">★</span>
            </p>
          )}
          <p className="text-neutral-500">
            {stats?.rating_count ?? 0} ratings · {stats?.like_count ?? 0} likes
          </p>
        </div>
      </header>

      {show.description && <p className="max-w-2xl">{show.description}</p>}

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <section>
          <h2 className="mb-4 font-medium">Looks</h2>
          {showLooks && show.looks.length > 0 ? (
            <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {show.looks.map((look) => (
                <li key={look.id}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded bg-neutral-200 dark:bg-neutral-800">
                    {look.image_url && (
                      <Image
                        src={look.image_url}
                        alt={`Look ${look.look_number}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Look {look.look_number}
                    {look.photographer_credit && ` · 📷 ${look.photographer_credit}`}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-neutral-500">Looks aren&apos;t available for this show yet.</p>
          )}
        </section>

        <aside className="space-y-4">
          {user ? (
            <>
              <LogForm showId={show.id} slug={slug} existing={myLog} />
              {!myLog && (
                <form action={toggleWatchlist.bind(null, show.id, slug, !!onWatchlist)}>
                  <button className="w-full rounded border border-neutral-300 px-4 py-1.5 text-sm dark:border-neutral-700">
                    {onWatchlist ? "✓ On your watchlist" : "+ Add to watchlist"}
                  </button>
                </form>
              )}
            </>
          ) : (
            <p className="rounded border border-neutral-200 p-4 text-sm dark:border-neutral-800">
              <Link href={`/login?next=/shows/${slug}`} className="underline">
                Sign in
              </Link>{" "}
              to rate, review or save this show.
            </p>
          )}
        </aside>
      </div>

      <section>
        <h2 className="mb-4 font-medium">Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-neutral-200 pb-4 dark:border-neutral-800">
                <p className="text-sm">
                  <Link href={`/u/${r.profiles?.username}`} className="font-medium">
                    {r.profiles?.display_name ?? r.profiles?.username}
                  </Link>{" "}
                  <span className="text-amber-500">{starString(r.rating)}</span>
                  {r.liked && " ♥"}
                </p>
                <p className="mt-1 whitespace-pre-line">{r.review_text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">No reviews yet.</p>
        )}
      </section>
    </article>
  );
}
