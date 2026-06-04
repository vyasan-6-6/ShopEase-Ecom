/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {//it is used to extend the theme , otherwise the tailwind will deeltes your previous customisations and only use tailwind theme. so we use extend to add our customisations to the tailwind theme. if we want to override the entire theme , we can use theme instead of extend.
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        colors: {
          brand: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6', // Primary Brand (Teal)
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e',
          },
          accent: {
            500: '#6366f1', // Secondary/Accent (Indigo)
            600: '#4f46e5',
          }
        }
      },
    },
    plugins: [],
  }
  
