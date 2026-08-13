import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { PROJECT_STATUSES, PROJECT_TYPE_SLUGS } from '@/config/taxonomy';

/**
 * Content layer. Thêm dự án = thêm 1 file .mdx + 1 thư mục ảnh, commit là xong.
 * Schema zod chặn sai sót ngay lúc build: thiếu năm, sai loại, ảnh không tồn tại
 * đều làm build fail thay vì ra site lỗi.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.mdx' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),

      // Tóm tắt 1–2 câu, dùng cho meta description và card. Giới hạn để không tràn layout.
      excerpt: z.string().min(20).max(220),

      year: z.number().int().min(1990).max(2100),
      location: z.string().min(1),
      type: z.enum(PROJECT_TYPE_SLUGS),
      status: z.enum(PROJECT_STATUSES).default('hoan-thanh'),

      // Chuỗi tự do vì đơn vị thay đổi: "320 m²", "1.200 m² sàn".
      area: z.string().optional(),
      client: z.string().optional(),
      team: z.array(z.string()).default([]),
      photographer: z.string().optional(),

      cover: image(),

      gallery: z
        .array(
          z.object({
            src: image(),
            caption: z.string().optional(),
            // wide = tràn viền, dùng cho ảnh toàn cảnh. Mặc định nằm trong lưới.
            wide: z.boolean().default(false),
          }),
        )
        .default([]),

      // featured: lên trang chủ. order: số nhỏ hiện trước.
      featured: z.boolean().default(false),
      order: z.number().int().default(999),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
