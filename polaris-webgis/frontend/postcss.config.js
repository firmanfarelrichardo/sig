/**
 * PostCSS Configuration
 * 
 * MENGAPA PostCSS?
 * TailwindCSS menggunakan PostCSS sebagai build pipeline untuk:
 * 1. Memproses @tailwind directives menjadi CSS aktual
 * 2. Autoprefixer menambahkan vendor prefix (-webkit-, -moz-) 
 *    secara otomatis berdasarkan browserslist
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
