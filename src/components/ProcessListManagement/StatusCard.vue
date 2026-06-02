<template>
    <div class="status-card" :class="{ selected: isSelect }" @click="updateSelected($event)">
        <div class="status-header">
            <div class="status-icon" :class="`status-${statusMap[type]}`">
                <img class="icon_default" :src="`${publicPath}img/status/icon_${statusMap[type]}.svg`" />
                <img class="icon_effect" :src="`${publicPath}img/status/icon_${statusMap[type]}_select.svg`" />
            </div>
            <div class="status-type">
                {{ $t(`status.${statusMap[type]}`) }}
            </div>
        </div>
        <div class="status-footer">
            <span class="status-count" :class="`status-${statusMap[type]}`">
                {{ count }}
            </span>
        </div>
    </div>
</template>
<script>
import statusMap from '../../store/statusMap.js';
export default {
    name: 'StatusCard',
    props: {
        type: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            default: 0,
        },
        selected: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['onSelectUpdate'],
    data() {
        return {
            statusMap: statusMap,
            isSelect: false,
            publicPath: process.env.BASE_URL,
        };
    },
    created() {
        const that = this;
        that.isSelect = that.selected;
    },
    methods: {
        updateSelected(e) {
            const that = this;
            if (!that.isSelect) {
                that.isSelect = true;
                this.$emit('onSelectUpdate', that.type);
            }
        },
    },
    watch: {
        selected(value) {
            const that = this;
            that.isSelect = value;
            console.log(value);
        },
    },
};
</script>
<style lang="scss" scoped>
.status-card {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 120px;
    background: #fff;
    box-shadow: 0px 4px 8px rgba(182, 174, 214, 0.08);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: transform 0.3s;
    &:hover {
        transform: scale(1.02);
    }
    &.selected {
        background: linear-gradient(135deg, rgba(174, 163, 223, 1), rgba(174, 163, 223, 0.65), rgba(174, 163, 223, 0.2));
        .status-header {
            .status-icon {
                &.status-all,
                &.status-init,
                &.status-ready,
                &.status-running,
                &.status-close {
                    border: 1px solid #ccc7e3;
                    background-color: #fff;
                }
                .icon_effect {
                    opacity: 1;
                }
                .icon_default {
                    opacity: 0;
                }
            }
            .status-type {
                color: $purple_primary;
            }
        }
        .status-footer {
            .status-count {
                &.status-all,
                &.status-init,
                &.status-ready,
                &.status-running,
                &.status-close {
                    color: $purple_primary;
                }
            }
        }
    }
    .status-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .status-icon {
            position: relative;
            width: 48px;
            height: 48px;
            border-radius: 24px;
            &.status-all {
                border: 1px solid #dbdbdb;
            }
            &.status-init {
                background-color: #fcf5f0;
            }
            &.status-ready {
                background-color: rgba(253, 248, 239, 0.8);
            }
            &.status-running {
                background-color: #f0f8f9;
            }
            &.status-close {
                background-color: rgba(245, 245, 245, 0.8);
            }
            img {
                margin: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .icon_default {
                opacity: 1;
            }
            .icon_effect {
                opacity: 0;
            }
        }
        .status-type {
            font-size: 18px;
            line-height: 24px;
            color: #5c6466;
        }
    }
    .status-footer {
        margin-left: auto;
        .status-count {
            font-size: 36px;
            line-height: 40px;
            // height: 40px;
            font-weight: 700;
            &.status-all {
                color: #5c6466;
            }
            &.status-init {
                color: #dd9660;
            }
            &.status-ready {
                color: #e3b85b;
            }
            &.status-running {
                color: #67b0c0;
            }
            &.status-close {
                color: #5c6466;
            }
        }
    }
}
</style>
