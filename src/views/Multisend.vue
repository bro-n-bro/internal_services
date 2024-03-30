<template>
    <div class="page_head">
        <div class="page_title">
            {{ $t('message.multisend_page_title', { network : store.networks[store.currentNetwork].name }) }}
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
                        <input type="text" :value="formatTokenName(getBestDenom(coin.denom))" class="input" @focus.self="showDropdown($event)">

                        <div class="arr">
                            <svg><use xlink:href="@/assets/sprite.svg#ic_arr_ver"></use></svg>
                        </div>

                        <div class="dropdown">
                            <div class="scroll">
                                <div v-for="(balance, balanceIndex) in store.balances" :key="balanceIndex">
                                    <button type="button" class="btn" @click.prevent="setDenom($event, itemIndex, coinIndex, balance.denom)">
                                        <div class="denom">
                                            {{ formatTokenName(balance.best_denom) }}
                                        </div>

                                        <div class="amount">
                                            <template v-if="formatTokenAmount(balance.amount, balance.base_denom) < 0.01">
                                            &lt; 0.01
                                            </template>

                                            <template v-else>
                                            {{ $filters.toFixed(formatTokenAmount(balance.amount, balance.base_denom), 2) }}
                                            </template>
                                        </div>

                                        <div class="price">
                                            <template v-if="formatTokenAmount(balance.amount, balance.base_denom) * getPriceByDenom(balance.best_denom) < 0.01">
                                            (&lt; 0.01$)
                                            </template>

                                            <template v-else>
                                            ({{ $filters.toFixed(formatTokenAmount(balance.amount, balance.base_denom) * getPriceByDenom(balance.best_denom), 2) }}$)
                                            </template>
                                        </div>
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
                        <input type="text" v-model="coin.amount" class="input" @input="setAmount($event, itemIndex, coinIndex)" :placeholder="placeholders[itemIndex].coins[coinIndex].placeholder" :disabled="!coin.denom.length">

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


    <!-- Confirm modal-->
    <ConfirmModal :data v-if="showConfirmModal" />
</template>


<script setup>
    import { reactive, ref, onBeforeMount, onMounted, onBeforeUnmount, inject, watch, computed } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useNotification } from '@kyvg/vue3-notification'
    import { getBestDenom, formatTokenAmount, formatTokenName, getPriceByDenom } from '@/utils'

    // Components
    import Loader from '@/components/Loader.vue'
    import ChooseNetwork  from '@/components/ChooseNetwork.vue'
    import ConfirmModal  from '@/components/modal/MultisendConfirm.vue'


    const store = useGlobalStore(),
        i18n = inject('i18n'),
        notification = useNotification(),
        emitter = inject('emitter'),
        loading = ref(true),
        processing = ref(false),
        add_amount = ref(1),
        showConfirmModal = ref(false)

    var data = reactive([
        {
            address: '',
            coins: [{
                amount: '',
                denom: ''
            }]
        },
    ]),
    placeholders = reactive([
        {
            coins: [{
                placeholder: '0'
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


    watch(computed(() => store.currentNetwork), async () => {
        // Show loader
        loading.value = true

        // Clear data
        data = reactive([
            {
                address: '',
                coins: [{
                    amount: '',
                    denom: ''
                }]
            },
        ])

        placeholders = reactive([
            {
                coins: [{
                    placeholder: '0'
                }]
            },
        ])

        // Reinit APP
        await store.initApp()

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
        if (parseFloat(e.target.value.replace(',', '.')) > formatTokenAmount((balance.amount - used), balance.base_denom)) {
            data[itemindex].coins[coinIndex].amount = (formatTokenAmount(balance.amount, balance.base_denom) - used).toString()
        }

        if (e.target.value < 0) {
            data[itemindex].coins[coinIndex].amount = ''
        }

        // Update placeholders
        updatePlaceholders()
    }


    // Set max. amount
    function setMaxAmount(itemindex, coinIndex) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == data[itemindex].coins[coinIndex].denom)

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set amount
        data[itemindex].coins[coinIndex].amount = (formatTokenAmount(balance.amount, balance.base_denom) - used).toString()

        // Update placeholders
        updatePlaceholders()
    }


    // Set denom
    function setDenom(e, itemindex, coinIndex, denom) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == denom)

        // Set data
        data[itemindex].coins[coinIndex].denom = denom
        data[itemindex].coins[coinIndex].amount = ''

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set placeholder
        placeholders[itemindex].coins[coinIndex].placeholder = formatTokenAmount(balance.amount, balance.base_denom) - used

        // Hide dropdown
        hideDropdown()

        // Amount focus
        setTimeout(() => e.target.closest('.columns').querySelector('.amount .input').focus())
    }


    // Calc total used coins
    function calcTotalUsedCoins(itemindex, coinIndex) {
        let used = 0

        // Calc total used
        data.forEach((item, itemI) => {
            item.coins.forEach((coin, coinI) => {
                if (itemindex == itemI && coinIndex == coinI) { } else {
                    if (coin.denom == data[itemindex].coins[coinIndex].denom && coin.amount.length) {
                        used += parseFloat(coin.amount)
                    }
                }
            })
        })

        return used
    }


    // Update placeholders
    function updatePlaceholders() {
        placeholders.forEach((item, itemindex) => {
            item.coins.forEach((coin, coinIndex) => {
                // Coin balance
                let balance = store.balances.find(el => el.denom == data[itemindex].coins[coinIndex].denom)

                // Calc total used coins
                let used = calcTotalUsedCoins(itemindex, coinIndex)

                // Set placeholder
                placeholders[itemindex].coins[coinIndex].placeholder = formatTokenAmount(balance.amount, balance.base_denom) - used
            })
        })
    }


    // Add items
    function addItems() {
        for (var i = 0; i < add_amount.value; i++) {
            // Push data
            data.push({
                address: '',
                coins: [{
                    amount: '',
                    denom: ''
                }]
            })

            // Push placeholder
            placeholders.push({
                coins: [{
                    placeholder: '0'
                }]
            })
        }
    }


    // Delete item
    function deleteItem(itemindex) {
        data.splice(itemindex, 1)
        placeholders.splice(itemindex, 1)
    }


    // Add coin to item
    function addCoinToItem(itemindex) {
        // Push data
        data[itemindex].coins.push({
            amount: '',
            denom: ''
        })

        // Push placeholder
        placeholders[itemindex].coins.push({
            placeholder: '0'
        })
    }


    // Delete coin in item
    function deleteCoinInItem(itemindex, coinIndex) {
        data[itemindex].coins.splice(coinIndex, 1)
        placeholders[itemindex].coins.splice(coinIndex, 1)
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
    function onSubmit() {
        // Set processing
        processing.value = true

        if (validateData()) {
            // Show confirm modal
            showConfirmModal.value = true
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

            // Set processing
            processing.value = false
        }
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


    // Event "closeMultisendConfirmModal"
    emitter.on('closeMultisendConfirmModal', ({ status }) => {
        // Show confirm modal
        showConfirmModal.value = false

        // Set processing
        processing.value = status
    })
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

        border-top: 1px dashed rgba(255,255,255,.2);
    }


    .item .columns
    {
        position: relative;

        padding-right: 52px;
        padding-left: 20%;
    }


    .item .columns:before
    {
        position: absolute;
        top: -20px;
        left: 68px;

        display: block;

        width: 104px;
        height: 74px;

        content: '';
        pointer-events: none;

        border-bottom: 1px dashed rgba(255, 255, 255, .2);
        border-left: 1px dashed rgba(255, 255, 255, .2);
    }

    .item .columns + .columns:before
    {
        top: -46px;

        height: 100px;
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