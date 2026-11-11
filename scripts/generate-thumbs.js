import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const thumbsDir = path.join(publicDir, 'thumbs');
const manifestPath = path.join(rootDir, 'src', 'data', 'thumbnails.json');

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

const dataFile = fs.readFileSync(path.join(rootDir, 'src', 'data.ts'), 'utf-8');

function extractPropertyCovers(code) {
  const results = [];
  const blockRegex = /{\s*id:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'/g;
  let match;
  while ((match = blockRegex.exec(code)) !== null) {
    results.push({ id: match[1], image: match[2] });
  }
  return results;
}

const items = extractPropertyCovers(dataFile);
const manifest = {};
const validFiles = new Set();
let totalSourceBytes = 0;
let totalThumbBytes = 0;
let generatedCount = 0;

for (const item of items) {
  if (!item.image || item.image.startsWith('http')) continue;
  const srcPath = path.join(publicDir, item.image.replace(/^\//, ''));
  if (!fs.existsSync(srcPath)) continue;

  const thumbName = `${item.id}.jpg`;
  const thumbPath = path.join(thumbsDir, thumbName);
  validFiles.add(thumbName);

  const srcStat = fs.statSync(srcPath);
  totalSourceBytes += srcStat.size;

  const needsBuild =
    !fs.existsSync(thumbPath) || fs.statSync(thumbPath).mtimeMs < srcStat.mtimeMs;

  if (needsBuild) {
    try {
      execFileSync(
        'ffmpeg',
        [
          '-y',
          '-loglevel',
          'error',
          '-i',
          srcPath,
          '-vf',
          "scale='min(720,iw)':-2",
          '-q:v',
          '6',
          '-map_metadata',
          '-1',
          thumbPath,
        ],
        { stdio: 'ignore' }
      );
    } catch {
      execFileSync(
        'sips',
        ['-Z', '720', '-s', 'format', 'jpeg', '-s', 'formatOptions', '72', srcPath, '--out', thumbPath],
        { stdio: 'ignore' }
      );
    }
    generatedCount++;
  }

  totalThumbBytes += fs.statSync(thumbPath).size;
  manifest[item.id] = `/thumbs/${thumbName}`;
}

// Clean orphaned thumbnails
for (const file of fs.readdirSync(thumbsDir)) {
  if (file.endsWith('.jpg') && !validFiles.has(file)) {
    fs.unlinkSync(path.join(thumbsDir, file));
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

console.log(`✅ Thumbnails listos: ${Object.keys(manifest).length} (generados: ${generatedCount})`);
console.log(
  `📦 Peso portadas originales: ${(totalSourceBytes / (1024 * 1024)).toFixed(2)} MB -> Thumbnails: ${(totalThumbBytes / (1024 * 1024)).toFixed(2)} MB`
);

