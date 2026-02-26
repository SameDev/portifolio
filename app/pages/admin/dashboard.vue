<template>
    <div class="admin-dashboard">
        <nav class="admin-nav">
            <div class="nav-container">
                <h1 class="logo">Admin Dashboard</h1>
                <div class="nav-actions">
                    <span class="user-name">{{ user?.name }}</span>
                    <button @click="handleLogout" class="logout-btn">
                        Sair
                    </button>
                </div>
            </div>
        </nav>

        <div class="dashboard-container">
            <div class="dashboard-header">
                <h2>Gerenciar Posts</h2>
                <button @click="showCreateModal = true" class="create-btn">
                    + Novo Post
                </button>
            </div>

            <div class="filters">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar posts..."
                    class="search-input"
                    @input="handleSearch"
                />
                <select
                    v-model="filterPublished"
                    class="filter-select"
                    @change="fetchPosts"
                >
                    <option value="">Todos</option>
                    <option value="true">Publicados</option>
                    <option value="false">Rascunhos</option>
                </select>
            </div>

            <div v-if="loading" class="loading">
                <p>Carregando posts...</p>
            </div>

            <div v-else-if="error" class="error">
                <p>{{ error }}</p>
            </div>

            <div v-else-if="posts.length === 0" class="no-posts">
                <p>Nenhum post encontrado.</p>
            </div>

            <div v-else class="posts-table">
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Status</th>
                            <th>Tags</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="post in posts" :key="post.id">
                            <td>
                                <div class="post-title-cell">
                                    <strong>{{ post.title }}</strong>
                                    <small>{{ post.slug }}</small>
                                </div>
                            </td>
                            <td>
                                <span
                                    :class="[
                                        'status-badge',
                                        post.published ? 'published' : 'draft',
                                    ]"
                                >
                                    {{
                                        post.published
                                            ? "Publicado"
                                            : "Rascunho"
                                    }}
                                </span>
                            </td>
                            <td>
                                <div class="tags-cell">
                                    <span
                                        v-for="tag in post.tags"
                                        :key="tag"
                                        class="tag"
                                    >
                                        {{ tag }}
                                    </span>
                                </div>
                            </td>
                            <td>{{ formatDate(post.createdAt) }}</td>
                            <td>
                                <div class="actions">
                                    <button
                                        @click="editPost(post)"
                                        class="btn-edit"
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        @click="confirmDelete(post)"
                                        class="btn-delete"
                                        title="Deletar"
                                    >
                                        🗑️
                                    </button>
                                    <a
                                        :href="`/blog/${post.slug}`"
                                        target="_blank"
                                        class="btn-view"
                                        title="Ver"
                                    >
                                        👁️
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="pagination.totalPages > 1" class="pagination">
                <button
                    :disabled="pagination.page === 1"
                    @click="changePage(pagination.page - 1)"
                    class="pagination-btn"
                >
                    Anterior
                </button>
                <span class="pagination-info">
                    Página {{ pagination.page }} de {{ pagination.totalPages }}
                </span>
                <button
                    :disabled="pagination.page === pagination.totalPages"
                    @click="changePage(pagination.page + 1)"
                    class="pagination-btn"
                >
                    Próxima
                </button>
            </div>
        </div>

        <!-- Modal de Criar/Editar Post -->
        <div
            v-if="showCreateModal || editingPost"
            class="modal-overlay"
            @click="closeModal"
        >
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ editingPost ? "Editar Post" : "Novo Post" }}</h3>
                    <button @click="closeModal" class="close-btn">✕</button>
                </div>

                <form @submit.prevent="handleSubmit" class="post-form">
                    <div class="form-group">
                        <label for="title">Título *</label>
                        <input
                            id="title"
                            v-model="formData.title"
                            type="text"
                            required
                            @input="generateSlug"
                        />
                    </div>

                    <div class="form-group">
                        <label for="slug">Slug *</label>
                        <input
                            id="slug"
                            v-model="formData.slug"
                            type="text"
                            required
                            pattern="[a-z0-9-]+"
                            title="Apenas letras minúsculas, números e hífens"
                        />
                    </div>

                    <div class="form-group">
                        <label for="excerpt">Resumo</label>
                        <textarea
                            id="excerpt"
                            v-model="formData.excerpt"
                            rows="3"
                            placeholder="Breve descrição do post..."
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="content">Conteúdo *</label>
                        <p class="form-help">
                            Suporta Markdown, imagens com <code>![alt](url)</code> e fórmulas LaTeX com <code>$formula$</code> (inline) ou <code>$$formula$$</code> (bloco)
                        </p>
                        <textarea
                            id="content"
                            v-model="formData.content"
                            rows="15"
                            required
                            placeholder="Escreva o conteúdo do post..."
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="coverImage">URL da Imagem de Capa</label>
                        <input
                            id="coverImage"
                            v-model="formData.coverImage"
                            type="url"
                            placeholder="https://exemplo.com/imagem.jpg"
                        />
                    </div>

                    <div class="form-group">
                        <label for="tags">Tags (separadas por vírgula)</label>
                        <input
                            id="tags"
                            v-model="tagsInput"
                            type="text"
                            placeholder="javascript, vue, tutorial"
                        />
                    </div>

                    <div class="form-group checkbox-group">
                        <label>
                            <input
                                v-model="formData.published"
                                type="checkbox"
                            />
                            Publicar imediatamente
                        </label>
                    </div>

                    <div v-if="formError" class="form-error">
                        {{ formError }}
                    </div>

                    <div class="form-actions">
                        <button
                            type="button"
                            @click="closeModal"
                            class="btn-cancel"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            class="btn-submit"
                            :disabled="submitting"
                        >
                            {{ submitting ? "Salvando..." : "Salvar" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal de Confirmação de Delete -->
        <div
            v-if="deleteConfirm"
            class="modal-overlay"
            @click="deleteConfirm = null"
        >
            <div class="modal-content confirm-modal" @click.stop>
                <h3>Confirmar Exclusão</h3>
                <p>
                    Tem certeza que deseja deletar o post "{{
                        deleteConfirm.title
                    }}"?
                </p>
                <p class="warning">Esta ação não pode ser desfeita.</p>
                <div class="form-actions">
                    <button @click="deleteConfirm = null" class="btn-cancel">
                        Cancelar
                    </button>
                    <button
                        @click="handleDelete"
                        class="btn-delete-confirm"
                        :disabled="deleting"
                    >
                        {{ deleting ? "Deletando..." : "Deletar" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "auth",
});

const router = useRouter();

interface User {
    id: string;
    name: string;
    email: string;
}

interface Author {
    id: string;
    name: string;
    email: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    published: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    author: Author;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UserResponse {
    success: boolean;
    user: User;
}

interface BlogPostsResponse {
    success: boolean;
    posts: BlogPost[];
    pagination: Pagination;
}

const user = ref<User | null>(null);
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
const filterPublished = ref("");

const showCreateModal = ref(false);
const editingPost = ref<BlogPost | null>(null);
const formData = ref({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
});
const tagsInput = ref("");
const formError = ref<string | null>(null);
const submitting = ref(false);

const deleteConfirm = ref<BlogPost | null>(null);
const deleting = ref(false);

let searchTimeout: NodeJS.Timeout | null = null;

const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

const fetchUser = async () => {
    try {
        const token = getAuthToken();
        if (!token) {
            router.push("/admin/login");
            return;
        }

        const response = await $fetch<UserResponse>("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        user.value = response.user;
    } catch (err) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    }
};

const fetchPosts = async () => {
    loading.value = true;
    error.value = null;

    try {
        const token = getAuthToken();
        const params: any = {
            page: pagination.value.page,
            limit: pagination.value.limit,
        };

        if (searchQuery.value) {
            params.search = searchQuery.value;
        }

        if (filterPublished.value) {
            params.published = filterPublished.value;
        }

        const response = await $fetch<BlogPostsResponse>("/api/blog", {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        posts.value = response.posts;
        pagination.value = response.pagination;
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
};

const generateSlug = () => {
    if (!editingPost.value) {
        formData.value.slug = formData.value.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
};

const editPost = (post: BlogPost) => {
    editingPost.value = post;
    formData.value = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        coverImage: post.coverImage || "",
        published: post.published,
    };
    tagsInput.value = post.tags.join(", ");
};

const closeModal = () => {
    showCreateModal.value = false;
    editingPost.value = null;
    formData.value = {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        published: false,
    };
    tagsInput.value = "";
    formError.value = null;
};

const handleSubmit = async () => {
    submitting.value = true;
    formError.value = null;

    try {
        const token = getAuthToken();
        const tags = tagsInput.value
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        const postData = {
            ...formData.value,
            tags,
        };

        if (editingPost.value) {
            await $fetch(`/api/blog/${editingPost.value.id}`, {
                method: "PUT",
                body: postData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else {
            await $fetch("/api/blog", {
                method: "POST",
                body: postData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        closeModal();
        fetchPosts();
    } catch (err: any) {
        formError.value = err.data?.message || "Erro ao salvar post";
    } finally {
        submitting.value = false;
    }
};

const confirmDelete = (post: BlogPost) => {
    deleteConfirm.value = post;
};

const handleDelete = async () => {
    if (!deleteConfirm.value) return;

    deleting.value = true;

    try {
        const token = getAuthToken();
        await $fetch(`/api/blog/${deleteConfirm.value.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        deleteConfirm.value = null;
        fetchPosts();
    } catch (err: any) {
        alert(err.data?.message || "Erro ao deletar post");
    } finally {
        deleting.value = false;
    }
};

const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/admin/login");
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

onMounted(() => {
    fetchUser();
    fetchPosts();
});

useHead({
    title: "Dashboard - Admin",
    meta: [
        {
            name: "robots",
            content: "noindex, nofollow",
        },
    ],
});
</script>

<style scoped lang="scss">
.admin-dashboard {
    min-height: 100vh;
    background: #0a0a0a;
    color: #fff;
}

.admin-nav {
    background: #1a1a1a;
    border-bottom: 1px solid #2a2a2a;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #ef233c, #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-name {
    color: #888;
    font-size: 0.95rem;
}

.logout-btn {
    padding: 0.5rem 1rem;
    background: #2a2a2a;
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #3a3a3a;
    }
}

.dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
        font-size: 2rem;
        font-weight: 700;
    }
}

.create-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #ef233c, #d11f36);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(239, 35, 60, 0.4);
    }
}

.filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.search-input,
.filter-select {
    padding: 0.75rem 1rem;
    background: #1a1a1a;
    border: 2px solid #2a2a2a;
    border-radius: 8px;
    color: #fff;
    font-size: 0.95rem;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #ef233c;
    }
}

.search-input {
    flex: 1;
    max-width: 400px;
}

.filter-select {
    min-width: 150px;
}

.loading,
.error,
.no-posts {
    text-align: center;
    padding: 4rem 0;
    font-size: 1.1rem;
    color: #888;
}

.error {
    color: #ef233c;
}

.posts-table {
    background: #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;

    table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            padding: 1rem;
            text-align: left;
        }

        th {
            background: #0f0f0f;
            color: #888;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        tbody tr {
            border-top: 1px solid #2a2a2a;
            transition: background 0.2s;

            &:hover {
                background: #222;
            }
        }
    }
}

.post-title-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    strong {
        color: #fff;
    }

    small {
        color: #666;
        font-size: 0.85rem;
    }
}

.status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;

    &.published {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }

    &.draft {
        background: rgba(250, 204, 21, 0.2);
        color: #facc15;
    }
}

.tags-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.tag {
    padding: 0.2rem 0.6rem;
    background: #2a2a2a;
    border-radius: 8px;
    font-size: 0.8rem;
    color: #ef233c;
}

.actions {
    display: flex;
    gap: 0.5rem;

    button,
    a {
        padding: 0.5rem;
        background: #2a2a2a;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 1.1rem;
        text-decoration: none;

        &:hover {
            background: #3a3a3a;
            transform: scale(1.1);
        }
    }

    .btn-delete:hover {
        background: rgba(239, 35, 60, 0.2);
    }
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

.pagination-btn {
    padding: 0.75rem 1.5rem;
    background: #ef233c;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
        background: #d11f36;
    }

    &:disabled {
        background: #2a2a2a;
        color: #666;
        cursor: not-allowed;
    }
}

.pagination-info {
    color: #888;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    overflow-y: auto;
}

.modal-content {
    background: #1a1a1a;
    border-radius: 16px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid #2a2a2a;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #2a2a2a;

    h3 {
        font-size: 1.5rem;
        font-weight: 700;
    }
}

.close-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s;

    &:hover {
        color: #fff;
    }
}

.post-form {
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #ddd;
        font-weight: 500;
        font-size: 0.95rem;
    }

    .form-help {
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
        color: #888;
        line-height: 1.5;

        code {
            background: #0a0a0a;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            color: #ef233c;
            font-family: monospace;
        }
    }

    input,
    textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        background: #0a0a0a;
        border: 2px solid #2a2a2a;
        border-radius: 8px;
        color: #fff;
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.3s;

        &:focus {
            outline: none;
            border-color: #ef233c;
            background: #0f0f0f;
        }
    }

    textarea {
        resize: vertical;
    }
}

.checkbox-group {
    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        input[type="checkbox"] {
            width: auto;
            cursor: pointer;
        }
    }
}

.form-error {
    padding: 1rem;
    background: rgba(239, 35, 60, 0.1);
    border: 1px solid rgba(239, 35, 60, 0.3);
    border-radius: 8px;
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: #2a2a2a;
    color: #fff;

    &:hover {
        background: #3a3a3a;
    }
}

.btn-submit {
    background: linear-gradient(135deg, #ef233c, #d11f36);
    color: #fff;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(239, 35, 60, 0.4);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.confirm-modal {
    max-width: 500px;
    padding: 2rem;

    h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    p {
        color: #ddd;
        margin-bottom: 0.5rem;
    }

    .warning {
        color: #facc15;
        font-weight: 500;
        margin-bottom: 1.5rem;
    }
}

.btn-delete-confirm {
    padding: 0.75rem 1.5rem;
    background: #ef233c;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
        background: #d11f36;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

@media (max-width: 768px) {
    .dashboard-container {
        padding: 1rem;
    }

    .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .filters {
        flex-direction: column;
    }

    .search-input {
        max-width: 100%;
    }

    .posts-table {
        overflow-x: auto;

        table {
            min-width: 800px;
        }
    }

    .modal-content {
        max-width: 100%;
    }

    .post-form {
        padding: 1.5rem;
    }
}
</style>
