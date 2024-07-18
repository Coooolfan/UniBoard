<template>
    <div class="flex items-center space-x-2 mt-4 w-full justify-start">
        <label :for="id" class="flex-shrink-0 w-20 text-right">{{ label }}</label>
        <div class="flex-grow">
            <InputText
                v-if="!loading"
                :id="id"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                class="h-10 w-full"
                :placeholder="placeholder"
            />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
// thanks to Claude-3.5-Sonnet
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'

defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    modelValue: {
        type: String,
        default: undefined,
        required: true
    },
    placeholder: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        required: true,
        default: true
    }
})

defineEmits(['update:modelValue'])
</script>
