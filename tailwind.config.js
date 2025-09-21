/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ["Comfortaa_Regular"],
        poppins: ["Poppins-Regular"],
        "poppins-bold": ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
};
