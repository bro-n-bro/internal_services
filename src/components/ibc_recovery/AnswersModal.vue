<template>
    <section class="modal" id="manage_modal">
        <div class="modal_content">
            <div class="data">
                <div class="modal_title">
                    {{ $t('message.ibc_recovery_modal_title') }}
                </div>

                <pre class="list" v-if="wsMessages.length"><div v-for="(message, index) in wsMessages" :key="index">{{ message }}</div></pre>

                <div class="processing" v-if="processing">
                    {{ $t('message.ibc_recovery_modal_processing') }}<span></span>
                </div>

                <button class="btn" v-else @click.self="emitter.emit('closeIBCRecoveryAnswersModal')">
                    {{ $t('message.btn_close') }}
                </button>
            </div>
        </div>

        <div class="overlay"></div>
    </section>
</template>


<script setup>
    import { inject, onBeforeMount, ref } from 'vue'
    import { useGlobalStore } from '@/stores'


    const store = useGlobalStore(),
        emitter = inject('emitter'),
        processing = ref(true),
        wsMessages = ref([])


    onBeforeMount(async () => {
        // Reset data
        wsMessages.value = []

        // Get messages
        store.socket.onmessage = e => {
            wsMessages.value.push(JSON.parse(e.data))

            // Finished status
            if (JSON.parse(e.data) === 'FINISHED') {
                processing.value = false
            }
        }
    })
</script>


<style scoped>
    .data
    {
        padding-top: 40px;
        padding-bottom: 40px;
    }



    pre
    {
        font-size: 14px;

        padding: 9px 19px;

        white-space: pre-wrap;

        color: #fff;
        border: 2px solid #c986ff;
        border-radius: 20px;
        background: #131313;
    }

    pre > * + *
    {
        margin-top: 8px;
    }


    .processing
    {
        font-size: 20px;
        font-weight: 600;
        line-height: 48px;

        width: 170px;
        max-width: 100%;
        height: 52px;
        margin-top: 20px;
        margin-left: auto;

        text-align: center;

        color: rgba(255, 255, 255, .2);
        border: 2px solid #762cb9;
        border-radius: 14px;
        background: linear-gradient(329deg, rgba(118, 44, 185, .40) -28.05%, rgba(132, 37, 218, .40) 32.19%, rgba(185, 107, 255, .40) 90.69%);
    }


    @keyframes dots
    {
        0%
        {
            content: '';
        }
        25%
        {
            content: '.';
        }
        50%
        {
            content: '..';
        }
        75%
        {
            content: '...';
        }
        100%
        {
            content: '';
        }
    }


    .processing span
    {
        display: inline-block;

        width: 16px;

        text-align: left;
        vertical-align: top;
    }


    .processing span:after
    {
        content: '';
        animation: dots 1.5s steps(4, end) infinite;
    }


    .btn
    {
        font-size: 20px;
        font-weight: 600;
        line-height: 48px;

        display: block;

        width: 100%;
        height: 52px;
        margin-top: 20px;

        color: #fff;
        border: 2px solid #762cb9;
        border-radius: 14px;
        background: linear-gradient(329deg, rgba(118, 44, 185, .40) -28.05%, rgba(132, 37, 218, .40) 32.19%, rgba(185, 107, 255, .40) 90.69%);
    }


    .btn:hover
    {
        border: none;
        background: linear-gradient(329deg, #762cb9 -28.05%, #8425da 32.19%, #b96bff 90.69%);
    }

</style>