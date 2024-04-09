// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    CHANNEL_NAME: '',
    PARENT_NAME: ''
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss']
})
