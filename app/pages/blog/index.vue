<template>
    <div class="blog-container">
        <div class="blog-header">
            <h1>Blog</h1>
            <p>Compartilhando conhecimento e experiências</p>
        </div>

        <div class="blog-content">
            <div class="posts-list">
                <div v-if="pending" class="loading">
                    <div class="spinner"></div>
                </div>

                <div v-else-if="error" class="error">
                    <p>Erro ao carregar posts via API.</p>
                </div>

                <div v-else-if="posts.length === 0" class="no-posts">
                    <p>Nenhum post encontrado.</p>
                </div>

                <div v-else class="posts-grid">
                    <article
                        v-for="post in posts"
                        :key="post.id"
                        class="post-card"
                    >
                        <div class="post-image" v-if="post.coverImage">
                            <img :src="post.coverImage" :alt="post.title" />
                        </div>
                        <div class="post-content">
                            <div class="post-meta">
                                <span class="date">{{
                                    formatDate(post.publishedAt)
                                }}</span>
                                <span class="category" v-if="post.category">{{
                                    post.category
                                }}</span>
                            </div>
                            <NuxtLink
                                :to="getPostLink(post)"
                                class="post-title-link"
                            >
                                <h2>{{ post.title }}</h2>
                            </NuxtLink>
                            <p class="excerpt">{{ post.excerpt }}</p>
                            <div class="post-footer">
                                <NuxtLink
                                    :to="getPostLink(post)"
                                    class="read-more"
                                >
                                    Ler mais
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <line
                                            x1="5"
                                            y1="12"
                                            x2="19"
                                            y2="12"
                                        ></line>
                                        <polyline
                                            points="12 5 19 12 12 19"
                                        ></polyline>
                                    </svg>
                                </NuxtLink>
                                <div
                                    class="tags"
                                    v-if="post.tags && post.tags.length"
                                >
                                    <span
                                        v-for="tag in post.tags.slice(0, 3)"
                                        :key="tag"
                                        >#{{ tag }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- Pagination -->
                <div
                    class="pagination"
                    v-if="pagination && pagination.totalPages > 1"
                >
                    <button
                        :disabled="pagination.page === 1"
                        @click="changePage(pagination.page - 1)"
                        class="page-btn"
                    >
                        Anterior
                    </button>
                    <span class="page-info"
                        >Página {{ pagination.page }} de
                        {{ pagination.totalPages }}</span
                    >
                    <button
                        :disabled="pagination.page === pagination.totalPages"
                        @click="changePage(pagination.page + 1)"
                        class="page-btn"
                    >
                        Próxima
                    </button>
                </div>
            </div>

            <BlogSidebar />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const page = computed(() => parseInt(route.query.page as string) || 1);
const tag = computed(() => route.query.tag as string);
const category = computed(() => route.query.category as string);
const search = computed(() => route.query.search as string);

const { data, pending, error } = await useFetch("/api/blog", {
    query: {
        page,
        tag,
        category,
        search,
        limit: 10,
    },
    watch: [page, tag, category, search],
});

import type { BlogPost } from "~/composables/useBlogPosts";

const posts = computed(
    () => (data.value?.posts as unknown as BlogPost[]) || [],
);
const pagination = computed(() => data.value?.pagination);

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const getPostLink = (post: any) => {
    const date = new Date(post.publishedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `/blog/${year}/${month}/${day}/${post.slug}`;
};

const changePage = (newPage: number) => {
    router.push({
        query: {
            ...route.query,
            page: newPage,
        },
    });
};
</script>

<style lang="scss" scoped>
.blog-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.blog-header {
    text-align: center;
    margin-bottom: 4rem;

    h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    p {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.7);
    }
}

.blog-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 3rem;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
}

.posts-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.post-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .post-image {
        height: 200px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
    }

    &:hover .post-image img {
        transform: scale(1.05);
    }

    .post-content {
        padding: 2rem;
    }

    .post-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.85rem;
        color: #fafafa;
        margin-bottom: 1rem;

        .category {
            color: #fd4968;
        }
    }

    .post-title-link {
        text-decoration: none;

        h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 1rem;
            line-height: 1.3;
        }
    }

    .excerpt {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .post-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .read-more {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #fd4968;
            text-decoration: none;
            font-weight: 500;
            transition: gap 0.3s ease;

            &:hover {
                gap: 0.8rem;
            }
        }

        .tags {
            display: flex;
            gap: 0.5rem;

            span {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.4);
            }
        }
    }
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;

    .page-btn {
        padding: 0.8rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        &:not(:disabled):hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    .page-info {
        color: rgba(255, 255, 255, 0.6);
    }
}

.loading,
.error,
.no-posts {
    padding: 4rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #fd4968;
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
