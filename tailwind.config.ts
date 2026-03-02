import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './data/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        garage: {
          black: '#05070A',
          navy: '#0B1220',
          graphite: '#121821',
          mblue: '#53A5FF',
          mpurple: '#8B5CF6',
          mred: '#EF4444',
          amber: '#F5B544',
          neon: '#FF8A26'
        }
      },
      boxShadow: {
        panel: '0 20px 50px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08)',
        glow: '0 0 0 1px rgba(83,165,255,.15), 0 0 30px rgba(83,165,255,.22)',
        glowWarm: '0 0 0 1px rgba(245,181,68,.2), 0 0 30px rgba(255,138,38,.26)'
      },
      backgroundImage: {
        'm-gradient': 'linear-gradient(90deg,#53A5FF 0%,#8B5CF6 42%,#EF4444 100%)',
        'warm-gradient': 'linear-gradient(90deg,#F5B544 0%,#FF8A26 100%)'
      }
    }
  },
  plugins: []
};

export default config;
