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