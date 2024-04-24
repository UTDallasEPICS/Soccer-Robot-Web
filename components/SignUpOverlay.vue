<template>
<div class="fixed w-full h-full inset-0 bg-black bg-opacity-80 flex" style="z-index: 2;">
    <div class="w-min h-min rounded-lg p-2 bg-white" style="margin: auto;">
        <div class="w-min h-min text-black" style="margin-left: auto;">
            <p class="cursor-pointer" @click="emitClose">X</p>
        </div>
        <p class="text-black">Sign Up</p>
        <form @submit.prevent="handleSubmit">
            <label class="text-black">Username</label>
            <input class="text-black border-2 border-black" type="text" v-model="username" required>
        </form>
    </div>
</div>

</template>

<script setup lang="ts">
const username = ref("")
const handleSubmit = () => {
    console.log(username.value)
}
const emit = defineEmits(['closeSignUpOverlay'])
const emitClose = () => {
    emit('closeSignUpOverlay')
}
</script>