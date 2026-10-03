"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { ContentKey, ContentMap } from "@/types";
import { defaultContent, withSiteDefaults } from "@/lib/content";
import { collections, type Ctx, findMissing } from "@/lib/admin/schema";
import { deleteImages, getSupabase } from "@/lib/admin/supabase";
import { clone, collectImageUrls, type Doc, shortId } from "@/lib/admin/utils";
import { CONTENT_TABLE } from "@/lib/supabase/config";
import { CollectionEditor } from "./CollectionEditor";
import { Fields, type MediaApi, smallButton } from "./Fields";

type Saved = Partial<Record<ContentKey, unknown>>;

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function fillDefaults(saved: Saved): ContentMap {
  return {
    site: saved.site ? withSiteDefaults(saved.site as Partial<ContentMap["site"]>) : clone(defaultContent.site),
    members: (saved.members as ContentMap["members"]) ?? clone(defaultContent.members),
    teams: (saved.teams as ContentMap["teams"]) ?? clone(defaultContent.teams),
    events: (saved.events as ContentMap["events"]) ?? clone(defaultContent.events),
    sponsors: (saved.sponsors as ContentMap["sponsors"]) ?? clone(defaultContent.sponsors),
    alumni: (saved.alumni as ContentMap["alumni"]) ?? clone(defaultContent.alumni),
  };
}

/** Reads every saved section from Supabase */
async function fetchSaved(): Promise<{ rows?: Saved; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: "Supabase is not set up" };
  const { data, error } = await supabase.from(CONTENT_TABLE).select("key,data");
  if (error) return { error: error.message };
  return { rows: Object.fromEntries((data ?? []).map((r: { key: ContentKey; data: unknown }) => [r.key, r.data])) as Saved };
}

export function Dashboard({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const supabase = getSupabase();
  const [saved, setSaved] = useState<Saved | null>(null);
  const [draft, setDraft] = useState<ContentMap | null>(null);
  const [active, setActive] = useState<ContentKey>("site");
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string; list?: string[] } | null>(null);
  const removed = useRef(new Set<string>());

  const applyLoaded = useCallback((result: { rows?: Saved; error?: string }) => {
    if (result.error) return setLoadError(result.error);
    setLoadError("");
    setSaved(result.rows ?? {});
    setDraft(fillDefaults(result.rows ?? {}));
  }, []);

  useEffect(() => {
    // Load the saved content once when the dashboard opens
    let cancelled = false;
    fetchSaved().then((result) => !cancelled && applyLoaded(result));
    return () => {
      cancelled = true;
    };
  }, [applyLoaded]);

  const baseline = useMemo(() => (saved ? fillDefaults(saved) : null), [saved]);
  const dirty = (key: ContentKey) => Boolean(draft && baseline && !same(draft[key], baseline[key]));
  const anyDirty = collections.some((c) => dirty(c.key));

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (!anyDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [anyDirty]);

  const media: MediaApi = useMemo(() => ({ markRemoved: (url) => url && removed.current.add(url) }), []);

  if (!supabase) return null;
  if (loadError)
    return (
      <div className="mx-auto max-w-xl p-8">
        <p className="font-bold">Could not load the content.</p>
        <p className="mt-2 text-muted">{loadError}</p>
        <p className="mt-2 text-sm text-muted">If this is a new Supabase project, run supabase/setup.sql first (see the README).</p>
        <button
          type="button"
          className={`${smallButton} mt-4`}
          onClick={() => fetchSaved().then(applyLoaded)}
        >
          Try again
        </button>
      </div>
    );
  if (!draft || !saved) return <p className="p-8 text-muted">Loading content…</p>;

  const config = collections.find((c) => c.key === active)!;
  const ctx: Ctx = { content: draft };
  const value = draft[active] as unknown;
  const setValue = (v: unknown) => setDraft({ ...draft, [active]: v } as ContentMap);

  async function save() {
    if (!draft || !supabase) return;
    const missing =
      config.kind === "single"
        ? findMissing(config.fields, value)
        : (value as Doc[]).flatMap((item) => findMissing(config.fields, item, config.title?.(item) ?? "Item"));
    if (missing.length) {
      setNotice({ kind: "error", text: "Some required fields are empty:", list: missing.slice(0, 12) });
      return;
    }

    setBusy(true);
    setNotice(null);
    const data = config.prepare ? config.prepare(value, ctx) : value;
    const { error } = await supabase.from(CONTENT_TABLE).upsert({ key: active, data, updated_at: new Date().toISOString() });
    if (error) {
      setBusy(false);
      const denied = /row-level security|permission|not allowed/i.test(error.message);
      setNotice({ kind: "error", text: denied ? "Only the NCSS admin account can save changes." : `Could not save: ${error.message}` });
      return;
    }

    const nextDraft = { ...draft, [active]: data } as ContentMap;
    setDraft(nextDraft);
    setSaved({ ...saved, [active]: data });

    // Delete images that were replaced or removed and are no longer used anywhere
    const inUse = new Set(collectImageUrls(nextDraft));
    const unused = [...removed.current].filter((u) => !inUse.has(u));
    removed.current = new Set([...removed.current].filter((u) => inUse.has(u)));
    await deleteImages(unused).catch(() => undefined);

    // Ask the website to rebuild its pages with the new content
    const res = await fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } }).catch(() => null);
    setBusy(false);
    setNotice({
      kind: "ok",
      text: res?.ok
        ? `${config.label} saved and published. Refresh the website to see it.`
        : `${config.label} saved. The website will show it within a few minutes.`,
    });
  }

  function discard() {
    if (!baseline || !draft) return;
    if (!window.confirm("Throw away your unsaved changes in this section?")) return;
    setDraft({ ...draft, [active]: clone(baseline[active]) } as ContentMap);
    setNotice(null);
  }

  /** Copies the current leadership and every team lead into Alumni (the yearly handover) */
  function addCurrentCabinet() {
    if (!draft) return;
    const year = draft.site.currentYear;
    const current = draft.members.filter((m) => m.year === year);
    const president = current.find((m) => m.role === "President");
    const vp = current.find((m) => m.role === "Vice President");
    if (!president || !vp) {
      setNotice({ kind: "error", text: `No President and Vice President found for ${year} in Leadership & members.` });
      return;
    }
    if (draft.alumni.some((a) => a.year === year) && !window.confirm(`Alumni already has a ${year} cabinet. Replace it?`)) return;
    const person = (m: (typeof current)[number]) => ({ id: `a-${m.id}-${shortId()}`, name: m.name, photo: m.photo, socials: m.socials });
    const others = current.filter((m) => m.role === "Leadership").map((m) => ({ ...person(m), title: m.title?.trim() || "Cabinet" }));
    const leads = draft.teams.flatMap((t) =>
      current.filter((m) => m.teamSlug === t.slug && m.role === "Team Lead").map((lead) => ({ ...person(lead), teamSlug: t.slug, teamName: t.name })),
    );
    setDraft({
      ...draft,
      alumni: [
        { year, president: person(president), vicePresident: person(vp), others, leads },
        ...draft.alumni.filter((a) => a.year !== year),
      ],
    });
    setNotice({
      kind: "ok",
      text: `The ${year} cabinet was added to Alumni. Press “Save & publish”. Then set the new year in Site & home page and update Leadership & members.`,
    });
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="font-display text-lg font-extrabold">
            NCSS <span className="font-sans text-sm font-semibold text-muted">Admin</span>
          </p>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className={smallButton}>
              View website ↗
            </Link>
            <span className="hidden text-sm text-muted md:inline">{session.user.email}</span>
            <button type="button" className={smallButton} onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-10">
        {/* Section menu */}
        <nav aria-label="Sections">
          <select
            aria-label="Choose a section"
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 font-semibold lg:hidden"
            value={active}
            onChange={(e) => {
              setActive(e.target.value as ContentKey);
              setNotice(null);
            }}
          >
            {collections.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
                {dirty(c.key) ? " (unsaved)" : ""}
              </option>
            ))}
          </select>
          <ul className="hidden gap-1 lg:grid">
            {collections.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  aria-current={active === c.key ? "page" : undefined}
                  onClick={() => {
                    setActive(c.key);
                    setNotice(null);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left font-semibold transition-colors ${
                    active === c.key ? "bg-brand-deep text-white" : "hover:bg-tint"
                  }`}
                >
                  {c.label}
                  {dirty(c.key) && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-pop" aria-label="unsaved changes" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 pb-28">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{config.label}</h1>
          <p className="mt-2 max-w-[65ch] text-muted">{config.description}</p>

          {!(active in saved) && (
            <p className="mt-4 rounded-2xl bg-tint p-4 text-sm">
              This section still shows the starter content from the code. Edit it and press “Save & publish” to take it over.
            </p>
          )}

          {active === "alumni" && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-bold">Yearly handover:</span> copy the current {draft.site.currentYear} leadership and team leads into Alumni.
              </p>
              <button type="button" className={smallButton} onClick={addCurrentCabinet}>
                Add current cabinet to Alumni
              </button>
            </div>
          )}

          <div className="mt-8">
            {config.kind === "single" ? (
              <div className="rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-8">
                <Fields fields={config.fields} value={value as Doc} onChange={setValue} ctx={ctx} media={media} />
              </div>
            ) : (
              <CollectionEditor config={config} items={value as Doc[]} onChange={setValue} ctx={ctx} media={media} />
            )}
          </div>
        </main>
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1 text-sm" role="status" aria-live="polite">
            {notice ? (
              <div className={notice.kind === "error" ? "font-semibold text-link" : "font-semibold"}>
                {notice.text}
                {notice.list && <span className="block font-normal text-muted">{notice.list.join(" · ")}</span>}
              </div>
            ) : dirty(active) ? (
              <span className="font-semibold">You have unsaved changes in {config.label}.</span>
            ) : (
              <span className="text-muted">All changes in {config.label} are saved.</span>
            )}
          </div>
          <button type="button" className={smallButton} onClick={discard} disabled={!dirty(active) || busy}>
            Discard
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy || (!dirty(active) && active in saved)}
            className="inline-flex min-h-11 items-center rounded-full bg-brand-deep px-6 font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save & publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
