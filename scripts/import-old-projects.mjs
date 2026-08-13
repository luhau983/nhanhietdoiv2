/**
 * Import một lần: biến các nhóm ảnh trong assets-source/ thành dự án MDX.
 *
 * Bối cảnh: website cũ mất custom post type "du-an" nên không còn tên dự án nào
 * ngoài 2 cái đọc được ở trang chủ, và ảnh trong media library không gắn với post
 * (post = 0). Nhóm ảnh ở đây suy ra từ mốc thời gian upload — ảnh upload cùng một
 * lượt gần như chắc chắn thuộc cùng một dự án.
 *
 * Hệ quả: title/year/location là TẠM. Danh sách cần sửa nằm ở assets-source/RENAME-TODO.md.
 *
 * Chạy: npm run import:old-projects
 */
import { mkdir, writeFile, readFile, readdir, rm, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'assets-source');
const ASSETS = path.join(ROOT, 'src/assets');
const CONTENT = path.join(ROOT, 'src/content/projects');

/** File của theme cũ nhận ra được ngay từ tên. */
const JUNK_NAME =
  /logo|footer-bg|hp\d|bg-newleter|contacts_|unsplash|icon-|blueprint|furnitures|^building\.|^drawing\.|cropped/i;

/** Tên file gợi ý ảnh ngoại thất — cover tốt hơn ảnh nội thất. */
const COVER_PREFER = /(^|[^a-z])(ex|mat-dung|exterior|web|phoi-canh)([^a-z]|$)/i;

// Ảnh render/ảnh chụp công trình đều lớn. Dưới ngưỡng này là icon, logo,
// hoặc ảnh trang trí của theme — không phải tư liệu dự án.
const MIN_WIDTH = 900;
const MIN_HEIGHT = 600;

const MIN_IMAGES = 4;
const MAX_GALLERY = 8;

// Cạnh dài tối đa của ảnh nguồn. 2400px đủ cho ảnh tràn viền trên màn 4K,
// lớn hơn chỉ làm phình bản build mà mắt không thấy khác.
const MAX_EDGE = 2400;

const HINTS = {
  31: { type: 'can-ho-penthouse', note: 'tên file VINHOME-*' },
  35: { type: 'biet-thu', note: 'có bộ EX-* (ngoại thất) + IN-* (nội thất)' },
  37: { type: 'biet-thu', location: 'Bình Dương', note: 'tên file thiet-ke-biet-thu-tai-binh-duong' },
  39: { type: 'spa-beauty-salon', note: 'tên file PHONG-TU-VAN, PHONG-LUU, SANH-CS' },
};

const DEFAULT_TYPE = 'nha-pho';

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Đọc thông tin cần để chọn ảnh: kích thước, hướng, và một proxy "ảnh màu hay bản vẽ".
 *
 * Proxy độ màu: bản vẽ mặt bằng gần như xám trắng nên ba kênh R/G/B có trung bình
 * xấp xỉ nhau; ảnh render/ảnh chụp thì lệch rõ. Dùng tổng chênh lệch giữa các kênh
 * để tránh chọn bản vẽ làm cover — bản vẽ vẫn giữ trong gallery vì với hồ sơ kiến
 * trúc nó là tư liệu có giá trị, chỉ không phải thứ nên hiện ở thumbnail.
 */
async function inspect(file) {
  try {
    const image = sharp(file);
    const meta = await image.metadata();
    const stats = await image.stats();
    const [r, g, b] = stats.channels;
    const chroma =
      r && g && b
        ? Math.abs(r.mean - g.mean) + Math.abs(g.mean - b.mean) + Math.abs(r.mean - b.mean)
        : 0;

    return {
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      hasAlpha: Boolean(meta.hasAlpha),
      chroma,
    };
  } catch {
    return null;
  }
}

const clusters = JSON.parse(await readFile(path.join(SOURCE, 'clusters.json'), 'utf8'));

// Xoá kết quả import trước để chạy lại không để lại dự án cũ mồ côi.
for (const entry of await readdir(CONTENT).catch(() => [])) {
  if (/^du-an-\d+\.mdx$/.test(entry)) await rm(path.join(CONTENT, entry));
}
await rm(path.join(ASSETS, 'projects'), { recursive: true, force: true });

// Ảnh trùng giữa các nhóm: site cũ upload lại cùng một bức nhiều lần, nếu không
// chặn thì hai dự án khác nhau hiện y hệt một cover.
const seenHashes = new Set();

const candidates = [];

for (const [i, cluster] of clusters.entries()) {
  const usable = [];

  for (const name of cluster.files) {
    if (JUNK_NAME.test(name)) continue;

    const file = path.join(SOURCE, cluster.month, name);
    if (!(await exists(file))) continue;

    const info = await inspect(file);
    if (!info) continue;
    if (info.width < MIN_WIDTH || info.height < MIN_HEIGHT) continue;
    if (info.hasAlpha) continue; // logo/icon xuất PNG trong suốt

    const hash = createHash('md5').update(await readFile(file)).digest('hex');
    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);

    usable.push({ name, file, ...info });
  }

  if (usable.length >= MIN_IMAGES) {
    candidates.push({ ...cluster, index: i + 1, images: usable });
  }
}

console.log(`${candidates.length} nhóm đủ điều kiện thành dự án.`);

/** Cover: ưu tiên ảnh ngang, nhiều màu (ảnh thật chứ không phải bản vẽ), tên gợi ý ngoại thất. */
function pickCover(images) {
  const landscape = images.filter((img) => img.width >= img.height);
  const pool = landscape.length ? landscape : images;

  return [...pool].sort((a, b) => {
    const bonus = (img) => (COVER_PREFER.test(img.name) ? 40 : 0);
    return b.chroma + bonus(b) - (a.chroma + bonus(a));
  })[0];
}

const todo = [
  '# Dự án import từ website cũ — cần đặt tên thật',
  '',
  'Tên, năm và địa điểm hiện là TẠM. Sửa trực tiếp trong từng file',
  '`src/content/projects/du-an-NN.mdx` (trường `title`, `year`, `location`, `type`, `excerpt`).',
  '',
  'Hai dự án đọc được từ trang chủ site cũ, dùng để đối chiếu:',
  '- Mr.Hai’s Villa — Trảng Bom, Đồng Nai',
  '- Biệt thự vườn Chú Cư — 250 m², Đồng Nai',
  '',
];

let created = 0;

for (const [order, cluster] of candidates.entries()) {
  const num = String(order + 1).padStart(2, '0');
  const slug = `du-an-${num}`;
  const hint = HINTS[cluster.index] ?? {};
  const type = hint.type ?? DEFAULT_TYPE;

  const cover = pickCover(cluster.images);
  const rest = cluster.images.filter((img) => img !== cover).slice(0, MAX_GALLERY);

  const dir = path.join(ASSETS, 'projects', slug);
  await mkdir(dir, { recursive: true });

  const copied = [];

  async function take(image, targetBase) {
    const target = `${targetBase}.jpg`;

    // Nén lại thay vì copy nguyên: ảnh gốc từ site cũ tới 1,9 MB và cạnh dài 2560px.
    // Astro sinh bản tối ưu để hiển thị, nhưng Vite vẫn phát cả file gốc vào dist —
    // để nguyên thì bản build phình lên hàng chục MB toàn ảnh không trang nào dùng.
    await sharp(image.file)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(dir, target));

    copied.push({ original: image.name, target });
    return target;
  }

  const coverFile = await take(cover, 'cover');

  const galleryFiles = [];
  for (const [i, image] of rest.entries()) {
    galleryFiles.push(await take(image, String(i + 1).padStart(2, '0')));
  }

  const gallery = galleryFiles
    .map(
      (file, i) =>
        `  - src: ../../assets/projects/${slug}/${file}\n    wide: ${i % 3 === 0 ? 'true' : 'false'}`,
    )
    .join('\n');

  const mdx = `---
# TẠM: đổi title, year, location, type theo dự án thật — xem assets-source/RENAME-TODO.md
title: Dự án ${num}
excerpt: Bộ ảnh công trình chuyển từ website cũ, đang chờ bổ sung mô tả và thông số dự án.
year: ${String(cluster.uploadedAt).slice(0, 4)}
location: ${hint.location ?? 'Chưa cập nhật'}
type: ${type}
status: hoan-thanh
order: ${order + 1}
featured: ${order < 6}
cover: ../../assets/projects/${slug}/${coverFile}
gallery:
${gallery}
---

Nội dung dự án đang được bổ sung.
`;

  await writeFile(path.join(CONTENT, `${slug}.mdx`), mdx);
  created += 1;

  todo.push(
    `## ${slug} — ${copied.length} ảnh`,
    `- Nhóm gốc: #${cluster.index}, upload ${String(cluster.uploadedAt).slice(0, 10)}`,
    `- Hạng mục đang đặt: \`${type}\`${hint.note ? ` (đoán từ: ${hint.note})` : ' — **cần xác nhận**'}`,
    `- Ảnh gốc: ${copied.map((c) => `${c.original} → ${c.target}`).join(', ')}`,
    '',
  );
}

/*
  Ảnh hero và ảnh trang giới thiệu chọn bằng mắt, không để thuật toán quyết:
  điểm chấm độ màu phân biệt được ảnh render với bản vẽ, nhưng không biết bức nào
  có bố cục làm hero tốt.

  hero.jpg là ảnh ngang có nhiều trời phía trên — chỗ đó dành cho header và tên
  studio. hero-portrait.jpg là ảnh dọc dùng riêng cho điện thoại; nhồi ảnh ngang
  vào màn dọc thì object-cover cắt mất hai bên và công trình bị phóng to.
*/
const FIXED_IMAGES = [
  { month: '2021-08', file: 'z2713114648504_355d96f167867480287cdeb1c571c7f5.jpg', target: 'hero.jpg' },
  { month: '2021-09', file: 'EX-1-scaled.jpg', target: 'hero-portrait.jpg' },
  { month: '2021-09', file: '1-web.jpg', target: 'studio.jpg' },
];

for (const item of FIXED_IMAGES) {
  const from = path.join(SOURCE, item.month, item.file);
  if (!(await exists(from))) {
    console.warn(`Bỏ qua ${item.target}: không tìm thấy ${item.file}`);
    continue;
  }

  await sharp(from)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ASSETS, item.target));

  console.log(`${item.target} ← ${item.file}`);
}

await writeFile(path.join(SOURCE, 'RENAME-TODO.md'), `${todo.join('\n')}\n`);

console.log(`\nĐã tạo ${created} dự án trong src/content/projects/.`);
console.log('Danh sách cần đổi tên: assets-source/RENAME-TODO.md');
