<template lang="pug">
div.fixed.w-full.h-full.inset-0.bg-black.bg-opacity-80.flex(style="z-index: 2")
    div.w-min.h-min.rounded-lg.p-2.bg-white.text-white(style="margin: auto;")
        div.w-min.h-min.text-black(style="margin-left: auto;")
            p.cursor-pointer(@click="emitClose") X
        form(@submit.prevent="handleSubmit")
            label.text-black Username
            input.text-black.border-2.border-black(type="text" v-model="username" required)
</template>

<script setup lang="ts">
const username = ref("")
const handleSubmit = () => {
    console.log(username.value)
}
const emit = defineEmits(['close'])
const emitClose = () => {
    emit('close')
}
</script>