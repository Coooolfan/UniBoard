/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            dropShadow: {
                '5xl': '13px 0px 50px'
            },
            keyframes: {
                'slide-up': {
                    '0%': { transform: 'translateY(5px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 }
                },
                'slide-right': {
                    '0%': { transform: 'translateX(-10px)', opacity: 0.8 },
                    '100%': { transform: 'translateX(0)', opacity: 1 }
                }
            },
            animation: {
                'slide-up': 'slide-up 0.5s ease-out',
                'slide-right': 'slide-right 2s ease-out'
            }
        }
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                '.text-shadow-s': {
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)'
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
                },
                '.text-shadow-white': {
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.3)'
                },
                '.text-shadow-gray': {
                    textShadow: '1px 1px 2px rgba(100, 100, 100, 0.3)'
                }
            }
            addUtilities(newUtilities)
        },
        function ({ addBase }) {
            addBase({
                ':root': {
                    '--p-card-body-padding': '0'
                }
            })
        }
    ]
}
