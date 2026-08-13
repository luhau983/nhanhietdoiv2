import type Lenis from 'lenis';

declare global {
  interface Window {
    /**
     * Instance Lenis do Motion.astro tạo và công khai.
     * Mọi cú cuộn theo lệnh (nút về đầu trang, nhảy tới anchor) phải đi qua đây —
     * gọi window.scrollTo trực tiếp sẽ làm vị trí nội bộ của Lenis lệch khỏi vị
     * trí thật và cú cuộn tiếp theo bị giật về chỗ cũ.
     */
    __lenis?: Lenis;
  }
}
