/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-red": "#F15858",
        "primary-blue": "#2775EC",
        "light-blue": "#F0F6FF",
        "primary-background": "#F7F8FB "
      }
    }
  },
  plugins: []
};
