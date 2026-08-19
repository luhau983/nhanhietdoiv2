/**
 * Hạng mục dự án — lấy đúng theo taxonomy của website cũ nhanhietdoi.vn.
 *
 * Slug giữ nguyên như cũ (/danh-muc/nha-pho/, /danh-muc/biet-thu/...) để khi lên
 * production có thể redirect 1:1 từ URL cũ sang URL mới, không mất thứ hạng tìm kiếm.
 */
export const PROJECT_TYPES = [
  { slug: 'nha-pho', label: 'Nhà phố' },
  { slug: 'biet-thu', label: 'Biệt thự' },
  { slug: 'can-ho-penthouse', label: 'Căn hộ | Penthouse' },
  { slug: 'khach-san-resort', label: 'Khách sạn | Resort' },
  { slug: 'bar-cafe-nha-hang-karaoke', label: 'Cafe | Nhà hàng' },
  { slug: 'spa-beauty-salon', label: 'Spa | Beauty Salon' },
  { slug: 'showroom-shop-building-office', label: 'Office | Showroom' },
  { slug: 'concept', label: 'Concept' },
] as const;

export type ProjectTypeSlug = (typeof PROJECT_TYPES)[number]['slug'];

export const PROJECT_TYPE_SLUGS = PROJECT_TYPES.map((t) => t.slug) as unknown as [
  ProjectTypeSlug,
  ...ProjectTypeSlug[],
];

const TYPE_LABELS: Record<ProjectTypeSlug, string> = Object.fromEntries(
  PROJECT_TYPES.map((t) => [t.slug, t.label]),
) as Record<ProjectTypeSlug, string>;

export function typeLabel(slug: ProjectTypeSlug): string {
  return TYPE_LABELS[slug];
}

/** Dịch vụ studio nhận làm — theo trang /dich-vu/ của website cũ. */
export const SERVICES = [
  { slug: 'thiet-ke-kien-truc', label: 'Thiết kế kiến trúc' },
  { slug: 'thiet-ke-noi-that', label: 'Thiết kế nội thất' },
  { slug: 'thiet-ke-landscape', label: 'Thiết kế landscape' },
  { slug: 'thi-cong-xay-dung', label: 'Thi công xây dựng' },
] as const;

/**
 * Nhóm ảnh trong gallery của một dự án — mỗi nhóm là một tab.
 *
 * Ba nhóm này là phân biệt mà người xem nhà thực sự cần: bản render bán ý tưởng,
 * ảnh thực tế chứng minh studio làm ra được đúng cái đã vẽ. Trộn hai loại vào một
 * lưới thì không ai biết cái nào là cái nào.
 *
 * Thứ tự khai báo ở đây là thứ tự tab trên trang.
 */
export const GALLERY_KINDS = [
  { slug: '3d', label: 'Ảnh 3D' },
  { slug: 'thuc-te', label: 'Thực tế' },
  { slug: 'khac', label: 'Khác' },
] as const;

export type GalleryKind = (typeof GALLERY_KINDS)[number]['slug'];

export const GALLERY_KIND_SLUGS = GALLERY_KINDS.map((k) => k.slug) as unknown as [
  GalleryKind,
  ...GalleryKind[],
];

/**
 * Cách xem lưới ảnh trong gallery dự án. Slug đầu tiên là mặc định.
 *
 * Ba cách này giải quyết ba nhu cầu khác nhau, không phải ba biến thể thẩm mỹ: xem nhanh
 * cả bộ (ô vuông), xem đúng bố cục khung hình mà kiến trúc sư đã chọn (tỉ lệ gốc), xem kỹ
 * từng ảnh (một cột). Ô vuông làm mặc định vì nó trả lời câu hỏi đầu tiên của người mới
 * vào — dự án này có những gì.
 *
 * `sizes` khai ở đây cùng chỗ với slug: mỗi cách xem cho ảnh một bề rộng khác nhau, mà
 * srcset thì cố định — để hai thứ này ở hai file là sớm muộn cũng lệch, và lệch kiểu đó
 * chỉ hiện ra thành ảnh mờ chứ không thành lỗi build.
 */
export const GALLERY_LAYOUTS = [
  {
    slug: 'o-vuong',
    label: 'Lưới ô vuông',
    sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33.33vw, 50vw',
  },
  {
    slug: 'ti-le',
    label: 'Giữ tỉ lệ gốc',
    sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33.33vw, 50vw',
  },
  {
    slug: 'mot-cot',
    label: 'Một cột lớn',
    sizes: '100vw',
  },
] as const;

export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number]['slug'];

export const DEFAULT_GALLERY_LAYOUT: GalleryLayout = GALLERY_LAYOUTS[0].slug;

export const PROJECT_STATUSES = ['hoan-thanh', 'dang-thi-cong', 'thiet-ke'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

const STATUS_LABELS: Record<ProjectStatus, string> = {
  'hoan-thanh': 'Hoàn thành',
  'dang-thi-cong': 'Đang thi công',
  'thiet-ke': 'Phương án thiết kế',
};

export function statusLabel(slug: ProjectStatus): string {
  return STATUS_LABELS[slug];
}
