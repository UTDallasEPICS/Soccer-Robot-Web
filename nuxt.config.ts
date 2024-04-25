// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    CHANNEL_NAME: '',
    PARENT_NAME: '',
    AUTH0_CLIENTID: '',
    AUTH0_SECRET: '',
    BASEURL: '',
    ISSUER: '',
    public:{
      PORT_CLIENT_GM: '',
      PORT_WSS_CONTROLLER_CLIENT: ''
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss']
})
