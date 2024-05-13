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
            <div class="title">
                <span>{{ relayer.fromName }}</span>

                <span class="sep"><=></span>

                <span>{{ relayer.toName }}</span>
            </div>

            <div class="commands">
                <label v-for="(command, commandIndex) in relayer.commands" :key="commandIndex" @click.prevent="setCommand(relayerIndex, command.command)">
                    <input type="radio" v-model="relayer.currentCommand" :value="command.command" :name="`relayer${relayerIndex}`">

                    <div v-if="command.name === 'clear'">{{ $t('message.btn_clear') }}</div>
                    <div v-if="command.name === 'update'">{{ $t('message.btn_update') }}</div>
                </label>
            </div>

            <button class="execute_btn" :disabled="!relayer.currentCommand.length"@click.prevent="executeCommand(relayerIndex)">
                {{ $t('message.btn_execute') }}
            </button>
        </div>
    </div>
    </template>


    <AnswersModal v-if="showAnswersModal" />
</template>


<script setup>
    import { ref, onBeforeMount, inject } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { chains } from 'chain-registry'

    // Components
    import Loader from '@/components/Loader.vue'
    import ChooseNetwork  from '@/components/ibs/ChooseNetwork.vue'
    import AnswersModal  from '@/components/ibs/AnswersModal.vue'


    const store = useGlobalStore(),
        emitter = inject('emitter'),
        loading = ref(true),
        commands = ref([]),
        showAnswersModal = ref(false),
        relayers = ref([])


    onBeforeMount(async () => {
        // Get IBS commands
        commands.value = await store.GetIBSCommands()

        // Init WebSockets
        store.initWebSockets()

        // Hide loader
        loading.value = false
    })


    // Get chain data
    function getChainData(chainId) {
        // Get chain commands
        let chainCommands = commands.value.filter(command => command.includes(chainId))

        chainCommands.forEach(command => {
            // Split
            let arr = command.split('/'),
                chainsTitle = arr[0] + '<=>' + arr[1],
                relayer = relayers.value.find(el => el.title === chainsTitle)

            if (relayer == undefined) {
                // Get network config
                let fromChainInfo = {},
                    toChainInfo = {}

                // From chain info
                arr[0] === 'space-pussy'
                    ? fromChainInfo = store.networks.ibs.space_pussy
                    : fromChainInfo = chains.find(chain => chain.chain_id === arr[0])

                // To chain info
                arr[1] === 'space-pussy'
                    ? toChainInfo = store.networks.ibs.space_pussy
                    : toChainInfo = chains.find(chain => chain.chain_id === arr[1])

                    console.log(fromChainInfo)
                    console.log(toChainInfo)

                // Set data
                relayers.value.push({
                    title: chainsTitle,
                    from: fromChainInfo.bech32_prefix,
                    to: toChainInfo.bech32_prefix,
                    fromName: fromChainInfo.pretty_name,
                    toName: toChainInfo.pretty_name,
                    currentCommand: '',
                    commands: [{
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


            console.log(relayers.value)
        })
    }


    // Set command
    function setCommand(relayerIndex, command) {
        relayers.value[relayerIndex].currentCommand = command
    }


    // Execute command
    function executeCommand(relayerIndex) {
        // Show modal
        showAnswersModal.value = true

        // Send command
        store.socket.send(relayers.value[relayerIndex].currentCommand)
    }


    // Event "updateCurrentNetwork"
    emitter.on('updateCurrentNetwork', ({ chainId }) => {
        // Show loader
        loading.value = true

        // Reset data
        relayers.value = []

        // Get chain data
        getChainData(chainId)

        // Hide loader
        loading.value = false
    })


    // Event "closeIBSAnswersModal"
    emitter.on('closeIBSAnswersModal', () => {
        // Hide modal
        showAnswersModal.value = false
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

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    margin-bottom: 20px;

    text-align: center;
}


.section .title span
{
    display: block;

    text-transform: lowercase;
}

.section .title span::first-letter
{
    text-transform: uppercase;
}


.section .title .sep
{
    margin: 0 12px;
}


.commands
{
    display: flex;
    align-content: stretch;
    align-items: stretch;
    flex-wrap: wrap;
    justify-content: space-between;

    margin-bottom: -10px;
    margin-left: -10px;
}


.commands input
{
    display: none;
}


.commands label
{
    display: block;

    width: calc(50% - 10px);
    margin-bottom: 10px;
    margin-left: 10px;

    cursor: pointer;

    border-radius: 10px;
}


.commands label > *
{
    pointer-events: none;
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