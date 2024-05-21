<template>
    <div class="choose_network" ref="target">
        <button class="btn" @click.prevent="showDropdown = !showDropdown">
            <div class="logo">
                <img :src="getNetworkLogo(currentNetwork.chain_id)" alt="">
            </div>

            <div>
                <div class="name">{{ currentNetwork.pretty_name }}</div>
            </div>

            <svg class="arr"><use xlink:href="@/assets/sprite.svg#ic_arr_ver"></use></svg>
        </button>


        <div class="mini_modal" v-show="showDropdown">
            <div class="scroll">
                <div v-for="(network, index) in networks" :key="index">
                    <button class="network" :class="{ active: currentNetwork.chain_id == network.chain_id }" @click.prevent="setCurrentNetwork(index)">
                        <div class="logo">
                            <img :src="getNetworkLogo(network.chain_id)" alt="" loading="lazy">
                        </div>

                        <div>
                            <div class="name">{{ network.pretty_name }}</div>
                        </div>

                        <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_check"></use></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
    import { ref, onBeforeMount, inject } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { onClickOutside } from '@vueuse/core'
    import { getNetworkLogo } from '@/utils'
    import { chains } from 'chain-registry'


    const props = defineProps(['commands']),
        store = useGlobalStore(),
        emitter = inject('emitter'),
        networks = ref([]),
        currentNetwork = ref({}),
        showDropdown = ref(false),
        target = ref(null)


    onBeforeMount(() => {
        // Parse commands
        props.commands.forEach(command => {
            let arr = command.split('/'),
                chainIDs = [arr[0], arr[1]],
                networkConfig = null

            chainIDs.forEach(chainId => {
                // Get network config
                chainId === 'space-pussy'
                    ? networkConfig = store.networks.ibs.space_pussy
                    : networkConfig = chains.find(chain => chain.chain_id === chainId)

                // Set data
                if (!networks.value.find(el => el.chain_id === networkConfig.chain_id)) {
                    networks.value.push(networkConfig)
                }
            })
        })

        // Set current network
        setCurrentNetwork(0)
    })


    // Set current network
    function setCurrentNetwork(index) {
        // Set data
        currentNetwork.value = networks.value[index]

        // Hide dropdown
        showDropdown.value = false

        // Send "updateCurrentNetwork" event
        emitter.emit('updateCurrentNetwork', { chainId: networks.value[index].chain_id })
    }


    // Click outside
    onClickOutside(target, e => showDropdown.value = false)
</script>


<style>
    .choose_network
    {
        position: relative;
        z-index: 9;

        width: 264px;
        max-width: 100%;
    }


    .choose_network .btn
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: 100%;
        height: 60px;
        padding: 9px;

        transition: background .2s linear;
        text-align: left;
        text-transform: lowercase;

        border: 1px solid transparent;
        border-radius: 14px;
        background: #141414;
    }


    .choose_network .btn .logo
    {
        position: relative;

        overflow: hidden;

        width: 40px;
        height: 40px;
        margin-right: 14px;

        border-radius: 50%;
    }

    .choose_network .btn .logo img
    {
        position: absolute;
        top: 0;
        left: 0;

        display: block;

        width: 100%;
        height: 100%;

        border-radius: 50%;

        object-fit: cover;
    }


    .choose_network .btn .logo + *
    {
        width: calc(100% - 92px);
    }


    .choose_network .btn .logo + * ::first-letter
    {
        text-transform: uppercase;
    }


    .choose_network .btn .name
    {
        font-size: 18px;
        font-weight: 500;
        line-height: 100%;

        overflow: hidden;

        white-space: nowrap;
        text-overflow: ellipsis;
    }


    .choose_network .btn .arr
    {
        display: block;

        width: 24px;
        height: 24px;
        margin-left: 14px;

        transition: transform .2s linear;
    }


    .choose_network .btn:hover
    {
        background: #353535;
    }

    .choose_network .btn.active
    {
        border-color: #950fff;
        background: #141414;
    }

    .choose_network .btn.active .arr
    {
        transform: rotate(180deg);
    }



    .choose_network .mini_modal
    {
        position: absolute;
        top: 100%;
        left: 0;

        width: 100%;
        margin-top: 4px;
        padding: 4px;

        border-radius: 10px;
        background: #101010;
    }


    .choose_network .mini_modal .scroll
    {
        overflow: auto;

        max-height: 257px;
        padding-right: 4px;

        overscroll-behavior-y: contain;
    }

    .choose_network .mini_modal .scroll::-webkit-scrollbar
    {
        width: 5px;
        height: 5px;
    }

    .choose_network .mini_modal .scroll > * + *
    {
        margin-top: 8px;
    }


    .choose_network .network
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: 100%;
        padding: 4px 10px 4px 4px;

        transition: background .2s linear;
        text-align: left;
        text-decoration: none;

        color: currentColor;
        border-radius: 8px;
    }


    .choose_network .network .logo
    {
        position: relative;

        overflow: hidden;

        width: 30px;
        height: 30px;
        margin-right: 6px;

        border-radius: 50%;
    }

    .choose_network .network .logo + *
    {
        width: calc(100% - 66px);
    }


    .choose_network .network .logo img
    {
        position: absolute;
        top: 0;
        left: 0;

        display: block;

        width: 100%;
        height: 100%;

        border-radius: 50%;

        object-fit: cover;
    }


    .choose_network .network .name
    {
        line-height: 100%;

        text-transform: lowercase;
    }


    .choose_network .network .name::first-letter
    {
        text-transform: uppercase;
    }


    .choose_network .network .icon
    {
        display: block;

        width: 24px;
        height: 24px;
        margin-left: 6px;

        transition: opacity .2s linear;

        opacity: 0;
    }


    .choose_network .network:hover,
    .choose_network .network.active
    {
        background: #191919;
    }

    .choose_network .network.active .icon
    {
        opacity: 1;
    }


    header .choose_network .mini_modal .scroll
    {
        max-height: calc(100vh - 134px);
    }



    @media print, (max-width: 767px)
    {
        .choose_network
        {
            width: 224px;
        }


        .choose_network .btn .name
        {
            font-size: 16px;
        }
    }



    @media print, (max-width: 479px)
    {
        .choose_network
        {
            margin-top: 20px;
        }


        header .choose_network
        {
            width: 100%;
        }
    }

</style>