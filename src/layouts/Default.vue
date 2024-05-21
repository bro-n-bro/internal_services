<template>
    <div class="main">
        <!-- Header -->
        <Header />


        <div class="cont">
            <div class="grid row">
                <section class="col">
                    <!-- Actions -->
                    <Actions />
                </section>

                <section class="col_main">
                    <!-- Router view -->
                    <RouterView />
                </section>
            </div>
        </div>
    </div>


    <!-- Footer -->
    <Footer />


    <!-- Background -->
    <img src="@/assets/bg.png" alt="" class="bg" loading="lazy">
</template>


<script setup>
    // Components
    import Header from '@/components/Header.vue'
    import Actions from '@/components/Actions.vue'
    import Footer from '@/components/Footer.vue'
</script>


<style scoped>
    .grid
    {
        align-content: stretch;
        align-items: stretch;
        justify-content: space-between;

        padding: 20px 0 80px;
    }


    .col
    {
        width: 320px;
        max-width: 100%;
    }


    .col_main
    {
        width: calc(100% - 360px);
    }
</style>
