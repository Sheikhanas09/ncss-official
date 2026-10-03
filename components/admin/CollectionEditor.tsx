"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { type CollectionConfig, type Ctx, findMissing } from "@/lib/admin/schema";
import { clone, collectImageUrls, type Doc, moveItem, str } from "@/lib/admin/utils";
import { Fields, inputClass, type MediaApi, smallButton } from "./Fields";

interface Props {
  config: CollectionConfig;
  items: Doc[];
  onChange: (items: Doc[]) => void;
  ctx: Ctx;
  media: MediaApi;
}

/** List of items with add, edit, delete and (where it matters) reordering */
export function CollectionEditor({ config, items, onChange, ctx, media }: Props) {
  const [editing, setEditing] = useState<{ index: number | null; item: Doc } | null>(null);
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const title = config.title ?? (() => "Item");

  const isMembers = config.key === "members";
  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const text = `${title(item)} ${config.subtitle?.(item, ctx) ?? ""}`.toLowerCase();
      if (query && !text.includes(query.toLowerCase())) return false;
      if (isMembers && team !== "all") {
        if (team === "leadership") return item.role === "President" || item.role === "Vice President";
        return item.teamSlug === team;
      }
      return true;
    });

  function remove(index: number) {
    const item = items[index];
    if (!window.confirm(`Delete "${title(item)}"? This can't be undone after you save.`)) return;
    collectImageUrls(item).forEach(media.markRemoved);
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          aria-label={`Search ${config.label}`}
          placeholder="Search…"
          className={`${inputClass} sm:max-w-xs`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isMembers && (
          <select aria-label="Filter by team" className={`${inputClass} sm:max-w-xs`} value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">Everyone</option>
            <option value="leadership">President & Vice President</option>
            {ctx.content.teams.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-deep px-5 font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong sm:ml-auto"
          onClick={() => setEditing({ index: null, item: config.newItem?.(ctx) ?? {} })}
        >
          + Add new {config.itemLabel}
        </button>
      </div>

      <p className="mt-4 text-sm text-muted">
        {visible.length} of {items.length} shown
      </p>

      {visible.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line p-6 text-muted">Nothing here yet. Use “Add new {config.itemLabel}” to create one.</p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {visible.map(({ item, index }, pos) => {
            const thumb = config.thumb?.(item);
            // Move past the neighbouring card that is visible (works with the team filter too)
            const prevIndex = visible[pos - 1]?.index;
            const nextIndex = visible[pos + 1]?.index;
            return (
              <li key={`${str(item.id) || str(item.year)}-${index}`} className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-tint">
                  {thumb && <Image src={thumb} alt="" fill unoptimized className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{title(item)}</span>
                  <span className="block truncate text-sm text-muted">{config.subtitle?.(item, ctx)}</span>
                </span>
                <span className="flex flex-wrap gap-1.5">
                  {config.reorderable && !query && (
                    <>
                      <button
                        type="button"
                        className={smallButton}
                        aria-label={`Move ${title(item)} up`}
                        disabled={prevIndex === undefined}
                        onClick={() => prevIndex !== undefined && onChange(moveItem(items, index, prevIndex))}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={smallButton}
                        aria-label={`Move ${title(item)} down`}
                        disabled={nextIndex === undefined}
                        onClick={() => nextIndex !== undefined && onChange(moveItem(items, index, nextIndex))}
                      >
                        ↓
                      </button>
                    </>
                  )}
                  <button type="button" className={smallButton} onClick={() => setEditing({ index, item: clone(item) })}>
                    Edit
                  </button>
                  <button type="button" className={smallButton} onClick={() => remove(index)}>
                    Delete
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <EditPanel
          heading={`${editing.index === null ? "Add" : "Edit"} ${config.itemLabel}`}
          config={config}
          item={editing.item}
          ctx={ctx}
          media={media}
          onCancel={() => setEditing(null)}
          onDone={(item) => {
            onChange(editing.index === null ? [...items, item] : items.map((x, i) => (i === editing.index ? item : x)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EditPanel({
  heading,
  config,
  item: initial,
  ctx,
  media,
  onCancel,
  onDone,
}: {
  heading: string;
  config: CollectionConfig;
  item: Doc;
  ctx: Ctx;
  media: MediaApi;
  onCancel: () => void;
  onDone: (item: Doc) => void;
}) {
  const [item, setItem] = useState<Doc>(initial);
  const [missing, setMissing] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(onCancel);

  useEffect(() => {
    cancelRef.current = onCancel;
  }, [onCancel]);

  // Runs once when the panel opens: focus the first field, close on Escape, stop the page scrolling behind
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cancelRef.current();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, []);

  function done() {
    const gaps = findMissing(config.fields, item);
    if (gaps.length) {
      setMissing(gaps);
      panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onDone(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-strong/50" onClick={onCancel}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-paper/95 px-5 py-4 backdrop-blur sm:px-8">
          <h2 className="font-display text-2xl font-bold capitalize">{heading}</h2>
          <button type="button" className={smallButton} onClick={onCancel}>
            Close
          </button>
        </div>

        <div className="flex-1 px-5 py-6 sm:px-8">
          {missing.length > 0 && (
            <div role="alert" className="mb-6 rounded-2xl bg-pop/30 p-4 text-sm">
              <p className="font-bold">Please fill in:</p>
              <ul className="mt-1 list-disc pl-5">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <Fields fields={config.fields} value={item} onChange={setItem} ctx={ctx} media={media} />
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-line bg-paper/95 px-5 py-4 backdrop-blur sm:px-8">
          <button type="button" className={smallButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full bg-brand-deep px-6 font-semibold text-white transition-colors hover:bg-pop hover:text-ink-strong"
            onClick={done}
          >
            Done
          </button>
        </div>
        <p className="px-5 pb-4 text-right text-xs text-muted sm:px-8">“Done” keeps your changes here. Use “Save & publish” to put them on the website.</p>
      </div>
    </div>
  );
}
