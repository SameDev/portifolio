<template>
    <NuxtLink :to="link || '#'" target="_blank" rel="noopener noreferrer">
        <div class="project-card glass-panel">
        <div class="card-content">
            <h3>{{ title }}</h3>
            <p class="description">{{ description }}</p>
            <div class="meta">
                <p class="stack">{{ stack }}</p>
            </div>
        </div>
    </div>
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    description: string;
    stack: string;
    link?: string;
}>();
</script>

<style scoped lang="scss">
@use '../assets/styles/core/variables' as *; 
.project-card {
    padding: 2rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        border-color: rgba(248, 56, 56, 0.3);
    }

    h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: $primary-color;
    }

    .description {
        margin-bottom: 1.5rem;
        color: $text-muted;
        flex-grow: 1;
    }

    .meta {
        font-size: 0.9rem;
        
        p {
            margin-bottom: 0.5rem;
            
            &:last-child {
                margin-bottom: 0;
            }
        }

        strong {
            color: $text-muted;
        }
    }
}
</style>
