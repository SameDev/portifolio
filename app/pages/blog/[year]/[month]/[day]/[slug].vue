<template>
    <div class="blog-container">
        <div class="blog-content">
            <div v-if="pending" class="loading">
                <div class="spinner"></div>
            </div>

            <div v-else-if="error" class="error">
                <h1>Post não encontrado</h1>
                <NuxtLink to="/blog" class="back-link"
                    >Voltar para o Blog</NuxtLink
                >
            </div>

            <article v-else-if="post" class="post-article">
                <header class="post-header">
                    <div class="meta">
                        <span class="category" v-if="post.category">
                            <NuxtLink :to="`/blog?category=${post.category}`">{{
                                post.category
                            }}</NuxtLink>
                        </span>
                        <span class="date">{{
                            formatDate(post.publishedAt)
                        }}</span>
                    </div>
                    <h1 class="title">{{ post.title }}</h1>
                    <div class="author" v-if="post.author">
                        <span>Por Samuel Conradt</span>
                    </div>
                </header>

                <div class="featured-image" v-if="post.coverImage">
                    <img :src="post.coverImage" :alt="post.title" />
                </div>

                <div class="post-body" v-html="post.content"></div>

                <footer class="post-footer">
                    <div class="tags" v-if="post.tags && post.tags.length">
                        <h3>Tags:</h3>
                        <div class="tag-list">
                            <NuxtLink
                                v-for="tag in post.tags"
                                :key="tag"
                                :to="`/blog?tag=${tag}`"
                                class="tag"
                                >#{{ tag }}</NuxtLink
                            >
                        </div>
                    </div>
                </footer>
            </article>

            <BlogSidebar />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data, pending, error } = await useFetch(
    () => `/api/blog/${slug.value}`,
);
const post = computed(() => data.value?.post);

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

useHead(() => ({
    title: post.value?.title ? `${post.value.title} - Blog` : "Blog",
    meta: [
        { name: "description", content: String(post.value?.excerpt || "") },
        { property: "og:title", content: String(post.value?.title || "") },
        {
            property: "og:description",
            content: String(post.value?.excerpt || ""),
        },
        { property: "og:image", content: String(post.value?.coverImage || "") },
    ],
}));
</script>

<style lang="scss" scoped>
.blog-container {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 5rem;
    padding: 4rem 2rem;
}

.blog-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 4rem;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
}

.post-article {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 3rem;
    overflow: hidden;

    @media (max-width: 600px) {
        padding: 1.5rem;
    }
}

.post-header {
    margin-bottom: 2rem;

    .meta {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        margin-bottom: 1rem;

        .category a {
            color: #64ffda;
            text-decoration: none;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .date {
            color: rgba(255, 255, 255, 0.5);
        }
    }

    .title {
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 1rem;
        color: #fff;
    }

    .author {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.95rem;
    }
}

.featured-image {
    margin: 0 -3rem 2rem -3rem;
    height: 400px;

    @media (max-width: 600px) {
        margin: 0 -1.5rem 2rem -1.5rem;
        height: 250px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.post-body {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.8;
    font-size: 1.1rem;

    :deep(h2) {
        font-size: 1.8rem;
        color: #fff;
        margin: 2rem 0 1rem;
    }

    :deep(p) {
        margin-bottom: 1.5rem;
    }

    :deep(a) {
        color: #64ffda;
        text-decoration: none;
        border-bottom: 1px solid rgba(100, 255, 218, 0.3);

        &:hover {
            border-bottom-color: #64ffda;
        }
    }

    :deep(img) {
        max-width: 100%;
        border-radius: 12px;
        margin: 1.5rem 0;
    }

    :deep(pre) {
        background: rgba(0, 0, 0, 0.3);
        padding: 1.5rem;
        border-radius: 12px;
        overflow-x: auto;
        margin: 1.5rem 0;
    }
}

.post-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .tags {
        display: flex;
        align-items: center;
        gap: 1rem;

        h3 {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.6);
        }

        .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            .tag {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(100, 255, 218, 0.15);
                    color: #64ffda;
                }
            }
        }
    }
}

.loading,
.error {
    padding: 4rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #64ffda;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
