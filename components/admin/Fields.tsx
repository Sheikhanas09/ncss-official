"use client";

import Image from "next/image";
import { useId, useRef, useState, type ReactNode } from "react";
import type { Ctx, Field } from "@/lib/admin/schema";
import { uploadImage } from "@/lib/admin/supabase";
import { type Doc, moveItem, str } from "@/lib/admin/utils";
import { focusStyles } from "@/lib/photo";
import type { PhotoFocus } from "@/types";
import { PhotoAdjust } from "./PhotoAdjust";

/** Lets image fields report replaced or removed images, so storage can be cleaned up after saving. */
export interface MediaApi {
  markRemoved: (url: string) => void;
}

interface FieldsProps {
  fields: Field[];
  value: Doc;
  onChange: (value: Doc) => void;
  ctx: Ctx;
  media: MediaApi;
}

export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted/70 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand";

export const smallButton =
  "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-semibold text-ink transition-colors hover:border-pop hover:bg-pop hover:text-ink-strong disabled:cursor-not-allowed disabled:opacity-50";

/** Renders a list of fields for one object */
export function Fields({ fields, value, onChange, ctx, media }: FieldsProps) {
  return (
    <div className="grid gap-5">
      {fields.map((field, i) =>
        field.type === "heading" ? (
          <div key={`${field.key}-${i}`} className="mt-4 border-b border-line pb-2 first:mt-0">
            <h3 className="font-display text-xl font-bold">{field.label}</h3>
            {field.help && <p className="mt-1 text-sm text-muted">{field.help}</p>}
          </div>
        ) : (
          <FieldView
            key={`${field.key}-${i}`}
            field={field}
            value={value[field.key]}
            onChange={(v) =>
              // A new photo starts with a fresh position
              onChange(field.type === "image" && field.focusKey ? { ...value, [field.key]: v, [field.focusKey]: undefined } : { ...value, [field.key]: v })
            }
            focus={field.type === "image" && field.focusKey ? (value[field.focusKey] as PhotoFocus | undefined) : undefined}
            onFocusChange={field.type === "image" && field.focusKey ? (f) => onChange({ ...value, [field.focusKey as string]: f }) : undefined}
            ctx={ctx}
            media={media}
          />
        ),
      )}
    </div>
  );
}

function Label({ htmlFor, field, children }: { htmlFor?: string; field: Field; children?: ReactNode }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {field.label}
        {"required" in field && field.required && <span className="text-link"> *</span>}
      </label>
      {children}
    </div>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="mt-1.5 text-sm text-muted">{text}</p> : null;
}

interface FieldViewProps {
  field: Exclude<Field, { type: "heading" }>;
  value: unknown;
  onChange: (value: unknown) => void;
  focus?: PhotoFocus;
  onFocusChange?: (focus: PhotoFocus) => void;
  ctx: Ctx;
  media: MediaApi;
}

function FieldView({ field, value, onChange, focus, onFocusChange, ctx, media }: FieldViewProps) {
  const id = useId();

  switch (field.type) {
    case "text":
    case "url":
    case "email":
    case "date":
      return (
        <div>
          <Label htmlFor={id} field={field} />
          <input
            id={id}
            type={field.type === "text" ? "text" : field.type}
            className={inputClass}
            value={str(value)}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          <Help text={field.help} />
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label htmlFor={id} field={field} />
          <textarea id={id} rows={3} className={inputClass} value={str(value)} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
          <Help text={field.help} />
        </div>
      );

    case "select": {
      const options = typeof field.options === "function" ? field.options(ctx) : field.options;
      return (
        <div>
          <Label htmlFor={id} field={field} />
          <select id={id} className={inputClass} value={str(value)} onChange={(e) => onChange(e.target.value)}>
            {(field.emptyLabel !== undefined || !options.some((o) => o.value === str(value))) && (
              <option value="">{field.emptyLabel ?? "Choose…"}</option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help text={field.help} />
        </div>
      );
    }

    case "image":
      return <ImageInput field={field} value={value} onChange={onChange} focus={focus} onFocusChange={onFocusChange} media={media} />;

    case "gallery":
      return <GalleryInput field={field} value={value} onChange={onChange} media={media} />;

    case "paragraphs": {
      const paras = Array.isArray(value) ? (value as unknown[]).map(str) : [];
      return (
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold">{field.label}</legend>
          <div className="grid gap-3">
            {paras.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  aria-label={`${field.label}, paragraph ${i + 1}`}
                  rows={3}
                  className={inputClass}
                  value={p}
                  onChange={(e) => onChange(paras.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <button type="button" className={`${smallButton} self-start`} onClick={() => onChange(paras.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" className={`${smallButton} mt-3`} onClick={() => onChange([...paras, ""])}>
            + Add paragraph
          </button>
          <Help text={field.help} />
        </fieldset>
      );
    }

    case "group":
      return (
        <fieldset className="rounded-2xl border border-line bg-tint/40 p-4 sm:p-5">
          <legend className="px-1 text-sm font-bold">{field.label}</legend>
          <Help text={field.help} />
          <div className="mt-2">
            <Fields fields={field.fields} value={(value as Doc) ?? {}} onChange={onChange} ctx={ctx} media={media} />
          </div>
        </fieldset>
      );

    case "list":
      return <ListInput field={field} value={value} onChange={onChange} ctx={ctx} media={media} />;
  }
}

// ---------- Image ----------

function ImageInput({
  field,
  value,
  onChange,
  focus,
  onFocusChange,
  media,
}: {
  field: Extract<Field, { type: "image" }>;
  value: unknown;
  onChange: (v: unknown) => void;
  focus?: PhotoFocus;
  onFocusChange?: (focus: PhotoFocus) => void;
  media: MediaApi;
}) {
  const id = useId();
  const [adjusting, setAdjusting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const obj = (value && typeof value === "object" ? value : {}) as Doc;
  const src = field.variant === "url" ? str(value) : str(obj.src);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const up = await uploadImage(file, field.folder);
      if (src) media.markRemoved(src);
      if (field.variant === "url") onChange(up.url);
      // Person photos: open the adjuster right away so the face can be placed above the name
      if (onFocusChange) setAdjusting(true);
      else if (field.variant === "ref") onChange({ ...obj, src: up.url, alt: str(obj.alt) || field.label });
      else onChange({ ...obj, src: up.url, alt: str(obj.alt) || field.label, width: up.width || 1200, height: up.height || 800 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function remove() {
    if (src) media.markRemoved(src);
    onChange(field.variant === "url" ? "" : { ...obj, src: "" });
  }

  return (
    <div>
      <Label field={field} />
      <div className="flex flex-wrap items-start gap-4 rounded-2xl border border-dashed border-line p-3">
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-tint ${
            onFocusChange ? "aspect-[4/5] w-28 rounded-2xl" : "h-28 w-28 rounded-xl"
          }`}
        >
          {src ? (
            onFocusChange ? (
              <div className="absolute inset-0" style={focusStyles(focus).wrapper}>
                <Image src={src} alt="" fill unoptimized className="object-cover" style={focusStyles(focus).image} />
              </div>
            ) : (
              <Image src={src} alt="" fill unoptimized className="object-cover" />
            )
          ) : (
            <span className="px-2 text-center text-xs text-muted">No image</span>
          )}
        </div>
        <div className="grid min-w-0 flex-1 gap-2">
          <div className="flex flex-wrap gap-2">
            <input id={id} ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            <label htmlFor={id} className={`${smallButton} cursor-pointer ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {busy ? "Uploading…" : src ? "Replace image" : "Upload image"}
            </label>
            {src && onFocusChange && (
              <button type="button" className={smallButton} onClick={() => setAdjusting(true)} disabled={busy}>
                Adjust photo
              </button>
            )}
            {src && (
              <button type="button" className={smallButton} onClick={remove} disabled={busy}>
                Remove
              </button>
            )}
          </div>
          {field.variant !== "url" && src && (
            <input
              aria-label={`${field.label}: description for screen readers`}
              placeholder="Short description of the photo"
              className={inputClass}
              value={str(obj.alt)}
              onChange={(e) => onChange({ ...obj, alt: e.target.value })}
            />
          )}
          {error && <p className="text-sm font-semibold text-link">{error}</p>}
          <Help text={field.help} />
        </div>
      </div>
      {adjusting && src && onFocusChange && (
        <PhotoAdjust
          src={src}
          focus={focus}
          onClose={() => setAdjusting(false)}
          onSave={(f) => {
            onFocusChange(f);
            setAdjusting(false);
          }}
        />
      )}
    </div>
  );
}

// ---------- Gallery ----------

function GalleryInput({
  field,
  value,
  onChange,
  media,
}: {
  field: Extract<Field, { type: "gallery" }>;
  value: unknown;
  onChange: (v: unknown) => void;
  media: MediaApi;
}) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const photos = (Array.isArray(value) ? value : []) as Doc[];

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const added: Doc[] = [];
    const list = Array.from(files);
    for (const [i, file] of list.entries()) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const up = await uploadImage(file, `${field.folder}/gallery`);
        added.push({ src: up.url, alt: `Photo ${photos.length + added.length + 1}` });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setProgress("");
    if (fileRef.current) fileRef.current.value = "";
    onChange([...photos, ...added]);
  }

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold">{field.label}</legend>
      {photos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p, i) => (
            <li key={`${str(p.src)}-${i}`} className="rounded-2xl border border-line bg-surface p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-tint">
                <Image src={str(p.src)} alt="" fill unoptimized className="object-cover" />
              </div>
              <input
                aria-label={`Photo ${i + 1} description`}
                className={`${inputClass} mt-2 px-2.5 py-1.5 text-sm`}
                value={str(p.alt)}
                placeholder="Description"
                onChange={(e) => onChange(photos.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
              />
              <div className="mt-2 flex flex-wrap gap-1">
                <button type="button" className={smallButton} aria-label={`Move photo ${i + 1} earlier`} onClick={() => onChange(moveItem(photos, i, i - 1))} disabled={i === 0}>
                  ←
                </button>
                <button type="button" className={smallButton} aria-label={`Move photo ${i + 1} later`} onClick={() => onChange(moveItem(photos, i, i + 1))} disabled={i === photos.length - 1}>
                  →
                </button>
                <button
                  type="button"
                  className={smallButton}
                  onClick={() => {
                    media.markRemoved(str(p.src));
                    onChange(photos.filter((_, j) => j !== i));
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input id={id} ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
        <label htmlFor={id} className={`${smallButton} cursor-pointer ${progress ? "pointer-events-none opacity-50" : ""}`}>
          + Add photos
        </label>
        {progress && <span className="text-sm text-muted">{progress}</span>}
        {error && <span className="text-sm font-semibold text-link">{error}</span>}
      </div>
      <Help text="You can pick several photos at once." />
    </fieldset>
  );
}

// ---------- List of sub-items (e.g. sponsorships, team leads) ----------

function ListInput({
  field,
  value,
  onChange,
  ctx,
  media,
}: {
  field: Extract<Field, { type: "list" }>;
  value: unknown;
  onChange: (v: unknown) => void;
  ctx: Ctx;
  media: MediaApi;
}) {
  const items = (Array.isArray(value) ? value : []) as Doc[];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold">{field.label}</legend>
      {items.length === 0 && <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">Nothing added yet.</p>}
      <ul className="grid gap-2">
        {items.map((item, i) => (
          <li key={i} className="rounded-2xl border border-line bg-surface">
            <div className="flex flex-wrap items-center gap-2 p-2 pl-4">
              <button
                type="button"
                className="min-w-0 flex-1 truncate py-1.5 text-left font-semibold"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {open === i ? "▾" : "▸"} {field.summary(item)}
              </button>
              <button type="button" className={smallButton} aria-label="Move up" onClick={() => onChange(moveItem(items, i, i - 1))} disabled={i === 0}>
                ↑
              </button>
              <button type="button" className={smallButton} aria-label="Move down" onClick={() => onChange(moveItem(items, i, i + 1))} disabled={i === items.length - 1}>
                ↓
              </button>
              <button
                type="button"
                className={smallButton}
                onClick={() => {
                  if (!window.confirm(`Remove this ${field.itemLabel}?`)) return;
                  onChange(items.filter((_, j) => j !== i));
                  setOpen(null);
                }}
              >
                Remove
              </button>
            </div>
            {open === i && (
              <div className="border-t border-line p-4">
                <Fields fields={field.fields} value={item} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} ctx={ctx} media={media} />
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${smallButton} mt-3`}
        onClick={() => {
          onChange([...items, field.newItem(ctx)]);
          setOpen(items.length);
        }}
      >
        + Add {field.itemLabel}
      </button>
      <Help text={field.help} />
    </fieldset>
  );
}
