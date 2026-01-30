import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],
  modules: ["nuxt-auth-utils", "nuxt-toast"],
  toast: {
    settings: {
      position: "topRight",
      timeout: 3000,
      icon: '' ,
      messageSize: '16px',
      messageColor: '#000',
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
