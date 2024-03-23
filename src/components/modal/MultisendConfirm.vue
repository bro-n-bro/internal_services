<template>
    <section class="modal" id="deposit_modal">
        <div class="modal_content" @click.self="emitter.emit('closeMultisendConfirmModal', { status: false })">
            <div class="data">
                <button class="close_btn" @click.prevent="emitter.emit('closeMultisendConfirmModal', { status: false })">
                    <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
                </button>

                <pre>{{ data }}</pre>

                <button class="confirm_btn" @click.prevent="send()">
                    {{ $t('message.btn_confirm') }}
                </button>
            </div>
        </div>

        <div class="overlay"></div>
    </section>
</template>


<script setup>
    import { inject } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useNotification } from '@kyvg/vue3-notification'
    import { prepareTx, sendTx } from '@/utils'


    const store = useGlobalStore(),
        i18n = inject('i18n'),
        notification = useNotification(),
        emitter = inject('emitter'),
        props = defineProps(['data'])


    // Send
    async function send() {
        // Send "closeMultisendConfirmModal" event
        emitter.emit('closeMultisendConfirmModal', { status: true })

        // Show tx processing notifications
        notification.notify({
            group: 'default',
            duration: -100,
            title: i18n.global.t('message.notification_multisend_process')
        })

        try {
            let inputs = [{
                address: store.Keplr.account.address,
                coins: []
            }],
            outputs = JSON.parse(JSON.stringify(props.data))


            // Group inputs coins
            props.data.forEach(item => {
                item.coins.forEach(coin => {
                    // Find denom duplicate
                    let duplicateDenom = inputs[0].coins.find(el => el.denom == coin.denom)

                    if (duplicateDenom) {
                        // Sum amount for one denom
                        duplicateDenom.amount = (parseFloat(duplicateDenom.amount) + parseFloat(coin.amount) * Math.pow(10, store.balances.find(el => el.denom == coin.denom).exponent)).toString()
                    } else {
                        // Add new coin
                        inputs[0].coins.push({
                            amount: (parseFloat(coin.amount) * Math.pow(10, store.balances.find(el => el.denom == coin.denom).exponent)).toString(),
                            denom: coin.denom
                        })
                    }
                })
            })


            // Format coins amount
            outputs.forEach(item => {
                item.coins.forEach(coin => {
                    // Multiply by the exponent
                    coin.amount = (coin.amount * Math.pow(10, store.balances.find(el => el.denom == coin.denom).exponent)).toString()
                })
            })


            // Sort coins
            inputs[0].coins.sort((a, b) => {
                if (a.denom > b.denom) { return 1 }
                if (a.denom < b.denom) { return -1 }
                return 0
            })

            outputs.forEach(item => {
                item.coins.sort((a, b) => {
                    if (a.denom > b.denom) { return 1 }
                    if (a.denom < b.denom) { return -1 }
                    return 0
                })
            })


            // Message
            let msgAny = {
                typeUrl: '/cosmos.bank.v1beta1.MsgMultiSend',
                value: {
                    inputs,
                    outputs
                }
            }

            // Prepare Tx
            let prepareResult = await prepareTx([msgAny], true, store.currentNetwork)

            // Send Tx
            let result = await sendTx(prepareResult)

            if (result.code === 0) {
                // Show notification
                notification.notify({
                    group: 'default',
                    clean: true
                })

                notification.notify({
                    group: 'default',
                    title: i18n.global.t('message.notification_multisend_success_title'),
                    type: 'success',
                    data: {
                        chain: store.networks[store.currentNetwork].name,
                        tx_type: i18n.global.t('message.notification_multisend_action'),
                        tx_hash: result.transactionHash
                    }
                })

                // Reinit APP
                await store.initApp()
            } else {
                // Show error
                showError(error)
            }
        } catch (error) {
            console.error(error)

            // Show error
            showError(error)
        }
    }


    // Show error message
    function showError(error) {
        // Get error code
        let errorCode = error.message.match(/code (\d+(\.\d)*)/i),
            errorText = ''

        // Get error title
        errorCode
            ? errorText = i18n.global.t(`message.notification_tx_error_${errorCode[1]}`)
            : errorText = i18n.global.t('message.notification_tx_error_rejected')

        // Show notification
        notification.notify({
            group: 'default',
            clean: true
        })

        notification.notify({
            group: 'default',
            title: i18n.global.t('message.notification_failed_title'),
            text: errorText,
            type: 'error',
            data: {
                chain: store.networks[store.currentNetwork].name,
                tx_type: i18n.global.t('message.notification_multisend_action')
            }
        })
    }
</script>


<style scoped>
    .confirm_btn
    {
        font-weight: 500;
        line-height: 19px;

        display: block;

        width: 100%;
        height: 55px;
        margin-top: 40px;
        padding: 10px;

        transition: .2s linear;

        color: #fff;
        border-radius: 14px;

        background: #950fff;
    }
</style>