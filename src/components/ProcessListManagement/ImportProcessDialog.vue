<template>
    <div>
        <input ref="fileInput" type="file" name="file" accept=".json" style="display: none" multiple @change="getNewFiles" />
        <div class="head">
            <div class="name">{{ $t('exportMfpProcess.processFile') }}</div>
            <div style="display: none" ref="controlBtn">
                <f-button variant="primary-outline" @click="confirmVisible = true" :disabled="isActive"> <i class="fal fa-trash-alt"></i>{{ $t('exportMfpProcess.clearFiles') }} </f-button>
                <f-button variant="primary-outline" @click="triggerFileInput"><i class="fal fa-file-upload"></i>{{ $t('exportMfpProcess.selectFile') }}</f-button>
            </div>
        </div>
        <div class="list">
            <div class="dropZone" v-show="fileList.length == 0" :class="[dragging ? 'dropZone-over' : '']" @dragestart="dragging = true" @dragenter="dragging = true" @dragleave="dragging = false">
                <div class="image">
                    <img :src="`${publicPath}img/background/workingBlock_short.png`" />
                </div>
                <div class="text">
                    {{ $t('exportMfpProcess.click') }}
                    <div class="select" @click="triggerFileInput">「{{ $t('exportMfpProcess.selectFile') }}」</div>
                    {{ $t('exportMfpProcess.drag') }}
                </div>
                <f-button variant="primary" class="plus-wrap" size="large" @click="triggerFileInput"><i class="fal fa-plus"></i>{{ $t('exportMfpProcess.selectFile') }}</f-button>
                <input ref="fileDrop" type="file" accept=".json" multiple title="" @change="dropFilesInto" />
            </div>
            <div v-show="fileList.length > 0">
                <div class="files">
                    <template v-for="(file, index) in fileList" :key="index">
                        <div class="fileRow" :class="fiieSelectedRow == index ? 'fiieRow-select' : ''" @mouseover="fiieSelectedRow = index" @mouseleave="fiieSelectedRow = -1">
                            <div class="left">
                                <div class="icon"><i class="fal fa-paperclip"></i></div>
                                {{ file.name }}
                            </div>
                            <div class="right">
                                <div v-show="fiieSelectedRow == index" class="icon" @click="clearSelectFile(index)"><i class="fal fa-trash-alt"></i></div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="desc">
            <f-alert variant="info" :message="$t('exportMfpProcess.importProcessTitle') + '' + $t('exportMfpProcess.dialogDesc')"></f-alert>
        </div>
    </div>
    <teleport to="#portal-target">
        <f-confirm v-model:visible="confirmVisible" title="警告" variant="warning" @ok="submitClearAllFiles">
            <template #content>
                <p class="text-center" style="white-space: pre-line">{{ $t('exportMfpProcess.submitMessage.confirmClearProFiles') }}</p>
            </template>
        </f-confirm>
    </teleport>
</template>
<script>
import FlButton from '@/components/Basic/FlButton.vue';
import FlModalMessage from '@/components/Basic/FlModalMessage.vue';

export default {
    name: 'ImportProcessDialog',
    components: { FlButton, FlModalMessage },
    props: {
        modalData: {
            type: Object,
        },
    },
    data: function () {
        const that = this;
        return {
            publicPath: process.env.BASE_URL,
            fileList: [],
            fiieSelectedRow: -1,
            dragging: false,
            content: {},
            isActive: true,
            confirmColor: 'warning',
            confirmVisible: false,
        };
    },
    emits: ['updateValidStatus', 'update'],
    created() {},
    methods: {
        triggerFileInput() {
            const that = this;
            that.$refs.fileInput.value = null;
            that.$refs.fileInput.click();
        },
        getNewFiles() {
            const that = this;
            if (!that.$refs.fileInput.files) {
                return;
            }
            that.addFiles(that.$refs.fileInput.files);
        },
        submitClearAllFiles() {
            const that = this;
            that.clearAllFiles();
        },
        clearAllFiles() {
            const that = this;
            that.fileList = [];
            that.$message.success(that.$t('exportMfpProcess.submitMessage.clearProFiles'));
            that.onValueUpdate();
        },
        clearSelectFile(index) {
            const that = this;
            that.fileList.splice(index, 1);
            that.$message.success(that.$t('exportMfpProcess.submitMessage.haveDeleted'));
            if (that.fileList.length < 1) {
                that.$refs.controlBtn.style.display = 'none';
            }
            that.onValueUpdate();
        },
        dropFilesInto(e) {
            const that = this;
            const files = e.target.files || e.dataTransfer.files;
            if (!files) {
                return;
            }
            that.addFiles(files);
            that.$refs.fileDrop.value = null;
            that.dragging = false;
        },
        addFiles(fileList) {
            const that = this;
            let filteredFiles = [];
            filteredFiles = [...fileList];
            filteredFiles = filteredFiles.filter((file) => file.name.endsWith('.json'));
            const isUploadFormatError = fileList.length != filteredFiles.length;
            that.fileList = [...that.fileList, ...filteredFiles];
            if (isUploadFormatError) {
                that.$message.error(that.$t('exportMfpProcess.submitMessage.addFilesFormatError'));
            } else {
                that.$refs.controlBtn.style.display = 'block';
                that.isActive = false;
            }
            that.onValueUpdate();
        },
        onValueUpdate() {
            const that = this;
            that.content.files = that.fileList;
            that.$emit('update', that.content);
            let isCheckOk = false;
            isCheckOk = that.fileList.length > 0;
            that.$emit('updateValidStatus', isCheckOk);
        },
    },
};
</script>
<style lang="scss" scoped>
.head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .name {
        display: flex;
        align-items: center;
        font-family: Noto Sans TC;
        font-weight: 500;
        font-size: 16px;
        color: #5c6466;
    }
}
.list {
    border: 1px solid rgba(196, 196, 196, 0.5);
    box-sizing: border-box;
    border-radius: 4px;
    .title {
        display: flex;
        align-items: center;
        height: 32px;
        background: #e6f1ff;
        font-family: Noto Sans TC;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #333333;
        justify-content: center;
    }
    .dropZone {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        padding: 24px 0;
        &.dropZone-over {
            background: rgba(237, 246, 255, 0.5) !important;
            border: 1px dashed #6e5faf;
        }
        input {
            position: absolute;
            top: 0px;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
        .text {
            font-size: 16px;
            display: flex;
            justify-content: center;
            color: #a7afb2;
            font-weight: 400;
            .select {
                margin-left: 4px;
                margin-right: 4px;
            }
        }
        .plus-wrap {
            margin-top: 16px;
        }
        .image {
            display: flex;
            justify-content: center;
        }
    }
    .files {
        overflow: auto;
        height: 200px;
        .fileRow {
            height: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            &.fiieRow-select {
                background: rgba(241, 239, 247, 0.8);
            }
            .left {
                display: flex;
                flex-direction: row;
                font-family: Open Sans;
                font-size: 14px;
                font-weight: 400;
                margin-left: 16px;
                color: #6e5faf;
                .icon {
                    margin-right: 8px;
                    color: #757575;
                }
            }
            .right {
                font-size: 16px;
                margin-right: 18px;
                cursor: pointer;
                color: #757575;
            }
        }
    }
}
.desc {
    font-family: Noto Sans TC;
    margin-top: 16px;
    .f-alert-info {
        background: #f6f7fb;
        border: 1px solid #4c519c;
        margin-bottom: 20px;
        :deep(svg) {
            fill: #6e5faf;
        }
    }
}
</style>
