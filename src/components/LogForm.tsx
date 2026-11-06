"use client";

import { useActionState } from "react";
import { saveLog, deleteLog } from "@/app/shows/[slug]/actions";
import { StarInput } from "./StarInput";

type Existing = { rating: number | null; review_text: string | null; liked: boolean } | null;

export function LogForm({ showId, slug, existing }: { showId: string; slug: string; existing: Existing }) {
  const [state, action, pending] = useActionState(saveLog.bind(null, showId, slug), undefined);

  return (
    <form action={action} className="space-y-3 rounded border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="font-medium">{existing ? "Your log" : "Rate & review"}</h2>
      <StarInput defaultValue={existing?.rating} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="liked" defaultChecked={existing?.liked} /> Like
      </label>
      <textarea
        name="review"
        rows={4}
        maxLength={10000}
        defaultValue={existing?.review_text ?? ""}
        placeholder="Write a review…"
        className="w-full rounded border border-neutral-300 bg-transparent p-2 text-sm dark:border-neutral-700"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.saved && !pending && <p className="text-sm text-green-700">Saved.</p>}
      <div className="flex gap-3">
        <button
          disabled={pending}
          className="rounded bg-foreground px-4 py-1.5 text-sm text-background disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={() => deleteLog(showId, slug)}
            className="text-sm text-neutral-500 underline"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
