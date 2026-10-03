"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/admin/supabase";
import { AuthScreen, NewPasswordScreen } from "./AuthScreen";
import { Dashboard } from "./Dashboard";
import { smallButton } from "./Fields";

/** Decides what the admin sees: setup help, sign in, or the dashboard. */
export function AdminApp() {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  // Double-check with the database that this login is the admin
  useEffect(() => {
    if (!supabase || !session) return;
    let cancelled = false;
    supabase.rpc("is_admin").then(({ data }) => {
      if (!cancelled) setIsAdmin(data === true);
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, session]);

  const signOut = async () => {
    await supabase?.auth.signOut();
    setIsAdmin(null);
  };

  if (!supabase) return <SetupNeeded />;
  if (session === undefined) return <p className="p-8 text-muted">Loading…</p>;
  if (recovering && session) return <NewPasswordScreen onDone={() => setRecovering(false)} />;
  if (!session) return <AuthScreen />;
  if (isAdmin === null) return <p className="p-8 text-muted">Checking your account…</p>;

  if (!isAdmin)
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-surface p-8 text-center ring-1 ring-line">
          <p className="font-display text-2xl font-extrabold">Not the admin account</p>
          <p className="mt-2 text-muted">You are signed in as {session.user.email}, which is not the NCSS admin email.</p>
          <button type="button" className={`${smallButton} mt-6`} onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    );

  return <Dashboard session={session} onSignOut={signOut} />;
}

function SetupNeeded() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold">Admin panel is not connected yet</h1>
      <p className="mt-4 text-muted">
        Add <code className="rounded bg-tint px-1.5 py-0.5 text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="rounded bg-tint px-1.5 py-0.5 text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code className="rounded bg-tint px-1.5 py-0.5 text-ink">.env.local</code>{" "}
        (and to Vercel&apos;s environment variables), then restart. The README has the full steps under “Admin panel setup”.
      </p>
    </div>
  );
}
