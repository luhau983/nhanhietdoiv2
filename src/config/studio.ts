/**
 * Nội dung biên tập của trang giới thiệu: giá trị, lý do chọn, nhóm.
 * Dịch vụ và quy trình nằm ở services.ts.
 */

export const VALUES = [
  {
    num: '01',
    title: 'Tiện nghi',
    body: 'Không gian tổ chức theo thói quen sống thực tế: luồng di chuyển, ánh sáng, công năng.',
  },
  {
    num: '02',
    title: 'Sang trọng',
    body: 'Vật liệu, tỷ lệ và chi tiết phối hợp để đẹp bền theo thời gian.',
  },
  {
    num: '03',
    title: 'Tinh tế',
    body: 'Mỗi chi tiết vừa đủ, hài hòa với thiên nhiên và bối cảnh công trình.',
  },
] as const;

export const WHY_US = [
  {
    num: '01',
    title: 'Am hiểu khí hậu nhiệt đới',
    body: 'Tận dụng ánh sáng, thông gió, cây xanh và vật liệu hợp điều kiện Việt Nam.',
  },
  {
    num: '02',
    title: 'Cân bằng thẩm mỹ và công năng',
    body: 'Đẹp, tiện nghi và đúng nhu cầu sử dụng thực tế của gia đình.',
  },
  {
    num: '03',
    title: 'Đồng hành trọn vẹn',
    body: 'Từ ý tưởng, hồ sơ kỹ thuật đến giám sát thi công và hoàn thiện.',
  },
  {
    num: '04',
    title: 'Minh bạch quy trình',
    body: 'Gia chủ nắm rõ phạm vi, thời gian và ngân sách trước khi bắt đầu.',
  },
] as const;

/**
 * Tên lấy từ phần ghi công trong hai bài VnExpress về công trình của studio.
 * Vai trò cụ thể cần studio xác nhận.
 */
export const TEAM = [
  { name: 'Đỗ Đình Mạnh', role: 'Kiến trúc sư' },
  { name: 'Nguyễn Thái Hoàng', role: 'Kiến trúc sư' },
] as const;
