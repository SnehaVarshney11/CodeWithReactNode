# CodeWithReactNode
## How to create React + Node + Tailwind CSS Application -
1. npm create vite@latest react-app --template react 
2. cd react-app
3. npm i -D tailwindcss postcss autoprefixer
4. npx tailwindcss init -p
5. Update "tailwind.config.js" File to include the paths of the templates. 
    ```
    // tailwind.config.js
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    ```
6. Add Tailwind Directives to CSS and import this file to main.jsx
    ```
    /* src/index.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
7. Run -> npm run dev