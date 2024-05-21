<template>
    <header>
        <div class="cont row">
            <!-- Logo -->
            <Logo />
        </div>
    </header>
</template>


<script setup>
    // Components
    import Logo from '@/components/header/Logo.vue'
</script>


<style scoped>
    header
    {
        width: 1440px;
        max-width: 100%;
        margin: 0 auto;
        padding: 11px 0 10px;

        border: 1px solid rgba(255, 255, 255, .00);
        border-top: none;
        border-radius: 0 0 42px 42px;
        background: radial-gradient(96.29% 123.48% at 50% 0%, rgba(0, 0, 0, .70) 0%, rgba(34, 27, 52, .70) 50%, rgba(65, 25, 131, .70) 100%);
    }


    header .cont
    {
        padding: 0 20px;
    }
</style>