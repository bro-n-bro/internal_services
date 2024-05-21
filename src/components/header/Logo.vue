<template>
    <div class="logo" ref="target">
        <div class="btn" @click.prevent="showDropdown = !showDropdown">
            <img src="@/assets/bro_logo.svg" alt="" loading="lazy">

            <svg class="arr"><use xlink:href="@/assets/sprite.svg#ic_arr_ver"></use></svg>
        </div>


        <div class="mini_modal" v-show="showDropdown">
            <div><a href="https://beta.bronbro.io/" target="_blank" rel="noopener">
                <img src="@/assets/bro_app_logo.svg" alt="" loading="lazy">
            </a></div>

            <div><a href="https://score.bronbro.io/" target="_blank" rel="noopener">
                <img src="@/assets/bro_score_logo.svg" alt="" loading="lazy">
            </a></div>

            <div><a href="https://monitor.bronbro.io/" target="_blank" rel="noopener">
                <img src="@/assets/bro_stats_logo.svg" alt="" loading="lazy">
            </a></div>
        </div>
    </div>
</template>


<script setup>
    import { ref } from 'vue'
    import { onClickOutside } from '@vueuse/core'


    const showDropdown = ref(false),
        target = ref(null)


    // Сlick element outside
    onClickOutside(target, event => showDropdown.value = false)
</script>


<style scoped>
.logo
{
    position: relative;
    z-index: 5;

    margin-right: auto;
}


.logo .btn
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    cursor: pointer;
}


.logo .btn img
{
    display: block;

    max-width: 100%;
    height: 70px;
}


.logo .arr
{
    display: block;

    width: 24px;
    height: 24px;
    margin-left: 14px;
}


.logo .mini_modal
{
    position: absolute;
    top: 100%;
    left: 0;

    width: 238px;
    margin-top: 10px;
    padding: 6px 4px;

    border-radius: 10px;
    background: #101010;
}

.logo .mini_modal > * + *
{
    margin-top: 8px;
}


.logo .mini_modal a
{
    display: block;

    padding: 6px 10px 6px 4px;

    transition: background .2s linear;
    text-decoration: none;

    color: currentColor;
    border-radius: 8px;
}


.logo .mini_modal img
{
    display: block;

    width: 144px;
    max-width: 100%;
}


.logo .mini_modal a:hover
{
    background: #191919;
}


</style>