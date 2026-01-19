import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// ===== Cloudinary config =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== args =====
// node scripts/upload-to-cloudinary.js ./local/catalog_images catalog_images
const BASE_DIR = process.argv[2];      // локальная папка с картинками
const CLOUD_FOLDER = process.argv[3];  // папка в Cloudinary

if (!BASE_DIR || !CLOUD_FOLDER) {
  console.error(
    '❌ Использование:\n' +
    'node scripts/upload-to-cloudinary.js <local_folder> <cloud_folder>',
  );
  process.exit(1);
}

// ===== constants =====
const MAP_FILE = 'cloudinary-map.json';
const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// ===== helpers =====
function loadExistingMap() {
  if (!fs.existsSync(MAP_FILE)) return [];
  return JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
}

function saveMap(map) {
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2), 'utf-8');
}

function getFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter(f => allowedExt.has(path.extname(f).toLowerCase()));
}

// ===== main =====
async function main() {
  if (!fs.existsSync(BASE_DIR)) {
    console.error(`❌ Папка не найдена: ${BASE_DIR}`);
    process.exit(1);
  }

  const files = getFiles(BASE_DIR);

  if (!files.length) {
    console.log('⚠️ В папке нет изображений');
    return;
  }

  const existingMap = loadExistingMap();
  const newMap = [];

  for (const file of files) {
    const fullPath = path.join(BASE_DIR, file);
    const nameWithoutExt = path.parse(file).name;

    const publicId = `${CLOUD_FOLDER}/${nameWithoutExt}`;

    console.log(`⬆️ Upload: ${file} → ${publicId}`);

    const res = await cloudinary.uploader.upload(fullPath, {
      public_id: publicId,
      overwrite: true,
      unique_filename: false,
      resource_type: 'image',
    });

    newMap.push({
      file,
      public_id: res.public_id,
      url: res.secure_url,
    });
  }

  // объединяем старые и новые записи
  const mergedMap = [...existingMap];

  for (const item of newMap) {
    const exists = mergedMap.some(
      m => m.public_id === item.public_id,
    );
    if (!exists) {
      mergedMap.push(item);
    }
  }

  saveMap(mergedMap);

  console.log('\n✅ Готово!');
  console.log(`📄 Обновлён файл: ${MAP_FILE}`);
  console.log(`🖼️ Загружено файлов: ${newMap.length}`);
}

main().catch(err => {
  console.error('❌ Ошибка загрузки:', err);
  process.exit(1);
});
