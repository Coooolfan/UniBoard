<script setup lang="ts"></script>
<template>
    <div
        class="flex h-12 w-full items-center justify-between gap-10 rounded-lg bg-white pr-6 pl-4 drop-shadow-md transition-all duration-300 hover:scale-101 hover:drop-shadow-xl"
    >
        <div class="text-sm font-bold">Target</div>
        <div class="flex gap-2">
            <div v-for="i in 30" :key="i" class="h-6 w-2 flex-1 rounded-lg bg-green-500"></div>
        </div>
    </div>
</template>
