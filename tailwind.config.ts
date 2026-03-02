import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './data/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ui: {
          bg: '#06080D',
          panel: '#0F141C',
          panelAlt: '#121A24',
          text: '#E5E7EB',
          muted: '#9CA3AF',
          accent: '#60A5FA',
          accentSoft: '#1D4ED8'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.28)',
        focus: '0 0 0 1px rgba(96,165,250,.35), 0 0 0 4px rgba(96,165,250,.12)',
        hover: '0 0 0 1px rgba(96,165,250,.25), 0 8px 24px rgba(29,78,216,.2)'
      },
      borderRadius: {
        xl2: '1rem'
      },
      spacing: {
        18: '4.5rem'
      },
      backgroundImage: {
        'ui-bg': 'linear-gradient(160deg,#06080D 0%,#0B1220 55%,#121A24 100%)',
        'ui-line': 'linear-gradient(90deg,transparent 0%,rgba(96,165,250,.55) 50%,transparent 100%)'
      }
    }
  },
  plugins: []
};

export default config;
