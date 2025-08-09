import rtl from 'tailwindcss-rtl';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        krona: ['"Krona One"', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        jua: ["Jua", "sans-serif"],
        fredoka: ['Fredoka', 'cursive'],
        modam: ['Modam', 'sans-serif'],
        Kahroba: ['Kahroba', 'sans-serif'],


      },

      animation: {
        bubble1: "float1 7s ease-in-out infinite",
        bubble2: "float2 6s ease-in-out infinite",
        bubble3: "float3 8s ease-in-out infinite",
        bubble4: "float4 10s ease-in-out infinite",
      },

      keyframes: {
        float1: {
          "0%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "25%": { transform: "translate(60px, -80px) scale(1.1) rotate(20deg)" },
          "50%": { transform: "translate(20px, 60px) scale(0.9) rotate(-15deg)" },
          "75%": { transform: "translate(-40px, -30px) scale(1.05) rotate(10deg)" },
          "100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
        },
        float2: {
          "0%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "25%": { transform: "translate(-50px, -90px) scale(0.95) rotate(-10deg)" },
          "50%": { transform: "translate(40px, 40px) scale(1.1) rotate(15deg)" },
          "75%": { transform: "translate(-30px, 20px) scale(1.05) rotate(-5deg)" },
          "100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
        },
        float3: {
          "0%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "25%": { transform: "translate(30px, 60px) scale(1.2) rotate(25deg)" },
          "50%": { transform: "translate(-70px, -50px) scale(1) rotate(-20deg)" },
          "75%": { transform: "translate(50px, 40px) scale(0.95) rotate(10deg)" },
          "100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
        },
        float4: {
          "0%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "25%": { transform: "translate(-60px, 30px) scale(1.1) rotate(-15deg)" },
          "50%": { transform: "translate(40px, -60px) scale(0.9) rotate(20deg)" },
          "75%": { transform: "translate(-20px, 50px) scale(1.05) rotate(-10deg)" },
          "100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
        },
      },
    },
  },

  plugins: [rtl],
};
