<template>
    <div class="flex items-center space-x-2 mt-4 w-full justify-start">
        <label :for="id" class="flex-shrink-0 w-20 text-right">{{ label }}</label>
        <div class="flex-grow">
            <InputText
                v-if="!loading"
                :id="id"
                :value="modelValue"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                class="h-10 w-full"
                :placeholder="placeholder"
            />
            <Skeleton v-else height="2.5rem"></Skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'

const {
    id,
    label,
    modelValue,
    placeholder = '',
    loading = false
} = defineProps<{
    id: string
    label: string
    modelValue: string
    placeholder?: string
    loading: boolean
}>()

defineEmits(['update:modelValue'])
</script>
