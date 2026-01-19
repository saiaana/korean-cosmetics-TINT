import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import db from '../db.js';

// ===== resolve __dirname =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== load env =====
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ===== load map =====
const MAP_FILE = path.resolve(__dirname, '../cloudinary-map.json');
const map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));

function parseVariantFile(file) {
  // variant_10_1.webp
  const name = path.parse(file).name;
  const match = name.match(/^variant_(\d+)_(\d+)$/);
  if (!match) return null;

  return {
    variantId: Number(match[1]),
    position: Number(match[2]),
  };
}

async function main() {
  let updated = 0;

  for (const item of map) {
    const parsed = parseVariantFile(item.file);
    if (!parsed) continue;

    const res = await db.query(
      `
      UPDATE variant_images
      SET url = $1
      WHERE variant_id = $2
        AND position = $3
      `,
      [item.url, parsed.variantId, parsed.position],
    );

    if (res.rowCount > 0) updated += res.rowCount;
  }

  console.log(`✅ variant_images updated: ${updated}`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ DB error:', err);
  process.exit(1);
});
