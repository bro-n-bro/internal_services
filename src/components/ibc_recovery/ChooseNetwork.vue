<template>
    <div class="choose_network" ref="target" v-if="!loading">
        <button class="btn" @click.prevent="showDropdown = !showDropdown" :class="{ active: showDropdown }">
            <div class="logo">
                <img :src="getNetworkLogo(currentNetwork.chain_id)" alt="">
            </div>

            <div>
                <div class="name">{{ currentNetwork.pretty_name }}</div>
            </div>

            <svg class="arr"><use xlink:href="@/assets/sprite.svg#ic_arr_ver2"></use></svg>
        </button>


        <div class="mini_modal" v-show="showDropdown">
            <!-- Search -->
            <Search />

            <div class="scroll" v-if="searchResult.length">
                <div v-for="(network, index) in searchResult" :key="index"
                    :class="{ favorited: store.IBCRecoveryFavorites[network.chain_id] }"
                >
                    <button class="network" :class="{ active: currentNetwork.chain_id == network.chain_id }" @click.prevent="setCurrentNetwork(index)">
                        <div class="logo">
                            <img :src="getNetworkLogo(network.chain_id)" alt="" loading="lazy">
                        </div>

                        <div>
                            <div class="name">{{ network.pretty_name }}</div>
                        </div>

                        <button class="favorite_btn" :class="{ active: store.IBCRecoveryFavorites[network.chain_id] }" @click.stop.prevent="toggleFavorite(network.chain_id)">
                            <svg><use xlink:href="@/assets/sprite.svg#ic_favorite"></use></svg>

                            <svg><use xlink:href="@/assets/sprite.svg#ic_favorite_a"></use></svg>
                        </button>
                    </button>
                </div>
            </div>

            <div class="empty" v-else>
                {{ $t('message.search_empty') }}
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

    // Components
    import Search from '@/components/Search.vue'


    const store = useGlobalStore(),
        emitter = inject('emitter'),
        networks = ref([]),
        currentNetwork = ref({}),
        loading = ref(true),
        showDropdown = ref(false),
        target = ref(null),
        searchResult = ref(null)


    onBeforeMount(async () => {
        // Get IBS commands
        store.commands = await store.GetIBCRecoveryCommands()

        // Parse commands
        store.commands.forEach(command => {
            let arr = command.split('/'),
                chainIDs = [arr[0], arr[1]],
                networkConfig = null

            chainIDs.forEach(chainId => {
                // Get network config
                chainId === 'space-pussy'
                    ? networkConfig = store.networks.ibc_recovery.space_pussy
                    : networkConfig = chains.find(chain => chain.chain_id === chainId)

                // Set data
                if (!networks.value.find(el => el.chain_id === networkConfig.chain_id)) {
                    networks.value.push(networkConfig)
                }
            })
        })

        // Default search result
        searchResult.value = networks.value

        // Set current network
        setCurrentNetwork(0)

        // Hide loader
        loading.value = false
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


    // Toggle favorite
    function toggleFavorite(chainId) {
        store.IBCRecoveryFavorites[chainId] = !store.IBCRecoveryFavorites[chainId]
    }


    // Event "search"
    emitter.on('search', ({ query }) => {
        // Clear search result
        searchResult.value = []

        // Set new result
        networks.value.forEach(network => {
            if (network.pretty_name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
                searchResult.value.push(network)
            }
        })
    })


    // Click outside
    onClickOutside(target, e => showDropdown.value = false)
</script>


<style>
    .choose_network
    {
        position: relative;
        z-index: 9;

        width: 300px;
        max-width: 100%;
    }


    .choose_network .btn
    {
        position: relative;
        z-index: 3;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        width: 100%;
        height: 50px;
        padding: 4px 20px 4px 4px;

        text-align: left;

        border-radius: 42px;
        background: linear-gradient(129deg, #a42dff 27.86%, #410094 92.64%);
    }


    .choose_network .btn .logo
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 42px;
        height: 42px;
        margin-right: 10px;
        padding: 4px;

        border-radius: 50%;
        background: #2e3148;
    }

    .choose_network .btn .logo img
    {
        display: block;

        max-width: 100%;
        max-height: 100%;
    }

    .choose_network .btn .logo + *
    {
        width: calc(100% - 96px);
    }


    .choose_network .btn .name
    {
        font-size: 18px;
        font-weight: 600;
        line-height: 120%;

        overflow: hidden;

        white-space: nowrap;
        text-transform: lowercase;
        text-overflow: ellipsis;
    }

    .choose_network .btn .name::first-letter
    {
        text-transform: uppercase;
    }


    .choose_network .btn .token
    {
        font-size: 12px;
        font-weight: 500;
        line-height: 120%;

        opacity: .6;
    }


    .choose_network .btn .arr
    {
        display: block;

        width: 24px;
        height: 20px;
        margin-left: auto;

        transition: transform .2s linear;
    }


    .choose_network .btn.active
    {
        background: none;
    }

    .choose_network .btn.active .arr
    {
        transform: rotate(180deg);
    }



    .choose_network .mini_modal
    {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;

        width: 100%;
        padding: 62px 10px 10px;

        border-radius: 26px;
        background: linear-gradient(129deg, #a42dff 27.86%, #410094 92.64%);
    }


    .choose_network .search
    {
        position: relative;

        margin-bottom: 10px;
    }


    .choose_network .search ::-webkit-input-placeholder
    {
        color: rgba(255, 255, 255, .40);
    }

    .choose_network .search :-moz-placeholder
    {
        color: rgba(255, 255, 255, .40);
    }

    .choose_network .search ::-moz-placeholder
    {
        opacity: 1;
        color: rgba(255, 255, 255, .40);
    }

    .choose_network .search :-ms-input-placeholder
    {
        color: rgba(255, 255, 255, .40);
    }


    .choose_network .search .input
    {
        font-family: var(--font_family);
        font-size: 16px;
        font-size: var(--font_size);
        font-weight: 600;

        display: block;

        width: 100%;
        height: 29px;
        padding: 0 39px 0 14px;

        transition: .2s linear;

        color: var(--text_color);
        border: 1px solid #7544ff;
        border-radius: 20px;
        background: rgba(215, 171, 255, .40);
    }


    .choose_network .search .icon
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


    .choose_network .search .input:focus
    {
        background: rgba(0, 0, 0, .40);
    }

    .choose_network .search .input:focus .icon
    {
        opacity: 1;
    }


    .choose_network .empty
    {
        font-size: 16px;
        font-weight: 500;
        font-style: normal;
        line-height: 120%;

        padding: 24px 20px;

        color: rgba(255,255,255,.4);
        border-radius: 20px;
        background: #141414;
    }


    .choose_network .scroll
    {
        display: flex;
        overflow: auto;
        flex-direction: column;

        max-height: 345px;
        padding: 5px 10px 10px;

        border-radius: 20px;
        background: #141414;

        overscroll-behavior-y: contain;
    }

    .choose_network .scroll::-webkit-scrollbar
    {
        width: 4px;
        height: 4px;
    }


    .choose_network .scroll > *
    {
        order: 3;
        margin-top: 5px;
    }

    .choose_network .scroll > *.favorited
    {
        order: 1;
    }


    .choose_network .network
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;

        width: 100%;
        padding: 4px 8px 4px 4px;

        transition: background .2s linear;
        text-align: left;
        text-decoration: none;

        color: currentColor;
        border-radius: 8px;
    }


    .choose_network .network .logo
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 42px;
        height: 42px;
        margin-right: 10px;
        padding: 4px;

        border-radius: 50%;
        background: #2e3148;
    }


    .choose_network .network .logo img
    {
        display: block;

        max-width: 100%;
        max-height: 100%;
    }


    .choose_network .network .logo + *
    {
        width: calc(100% - 98px);
    }


    .choose_network .network .name
    {
        font-weight: 600;
        line-height: 120%;

        text-transform: lowercase;
    }

    .choose_network .network .name::first-letter
    {
        text-transform: uppercase;
    }


    .choose_network .network .token
    {
        font-size: 10px;
        font-weight: 500;
        line-height: 120%;

        margin-top: 2px;

        opacity: .6;
    }


    .choose_network .network .favorite_btn
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 42px;
        height: 42px;
        margin-left: auto;

        transition: .2s linear;

        opacity: .3;
    }


    .choose_network .network .favorite_btn svg
    {
        display: block;

        width: 100%;
        height: 100%;
    }


    .choose_network .network .favorite_btn svg + svg
    {
        display: none;
    }


    .choose_network .network .favorite_btn:hover
    {
        opacity: 1;
    }

    .choose_network .network .favorite_btn.active
    {
        opacity: 1;
        color: #ffba35;
    }

    .choose_network .network .favorite_btn.active svg
    {
        display: none;
    }

    .choose_network .network .favorite_btn.active svg + svg
    {
        display: block;
    }


    .choose_network .network:hover,
    .choose_network .network.active
    {
        background: #262626;
    }

</style>