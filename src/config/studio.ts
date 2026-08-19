/**
 * Nội dung tuyên bố của studio: giá trị, quy trình, lý do chọn.
 *
 * Tách khỏi site.ts vì hai loại dữ liệu khác nhau: site.ts là thông tin định danh
 * (tên, điện thoại, mạng xã hội) gần như không đổi, còn đây là nội dung biên tập —
 * sửa chữ, đổi thứ tự, thêm bước là việc bình thường.
 *
 * Nguồn: bản prototype React nhanhietdoi (scripts/data.jsx — VALUES, PROCESS, WHY_US).
 * Bỏ toàn bộ field `_en`: site này đơn ngữ, giữ lại chỉ làm dữ liệu chết.
 */

export const VALUES = [
  {
    num: '01',
    title: 'Tiện nghi',
    body: 'Không gian được tổ chức theo thói quen sống thực tế của gia chủ, tối ưu luồng di chuyển, ánh sáng và công năng sử dụng.',
  },
  {
    num: '02',
    title: 'Sang trọng',
    body: 'Vật liệu, tỷ lệ, ánh sáng và chi tiết được phối hợp để tạo nên giá trị thẩm mỹ bền vững theo thời gian.',
  },
  {
    num: '03',
    title: 'Tinh tế',
    body: 'Mỗi chi tiết được xử lý vừa đủ, hài hòa với thiên nhiên, bối cảnh công trình và cảm xúc sống của người sử dụng.',
  },
] as const;

/**
 * Bốn giai đoạn lớn của một dự án. Thứ tự khai báo là thứ tự trên trang.
 *
 * Tồn tại để trang chủ và trang /about không nói hai điều khác nhau: trang chủ cần
 * mức chi tiết đủ để người đang cân nhắc thấy studio làm việc có hệ thống (8 bước),
 * trang /about chỉ cần bản đồ tổng (4 giai đoạn). Trước đây /about hardcode 4 mục
 * riêng, nên sửa quy trình ở một nơi là hai trang lệch nhau ngay.
 */
export const PROCESS_PHASES = [
  { slug: 'khao-sat', label: 'Khảo sát hiện trạng' },
  { slug: 'y-tuong', label: 'Phương án ý tưởng' },
  { slug: 'ky-thuat', label: 'Hồ sơ kỹ thuật' },
  { slug: 'thi-cong', label: 'Giám sát thi công' },
] as const;

export type ProcessPhase = (typeof PROCESS_PHASES)[number]['slug'];

/*
  Cùng ba field num / title / body với VALUES và WHY_US — không phải trùng hợp.

  Ba danh sách này đều đổ vào cùng một component BandList ở trang chủ, nên giữ chung một
  hình dạng để không cần lớp chuyển đổi tên field ở giữa. `phase` là phần thêm riêng của
  quy trình, BandList không đọc tới.
*/
interface ProcessStep {
  /** Số hiệu hiển thị. Hai chữ số để cột số không nhảy chiều rộng giữa 09 và 10. */
  num: string;
  title: string;
  body: string;
  phase: ProcessPhase;
}

export const PROCESS: readonly ProcessStep[] = [
  {
    num: '01',
    title: 'Tư vấn nhu cầu',
    body: 'Lắng nghe mong muốn, ngân sách, phong cách sống và định hướng không gian của gia chủ.',
    phase: 'khao-sat',
  },
  {
    num: '02',
    title: 'Khảo sát hiện trạng',
    body: 'Đánh giá mặt bằng, hướng nắng, hướng gió, kết cấu và các điều kiện thực tế của mảnh đất.',
    phase: 'khao-sat',
  },
  {
    num: '03',
    title: 'Đề xuất concept',
    body: 'Moodboard, mặt bằng công năng, định hướng phong cách, vật liệu và trải nghiệm không gian.',
    phase: 'y-tuong',
  },
  {
    num: '04',
    title: 'Thiết kế sơ bộ',
    body: 'Phát triển mặt bằng, hình khối, phối cảnh sơ bộ và chốt phương án cùng gia chủ.',
    phase: 'y-tuong',
  },
  {
    num: '05',
    title: 'Thiết kế chi tiết',
    body: 'Hoàn thiện bản vẽ kiến trúc, nội thất, kỹ thuật, phối cảnh và hồ sơ triển khai.',
    phase: 'ky-thuat',
  },
  {
    num: '06',
    title: 'Báo giá & tiến độ',
    body: 'Lập dự toán chi tiết, kế hoạch tiến độ và phương án thi công trước khi khởi công.',
    phase: 'ky-thuat',
  },
  {
    num: '07',
    title: 'Thi công',
    body: 'Kiểm soát chất lượng, tiến độ, vật liệu và an toàn lao động trong suốt quá trình.',
    phase: 'thi-cong',
  },
  {
    num: '08',
    title: 'Nghiệm thu & bàn giao',
    body: 'Kiểm tra từng hạng mục, hoàn thiện chi tiết và bàn giao công trình cho gia chủ.',
    phase: 'thi-cong',
  },
] as const;

/**
 * 4 giai đoạn kèm các bước thuộc về nó — dạng /about cần.
 *
 * Tính ở đây chứ không ở trang: nếu một bước khai `phase` không có trong
 * PROCESS_PHASES thì nó biến mất khỏi /about mà không ai biết, nên chỗ ghép hai
 * danh sách phải nằm cạnh cả hai.
 */
export const PROCESS_BY_PHASE = PROCESS_PHASES.map((phase) => {
  const steps = PROCESS.filter((step) => step.phase === phase.slug);

  return {
    ...phase,
    steps,
    /** "01–02". Một bước thì chỉ hiện số của nó. */
    range:
      steps.length > 1
        ? `${steps[0].num}–${steps[steps.length - 1].num}`
        : (steps[0]?.num ?? ''),
  };
});

export const WHY_US = [
  {
    num: '01',
    title: 'Am hiểu khí hậu nhiệt đới',
    body: 'Thiết kế tận dụng ánh sáng, thông gió, cây xanh và vật liệu phù hợp với điều kiện sống tại Việt Nam.',
  },
  {
    num: '02',
    title: 'Tối ưu thẩm mỹ và công năng',
    body: 'Mỗi không gian được cân bằng giữa cái đẹp, sự tiện nghi và nhu cầu sử dụng thực tế của gia đình.',
  },
  {
    num: '03',
    title: 'Đồng hành trọn vẹn',
    body: 'Từ ý tưởng ban đầu, thiết kế, hồ sơ kỹ thuật đến giám sát thi công và hoàn thiện.',
  },
  {
    num: '04',
    title: 'Minh bạch quy trình',
    body: 'Gia chủ nắm rõ từng giai đoạn, phạm vi công việc, thời gian và ngân sách trước khi bắt đầu.',
  },
] as const;
