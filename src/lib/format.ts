/** Ratings are stored as 1–10 and displayed as 0.5–5 stars. */
export function ratingToStars(rating: number): number {
  return rating / 2;
}

/** e.g. 7 → "★★★½" */
export function starString(rating: number | null | undefined): string {
  if (!rating) return "";
  const full = Math.floor(rating / 2);
  return "★".repeat(full) + (rating % 2 ? "½" : "");
}

/**
 * Turns a YouTube or Vimeo URL into an embeddable player URL.
 * Returns null for anything else so we never embed unknown sites.
 */
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = u.pathname.match(/^\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "player.vimeo.com") return url;
  return null;
}
