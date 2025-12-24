<template>
    <div id="app">
        <div class="wave-background">
            <svg
                class="waves"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shape-rendering="auto"
            >
                <defs>
                    <path
                        id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                    <linearGradient
                        id="gradient1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            style="stop-color: #ef233c; stop-opacity: 0.1"
                        />
                        <stop
                            offset="100%"
                            style="stop-color: #d90429; stop-opacity: 0.05"
                        />
                    </linearGradient>
                    <linearGradient
                        id="gradient2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            style="stop-color: #ef233c; stop-opacity: 0.08"
                        />
                        <stop
                            offset="100%"
                            style="stop-color: #8d99ae; stop-opacity: 0.03"
                        />
                    </linearGradient>
                    <linearGradient
                        id="gradient3"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            style="stop-color: #ef233c; stop-opacity: 0.06"
                        />
                        <stop
                            offset="100%"
                            style="stop-color: #2b2d42; stop-opacity: 0.02"
                        />
                    </linearGradient>
                </defs>
                <g class="wave-parallax">
                    <use
                        xlink:href="#gentle-wave"
                        x="48"
                        y="0"
                        fill="url(#gradient1)"
                        class="wave1"
                    />
                    <use
                        xlink:href="#gentle-wave"
                        x="48"
                        y="3"
                        fill="url(#gradient2)"
                        class="wave2"
                    />
                    <use
                        xlink:href="#gentle-wave"
                        x="48"
                        y="5"
                        fill="url(#gradient3)"
                        class="wave3"
                    />
                    <use
                        xlink:href="#gentle-wave"
                        x="48"
                        y="7"
                        fill="rgba(248, 248, 248, 0.03)"
                        class="wave4"
                    />
                </g>
            </svg>
        </div>
        <Header id="header" />
        <main>
            <NuxtPage />
        </main>
        <Footer />
    </div>
</template>

<style lang="scss" scoped>
@use "./styles/core/variables" as *;

#app {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    main {
        flex-grow: 1;
        min-height: 80dvh;
        position: relative;
        z-index: 1;
    }
}

.wave-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    background: linear-gradient(135deg, #1a1a1a 0%, #161616 50%, #1d1d1d 100%);
}

.waves {
    position: absolute;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    max-height: 100vh;
}

.wave-parallax > use {
    animation: wave-motion 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.wave1 {
    animation-delay: -2s;
    animation-duration: 20s;
}

.wave2 {
    animation-delay: -4s;
    animation-duration: 25s;
}

.wave3 {
    animation-delay: -6s;
    animation-duration: 30s;
}

.wave4 {
    animation-delay: -8s;
    animation-duration: 35s;
}

@keyframes wave-motion {
    0% {
        transform: translate3d(-90px, 0, 0);
    }
    100% {
        transform: translate3d(85px, 0, 0);
    }
}

.sticky {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    padding: $spacing-md $spacing-lg;

    * a {
        text-shadow: 0 0 20px $text-color-primary;
    }
}
</style>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";

let observer: IntersectionObserver | null = null;

onMounted(() => {
    const header = document.getElementById("header");
    if (!header) return;

    const sentinel = document.createElement("div");
    sentinel.style.width = "1px";
    sentinel.style.height = "1px";
    sentinel.style.margin = "0";
    sentinel.style.padding = "0";
    header.parentElement?.insertBefore(sentinel, header);

    observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            if (!entry) return;
            if (!entry.isIntersecting) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        },
        { root: null, threshold: 0 },
    );

    observer.observe(sentinel);
});

onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
});
</script>
