/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'cyber': {
          'bg': '#101113',
          'card': '#1A1B1E',
          'card-dark': '#141517',
          'accent': '#74c0fc',
          'border': '#25262b',
          'border-hover': '#74c0fc80',
          'input': '#1a1b1e',
          'input-border': '#373A40',
          'text': '#C1C2C5',
          'text-bright': '#ffffff',
        },
        'rarity': {
          'common': '#9CA3AF',
          'uncommon': '#10B981',
          'rare': '#3B82F6',
          'epic': '#8B5CF6',
          'legendary': '#F59E0B',
          'mythic': '#EF4444',
          'divine': '#EC4899',
        },
        'game-primary': '#1A1B1E',
        'game-secondary': '#141517',
        'game-secondary-highlight': '#25262b',
        'game-secondary-light': '#373A40',
        'game-secondary-dark': '#101113',
        'game-text': '#C1C2C5',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        'inventory-slot': '10.2vh', 
        'inventory-gap': '2px',     
      },
      gridTemplateColumns: {
        'inventory': 'repeat(5, 10.2vh)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}