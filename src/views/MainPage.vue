<template>

</template>


<script setup>
    import { onBeforeMount } from 'vue'
    import { useRouter } from 'vue-router'


    const router = useRouter()


    onBeforeMount(() => {
        // Redirect
        router.push('/multisend/cosmoshub')
    })
</script>


<style scoped>

</style>