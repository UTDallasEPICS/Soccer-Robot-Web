<template lang="pug">
div.fixed.w-full.h-full.inset-0.bg-black.bg-opacity-80.flex(style="z-index: 2")
    div.rounded-lg.p-2.bg-white(style="width: 500px; height: 400px; margin: auto;")
        div.w-min.h-min.text-black(style="margin-left: auto;")
            p.cursor-pointer(@click="emitClose") X
        p.w-full.text-center About Us
        p Team Shawarama along with RL^2 presents to you: Soccer Robots! These fun, interactive robots allow you to play soccer from the comforts of your own phone. Using the WASD keys on your keyboard, you can move your robot to the World Cup! 
</template>

<script setup lang="ts">
const emit = defineEmits(['closeAboutUsOverlay'])
const emitClose = () => {
    emit('closeAboutUsOverlay')
}
</script>