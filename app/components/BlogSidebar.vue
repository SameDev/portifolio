<template>
    <aside class="blog-sidebar">
        <!-- Search -->
        <div class="sidebar-widget search-widget">
            <h3>Pesquisar</h3>
            <div class="search-box">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar posts..."
                    @keyup.enter="handleSearch"
                />
                <button @click="handleSearch">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Categories -->
        <div
            class="sidebar-widget categories-widget"
            v-if="categories && categories.length"
        >
            <h3>Categorias</h3>
            <ul>
                <li v-for="category in categories" :key="category">
                    <NuxtLink
                        :to="`/blog?category=${category}`"
                        class="category-link"
                    >
                        {{ category }}
                    </NuxtLink>
                </li>
            </ul>
        </div>

        <!-- Tags -->
        <div class="sidebar-widget tags-widget" v-if="tags && tags.length">
            <h3>Tags</h3>
            <div class="tags-cloud">
                <NuxtLink
                    v-for="tag in tags"
                    :key="tag.name"
                    :to="`/blog?tag=${tag.name}`"
                    class="tag-item"
                >
                    {{ tag.name }} <span class="count">({{ tag.count }})</span>
                </NuxtLink>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
const router = useRouter();
const searchQuery = ref("");

const { data: tagsData } = await useFetch("/api/blog/tags");
const { data: categoriesData } = await useFetch("/api/blog/categories");

const tags = computed(() => tagsData.value?.tags || []);
const categories = computed(() => categoriesData.value?.categories || []);

const handleSearch = () => {
    if (searchQuery.value.trim().length > 0 || searchQuery.value == "") {
        router.push({ path: "/blog", query: { search: searchQuery.value } });
    }
};
</script>

<style lang="scss" scoped>
.blog-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .sidebar-widget {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        padding: 1rem;

        h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #fff;
            border-bottom: 2px solid rgba(150, 10, 0, 0.8);
            padding-bottom: 0.5rem;
            display: inline-block;
        }
    }

    .search-box {
        display: flex;
        gap: 0.5rem;

        input {
            flex: 1;
            background: rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(33, 33, 3, 0.1);
            border-radius: 8px;
            padding: 0.8rem;
            color: #fff;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.3s ease;

            &:focus {
                border-color: #fd4968;
                box-shadow: 0 0 0 2px rgb(255 100 100 / 20%);
            }
        }

        button {
            background: rgb(255 100 100 / 10%);
            border: 1px solid rgb(255 100 100 / 20%);
            color: #fd4968;
            padding: 0.8rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background: rgb(255 100 100 / 20%);
                transform: translateY(-2px);
            }
        }
    }

    .categories-widget {
        ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                margin-bottom: 0.5rem;

                .category-link {
                    display: block;
                    padding: 0.5rem 0.8rem;
                    color: rgba(0, 0, 0, 0.7);
                    text-decoration: none;
                    border-radius: 6px;
                    transition: all 0.2s ease;

                    &:hover {
                        background: rgba(0, 0, 0, 0.1);
                        color: #fff;
                        padding-left: 1.2rem;
                    }
                }
            }
        }
    }

    .tags-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .tag-item {
            background: rgba(200, 2, 0, 0.1);
            border: 1px solid rgba(200, 2, 0, 0.5);
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: all 0.3s ease;

            .count {
                font-size: 0.75rem;
                opacity: 0.5;
                margin-left: 4px;
            }

            &:hover {
                background: rgb(255 100 100 / 10%);
                border-color: rgb(255 100 100 / 20%);
                color: #fd4968;
                transform: translateY(-2px);
            }
        }
    }
}
</style>
