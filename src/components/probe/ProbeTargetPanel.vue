<script setup lang="ts"></script>
<template>
    <div
        class="cursor-pointer rounded-lg border border-gray-200 bg-white/90 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-101 hover:drop-shadow-xl"
    >
        <div class="flex items-center justify-between gap-10 md:gap-20 lg:gap-40">
            <div class="flex-1">
                <div class="flex items-center space-x-3">
                    <div
                        class="flex items-center space-x-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600"
                    >
                        <span class="capitalize">w</span>
                    </div>
                    <h3 class="font-semibold">Reykjavik Node</h3>
                </div>
                <p class="mt-1 text-sm text-gray-600">冰岛雷克雅未克主节点</p>
            </div>
            <div class="flex space-x-8 text-sm">
                <div class="text-center">
                    <div class="text-gray-500">CPU</div>
                    <div class="font-semibold text-green-600">54.7%</div>
                </div>
                <div class="text-center">
                    <div class="text-gray-500">内存</div>
                    <div class="font-semibold text-green-600">59.0%</div>
                </div>
                <div class="text-center">
                    <div class="text-gray-500">负载</div>
                    <div class="font-semibold text-yellow-600">1.5</div>
                </div>
                <div class="ml-4 text-center md:ml-10">
                    <div class="text-gray-500">最后更新</div>
                    <div class="text-xs">2025/8/5 23:15:09</div>
                </div>
            </div>
        </div>
    </div>
</template>
