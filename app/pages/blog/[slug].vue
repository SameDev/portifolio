<template>
    <div class="blog-post-page">
        <div v-if="loading" class="loading">
            <p>Carregando post...</p>
        </div>

        <div v-else-if="error" class="error-container">
            <div class="container">
                <h1>Post não encontrado</h1>
                <p>{{ error }}</p>
                <NuxtLink to="/blog" class="back-btn"
                    >Voltar para o blog</NuxtLink
                >
            </div>
        </div>

        <article v-else-if="post" class="blog-post">
            <div class="post-header">
                <div class="container">
                    <NuxtLink to="/blog" class="back-link"
                        >← Voltar para o blog</NuxtLink
                    >

                    <div class="post-tags">
                        <span v-for="tag in post.tags" :key="tag" class="tag">
                            {{ tag }}
                        </span>
                    </div>

                    <h1 class="post-title">{{ post.title }}</h1>

                    <div class="post-meta">
                        <div class="author-info">
                            <div class="author-avatar">
                                {{ post.author.name.charAt(0).toUpperCase() }}
                            </div>
                            <div class="author-details">
                                <span class="author-name">{{
                                    post.author.name
                                }}</span>
                                <span class="post-date">{{
                                    formatDate(post.publishedAt)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="post.coverImage" class="post-cover">
                <img :src="post.coverImage" :alt="post.title" />
            </div>

            <div class="post-content-wrapper">
                <div class="container">
                    <div class="post-content" v-html="formattedContent"></div>

                    <div class="post-footer">
                        <p class="updated-date">
                            Última atualização: {{ formatDate(post.updatedAt) }}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;
const { renderMarkdown } = useMarkdownContent();

interface Author {
    id: string;
    name: string;
    email: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    published: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    author: Author;
}

interface BlogPostResponse {
    success: boolean;
    post: BlogPost;
}

const post = ref<BlogPost | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPost = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await $fetch<BlogPostResponse>(
            `/api/blog/posts/${slug}`,
        );
        post.value = response.post;
    } catch (err: any) {
        error.value = err.message || "Post não encontrado";
        post.value = null;
    } finally {
        loading.value = false;
    }
};

const formattedContent = computed(() => {
    if (!post.value) return "";
    
    return renderMarkdown(post.value.content);
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

onMounted(() => {
    fetchPost();
});

useHead(() => ({
    title: post.value
        ? `${post.value.title} - Samuel Conradt`
        : "Blog - Samuel Conradt",
    meta: [
        {
            name: "description",
            content: String(
                post.value?.excerpt || "Artigo do blog de Samuel Conradt",
            ),
        },
        {
            property: "og:title",
            content: String(post.value?.title || "Blog - Samuel Conradt"),
        },
        {
            property: "og:description",
            content: String(
                post.value?.excerpt || "Artigo do blog de Samuel Conradt",
            ),
        },
        {
            property: "og:image",
            content: String(
                post.value?.coverImage ||
                    "https://samuel.redstoneweb.com.br/images/og-image.jpg",
            ),
        },
        {
            property: "og:type",
            content: "article",
        },
        {
            name: "twitter:card",
            content: "summary_large_image",
        },
    ],
}));
</script>

<style scoped lang="scss">
.blog-post-page {
    min-height: 100vh;
    background: #0a0a0a;
    color: #fff;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
}

.loading,
.error-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #ef233c;
    }

    p {
        font-size: 1.2rem;
        color: #888;
        margin-bottom: 2rem;
    }
}

.back-btn,
.back-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #ef233c;
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
        background: #d11f36;
        transform: translateY(-2px);
    }
}

.blog-post {
    padding-bottom: 4rem;
}

.post-header {
    padding: 4rem 0 2rem;

    .back-link {
        display: inline-flex;
        align-items: center;
        margin-bottom: 2rem;
        padding: 0.5rem 1rem;
        font-size: 0.95rem;
    }
}

.post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.tag {
    padding: 0.4rem 1rem;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 20px;
    font-size: 0.85rem;
    color: #ef233c;
}

.post-title {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #fff, #ddd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ef233c, #ff6b6b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
}

.author-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.author-name {
    font-weight: 600;
    font-size: 1rem;
    color: #fff;
}

.post-date {
    font-size: 0.9rem;
    color: #888;
}

.post-cover {
    width: 100%;
    max-height: 500px;
    overflow: hidden;
    margin-bottom: 3rem;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.post-content-wrapper {
    padding: 2rem 0;
}

.post-content {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #ddd;

    :deep(p) {
        margin-bottom: 1.5rem;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: 600;
        color: #fff;
    }

    :deep(h2) {
        font-size: 2rem;
        border-bottom: 2px solid #2a2a2a;
        padding-bottom: 0.5rem;
    }

    :deep(h3) {
        font-size: 1.5rem;
    }

    :deep(ul),
    :deep(ol) {
        margin-bottom: 1.5rem;
        padding-left: 2rem;
    }

    :deep(li) {
        margin-bottom: 0.5rem;
    }

    :deep(code) {
        background: #1a1a1a;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: "Monaco", "Courier New", monospace;
        font-size: 0.9em;
        color: #ef233c;
    }

    :deep(pre) {
        background: #1a1a1a;
        padding: 1.5rem;
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: 1.5rem;

        code {
            background: none;
            padding: 0;
            color: #ddd;
        }
    }

    :deep(blockquote) {
        border-left: 4px solid #ef233c;
        padding-left: 1.5rem;
        margin: 1.5rem 0;
        color: #999;
        font-style: italic;
    }

    :deep(a) {
        color: #ef233c;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color 0.3s;

        &:hover {
            border-bottom-color: #ef233c;
        }
    }

    :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1.5rem 0;
    }

    :deep(.blog-image) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1.5rem 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.02);
        }
    }

    :deep(.katex-display) {
        margin: 1.5rem 0;
        padding: 1rem 0;
        overflow-x: auto;
    }

    :deep(.katex) {
        font-size: 1.1em;
    }

    :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;

        th,
        td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #2a2a2a;
        }

        th {
            background: #1a1a1a;
            color: #ef233c;
            font-weight: 600;
        }

        tr:hover {
            background: #1a1a1a;
        }
    }
}

.post-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #2a2a2a;
    text-align: center;
}

.updated-date {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
}

@media (max-width: 768px) {
    .post-title {
        font-size: 2rem;
    }

    .post-content {
        font-size: 1rem;

        :deep(h2) {
            font-size: 1.5rem;
        }

        :deep(h3) {
            font-size: 1.25rem;
        }
    }

    .author-avatar {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
}
</style>
