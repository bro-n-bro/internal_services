<template>
    <Loader v-if="loading" />

    <template v-else>
    <div class="page_head">
        <div class="page_title">
            {{ $t('message.ibs_page_title') }}
        </div>

        <!-- Choose network -->
        <ChooseNetwork :commands />
    </div>


    <div class="row">
        <div class="section" v-for="(relayer, relayerIndex) in relayers" :key="relayerIndex">
            <div class="title">{{ relayer.chains }}</div>

            <div class="commands">
                <label v-for="(command, commandIndex) in relayers.commands" :key="commandIndex">
                    <input type="radio" :name="`relayer${relayerIndex}`">
                    <div>{{ command.name }}</div>
                </label>
            </div>

            <button class="execute_btn">
                {{ $t('message.btn_execute') }}
            </button>
        </div>
    </div>
    </template>
</template>


<script setup>
    import { ref, onBeforeMount, inject } from 'vue'
    import { useGlobalStore } from '@/stores'

    // Components
    import Loader from '@/components/Loader.vue'
    import ChooseNetwork  from '@/components/ibs/ChooseNetwork.vue'


    const store = useGlobalStore(),
        emitter = inject('emitter'),
        loading = ref(true),
        commands = ref([]),
        relayers = ref([])


    onBeforeMount(async () => {
        // Get IBS commands
        commands.value = await store.GetIBSCommands()

        // Hide loader
        loading.value = false
    })


    // Get chain data
    function getChainData(chainId) {
        // Get chain commands
        let chainCommands = commands.find(command => command.includes(chainId))

        chainCommands.forEach(command => {
            // Split
            let arr = network.value.split('/'),
                chains = arr[0] + '<=>' + arr[1],
                relayer = relayers.value.find(el => el.chains != chains)

            if (!relayer) {
                let fromChainInfo = store.networks.find(el => el.chainId === arr[0]),
                    toChainInfo = store.networks.find(el => el.chainId === arr[1])

                // Set data
                relayers.value.push({
                    chains: arr[0] + '<=>' + arr[1],
                    from: fromChainInfo.alias,
                    to: toChainInfo.alias,
                    fromName: fromChainInfo.name,
                    toName: toChainInfo.name,
                    commands: [ {
                        name: arr[2],
                        command: command
                    }]
                })
            } else {
                relayer.commands.push({
                    name: arr[2],
                    command: command
                })
            }
        })
    }


    // Event "updateCurrentNetwork"
    emitter.on('updateCurrentNetwork', ({ chainId }) => {
        // Show loader
        loading.value = true

        // Get chain data
        getChainData(chainId)

        // Hide loader
        loading.value = false
    })
</script>


<style scoped>
.row
{
    align-content: stretch;
    align-items: stretch;

    margin-bottom: -24px;
    margin-left: -24px;
}


.row > *
{
    width: calc(50% - 24px);
    margin-bottom: 24px;
    margin-left: 24px;
}


.section
{
    padding: 23px;

    border: 1px solid #950fff;
    border-radius: 14px;
}


.section .title
{
    font-size: 20px;

    margin-bottom: 20px;

    text-align: center;
}


.commands
{
    display: flex;
    align-content: stretch;
    align-items: stretch;
    flex-wrap: wrap;
    justify-content: flex-start;
}


.commands input
{
    display: none;
}


.commands label
{
    display: block;

    cursor: pointer;

    border-radius: 10px;
}


.commands label div
{
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    min-height: 48px;
    padding: 9px;

    transition: .2s linear;
    text-align: center;

    border: 1px solid transparent;
    border-radius: 10px;
    background: #191919;
}


.commands input:checked + div
{
    border-color: #950fff;
}


.execute_btn
{
    font-weight: 500;
    line-height: 19px;

    display: block;

    width: 100%;
    height: 48px;
    margin-top: 20px;
    padding: 10px;

    transition: .2s linear;

    color: #fff;
    border-radius: 14px;
    background: #950fff;
}

.execute_btn:disabled
{
    cursor: default;
    pointer-events: none;

    opacity: .5;
}


.execute_btn:hover
{
    background: #7700e1;
}


</style>