<template>
    <header>
        <div class="cont row">
            <!-- Logo -->
            <Logo />

            <!-- Multisend choose network -->
            <MultisendChooseNetwork v-if="store.currentService === 'Multisend'" />

            <!-- IBC Recovery choose network -->
            <IBCRecoveryChooseNetwork v-if="store.currentService === 'IBCRecovery'" />

            <!-- IBC Route choose network -->
            <IBCRouteChooseNetwork v-if="store.currentService === 'IBCRoute'" />
        </div>
    </header>
</template>


<script setup>
    import { useGlobalStore } from '@/stores'

    // Components
    import Logo from '@/components/header/Logo.vue'
    import MultisendChooseNetwork  from '@/components/multisend/ChooseNetwork.vue'
    import IBCRecoveryChooseNetwork  from '@/components/ibc_recovery/ChooseNetwork.vue'
    import IBCRouteChooseNetwork  from '@/components/ibc_route/ChooseNetwork.vue'


    const store = useGlobalStore()
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
        align-content: center;
        align-items: center;
        justify-content: space-between;

        padding: 0 20px;
    }

</style>