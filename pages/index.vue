<template lang="pug">
div.flex.flex-nowrap
    div.flex-auto.shrink-0
        p LogoPlaceholder
    div.flex.flex-nowrap.shrink-0.space-x-3
        Button(style="background-color: #154734") {{ "Log In" }}
        Button(@click="openSignUp" style="background-color: #e87500") {{ "Sign Up" }}
SignUpOverlay(v-if="showSignUp" @close="closeSignUp")
</template>

<script setup lang="ts">
const showSignUp = ref(false)
const openSignUp = () => { showSignUp.value = true }
const closeSignUp = () => { showSignUp.value = false }
</script>