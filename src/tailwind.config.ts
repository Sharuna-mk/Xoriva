import type { Config } from 'tailwindcss'

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                fadeInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-22px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                zoomIn: {
                    "0%": { opacity: "0", transform: "scale(1.06)" },
                    "100%": { opacity: "0.9", transform: "scale(1)" },
                },
                popIn: {
                    "0%": { opacity: "0", transform: "scale(0.4)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                fadeUp: {
                    from: { opacity: "0", transform: "translateY(28px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                scaleIn: {
                    from: { opacity: "0", transform: "scale(.88)" },
                    to: { opacity: "1", transform: "scale(1)" },
                },
                floatY: {
                    "0%,100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                revealX: {
                    from: { clipPath: "inset(0 100% 0 0)" },
                    to: { clipPath: "inset(0 0% 0 0)" },
                },
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
            animation: {
                fadeInLeft: "fadeInLeft 0.6s ease both",
                zoomIn: "zoomIn 1s ease both",
                popIn: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                fadeUp: "fadeUp 0.6s ease both",
                scaleIn: "scaleIn 0.5s ease both",
                floatY: "floatY 3s ease-in-out infinite",
                revealX: "revealX 0.6s ease both",
                marquee: "marquee 0.1s linear infinite",
            },
        },
    },
    plugins: [],
}

export default config