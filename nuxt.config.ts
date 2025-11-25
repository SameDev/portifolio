// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/styles/core/_globals.scss"],
  modules: ["@nuxt/image", "@nuxtjs/seo"],
  
  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-BR'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Samuel Conradt do Amaral',
      meta: [
        { name: 'description', content: 'Desenvolvedor Full Stack especializado em Node.js, NestJS, React e Vue.js. Criando soluções digitais inovadoras com foco em arquitetura limpa, IA e alto desempenho.' },
        { name: 'keywords', content: 'desenvolvedor full stack, node.js, nestjs, react, vue.js, typescript, inteligência artificial, AI developer, desenvolvimento web, arquitetura de software, samuel conradt' },
        { name: 'author', content: 'Samuel Conradt do Amaral' },
        { name: 'robots', content: 'index, follow' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://samuel.redstoneweb.com.br' },
        { property: 'og:title', content: 'Samuel Conradt do Amaral - Full Stack Developer & AI Developer' },
        { property: 'og:description', content: 'Desenvolvedor Full Stack especializado em Node.js, NestJS, React e Vue.js. Criando soluções digitais inovadoras com foco em arquitetura limpa, IA e alto desempenho.' },
        { property: 'og:image', content: 'https://samuel.redstoneweb.com.br/images/og-image.jpg' },
        { property: 'og:locale', content: 'pt_BR' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://samuel.redstoneweb.com.br' },
        { name: 'twitter:title', content: 'Samuel Conradt do Amaral - Full Stack Developer & AI Developer' },
        { name: 'twitter:description', content: 'Desenvolvedor Full Stack especializado em Node.js, NestJS, React e Vue.js. Criando soluções digitais inovadoras.' },
        { name: 'twitter:image', content: 'https://samuel.redstoneweb.com.br/images/og-image.jpg' },
        
        // Theme color
        { name: 'theme-color', content: '#ef233c' },
        { name: 'msapplication-TileColor', content: '#ef233c' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://samuel.redstoneweb.com.br' },
      ],
    }
  },
});
