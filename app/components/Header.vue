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
                <li>
                    <NuxtLink to="/#hero" @click.native="handleNavClick"
                        >Início</NuxtLink
                    >
                </li>
                <li>
                    <NuxtLink to="/#about-me" @click.native="handleNavClick"
                        >Sobre Mim</NuxtLink
                    >
                </li>
                <li>
                    <NuxtLink
                        to="/#main-projects"
                        @click.native="handleNavClick"
                        >Projetos</NuxtLink
                    >
                </li>
                <li>
                    <NuxtLink
                        to="/#professional-experience"
                        @click.native="handleNavClick"
                        >Experiência</NuxtLink
                    >
                </li>
                <li><NuxtLink to="/blog">Blog</NuxtLink></li>
                <li>
                    <NuxtLink to="/#contact" @click.native="handleNavClick"
                        >Contato</NuxtLink
                    >
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const isMenuOpen = ref(false);
const router = useRouter();
const route = useRoute();

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const handleNavClick = async (event: MouseEvent) => {
    event.preventDefault();
    closeMenu();

    const target = event.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute("href") || target.getAttribute("to");

    if (href && href.includes("#")) {
        const [path, hash] = href.split("#");

        if (hash) {
            if (route.path !== "/" && path === "/") {
                await router.push("/");
                setTimeout(() => {
                    scrollToElement(hash);
                }, 100);
            } else {
                scrollToElement(hash);
            }
        }
    }
};

const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    }
};
</script>

<style scoped lang="scss">
@use "../styles/components/header";
</style>
