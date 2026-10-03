"use client";

import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/admin/supabase";
import { inputClass } from "./Fields";

type Mode = "signin" | "signup" | "forgot";

const primaryButton =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-deep px-6 font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong disabled:opacity-60";

/** Turns Supabase error messages into plain English */
function friendly(message: string): string {
  if (/database error saving new user|only allowed|not allowed/i.test(message)) return "Only the official NCSS admin email can create an account.";
  if (/invalid login credentials/i.test(message)) return "Email or password is wrong.";
  if (/email not confirmed/i.test(message)) return "Please confirm your email first. Check your inbox for the link.";
  if (/password should be at least/i.test(message)) return "Password must be at least 8 characters.";
  if (/already registered/i.test(message)) return "This email already has an account. Sign in instead.";
  return message;
}

export function AuthScreen() {
  const supabase = getSupabase();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const redirectTo = `${window.location.origin}/admin`;

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ kind: "error", text: friendly(error.message) });
    } else if (mode === "signup") {
      if (password.length < 8) {
        setMessage({ kind: "error", text: "Password must be at least 8 characters." });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
        if (error) setMessage({ kind: "error", text: friendly(error.message) });
        else if (!data.session) setMessage({ kind: "ok", text: "Account created. Open the confirmation email we sent you, then sign in here." });
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      setMessage(error ? { kind: "error", text: friendly(error.message) } : { kind: "ok", text: "If this is the admin email, a reset link is on its way." });
    }
    setBusy(false);
  }

  const tabs: { id: Mode; label: string }[] = [
    { id: "signin", label: "Sign in" },
    { id: "signup", label: "Create account" },
  ];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-xl ring-1 ring-line sm:p-8">
        <p className="font-display text-3xl font-extrabold tracking-tight">NCSS Admin</p>
        <p className="mt-1 text-sm text-muted">For the official NCSS admin account only.</p>

        {mode !== "forgot" && (
          <div role="tablist" aria-label="Sign in or create account" className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-tint p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={mode === t.id}
                onClick={() => {
                  setMode(t.id);
                  setMessage(null);
                }}
                className={`min-h-10 rounded-full text-sm font-semibold transition-colors ${mode === t.id ? "bg-brand-deep text-white" : "hover:bg-surface"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 grid gap-4">
          {mode === "forgot" && <p className="text-sm">Enter the admin email and we will send a link to set a new password.</p>}
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold">
              Email
            </label>
            <input id="admin-email" type="email" autoComplete="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode !== "forgot" && (
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                minLength={mode === "signup" ? 8 : undefined}
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "signup" && <p className="mt-1.5 text-sm text-muted">At least 8 characters.</p>}
            </div>
          )}

          {message && (
            <p role="alert" className={`rounded-2xl p-3 text-sm ${message.kind === "error" ? "bg-pop/30 font-semibold" : "bg-tint"}`}>
              {message.text}
            </p>
          )}

          <button type="submit" className={primaryButton} disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
          </button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm font-semibold text-link underline-offset-4 hover:underline"
          onClick={() => {
            setMode(mode === "forgot" ? "signin" : "forgot");
            setMessage(null);
          }}
        >
          {mode === "forgot" ? "Back to sign in" : "Forgot password?"}
        </button>
      </div>
    </div>
  );
}

/** Shown after clicking the reset link in the email */
export function NewPasswordScreen({ onDone }: { onDone: () => void }) {
  const supabase = getSupabase();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(friendly(error.message));
    else onDone();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 py-12">
      <form onSubmit={submit} className="grid w-full max-w-md gap-4 rounded-3xl bg-surface p-6 shadow-xl ring-1 ring-line sm:p-8">
        <p className="font-display text-2xl font-extrabold">Set a new password</p>
        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-semibold">
            New password
          </label>
          <input id="new-password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && (
          <p role="alert" className="rounded-2xl bg-pop/30 p-3 text-sm font-semibold">
            {error}
          </p>
        )}
        <button type="submit" className={primaryButton} disabled={busy}>
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
