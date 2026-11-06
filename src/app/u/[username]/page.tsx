import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { starString } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
  if (!profile) notFound();

  const { data: logs } = await supabase
    .from("logs")
    .select("id, rating, review_text, liked, logged_at, shows(slug, title, brands(name))")
    .eq("user_id", profile.id)
    .order("logged_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">{profile.display_name ?? profile.username}</h1>
        <p className="text-neutral-500">@{profile.username}</p>
        {profile.bio && <p className="mt-2 max-w-xl">{profile.bio}</p>}
      </header>

      <section>
        <h2 className="mb-4 font-medium">Diary ({logs?.length ?? 0})</h2>
        {logs && logs.length > 0 ? (
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {logs.map((log) => (
              <li key={log.id} className="py-3">
                <div className="flex items-baseline gap-3">
                  <span className="w-24 shrink-0 text-xs text-neutral-500">
                    {new Date(log.logged_at).toLocaleDateString()}
                  </span>
                  <Link href={`/shows/${log.shows?.slug}`} className="font-medium">
                    {log.shows?.brands?.name} — {log.shows?.title}
                  </Link>
                  <span className="text-amber-500">{starString(log.rating)}</span>
                  {log.liked && <span>♥</span>}
                </div>
                {log.review_text && (
                  <p className="ml-27 mt-1 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                    {log.review_text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">Nothing logged yet.</p>
        )}
      </section>
    </div>
  );
}
