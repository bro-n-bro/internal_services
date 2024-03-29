<template>
    <section class="modal" id="deposit_modal">
        <div class="modal_content" @click.self="emitter.emit('closeMultisendConfirmModal', { status: false })">
            <div class="data">
                <button class="close_btn" @click.prevent="emitter.emit('closeMultisendConfirmModal', { status: false })">
                    <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
                </button>


                <div class="titles">
                    <div class="col_address">Sender</div>
                </div>

                <div class="sender">
                    {{ store.Keplr.account.address }}
                </div>


                <div class="titles">
                    <div class="col_address">Recipient</div>
                    <div class="col_denom">Denom</div>
                    <div class="col_amount">Amount</div>
                </div>

                <div class="recipient" v-for="item in data" :key="itemIndex">
                    <div class="col_address">{{ item.address }}</div>

                    <div class="coins" v-for="coin in item.coins" :key="coinIndex">
                        <div class="col_denom">{{ formatTokenName(getBestDenom(coin.denom)) }}</div>
                        <div class="col_amount">{{ coin.amount }}</div>
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
    import { prepareTx, sendTx, getBestDenom, formatTokenName } from '@/utils'


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

        // Send "closeMultisendConfirmModal" event
        emitter.emit('closeMultisendConfirmModal', { status: false })
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
.titles
{
    font-size: 14px;
    line-height: 17px;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;

    margin-top: 68px;

    color: #8e8e8e;
    border: 1px solid #fff;
}

.titles ~ .titles
{
    margin-top: 20px;
}


.titles > *
{
    width: 100%;
    padding: 9px;
}

.titles > *.col_denom,
.titles > *.col_amount
{
    width: 120px;
    min-width: 120px;
}

.titles > * + *
{
    border-left: 1px solid #fff;
}



.sender
{
    font-size: 14px;
    line-height: 17px;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-start;

    margin-top: -1px;
    padding: 9px;

    border: 1px solid #fff;
}



.recipient
{
    font-size: 14px;
    line-height: 17px;

    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;

    margin-top: -1px;

    border: 1px solid #fff;
}


.recipient .col_address
{
    width: calc(100% - 240px);
    padding: 9px;
}


.recipient .coins
{
    display: flex;
    align-content: stretch;
    align-items: stretch;
    flex-wrap: nowrap;
    justify-content: flex-start;

    width: 240px;
    min-width: 240px;
    margin-left: auto;
}

.recipient .coins + .coins
{
    border-top: 1px solid #fff;
}


.recipient .coins > *
{
    width: 100%;
    padding: 9px;

    border-left: 1px solid #fff;
}


.recipient .coins .col_denom
{
    text-transform: uppercase;
}



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