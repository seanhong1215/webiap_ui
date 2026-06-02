<template>
    <!-- ConditionSetting.vue-->
    <div class="mainPanel">
        <div class="title-panel">
            <fl-routing-back-button :text="$t('router.ConditionSetting')" :needConfirm="haveDoSomething" />
        </div>
        <div class="process-panel">
            <process-panel :processInfo="getSpecMfpPanel" />
        </div>
        <div class="condition-panel">
            <state-panel @updateDoSomething="updateDoSomething" :processInfo="getSpecMfpPanel" />
        </div>
    </div>
</template>
<script>
// basic components
import FlRoutingBackButton from '@/components/Basic/FlRoutingBackButton.vue';
// page components
import ProcessPanel from '../components/Common/ProcessPanel.vue';
import StatePanel from '@/components/ConditionSetting/StatePanel.vue';
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
    components: {
        FlRoutingBackButton,
        ProcessPanel,
        StatePanel,
    },
    data() {
        return {
            haveDoSomething: false,
        };
    },
    methods: {
        getdoImport() {
            if (this.$route.params.doImport) {
                return JSON.parse(this.$route.params.doImport);
            } else {
                return false;
            }
        },
        doImport() {
            console.log(this.getdoImport().pro);
            console.log(this.getdoImport().conds);
        },
        updateDoSomething(val) {
            this.haveDoSomething = val;
        },
    },
    computed: {
        ...mapState('process', ['selectedSpecProId']),
        ...mapGetters('process', ['getSpecMfpPanel']),
    },
    created() {
        const that = this;
        if (this.getdoImport()) {
            this.doImport();
        }
    },
};
</script>
<style scoped>
.mainPanel {
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.title-panel {
    height: 64px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.process-panel {
    margin-top: 4px;
    flex-shrink: 0;
}

.condition-panel {
    width: 100%;
    flex: 1;
    margin-top: 16px;
}
</style>
