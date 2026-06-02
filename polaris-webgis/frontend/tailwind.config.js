/**
 * POLARIS WebGIS — TailwindCSS Configuration
 * 
 * MENGAPA TailwindCSS?
 * Utility-first CSS framework yang menghasilkan hanya CSS yang 
 * benar-benar digunakan (tree-shaking). Sangat efisien untuk 
 * membangun dark mode dashboard dengan kelas yang konsisten.
 * 
 * Theme extended dengan palet warna custom untuk aesthetic 
 * "Command Center" khas dasbor bencana.
 */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /**
       * Custom color palette — "POLARIS Command Center" theme
       * Menggunakan Slate sebagai base dengan aksen merah (bahaya) 
       * dan cyan (info/aman) untuk kontras yang jelas.
       */
      colors: {
        polaris: {
          bg: '#0f172a',         // Slate-900 — background utama
          surface: '#1e293b',    // Slate-800 — card/panel surface
          border: '#334155',     // Slate-700 — border subtle
          text: '#e2e8f0',       // Slate-200 — text utama
          muted: '#94a3b8',      // Slate-400 — text sekunder
          accent: '#06b6d4',     // Cyan-500 — aksen info
          danger: '#ef4444',     // Red-500 — status bahaya
          warning: '#f59e0b',    // Amber-500 — status waspada
          success: '#22c55e',    // Green-500 — status aman
          critical: '#dc2626',   // Red-600 — kritis
        },
      },
      /**
       * Custom animations untuk micro-interactions dashboard.
       * Pulse dan glow memberikan nuansa "live monitoring".
       */
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      /**
       * Font family — Inter untuk UI yang modern dan readable
       */
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
