<template>
    <section class="modal" id="manage_modal">
        <div class="modal_content">
            <div class="data">
                <div class="title">
                    {{ $t('message.ibs_modal_title') }}
                </div>

                <div class="list">
                    <div v-for="(message, index) in wsMessages" :key="index">
                        {{ message }}
                    </div>
                </div>

                <div class="processing" v-if="processing">
                    {{ $t('message.ibs_modal_processing') }}
                </div>

                <button class="btn" v-else @click.self="emitter.emit('closeIBSAnswersModal')">
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
        processing = ref(true)

    var wsMessages = ref([])


    onBeforeMount(async () => {
        // Reset data
        wsMessages = ref([])

        // Get messages
        store.socket.onmessage = e => {
            wsMessages.value.push(e.data)

            // Finished status
            if (e.data === 'FINISHED') {
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


    .title
    {
        font-size: 30px;
        font-weight: 600;
        line-height: calc(100% + 6px);

        margin-bottom: 28px;

        text-align: center;
    }



    .list
    {
        font-size: 15px;

        text-align: center;
    }


    .list > * + *
    {
        margin-top: 20px;
    }



    .processing
    {
        font-size: 22px;
        font-weight: 600;
        line-height: calc(100% + 6px);

        margin-top: 28px;

        animation: pulse 3s infinite;
        text-align: center;

        color: #950fff;
    }


    @keyframes pulse
    {
        0%
        {
            transform: scale(1);

            opacity: 1;
        }

        50%
        {
            transform: scale(.8);

            opacity: .5;
        }

        100%
        {
            transform: scale(1);

            opacity: 1;
        }
    }


    .btn
    {
        font-weight: 500;
        line-height: 19px;

        display: block;

        width: 100%;
        height: 48px;
        margin-top: 28px;
        padding: 10px;

        transition: .2s linear;

        color: #fff;
        border-radius: 14px;
        background: #950fff;
    }


    .btn:hover
    {
        background: #7700e1;
    }
</style>