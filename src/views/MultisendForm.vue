<template>
    <div class="page_head">
        <div class="page_title">
            {{ $t('message.multisend_form_page_title', { network : store.networks[store.currentNetwork].name }) }}
        </div>

        <!-- Choose network -->
        <ChooseNetwork />
    </div>

    <Loader v-if="loading" />

    <form v-else action="" class="form" :class="{ processing: processing }" @submit.prevent="onSubmit()">
        <div class="item" v-for="(item, itemIndex) in data" :key="itemIndex">
            <button type="button" class="delete_btn" v-if="itemIndex" @click="deleteItem(itemIndex)">
                <svg><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
            </button>

            <div class="line">
                <div class="label">
                    {{ $t('message.multisend_form_to_address_label') }}
                </div>

                <div class="field">
                    <input type="text" v-model="item.address" class="input" @input="validateAddress($event, itemIndex)">
                </div>
            </div>

            <div class="columns" v-for="(coin, coinIndex) in item.coins" :key="coinIndex">
                <div class="line from">
                    <div class="label">
                        {{ $t('message.multisend_form_from_label') }}
                    </div>

                    <div class="field">
                        <input type="text" v-model="coin.denom" class="input" @focus.self="showDropdown($event)">

                        <div class="arr">
                            <svg><use xlink:href="@/assets/sprite.svg#ic_arr_ver"></use></svg>
                        </div>

                        <div class="dropdown">
                            <div class="scroll">
                                <div v-for="(balance, balanceIndex) in store.balances" :key="balanceIndex">
                                    <button type="button" class="btn" @click.prevent="setDenom(itemIndex, coinIndex, balance.denom)">
                                        <div class="denom">{{ formatTokenName(balance.base_denom) }}</div>

                                        <div class="amount">{{ formatTokenAmount(balance.amount, balance.base_denom) }}</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="line amount">
                    <div class="label">
                        {{ $t('message.multisend_form_amount_label') }}
                    </div>

                    <div class="field">
                        <input type="text" v-model="coin.amount" class="input" @input="setAmount($event, itemIndex, coinIndex)" :placeholder="coin.placeholder ? coin.placeholder : 0" :disabled="!coin.denom.length">

                        <button type="button" class="max_btn" @click.prevent="setMaxAmount(itemIndex, coinIndex)" :disabled="!coin.denom.length">
                            {{ $t('message.btn_max') }}
                        </button>
                    </div>
                </div>

                <button type="button" class="add_btn" v-if="!coinIndex" @click="addCoinToItem(itemIndex)">
                    <svg><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
                </button>

                <button type="button" class="delete_btn" v-if="coinIndex" @click="deleteCoinInItem(itemIndex, coinIndex)">
                    <svg><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
                </button>
            </div>
        </div>


        <div class="line add_items">
            <input type="number" v-model="add_amount" class="input">

            <button type="button" class="btn" @click="addItems()">
                {{ $t('message.btn_add') }}
            </button>
        </div>


        <div class="submit">
            <button type="submit" class="btn submit_btn">
                {{ $t('message.btn_send') }}
            </button>
        </div>
    </form>
</template>


<script setup>
    import { reactive, ref, onBeforeMount, onMounted, onBeforeUnmount, inject } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useNotification } from '@kyvg/vue3-notification'
    import { formatTokenAmount, formatTokenName, prepareTx, sendTx } from '@/utils'

    // Components
    import Loader from '@/components/Loader.vue'
    import ChooseNetwork  from '@/components/ChooseNetwork.vue'


    const store = useGlobalStore(),
        i18n = inject('i18n'),
        notification = useNotification(),
        loading = ref(true),
        processing = ref(false),
        add_amount = ref(1),
        data = reactive([
            {
                address: '',
                coins: [{
                    amount: '',
                    denom: ''
                }]
            },
        ])


    onBeforeMount(async () => {
        // Init APP
        if (!store.isKeplrConnected) {
            await store.initApp()
        }

        // Hide loader
        loading.value = false
    })


    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
    })


    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
    })


    // Validate address
    function validateAddress(e, itemindex) {
        let address = data[itemindex].address,
            isStartsWith = address.startsWith(store.networks[store.currentNetwork].prefix)

        isStartsWith
            ? e.target.classList.remove('error')
            : e.target.classList.add('error')
    }


    // Set amount
    function setAmount(e, itemindex, coinIndex) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == data[itemindex].coins[coinIndex].denom)

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set amount
        if (parseFloat(e.target.value.replace(',', '.')) > (balance.amount - used)) {
            data[itemindex].coins[coinIndex].amount = (balance.amount - used).toString()
        }

        if (e.target.value < 0) {
            data[itemindex].coins[coinIndex].amount = ''
        }
    }


    // Set max. amount
    function setMaxAmount(itemindex, coinIndex) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == data[itemindex].coins[coinIndex].denom)

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set amount
        data[itemindex].coins[coinIndex].amount = (balance.amount - used).toString()
    }


    // Calc total used coins
    function calcTotalUsedCoins(itemindex, coinIndex) {
        let used = 0

        // Calc total used
        data.forEach((item, itemI) => {
            item.coins.forEach((coin, coinI) => {
                if (itemindex == itemI && coinIndex == coinI) {} else {
                    if (coin.amount.length) {
                        used += parseFloat(coin.amount)
                    }
                }
            })
        })

        return used
    }


    // Set denom
    function setDenom(itemindex, coinIndex, denom) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == denom)

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set data
        data[itemindex].coins[coinIndex].denom = denom
        data[itemindex].coins[coinIndex].amount = ''
        data[itemindex].coins[coinIndex].placeholder = (balance.amount - used)

        // Hide dropdown
        hideDropdown()
    }


    // Add items
    function addItems() {
        for (var i = 0; i < add_amount.value; i++) {
            data.push({
                address: '',
                coins: [{
                    amount: '',
                    denom: ''
                }]
            })
        }
    }


    // Delete item
    function deleteItem(itemindex) {
        data.splice(itemindex, 1)
    }


    // Add coin to item
    function addCoinToItem(itemindex) {
        data[itemindex].coins.push({
            amount: '',
            denom: ''
        })
    }


    // Delete coin in item
    function deleteCoinInItem(itemindex, coinIndex) {
        data[itemindex].coins.splice(coinIndex, 1)
    }


    // Show dropdown
    function showDropdown(e) {
        hideDropdown()

        e.target.classList.add('active')
    }


    // Hide dropdown
    function hideDropdown() {
        let inputs = document.querySelectorAll('.from .input')

        inputs.forEach(input => input.classList.remove('active'))
    }


    // Click outside dropdown
    function handleClickOutside(e) {
        if (!e.target.closest('.from')) {
            hideDropdown()
        }
    }


    // Submit form
    async function onSubmit() {
        // Set processing
        processing.value = true

        if (validateData()) {
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
                }]

                // Group inputs coins
                data.forEach(item => {
                    item.coins.forEach(coin => {
                        // Find denom duplicate
                        let duplicateDenom = inputs[0].coins.find(el => el.denom == coin.denom)

                        if (duplicateDenom) {
                            // Sum amount for one denom
                            duplicateDenom.amount = (parseFloat(duplicateDenom.amount) + parseFloat(coin.amount)).toString()
                        } else {
                            // Add new coin
                            inputs[0].coins.push({
                                amount: parseFloat(coin.amount).toString(),
                                denom: coin.denom
                            })
                        }
                    })
                })

                // Message
                let msgAny = {
                    typeUrl: '/cosmos.bank.v1beta1.MsgMultiSend',
                    value: {
                        inputs,
                        outputs: data
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
                    if (!store.isKeplrConnected) {
                        await store.initApp()
                    }
                } else {
                    // Show error
                    showError(error)
                }
            } catch (error) {
                console.error(error)

                // Show error
                showError(error)
            }
        } else {
            // Show notification
            notification.notify({
                group: 'default',
                clean: true
            })

            notification.notify({
                group: 'default',
                title: i18n.global.t('message.notification_failed_validate_title'),
                text: i18n.global.t('message.notification_failed_validate_desc'),
                type: 'error',
                data: {
                    chain: store.networks[store.currentNetwork].name
                }
            })
        }

        // Set processing
        processing.value = false
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


    // Validate data
    function validateData() {
        let result = true

        data.forEach(item => {
            // Check address inputs
            if (!item.address.length) {
                result = false

                return result
            }

            item.coins.forEach(coin => {
                // Check coins denom
                if (!coin.denom.length) {
                    result = false

                    return result
                }

                // Check coins amount
                if (!coin.amount.length || coin.amount == '0') {
                    result = false

                    return result
                }
            })
        })

        return result
    }
</script>


<style scoped>
    .loader_wrap
    {
        position: relative;

        padding: 40px;

        background: none;
    }


    .item
    {
        position: relative;

        padding-right: 52px;
    }

    .item + .item
    {
        margin-top: 20px;
        padding-top: 40px;

        border-top: 1px solid rgba(255,255,255,.1);
    }


    .item .columns
    {
        position: relative;

        padding-right: 52px;
        padding-left: 20%;
    }


    .add_btn,
    .delete_btn
    {
        position: absolute;
        top: 36px;
        right: 0;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 32px;
        height: 32px;
        margin-left: 20px;

        transition: .2s linear;

        border: 1px solid #950fff;
        border-radius: 50%;
    }

    .item + .item > .delete_btn
    {
        top: 76px;
    }

    .item .columns .delete_btn
    {
        border: none;
    }


    .add_btn svg,
    .delete_btn svg
    {
        display: block;

        width: 20px;
        height: 20px;
    }

    .add_btn svg
    {
        transform: rotate(45deg);
    }


    .add_btn:hover,
    .delete_btn:hover
    {
        background: #950fff;
    }
</style>