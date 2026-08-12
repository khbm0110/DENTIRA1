/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: "hsl(var(--surface))",
        'on-surface': "hsl(var(--on-surface))",
        'surface-container': "hsl(var(--surface-container, 0 0% 100%))",
        'surface-bright': "hsl(var(--surface-bright, 0 0% 100%))",
        'outline-variant': "hsl(var(--outline-variant))",
      },
      fontFamily: {
        'heading': ['var(--font-headline)', 'Manrope', 'sans-serif'],
        'headline': ['var(--font-headline)', 'Manrope', 'sans-serif'],
        'body': ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(14, 165, 233, 0.03), 0 8px 24px rgba(14, 165, 233, 0.07)',
        'soft-lg': '0 4px 8px rgba(14, 165, 233, 0.04), 0 16px 40px rgba(14, 165, 233, 0.10)',
        'soft-xl': '0 8px 16px rgba(14, 165, 233, 0.05), 0 24px 56px rgba(14, 165, 233, 0.13)',
        'glow-sm': '0 4px 14px rgba(14, 165, 233, 0.30)',
        'glow-md': '0 8px 24px rgba(14, 165, 233, 0.35)',
        'glow-lg': '0 12px 40px rgba(14, 165, 233, 0.40)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
