<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <h1>Login</h1>
                </div>

                <form @submit.prevent="handleLogin" class="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            :disabled="loading"
                        />
                    </div>

                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input
                            id="password"
                            v-model="form.password"
                            type="password"
                            placeholder="••••••••"
                            required
                            :disabled="loading"
                        />
                    </div>

                    <div v-if="error" class="error-message">
                        {{ error }}
                    </div>

                    <button
                        type="submit"
                        class="submit-btn"
                        :disabled="loading"
                    >
                        {{ loading ? "Entrando..." : "Entrar" }}
                    </button>
                </form>

                <div class="login-footer">
                    <NuxtLink to="/" class="back-link"
                        >← Voltar para o site</NuxtLink
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();

const form = ref({
    email: "",
    password: "",
});

const loading = ref(false);
const error = ref<string | null>(null);

const handleLogin = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await $fetch("/api/auth/login", {
            method: "POST",
            body: form.value,
        });

        if (response.token) {
            localStorage.setItem("auth_token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            router.push("/admin/dashboard");
        }
    } catch (err: any) {
        error.value =
            err.data?.message ||
            "Erro ao fazer login. Verifique suas credenciais.";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        router.push("/admin/dashboard");
    }
});

useHead({
    title: "Login - Admin",
    meta: [
        {
            name: "robots",
            content: "noindex, nofollow",
        },
    ],
});
</script>

<style scoped lang="scss">
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    padding: 2rem;
}

.login-container {
    width: 100%;
    max-width: 450px;
}

.login-card {
    background: #1a1a1a;
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid #2a2a2a;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #ef233c, #ff6b6b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    p {
        color: #888;
        font-size: 0.95rem;
    }
}

.login-form {
    margin-bottom: 1.5rem;
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

    input {
        width: 100%;
        padding: 0.875rem 1rem;
        background: #0a0a0a;
        border: 2px solid #2a2a2a;
        border-radius: 8px;
        color: #fff;
        font-size: 1rem;
        transition: all 0.3s;

        &:focus {
            outline: none;
            border-color: #ef233c;
            background: #0f0f0f;
        }

        &::placeholder {
            color: #555;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
}

.error-message {
    padding: 1rem;
    background: rgba(239, 35, 60, 0.1);
    border: 1px solid rgba(239, 35, 60, 0.3);
    border-radius: 8px;
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    text-align: center;
}

.submit-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #ef233c, #d11f36);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(239, 35, 60, 0.4);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.login-footer {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid #2a2a2a;
}

.back-link {
    color: #888;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;

    &:hover {
        color: #ef233c;
    }
}

@media (max-width: 768px) {
    .login-card {
        padding: 2rem 1.5rem;
    }

    .login-header h1 {
        font-size: 1.75rem;
    }
}
</style>
