module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the paths as necessary
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        error: {
          500: "#EF4444",
          600: "#DC2626",
        },
        border: {
          dark: "#4B5563",
        },
      },
    },
  },
  plugins: [],
}
