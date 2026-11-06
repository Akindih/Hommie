"use client";

import { useState } from "react";

/** Half-star rating input. Submits a hidden `rating` field with a value of 1–10. */
export function StarInput({ name = "rating", defaultValue }: { name?: string; defaultValue?: number | null }) {
  const [value, setValue] = useState<number>(defaultValue ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div className="flex items-center gap-3">
      <input type="hidden" name={name} value={value || ""} />
      <div className="flex text-3xl leading-none" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = shown >= star * 2 ? 100 : shown === star * 2 - 1 ? 50 : 0;
          return (
            <span key={star} className="relative inline-block w-[1em] select-none">
              <span className="text-neutral-300 dark:text-neutral-700">★</span>
              <span
                className="absolute inset-0 overflow-hidden text-amber-500"
                style={{ width: `${fill}%` }}
                aria-hidden
              >
                ★
              </span>
              {/* Left half = half star, right half = full star */}
              {[star * 2 - 1, star * 2].map((v, i) => (
                <button
                  key={v}
                  type="button"
                  aria-label={`${v / 2} stars`}
                  onMouseEnter={() => setHover(v)}
                  onClick={() => setValue(value === v ? 0 : v)}
                  className={`absolute top-0 h-full w-1/2 ${i === 0 ? "left-0" : "right-0"}`}
                />
              ))}
            </span>
          );
        })}
      </div>
      <span className="w-8 text-sm text-neutral-500">{shown ? shown / 2 : ""}</span>
    </div>
  );
}
