<template>
    <Loader v-if="loading" />

    <div class="data" v-else>
        <div class="row">
            <div class="section" v-for="(relayer, relayerIndex) in relayers" :key="relayerIndex">
                <div class="title">
                    <span>{{ relayer.fromName }}</span>

                    <img src="@/assets/ibc_recovery_title_sep.svg" alt="" class="sep">

                    <span>{{ relayer.toName }}</span>
                </div>

                <div class="commands">
                    <label v-for="(command, commandIndex) in relayer.commands" :key="commandIndex" @click.prevent="setCommand(relayerIndex, command.command)">
                        <input type="radio" v-model="currentCommand" :value="command.command">

                        <div v-if="command.name === 'clear'">
                            <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_trash"></use></svg>

                            <span>{{ $t('message.btn_clear') }}</span>
                        </div>

                        <div v-if="command.name === 'update'">
                            <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_update"></use></svg>

                            <span>{{ $t('message.btn_update') }}</span>
                        </div>
                    </label>
                </div>

                <button class="execute_btn" :disabled="!relayer.status" @click.prevent="executeCommand()">
                    {{ $t('message.btn_execute') }}
                </button>
            </div>
        </div>
    </div>


    <!-- Answers modal -->
    <AnswersModal v-if="showAnswersModal" />
</template>


<script setup>
    import { ref, onBeforeMount, inject } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useRoute } from 'vue-router'
    import { chains } from 'chain-registry'

    // Components
    import Loader from '@/components/Loader.vue'
    import AnswersModal  from '@/components/ibc_recovery/modal/AnswersModal.vue'


    const store = useGlobalStore(),
        emitter = inject('emitter'),
        route = useRoute(),
        loading = ref(true),
        showAnswersModal = ref(false),
        relayers = ref([]),
        currentCommand = ref(null)


    onBeforeMount(() => {
        // Set current service
        store.currentService = route.name

        // Init WebSockets
        store.initWebSockets()
    })


    // Get chain data
    function getChainData(chainId) {
        // Get chain commands
        let chainCommands = store.commands.filter(command => command.includes(chainId))

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
                    ? fromChainInfo = store.networks.ibc_recovery.space_pussy
                    : fromChainInfo = chains.find(chain => chain.chain_id === arr[0])

                // To chain info
                arr[1] === 'space-pussy'
                    ? toChainInfo = store.networks.ibc_recovery.space_pussy
                    : toChainInfo = chains.find(chain => chain.chain_id === arr[1])

                // Set data
                relayers.value.push({
                    title: chainsTitle,
                    from: fromChainInfo.bech32_prefix,
                    to: toChainInfo.bech32_prefix,
                    fromName: fromChainInfo.pretty_name,
                    toName: toChainInfo.pretty_name,
                    status: false,
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
        })
    }


    // Set command
    function setCommand(relayerIndex, command) {
        // Set command
        currentCommand.value = command

        // Update active relayer
        relayers.value.forEach(relayer => relayer.status = false)

        relayers.value[relayerIndex].status = true
    }


    // Execute command
    function executeCommand() {
        // Show modal
        showAnswersModal.value = true

        // Send command
        store.socket.send(currentCommand.value)
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


    // Event "closeIBCRecoveryAnswersModal"
    emitter.on('closeIBCRecoveryAnswersModal', () => {
        // Hide modal
        showAnswersModal.value = false
    })
</script>


<style scoped>
    .loader_wrap
    {
        position: relative;

        width: 920px;
        max-width: 100%;
        padding: 40px;

        background: none;
    }


    .data
    {
        width: 920px;
        max-width: 100%;
    }


    .row
    {
        align-content: stretch;
        align-items: stretch;

        margin-bottom: -20px;
        margin-left: -40px;
    }


    .row > *
    {
        width: calc(50% - 40px);
        margin-bottom: 20px;
        margin-left: 40px;
    }


    .section
    {
        padding: 29px;

        border: 1px solid #915cd4;
        border-radius: 30px;
        background: radial-gradient(82.21% 105.43% at 50% 13.3%, rgba(71, 26, 146, .70) 0%, rgba(35, 6, 83, .70) 63.74%, rgba(0, 0, 0, .70) 100%), linear-gradient(132deg, rgba(143, 0, 176, .70) -12.79%, rgba(87, 0, 153, .70) 45.8%, rgba(27, 0, 68, .70) 99.42%);
    }


    .section .title
    {
        font-size: 18px;
        font-weight: 600;
        line-height: 100%;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        margin-bottom: 20px;
        padding: 10px 12px;

        text-align: center;

        border-radius: 10px;
        background: #763dba;
    }


    .section .title span
    {
        display: block;
        overflow: hidden;

        width: calc(50% - 25px);
        padding: 10px;

        white-space: nowrap;
        text-transform: lowercase;
        text-overflow: ellipsis;

        border-radius: 6px;
        background: #191919;
    }

    .section .title span::first-letter
    {
        text-transform: uppercase;
    }


    .section .title .sep
    {
        display: block;

        width: 31px;
        height: 22px;
    }


    .commands
    {
        display: flex;
        align-content: stretch;
        align-items: stretch;
        flex-wrap: wrap;
        justify-content: space-between;

        margin-bottom: -20px;
        margin-left: -20px;
    }


    .commands input
    {
        display: none;
    }


    .commands label
    {
        display: block;

        width: calc(50% - 20px);
        margin-bottom: 20px;
        margin-left: 20px;

        cursor: pointer;

        border-radius: 10px;
        background: linear-gradient(329deg, #762cb9 -28.05%, #8425da 32.19%, #b96bff 90.69%);
    }


    .commands label > *
    {
        pointer-events: none;
    }


    .commands label div
    {
        font-size: 18px;
        font-weight: 600;
        line-height: 100%;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        height: 52px;

        text-align: center;

        border-radius: 10px;
    }


    .commands label div .icon
    {
        display: block;

        width: 20px;
        height: 20px;
        margin-right: 10px;
    }


    .commands input:checked + div
    {
        color: #8425da;
        border: 2px solid #762cb9;
        background: #fff;
    }


    .execute_btn
    {
        font-size: 20px;
        font-weight: 600;
        line-height: 100%;

        display: block;

        width: 100%;
        height: 50px;
        margin-top: 20px;

        color: #fff;
        border: 1px solid #d57cff;
        border-radius: 38px;
    }


    .execute_btn:hover
    {
        border: 1px solid #d57cff;
        background: linear-gradient(329deg, #762cb9 -28.05%, #8425da 32.19%, #b96bff 90.69%);
    }


    .execute_btn:active
    {
        border: none;
        background: linear-gradient(329deg, #b96bff -28.05%, #8425da 30.46%, #762cb9 90.69%);
    }


    .execute_btn:disabled
    {
        cursor: default;
        pointer-events: none;

        opacity: .5;
    }
</style>