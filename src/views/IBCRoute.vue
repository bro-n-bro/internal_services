<template>
    <Loader v-if="loading" />

    <template v-else>
    <div class="page_head">
        <div class="page_title">
            {{ $t('message.ibc_route_page_title') }}
        </div>

        <!-- Choose network -->
        <ChooseNetwork />
    </div>

    <!-- <pre>{{ store.balances }}</pre> -->

    <div class="list">
        <div class="item" v-for="(balance, index) in store.balances" :key="index">
            <div class="row">
                <div class="amount">
                    <template v-if="formatTokenAmount(balance.amount, balance.base_denom) < 0.01">
                    &lt; 0.01
                    </template>

                    <template v-else>
                    {{ $filters.toFixed(formatTokenAmount(balance.amount, balance.base_denom), 2) }}
                    </template>
                </div>

                <div class="denom">{{ formatTokenName(balance.denom) }}</div>
            </div>

            <div class="path">
                <div class="label">Path: </div>
                <div class="val">{{ balance.denom_traces.path }}</div>
            </div>

            <div class="return_path">
                <div class="title">Return path</div>

                <div v-if="!balance.return_path.length">
                    No need, it's a native token.
                </div>

                <div class="row" v-else>
                    <div v-for="(item, itemIndex) in balance.return_path" :key="itemIndex">
                        <div>
                            <div class="label">Chain name:</div>
                            <div class="val">{{ item.chain_name }}</div>
                        </div>

                        <div v-if="item.status">
                            <div class="label">Channel status:</div>
                            <div class="val">{{ item.status }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </template>
</template>


<script setup>
    import { ref, onBeforeMount, watch, computed } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { chains } from 'chain-registry'
    import { formatTokenAmount, formatTokenName } from '@/utils'

    // Components
    import Loader from '@/components/Loader.vue'
    import ChooseNetwork  from '@/components/ibc_route/ChooseNetwork.vue'


    const store = useGlobalStore(),
        loading = ref(true)


    onBeforeMount(async () => {
        // Init APP
        if (!store.isKeplrConnected) {
            await store.initApp()
        }

        // Get paths
        await getPaths()

        // Hide loader
        loading.value = false
    })


    watch(computed(() => store.currentNetwork), async () => {
        // Show loader
        loading.value = true

        // Reinit APP
        await store.initApp()

        // Get paths
        await getPaths()

        // Hide loader
        loading.value = false
    })


    // Get paths
    function getPaths() {
        store.balances.forEach(async balance => {
            // Return path
            balance.return_path = []

            if (balance.denom_traces.path) {
                // Set default network
                balance.return_path.push({
                    chain_name: store.networks.IBC[store.currentNetwork].name,
                })

                for (const item of balance.denom_traces.path.match(/transfer\/channel-\d+/g)) {
                    let data = {
                        path: item,
                        channel: item.split('/')[1]
                    }

                    // Get connection
                    await fetch(`${store.networks.IBC[store.currentNetwork].lcd_api}/ibc/core/channel/v1/channels/${data.channel}/ports/transfer`)
                        .then(response => response.json())
                        .then(result => {
                            data.connection = result.channel.connection_hops[0]
                            data.status = result.channel.state
                        })

                    // Get chain id
                    await fetch(`${store.networks.IBC[store.currentNetwork].lcd_api}/ibc/core/connection/v1/connections/${data.connection}/client_state`)
                        .then(response => response.json())
                        .then(result => data.chain_id = result.identified_client_state.client_state.chain_id)

                    // Get chain name
                    let chainName = chains.find(el => el.chain_id === data.chain_id)

                    data.chain_name = chainName ? chainName.pretty_name : 'Not definitely'

                    // Set data
                    balance.return_path.push(data)
                }
            }
        })
    }
</script>


<style scoped>
.loader_wrap
{
    position: relative;

    padding: 40px;

    background: none;
}


.item + .item
{
    margin-top: 40px;
}


.item .amount
{
    margin-bottom: 12px;

    text-transform: uppercase;
}


.item .denom
{
    margin-bottom: 12px;
    margin-left: 4px;

    text-transform: uppercase;
}


.item .path .label
{
    font-size: 14px;

    margin-bottom: 4px;

    opacity: .5;
}


.item .return_path
{
    margin-top: 16px;
}


.item .return_path .title
{
    margin-bottom: 8px;
}


.item .return_path .row
{
    margin-left: -60px;
}


.item .return_path .row > *
{
    position: relative;

    margin-left: 60px;
}


.item .return_path .row > * + *:before
{
    position: absolute;
    top: 0;
    bottom: 0;
    left: -40px;

    display: block;

    width: 20px;
    height: 1px;
    margin: auto 0;

    content: '';
    pointer-events: none;

    background: currentColor;
}

.item .return_path .row > * + *:after
{
    position: absolute;
    top: 0;
    bottom: 0;
    left: -29px;

    display: block;

    width: 9px;
    height: 9px;
    margin: auto 0;

    content: '';
    transform: rotate(135deg);
    pointer-events: none;

    border-top: 1px solid;
    border-left: 1px solid;
}


.item .return_path .row > * > *
{
    display: flex;
    align-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.item .return_path .row > * > * + *
{
    margin-top: 4px;
}


.item .return_path .label
{
    font-size: 14px;

    align-self: center;

    margin-right: 8px;

    opacity: .5;
}




</style>