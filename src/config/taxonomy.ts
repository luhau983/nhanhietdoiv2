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
