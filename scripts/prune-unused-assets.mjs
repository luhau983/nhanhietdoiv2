/**
 * Xoá file trong dist/_astro không được trang nào tham chiếu.
 *
 * Vì sao cần: Astro sinh bản tối ưu (webp/avif) để hiển thị, nhưng Vite vẫn phát
 * cả file gốc của mọi ảnh nằm trong module graph — kể cả ảnh chỉ dùng qua <Image>.
 * Với 11 dự án × 9 ảnh thì đó là hàng chục MB không HTML nào trỏ tới, chỉ làm
 * chậm lần upload lên shared hosting.
 *
 * An toàn vì site này hoàn toàn tĩnh, không có đoạn JS nào dựng đường dẫn ảnh
 * lúc chạy. Nếu sau này thêm code ghép tên file động thì phải bỏ bước này.
 *
 * Chạy tự động sau `npm run build` (npm postbuild).
 */
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ASSETS_DIR = path.join(DIST, '_astro');

/** Chỉ dọn ảnh. CSS/JS trong _astro luôn được tham chiếu qua bundle. */
const PRUNABLE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

/** File nào cũng có thể chứa tham chiếu tới asset. */
const SCANNABLE = /\.(html|css|js|xml|json|txt)$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const allFiles = await walk(DIST);

// Gom toàn bộ nội dung có thể trỏ tới asset thành một chuỗi để tra cứu.
const haystack = (
  await Promise.all(
    allFiles.filter((f) => SCANNABLE.test(f)).map((f) => readFile(f, 'utf8').catch(() => '')),
  )
).join('\n');

const candidates = allFiles.filter((f) => f.startsWith(ASSETS_DIR) && PRUNABLE.test(f));

let removed = 0;
let freed = 0;

for (const file of candidates) {
  const name = path.basename(file);
  if (haystack.includes(name)) continue;

  freed += (await stat(file)).size;
  await unlink(file);
  removed += 1;
}

const mb = (freed / 1048576).toFixed(1);
console.log(
  removed > 0
    ? `Đã dọn ${removed}/${candidates.length} ảnh không được tham chiếu — giảm ${mb} MB.`
    : `Không có ảnh dư trong ${candidates.length} file.`,
);
