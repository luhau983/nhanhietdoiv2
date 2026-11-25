import { getCollection, type CollectionEntry } from 'astro:content';
import { PROJECT_TYPES, typeLabel, type ProjectTypeSlug } from '@/config/taxonomy';

export type Project = CollectionEntry<'projects'>;

export interface TypeCount {
  slug: ProjectTypeSlug;
  label: string;
  count: number;
}

/** Dự án đã công bố, theo `order` rồi năm mới trước. Nơi duy nhất quyết định thứ tự. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

/** Mọi loại hình kèm số dự án — giữ cả loại chưa có dự án (count = 0). */
export function countByType(projects: readonly Project[]): TypeCount[] {
  return PROJECT_TYPES.map((type) => ({
    slug: type.slug,
    label: type.label,
    count: projects.filter((p) => p.data.type === type.slug).length,
  }));
}

/** Alt của ảnh cover: "Tên — Loại hình[ tại Địa điểm]". Địa điểm chưa có thì bỏ. */
export function coverAlt(project: Project): string {
  const { title, type, location } = project.data;
  return `${title} — ${typeLabel(type)}${location ? ` tại ${location}` : ''}`;
}
