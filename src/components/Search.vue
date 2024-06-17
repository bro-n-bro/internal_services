<template>
    <div class="search">
        <input type="text" class="input" v-model="query" :placeholder="$t('message.search_placeholder')" @input="setEvent()">

        <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_search"></use></svg>
    </div>
</template>


<script setup>
    import { ref, inject } from 'vue'


    const emitter = inject('emitter'),
        query = ref('')


    // Set event
    function setEvent() {
        emitter.emit('search', { query: query.value })
    }
</script>



<style scoped>
    .search
    {
        position: relative;

        margin-bottom: 10px;
    }


    .search ::-webkit-input-placeholder
    {
        color: rgba(255, 255, 255, .40);
    }

    .search :-moz-placeholder
    {
        color: rgba(255, 255, 255, .40);
    }

    .search ::-moz-placeholder
    {
        opacity: 1;
        color: rgba(255, 255, 255, .40);
    }

    .search :-ms-input-placeholder
    {
        color: rgba(255, 255, 255, .40);
    }


    .search .input
    {
        font-family: var(--font_family);
        font-size: 16px;
        font-size: var(--font_size);
        font-weight: 600;

        display: block;

        width: 100%;
        height: 29px;
        padding: 0 39px 0 14px;

        transition: background .2s linear;

        color: var(--text_color);
        border: 1px solid #7544ff;
        border-radius: 20px;
        background: rgba(215, 171, 255, .40);
    }


    .search .icon
    {
        position: absolute;
        z-index: 3;
        top: 0;
        right: 10px;
        bottom: 0;

        display: block;

        width: 18px;
        height: 19px;
        margin: auto 0;

        transition: opacity .2s linear;
        pointer-events: none;

        opacity: .4;
    }


    .search .input:focus
    {
        background: rgba(0, 0, 0, .40);
    }


    .search .input:focus .icon
    {
        opacity: 1;
    }
</style>