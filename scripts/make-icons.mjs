// Builds the favicon and app icons from public/brand/logo.png.
// Run again after you replace the logo: npm run icons

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logo = join(root, "public", "brand", "logo.png");

// Browser tab icon (transparent background)
await sharp(logo)
  .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(root, "app", "icon.png"));

// Apple touch icon (needs a solid background)
await sharp(logo)
  .resize(148, 148, { fit: "contain", background: { r: 243, g: 248, b: 248, alpha: 1 } })
  .extend({ top: 16, bottom: 16, left: 16, right: 16, background: { r: 243, g: 248, b: 248, alpha: 1 } })
  .flatten({ background: { r: 243, g: 248, b: 248 } })
  .png()
  .toFile(join(root, "app", "apple-icon.png"));

console.log("Icons written to app/icon.png and app/apple-icon.png");
