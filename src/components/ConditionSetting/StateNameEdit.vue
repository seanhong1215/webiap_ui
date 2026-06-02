<template>
    <div class="af-edit-dialog">
        <f-input
            v-model="dataInner.name"
            size="large"
            :placeholder="$t('conditionSetting.placeholder.conditionName')"
            :validateMsg="$t('validator.emptyInput')"
            :validateFn="(newVal) => newVal !== ''"
            :maxlength="itemProps.options.maxInputLength"
            @input="updateLabelInput"
        >
            <template #label>
                <div class="d-flex justify-content-between">
                    <span class="label-msg">
                        {{ itemProps.options.labelMsg }}
                    </span>
                    <span class="label-word">{{ leftsWords }}</span>
                </div>
            </template>
        </f-input>
    </div>
</template>
<script>
import FlLabelInput from '@/components/Basic/FlLabelInput.vue';
export default {
    name: 'AddState',
    components: {
        FlLabelInput,
    },
    props: {
        editData: {
            type: Object,
        },
        modalData: {
            type: Object,
        },
    },
    emits: ['updateValidStatus'],
    data() {
        const that = this;
        return {
            dataInner: that.modalData,
            itemProps: {
                options: {
                    labelMsg: that.$t('conditionSetting.conditionName'),
                    maxInputLength: 30,
                },
            },
        };
    },
    computed: {
        leftsWords() {
            const that = this;
            console.dir(that.dataInner.name.length);
            if (that.itemProps.options.maxInputLength === -1) return '';
            return that.itemProps.options.maxInputLength - that.dataInner.name.length;
        },
    },
    methods: {
        updateLabelInput(val) {
            const that = this;
            that.dataInner.name = val;
            that.checkValidStatus(that.dataInner.name);
            console.log('updateLabelInput', val);
        },
        checkValidStatus(name) {
            const that = this;
            let isCheckOk = false;
            if (name.length > 0 && name.length <= 30) {
                isCheckOk = true;
            }
            that.$emit('updateValidStatus', isCheckOk);
            console.log(name);
        },
    },
    created() {
        const that = this;
        console.log(that.dataInner);
        that.dataInner.name = this.editData.name;
        that.checkValidStatus(that.dataInner.name);
    },
};
</script>
<style scoped>
.af-edit-dialog {
    width: 100%;
    height: 100%;
    background: #ffffff;
}
</style>
