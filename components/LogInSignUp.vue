<template>
    <div class="flex md:flex md:flex-grow flex-row-reverse space-x-3 mt-5 mr-4 mb-2">
        <div class="">
            <button
                class="hover:text-gray-300 transition font-semibold duration-400 text-white font-bold py-2 px-5 rounded-lg"
                style="background-color:#154734" @click="openLogIn">Log In</button>
        </div>
    </div>
    <SignUpOverlay v-if="showSignUp" @closeSignUpOverlay="closeSignUp"></SignUpOverlay>
    <LogInOverlay v-if="showLogIn" @closeLogInOverlay="closeLogIn"></LogInOverlay>
</template>

<script setup lang="ts">
const showSignUp = ref(false)
const showLogIn = ref(false)
const openSignUp = () => { showSignUp.value = true }
const closeSignUp = () => { showSignUp.value = false }
const openLogIn = () => { showLogIn.value = true }
const closeLogIn = () => { showLogIn.value = false }
</script>

<style></style>