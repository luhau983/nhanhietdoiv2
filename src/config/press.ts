/**
 * Bài báo viết về công trình của studio.
 *
 * Chỉ lưu tiêu đề + link + ngày, không sao chép nội dung hay ảnh của báo:
 * ảnh trên bài là tài sản của bên xuất bản, và hotlink sang máy chủ họ có thể
 * chết bất cứ lúc nào.
 *
 * `credit` lấy đúng phần ghi công trong bài — dùng để đối chiếu khi đặt tên
 * cho các dự án đang mang tên tạm.
 */
export const press = [
  {
    outlet: 'VnExpress',
    title: "Nhà vườn 80 m² 'ngoài giản dị, trong tiện nghi'",
    href: 'https://vnexpress.net/nha-vuon-80-m2-ngoai-gian-di-trong-tien-nghi-4915494.html',
    date: '2025-07-18',
    dateLabel: '18.07.2025',
    location: 'Đồng Nai',
    credit: 'Nhóm thiết kế: Đỗ Đình Mạnh, Nguyễn Thái Hoàng — Ảnh: Đức Ngô',
  },
  {
    outlet: 'VnExpress',
    title: 'Nhà nghỉ dưỡng 500 m² đưa mảng xanh vào từng không gian nhỏ',
    href: 'https://vnexpress.net/nha-nghi-duong-500-m2-dua-mang-xanh-vao-tung-khong-gian-nho-4919493.html',
    date: '2025-07-28',
    dateLabel: '28.07.2025',
    location: 'Đồng Nai',
    credit: 'Nhóm KTS: Đỗ Đình Mạnh, Nguyễn Thái Hoàng — Ảnh: Đức Ngô',
  },
] as const;

export type PressItem = (typeof press)[number];
