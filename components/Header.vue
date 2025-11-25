<template>
    <header>
        <h1><NuxtLink to="/">Samuel Conradt</NuxtLink></h1>
        
        <button 
            class="hamburger" 
            :class="{ active: isMenuOpen }" 
            @click="toggleMenu"
            aria-label="Toggle menu"
            :aria-expanded="isMenuOpen ? 'true' : 'false'"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
        <nav :class="{ active: isMenuOpen }">
            <ul>
                <li><a href="#hero" @click="handleNavClick">Início</a></li>
                <li><a href="#about-me" @click="handleNavClick">Sobre Mim</a></li>
                <li><a href="#main-projects" @click="handleNavClick">Projetos</a></li>
                <li><a href="#professional-experience" @click="handleNavClick">Experiência</a></li>
                <li><a href="#ai-projects" @click="handleNavClick">Artigos e IA</a></li>
                <li><a href="#contact" @click="handleNavClick">Contato</a></li>
            </ul>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const handleNavClick = (event: MouseEvent) => {
    event.preventDefault();
    closeMenu();
    
    const target = event.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    
    if (href && href.startsWith('#')) {
        const elementId = href.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
            const headerOffset = 80; 
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
};
</script>

<style scoped lang="scss">
@use "../assets/styles/components/header";
</style>

