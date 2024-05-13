<template>
    <div class="page_head">
        <div class="page_title">
            {{ $t('message.multisend_page_title', { network : store.networks.multisend[store.currentNetwork].name }) }}
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
                        <input type="text" :value="formatTokenName(coin.denom)" class="input" @focus.self="showDropdown($event)">

                        <div class="arr">
                            <svg><use xlink:href="@/assets/sprite.svg#ic_arr_ver"></use></svg>
                        </div>

                        <div class="dropdown">
                            <div class="scroll">
                                <div v-for="(balance, balanceIndex) in store.balances" :key="balanceIndex">
                                    <button type="button" class="btn" @click.prevent="setDenom($event, itemIndex, coinIndex, balance.denom)">
                                        <div class="denom">
                                            {{ formatTokenName(balance.denom) }}
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
                                            <template v-if="balance.cost < 0.01">
                                            (&lt; 0.01$)
                                            </template>

                                            <template v-else>
                                            ({{ $filters.toFixed(balance.cost, 2) }}$)
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

            <button type="button" class="clear_btn" v-if="data.length > 5" @click.prevent="resetData()">
                {{ $t('message.btn_clear_all') }}
            </button>

            <label class="import_btn">
                <input type="file" name="import_file" accept=".csv" @change="importCSV($event)">
                <div>{{ $t('message.btn_import_csv') }}</div>
            </label>
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
    import { ref, onBeforeMount, onMounted, onBeforeUnmount, inject, watch, computed } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useNotification } from '@kyvg/vue3-notification'
    import { formatTokenAmount, formatTokenName } from '@/utils'
    import Papa from 'papaparse'

    // Components
    import Loader from '@/components/Loader.vue'
    import ChooseNetwork  from '@/components/multisend/ChooseNetwork.vue'
    import ConfirmModal  from '@/components/modal/MultisendConfirm.vue'


    const store = useGlobalStore(),
        i18n = inject('i18n'),
        notification = useNotification(),
        emitter = inject('emitter'),
        loading = ref(true),
        processing = ref(false),
        add_amount = ref(1),
        showConfirmModal = ref(false),
        data = ref([
            {
                address: '',
                coins: [{
                    amount: '',
                    denom: ''
                }]
            },
        ]),
        placeholders = ref([
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

        // Reset data
        resetData()

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


    // Reset data
    function resetData() {
        data.value = [{
            address: '',
            coins: [{
                amount: '',
                denom: ''
            }]
        }]

        placeholders.value = [{
            coins: [{
                placeholder: '0'
            }]
        }]
    }


    // Validate address
    function validateAddress(e, itemindex) {
        let address = data.value[itemindex].address,
            isStartsWith = address.startsWith(store.networks.multisend[store.currentNetwork].prefix)

        isStartsWith
            ? e.target.classList.remove('error')
            : e.target.classList.add('error')
    }


    // Set amount
    function setAmount(e, itemindex, coinIndex) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == data.value[itemindex].coins[coinIndex].denom)

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set amount
        if (parseFloat(e.target.value.replace(',', '.')) > formatTokenAmount(balance.amount - used, balance.base_denom)) {
            data.value[itemindex].coins[coinIndex].amount = (formatTokenAmount(balance.amount, balance.base_denom) - used).toString()
        }

        if (e.target.value < 0) {
            data.value[itemindex].coins[coinIndex].amount = ''
        }

        // Update placeholders
        updatePlaceholders()
    }


    // Set max. amount
    function setMaxAmount(itemindex, coinIndex) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == data.value[itemindex].coins[coinIndex].denom)

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set amount
        data.value[itemindex].coins[coinIndex].amount = (formatTokenAmount(balance.amount, balance.base_denom) - used).toString()

        // Update placeholders
        updatePlaceholders()
    }


    // Set denom
    function setDenom(e, itemindex, coinIndex, denom) {
        // Coin balance
        let balance = store.balances.find(el => el.denom == denom)

        // Set data
        data.value[itemindex].coins[coinIndex].denom = denom
        data.value[itemindex].coins[coinIndex].amount = ''

        // Calc total used coins
        let used = calcTotalUsedCoins(itemindex, coinIndex)

        // Set placeholder
        placeholders.value[itemindex].coins[coinIndex].placeholder = (formatTokenAmount(balance.amount, balance.base_denom) - used)

        // Hide dropdown
        hideDropdown()

        // Amount focus
        setTimeout(() => e.target.closest('.columns').querySelector('.amount .input').focus())
    }


    // Calc total used coins
    function calcTotalUsedCoins(itemindex, coinIndex) {
        let used = 0

        // Calc total used
        data.value.forEach((item, itemI) => {
            item.coins.forEach((coin, coinI) => {
                if (itemindex == itemI && coinIndex == coinI) { } else {
                    if (coin.denom == data.value[itemindex].coins[coinIndex].denom && coin.amount.length) {
                        used += parseFloat(coin.amount)
                    }
                }
            })
        })

        return used
    }


    // Update placeholders
    function updatePlaceholders() {
        placeholders.value.forEach((item, itemindex) => {
            item.coins.forEach((coin, coinIndex) => {
                // Coin balance
                let balance = store.balances.find(el => el.denom == data.value[itemindex].coins[coinIndex].denom)

                // Calc total used coins
                let used = calcTotalUsedCoins(itemindex, coinIndex)

                // Set placeholder
                placeholders.value[itemindex].coins[coinIndex].placeholder = (formatTokenAmount(balance.amount, balance.base_denom) - used)
            })
        })
    }


    // Add items
    function addItems() {
        for (var i = 0; i < add_amount.value; i++) {
            // Add item
            addItem()
        }
    }


    // Add item
    function addItem(item = null) {
        // Push data
        data.value.push({
            address: !item ? '' : item.Address,
            coins: [{
                amount: !item ? '' : item.Amount,
                denom: !item ? '' : item.Denom
            }]
        })

        // Push placeholder
        placeholders.value.push({
            coins: [{
                placeholder: '0'
            }]
        })
    }


    // Delete item
    function deleteItem(itemindex) {
        data.value.splice(itemindex, 1)
        placeholders.value.splice(itemindex, 1)
    }


    // Add coin to item
    function addCoinToItem(itemindex) {
        // Push data
        data.value[itemindex].coins.push({
            amount: '',
            denom: ''
        })

        // Push placeholder
        placeholders.value[itemindex].coins.push({
            placeholder: '0'
        })
    }


    // Delete coin in item
    function deleteCoinInItem(itemindex, coinIndex) {
        data.value[itemindex].coins.splice(coinIndex, 1)
        placeholders.value[itemindex].coins.splice(coinIndex, 1)
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
                    chain: store.networks.multisend[store.currentNetwork].name
                }
            })

            // Set processing
            processing.value = false
        }
    }


    // Validate data
    function validateData() {
        let result = true

        data.value.forEach(item => {
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


    // import CSV
    async function importCSV(event) {
        // Parse file
        await Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: result => {
                // Clear data
                data.value = []
                placeholders.value = []

                // Validate import data
                let validatedData = validateImportData(result.data)

                // Grouping
                let formattedData = groupingImportData(validatedData)

                // Generate data
                formattedData.forEach(el => {
                    let item = data.value.find(item => item.address === el.Address)

                    if (item) {
                        // Add coin to item
                        data.value[data.value.indexOf(item)].coins.push({
                            amount: el.Amount,
                            denom: el.Denom
                        })

                        // Push placeholder
                        placeholders.value[data.value.indexOf(item)].coins.push({
                            placeholder: '0'
                        })
                    } else {
                        // Add item
                        addItem(el)
                    }
                })

                // Update placeholders
                updatePlaceholders()
            }
        })
    }


    // Validate import data
    function validateImportData(importData) {
        importData.forEach((item, i) => {
            // Validate addresses
            if (!item.Address.length) {
                importData[i] = null
            } else {
                // Address prefix
                let isStartsWith = item.Address.startsWith(store.networks.multisend[store.currentNetwork].prefix)

                if (!isStartsWith) {
                    importData[i] = null
                }
            }


            // Validate denom
            if (!item.Denom.length) {
                importData[i] = null
            } else {
                // Availability on balance
                let availability = store.balances.find(balance => balance.denom == item.Denom)

                if (!availability) {
                    importData[i] = null
                }
            }


            // Validate amount
            if (parseFloat(item.Amount) <= 0) {
                importData[i] = null
            }
        })


        // Show error message
        if (importData.includes(null)) {
            // Show notification
            notification.notify({
                group: 'default',
                clean: true
            })

            notification.notify({
                group: 'default',
                title: i18n.global.t('message.notification_importCSV_title'),
                text: i18n.global.t('message.notification_importCSV_desc'),
                type: 'error',
                data: {
                    chain: store.networks.multisend[store.currentNetwork].name
                }
            })
        }


        return importData.filter(item => item !== null)
    }


    // Grouping import data
    function groupingImportData(importData) {
        let result = importData.reduce((acc, obj) => {
            let key = obj.Address + '-' + obj.Denom

            if (!acc[key]) {
                acc[key] = {
                    Address: obj.Address,
                    Denom: obj.Denom,
                    Amount: 0
                }
            }

            acc[key].Amount += parseFloat(obj.Amount)

            return acc
        }, {})

        return Object.values(result)
    }


    // Event "updateBalances"
    emitter.on('updateBalances', async () => {
        // Show loader
        loading.value = true

        // Reinit APP
        await store.initApp()

        // Hide loader
        loading.value = false
    })


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

        border-top: 1px solid rgba(255,255,255,.2);
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



    .clear_btn
    {
        font-weight: 500;
        line-height: 19px;

        display: block;

        height: 55px;
        margin-left: 40px;
        padding: 9px 23px;

        transition: .2s linear;

        color: #f81c41;
        border: 1px solid #f81c41;
        border-radius: 14px;
    }


    .clear_btn:hover
    {
        color: #fff;
        background: #f81c41;
    }



    .import_btn
    {
        display: block;

        margin-left: auto;

        cursor: pointer;
    }


    .import_btn input
    {
        display: none;
    }


    .import_btn div
    {
        font-weight: 500;
        line-height: 19px;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        height: 55px;
        padding: 9px 23px;

        transition: .2s linear;
        text-align: center;

        border: 1px solid #950fff;
        border-radius: 14px;
    }


    .import_btn:hover div
    {
        background: #950fff;
    }
</style>