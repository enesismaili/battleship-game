/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1120px',
        },
        extend: {
            colors: {
                'customColor': '#25567B',
                'smallSquareColor': '#808080',
            }
        },
    },
    plugins: [],
}

