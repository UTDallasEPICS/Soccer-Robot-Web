<template>
<div class = "flex flex-nowrap shrink-0 space-x-3">
    <div class="utdLogo" style="width:450px">
            <img src="/pages/UTDLogo.svg">
    </div>
    <div class="flex md:flex md:flex-grow flex-row justify-end space-x-3 mr-4 mt-5 mb-2">
        <div class="">
            <button class="hover:text-gray-300 transition font-semibold duration-400 text-white font-bold py-2 px-5 rounded-lg" style="background-color:#154734" @click="openLogIn"> {{ "Log In" }}</button>
        </div>
        <div class=""> 
            <button class="hover:text-gray-300 transition font-semibold duration-400 text-white font-bold py-2 px-5 mr-5 rounded-lg" style="background-color:#e87500" @click="openSignUp"> {{ "Sign Up" }}</button>
        </div>
    </div>
</div>

<div class = "flex flex-nowrap justify-evenly text-white text-2x1 font-bold py-3" style = "background-color: #e87500">
    <div>
        <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openAboutUs">About Us</p>
    </div>
    <div>
        <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openHowToPlay"> How to Play</p>
    </div>
    <div>
        <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openHelp"> Help </p>
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