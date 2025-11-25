<template>
    <section id="links" class="links-section">
        <h2>Transforme seu negócio hoje mesmo!</h2>
        <div class="box-items">
            <a class="btn btn-primary" href="https://api.whatsapp.com/send?phone=5548999270576&text=Ol%C3%A1%2C%20vim%20do%20seu%20site%2C%20poderiamos%20conversar%3F" target="_blank">
                <i class="fa-brands fa-square-whatsapp"></i> WhatsApp
            </a>
            <a class="btn btn-primary" href="https://www.instagram.com/13samuelconradt/" target="_blank">
                <i class="fa-brands fa-square-instagram"></i> Instagram
            </a>
            <a class="btn btn-primary" href="https://github.com/SameDev" target="_blank">
                <i class="fa-brands fa-github"></i> GitHub
            </a>
            <a class="btn btn-primary" href="https://samuel.redstoneweb.com.br/" target="_blank">
                <i class="fa-solid fa-link"></i> Portfólio
            </a>
        </div>
    </section>
</template>

<style scoped lang="scss">
@use "~/assets/styles/core/_variables.scss" as *;

.links-section {
    min-height: 100vh;
    background: radial-gradient(circle at top right, #230909, var(--bg-color));
    font-family: $font-family-primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
}

.links-section h2 {
    font-size: 50px;
    margin-bottom: 70px;
    text-align: center;
    color: $text-muted;
}

.box-items {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.box-items a {
    width: 100%;
    max-width: 400px;
    text-align: center;
    padding: 15px 0;
    font-size: 18pt;
    font-weight: bold;
    text-decoration: none;
    border-radius: 8px;

}

</style>