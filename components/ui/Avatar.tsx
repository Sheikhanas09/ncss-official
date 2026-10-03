import Image from "next/image";
import type { PhotoFocus } from "@/types";
import { initials } from "@/lib/format";
import { focusStyles } from "@/lib/photo";

interface AvatarProps {
  name: string;
  photo?: string;
  /** Passed to next/image so the right file size is picked. */
  sizes: string;
  className?: string;
  /** Alumni: black and white until hovered (on computers). */
  muted?: boolean;
  /** Which part of the photo stays in view, and zoom (set in the admin panel) */
  focus?: PhotoFocus;
}

/**
 * Fills its parent (which must be position: relative with a size).
 * Without a photo it shows initials on the current team colour (--acc-strip / --acc-on).
 */
export function Avatar({ name, photo, sizes, className = "", muted = false, focus }: AvatarProps) {
  const mutedClass = muted ? "muted-photo" : "";

  if (photo) {
    const styles = focusStyles(focus);
    return (
      <div className="absolute inset-0" style={styles.wrapper}>
        <Image src={photo} alt={`Photo of ${name}`} fill sizes={sizes} className={`object-cover ${mutedClass} ${className}`} style={styles.image} />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${name} (no photo yet)`}
      className={`absolute inset-0 flex items-center justify-center bg-acc-strip/20 sm:items-start sm:pt-[22%] font-display font-extrabold text-ink ${className}`}
    >
      <span className="text-[clamp(1.5rem,32cqw,5rem)] leading-none">{initials(name)}</span>
    </div>
  );
}
