<template>
    <div class="page_head">
        <div class="page_title">
            {{ $t('message.ibs_page_title') }}
        </div>

        <!-- Choose network -->
        <ChooseNetwork />
    </div>


    <div class="row">
        <div class="section">
            <div class="title">Some title</div>

            <div class="choose_action">
                <button class="btn" @click.prevent="showDropdown($event)">
                    <span v-if="!action1.length">Choose action</span>
                    <span v-else>{{ action1 }}</span>

                    <div class="arr">
                        <svg><use xlink:href="@/assets/sprite.svg#ic_arr_ver"></use></svg>
                    </div>
                </button>


                <div class="dropdown">
                    <div class="scroll">
                        <button class="btn" @click.prevent="setAction1('Update client')">
                            Update client
                        </button>

                        <button class="btn" @click.prevent="setAction1('Clear packets')">
                            Clear packets
                        </button>

                        <button class="btn" @click.prevent="setAction1('Packet pending')">
                            Packet pending
                        </button>
                    </div>
                </div>
            </div>


            <button class="execute_btn" :disabled="!action1.length">
                {{ $t('message.btn_execute') }}
            </button>
        </div>


        <div class="section">
            <div class="title">Some title</div>

            <div class="choose_action">
                <button class="btn" @click.prevent="showDropdown($event)">
                    <span v-if="!action2.length">Choose action</span>
                    <span v-else>{{ action2 }}</span>

                    <div class="arr">
                        <svg><use xlink:href="@/assets/sprite.svg#ic_arr_ver"></use></svg>
                    </div>
                </button>


                <div class="dropdown">
                    <div class="scroll">
                        <button class="btn" @click.prevent="setAction2('Update client')">
                            Update client
                        </button>

                        <button class="btn" @click.prevent="setAction2('Clear packets')">
                            Clear packets
                        </button>

                        <button class="btn" @click.prevent="setAction2('Packet pending')">
                            Packet pending
                        </button>
                    </div>
                </div>
            </div>


            <button class="execute_btn" :disabled="!action2.length">
                {{ $t('message.btn_execute') }}
            </button>
        </div>
    </div>
</template>


<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'

    // Components
    import ChooseNetwork  from '@/components/ChooseNetwork.vue'


    const action1 = ref(''),
        action2 = ref('')


    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
    })


    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
    })


    // Set action1
    function setAction1(value) {
        // Set value
        action1.value = value

        // Hide dropdown
        hideDropdown()
    }


    // Set action2
    function setAction2(value) {
        // Set value
        action2.value = value

        // Hide dropdown
        hideDropdown()
    }


    // Show dropdown
    function showDropdown(e) {
        hideDropdown()

        e.target.classList.add('active')
    }


    // Hide dropdown
    function hideDropdown() {
        let inputs = document.querySelectorAll('.choose_action > .btn')

        inputs.forEach(input => input.classList.remove('active'))
    }


    // Click outside dropdown
    function handleClickOutside(e) {
        if (!e.target.closest('.choose_action')) {
            hideDropdown()
        }
    }
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


    .choose_action
    {
        position: relative;
    }


    .choose_action > .btn
    {
        font-weight: 500;

        position: relative;

        display: block;

        width: 100%;
        height: 52px;
        padding: 0 9px 2px;

        text-align: left;

        border: 1px solid #191919;
        border-radius: 12px;
        background: #191919;
    }


    .choose_action > .btn > *
    {
        pointer-events: none;
    }


    .choose_action .arr
    {
        position: absolute;
        z-index: 3;
        top: 0;
        right: 19px;
        bottom: 0;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        width: 24px;
        height: 24px;
        margin: auto;

        pointer-events: none;
    }

    .choose_action .arr svg
    {
        display: block;

        width: 20px;
        height: 20px;
    }


    .dropdown
    {
        position: absolute;
        z-index: 5;
        top: 100%;
        left: 0;

        display: none;

        width: 100%;
        margin-top: 4px;
        padding: 6px 4px;

        border-radius: 10px;
        background: #101010;
    }

    .btn.active + .dropdown
    {
        display: block;
    }


    .dropdown .scroll
    {
        overflow: auto;

        max-height: 194px;
        padding-right: 4px;
    }

    .dropdown .scroll::-webkit-scrollbar
    {
        width: 4px;
        height: 4px;

        border-radius: 5px;
    }

    .dropdown .scroll > * + *
    {
        margin-top: 4px;
    }


    .dropdown .btn
    {
        font-size: 14px;
        line-height: 17px;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: space-between;

        width: 100%;
        padding: 6px;

        transition: background .2s linear;
        text-align: left;
        white-space: nowrap;
        pointer-events: auto;

        border-radius: 8px;
    }


    .dropdown .btn:hover,
    .dropdown .btn.active
    {
        background: #191919;
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