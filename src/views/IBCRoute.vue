<template>
    <Loader v-if="loading" />

    <template v-else>
    <div class="list" v-if="store.balances.length">
        <div class="item" v-for="(balance, index) in store.balances" :key="index">
            <!-- <pre>{{ balance }}</pre> -->

            <div class="head">
                <div class="logo">
                    <!-- <img :src="getNetworkLogo(balance.chain_id)" alt=""> -->
                </div>

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

            <div class="data">
                <div class="return_path">
                    <div class="title">
                        {{ $t('message.ibc_route_return_path_label', { count: balance.return_path.length }) }}
                    </div>

                    <div v-if="!balance.return_path.length">
                        {{ $t('message.ibc_route_return_path_no_need') }}
                    </div>

                    <div class="list" v-else>
                        <div class="item" v-for="(item, itemIndex) in balance.return_path" :key="itemIndex">
                            <div class="number"></div>

                            <div class="label">
                                {{ $t('message.ibc_route_return_path_chain_name_label') }}
                            </div>

                            <div class="chain">
                                <div class="logo">
                                    <!-- <img :src="getNetworkLogo(item.chain_id)" alt=""> -->
                                </div>

                                <!-- <span>{{ item.chainFrom.chain_name }}</span> -->
                            </div>

                            <div class="arrow">
                                <svg><use xlink:href="@/assets/sprite.svg#ic_way"></use></svg>
                            </div>

                            <div class="chain">
                                <div class="logo">
                                    <!-- <img :src="getNetworkLogo(item.chain_id)" alt=""> -->
                                </div>

                                <!-- <span>{{ item.chainTo.chain_name }}</span> -->
                            </div>

                            <div class="status">
                                <span v-if="item.status === 'verified'" class="green">{{ $t('message.ibc_route_return_path_status_verified') }}</span>
                                <span v-if="item.status === 'broken'" class="yellow">{{ $t('message.ibc_route_return_path_status_broken') }}</span>
                                <span v-if="item.status === 'expired'" class="red">{{ $t('message.ibc_route_return_path_status_expired') }}</span>
                            </div>

                            <button class="send_btn" :disabled="item.status != 'verified'">
                                {{ $t('message.btn_send') }}
                            </button>
                        </div>
                    </div>
                </div>


                <div class="path">
                    <div class="label">
                        {{ $t('message.ibc_route_path_label') }}
                    </div>

                    <div class="val">
                        <span>{{ balance.denom_traces.path }}</span>

                        <button class="copy_btn" @click.prevent="copy(balance.denom_traces.path)" v-if="isSupported">
                            <img src="@/assets/ic_copy.svg" alt="">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="empty" v-else>
        {{ $t('message.ibc_route_empty_title') }}
    </div>
    </template>
</template>


<script setup>
    import { ref, onBeforeMount, watch, computed } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useRoute } from 'vue-router'
    import { chains } from 'chain-registry'
    import { useClipboard } from '@vueuse/core'
    import { formatTokenAmount, formatTokenName, getNetworkLogo } from '@/utils'

    // Components
    import Loader from '@/components/Loader.vue'


    const store = useGlobalStore(),
        route = useRoute(),
        loading = ref(true),
        { copy, isSupported } = useClipboard()


    onBeforeMount(async () => {
        // Set current service
        store.currentService = route.name

        // Set current multisend network
        store.IBCRouteCurrentNetwork = route.params.network

        // Init APP
        await store.initApp(store.IBCRouteCurrentNetwork)

        // Get paths
        await getPaths()

        // Hide loader
        loading.value = false
    })


    watch(computed(() => store.currentNetwork), async () => {
        // Show loader
        loading.value = true

        // Set current multisend network
        store.IBCRouteCurrentNetwork = route.params.network

        // Init APP
        await store.initApp(store.IBCRouteCurrentNetwork)

        // Get paths
        await getPaths()

        // Hide loader
        loading.value = false
    })


    // Get paths
    async function getPaths() {
        store.balances.forEach(async balance => {
            // Return path
            balance.return_path = []

            if (balance.denom_traces.path) {
                // Set default network
                balance.return_path.push({
                    chain_name: store.networks.IBC[store.IBCRouteCurrentNetwork].name,
                })

                for (const item of balance.denom_traces.path.match(/transfer\/channel-\d+/g)) {
                    let data = {
                        path: item,
                        channel: item.split('/')[1]
                    }

                    // Get connection
                    await fetch(`${store.networks.IBC[store.IBCRouteCurrentNetwork].lcd_api}/ibc/core/channel/v1/channels/${data.channel}/ports/transfer`)
                        .then(response => response.json())
                        .then(result => {
                            data.connection = result.channel.connection_hops[0]
                            // data.status = result.channel.state
                            data.status = 'verified'
                        })

                    // Get chain id
                    await fetch(`${store.networks.IBC[store.IBCRouteCurrentNetwork].lcd_api}/ibc/core/connection/v1/connections/${data.connection}/client_state`)
                        .then(response => response.json())
                        .then(result => data.chain_id = result.identified_client_state.client_state.chain_id)

                    // Get chain name
                    let chainName = chains.find(el => el.chain_id === data.chain_id)

                    data.chain_name = chainName ? chainName.pretty_name : null

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

    width: 796px;
    max-width: 100%;
    padding: 40px;

    background: none;
}



.list
{
    width: 796px;
    max-width: 100%;
}



.item
{
    border: 1px solid #915cd4;
    border-radius: 30px;
    background: radial-gradient(82.21% 105.43% at 50% 13.3%, rgba(71, 26, 146, .70) 0%, rgba(35, 6, 83, .70) 63.74%, rgba(0, 0, 0, .70) 100%), linear-gradient(132deg, #8f00b0 -12.79%, #570099 45.8%, #1b0044 99.42%);
}


.item + .item
{
    margin-top: 20px;
}


.item .head
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    padding: 18px 20px;

    text-transform: uppercase;
}


.item .head .logo
{
    width: 32px;
    height: 32px;
    margin-right: 10px;
}


.item .head .logo img
{
    display: block;

    width: 100%;
    height: 100%;
}


.item .head .denom
{
    margin-left: 4px;
}


.item .data
{
    padding: 0 20px 20px;
}


.item .path
{
    margin-top: 20px;
    padding: 10px 20px;

    border-radius: 20px;
    background: linear-gradient(180deg, #cca3ff 0%, #9d4cff 100%);
}


.item .path .label
{
    font-size: 20px;
    font-weight: 600;
    line-height: 100%;

    color: #6114bf;
}


.item .path .val
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
}


.item .path .val span
{
    font-weight: 500;

    display: block;
    overflow: hidden;

    width: calc(100% - 40px);

    white-space: nowrap;
    text-decoration: underline;
    text-overflow: ellipsis;
}


.item .path .copy_btn
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 20px;
    height: 20px;
    margin-left: auto;
}


.item .path .copy_btn .icon
{
    display: block;

    width: 14px;
    height: 17px;
}


.item .return_path .title
{
    font-size: 20px;
    font-weight: 600;

    margin-bottom: 6px;
    padding: 0 20px;
}


.item .return_path .list
{
    width: calc(100% + 20px);
    margin: 0 -10px;
    padding: 8px;

    counter-reset: number;

    border: 2px solid #c986ff;
    border-radius: 20px;
    background: #131313;
}


.item .return_path .item
{
    font-size: 18px;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    padding: 10px;

    border-radius: 11px;
    background: linear-gradient(129deg, #a42dff 27.86%, #410094 92.64%), #fff;
}

.item .return_path .item + .item
{
    margin-top: 6px;
}


.item .return_path .item > * + *
{
    margin-left: 10px;
}


.item .return_path .number
{
    width: 20px;

    white-space: nowrap;
}


.item .return_path .number:before
{
    content: counter(number) '.';
    counter-increment: number;
}


.item .return_path .label
{
    margin-right: 10px;
}


.item .return_path .chain
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    width: 146px;
}


.item .return_path .chain .logo
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 28px;
    height: 28px;
    padding: 2px;

    border-radius: 50%;
    background: #000;
}


.item .return_path .chain .logo img
{
    display: block;

    width: 100%;
    height: 100%;

    border-radius: 50%;
}


.item .return_path .chain span
{
    overflow: hidden;

    width: calc(100% - 32px);

    white-space: nowrap;
    text-overflow: ellipsis;
}


.item .return_path .arrow
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    width: 36px;
    height: 36px;
}


.item .return_path .arrow svg
{
    display: block;

    width: 19px;
    height: 18px;
}


.item .return_path .status
{
    font-size: 18px;
    font-weight: 500;

    width: 106px;
}


.item .return_path .status .green
{
    color: #30b900;
}

.item .return_path .status .yellow
{
    color: #fbd300;
}

.item .return_path .status .red
{
    color: #fb0000;
}


.item .return_path .send_btn
{
    font-size: 12px;
    font-weight: 600;
    line-height: 110%;

    display: block;

    width: 72px;
    height: 24px;

    border: 2px solid #762cb9;
    border-radius: 38px;
    background: linear-gradient(329deg, #762cb9 -28.05%, #8425da 32.19%, #b96bff 90.69%);
}


.item .return_path .send_btn:disabled
{
    pointer-events: none;

    opacity: .2;
}


.empty
{
    text-align: center;

    color: #cecece;
}




</style>