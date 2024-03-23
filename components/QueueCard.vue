<template>
<div class="flex flex-no-wrap place-content-evenly">
    <p class="basis-0 grow truncate text-center"> {{ user1 }} </p>
    <p class="w-min"> vs </p>
    <p class="basis-0 grow truncate text-center"> {{ user2 }} </p>
</div>
</template>
    
<script setup lang="ts">
const props = defineProps({
    user1: String,
    user2: String
})
</script>