/** frontend/tailwind.config.js */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          'kitty-pink': '#ffb6c1',
          'kitty-white': '#fff0f5',
          'kitty-black': '#000000'
        },
        fontFamily: {
          'kitty': ['Comfortaa', 'cursive']
        }
      }
    },
    plugins: []
  };
  