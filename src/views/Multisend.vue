<template>
    <Loader v-if="loading" />

    <form v-else action="" class="form" :class="{ processing: processing }" @submit.prevent="onSubmit()">
        <div class="head">
            <button type="button" class="import_btn" @click.prevent="showUploadModal = !showUploadModal">
                {{ $t('message.btn_import_csv') }}
            </button>

            <!-- <label class="import_btn">
                <input type="file" name="import_file" accept=".csv" @change="importCSV($event)">
                <div>{{ $t('message.btn_import_csv') }}</div>
            </label> -->
        </div>

        <div class="item" v-for="(item, itemIndex) in data" :key="itemIndex">
            <button type="button" class="delete_btn" v-if="itemIndex" @click="deleteItem(itemIndex)">
                <img src="@/assets/ic_remove.svg" alt="">
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
                <div class="connection"></div>

                <div class="line from">
                    <div class="label grey">
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
                    <div class="label grey">
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
                    <img src="@/assets/ic_plus.svg" alt="">
                </button>

                <button type="button" class="delete_btn" v-if="coinIndex" @click="deleteCoinInItem(itemIndex, coinIndex)">
                    <img src="@/assets/ic_delete.svg" alt="">
                </button>
            </div>
        </div>


        <div class="line add_items">
            <button type="button" class="btn" @click="addItem()">
                {{ $t('message.btn_add') }}
            </button>

            <button type="button" class="clear_btn" v-if="data.length > 5" @click.prevent="resetData()">
                <span>{{ $t('message.btn_clear_all') }}</span>

                <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_trash"></use></svg>
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

    <!-- Upload modal-->
    <UploadModal :data v-if="showUploadModal" />
</template>


<script setup>
    import { ref, onBeforeMount, onMounted, onBeforeUnmount, inject, watch, computed } from 'vue'
    import { useGlobalStore } from '@/stores'
    import { useNotification } from '@kyvg/vue3-notification'
    import { useRoute } from 'vue-router'
    import { formatTokenAmount, formatTokenName } from '@/utils'
    import Papa from 'papaparse'

    // Components
    import Loader from '@/components/Loader.vue'
    import ConfirmModal  from '@/components/modal/MultisendConfirm.vue'
    import UploadModal  from '@/components/modal/MultisendUpload.vue'


    const store = useGlobalStore(),
        i18n = inject('i18n'),
        notification = useNotification(),
        emitter = inject('emitter'),
        route = useRoute(),
        loading = ref(true),
        processing = ref(false),
        showConfirmModal = ref(false),
        showUploadModal = ref(false),
        data = ref([
            {
                address: '',
                coins: [{
                    amount: '',
                    denom: ''
                }]
            }
        ]),
        placeholders = ref([
            {
                coins: [{
                    placeholder: '0'
                }]
            }
        ])


    onBeforeMount(async () => {
        // Set current service
        store.currentService = route.name

        // Set current multisend network
        store.multisendCurrentNetwork = route.params.network

        // Init APP
        await store.initApp(store.multisendCurrentNetwork)

        // Hide loader
        loading.value = false
    })


    watch(computed(() => route.params.network), async () => {
        // Show loader
        loading.value = true

        // Reset data
        resetData()

        // Set current multisend network
        store.multisendCurrentNetwork = route.params.network

        // Reinit APP
        await store.initApp(store.multisendCurrentNetwork)

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


    // Import CSV
    function importCSV(fileContent) {
        // Parse file
        Papa.parse(fileContent, {
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

                // Hide upload modal
                showUploadModal.value = false
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
                let isStartsWith = item.Address.startsWith(store.networks.multisend[store.multisendCurrentNetwork].prefix)

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
                    chain: store.networks.multisend[store.multisendCurrentNetwork].name
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


    // Event "importFile"
    emitter.on('importFile', fileContent => {
        // Import CSV
        importCSV(fileContent)
    })


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


    // Event "closeMultisendUploadModal"
    emitter.on('closeMultisendUploadModal', () => {
        // Show confirm modal
        showUploadModal.value = false
    })
</script>


<style scoped>
    .loader_wrap
    {
        position: relative;

        width: 780px;
        max-width: 100%;
        padding: 40px;

        background: none;
    }


    .form
    {
        position: relative;
        z-index: 3;

        width: 780px;
        max-width: 100%;

        border-radius: 30px;
    }


    .form:before
    {
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;

        display: block;

        width: 100%;
        height: 100%;

        content: '';

        opacity: .7;
        border: 1px solid #915cd4;
        border-radius: inherit;
        background: radial-gradient(82.21% 105.43% at 50% 13.3%, rgba(71, 26, 146, .70) 0%, rgba(35, 6, 83, .70) 63.74%, rgba(0, 0, 0, .70) 100%), linear-gradient(132deg, #8f00b0 -12.79%, #570099 45.8%, #1b0044 99.42%);

                backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
    }


    .head
    {
        position: relative;
        position: relative;
        z-index: 3;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-start;

        padding: 20px 30px 10px;
    }


    .head:after
    {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;

        display: block;

        width: 100%;
        height: 1px;
        margin: 0 auto;

        content: '';

        background: linear-gradient(to right,  rgba(255,255,255,0) 0%,rgba(250,195,255,.63) 50%,rgba(255,255,255,0) 100%);
    }


    .import_btn
    {
        font-size: 20px;
        font-weight: 600;

        display: block;

        margin-left: auto;

        background: linear-gradient(135deg,  #d57cff 0%,#520c97 100%);
        -webkit-background-clip: text;
                background-clip: text;

        -webkit-text-fill-color: transparent;
    }


    .item
    {
        position: relative;

        padding: 20px 30px;
    }

    .item + .item
    {
        padding-top: 0;
        padding-right: 92px;
    }


    .item + .item > .delete_btn
    {
        top: 26px;
        right: 30px;
    }

    .item + .item > .delete_btn img
    {
        width: 32px;
        height: 32px;
    }


    .item .columns
    {
        position: relative;

        padding-right: 62px;
        padding-left: 84px;
    }


    .item .connection
    {
        position: absolute;
        bottom: 46px;
        left: 22px;

        display: block;

        width: 62px;
        height: 71px;

        content: '';
        pointer-events: none;

        border-bottom: 1px dashed #8425da;
        border-left: 1px dashed #8425da;
    }


    .item .connection:before,
    .item .connection:after
    {
        position: absolute;
        z-index: 1;
        right: -2px;
        bottom: -3px;

        display: block;

        width: 5px;
        height: 5px;

        content: '';
        pointer-events: none;

        border-radius: 50px;
        background: #8425da;
    }

    .item .connection:before
    {
        top: -1px;
        right: auto;
        bottom: auto;
        left: -3px;
    }


    .item .columns + .columns .connection
    {
        height: 98px;
    }


    .add_items
    {
        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: space-between;

        padding: 0 30px;
    }


    .add_items .btn
    {
        font-size: 20px;
        font-weight: 600;
        line-height: 100%;

        display: block;

        width: 100%;
        height: 52px;

        color: #8425da;
        border: 2px solid #762cb9;
        border-radius: 14px;
    }


    .add_btn,
    .delete_btn
    {
        position: absolute;
        top: 26px;
        right: 0;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 48px;
        height: 48px;
    }


    .add_btn img,
    .delete_btn img
    {
        display: block;

        width: 32px;
        height: 32px;
    }

    .delete_btn img
    {
        width: 16px;
        height: 16px;
    }



    .clear_btn
    {
        font-size: 20px;
        font-weight: 600;
        line-height: 100%;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 158px;
        min-width: 158px;
        height: 52px;
        margin-left: 22px;

        transition: .2s linear;
        white-space: nowrap;

        color: #470072;
        border: 1px solid #762cb9;
        border-radius: 14px;
        background: linear-gradient(329deg, #762cb9 -28.05%, #8425da 32.19%, #b96bff 90.69%);
    }


    .clear_btn .icon
    {
        display: block;

        width: 20px;
        height: 20px;
        margin-left: 8px;
    }


    .clear_btn:hover
    {
        color: #8425da;
        background: #fff;
    }

</style>