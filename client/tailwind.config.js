/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // You can add custom classes or extend the default ones
      borderRadius: {
        'custom-scrollbar': '10px',
      },
    },
  },
  plugins: [daisyui],
};
