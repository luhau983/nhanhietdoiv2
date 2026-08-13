/**
 * Tải ảnh từ media library của website cũ nhanhietdoi.vn về assets-source/.
 *
 * Vì sao qua index.php: host chặn /wp-json/... nhưng vẫn cho /index.php/wp-json/...
 * Vì sao không dùng /du-an/: custom post type "du-an" không còn được đăng ký nên
 * mọi URL dự án trả 404 — chỉ media library còn truy cập được.
 *
 * Ảnh đổ vào assets-source/ (ngoài src/) để Astro không xử lý toàn bộ 236 ảnh mỗi
 * lần build. Chỉ ảnh nào được gán vào dự án mới chuyển sang src/assets/.
 *
 * Chạy: node scripts/fetch-old-site-images.mjs
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://nhanhietdoi.vn/index.php/wp-json/wp/v2/media';
const OUT = path.resolve(import.meta.dirname, '../assets-source');
const CONCURRENCY = 8;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

/** Shared hosting hay cắt request khi gọi liên tiếp — thử lại thay vì bỏ luôn cả trang. */
async function fetchWithRetry(url, attempts = 4) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, 800 * (i + 1)));
  }
  throw lastError ?? new Error('fetch failed');
}

async function fetchAllMedia() {
  const items = [];

  // Số trang lấy từ header X-WP-TotalPages thay vì đoán: dừng sớm ở trang lỗi
  // sẽ âm thầm bỏ mất phần lớn media library.
  const first = await fetchWithRetry(`${API}?per_page=100&page=1&_fields=id`);
  const totalPages = Number(first.headers.get('x-wp-totalpages') ?? '1') || 1;

  for (let page = 1; page <= totalPages; page += 1) {
    const url = `${API}?per_page=100&page=${page}&_fields=id,date,title,source_url,mime_type`;
    const res = await fetchWithRetry(url);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    items.push(...batch.filter((m) => String(m.mime_type).startsWith('image/')));
  }

  return items;
}

async function download(item) {
  // Giữ thư mục theo tháng upload: tên file trùng nhau giữa các tháng
  // (11.jpg, 1.jpg...) sẽ ghi đè nhau nếu đổ phẳng vào một chỗ.
  const month = String(item.date ?? '').slice(0, 7) || 'unknown';
  const dir = path.join(OUT, month);
  const name = decodeURIComponent(item.source_url.split('/').pop() ?? `${item.id}.jpg`);
  const file = path.join(dir, name);

  try {
    const existing = await stat(file);
    if (existing.size > 0) return { file, skipped: true, bytes: existing.size };
  } catch {
    // chưa có file, tải mới
  }

  const res = await fetchWithRetry(item.source_url);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dir, { recursive: true });
  await writeFile(file, buf);
  return { file, skipped: false, bytes: buf.byteLength };
}

const media = await fetchAllMedia();
console.log(`Tìm thấy ${media.length} ảnh trên media library.`);

let done = 0;
let bytes = 0;
const failed = [];

// Hàng đợi thủ công thay vì Promise.all toàn bộ: 236 request song song sẽ bị
// shared hosting cắt kết nối.
const queue = [...media];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      try {
        const r = await download(item);
        bytes += r.bytes;
        done += 1;
        if (done % 20 === 0) console.log(`${done}/${media.length} — ${(bytes / 1048576).toFixed(0)} MB`);
      } catch (err) {
        failed.push({ url: item.source_url, error: String(err) });
      }
    }
  }),
);

// Manifest: ảnh trên site cũ không gắn với post nào (post = 0) nên không suy ra được
// ảnh nào thuộc dự án nào. Gom theo mốc thời gian upload — ảnh cùng một lần upload
// gần như chắc chắn cùng một dự án — để người biết dự án điền tên vào.
const clusters = [];
const sorted = [...media].sort((a, b) => String(a.date).localeCompare(String(b.date)));
const GAP_MS = 10 * 60 * 1000;

for (const item of sorted) {
  const t = new Date(item.date).getTime();
  const last = clusters.at(-1);
  if (last && t - last.lastTime <= GAP_MS) {
    last.files.push(path.basename(item.source_url));
    last.lastTime = t;
  } else {
    clusters.push({
      uploadedAt: item.date,
      lastTime: t,
      month: String(item.date).slice(0, 7),
      projectName: '',
      files: [path.basename(item.source_url)],
    });
  }
}

const manifest = clusters.map(({ lastTime: _lastTime, ...rest }) => rest);
await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'clusters.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`\nXong: ${done} ảnh, ${(bytes / 1048576).toFixed(1)} MB.`);
console.log(`Lỗi: ${failed.length}`);
if (failed.length) console.log(failed.slice(0, 5));
console.log(`Đã gom thành ${manifest.length} nhóm theo thời gian upload → assets-source/clusters.json`);
console.log('Điền projectName cho từng nhóm rồi tôi sẽ sinh MDX dự án tương ứng.');
