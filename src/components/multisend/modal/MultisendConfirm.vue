<template>
    <section class="modal">
        <div class="modal_content" @click.self="emitter.emit('closeMultisendConfirmModal', { status: false })">
            <div class="data">
                <button class="close_btn" @click.prevent="emitter.emit('closeMultisendConfirmModal', { status: false })">
                    <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
                </button>


                <div class="modal_title">
                    {{ $t('message.multisend_confirm_title') }}
                </div>

                <div class="sender">
                    {{ store.Keplr.account.address }}
                </div>


                <div class="list">
                    <div class="recipient" v-for="item in data" :key="itemIndex">
                        <div class="col_address">
                            <div class="label">
                                {{ $t('message.multisend_confirm_address_label') }}
                            </div>

                            <div class="val">
                                {{ item.address.slice(0, 9) + '...' + item.address.slice(-6) }}
                            </div>
                        </div>

                        <div class="coins">
                            <div class="col_denom">
                                <div class="label">
                                    {{ $t('message.multisend_confirm_denom_label') }}
                                </div>
                            </div>

                            <div class="col_amount">
                                <div class="label">
                                    {{ $t('message.multisend_confirm_amount_label') }}
                                </div>
                            </div>

                            <div class="coin" v-for="coin in item.coins" :key="coinIndex">
                                <div class="col_denom">
                                    <div class="val">{{ formatTokenName(coin.denom) }}</div>
                                </div>

                                <div class="col_amount">
                                    <div class="val">{{ coin.amount }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


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
    import { sendTx, formatTokenName } from '@/utils'


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
                            amount: parseInt((parseFloat(coin.amount) * Math.pow(10, store.balances.find(el => el.denom == coin.denom).exponent))).toString(),
                            denom: coin.denom
                        })
                    }
                })
            })


            // Format coins amount
            outputs.forEach(item => {
                item.coins.forEach(coin => {
                    // Multiply by the exponent
                    coin.amount = parseInt((coin.amount * Math.pow(10, store.balances.find(el => el.denom == coin.denom).exponent))).toString()
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


            // Send Tx
            let result = await sendTx([msgAny], store.currentNetwork)

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
                        chain: store.networks.global[store.currentNetwork].name,
                        tx_type: i18n.global.t('message.notification_multisend_action'),
                        tx_hash: store.networks.global[store.currentNetwork].mintscanPrefix ? result.transactionHash : null
                    }
                })

                // Send "updateBalances" event
                emitter.emit('updateBalances')
            } else {
                // Show error
                showError(result)
            }
        } catch (error) {
            console.error(error)

            // Show error
            showError(error)
        }

        // Send "closeMultisendConfirmModal" event
        emitter.emit('closeMultisendConfirmModal', { status: false })
    }


    // Show error message
    function showError(error) {
        // Get error code
        let errorText = ''

        // Get error title
        error.code
            ? errorText = i18n.global.t(`message.notification_tx_error_${error.code}`)
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
                chain: store.networks.global[store.currentNetwork].name,
                tx_type: i18n.global.t('message.notification_multisend_action')
            }
        })
    }
</script>


<style scoped>
    .sender
    {
        font-size: 16px;

        padding: 10px 20px;

        border: 2px solid #c986ff;
        border-radius: 30px;
        background: #131313;
    }


    .list
    {
        margin-top: 20px;
    }


    .recipient
    {
        font-size: 24px;
        font-weight: 600;
        line-height: calc(100% + 4px);

        display: flex;
        align-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: space-between;

        padding: 10px 20px;

        border-radius: 20px;
        background: linear-gradient(180deg, #cca3ff 0%, #9d4cff 100%);
    }


    .recipient + .recipient
    {
        margin-top: 20px;
    }


    .recipient .label
    {
        font-size: 18px;
        font-weight: 500;

        color: #6114bf;
    }


    .recipient .col_address
    {
        width: 363px;
        max-width: 100%;
    }


    .recipient .col_denom
    {
        width: 130px;
        max-width: 100%;
    }


    .recipient .col_amount
    {
        width: calc(100% - 150px);
    }


    .recipient .coins
    {
        display: flex;
        align-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: flex-start;

        width: 400px;
        max-width: 100%;
        margin-left: auto;
    }


    .recipient .coins .coin
    {
        display: flex;
        align-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: flex-start;

        width: 100%;
    }



    .confirm_btn
    {
        font-size: 20px;
        font-weight: 600;
        line-height: 110%;

        display: block;

        width: 170px;
        max-width: 100%;
        height: 52px;
        margin-top: 20px;
        margin-left: auto;

        border: 2px solid #762cb9;
        border-radius: 14px;
        background: linear-gradient(329deg, #762cb9 -28.05%, #8425da 32.19%, #b96bff 90.69%);
    }


    .confirm_btn:hover
    {
        background: linear-gradient(329deg, #b96bff -28.05%, #8425da 30.46%, #762cb9 90.69%);
    }


    .confirm_btn:active
    {
        color: #8425da;
        background: #fff;
    }
</style>