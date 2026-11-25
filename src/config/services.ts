/**
 * Dịch vụ và quy trình — phần trả lời câu "studio nhận làm gì, làm thế nào".
 *
 * Bốn dịch vụ lấy theo trang /dich-vu/ của website cũ. `scope` là các hạng mục
 * công việc viết ngắn, CẦN STUDIO XÁC NHẬN trước khi lên production.
 */
export const SERVICES = [
  {
    slug: 'thiet-ke-kien-truc',
    num: '01',
    label: 'Thiết kế kiến trúc',
    scope: ['Mặt bằng, hình khối', 'Phối cảnh 3D', 'Hồ sơ kỹ thuật thi công'],
  },
  {
    slug: 'thiet-ke-noi-that',
    num: '02',
    label: 'Thiết kế nội thất',
    scope: ['Concept, moodboard', 'Phối cảnh 3D', 'Bản vẽ chi tiết nội thất'],
  },
  {
    slug: 'thiet-ke-landscape',
    num: '03',
    label: 'Thiết kế landscape',
    scope: ['Sân vườn, tiểu cảnh', 'Cây xanh, mặt nước', 'Chiếu sáng ngoài trời'],
  },
  {
    slug: 'thi-cong-xay-dung',
    num: '04',
    label: 'Thi công xây dựng',
    scope: ['Dự toán, tiến độ', 'Phần thô và hoàn thiện', 'Giám sát, nghiệm thu, bàn giao'],
  },
] as const;

/** Bốn giai đoạn lớn. Thứ tự khai báo là thứ tự trên trang. */
export const PROCESS_PHASES = [
  { slug: 'khao-sat', label: 'Khảo sát' },
  { slug: 'y-tuong', label: 'Ý tưởng' },
  { slug: 'ky-thuat', label: 'Hồ sơ kỹ thuật' },
  { slug: 'thi-cong', label: 'Thi công' },
] as const;

export type ProcessPhase = (typeof PROCESS_PHASES)[number]['slug'];

interface ProcessStep {
  /** Hai chữ số để cột số không nhảy chiều rộng. */
  num: string;
  title: string;
  body: string;
  phase: ProcessPhase;
}

export const PROCESS: readonly ProcessStep[] = [
  {
    num: '01',
    title: 'Tư vấn nhu cầu',
    body: 'Lắng nghe mong muốn, ngân sách và phong cách sống của gia chủ.',
    phase: 'khao-sat',
  },
  {
    num: '02',
    title: 'Khảo sát hiện trạng',
    body: 'Đánh giá mặt bằng, hướng nắng, hướng gió và kết cấu.',
    phase: 'khao-sat',
  },
  {
    num: '03',
    title: 'Đề xuất concept',
    body: 'Moodboard, mặt bằng công năng, định hướng vật liệu.',
    phase: 'y-tuong',
  },
  {
    num: '04',
    title: 'Thiết kế sơ bộ',
    body: 'Hình khối, phối cảnh sơ bộ, chốt phương án cùng gia chủ.',
    phase: 'y-tuong',
  },
  {
    num: '05',
    title: 'Thiết kế chi tiết',
    body: 'Bản vẽ kiến trúc, nội thất, kỹ thuật và hồ sơ triển khai.',
    phase: 'ky-thuat',
  },
  {
    num: '06',
    title: 'Báo giá & tiến độ',
    body: 'Dự toán chi tiết và kế hoạch thi công trước khi khởi công.',
    phase: 'ky-thuat',
  },
  {
    num: '07',
    title: 'Thi công',
    body: 'Kiểm soát chất lượng, tiến độ, vật liệu và an toàn.',
    phase: 'thi-cong',
  },
  {
    num: '08',
    title: 'Nghiệm thu & bàn giao',
    body: 'Kiểm tra từng hạng mục, hoàn thiện và bàn giao.',
    phase: 'thi-cong',
  },
];

/**
 * 4 giai đoạn kèm dải số bước ("01–02") — bản tóm tắt cho trang chủ.
 * Ghép ở đây để bản tóm tắt và bản 8 bước không bao giờ lệch nhau.
 */
export const PROCESS_BY_PHASE = PROCESS_PHASES.map((phase) => {
  const steps = PROCESS.filter((step) => step.phase === phase.slug);
  const first = steps[0]?.num ?? '';
  const last = steps[steps.length - 1]?.num ?? '';

  return { ...phase, steps, range: first === last ? first : `${first}–${last}` };
});
