<script setup lang="ts">
useHead({
  title: 'Samuel Conradt do Amaral - Full Stack Developer & AI Developer',
  meta: [
    { name: 'description', content: 'Portfólio de Samuel Conradt do Amaral - Desenvolvedor Full Stack especializado em Node.js, NestJS, React, Vue.js e Inteligência Artificial. Veja meus projetos e experiência profissional.' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': 'https://samuel.redstoneweb.com.br/#person',
            name: 'Samuel Conradt do Amaral',
            alternateName: 'Samuel Conradt',
            description: 'Desenvolvedor Full Stack focado em arquitetura limpa e soluções de alto desempenho',
            image: 'https://samuel.redstoneweb.com.br/images/foto-perfil.jpg',
            sameAs: [
              'https://www.linkedin.com/in/samuel-conradt-b5a77b27a',
              'https://github.com/SameDev'
            ],
            jobTitle: 'Full Stack Developer & AI Developer',
            worksFor: {
              '@type': 'Organization',
              name: 'Freelancer'
            },
            knowsAbout: [
              'Node.js',
              'NestJS', 
              'React',
              'Vue.js',
              'TypeScript',
              'Python',
              'Artificial Intelligence',
              'Machine Learning',
              'PostgreSQL',
              'Docker',
              'AWS'
            ],
            email: 'conradtsamuel@gmail.com',
            url: 'https://samuel.redstoneweb.com.br'
          },
          {
            '@type': 'WebSite',
            '@id': 'https://samuel.redstoneweb.com.br/#website',
            url: 'https://samuel.redstoneweb.com.br',
            name: 'Samuel Conradt do Amaral',
            description: 'Portfólio profissional de desenvolvedor Full Stack e AI',
            inLanguage: 'pt-BR',
            publisher: {
              '@id': 'https://samuel.redstoneweb.com.br/#person'
            }
          },
          {
            '@type': 'WebPage',
            '@id': 'https://samuel.redstoneweb.com.br/#webpage',
            url: 'https://samuel.redstoneweb.com.br',
            name: 'Samuel Conradt do Amaral - Portfólio',
            description: 'Portfólio profissional de Samuel Conradt do Amaral, Full Stack Developer e AI Developer',
            inLanguage: 'pt-BR',
            isPartOf: {
              '@id': 'https://samuel.redstoneweb.com.br/#website'
            },
            about: {
              '@id': 'https://samuel.redstoneweb.com.br/#person'
            }
          }
        ]
      })
    }
  ]
});

useSeoMeta({
  title: 'Samuel Conradt do Amaral - Full Stack Developer & AI Developer',
  ogTitle: 'Samuel Conradt do Amaral - Full Stack Developer & AI Developer',
  description: 'Portfólio de Samuel Conradt do Amaral - Desenvolvedor Full Stack especializado em Node.js, NestJS, React, Vue.js e Inteligência Artificial. Veja meus projetos e experiência profissional.',
  ogDescription: 'Portfólio de Samuel Conradt do Amaral - Desenvolvedor Full Stack especializado em Node.js, NestJS, React, Vue.js e Inteligência Artificial.',
  ogImage: 'https://samuel.redstoneweb.com.br/images/og-image.jpg',
  twitterCard: 'summary_large_image',
});
</script>

<template>
    <article class="portfolio-container">
        <section id="hero" class="hero">
            <div class="hero-bg"></div>
            <div class="container hero-content">
                <div class="hero-text">
                    <h1 class="animate-fade-up">Samuel Conradt do Amaral</h1>
                    <h2 class="animate-fade-up delay-1">
                        Full Stack Developer & AI Developer
                    </h2>
                    <p class="animate-fade-up delay-2">
                        Transformando ideias em soluções digitais inovadoras e
                        eficientes.
                    </p>
                    <div class="hero-buttons animate-fade-up delay-3">
                        <a href="#contact" class="btn-primary">Contato</a>
                        <a href="#main-projects" class="btn-secondary">Projetos</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="about-me" class="about section-padding">
            <div class="container">
                <div class="glass-panel about-grid">
                    <div class="about-text">
                        <h2 class="section-title">Sobre Mim</h2>
                        <p>
                            Desenvolvedor Full Stack focado em arquitetura limpa e soluções de alto desempenho. Com experiência sólida em Node.js, NestJS e React, atuo no desenvolvimento de plataformas complexas, desde sistemas de telemedicina até aplicações com integração de IA. Atualmente cursando Ciência da Computação, sou movido pelo desafio de transformar requisitos de negócio em software seguro, eficiente e escalável.
                        </p>
                        <p>
                            Foco em criar soluções que não apenas funcionam, mas
                            que escalam e geram valor real para empresas e
                            usuários finais.
                        </p>
                    </div>
                    <div class="about-image">
                        <NuxtImg src="/images/foto-perfil.jpg" alt="Samuel Conradt do Amaral" width="300" height="300" />
                    </div>
                </div>
            </div>
        </section>

        <section id="main-projects" class="projects section-padding">
            <div class="container">
                <h2 class="section-title">Projetos Principais</h2>
                <div class="projects-grid">
                    <ProjectCard
                        title="Starting Music"
                        description="Uma plataforma que transforma o ato de ouvir música em uma experiência multissensorial completa, onde contexto, emoção e arte se encontram."
                        stack="NodeJs, Nuxt, Typescript, Python, Pandas, Scikit-Learn e Flask."
                        link="https://startingmusic.com.br"
                    />
                    <ProjectCard
                        title="VonIA"
                        description="Projeto que tem como objetivo desenvolver uma IA para auxiliar iniciantes na ciências da computação, para ajudar nos estudos e compreensão dos conteudos."
                        stack="Python, Pandas, Scikit-Learn e PyTorch"
                        link="https://github.com/SameDev/VonIA"
                    />
                    <ProjectCard
                        title="GymCalc"
                        description="Sistema para calculo nutricional, progressão de treinos e acompanhamento de alunos para academias."
                        stack="NestJS, Typescript e PostgresSQL"
                        link="https://github.com/SameDev/gym-calc"
                    />
                    <ProjectCard
                        title="TuneSound"
                        description="Uma loja virtual de instrumentos, é um projeto de e-commerce desenvolvido por uma equipe de dois programadores front-end. Ele foi desenvolvido no Instituto Federal Catarinense, para um trabalho da materia de Desenvolvimento Web I. A loja virtual oferece uma ampla gama de produtos, incluindo guitarras, violões e baixo. "
                        stack="HTML, CSS e JavaScript"
                        link="https://github.com/SameDev/TuneSound"
                    />

                </div>
            </div>
        </section>

        <section id="professional-experience" class="experience section-padding">
            <div class="container">
                <h2 class="section-title">Experiência Profissional</h2>
                <div class="timeline-container">
                    <TimelineItem
                        role="Desenvolvedor Full Stack Junior"
                        period="Fev 2025 - Presente"
                        impact="Participação em definições técnicas e implementação de fluxos escaláveis sob arquitetura NestJS.
Engenharia de soluções de comunicação em tempo real, implementando atendimento via vídeo (WebRTC) e integrações automatizadas com WhatsApp API, resultando em maior eficiência operacional no fluxo de pacientes. 
Colaboração ativa no onboarding de novos membros e apoio na padronização de práticas de código (Code Review).
Definição de arquitetura de software e fluxos de dados, assegurando performance e escalabilidade para suportar o crescimento da base de usuários.
Auditoria e blindagem de segurança em sistema médico, eliminando mais de 40 vulnerabilidades críticas (incluindo SQL Injection) e reforçando a integridade da aplicação.
"
                        tech="NestJs, Angular, PostgreSQL, Docker, MongoDB e Ionic."
                    />
                    <TimelineItem
                        role="Desenvolvedor Full Stack Autonomo"
                        period="Nov 2023 - Jan 2025"
                        impact="Desenvolvimento e entrega de soluções Web e Mobile de ponta a ponta, traduzindo requisitos de negócio em produtos digitais escaláveis utilizando Next.js, React e TypeScript. 
Gestão integral do ciclo de vida dos projetos, desde a concepção e arquitetura até o deploy e otimização, garantindo alinhamento estratégico com as métricas de sucesso dos clientes. 
Implementação de boas práticas de segurança e performance, assegurando interfaces responsivas e alta disponibilidade dos serviços entregues.
"
                        tech="NextJs, React, NestJs, TypeScript, PostgreSQL, MongoDB, PHP, Python e Docker."
                    />
                </div>
            </div>
        </section>

        <section id="ai-projects" class="ai-research section-padding">
            <div class="container">
                <h2 class="section-title">IA & Pesquisa</h2>
                <div class="ai-grid">
                    <NuxtLink to="/StartingMusic_TCC_SAMUEL_CONRADT_DO_AMARAL_E_MURILLO_ALBINO.pdf" target="_blank" rel="noopener">
                        <div class="glass-panel ai-card">
                        <h3>Starting Music: PLATAFORMA DE STREAMING DE MÚSICA</h3>
                        <p class="type">Paper / TCC</p>
                        <p>
                            Estudo e desenvolvimento de uma plataforma de streaming de música que utiliza algoritmos de machine learning para recomendar faixas, impulsionando artistas iniciantes.
                        </p>
                    </div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section id="contact" class="contact section-padding">
            <div class="container">
                <div class="glass-panel contact-box">
                    <h2>Vamos construir algo grande?</h2>
                    <p>
                        Estou pronto para levar seu projeto para o próximo
                        nível.
                    </p>
                    <div class="contact-links">
                        <a
                            href="https://www.linkedin.com/in/samuel-conradt-b5a77b27a"
                            target="_blank"
                            class="btn-primary"
                            >LinkedIn</a
                        >
                        <a
                            href="https://github.com/SameDev"
                            target="_blank"
                            class="btn-secondary"
                            >GitHub</a
                        >
                        <a
                            href="mailto:conradtsamuel@gmail.com"
                            class="btn-secondary"
                            >Email</a
                        >
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<style lang="scss" scoped>
@use "../assets/styles/core/variables" as *;
.portfolio-container {
    min-height: 100vh;
    background: radial-gradient(circle at top right, #230909, var(--bg-color));
    font-family: $font-family-primary;
}

.section-padding {
    padding: 6rem 0;
}

.hero {
    min-height: 90vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;

    .hero-bg {
        position: absolute;
        top: -20%;
        right: -10%;
        width: 600px;
        height: 600px;
        background: radial-gradient(
            circle,
            rgba(248, 56, 56, 0.15)0%,
            rgba(0, 0, 0, 0) 70%
        );
        border-radius: 50%;
        filter: blur(60px);
        z-index: 0;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        width: 100%;
    }

    h1 {
        font-size: 4rem;
        font-weight: 700;
        margin-bottom: 1rem;
        line-height: 1.1;
        background: linear-gradient(to right, #fff, #b89494);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    h2 {
        font-size: 1.5rem;
        color: $primary-color;
        margin-bottom: 2rem;
        font-weight: 500;
    }

    p {
        font-size: 1.2rem;
        color: $text-muted;
        max-width: 600px;
        margin-bottom: 3rem;
    }

    .hero-buttons {
        display: flex;
        gap: 1.5rem;
    }
}

.about-grid {
    display: flex;
    padding: 2rem;
    gap: 2rem;
    justify-content: space-around;
    flex: 1;
    flex-flow: wrap row;
    align-items: center;
    .about-text {
        flex: 1;
    }
    .about-image {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .about-text p {
        margin-bottom: 1.5rem;
        color: $text-muted;
        font-size: 1.1rem;
        text-align: justify;
    }

    img {
        aspect-ratio: 1/1;
        width: 400px;
        height: 400px;
        object-fit: cover;
        background: #1e293b;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid $glass-border-color;
    }
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.ai-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    .ai-card {
        padding: 2rem;

        h3 {
            color: $secondary-color;
            margin-bottom: 0.5rem;
        }

        .type {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: $text-muted;
            margin-bottom: 1rem;
        }
    }
}

.contact-box {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 800px;
    margin: 0 auto;

    h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: $primary-color;
    }

    p {
        color: $text-muted;
        margin-bottom: 3rem;
        font-size: 1.2rem;
    }

    .contact-links {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        flex-wrap: wrap;
    }
}

.animate-fade-up {
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
}

.delay-1 {
    animation-delay: 0.2s;
}
.delay-2 {
    animation-delay: 0.4s;
}
.delay-3 {
    animation-delay: 0.6s;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 2.5rem;
    }

    .about-grid {
        grid-template-columns: 1fr;
        padding: 2rem;
    }
}
</style>
