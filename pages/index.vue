<template>
    <TopNavBar></TopNavBar>

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


<AboutUsOverlay v-if="showAboutUs" @closeAboutUsOverlay = "closeAboutUs"></AboutUsOverlay>
<HowToPlayOverlay v-if="showHowToPlay" @closeHowToPlayOverlay = "closeHowToPlay"></HowToPlayOverlay>
<HelpOverlay v-if="showHelp" @closeHelpOverlay = "closeHelp"></HelpOverlay>
</template>

<script setup lang="ts">
const showAboutUs = ref(false)
const showHowToPlay = ref(false)
const showHelp = ref(false)
const openAboutUs = () => { showAboutUs.value = true }
const closeAboutUs = () => { showAboutUs.value = false }
const openHowToPlay = () => { showHowToPlay.value = true }
const closeHowToPlay = () => { showHowToPlay.value = false }
const openHelp = () => { showHelp.value = true }
const closeHelp = () => { showHelp.value = false }
</script>