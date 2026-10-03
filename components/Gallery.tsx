"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { ImageRef } from "@/types";
import { Lightbox } from "@/components/Lightbox";

/** Thumbnail grid. Click a photo to open it large. Thumbnails lazy load. */
export function Gallery({ images }: { images: ImageRef[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  // Closing returns focus to the thumbnail of the photo that was last shown
  const close = useCallback(() => {
    const last = index;
    setIndex(null);
    if (last !== null) requestAnimationFrame(() => thumbs.current[last]?.focus());
  }, [index]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((img, i) => (
          <li key={img.src} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-tint"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={i === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="sr-only">Open photo {i + 1} of {images.length} large</span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onClose={close} onChange={setIndex} />
    </>
  );
}
