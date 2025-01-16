/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'profile-mask': "url('https://yangyi.fan/media/banners/file_1723560491401.avif')"
            },
            dropShadow: {
                '5xl': '13px 0px 50px'
            },
            keyframes: {
                'slide-up': {
                    '0%': { transform: 'translateY(5px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 }
                }
            },
            animation: {
                'slide-up': 'slide-up 0.5s ease-out'
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
