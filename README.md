# Nhà Nhiệt Đới — website studio kiến trúc

Thay thế website WordPress cũ tại [nhanhietdoi.vn](https://nhanhietdoi.vn).

## Stack

| Thành phần | Lựa chọn | Lý do |
| --- | --- | --- |
| Framework | Astro 5 (`output: 'static'`) | Xuất HTML tĩnh, chạy được trên shared hosting không cần Node runtime |
| CSS | Tailwind 4 (`@tailwindcss/vite`) | Token khai báo trong `src/styles/global.css` qua `@theme` |
| Nội dung | Content Collections + MDX + zod | Thêm dự án = thêm 1 file `.mdx`; sai schema thì build fail, không ra site lỗi |
| Ảnh | `astro:assets` + sharp | Tối ưu lúc build, xuất WebP + `srcset`; không cần server xử lý ảnh |
| Motion | Lenis + GSAP ScrollTrigger | GSAP chỉ tải ở trang có `[data-parallax]` |
| Font | Be Vietnam Pro (self-host) | Có đủ dấu tiếng Việt — nhiều font display thì không |

## Lệnh

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run check
```

## Thêm một dự án

1. Tạo `src/content/projects/<slug>.mdx`
2. Bỏ ảnh vào `src/assets/projects/<slug>/`
3. Điền frontmatter theo schema trong [src/content.config.ts](src/content.config.ts)

`slug` của file chính là URL: `src/content/projects/nha-pho-bien-hoa.mdx` → `/projects/nha-pho-bien-hoa`.

Trường bắt buộc: `title`, `excerpt` (20–220 ký tự), `year`, `location`, `type`, `cover`.
`type` phải là một slug trong [src/config/taxonomy.ts](src/config/taxonomy.ts).

Đặt `featured: true` để lên trang chủ, `order` nhỏ hơn thì hiện trước, `draft: true` để ẩn.

## Kiến trúc trang

- **Trang chủ** — hero một ảnh + lưới dự án 6 cột tràn viền. Ảnh trả lời "studio này làm kiến trúc gì", chữ giữ ở mức tối thiểu. Hover mỗi ô ra tên dự án, hạng mục, năm và link.
- **`/projects`** — lưới đầy đủ + lọc theo hạng mục ở phía client (`?type=` chia sẻ được).
- **`/projects/<slug>`** — hero ảnh cover, bảng thông số, nội dung MDX, gallery, điều hướng dự án trước/sau.
- **`/about`, `/contact`** — dịch vụ, hạng mục, quy trình, thông tin liên hệ.
- **Báo chí** — hai bài VnExpress, khai báo ở [src/config/press.ts](src/config/press.ts), hiện ở trang chủ và `/about`. Chỉ lưu tiêu đề + link + ngày; không sao chép nội dung hay hotlink ảnh của báo.

Hai nút nổi góc phải: nút liên hệ (hover mở trên desktop, bấm để mở/đóng trên mọi thiết bị, bấm đóng thì chặn hover mở lại tới khi chuột rời đi) và nút về đầu trang.

Header có hai trạng thái do [Motion.astro](src/components/motion/Motion.astro) điều khiển: trong suốt + chữ trắng khi nằm trên hero, nền giấy + chữ mực khi đã cuộn qua. Không dùng `mix-blend-difference` — header phải có `z-index`, mà `z-index` tạo stacking context nên blend bị cô lập và chữ trắng mất tương phản trên nền sáng.

## Mobile

- Hero dùng art direction thật qua `<picture>` trong [Hero.astro](src/components/layout/Hero.astro): điện thoại tải ảnh dọc, desktop tải ảnh ngang. Nhồi một ảnh cho cả hai khung là lý do hero từng trông "quá lớn" — ảnh dọc trong khung ngang bị cắt mất 65% chiều cao.
- Chiều cao hero `74svh` trên mobile, `88svh` trên desktop. Dùng `svh` chứ không `vh` để thanh địa chỉ của browser mobile không làm nhảy layout. Hero thấp hơn một màn hình để lưới dự án hé lên, cho thấy còn nội dung bên dưới.
- Vùng chạm tối thiểu 44px: nút Menu, nút Đóng, chip lọc hạng mục, hai nút nổi.
- Nhãn trên ô lưới `line-clamp-2` để tên dự án dài không đẩy nhãn hạng mục tràn khỏi ô 187px.
- Nút liên hệ: hover mở trên thiết bị có con trỏ (`@media (hover: hover)`), bấm để mở/đóng ở mọi thiết bị. Chặn hover mở lại sau khi bấm đóng, và chạm ra ngoài để đóng.

## Hai bẫy đã gặp, đừng lặp lại

**Script của component chạy sau `astro:page-load`.** Astro hoist script xuống, nên script đăng ký `document.addEventListener('astro:page-load', init)` ở component trong `<body>` sẽ không bao giờ khởi tạo ở lần tải đầu — ClientRouter nằm trong `<head>` đã bắn event trước đó. Cách xử lý trong repo: uỷ quyền sự kiện ở cấp module (ContactButtons, BackToTop) hoặc gọi thẳng `init()` kèm cờ chống gắn hai lần (`/projects`).

**Biến thể `peer-*`/`group-*` của Tailwind 4 không cộng specificity.** Chúng được bọc trong `:where()`, nên `peer-checked:visible` hoà 0,1,0 với `invisible` rồi thua theo thứ tự khai báo. Trạng thái hiện/ẩn nào quan trọng thì viết selector trong `<style>` của component.

**Lenis không phát `scroll` event trên window.** Muốn phản ứng theo vị trí cuộn thì dùng IntersectionObserver (như mốc đo của nút về đầu trang) hoặc `lenis.on('scroll')`; đừng gắn `window.addEventListener('scroll')`. Cuộn theo lệnh phải gọi `window.__lenis.scrollTo()`, không gọi `window.scrollTo` trực tiếp.

## Trạng thái nội dung — CẦN XỬ LÝ

Website cũ chỉ còn trang chủ hoạt động. Custom post type `du-an` không còn được đăng ký nên `/du-an/...`, `/danh-muc/...`, `/lien-he/` đều trả 404, và ảnh trong media library không gắn với post nào (`post: 0`).

Đã lấy được:

- 263 ảnh (145 MB) từ media library → `assets-source/` (không commit, chạy `npm run fetch:old-images` để lấy lại)
- Thông tin studio: tên, email, SĐT, Facebook, YouTube, 8 hạng mục (giữ slug cũ để redirect 1:1), 4 dịch vụ
- 11 dự án dựng từ các nhóm ảnh suy ra theo mốc thời gian upload → `npm run import:old-projects`

Chưa có, phải bổ sung trước khi lên production:

1. **Tên dự án thật.** 11 dự án đang mang tên tạm `Dự án 01`…`Dự án 11`, `location: Chưa cập nhật`. Danh sách kèm ảnh gốc của từng nhóm: `assets-source/RENAME-TODO.md`.

   Bốn tên đã biết, dùng để đối chiếu:
   - *Mr.Hai's Villa* — Trảng Bom, Đồng Nai (trang chủ site cũ)
   - *Biệt thự vườn Chú Cư* — 250 m², Đồng Nai (trang chủ site cũ)
   - *Nhà vườn 80 m²* — Đồng Nai (bài VnExpress 18.07.2025)
   - *Nhà nghỉ dưỡng 500 m²* — Đồng Nai (bài VnExpress 28.07.2025)

   Tên nhóm thiết kế trong hai bài báo (Đỗ Đình Mạnh, Nguyễn Thái Hoàng) đã đưa vào trang `/about`; vai trò cụ thể của từng người thì cần studio xác nhận.
2. **Hạng mục cần xác nhận.** 4 dự án đoán được từ tên file (VINHOME → căn hộ, `thiet-ke-biet-thu-tai-binh-duong` → biệt thự, `PHONG-TU-VAN`/`SANH-CS` → spa), 7 dự án còn lại đang mặc định `nha-pho`.
3. **Địa chỉ văn phòng.** `site.address` đang rỗng — trang chủ cũ không ghi ở đâu. Địa chỉ trống làm hỏng structured data cho tìm kiếm địa phương.
4. **`site` trong `astro.config.mjs`** đang là `https://studio07.vn`, đổi thành domain thật (sitemap và canonical URL dựa vào đây).

## Ảnh và dung lượng build

Ảnh nguồn trong `src/assets/` được nén sẵn ở cạnh dài tối đa 2400px (script import làm việc này). Đừng bỏ ảnh gốc 2560px/2 MB vào đây: Vite phát ra cả file gốc của mọi ảnh trong module graph, kể cả ảnh chỉ dùng qua `<Image>`, nên bản build phình lên vì những file không trang nào trỏ tới.

`npm run build` tự chạy [prune-unused-assets.mjs](scripts/prune-unused-assets.mjs) để xoá ảnh trong `dist/_astro` không được HTML tham chiếu — bước này giảm 26 MB. Nếu sau này có code ghép đường dẫn ảnh lúc chạy thì phải bỏ bước dọn đi.

Hiện tại `dist/` khoảng 54 MB cho 16 trang (trước khi nén và dọn là 111 MB).

`og:image` sinh riêng bản cắt 1200×630 ở [projects/[slug].astro](src/pages/projects/[slug].astro) — không dùng thẳng ảnh cover, vì ảnh gốc sai tỉ lệ nên Facebook/Zalo tự cắt lung tung.

## Deploy

Build ra `dist/`, upload vào `public_html`. Ưu tiên rsync qua SSH; không có SSH thì FTPS. Đặt Cloudflare (free) trước domain để cache ảnh ở edge — shared hosting không có CDN mà mỗi trang tải hàng chục ảnh.

Lần deploy đầu vào `public_html` đang chạy WordPress: backup trước, và bỏ `--delete` ở lần chạy đầu để kiểm tra file lên đúng chỗ.
