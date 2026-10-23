export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F2", ink: "#0F0F0F", peach: "#FBD3B0", peachDeep: "#F8B886",
        mint: "#A9E5C7", mintDeep: "#7FD4A8", skyBlue: "#0B5FFF", lilac: "#C9C7F2", rose: "#F3A8A0",
      },
      fontFamily: {
        display: ["'Archivo Black'", "'Helvetica Neue'", "Arial", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(15,15,15,1)",
        brutalSm: "2px 2px 0px 0px rgba(15,15,15,1)",
        brutalLg: "6px 6px 0px 0px rgba(15,15,15,1)",
      },
      borderWidth: { 3: "3px" },
    },
  },
  plugins: [],
}
