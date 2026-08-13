import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Đổi thành domain thật trước khi deploy — sitemap và canonical URL dựa vào đây.
  site: 'https://studio07.vn',

  // Xuất HTML tĩnh: chạy được trên shared hosting, không cần Node runtime.
  output: 'static',

  // /projects/abc/index.html thay vì /projects/abc.html — Apache/Nginx phục vụ trực tiếp,
  // không cần rewrite rule.
  build: { format: 'directory' },

  integrations: [mdx(), sitemap()],

  // Không set image.layout: site này crop ảnh bằng CSS (object-cover + aspect-ratio)
  // nên không muốn Astro tự chèn style ràng buộc kích thước. srcset khai báo tay
  // qua widths/sizes ở từng <Image> để kiểm soát bandwidth.

  vite: { plugins: [tailwindcss()] },
});
