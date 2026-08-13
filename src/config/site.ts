/**
 * Nguồn sự thật duy nhất cho thông tin studio.
 * Dữ liệu lấy từ website cũ nhanhietdoi.vn (trang chủ — các trang con đã 404).
 *
 * CẦN BỔ SUNG: `address` không có ở đâu trên site cũ. Điền vào trước khi lên
 * production — địa chỉ trống làm hỏng structured data cho tìm kiếm địa phương,
 * thứ một studio kiến trúc sống nhờ vào.
 */
export const site = {
  name: 'Nhà Nhiệt Đới',
  legalName: 'Nhà Nhiệt Đới Architecture Studio',

  // Dòng định vị hiện ở hero. Phải trả lời được "studio này làm gì"
  // trong một lần đọc — đây là yêu cầu cốt lõi của trang chủ.
  positioning: 'Thiết kế kiến trúc, nội thất & thi công',
  city: 'Đồng Nai',

  // Site cũ ghi "9 năm kinh nghiệm" ở thời điểm 2021 → suy ra khoảng 2012.
  // Xác nhận lại nếu cần chính xác.
  foundedYear: 2012,

  description:
    'Nhà Nhiệt Đới Architecture Studio — thiết kế kiến trúc, nội thất, landscape và thi công xây dựng: nhà phố, biệt thự, căn hộ, khách sạn, cafe và showroom.',

  email: 'nhanhietdoikts@gmail.com',
  phone: '0964 990 168',
  phoneHref: '+84964990168',
  address: '',

  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/nhanhietdoivn' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UC_X568tXe3n9kIqvhixSGUg' },
  ],

  nav: [
    { label: 'Dự án', href: '/projects' },
    { label: 'Về studio', href: '/about' },
    { label: 'Liên hệ', href: '/contact' },
  ],
} as const;

export type Site = typeof site;

/**
 * Nút liên hệ nổi. Site cũ dùng plugin button-contact-vr với điện thoại + Zalo;
 * giữ đúng các kênh đó, thêm Messenger vì fanpage là kênh chính đang hoạt động.
 */
export const contactChannels = [
  { id: 'phone', label: 'Gọi điện', href: `tel:${site.phoneHref}` },
  { id: 'zalo', label: 'Zalo', href: 'https://zalo.me/0964990168' },
  { id: 'messenger', label: 'Messenger', href: 'https://m.me/nhanhietdoivn' },
  { id: 'email', label: 'Email', href: `mailto:${site.email}` },
] as const;

export type ContactChannelId = (typeof contactChannels)[number]['id'];
