import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

// Cheese Cafe — brending dizayn tizimi
// Sariq (asosiy) + Qizil (action) + Quyuq jigarrang (text)
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        // Brend ranglari
        brand: {
          yellow: {
            DEFAULT: '#FFD000',
            light: '#FFE44D',
            dark: '#E6BC00',
          },
          red: {
            DEFAULT: '#E8291C',
            light: '#FF4436',
            dark: '#C41E12',
          },
          dark: {
            DEFAULT: '#1A0A00',
            light: '#2D1500',
          },
          cream: {
            DEFAULT: '#FFFDF5',
            muted: '#F5EDE0',
          },
        },
        // Semantik ranglar
        success: '#2ECC71',
        warning: '#F39C12',
        danger: '#E74C3C',
        info: '#3498DB',

        // Telegram theme integratsiyasi (dinamik)
        tg: {
          bg: 'var(--tg-theme-bg-color, #FFFDF5)',
          text: 'var(--tg-theme-text-color, #1A0A00)',
          hint: 'var(--tg-theme-hint-color, #8A7060)',
          link: 'var(--tg-theme-link-color, #E8291C)',
          button: 'var(--tg-theme-button-color, #FFD000)',
          'button-text': 'var(--tg-theme-button-text-color, #1A0A00)',
          'secondary-bg': 'var(--tg-theme-secondary-bg-color, #F5EDE0)',
          header: 'var(--tg-theme-header-bg-color, #FFFDF5)',
          'accent-text': 'var(--tg-theme-accent-text-color, #E8291C)',
          'section-bg': 'var(--tg-theme-section-bg-color, #FFFFFF)',
          'section-header': 'var(--tg-theme-section-header-text-color, #8A7060)',
          'subtitle-text': 'var(--tg-theme-subtitle-text-color, #8A7060)',
          'destructive-text': 'var(--tg-theme-destructive-text-color, #E74C3C)',
        },
      },
      fontFamily: {
        // Sarlavhalar uchun (serif, brending)
        display: ['Playfair Display', 'serif'],
        // Asosiy matn uchun (sans, o'qish qulay)
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Telegram-style typography scale
        'xxs': ['10px', { lineHeight: '14px' }],
        'tg-caption': ['12px', { lineHeight: '16px' }],
        'tg-body': ['14px', { lineHeight: '20px' }],
        'tg-title': ['16px', { lineHeight: '22px' }],
        'tg-headline': ['20px', { lineHeight: '26px' }],
      },
      borderRadius: {
        // Brending uchun yumshoq burchaklar
        'brand': '20px',
        'brand-lg': '24px',
        'brand-xl': '28px',
      },
      boxShadow: {
        'brand': '0 4px 16px rgba(255, 208, 0, 0.25)',
        'brand-lg': '0 20px 60px rgba(255, 208, 0, 0.4)',
        'card': '0 2px 12px rgba(26, 10, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(26, 10, 0, 0.12)',
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'logo-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { boxShadow: '0 0 0 6px rgba(232, 41, 28, 0.15)' },
          '50%': { boxShadow: '0 0 0 10px rgba(232, 41, 28, 0.05)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'logo-float': 'logo-float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}

export default config
