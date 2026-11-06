"use client";

import { useActionState, useState } from "react";
import { signIn, signUp } from "./actions";

const input =
  "w-full rounded border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700";

export function AuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [state, action, pending] = useActionState(mode === "signin" ? signIn : signUp, undefined);

  return (
    <form action={action} className="space-y-4">
      <h1 className="text-2xl font-semibold">
        {mode === "signin" ? "Sign in" : "Create an account"}
      </h1>
      <input type="hidden" name="next" value={next} />

      {mode === "signup" && (
        <label className="block space-y-1">
          <span className="text-sm">Username</span>
          <input name="username" required minLength={3} maxLength={30} className={input} />
        </label>
      )}
      <label className="block space-y-1">
        <span className="text-sm">Email</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          className={input}
        />
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.message && <p className="text-sm text-green-700">{state.message}</p>}

      <button
        disabled={pending}
        className="w-full rounded bg-foreground px-3 py-2 text-background disabled:opacity-50"
      >
        {pending ? "…" : mode === "signin" ? "Sign in" : "Sign up"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="w-full text-sm underline"
      >
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
