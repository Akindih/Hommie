import Image from "next/image";
import Link from "next/link";

export type ShowCardData = {
  slug: string;
  title: string;
  season: string | null;
  year: number | null;
  cover_image_url: string | null;
  brands: { name: string } | null;
  looks?: { image_url: string | null }[];
};

export function ShowCard({ show }: { show: ShowCardData }) {
  // Use the cover image, falling back to the first look.
  const img = show.cover_image_url ?? show.looks?.[0]?.image_url ?? null;
  return (
    <Link href={`/shows/${show.slug}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded bg-neutral-200 dark:bg-neutral-800">
        {img && (
          <Image
            src={img}
            alt={show.title}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover transition group-hover:scale-105"
          />
        )}
      </div>
      <p className="mt-2 text-sm font-medium">{show.brands?.name}</p>
      <p className="text-xs text-neutral-500">
        {show.title}
        {show.season && ` · ${show.season}`}
      </p>
    </Link>
  );
}
