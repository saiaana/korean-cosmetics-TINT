import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const BUCKET = "catalog_images";

function parseFileName(fileName) {
  const match = fileName.match(/^(\d+)_(\d+)\.(jpg|jpeg|png|webp)$/i);
  if (!match) return null;

  return {
    catalogId: Number(match[1]),
    position: Number(match[2]),
  };
}

async function getAllFiles(bucket) {
  const files = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list("", { limit, offset });

    if (error) throw error;
    if (!data || data.length === 0) break;

    files.push(...data);
    offset += limit;
  }

  return files;
}

async function syncCatalogImages() {
  console.log("🚀 Start syncing images...");

  let files;
  try {
    files = await getAllFiles(BUCKET);
  } catch (err) {
    console.error("❌ Error getting files:", err);
    return;
  }

  if (files.length === 0) {
    console.log("ℹ️ No files in bucket");
    return;
  }

  let processed = 0;

  for (const file of files) {
    if (!file.name) continue;

    const parsed = parseFileName(file.name);
    if (!parsed) {
      console.warn(`⚠️ Skipping file with invalid name: ${file.name}`);
      continue;
    }

    const { catalogId, position } = parsed;

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(file.name);

    // Cache busting for images
    const version = file.updated_at
      ? new Date(file.updated_at).getTime()
      : Date.now();

    const url = `${urlData.publicUrl}?v=${version}`;

    const { error } = await supabase.from("catalog_images").upsert(
      {
        catalog_id: catalogId,
        position,
        url,
        is_main: position === 1,
      },
      {
        onConflict: "catalog_id,position",
      },
    );

    if (error) {
      console.error(`❌ Upsert error: ${file.name}:`, error);
      continue;
    }

    console.log(`✅ Synced: ${file.name}`);
    processed++;
  }

  console.log(`🎉 Done. Processed files: ${processed}`);
}

syncCatalogImages().catch((err) => {
  console.error("💥 Critical error:", err);
});
