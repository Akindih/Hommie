import { ShowCard } from "@/components/ShowCard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: shows, error } = await supabase
    .from("shows")
    .select("slug, title, season, year, cover_image_url, brands(name), looks(image_url)")
    .order("show_date", { ascending: false, nullsFirst: false })
    .order("look_number", { referencedTable: "looks", ascending: true })
    .limit(1, { referencedTable: "looks" })
    .limit(48);

  if (error) {
    return <p className="text-red-600">Could not load shows: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Shows</h1>
      {shows.length === 0 ? (
        <p className="text-neutral-500">No shows yet. Add some in the Supabase dashboard.</p>
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
