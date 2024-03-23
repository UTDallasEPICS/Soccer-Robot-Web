<template lang="pug">
div.flex.flex-nowrap
    div.flex-auto.shrink-0
        p LogoPlaceholder
    div.flex.flex-nowrap.shrink-0.space-x-3
        Button(@click="openLogIn" style="background-color: #154734") {{ "Log In" }}
        Button(@click="openSignUp" style="background-color: #e87500") {{ "Sign Up" }}
div.flex.flex-nowrap.justify-evenly.text-white.text-2xl.font-bold(style="background-color: #e87500")
    div
        p.cursor-pointer(@click="openAboutUs") About Us
    div
        p.cursor-pointer(@click="openHowToPlay") How to Play
    div
        p.cursor-pointer(@click="openHelp") Help
SignUpOverlay(v-if="showSignUp" @closeSignUpOverlay="closeSignUp")
LogInOverlay(v-if="showLogIn" @closeLogInOverlay="closeLogIn")
AboutUsOverlay(v-if="showAboutUs" @closeAboutUsOverlay="closeAboutUs")
HowToPlayOverlay(v-if="showHowToPlay" @closeHowToPlayOverlay="closeHowToPlay")
HelpOverlay(v-if="showHelp" @closeHelpOverlay="closeHelp")
<QueueContainer/>
</template>

<script setup lang="ts">
const showSignUp = ref(false)
const showLogIn = ref(false)
const showAboutUs = ref(false)
const showHowToPlay = ref(false)
const showHelp = ref(false)
const openSignUp = () => { showSignUp.value = true }
const closeSignUp = () => { showSignUp.value = false }
const openLogIn = () => { showLogIn.value = true }
const closeLogIn = () => { showLogIn.value = false }
const openAboutUs = () => { showAboutUs.value = true }
const closeAboutUs = () => { showAboutUs.value = false }
const openHowToPlay = () => { showHowToPlay.value = true }
const closeHowToPlay = () => { showHowToPlay.value = false }
const openHelp = () => { showHelp.value = true }
const closeHelp = () => { showHelp.value = false }
</script>