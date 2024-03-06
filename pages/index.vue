<template>
<div class = "flex flex-nowrap shrink-0 space-x-3">
    <div id="utdLogo">
            <img src="/pages/UTDLogo.svg" style="width:53%">
    </div>
    <div class="width" style="width:120px; background-color:#154734">
        <button @click="openLogIn" style="background-color:#154734; color:white"> {{ "Log In" }}</button>
    </div>
    <div> 
        <button @click="openSignUp" style="background-color: #e87500"> {{ "Sign Up" }}</button>

    </div>
        </div>
<div class = "flex flex-nowrap justify-evenly text-white text-2x1 font-bold" style = "background-color: #e87500">
    <div>
        <p class = cursor-pointer @click="openAboutUs">About Us</p>
    </div>
    <div>
        <p class = cursor-pointer @click="openHowToPlay"> How to Play</p>
    </div>
    <div>
        <p class = cursor-pointer @click="openHelp"> Help </p>
    </div>
</div>
<SignUpOverlay v-if="showSignUp" @closeSignUpOverlay = "closeSignUp"></SignUpOverlay>
<LogInOverlay v-if="showLogIn" @closeLogInOverlay = "closeLogIn"></LogInOverlay>
<AboutUsOverlay v-if="showAboutUs" @closeAboutUsOverlay = "closeAboutUs"></AboutUsOverlay>
<HowToPlayOverlay v-if="showHowToPlay" @closeHowToPlayOverlay = "closeHowToPlay"></HowToPlayOverlay>
<HelpOverlay v-if="showHelp" @closeHelpOverlay = "closeHelp"></HelpOverlay>
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