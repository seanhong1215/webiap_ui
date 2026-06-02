import { h } from 'vue';
import {
    Alert,
    Button,
    Checkbox,
    DatePicker,
    Dropdown,
    Input,
    Menu,
    Modal,
    Pagination,
    Radio,
    Select,
    Tabs,
} from 'ant-design-vue';
import FPaginations from '@/components/Basic/FPaginations.vue';

const emitValue = (emit, name, event) => {
    const value = event && event.target ? event.target.value : event;
    emit(name, value);
    return value;
};

const withLabel = (className, slots, control) => {
    if (!slots.label) return control;

    return h('div', { class: className }, [h('div', { class: `${className}__label` }, slots.label()), control]);
};

const FButton = {
    name: 'FButton',
    inheritAttrs: false,
    props: {
        type: String,
        variant: String,
        disabled: Boolean,
    },
    setup(props, { attrs, slots }) {
        return () => {
            const buttonType = props.variant === 'primary' || props.type === 'confirm' ? 'primary' : 'default';
            return h(
                Button,
                {
                    ...attrs,
                    type: buttonType,
                    disabled: props.disabled,
                    class: ['f-btn', attrs.class],
                },
                slots
            );
        };
    },
};

const FModal = {
    name: 'FModal',
    inheritAttrs: false,
    props: {
        visible: Boolean,
        title: String,
        size: String,
    },
    emits: ['update:visible', 'ok', 'cancel'],
    setup(props, { attrs, emit, slots }) {
        return () =>
            h(
                Modal,
                {
                    ...attrs,
                    visible: props.visible,
                    title: props.title,
                    width: props.size === 'small' ? 520 : attrs.width,
                    onOk: (event) => {
                        emit('ok', event);
                    },
                    onCancel: (event) => {
                        emit('update:visible', false);
                        emit('cancel', event);
                    },
                    'onUpdate:visible': (value) => emit('update:visible', value),
                },
                slots
            );
    },
};

const FConfirm = {
    name: 'FConfirm',
    inheritAttrs: false,
    props: {
        visible: Boolean,
        title: String,
        okText: String,
        cancelText: String,
        onOk: Function,
        type: String,
    },
    emits: ['update:visible', 'ok', 'cancel'],
    setup(props, { attrs, emit, slots }) {
        const handleOk = async (event) => {
            if (props.onOk) await props.onOk(event);
            emit('ok', event);
            emit('update:visible', false);
        };

        return () =>
            h(
                Modal,
                {
                    ...attrs,
                    visible: props.visible,
                    title: props.title,
                    okText: props.okText,
                    cancelText: props.cancelText,
                    cancelButtonProps: { style: props.type === 'alert' ? { display: 'none' } : undefined },
                    onOk: handleOk,
                    onCancel: (event) => {
                        emit('cancel', event);
                        emit('update:visible', false);
                    },
                    'onUpdate:visible': (value) => emit('update:visible', value),
                },
                {
                    default: () => (slots.content ? slots.content() : slots.default ? slots.default() : null),
                }
            );
    },
};

const FInput = {
    name: 'FInput',
    inheritAttrs: false,
    props: {
        modelValue: [String, Number],
        width: [String, Number],
    },
    emits: ['update:modelValue', 'change', 'pressEnter'],
    setup(props, { attrs, emit, slots }) {
        return () => {
            const control = h(
                Input,
                {
                    ...attrs,
                    value: props.modelValue,
                    style: { ...(attrs.style || {}), width: props.width || undefined },
                    onInput: (event) => emit('update:modelValue', event.target.value),
                    onChange: (event) => emit('change', emitValue(emit, 'update:modelValue', event)),
                    onPressEnter: (event) => emit('pressEnter', event.target.value),
                },
                {
                    prefix: slots.prefix,
                    suffix: slots.suffix,
                }
            );

            return withLabel('f-input-wrap', slots, control);
        };
    },
};

const FTextarea = {
    name: 'FTextarea',
    inheritAttrs: false,
    props: {
        modelValue: String,
        width: [String, Number],
    },
    emits: ['update:modelValue', 'change', 'pressEnter'],
    setup(props, { attrs, emit, slots }) {
        return () => {
            const control = h(Input.TextArea, {
                ...attrs,
                value: props.modelValue,
                style: { ...(attrs.style || {}), width: props.width || undefined },
                onInput: (event) => emit('update:modelValue', event.target.value),
                onChange: (event) => emit('change', emitValue(emit, 'update:modelValue', event)),
                onPressEnter: (event) => emit('pressEnter', event.target.value),
            });

            return withLabel('f-textarea-wrap', slots, control);
        };
    },
};

const FSelect = {
    name: 'FSelect',
    inheritAttrs: false,
    props: {
        value: [String, Number, Array, Object],
    },
    emits: ['update:value', 'change'],
    setup(props, { attrs, emit, slots }) {
        return () =>
            withLabel(
                'f-select-wrap',
                slots,
                h(
                    Select,
                    {
                        ...attrs,
                        value: props.value,
                        onChange: (value, option) => {
                            emit('update:value', value);
                            emit('change', value, option);
                        },
                    },
                    { default: slots.default }
                )
            );
    },
};

const FSearchbar = {
    name: 'FSearchbar',
    inheritAttrs: false,
    props: {
        modelValue: String,
    },
    emits: ['update:modelValue', 'search'],
    setup(props, { attrs, emit }) {
        return () =>
            h(Input.Search, {
                ...attrs,
                value: props.modelValue,
                onInput: (event) => emit('update:modelValue', event.target.value),
                onSearch: (value) => emit('search', value),
            });
    },
};

const FCheckbox = {
    name: 'FCheckbox',
    inheritAttrs: false,
    props: {
        modelValue: Boolean,
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit, slots }) {
        return () =>
            h(
                Checkbox,
                {
                    ...attrs,
                    checked: props.modelValue,
                    onChange: (event) => emit('update:modelValue', event.target.checked),
                },
                slots
            );
    },
};

const FRadio = {
    name: 'FRadio',
    inheritAttrs: false,
    props: {
        modelValue: [String, Number, Boolean],
        value: [String, Number, Boolean],
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit, slots }) {
        return () =>
            h(
                Radio,
                {
                    ...attrs,
                    value: props.value,
                    checked: props.modelValue === props.value,
                    onChange: () => emit('update:modelValue', props.value),
                },
                slots
            );
    },
};

export default {
    install(app) {
        app.component('FAlert', Alert);
        app.component('FButton', FButton);
        app.component('FCheckbox', FCheckbox);
        app.component('FConfirm', FConfirm);
        app.component('FDatePicker', DatePicker);
        app.component('FDropdown', Dropdown);
        app.component('FInput', FInput);
        app.component('FMenu', Menu);
        app.component('FMenuItem', Menu.Item);
        app.component('FModal', FModal);
        app.component('FPagination', Pagination);
        app.component('FPaginations', FPaginations);
        app.component('FRadio', FRadio);
        app.component('FRadioGroup', Radio.Group);
        app.component('FRangePicker', DatePicker.RangePicker);
        app.component('FSearchbar', FSearchbar);
        app.component('FSelect', FSelect);
        app.component('FSelectOption', Select.Option);
        app.component('FTabPane', Tabs.TabPane);
        app.component('FTabs', Tabs);
        app.component('FTextarea', FTextarea);
    },
};
