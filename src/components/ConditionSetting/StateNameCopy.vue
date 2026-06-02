<template>
    <div class="af-edit-dialog">
        <f-select size="large" style="width: 100%" :placeholder="$t('conditionSetting.placeholder.chooseConditionName')" @change="updateLabelInput">
            <template #label>
                <span class="label-msg">
                    {{ itemProps.options.labelMsg }}
                </span>
            </template>
            <f-select-option v-for="item in states" :key="item.id" :value="item.id">{{ item.name }}</f-select-option>
        </f-select>
    </div>
</template>
<script>
import FlLabelInput from '@/components/Basic/FlLabelInput.vue';
import cloneDeep from 'lodash/fp/cloneDeep';
export default {
    name: 'CopyState',
    components: {
        FlLabelInput,
    },
    props: {
        states: {
            type: Object,
        },
        modalData: {
            type: Object,
        },
    },
    data() {
        return {
            dataInner: this.modalData,
            itemProps: {
                options: {
                    labelMsg: this.$t('conditionSetting.chooseConditionName'),
                },
            },
        };
    },
    methods: {
        updateLabelInput(val, option) {
            this.dataInner.state = cloneDeep(this.states.find((x) => x.id == option.key));
            console.log(val);
        },
    },
    created() {
        this.dataInner.state = {};
    },
};
</script>
<style scoped>
.af-edit-dialog {
    width: 100%;
    height: 200px;
    background: #ffffff;
}
</style>
