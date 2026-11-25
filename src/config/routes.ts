/**
 * Mọi đường dẫn nội bộ đi qua đây — đổi slug một chỗ là cả site theo.
 *
 * Slug tiếng Việt khớp với website WordPress cũ (/du-an/, /dich-vu/, /gioi-thieu/,
 * /lien-he/) nên link cũ ngoài Google vẫn trúng trang mới, không cần redirect.
 */
export const ROUTES = {
  home: '/',
  projects: '/du-an',
  services: '/dich-vu',
  studio: '/gioi-thieu',
  contact: '/lien-he',
} as const;

/** Tên tham số lọc loại hình trên URL: /du-an?loai=biet-thu */
export const TYPE_PARAM = 'loai';

export function projectPath(id: string): string {
  return `${ROUTES.projects}/${id}`;
}

export function typePath(slug: string): string {
  return `${ROUTES.projects}?${TYPE_PARAM}=${slug}`;
}

export function servicePath(slug: string): string {
  return `${ROUTES.services}#${slug}`;
}
