/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#082F4F",
        "navy-900": "#031B30",
        teal: "#10998F",
        mint: "#79C9B8",
        cloud: "#F5F8FA",
        line: "#DDE8EA"
      },
      boxShadow: {
        soft: "0 22px 70px rgba(8, 47, 79, 0.12)",
        lift: "0 18px 44px rgba(16, 153, 143, 0.16)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};
