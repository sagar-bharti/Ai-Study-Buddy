/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bfd3fe",
          500: "#4f6ef7",
          600: "#3d5af1",
          700: "#3346d1",
        },
        accent: {
          purple: "#8b5cf6",
          pink: "#ec4899",
          cyan: "#06b6d4",
          amber: "#f59e0b",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #4f6ef7 0%, #8b5cf6 50%, #ec4899 100%)",
        "gradient-soft": "linear-gradient(135deg, #eef4ff 0%, #f3e8ff 50%, #fce7f3 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(79,110,247,0.08) 0%, rgba(139,92,246,0.08) 100%)",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        blob: "blob 8s infinite ease-in-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};