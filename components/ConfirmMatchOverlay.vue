<template>
<div class="fixed w-full h-full inset-0 bg-black bg-opacity-80 flex" style="z-index: 2;">
    <div class="w-min h-min rounded-lg p-2 bg-white" style="margin: auto;">
        <button @click="$emit('confirm-response', true)" class = "border-4 rounded-2xl border-black content-center" style="font-size: 24px; font-weight: bold; width: 100%;">
            ACCEPT!
        </button>
        <button @click="$emit('confirm-response', false)" class = "border-4 rounded-2xl border-black content-center" style="font-size: 24px; font-weight: bold; width: 100%;">
            DECLINE!
        </button>
    </div>
</div>

</template>

<script setup lang="ts">
const emit = defineEmits(['confirm-response'])
</script>