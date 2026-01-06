export interface Author {
    id: string;
    name: string;
    email: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: string;
    tags: string[];
    category: string | null;
    author: Author;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface BlogPostsResponse {
    success: boolean;
    posts: BlogPost[];
    pagination: Pagination;
}

export const useBlogPosts = () => {
    const posts = ref<BlogPost[]>([]);
    const pagination = ref<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const loading = ref(false);
    const error = ref<string | null>(null);
    const searchQuery = ref("");
    const selectedTag = ref<string | null>(null);
    const availableTags = ref<string[]>([]);

    let searchTimeout: NodeJS.Timeout | null = null;

    const fetchPosts = async () => {
        loading.value = true;
        error.value = null;

        try {
            const params: any = {
                page: pagination.value.page,
                limit: pagination.value.limit,
            };

            if (searchQuery.value) {
                params.search = searchQuery.value;
            }

            if (selectedTag.value) {
                params.tag = selectedTag.value;
            }

            const response = await $fetch<BlogPostsResponse>("/api/blog/posts", {
                params,
            });

            posts.value = response.posts;
            pagination.value = response.pagination;

            // Extrair tags únicas
            const tags = new Set<string>();
            response.posts.forEach((post: BlogPost) => {
                post.tags.forEach((tag) => tags.add(tag));
            });
            availableTags.value = Array.from(tags).sort();
        } catch (err: any) {
            error.value = err.message || "Erro ao carregar posts";
            posts.value = [];
        } finally {
            loading.value = false;
        }
    };

    const handleSearch = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            pagination.value.page = 1;
            fetchPosts();
        }, 500);
    };

    const changePage = (page: number) => {
        pagination.value.page = page;
        fetchPosts();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    watch(selectedTag, () => {
        pagination.value.page = 1;
        fetchPosts();
    });

    onMounted(() => {
        fetchPosts();
    });

    return {
        posts,
        pagination,
        loading,
        error,
        searchQuery,
        selectedTag,
        availableTags,
        fetchPosts,
        handleSearch,
        changePage,
        formatDate,
    };
};
