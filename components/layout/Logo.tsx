import Image from "next/image";
import { getSiteInfo } from "@/lib/data";
/** The one place the logo is drawn. Height is set by the caller; width follows the file's ratio. */
export async function Logo({ className = "h-12" }: { className?: string }) {
  const { logo } = await getSiteInfo();
  // White backing keeps the logo's teal edge crisp on teal backgrounds.
  // unoptimized: the file is served as-is, so replacing logo.png shows up straight away (no stale resized copy).
  return (
    <span className="inline-flex shrink-0 rounded-full bg-white p-0.5">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        unoptimized
        className={`w-auto ${className}`}
      />
    </span>
  );
}
