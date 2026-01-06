<template>
    <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content glass-panel">
            <h3>{{ role }}</h3>
            <span class="period">{{ period }}</span>
            <p class="impact">{{ impact }}</p>
            <p class="tech"><strong>Tecnologias:</strong> {{ tech }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    role: string;
    period: string;
    impact: string;
    tech: string;
}>();
</script>

<style scoped lang="scss">
@use "../styles/core/variables" as *;

.timeline-item {
    position: relative;
    padding-left: 3rem;
    margin-bottom: 3rem;

    &:last-child {
        margin-bottom: 0;
    }

    .timeline-marker {
        position: absolute;
        left: 0;
        top: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: $primary-color;
        box-shadow: 0 0 0 4px rgba(248, 56, 56, 0.2);

        &::after {
            content: "";
            position: absolute;
            top: 16px;
            left: 7px;
            width: 2px;
            height: calc(100% + 20rem);
            background: rgba(255, 255, 255, 0.1);
        }
    }

    &:last-child .timeline-marker::after {
        display: none;
    }

    .timeline-content {
        padding: 1.5rem;

        h3 {
            color: $text-muted;
            margin-bottom: 0.5rem;
        }

        .period {
            display: block;
            font-size: 0.9rem;
            color: $primary-color;
            margin-bottom: 1rem;
            font-weight: 500;
        }

        .impact {
            color: $text-muted;
            margin-bottom: 1rem;
        }

        .tech {
            font-size: 0.9rem;
            color: $text-muted;

            strong {
                color: $text-muted;
            }
        }
    }
}
</style>
