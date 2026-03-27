import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#030712',
  			surface: '#0f1117',
  			border: '#1f2937',
  			brand: {
  				primary: '#6366f1',
  				secondary: '#8b5cf6',
  				accent: '#06b6d4'
  			},
  			status: {
  				success: '#10b981',
  				warning: '#f59e0b',
  				danger: '#ef4444'
  			},
  			text: {
  				primary: '#f9fafb',
  				secondary: '#9ca3af',
  				muted: '#4b5563'
  			},
  			foreground: '#f9fafb',
  			sidebar: {
  				DEFAULT: '#0f1117',
  				foreground: '#f9fafb',
  				primary: '#6366f1',
  				'primary-foreground': '#f9fafb',
  				accent: '#1f2937',
  				'accent-foreground': '#f9fafb',
  				border: '#1f2937',
  				ring: '#6366f1'
  			}
  		},
  		backgroundImage: {
  			'gradient-brand': 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
  			'gradient-glow': 'radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent)'
  		},
  		boxShadow: {
  			card: '0 0 0 1px rgba(99,102,241,0.1), 0 4px 24px rgba(0,0,0,0.4)'
  		},
  		borderRadius: {
  			lg: '0.75rem',
  			md: '0.5rem',
  			sm: '0.25rem'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

