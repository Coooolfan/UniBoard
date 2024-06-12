/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                ultra: '5px 0 100px 12px' // 修改这里的值以自定义阴影
            }
        }
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.text-shadow-s': {
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)'
                },
                '.text-shadow-m': {
                    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)'
                },
                '.text-shadow-l': {
                    textShadow: '3px 3px 3px rgba(0, 0, 0, 0.5)'
                },
                '.text-shadow-xl': {
                    textShadow: '4px 4px 4px rgba(0, 0, 0, 0.5)'
                },
                '.text-shadow-2xl': {
                    textShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)'
                }
            }
            addUtilities(newUtilities)
        }
    ]
}
