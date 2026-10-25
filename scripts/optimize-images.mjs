/**
 * Optimizes raster assets in public/assets: resizes to a max width and
 * converts to WebP. Run after adding new imagery:
 *
 *   npm run optimize:images
 *
 * The script is idempotent — it skips files that already have an
 * up-to-date .webp sibling (by mtime).
 */
import { readdir, stat, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS_DIR = path.resolve(process.cwd(), 'public/assets');
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 72;

const exists = async file => {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const run = async () => {
  const entries = await readdir(ASSETS_DIR);
  const sources = entries.filter(file => /\.(jpe?g|png)$/i.test(file));

  if (sources.length === 0) {
    console.log('No JPG/PNG sources found in public/assets — nothing to do.');
    return;
  }

  let converted = 0;
  let savedBytes = 0;

  for (const file of sources) {
    const sourcePath = path.join(ASSETS_DIR, file);
    const targetPath = path.join(ASSETS_DIR, `${path.basename(file, path.extname(file))}.webp`);

    const sourceStat = await stat(sourcePath);
    if (await exists(targetPath)) {
      const targetStat = await stat(targetPath);
      if (targetStat.mtimeMs >= sourceStat.mtimeMs) {
        console.log(`• skip (up to date): ${file}`);
        continue;
      }
    }

    const buffer = await sharp(sourcePath)
      .rotate() // respect EXIF orientation
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    await writeFile(targetPath, buffer);

    const before = sourceStat.size;
    const after = buffer.byteLength;
    savedBytes += Math.max(0, before - after);
    converted += 1;
    console.log(
      `✓ ${file} -> ${path.basename(targetPath)} ` +
      `${(before / 1024).toFixed(0)} kB -> ${(after / 1024).toFixed(0)} kB ` +
      `(-${(100 - (after / before) * 100).toFixed(0)}%)`
    );
  }

  console.log(
    converted > 0
      ? `Converted ${converted} image(s), saved ~${(savedBytes / 1024 / 1024).toFixed(2)} MB.`
      : 'All WebP variants are up to date.'
  );
  console.log('Remember to update code references to the .webp files and remove the originals.');
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
