<template>
    <section class="modal" id="upload_modal">
        <div class="modal_content">
            <div class="data">
                <button class="close_btn" @click.prevent="emitter.emit('closeMultisendUploadModal', { status: false })">
                    <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_close"></use></svg>
                </button>

                <div class="modal_title">
                    {{ $t('message.upload_modal_title') }}
                </div>

                <div class="drag_drop" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop.prevent="handleFileDrop">
                    <div>{{ $t('message.upload_drag_label') }}</div>

                    <label class="btn">
                        <input type="file" name="import_file" accept=".csv" @change="handleFileChange">

                        <svg class="icon"><use xlink:href="@/assets/sprite.svg#ic_file"></use></svg>

                        <span>{{ $t('message.btn_attach') }}</span>
                    </label>
                </div>

                <div class="sample">
                    <a href="/import_sample.csv" download>
                        {{ $t('message.upluad_example_link') }}
                    </a>
                </div>

                <button class="upload_btn" @click.prevent="uploadFile" :disabled="!file">
                    {{ $t('message.btn_upload') }}
                </button>
            </div>
        </div>

        <div class="overlay"></div>
    </section>
</template>


<script setup>
    import { ref, inject } from 'vue'


    const emitter = inject('emitter'),
        file = ref(null)


    // Handle drag over
    function handleDragOver(event) {
        event.currentTarget.classList.add('drag-over')
    }


    // Handle drag leave
    function handleDragLeave(event) {
        event.currentTarget.classList.remove('drag-over')
    }


    // Handle file change
    function handleFileChange(event) {
        if (event.target.files.length) {
            // Set file
            file.value = event.target.files[0]
        }
    }


    // Handle file drop
    function handleFileDrop(event) {
        if (event.dataTransfer.files.length) {
            // Set file
            file.value = event.dataTransfer.files[0]
        }
    }


    // Upload file
    function uploadFile() {
        if (file.value) {
            // File reader
            const reader = new FileReader()

            // Send file content
            reader.onload = e => emitter.emit('importFile', e.target.result)

            // Error reading file
            reader.onerror = error => console.error('Error reading file:', error)

            // Read as text
            reader.readAsText(file.value)
        }
    }
</script>


<style scoped>
    .data
    {
        width: 650px;
        padding-right: 20px;
        padding-bottom: 26px;
        padding-left: 20px;
    }


    .modal_title
    {
        margin-bottom: 13px;
        padding: 0 20px;
    }


    .drag_drop
    {
        font-size: 24px;
        font-weight: 600;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        padding: 4px 4px 4px 19px;

        cursor: move;
        cursor: grab;

        color: #8425da;
        border: 1px dashed #8425da;
        border-radius: 30px;
        background: #390469;
    }


    .drag_drop .btn
    {
        font-size: 24px;
        font-weight: 600;

        display: flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        padding: 6px 14px;

        cursor: pointer;

        color: #fff;
        border-radius: 31px;
        background: #8425da;
    }


    .drag_drop .btn input
    {
        display: none;
    }


    .drag_drop .btn .icon
    {
        display: block;

        width: 21px;
        height: 21px;
        margin-right: 10px;
    }


    .sample
    {
        font-size: 20px;
        font-weight: 300;

        margin-top: 4px;
        padding: 0 24px;
    }


    .sample a
    {
        text-decoration: none;

        color: currentColor;
    }


    .upload_btn
    {
        font-size: 20px;
        font-weight: 600;
        line-height: 110%;

        display: block;

        width: 170px;
        height: 52px;
        margin-top: 20px;
        margin-left: auto;
        padding: 8px 10px;

        border: 2px solid #762cb9;
        border-radius: 14px;
        background: linear-gradient(329deg, #762cb9 -28.05%, #8425da 32.19%, #b96bff 90.69%);
    }


    .upload_btn:hover
    {
        color: #8425da;
        background: #fff;
    }


    .upload_btn:disabled
    {
        pointer-events: none;

        opacity: .5;
    }
</style>