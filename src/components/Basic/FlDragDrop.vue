<template>
    <div>
        <draggable
            v-model="listArrData"
            v-bind="dragOptions"
            :component-data="{ tag: 'div', name: 'flip-list', type: 'transition' }"
            @start="onStart"
            @end="onEnd"
            :item-key="'draggableUuid'"
            :handle="handle"
            :disabled="isDisabled"
        >
            <template #item="{ element, index }">
                <div>
                    <slot name="body" :slotprops="element" :index="index"> </slot>
                </div>
            </template>
        </draggable>
    </div>
</template>
<script>
function _uuid() {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}
import draggable from 'vuedraggable';
export default {
    name: 'FlDragDrop',
    components: {
        draggable,
    },
    props: {
        listArr: {
            type: Array,
            default: () => {
                return [];
            },
        },
        handle: {
            type: String,
            default: '',
        },
        itemUnqiueKey: {
            type: String,
            default: '',
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['updateDragList'],
    data() {
        return {
            drag: false,
            listArrData: this.listArr,
            itemKey: '',
            group: '',
        };
    },
    created() {
        this.group = _uuid();
    },
    methods: {
        onEnd: function () {
            this.drag = false;
            this.updateDragList();
        },
        updateDragList: function () {
            this.$emit('updateDragList', this.listArrData);
        },
        onStart: function () {
            this.drag = true;
        },
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: this.group,
                disabled: false,
                ghostClass: 'ghost',
            };
        },
        isNeedAddUuId() {
            let idChangeString = '';
            this.listArr.forEach((item) => {
                if (item.draggableUuid) {
                    idChangeString += 'Y';
                } else {
                    idChangeString += 'N';
                }
            });
            return idChangeString;
        },
    },
    watch: {
        listArrData: {
            immediate: true,
            handler() {
                this.updateDragList();
            },
        },
        listArr: {
            immediate: true,
            handler() {
                this.listArrData = this.listArr;
            },
        },
        isNeedAddUuId: {
            immediate: true,
            handler() {
                if (this.listArr.length > 0) {
                    this.listArr.forEach((item) => {
                        if (!item.draggableUuid) {
                            item['draggableUuid'] = _uuid();
                        }
                    });
                }
            },
        },
    },
};
</script>
<style scoped>
.flip-list-move {
    transition: transform 0s;
}
.no-move {
    transition: transform 0s;
}
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
.list-group {
    min-height: 20px;
}
</style>
