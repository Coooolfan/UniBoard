<template>
    <div class="flex items-center space-x-2 mt-4 w-full justify-start">
        <span :for="id" class="shrink-0 w-20 h-10 leading-10 text text-right">{{ label }}</span>
        <div class="grow">
            <Checkbox
                binary
                v-if="!loading"
                :id="id"
                :modelValue="modelValue"
                @update:modelValue="onInput"
                class="h-10 w-10"
            />
            <Skeleton v-else height="1.25rem" width="1.25rem"></Skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import Skeleton from 'primevue/skeleton'

const {
    id,
    label,
    modelValue,
    placeholder = false,
    loading = false
} = defineProps<{
    id: string
    label: string
    modelValue: boolean
    placeholder?: boolean
    loading: boolean
}>()

const emit = defineEmits(['update:modelValue'])

function onInput(value: boolean) {
    emit('update:modelValue', value)
}
</script>
